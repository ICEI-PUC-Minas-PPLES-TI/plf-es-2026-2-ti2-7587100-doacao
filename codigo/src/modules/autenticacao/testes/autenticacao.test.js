import { afterEach, describe, expect, it, vi } from 'vitest';
import { validarAcesso } from '../validacao';
import { criarHashSenha, conferirSenha, hashToken, lerToken, origemPermitida, montarCookie } from '../servidor/seguranca';
import api from '../servidor/api';
import { obterUsuario } from '../servidor/sessao';
import * as repositorio from '../servidor/repositorio';

vi.mock('../servidor/repositorio', () => ({
  buscarUsuarioPorEmail: vi.fn(), cadastrarUsuario: vi.fn(),
  registrarSessao: vi.fn(), buscarSessao: vi.fn(),
  buscarUsuarioPorId: vi.fn(), removerSessao: vi.fn(), permitirTentativa: vi.fn()
}));

const senha = 'Uma frase para testar 123!';
const usuario = { _id: '670000000000000000001001', nome: 'Pessoa de teste', email: 'teste@example.test', papeis: ['USUARIO'] };
const token = 'a'.repeat(64);

function requisicao(acao, body = {}, method = 'POST') {
  return { query: { acao }, method, body, headers: { host: 'localhost:3000', origin: 'http://localhost:3000', 'content-type': 'application/json' }, socket: { remoteAddress: '127.0.0.1' } };
}
function resposta() {
  return { codigo: 200, corpo: null, headers: {}, setHeader(nome, valor) { this.headers[nome] = valor; }, status(codigo) { this.codigo = codigo; return this; }, json(corpo) { this.corpo = corpo; return this; } };
}

afterEach(() => { vi.resetAllMocks(); vi.unstubAllEnvs(); });

describe('validação e senha', () => {
  it('aceita de 7 a 30 caracteres e rejeita senhas fora desses limites', () => {
    for (const cadastro of [true, false]) {
      for (const tamanho of [6, 7, 30, 31]) {
        const valor = 'a'.repeat(tamanho);
        const resultado = validarAcesso({ nome: 'Teste', email: 'teste@example.test', senha: valor, confirmacao: valor }, cadastro);
        expect(Boolean(resultado.erros.senha)).toBe(tamanho < 7 || tamanho > 30);
      }
    }
  });
  it('normaliza o e-mail e rejeita dados inválidos ou objetos', () => {
    const resultado = validarAcesso({ nome: ' Pessoa ', email: ' TESTE@EXAMPLE.TEST ', senha, confirmacao: senha }, true);
    expect(resultado.erros).toEqual({});
    expect(resultado.dados.email).toBe('teste@example.test');
    expect(resultado.dados.nome).toBe('Pessoa');
    expect(validarAcesso({ email: { $ne: null }, senha: [] }, false).erros).toHaveProperty('email');
    expect(validarAcesso({ nome: '', email: 'teste', senha: 'curta', confirmacao: 'outra' }, true).erros).toHaveProperty('senha');
  });

  it('usa salt diferente e compara senhas sem guardar texto puro', async () => {
    const hash = await criarHashSenha(senha);
    const outroHash = await criarHashSenha(senha);
    expect(hash).not.toBe(outroHash);
    expect(hash).not.toContain(senha);
    expect(await conferirSenha(senha, hash)).toBe(true);
    expect(await conferirSenha('Uma outra frase incorreta', hash)).toBe(false);
    expect(await conferirSenha(senha, 'texto puro')).toBe(false);
  });
});

describe('sessão e origem', () => {
  it('rejeita cookies adulterados, repetidos e origem externa', () => {
    expect(lerToken('doacao_sessao=' + token)).toBe(token);
    expect(lerToken('doacao_sessao=objeto')).toBeNull();
    expect(lerToken('doacao_sessao=' + token + '; doacao_sessao=' + token)).toBeNull();
    expect(hashToken(token)).not.toBe(token);
    expect(origemPermitida(requisicao('login'))).toBe(true);
    const req = requisicao('login');
    req.headers.origin = 'https://outro.example';
    expect(origemPermitida(req)).toBe(false);
    delete req.headers.origin;
    expect(origemPermitida(req)).toBe(false);
  });

  it('coloca proteções no cookie, incluindo Secure em produção', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(montarCookie(token)).toContain('HttpOnly');
    expect(montarCookie(token)).toContain('SameSite=Lax');
    expect(montarCookie(token)).toContain('Secure');
    expect(montarCookie('', true)).toContain('Max-Age=0');
  });

  it('não aceita uma sessão expirada mesmo antes da limpeza TTL', async () => {
    repositorio.buscarSessao.mockResolvedValue({ usuarioId: usuario._id, expiraEm: new Date(0) });
    const req = requisicao('sessao', {}, 'GET');
    req.headers.cookie = 'doacao_sessao=' + token;
    expect(await obterUsuario(req)).toBeNull();
    expect(repositorio.buscarUsuarioPorId).not.toHaveBeenCalled();
  });
});

