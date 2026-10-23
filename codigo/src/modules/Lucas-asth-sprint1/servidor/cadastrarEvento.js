import { obterUsuario } from '../../autenticacao/servidor/sessao';
import { origemPermitida } from '../../autenticacao/servidor/seguranca';
import { permitirTentativa } from '../../autenticacao/servidor/repositorio';
import { validarEvento } from '../validarEvento';
import { inserirEvento } from './repositorioEventos';
import { apresentarEvento } from './eventos';

export default async function cadastrarEvento(req, res) {
  res.setHeader('Vary', 'Cookie');
  if (!origemPermitida(req)) return res.status(403).json({ mensagem: 'Origem não permitida.' });
  if (!req.headers['content-type']?.toLowerCase().startsWith('application/json')) return res.status(415).json({ mensagem: 'Envie os dados em JSON.' });
  if (Object.keys(req.query).length) return res.status(400).json({ mensagem: 'Parâmetros não permitidos.' });
  try {
    const usuario = await obterUsuario(req);
    if (!usuario) return res.status(401).json({ mensagem: 'Entre na sua conta para cadastrar um evento.' });
    const campos = ['nome', 'descricao', 'data', 'horario', 'local', 'endereco'];
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body) || Object.keys(req.body).some(campo => !campos.includes(campo))) return res.status(400).json({ mensagem: 'Dados do evento inválidos.' });
    const { dados, erros, inicio } = validarEvento(req.body);
    if (Object.keys(erros).length) return res.status(400).json({ mensagem: 'Confira os campos indicados.', erros });
    if (!await permitirTentativa(`evento:usuario:${usuario.id}`, 20)) {
      res.setHeader('Retry-After', '900');
      return res.status(429).json({ mensagem: 'Muitos cadastros. Aguarde 15 minutos e tente novamente.' });
    }
    const documento = await inserirEvento(dados, usuario.id, inicio);
    return res.status(201).json({ evento: apresentarEvento(documento) });
  } catch {
    return res.status(503).json({ mensagem: 'Não foi possível cadastrar o evento. Tente novamente em instantes.' });
  }
}
