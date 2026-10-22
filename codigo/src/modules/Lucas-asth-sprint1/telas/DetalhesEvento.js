import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../../../public/modulos/Lucas-asth-sprint1/css/EventoDetalhes.module.css';

export default function EventoDetalhes() {
  const router = useRouter();
  const [evento, setEvento] = useState(null);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);

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
  }, [router.isReady, router.query.id, tentativa]);

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
        <Link href="/comunidade" className={styles.back}>
          <span aria-hidden="true">←</span> Voltar para eventos
        </Link>

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
