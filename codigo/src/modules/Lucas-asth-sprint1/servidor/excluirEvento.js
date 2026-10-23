import { obterUsuario } from '../../autenticacao/servidor/sessao';
import { origemPermitida } from '../../autenticacao/servidor/seguranca';
import { permitirTentativa } from '../../autenticacao/servidor/repositorio';
import { removerEvento } from './repositorioEventos';

export default async function excluirEvento(req, res) {
  if (!origemPermitida(req)) return res.status(403).json({ mensagem: 'Origem não permitida.' });
  if (!req.headers['content-type']?.toLowerCase().startsWith('application/json')) return res.status(415).json({ mensagem: 'Envie a confirmação em JSON.' });
  try {
    const usuario = await obterUsuario(req);
    if (!usuario) return res.status(401).json({ mensagem: 'Entre na sua conta para excluir o evento.' });
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body) || Object.keys(req.body).length !== 1 || req.body.confirmar !== true) return res.status(400).json({ mensagem: 'Confirme a exclusão do evento.' });
    if (!await permitirTentativa(`evento:exclusao:${usuario.id}`, 30)) {
      res.setHeader('Retry-After', '900');
      return res.status(429).json({ mensagem: 'Muitas exclusões. Aguarde 15 minutos e tente novamente.' });
    }
    const removido = await removerEvento(req.query.id, usuario.id);
    if (!removido) return res.status(404).json({ mensagem: 'Evento não encontrado ou você não tem permissão para excluí-lo.' });
    return res.status(200).json({ mensagem: 'Evento excluído com sucesso.' });
  } catch {
    return res.status(503).json({ mensagem: 'Não foi possível excluir o evento. Tente novamente em instantes.' });
  }
}
