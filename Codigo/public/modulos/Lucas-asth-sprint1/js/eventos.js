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
