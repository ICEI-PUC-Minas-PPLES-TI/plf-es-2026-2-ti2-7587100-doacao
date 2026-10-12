const REQUIRED_MESSAGES = {
  nome: "Informe o nome do evento.",
  data: "Informe a data.",
  horario: "Informe o horário.",
  local: "Informe o local."
};

const clean = (value) => typeof value === "string" ? value.trim() : "";

export function validateEvent(input = {}) {
  const value = {
    nome: clean(input.nome),
    descricao: clean(input.descricao),
    data: clean(input.data),
    horario: clean(input.horario),
    local: clean(input.local)
  };
  const errors = {};
  Object.entries(REQUIRED_MESSAGES).forEach(([field, message]) => {
    if (!value[field]) errors[field] = message;
  });
  return { valid: Object.keys(errors).length === 0, errors, value };
}

const searchable = (value = "") => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

export function filterEvents(events = [], query = "") {
  const normalizedQuery = searchable(query.trim());
  if (!normalizedQuery) return events;
  return events.filter((event) => searchable(event.nome).includes(normalizedQuery) || searchable(event.local).includes(normalizedQuery));
}

export function canManageEvent(event, userId) {
  return Boolean(event && userId && event.autorId === userId);
}
