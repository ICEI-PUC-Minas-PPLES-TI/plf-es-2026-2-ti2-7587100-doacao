import { afterEach, expect, it, vi } from 'vitest';
import api from '../../../pages/api/eventos/[id]';
import { obterUsuario } from '../../autenticacao/servidor/sessao';
import { permitirTentativa } from '../../autenticacao/servidor/repositorio';
import { removerEvento } from '../servidor/repositorioEventos';

vi.mock('../../autenticacao/servidor/sessao', () => ({ obterUsuario: vi.fn() }));
vi.mock('../../autenticacao/servidor/repositorio', () => ({ permitirTentativa: vi.fn() }));
vi.mock('../servidor/repositorioEventos', () => ({ removerEvento: vi.fn() }));
afterEach(() => vi.resetAllMocks());

const id = '670000000000000000013001';
const autorId = '670000000000000000001001';
function requisicao(body = { confirmar: true }) {
  return { method: 'DELETE', query: { id }, body, headers: { host: 'localhost:3000', origin: 'http://localhost:3000', 'content-type': 'application/json' } };
}
function resposta() {
  return { codigo: 200, corpo: null, headers: {}, setHeader(nome, valor) { this.headers[nome] = valor; }, status(codigo) { this.codigo = codigo; return this; }, json(corpo) { this.corpo = corpo; return this; } };
}

it('exige login para excluir um evento', async () => {
  obterUsuario.mockResolvedValue(null);
  const res = { codigo: 200, setHeader() {}, status(codigo) { this.codigo = codigo; return this; }, json() { return this; } };
  await api({ method: 'DELETE', query: { id: '670000000000000000013001' }, body: { confirmar: true }, headers: { host: 'localhost:3000', origin: 'http://localhost:3000', 'content-type': 'application/json' } }, res);
  expect(res.codigo).toBe(401);
});

it('exclui somente com o autor autenticado e confirmação explícita', async () => {
  obterUsuario.mockResolvedValue({ id: autorId });
  permitirTentativa.mockResolvedValue(true);
  removerEvento.mockResolvedValue(true);
  const res = resposta();
  await api(requisicao(), res);
  expect(res.codigo).toBe(200);
  expect(removerEvento).toHaveBeenCalledWith(id, autorId);
  expect(res.corpo.mensagem).toContain('excluído');
});

it('recusa evento ausente ou de outro autor', async () => {
  obterUsuario.mockResolvedValue({ id: autorId });
  permitirTentativa.mockResolvedValue(true);
  removerEvento.mockResolvedValue(false);
  const res = resposta();
  await api(requisicao(), res);
  expect(res.codigo).toBe(404);
});

it('não exclui sem confirmação nem aceita autoria ou filtros enviados no corpo', async () => {
  obterUsuario.mockResolvedValue({ id: autorId });
  for (const body of [{}, { confirmar: false }, { confirmar: 'true' }, { confirmar: true, autorId: 'outro' }, { confirmar: true, filter: {} }]) {
    const res = resposta();
    await api(requisicao(body), res);
    expect(res.codigo).toBe(400);
  }
  expect(removerEvento).not.toHaveBeenCalled();
});

it('bloqueia origem externa e identificadores inválidos sem excluir', async () => {
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
  expect(removerEvento).not.toHaveBeenCalled();
});

it('limita tentativas e esconde erros internos do banco', async () => {
  obterUsuario.mockResolvedValue({ id: autorId });
  permitirTentativa.mockResolvedValue(false);
  const limitada = resposta();
  await api(requisicao(), limitada);
  expect(limitada.codigo).toBe(429);
  expect(removerEvento).not.toHaveBeenCalled();
  permitirTentativa.mockResolvedValue(true);
  removerEvento.mockRejectedValue(new Error('credencial secreta'));
  const falha = resposta();
  await api(requisicao(), falha);
  expect(falha.codigo).toBe(503);
  expect(JSON.stringify(falha.corpo)).not.toContain('secreta');
});
