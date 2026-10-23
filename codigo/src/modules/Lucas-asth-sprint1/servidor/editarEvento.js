import { obterUsuario } from '../../autenticacao/servidor/sessao';
import { origemPermitida } from '../../autenticacao/servidor/seguranca';
import { permitirTentativa } from '../../autenticacao/servidor/repositorio';
import { validarEvento } from '../validarEvento';
import { atualizarEvento } from './repositorioEventos';
import { apresentarEvento } from './eventos';

export default async function editarEvento(req, res) {
  if (!origemPermitida(req)) return res.status(403).json({ mensagem: 'Origem não permitida.' });
  if (!req.headers['content-type']?.toLowerCase().startsWith('application/json')) return res.status(415).json({ mensagem: 'Envie os dados em JSON.' });
  try {
    const usuario = await obterUsuario(req);
    if (!usuario) return res.status(401).json({ mensagem: 'Entre na sua conta para editar o evento.' });
    const campos = ['nome', 'descricao', 'data', 'horario', 'local', 'endereco'];
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body) || Object.keys(req.body).some(campo => !campos.includes(campo))) return res.status(400).json({ mensagem: 'Dados do evento inválidos.' });
    const { dados, erros, inicio } = validarEvento(req.body);
    if (Object.keys(erros).length) return res.status(400).json({ mensagem: 'Confira os campos indicados.', erros });
    if (!await permitirTentativa(`evento:edicao:${usuario.id}`, 30)) {
      res.setHeader('Retry-After', '900');
      return res.status(429).json({ mensagem: 'Muitas alterações. Aguarde 15 minutos e tente novamente.' });
    }
    const documento = await atualizarEvento(req.query.id, usuario.id, dados, inicio);
    if (!documento) return res.status(404).json({ mensagem: 'Evento não encontrado ou você não tem permissão para editá-lo.' });
    return res.status(200).json({ evento: { ...apresentarEvento(documento), podeEditar: true } });
  } catch {
    return res.status(503).json({ mensagem: 'Não foi possível editar o evento. Tente novamente em instantes.' });
  }
}
