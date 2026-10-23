import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAutenticacao } from '../../autenticacao/contexto';
import ExcluirEvento from './ExcluirEvento';
import styles from '../../../../public/modulos/Lucas-asth-sprint1/css/EventoDetalhes.module.css';

export default function EventoDetalhes() {
  const router = useRouter();
  const { usuario } = useAutenticacao();
  const [evento, setEvento] = useState(null);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const [excluido, setExcluido] = useState(false);
  const [erroExclusao, setErroExclusao] = useState('');
  const tituloSucesso = useRef(null);

  useEffect(() => { if (excluido) tituloSucesso.current?.focus(); }, [excluido]);
  useEffect(() => { setExcluido(false); setErroExclusao(''); }, [router.query.id]);

  useEffect(() => {
    if (!router.isReady || typeof router.query.id !== 'string') return;
    const controle = new AbortController();
    setEvento(null);
    setErro('');
    fetch('/api/eventos/' + encodeURIComponent(router.query.id), { signal: controle.signal, cache: 'no-store' })
      .then(async resposta => {
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(resposta.status === 404 ? 'Evento não encontrado no banco.' : 'Não foi possível consultar o evento.');
        return dados;
      })
      .then(dados => { if (!controle.signal.aborted) setEvento(dados); })
      .catch(falha => { if (!controle.signal.aborted) setErro(falha.message || 'Não foi possível consultar o evento.'); });
    return () => controle.abort();
  }, [router.isReady, router.query.id, tentativa, usuario?.id]);

  if (excluido) return <section className={styles.page}>
    <h1 ref={tituloSucesso} tabIndex={-1}>Evento excluído</h1>
    <p role="status">O evento foi removido com sucesso.</p>
    <Link href="/comunidade" className={styles.back}>← Voltar para eventos</Link>
  </section>;
  if (!evento) return <section className={styles.page}>
    <Link href="/comunidade">← Voltar para eventos</Link>
    <p role={erro ? 'alert' : 'status'}>{erro || 'Carregando evento…'}</p>
    {erro && <button type="button" onClick={() => setTentativa(tentativa + 1)}>Tentar novamente</button>}
  </section>;
  const data = new Date(evento.data + "T12:00:00Z");
  const dia = String(data.getUTCDate()).padStart(2, "0");
  const mes = new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" })
    .format(data).replace(".", "").toUpperCase();
  const dataCompleta = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(data);

  return (
    <article className={styles.page}>
        <nav className={styles.eventToolbar} aria-label="Ações do evento">
          <Link href="/comunidade" className={styles.back}>
            <span aria-hidden="true">←</span> Voltar para eventos
          </Link>
          {usuario && evento.podeEditar && <div className={styles.eventActions}><Link href={'/comunidade/eventos/' + evento.id + '/editar'} className={styles.editButton}>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m16 3 5 5M4 20l4-1L21 6a2.8 2.8 0 0 0-4-4L4 15l-1 6Z" />
            </svg>
            Editar evento
          </Link><ExcluirEvento evento={evento} onExcluido={() => setExcluido(true)} onErro={setErroExclusao} /></div>}
        </nav>
        {erroExclusao && <p className={styles.error} role="alert">{erroExclusao}</p>}

        <section className={styles.hero}>
          <div className={styles.date}><strong>{dia}</strong><span>{mes}</span></div>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>Evento da comunidade</span>
            <h1>{evento.nome}</h1>
            <p>{evento.descricao}</p>
          </div>
        </section>

        <section className={styles.information} aria-label="Informações do evento">
          <div className={styles.infoCard}>
            <span className={styles.icon} aria-hidden="true">◷</span>
            <div>
              <small>Data e horário</small>
              <strong className={styles.capitalize}>{dataCompleta}</strong>
              <span>às {evento.horario}</span>
            </div>
          </div>

          <div className={styles.infoCard}>
            <span className={styles.icon} aria-hidden="true">⌖</span>
            <div>
              <small>Local</small>
              <strong>{evento.local}</strong>
              <span>{evento.endereco || 'Consulte a organização para o endereço completo'}</span>
            </div>
          </div>

          <div className={styles.infoCard}>
            <span className={styles.icon} aria-hidden="true">♧</span>
            <div>
              <small>Participação</small>
              <strong>{evento.participantes === null ? 'Total não informado' : evento.participantes + ' participantes'}</strong>
              <span>Pessoas mobilizadas pela comunidade</span>
            </div>
          </div>
        </section>

        <section className={styles.about}>
          <span className={styles.eyebrow}>Sobre o evento</span>
          <h2>Juntos, cada doação faz diferença</h2>
          <p>{evento.descricao}</p>
        </section>

        <aside className={styles.notice}>
          <span aria-hidden="true">♥</span>
          <div>
            <strong>Evento organizado pela comunidade</strong>
            <p>Confira a data e o local antes de sair de casa.</p>
          </div>
        </aside>
      </article>
  );
}
