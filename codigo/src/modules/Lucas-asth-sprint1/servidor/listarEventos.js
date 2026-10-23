import { consultarEventos } from './eventos';
import cadastrarEvento from './cadastrarEvento';

export default async function listarEventos(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method === 'POST') return cadastrarEvento(req, res);
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ mensagem: 'Método não permitido.' });
  }
  const pagina = Number(req.query.pagina || 1);
  if (Object.keys(req.query).some(campo => campo !== 'pagina') || Array.isArray(req.query.pagina) || !Number.isInteger(pagina) || pagina < 1 || pagina > 10000) {
    return res.status(400).json({ mensagem: 'Página inválida.' });
  }
  try {
    const eventos = await consultarEventos(pagina);
    return res.status(200).json({ eventos, temMais: eventos.length === 20 });
  } catch {
    return res.status(503).json({ mensagem: 'Não foi possível consultar os eventos. Tente novamente em instantes.' });
  }
}
