import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import styles from "../../../styles/EventoDetalhes.module.css";

function lerEventos() {
  const arquivo = path.join(process.cwd(), "public", "modulos", "Lucas-asth-sprint1", "eventos-iniciais.json");
  const conteudo = fs.readFileSync(arquivo, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(conteudo);
}

export async function getStaticPaths() {
  const eventos = lerEventos();
  return {
    paths: eventos.map((evento) => ({ params: { id: evento.id } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const evento = lerEventos().find((item) => item.id === params.id);
  if (!evento) return { notFound: true };
  return { props: { evento } };
}

export default function EventoDetalhes({ evento }) {
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
