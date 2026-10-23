import { afterEach, expect, it, vi } from 'vitest';
import { consultarEventos, apresentarEvento } from '../servidor/eventos';
import listar from '../../../pages/api/eventos/index';
import detalhe from '../../../pages/api/eventos/[id]';

afterEach(() => vi.unstubAllGlobals());

it('retorna somente os dados públicos e converte data e participantes', () => {
  const evento = apresentarEvento({ _id: { $oid: '670000000000000000013001' }, tipo: 'EVENTO', titulo: 'Encontro', texto: 'Descrição', inicio: { $date: '2099-10-26T12:00:00Z' }, localNome: 'Centro', endereco: 'Rua A', totalParticipantes: 3, autorId: 'privado', comentarios: ['privado'] });
  expect(evento).toMatchObject({ nome: 'Encontro', data: '2099-10-26', horario: '09:00', participantes: 3 });
  expect(evento).not.toHaveProperty('autorId');
  expect(evento).not.toHaveProperty('comentarios');
  expect(apresentarEvento({ tipo: 'POST' })).toBeNull();
});

it('consulta RESTHeart com filtro fixo e sem credenciais do cliente', async () => {
  const fetchTeste = vi.fn().mockResolvedValue({ status: 200, ok: true, json: async () => [] });
  vi.stubGlobal('fetch', fetchTeste);
  expect(await consultarEventos(1)).toEqual([]);
  const url = new URL(fetchTeste.mock.calls[0][0]);
  expect(JSON.parse(url.searchParams.get('filter'))).toEqual({ tipo: 'EVENTO' });
  expect(url.pathname).toBe('/publicacoes');
});

it('trata coleção ausente como vazia e falha de conexão como erro', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 404, ok: false }));
  expect(await consultarEventos(1)).toEqual([]);
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('credencial secreta')));
  const resposta = criarResposta();
  await listar({ method: 'GET', query: {} }, resposta);
  expect(resposta.codigo).toBe(503);
  expect(JSON.stringify(resposta.corpo)).not.toContain('secreta');
});

function criarResposta() {
  return { codigo: 200, corpo: null, headers: {}, setHeader(nome, valor) { this.headers[nome] = valor; }, status(codigo) { this.codigo = codigo; return this; }, json(corpo) { this.corpo = corpo; return this; } };
}

it('bloqueia gravação e filtros ou ids enviados fora do contrato', async () => {
  const fetchTeste = vi.fn();
  vi.stubGlobal('fetch', fetchTeste);
  for (const method of ['PUT', 'PATCH', 'DELETE']) {
    const resposta = criarResposta();
    await listar({ method, query: {} }, resposta);
    expect(resposta.codigo).toBe(405);
    if (method === 'PATCH') {
      const respostaDetalhe = criarResposta();
      await detalhe({ method, query: { id: '670000000000000000013001' } }, respostaDetalhe);
      expect(respostaDetalhe.codigo).toBe(405);
    }
  }
  const respostaPostDetalhe = criarResposta();
  await detalhe({ method: 'POST', query: { id: '670000000000000000013001' } }, respostaPostDetalhe);
  expect(respostaPostDetalhe.codigo).toBe(405);
  const resposta = criarResposta();
  await listar({ method: 'GET', query: { filter: '{}' } }, resposta);
  expect(resposta.codigo).toBe(400);
  const respostaId = criarResposta();
  await detalhe({ method: 'GET', query: { id: '../usuarios' } }, respostaId);
  expect(respostaId.codigo).toBe(400);
  expect(fetchTeste).not.toHaveBeenCalled();
});
