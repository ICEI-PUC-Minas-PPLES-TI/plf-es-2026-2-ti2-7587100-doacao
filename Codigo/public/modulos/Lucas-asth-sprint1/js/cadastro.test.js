import { expect, it } from 'vitest';
import { validarCadastro, lerCadastros, salvarCadastro } from './cadastro.js';

const valido = { nome: ' Campanha ', descricao: '', data: '2099-10-26', horario: '09:00', local: ' BH ' };
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
