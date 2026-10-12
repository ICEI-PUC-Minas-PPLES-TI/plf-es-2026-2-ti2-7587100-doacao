import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "../../styles/Comunidade.module.css";

function normalizarTexto(valor = "") {
  return String(valor).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function filtrarEventos(eventos, termo) {
  const busca = normalizarTexto(termo.trim());
  if (!busca) return eventos;
  return eventos.filter((evento) =>
    normalizarTexto(evento.nome).includes(busca) ||
    normalizarTexto(evento.local).includes(busca)
  );
}

function CartaoEvento({ evento }) {
  const data = new Date(evento.data + "T12:00:00Z");
  const dia = String(data.getUTCDate()).padStart(2, "0");
  const mes = new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" })
    .format(data).replace(".", "").toUpperCase();

  return (
    <article className={styles.card}>
      <div className={styles.date}><strong>{dia}</strong><span>{mes}</span></div>
      <div className={styles.cardContent}>
        <h3>{evento.nome}</h3>
        <p>{evento.horario} · {evento.local} · {evento.participantes || 0} participantes</p>
        {evento.descricao && <p className={styles.description}>{evento.descricao}</p>}
        <span className={styles.tag}>ⓘ Evento da comunidade</span>
      </div>
      <Link
        className={styles.arrow}
        href={"/comunidade/eventos/" + evento.id}
        aria-label={"Abrir detalhes do evento " + evento.nome}
      >
        ›
      </Link>
    </article>
  );
}

export default function Comunidade() {
  const [eventos, setEventos] = useState([]);
  const [busca, setBusca] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("eventos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("/modulos/Lucas-asth-sprint1/eventos-iniciais.json")
      .then((resposta) => {
        if (!resposta.ok) throw new Error("Falha ao carregar eventos.");
        return resposta.json();
      })
      .then((dados) => setEventos(Array.isArray(dados) ? dados : []))
      .catch(() => setErro("Não foi possível carregar os eventos."))
      .finally(() => setCarregando(false));
  }, []);

  const eventosVisiveis = useMemo(() => filtrarEventos(eventos, busca), [eventos, busca]);

  return (
    <section className={styles.community}>
      <header className={styles.intro}>
        <span>Conecte-se para transformar</span>
        <h1>Comunidade</h1>
        <p>Encontre campanhas próximas e mobilize pessoas para doar.</p>
      </header>

      <nav className={styles.tabs} aria-label="Seções da comunidade">
        <button
          type="button"
          className={abaAtiva === "feed" ? styles.activeTab : ""}
          aria-pressed={abaAtiva === "feed"}
          onClick={() => setAbaAtiva("feed")}
        >
          Feed
        </button>
        <button
          type="button"
          className={abaAtiva === "eventos" ? styles.activeTab : ""}
          aria-pressed={abaAtiva === "eventos"}
          onClick={() => setAbaAtiva("eventos")}
        >
          Eventos
        </button>
        <button
          type="button"
          className={abaAtiva === "forum" ? styles.activeTab : ""}
          aria-pressed={abaAtiva === "forum"}
          onClick={() => setAbaAtiva("forum")}
        >
          Fórum
        </button>
      </nav>

      {abaAtiva === "eventos" && (
        <>
          <Link className={styles.createButton} href="/comunidade/cadastro">＋ Criar evento</Link>

          <label className={styles.search}>
            <span aria-hidden="true">⌕</span>
            <input type="search" value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar eventos por nome ou local" />
          </label>

          <div className={styles.listTitle}>
            <div><span>Agenda da comunidade</span><h2>Próximos eventos</h2></div>
            {!carregando && !erro && <strong>{eventosVisiveis.length} {eventosVisiveis.length === 1 ? "evento" : "eventos"}</strong>}
          </div>

          {carregando && <p className={styles.message}>Carregando eventos...</p>}
          {erro && <p className={styles.error}>{erro}</p>}
          {!carregando && !erro && (
            <div className={styles.list}>
              {eventosVisiveis.length
                ? eventosVisiveis.map((evento) => <CartaoEvento key={evento.id} evento={evento} />)
                : <p className={styles.empty}>Nenhum evento encontrado.</p>}
            </div>
          )}
        </>
      )}
    </section>
  );
}
