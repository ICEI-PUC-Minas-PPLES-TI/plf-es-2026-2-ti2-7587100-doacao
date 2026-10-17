import { expect, it } from 'vitest';
import { validarCadastro, lerCadastros, salvarCadastro, editarCadastro, excluirCadastro } from './cadastro.js';

const valido = { nome: ' Campanha ', descricao: '', data: '2099-10-26', horario: '09:00', local: ' BH ' };
it('exclui somente o evento escolhido e rejeita um id inexistente', () => {
  let valor = null;
  const storage = { getItem: () => valor, setItem: (_, dado) => { valor = dado; } };
  const primeiro = salvarCadastro(storage, valido);
  const segundo = salvarCadastro(storage, { ...valido, nome: 'Outro evento' });
  excluirCadastro(storage, primeiro.id);
  expect(lerCadastros(storage)).toEqual([segundo]);
  expect(() => excluirCadastro(storage, 'inexistente')).toThrow('Evento não encontrado');
  expect(lerCadastros(storage)).toEqual([segundo]);
});
it('mantém o evento quando o armazenamento falha na exclusão', () => {
  let valor = null;
  const storage = { getItem: () => valor, setItem: (_, dado) => { valor = dado; } };
  const evento = salvarCadastro(storage, valido);
  storage.setItem = () => { throw new Error('Armazenamento indisponível'); };
  expect(() => excluirCadastro(storage, evento.id)).toThrow('Armazenamento indisponível');
  expect(lerCadastros(storage)).toEqual([evento]);
});
it('edita sem duplicar, preservando o id e os participantes', () => {
  let valor = null;
  const storage = { getItem: () => valor, setItem: (_, dado) => { valor = dado; } };
  const primeiro = salvarCadastro(storage, valido);
  salvarCadastro(storage, { ...valido, nome: 'Outro evento' });
  const atualizado = editarCadastro(storage, primeiro.id, { ...valido, nome: ' Nome atualizado ', participantes: 100 });
  expect(atualizado.nome).toBe('Nome atualizado');
  expect(atualizado.id).toBe(primeiro.id);
  expect(atualizado.participantes).toBe(0);
  expect(lerCadastros(storage)).toHaveLength(2);
  expect(lerCadastros(storage)[1].nome).toBe('Outro evento');
});
it('impede editar evento inexistente ou salvar dados inválidos', () => {
  let valor = null;
  const storage = { getItem: () => valor, setItem: (_, dado) => { valor = dado; } };
  const evento = salvarCadastro(storage, valido);
  const antes = valor;
  expect(() => editarCadastro(storage, 'inexistente', valido)).toThrow();
  expect(() => editarCadastro(storage, evento.id, { ...valido, nome: '' })).toThrow();
  expect(valor).toBe(antes);
});
it('rejeita campos vazios, datas inexistentes e horários inválidos', () => {
  expect(validarCadastro({ ...valido, nome: ' ', data: '2099-02-30', horario: '25:00' })).toMatchObject({ nome: expect.any(String), data: expect.any(String), horario: expect.any(String) });
});
it('persiste mais de um cadastro sem perder os anteriores', () => {
  let valor = null;
  const storage = { getItem: () => valor, setItem: (_, dado) => { valor = dado; } };
  salvarCadastro(storage, valido);
  salvarCadastro(storage, { ...valido, nome: 'Outra campanha' });
  expect(lerCadastros(storage)).toHaveLength(2);
  expect(lerCadastros(storage)[0].nome).toBe('Campanha');
  expect(new Set(lerCadastros(storage).map(e => e.id)).size).toBe(2);
});
it('preserva dados corrompidos e comunica a falha ao salvar', () => {
  const storage = { getItem: () => 'invalido', setItem: () => { throw Error('não deve sobrescrever'); } };
  expect(() => salvarCadastro(storage, valido)).toThrow();
});
