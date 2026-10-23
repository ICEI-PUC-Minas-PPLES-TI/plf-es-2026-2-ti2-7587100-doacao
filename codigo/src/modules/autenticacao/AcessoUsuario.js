import Link from 'next/link';
import { useState } from 'react';
import { useAutenticacao } from './contexto';
import styles from '@/styles/Autenticacao.module.css';

export default function AcessoUsuario() {
  const { usuario, carregando, erro, sair } = useAutenticacao();
  const [saindo, setSaindo] = useState(false);

  async function encerrar() {
    setSaindo(true);
    await sair();
    setSaindo(false);
  }

  return <div className={styles.acesso}>
    {carregando ? <span>Conferindo acesso…</span> : usuario ? <>
      <span className={styles.nome}>Olá, {usuario.nome}</span>
      <button type="button" onClick={encerrar} disabled={saindo}>{saindo ? 'Saindo…' : 'Sair'}</button>
    </> : <><Link href="/login">Entrar</Link><Link href="/cadastro">Criar conta</Link></>}
    {erro && <span role="alert" className={styles.erroMenu}>{erro}</span>}
  </div>;
}
