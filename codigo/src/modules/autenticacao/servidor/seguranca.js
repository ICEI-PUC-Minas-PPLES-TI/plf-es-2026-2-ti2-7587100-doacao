import { randomBytes, scrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';

const derivar = promisify(scrypt);
const parametros = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
export const HASH_AUSENTE = 'scrypt$32768$8$3$' + '0'.repeat(32) + '$' + '0'.repeat(128);

export async function criarHashSenha(senha) {
  const salt = randomBytes(16).toString('hex');
  const hash = await derivar(senha, salt, 64, parametros);
  return `scrypt$32768$8$3$${salt}$${hash.toString('hex')}`;
}

export async function conferirSenha(senha, registro) {
  if (typeof senha !== 'string' || senha.length < 7 || senha.length > 30 || typeof registro !== 'string') return false;
  if (!/^scrypt\$32768\$8\$3\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(registro)) return false;
  const partes = registro.split('$');
  const calculado = await derivar(senha, partes[4], 64, parametros);
  return timingSafeEqual(calculado, Buffer.from(partes[5], 'hex'));
}

export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

export function lerToken(cookie) {
  if (typeof cookie !== 'string' || cookie.length > 8192) return null;
  const valores = cookie.split(';').map(item => item.trim()).filter(item => item.startsWith('doacao_sessao='));
  if (valores.length !== 1) return null;
  const token = valores[0].slice('doacao_sessao='.length);
  return /^[a-f0-9]{64}$/.test(token) ? token : null;
}

export function montarCookie(token, apagar = false) {
  return `doacao_sessao=${apagar ? '' : token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${apagar ? 0 : 28800}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
}

export function origemPermitida(req) {
  try {
    const origem = new URL(req.headers.origin);
    const configurada = process.env.APP_ORIGIN;
    if (configurada) return origem.origin === configurada && req.headers.origin === origem.origin;
    const local = new URL(`http://${req.headers.host}`);
    return ['localhost', '127.0.0.1', '[::1]'].includes(local.hostname) && origem.origin === local.origin && req.headers.origin === origem.origin;
  } catch {
    return false;
  }
}
