import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAutenticacao } from '../../autenticacao/contexto';
import CadastroEvento from './CadastroEvento';
import styles from '../../../../public/modulos/Lucas-asth-sprint1/css/CadastroEvento.module.css';

export default function EditarEvento() {
  const router = useRouter();
  const { usuario, carregando } = useAutenticacao();
  const [evento, setEvento] = useState(null);
  const [erro, setErro] = useState('');
  const [consultando, setConsultando] = useState(true);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    if (!router.isReady || typeof router.query.id !== 'string' || carregando || !usuario?.id) return;
    const controle = new AbortController();
    setConsultando(true);
    setEvento(null);
    setErro('');
    fetch('/api/eventos/' + encodeURIComponent(router.query.id), { cache: 'no-store', credentials: 'same-origin', signal: controle.signal })
      .then(async resposta => {
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.mensagem || 'Não foi possível consultar o evento.');
        if (!dados.podeEditar) throw new Error('Somente o autor pode editar este evento.');
        if (!controle.signal.aborted) setEvento(dados);
      })
      .catch(falha => { if (!controle.signal.aborted) setErro(falha.message || 'Não foi possível carregar o evento.'); })
      .finally(() => { if (!controle.signal.aborted) setConsultando(false); });
    return () => controle.abort();
  }, [router.isReady, router.query.id, usuario?.id, carregando, tentativa]);

  if (!carregando && usuario && !consultando && evento) return <CadastroEvento key={evento.id + usuario.id} eventoInicial={evento} />;
  return <section className={styles.page}>
    <Link href="/comunidade">← Voltar para eventos</Link>
    <h1>Editar evento</h1>
    {carregando ? <p role="status">Conferindo seu acesso…</p> : !usuario ? <>
      <p>Entre na sua conta para editar seu evento.</p>
      <Link href="/login">Entrar</Link>
    </> : erro ? <>
      <p role="alert" className={styles.error}>{erro}</p>
      <button type="button" className={styles.primary} onClick={() => setTentativa(valor => valor + 1)}>Tentar novamente</button>
    </> : <p role="status">Carregando evento…</p>}
  </section>;
}