describe('API compartilhada', () => {
  it('bloqueia origem externa e métodos incorretos sem acessar contas', async () => {
    const req = requisicao('cadastro');
    req.headers.origin = 'https://outro.example';
    const res = resposta();
    await api(req, res);
    expect(res.codigo).toBe(403);
    const resMetodo = resposta();
    await api(requisicao('login', {}, 'GET'), resMetodo);
    expect(resMetodo.codigo).toBe(405);
    expect(repositorio.buscarUsuarioPorEmail).not.toHaveBeenCalled();
  });

  it('cadastra somente USUARIO, cria sessão e retorna somente os campos públicos', async () => {
    repositorio.permitirTentativa.mockResolvedValue(true);
    repositorio.buscarUsuarioPorEmail.mockResolvedValue(null);
    repositorio.cadastrarUsuario.mockResolvedValue({ ...usuario, senhaHash: 'nunca-retornar' });
    const res = resposta();
    await api(requisicao('cadastro', { nome: usuario.nome, email: usuario.email, senha, confirmacao: senha }), res);
    expect(res.codigo).toBe(201);
    const registro = repositorio.cadastrarUsuario.mock.calls[0][0];
    expect(registro.papeis).toEqual(['USUARIO']);
    expect(registro.senhaHash).not.toContain(senha);
    expect(res.headers['Set-Cookie']).toContain('HttpOnly');
    expect(repositorio.registrarSessao.mock.calls[0][0].tokenHash).not.toBe(lerToken(res.headers['Set-Cookie'].split(';')[0]));
    expect(res.corpo.usuario).not.toHaveProperty('senhaHash');
  });

  it('não sobrescreve conta duplicada e não aceita atribuição de papel pelo cliente', async () => {
    repositorio.permitirTentativa.mockResolvedValue(true);
    repositorio.buscarUsuarioPorEmail.mockResolvedValue(usuario);
    const res = resposta();
    await api(requisicao('cadastro', { nome: usuario.nome, email: usuario.email, senha, confirmacao: senha }), res);
    expect(res.codigo).toBe(409);
    expect(repositorio.cadastrarUsuario).not.toHaveBeenCalled();
    const resPapel = resposta();
    await api(requisicao('cadastro', { nome: usuario.nome, email: usuario.email, senha, confirmacao: senha, papeis: ['ADMIN'] }), resPapel);
    expect(resPapel.codigo).toBe(400);
  });

  it('dá a mesma mensagem para conta ausente e senha incorreta', async () => {
    repositorio.permitirTentativa.mockResolvedValue(true);
    repositorio.buscarUsuarioPorEmail.mockResolvedValue(null);
    const ausente = resposta();
    await api(requisicao('login', { email: usuario.email, senha }), ausente);
    repositorio.buscarUsuarioPorEmail.mockResolvedValue({ ...usuario, senhaHash: await criarHashSenha(senha) });
    const incorreta = resposta();
    await api(requisicao('login', { email: usuario.email, senha: 'Outra senha incorreta 123!' }), incorreta);
    expect(ausente.codigo).toBe(401);
    expect(incorreta.corpo).toEqual(ausente.corpo);
    expect(repositorio.registrarSessao).not.toHaveBeenCalled();
  });

  it('autentica senha correta e renova o token', async () => {
    repositorio.permitirTentativa.mockResolvedValue(true);
    repositorio.buscarUsuarioPorEmail.mockResolvedValue({ ...usuario, senhaHash: await criarHashSenha(senha) });
    const req = requisicao('login', { email: usuario.email, senha });
    req.headers.cookie = 'doacao_sessao=' + token;
    const res = resposta();
    await api(req, res);
    expect(res.codigo).toBe(200);
    expect(repositorio.removerSessao).toHaveBeenCalledWith(hashToken(token));
    expect(res.headers['Set-Cookie']).not.toContain(token);
    expect(res.corpo.usuario.id).toBe(usuario._id);
  });

  it('limita tentativas e esconde detalhes de falhas do banco', async () => {
    repositorio.permitirTentativa.mockResolvedValue(false);
    const bloqueio = resposta();
    await api(requisicao('login', { email: usuario.email, senha }), bloqueio);
    expect(bloqueio.codigo).toBe(429);
    repositorio.permitirTentativa.mockRejectedValue(new Error('senha do banco secreta'));
    const falha = resposta();
    await api(requisicao('login', { email: usuario.email, senha }), falha);
    expect(falha.codigo).toBe(503);
    expect(JSON.stringify(falha.corpo)).not.toContain('secreta');
  });

  it('revoga a sessão ao sair e apaga o cookie', async () => {
    const req = requisicao('logout');
    req.headers.cookie = 'doacao_sessao=' + token;
    const res = resposta();
    await api(req, res);
    expect(res.codigo).toBe(200);
    expect(repositorio.removerSessao).toHaveBeenCalledWith(hashToken(token));
    expect(res.headers['Set-Cookie']).toContain('Max-Age=0');
  });
});
