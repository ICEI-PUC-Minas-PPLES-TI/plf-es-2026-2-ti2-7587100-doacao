import { randomBytes } from 'node:crypto';
import * as repositorio from './repositorio';
import { hashToken, lerToken, montarCookie } from './seguranca';

export function usuarioPublico(usuario) {
  return { id: String(usuario._id), nome: usuario.nome, email: usuario.email, papeis: Array.isArray(usuario.papeis) ? usuario.papeis : ['USUARIO'] };
}

export async function obterUsuario(req) {
  const token = lerToken(req.headers.cookie);
  if (!token) return null;
  const sessao = await repositorio.buscarSessao(hashToken(token));
  if (!sessao || !(sessao.expiraEm instanceof Date) || sessao.expiraEm.getTime() <= Date.now()) return null;
  const usuario = await repositorio.buscarUsuarioPorId(sessao.usuarioId);
  return usuario ? usuarioPublico(usuario) : null;
}

export async function iniciarSessao(req, res, usuario) {
  const token = randomBytes(32).toString('hex');
  await repositorio.registrarSessao({ tokenHash: hashToken(token), usuarioId: usuario._id, criadaEm: new Date(), expiraEm: new Date(Date.now() + 28800000) });
  const anterior = lerToken(req.headers.cookie);
  if (anterior) await repositorio.removerSessao(hashToken(anterior));
  res.setHeader('Set-Cookie', montarCookie(token));
}

export async function encerrarSessao(req, res) {
  const token = lerToken(req.headers.cookie);
  if (token) await repositorio.removerSessao(hashToken(token));
  res.setHeader('Set-Cookie', montarCookie('', true));
}
