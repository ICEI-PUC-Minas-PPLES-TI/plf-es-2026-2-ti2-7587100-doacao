import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { lerCadastros } from '../../../../public/modulos/Lucas-asth-sprint1/js/cadastro';
import Link from "next/link";
import styles from "../../../styles/EventoDetalhes.module.css";

export default function EventoDetalhes() {
  const router = useRouter();
  const [evento, setEvento] = useState(null);
  const [erro, setErro] = useState('');
  const [podeEditar, setPodeEditar] = useState(false);
  useEffect(() => {
    if (!router.isReady) return;
    let ativo = true;
    setEvento(null);
    setErro('');
    setPodeEditar(false);
    async function carregar() {
      try {
        const local = lerCadastros(window.localStorage).find(item => item.id === router.query.id);
        if (local) {
          if (ativo) {
            setEvento(local);
            setPodeEditar(true);
          }
          return;
        }
        const resposta = await fetch('/modulos/Lucas-asth-sprint1/eventos-iniciais.json');
        if (!resposta.ok) throw Error();
        const dados = await resposta.json();
        const encontrado = dados.find(item => item.id === router.query.id);
        if (ativo) { if (encontrado) setEvento(encontrado); else setErro('Evento não encontrado neste navegador.'); }
      } catch { if (ativo) setErro('Não foi possível carregar o evento. Tente atualizar a página.'); }
    }
    carregar();
    return () => { ativo = false; };
  }, [router.isReady, router.query.id]);
  if (!evento) return <section className={styles.page}><Link href="/comunidade">← Voltar para eventos</Link><p role={erro ? 'alert' : 'status'}>{erro || 'Carregando evento…'}</p></section>;
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

        {podeEditar && (
          <p><Link className={styles.back} href={'/comunidade/cadastro?editar=' + evento.id}>Editar evento</Link></p>
        )}

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
              <span>Consulte a organização para o endereço completo</span>
            </div>
          </div>

          <div className={styles.infoCard}>
            <span className={styles.icon} aria-hidden="true">♧</span>
            <div>
              <small>Participação</small>
              <strong>{evento.participantes || 0} participantes</strong>
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
