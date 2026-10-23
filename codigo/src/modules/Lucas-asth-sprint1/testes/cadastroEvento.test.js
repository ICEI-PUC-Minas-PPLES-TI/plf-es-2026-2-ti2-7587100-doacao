import { afterEach, expect, it, vi } from 'vitest';
import api from '../../../pages/api/eventos/index';
import { obterUsuario } from '../../autenticacao/servidor/sessao';
import { permitirTentativa } from '../../autenticacao/servidor/repositorio';
import { inserirEvento } from '../servidor/repositorioEventos';
import { validarEvento } from '../validarEvento';

vi.mock('../../autenticacao/servidor/sessao', () => ({ obterUsuario: vi.fn() }));
vi.mock('../../autenticacao/servidor/repositorio', () => ({ permitirTentativa: vi.fn() }));
vi.mock('../servidor/repositorioEventos', () => ({ inserirEvento: vi.fn() }));
afterEach(() => vi.resetAllMocks());

const dados = { nome: 'Encontro de doadores', descricao: 'Conversa com a comunidade.', data: '2099-10-26', horario: '09:00', local: 'Centro comunitário', endereco: 'Rua de teste, 123' };
function requisicao(body = dados) {
  return { method: 'POST', query: {}, body, headers: { origin: 'http://localhost:3000', host: 'localhost:3000', 'content-type': 'application/json' } };
}

function resposta() {
  return { codigo: 200, corpo: null, headers: {}, setHeader(nome, valor) { this.headers[nome] = valor; }, status(codigo) { this.codigo = codigo; return this; }, json(corpo) { this.corpo = corpo; return this; } };
}

it('exige uma sessão válida para cadastrar um evento', async () => {
  obterUsuario.mockResolvedValue(null);
  const res = resposta();
  await api({ method: 'POST', query: {}, body: {}, headers: { origin: 'http://localhost:3000', host: 'localhost:3000', 'content-type': 'application/json' } }, res);
  expect(res.codigo).toBe(401);
  expect(res.corpo.mensagem).toContain('Entre');
  expect(inserirEvento).not.toHaveBeenCalled();
});

it('valida datas reais, horário futuro, tipos e limites dos campos', () => {
  expect(validarEvento(dados).inicio).toBe('2099-10-26T12:00:00.000Z');
  expect(validarEvento({ ...dados, data: '2099-02-30' }).erros).toHaveProperty('data');
  expect(validarEvento({ ...dados, horario: '25:90' }).erros).toHaveProperty('horario');
  expect(validarEvento({ ...dados, data: '2020-01-01' }).erros).toHaveProperty('data');
  expect(validarEvento({ ...dados, nome: { $ne: null }, descricao: 'x'.repeat(4001) }).erros).toMatchObject({ nome: expect.any(String), descricao: expect.any(String) });
});

it('grava o autor da sessão, converte o horário e devolve somente dados públicos', async () => {
  obterUsuario.mockResolvedValue({ id: '670000000000000000001001' });
  permitirTentativa.mockResolvedValue(true);
  inserirEvento.mockImplementation(async (valores, autorId, inicio) => ({ _id: '670000000000000000013001', tipo: 'EVENTO', titulo: valores.nome, texto: valores.descricao, localNome: valores.local, endereco: valores.endereco, autorId, inicio, totalParticipantes: 0 }));
  const res = resposta();
  await api(requisicao(), res);
  expect(res.codigo).toBe(201);
  expect(inserirEvento).toHaveBeenCalledWith(dados, '670000000000000000001001', '2099-10-26T12:00:00.000Z');
  expect(res.corpo.evento).toMatchObject({ nome: dados.nome, data: dados.data, horario: dados.horario, participantes: 0 });
  expect(res.corpo.evento).not.toHaveProperty('autorId');
});

it('rejeita autor, tipo ou participantes enviados pelo navegador', async () => {
  obterUsuario.mockResolvedValue({ id: '670000000000000000001001' });
  for (const campo of ['autorId', 'tipo', 'participantes', 'totalParticipantes']) {
    const res = resposta();
    await api(requisicao({ ...dados, [campo]: 'adulterado' }), res);
    expect(res.codigo).toBe(400);
  }
  expect(inserirEvento).not.toHaveBeenCalled();
});

it('bloqueia origem externa antes de consultar a sessão', async () => {
  const req = requisicao();
  req.headers.origin = 'https://origem-externa.example';
  const res = resposta();
  await api(req, res);
  expect(res.codigo).toBe(403);
  expect(obterUsuario).not.toHaveBeenCalled();
});

it('não grava campos inválidos nem tentativas além do limite', async () => {
  obterUsuario.mockResolvedValue({ id: '670000000000000000001001' });
  const invalida = resposta();
  await api(requisicao({ ...dados, nome: '' }), invalida);
  expect(invalida.codigo).toBe(400);
  expect(invalida.corpo.erros).toHaveProperty('nome');
  permitirTentativa.mockResolvedValue(false);
  const limitada = resposta();
  await api(requisicao(), limitada);
  expect(limitada.codigo).toBe(429);
  expect(inserirEvento).not.toHaveBeenCalled();
});

it('não revela detalhes de uma falha no banco', async () => {
  obterUsuario.mockResolvedValue({ id: '670000000000000000001001' });
  permitirTentativa.mockResolvedValue(true);
  inserirEvento.mockRejectedValue(new Error('credencial secreta'));
  const res = resposta();
  await api(requisicao(), res);
  expect(res.codigo).toBe(503);
  expect(JSON.stringify(res.corpo)).not.toContain('secreta');
});
