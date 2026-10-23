import { consultarEventos, idValido } from './eventos';
import { obterUsuario } from '../../autenticacao/servidor/sessao';
import { eventoDoAutor } from './repositorioEventos';
import editarEvento from './editarEvento';
import excluirEvento from './excluirEvento';

export default async function consultarEvento(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Vary', 'Cookie');
  if (!['GET', 'PUT', 'DELETE'].includes(req.method)) {
    res.setHeader('Allow', 'GET, PUT, DELETE');
    return res.status(405).json({ mensagem: 'Método não permitido.' });
  }
  if (!idValido(req.query.id) || Object.keys(req.query).some(campo => campo !== 'id')) {
    return res.status(400).json({ mensagem: 'Identificador inválido.' });
  }
  if (req.method === 'PUT') return editarEvento(req, res);
  if (req.method === 'DELETE') return excluirEvento(req, res);
  try {
    const eventos = await consultarEventos(1, req.query.id);
    if (!eventos.length) return res.status(404).json({ mensagem: 'Evento não encontrado.' });
    const usuario = await obterUsuario(req);
    const podeEditar = usuario ? Boolean(await eventoDoAutor(req.query.id, usuario.id)) : false;
    return res.status(200).json({ ...eventos[0], podeEditar });
  } catch {
    return res.status(503).json({ mensagem: 'Não foi possível consultar o evento. Tente novamente em instantes.' });
  }
}
