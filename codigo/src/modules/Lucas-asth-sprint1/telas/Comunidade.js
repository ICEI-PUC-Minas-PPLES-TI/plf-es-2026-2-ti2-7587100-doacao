import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "../../../../public/modulos/Lucas-asth-sprint1/css/Comunidade.module.css";

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
        <p>{evento.horario} · {evento.local} · {evento.participantes === null ? 'Participantes não informados' : evento.participantes + ' participantes'}</p>
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

  const [pagina, setPagina] = useState(1);
  const [temMais, setTemMais] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controle = new AbortController();
    setCarregando(true);
    setErro('');
    fetch('/api/eventos?pagina=' + pagina, { signal: controle.signal, cache: 'no-store' })
      .then(async resposta => {
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.mensagem);
        return dados;
      })
      .then(dados => {
        if (controle.signal.aborted) return;
        setEventos(anteriores => pagina === 1 ? dados.eventos : [...anteriores, ...dados.eventos]);
        setTemMais(dados.temMais);
      })
      .catch(() => {
        if (!controle.signal.aborted) setErro('Não foi possível carregar os eventos do banco. Tente novamente.');
      })
      .finally(() => { if (!controle.signal.aborted) setCarregando(false); });
    return () => controle.abort();
  }, [pagina, tentativa]);

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
          <Link href="/comunidade/cadastro" className={styles.createButton}>Cadastrar evento</Link>

          <label className={styles.search}>
            <span aria-hidden="true">⌕</span>
            <input type="search" aria-label="Buscar eventos por nome ou local" value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar eventos por nome ou local" />
          </label>

          <div className={styles.listTitle}>
            <div><span>Agenda da comunidade</span><h2>Eventos da comunidade</h2></div>
            {!carregando && !erro && <strong>{eventosVisiveis.length} {eventosVisiveis.length === 1 ? "evento" : "eventos"}</strong>}
          </div>

          {carregando && <p role="status" className={styles.message}>Carregando eventos...</p>}
          {erro && <div className={styles.error} role="alert"><p>{erro}</p><button type="button" onClick={() => setTentativa(tentativa + 1)}>Tentar novamente</button></div>}
          {!carregando && !erro && (
            <div className={styles.list}>
              {eventosVisiveis.length
                ? eventosVisiveis.map((evento) => <CartaoEvento key={evento.id} evento={evento} />)
                : <p className={styles.empty}>{busca ? 'Nenhum evento encontrado entre os eventos carregados.' : 'Nenhum evento cadastrado no banco.'}</p>}
            </div>
          )}
          {!carregando && !erro && temMais && <button className={styles.createButton} type="button" onClick={() => setPagina(pagina + 1)}>Carregar mais eventos</button>}
        </>
      )}
    </section>
  );
}
