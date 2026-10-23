import { afterEach, expect, it, vi } from 'vitest';
import api from '../../../pages/api/eventos/[id]';
import { obterUsuario } from '../../autenticacao/servidor/sessao';
import { permitirTentativa } from '../../autenticacao/servidor/repositorio';
import { atualizarEvento, eventoDoAutor } from '../servidor/repositorioEventos';
import { ObjectId } from 'mongodb';

vi.mock('../../autenticacao/servidor/sessao', () => ({ obterUsuario: vi.fn() }));
vi.mock('../../autenticacao/servidor/repositorio', () => ({ permitirTentativa: vi.fn() }));
vi.mock('../servidor/repositorioEventos', () => ({ atualizarEvento: vi.fn(), eventoDoAutor: vi.fn() }));
afterEach(() => { vi.resetAllMocks(); vi.unstubAllGlobals(); });

const id = '670000000000000000013001';
const autorId = '670000000000000000001001';
const dados = { nome: 'Encontro atualizado', descricao: 'Descrição atualizada.', data: '2099-10-26', horario: '10:30', local: 'Novo local', endereco: 'Novo endereço, 123' };
const documento = { _id: new ObjectId(id), tipo: 'EVENTO', autorId, titulo: dados.nome, texto: dados.descricao, inicio: '2099-10-26T13:30:00.000Z', localNome: dados.local, endereco: dados.endereco, totalParticipantes: 2, participantes: ['privado'], comentarios: ['privado'] };
function requisicao(body = dados, method = 'PUT') {
  return { method, query: { id }, body, headers: { host: 'localhost:3000', origin: 'http://localhost:3000', 'content-type': 'application/json' } };
}
function resposta() {
  return { codigo: 200, corpo: null, headers: {}, setHeader(nome, valor) { this.headers[nome] = valor; }, status(codigo) { this.codigo = codigo; return this; }, json(corpo) { this.corpo = corpo; return this; } };
}

it('exige login para editar um evento', async () => {
  obterUsuario.mockResolvedValue(null);
  const res = { codigo: 200, setHeader() {}, status(codigo) { this.codigo = codigo; return this; }, json() { return this; } };
  await api({ method: 'PUT', query: { id: '670000000000000000013001' }, body: {}, headers: { host: 'localhost:3000', origin: 'http://localhost:3000', 'content-type': 'application/json' } }, res);
  expect(res.codigo).toBe(401);
});

it('atualiza usando a autoria da sessão e retorna somente os dados públicos', async () => {
  obterUsuario.mockResolvedValue({ id: autorId });
  permitirTentativa.mockResolvedValue(true);
  atualizarEvento.mockResolvedValue(documento);
  const res = resposta();
  await api(requisicao(), res);
  expect(res.codigo).toBe(200);
  expect(atualizarEvento).toHaveBeenCalledWith(id, autorId, dados, '2099-10-26T13:30:00.000Z');
  expect(res.corpo.evento).toMatchObject({ id, nome: dados.nome, horario: '10:30', podeEditar: true, participantes: 2 });
  expect(res.corpo.evento).not.toHaveProperty('autorId');
  expect(res.corpo.evento).not.toHaveProperty('comentarios');
});

it('não aceita evento ausente ou pertencente a outro autor', async () => {
  obterUsuario.mockResolvedValue({ id: autorId });
  permitirTentativa.mockResolvedValue(true);
  atualizarEvento.mockResolvedValue(null);
  const res = resposta();
  await api(requisicao(), res);
  expect(res.codigo).toBe(404);
});

it('rejeita campos de autoria, operadores e datas passadas antes de atualizar', async () => {
  obterUsuario.mockResolvedValue({ id: autorId });
  for (const body of [{ ...dados, autorId: 'outro' }, { ...dados, participantes: [] }, { $set: dados }, { ...dados, data: '2020-01-01' }]) {
    const res = resposta();
    await api(requisicao(body), res);
    expect(res.codigo).toBe(400);
  }
  expect(atualizarEvento).not.toHaveBeenCalled();
});

it('bloqueia origem externa e identificador inválido antes de gravar', async () => {
  const externa = requisicao();
  externa.headers.origin = 'https://origem-externa.example';
  const res = resposta();
  await api(externa, res);
  expect(res.codigo).toBe(403);
  const invalida = requisicao();
  invalida.query.id = '../usuarios';
  const resId = resposta();
  await api(invalida, resId);
  expect(resId.codigo).toBe(400);
  expect(obterUsuario).not.toHaveBeenCalled();
  expect(atualizarEvento).not.toHaveBeenCalled();
});

it('limita alterações e não expõe mensagens do banco', async () => {
  obterUsuario.mockResolvedValue({ id: autorId });
  permitirTentativa.mockResolvedValue(false);
  const limitada = resposta();
  await api(requisicao(), limitada);
  expect(limitada.codigo).toBe(429);
  expect(atualizarEvento).not.toHaveBeenCalled();
  permitirTentativa.mockResolvedValue(true);
  atualizarEvento.mockRejectedValue(new Error('credencial secreta'));
  const falha = resposta();
  await api(requisicao(), falha);
  expect(falha.codigo).toBe(503);
  expect(JSON.stringify(falha.corpo)).not.toContain('secreta');
});

it('informa permissão de edição somente para o autor, sem expor seu identificador', async () => {
  const publico = { ...documento, _id: { $oid: id } };
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 200, ok: true, json: async () => [publico] }));
  for (const dono of [false, true]) {
    obterUsuario.mockResolvedValue({ id: autorId });
    eventoDoAutor.mockResolvedValue(dono ? { _id: id } : null);
    const res = resposta();
    await api(requisicao(undefined, 'GET'), res);
    expect(res.codigo).toBe(200);
    expect(res.corpo.podeEditar).toBe(dono);
    expect(res.corpo).not.toHaveProperty('autorId');
  }
  eventoDoAutor.mockClear();
  obterUsuario.mockResolvedValue(null);
  const anonima = resposta();
  await api(requisicao(undefined, 'GET'), anonima);
  expect(anonima.corpo.podeEditar).toBe(false);
  expect(eventoDoAutor).not.toHaveBeenCalled();
});
