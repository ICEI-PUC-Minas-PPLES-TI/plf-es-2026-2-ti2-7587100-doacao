import { consultarEventos, idValido } from './eventos';

export default async function consultarEvento(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ mensagem: 'Alterações de eventos estão indisponíveis até a integração do login.' });
  }
  if (!idValido(req.query.id) || Object.keys(req.query).some(campo => campo !== 'id')) {
    return res.status(400).json({ mensagem: 'Identificador inválido.' });
  }
  try {
    const eventos = await consultarEventos(1, req.query.id);
    if (!eventos.length) return res.status(404).json({ mensagem: 'Evento não encontrado.' });
    return res.status(200).json(eventos[0]);
  } catch {
    return res.status(503).json({ mensagem: 'Não foi possível consultar o evento. Tente novamente em instantes.' });
  }
}
