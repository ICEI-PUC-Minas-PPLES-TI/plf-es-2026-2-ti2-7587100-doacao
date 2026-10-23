import { validarAcesso } from '../validacao';
import { criarHashSenha, conferirSenha, HASH_AUSENTE, origemPermitida } from './seguranca';
import * as repositorio from './repositorio';
import { obterUsuario, iniciarSessao, encerrarSessao, usuarioPublico } from './sessao';

export default async function autenticacao(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vary', 'Cookie');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const acao = req.query.acao;
  if (!['login', 'cadastro', 'sessao', 'logout'].includes(acao)) return res.status(404).json({ mensagem: 'Caminho não encontrado.' });
  const metodo = acao === 'sessao' ? 'GET' : 'POST';
  if (req.method !== metodo) {
    res.setHeader('Allow', metodo);
    return res.status(405).json({ mensagem: 'Método não permitido.' });
  }
  if (metodo === 'POST' && !origemPermitida(req)) return res.status(403).json({ mensagem: 'Origem não permitida.' });
  if (metodo === 'POST' && !req.headers['content-type']?.toLowerCase().startsWith('application/json')) return res.status(415).json({ mensagem: 'Envie os dados em JSON.' });
  try {
    if (acao === 'sessao') return res.status(200).json({ usuario: await obterUsuario(req) });
    if (acao === 'logout') {
      await encerrarSessao(req, res);
      return res.status(200).json({ usuario: null });
    }
    const permitidos = acao === 'cadastro' ? ['nome', 'email', 'senha', 'confirmacao'] : ['email', 'senha'];
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body) || Object.keys(req.body).some(chave => !permitidos.includes(chave))) return res.status(400).json({ mensagem: 'Dados de acesso inválidos.' });
    const ip = req.socket?.remoteAddress || 'desconhecido';
    const limiteIp = await repositorio.permitirTentativa(`${acao}:ip:${ip}`, acao === 'cadastro' ? 10 : 30);
    if (!limiteIp) return excesso(res);
    const { dados, erros } = validarAcesso(req.body, acao === 'cadastro');
    if (Object.keys(erros).length) return res.status(400).json({ mensagem: 'Confira os campos indicados.', erros });
    if (acao === 'login' && !await repositorio.permitirTentativa(`login:email:${dados.email}`, 10)) return excesso(res);
    let usuario = await repositorio.buscarUsuarioPorEmail(dados.email);
    if (acao === 'cadastro') {
      if (usuario) return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado. Entre na sua conta.' });
      usuario = await repositorio.cadastrarUsuario({ nome: dados.nome, email: dados.email, senhaHash: await criarHashSenha(dados.senha), papeis: ['USUARIO'] });
    } else {
      const correta = await conferirSenha(dados.senha, usuario?.senhaHash || HASH_AUSENTE);
      if (!usuario || !correta) return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    }
    await iniciarSessao(req, res, usuario);
    return res.status(acao === 'cadastro' ? 201 : 200).json({ usuario: usuarioPublico(usuario) });
  } catch (erro) {
    if (erro?.code === 11000 && acao === 'cadastro') return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado. Entre na sua conta.' });
    return res.status(503).json({ mensagem: 'Não foi possível acessar sua conta agora. Tente novamente em instantes.' });
  }
}

function excesso(res) {
  res.setHeader('Retry-After', '900');
  return res.status(429).json({ mensagem: 'Muitas tentativas. Aguarde 15 minutos e tente novamente.' });
}
