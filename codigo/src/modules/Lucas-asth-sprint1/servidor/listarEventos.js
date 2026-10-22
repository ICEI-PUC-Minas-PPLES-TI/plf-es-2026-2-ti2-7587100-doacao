import { consultarEventos } from './eventos';

export default async function listarEventos(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ mensagem: 'Alterações de eventos estão indisponíveis até a integração do login.' });
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
