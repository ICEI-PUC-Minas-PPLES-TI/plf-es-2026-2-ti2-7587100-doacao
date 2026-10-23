import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useAutenticacao } from '../contexto';
import { validarAcesso } from '../validacao';
import styles from '@/styles/Autenticacao.module.css';

export default function Acesso({ cadastro = false }) {
  const router = useRouter();
  const { usuario, atualizarUsuario } = useAutenticacao();
  const [dados, setDados] = useState({ nome: '', email: '', senha: '', confirmacao: '' });
  const [erros, setErros] = useState({});
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mostrar, setMostrar] = useState(false);
  const ocupado = useRef(false);
  const formulario = useRef(null);

  function alterar(evento) {
    const { name, value } = evento.target;
    setDados(anterior => ({ ...anterior, [name]: value }));
    setErros(anterior => ({ ...anterior, [name]: '' }));
    setMensagem('');
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (ocupado.current) return;
    const validacao = validarAcesso(dados, cadastro);
    setErros(validacao.erros);
    setMensagem('');
    if (Object.keys(validacao.erros).length) {
      formulario.current.elements.namedItem(Object.keys(validacao.erros)[0])?.focus();
      return;
    }
    ocupado.current = true;
    setEnviando(true);
    try {
      const corpo = cadastro ? validacao.dados : { email: validacao.dados.email, senha: validacao.dados.senha };
      const resposta = await fetch(`/api/autenticacao/${cadastro ? 'cadastro' : 'login'}`, {
        method: 'POST', cache: 'no-store', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo)
      });
      const resultado = await resposta.json();
      if (!resposta.ok) {
        setErros(resultado.erros || {});
        setMensagem(resultado.mensagem || 'Não foi possível continuar. Tente novamente.');
        return;
      }
      atualizarUsuario(resultado.usuario);
      setDados(anterior => ({ ...anterior, senha: '', confirmacao: '' }));
      await router.replace('/comunidade');
    } catch {
      setMensagem('Não foi possível conectar. Confira sua conexão e tente novamente.');
    } finally {
      ocupado.current = false;
      setEnviando(false);
    }
  }

  function campo(nome, rotulo, tipo, autocomplete, maximo) {
    return <div className={styles.campo}>
      <label htmlFor={nome}>{rotulo}</label>
      <input id={nome} name={nome} type={tipo} autoComplete={autocomplete} value={dados[nome]} onChange={alterar}
        minLength={nome === 'senha' || nome === 'confirmacao' ? 7 : undefined} maxLength={maximo} required aria-invalid={Boolean(erros[nome])} aria-describedby={erros[nome] ? `${nome}-erro` : nome === 'senha' && cadastro ? 'senha-ajuda' : undefined} />
      {erros[nome] && <span id={`${nome}-erro`} className={styles.erro}>{erros[nome]}</span>}
    </div>;
  }

  return <section className={styles.pagina} aria-labelledby="titulo-acesso">
    <div className={styles.painel}>
      <p className={styles.marca}>DoAção</p>
      <h1 id="titulo-acesso">{cadastro ? 'Crie sua conta' : 'Entre na sua conta'}</h1>
      <p>{cadastro ? 'Faça parte da nossa comunidade.' : 'Que bom ter você por aqui.'}</p>
      {usuario ? <div className={styles.conectado}>
        <p>Você está conectado como <strong>{usuario.nome}</strong>.</p>
        <Link href="/comunidade">Ir para a comunidade</Link>
        <p>Para usar outra conta, clique em Sair no menu.</p>
      </div> : <form ref={formulario} onSubmit={enviar} noValidate aria-busy={enviando}>
        {cadastro && campo('nome', 'Nome', 'text', 'name', 120)}
        {campo('email', 'E-mail', 'email', 'username', 254)}
        {campo('senha', 'Senha', mostrar ? 'text' : 'password', cadastro ? 'new-password' : 'current-password', 30)}
        {cadastro && <p id="senha-ajuda" className={styles.ajuda}>Use de 7 a 30 caracteres.</p>}
        {cadastro && campo('confirmacao', 'Confirme sua senha', mostrar ? 'text' : 'password', 'new-password', 30)}
        <button className={styles.mostrar} type="button" onClick={() => setMostrar(valor => !valor)} aria-pressed={mostrar}>{mostrar ? 'Ocultar senha' : 'Mostrar senha'}</button>
        {mensagem && <p className={styles.erro} role="alert">{mensagem}</p>}
        <button className={styles.principal} type="submit" disabled={enviando}>{enviando ? 'Aguarde…' : cadastro ? 'Criar conta' : 'Entrar'}</button>
        <p className={styles.alternativa}>{cadastro ? 'Já tem uma conta? ' : 'Ainda não tem uma conta? '}<Link href={cadastro ? '/login' : '/cadastro'}>{cadastro ? 'Entrar' : 'Criar conta'}</Link></p>
      </form>}
    </div>
  </section>;
}
