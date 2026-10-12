const mensagensObrigatorias = {
  nome: "Informe o nome do evento.",
  data: "Informe a data.",
  horario: "Informe o horário.",
  local: "Informe o local."
};

function limpar(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

export function validarEvento(dados = {}) {
  const evento = {
    nome: limpar(dados.nome),
    descricao: limpar(dados.descricao),
    data: limpar(dados.data),
    horario: limpar(dados.horario),
    local: limpar(dados.local)
  };

  const erros = {};
  Object.entries(mensagensObrigatorias).forEach(([campo, mensagem]) => {
    if (!evento[campo]) erros[campo] = mensagem;
  });

  return {
    valido: Object.keys(erros).length === 0,
    erros,
    evento
  };
}

function mostrarErros(erros) {
  document.querySelectorAll("[data-erro]").forEach((elemento) => {
    const campo = elemento.dataset.erro;
    elemento.textContent = erros[campo] || "";
  });

  document.querySelectorAll("[name]").forEach((campo) => {
    campo.setAttribute("aria-invalid", Boolean(erros[campo.name]));
  });
}

function iniciarFormulario() {
  const formulario = document.querySelector("#form-evento");
  const mensagem = document.querySelector("#mensagem-sucesso");

  if (!formulario) return;

  formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    const dados = Object.fromEntries(new FormData(formulario));
    const resultado = validarEvento(dados);
    mostrarErros(resultado.erros);

    if (!resultado.valido) return;

    localStorage.setItem("doacao:evento-rascunho", JSON.stringify(resultado.evento));
    mensagem.hidden = false;
    formulario.reset();
  });

  formulario.addEventListener("input", () => {
    mensagem.hidden = true;
  });
}

if (typeof document !== "undefined") {
  iniciarFormulario();
}

function normalizarTexto(valor = "") {
  return String(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

export function filtrarEventos(eventos = [], termo = "") {
  const busca = normalizarTexto(termo.trim());
  if (!busca) return eventos;

  return eventos.filter((evento) =>
    normalizarTexto(evento.nome).includes(busca) ||
    normalizarTexto(evento.local).includes(busca)
  );
}

function criarCartao(evento) {
  const artigo = document.createElement("article");
  artigo.className = "cartao-evento";

  const data = new Date(evento.data + "T12:00:00Z");
  const dia = String(data.getUTCDate()).padStart(2, "0");
  const mes = new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" })
    .format(data)
    .replace(".", "")
    .toUpperCase();

  const calendario = document.createElement("div");
  calendario.className = "data-evento";
  calendario.innerHTML = "<strong>" + dia + "</strong><span>" + mes + "</span>";

  const conteudo = document.createElement("div");
  conteudo.className = "conteudo-evento";

  const titulo = document.createElement("h3");
  titulo.textContent = evento.nome;

  const informacoes = document.createElement("p");
  informacoes.textContent = evento.horario + " · " + evento.local + " · " + (evento.participantes || 0) + " participantes";

  const etiqueta = document.createElement("span");
  etiqueta.className = "etiqueta";
  etiqueta.textContent = "ⓘ Evento da comunidade";

  conteudo.append(titulo, informacoes, etiqueta);
  artigo.append(calendario, conteudo);
  return artigo;
}

function iniciarListagem() {
  const lista = document.querySelector("#lista-eventos");
  const busca = document.querySelector("#busca-eventos");
  const contador = document.querySelector("#contador-eventos");

  if (!lista || !busca) return;

  let eventos = [];

  function renderizar(termo = "") {
    const filtrados = filtrarEventos(eventos, termo);
    lista.replaceChildren();

    if (!filtrados.length) {
      const vazio = document.createElement("p");
      vazio.className = "estado-vazio";
      vazio.textContent = "Nenhum evento encontrado.";
      lista.append(vazio);
    } else {
      filtrados.forEach((evento) => lista.append(criarCartao(evento)));
    }

    contador.textContent = filtrados.length + (filtrados.length === 1 ? " evento" : " eventos");
  }

  fetch("./eventos-iniciais.json")
    .then((resposta) => resposta.json())
    .then((dados) => {
      eventos = Array.isArray(dados) ? dados : [];
      renderizar();
    })
    .catch(() => {
      lista.textContent = "Não foi possível carregar os eventos.";
    });

  busca.addEventListener("input", () => renderizar(busca.value));
}

if (typeof document !== "undefined") {
  iniciarListagem();
}
