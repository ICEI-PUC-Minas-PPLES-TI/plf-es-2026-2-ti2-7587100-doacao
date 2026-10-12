import { describe, expect, it } from "vitest";
import { canManageEvent, filterEvents, validateEvent } from "./eventRules";

describe("validateEvent", () => {
  it("rejeita campos obrigatórios vazios ou contendo somente espaços", () => {
    const result = validateEvent({ nome: " ", data: "", horario: " ", local: "", descricao: "" });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({
      nome: "Informe o nome do evento.",
      data: "Informe a data.",
      horario: "Informe o horário.",
      local: "Informe o local."
    });
  });

  it("aceita um evento completo e normaliza os textos", () => {
    const result = validateEvent({ nome: "  Campanha Vida  ", descricao: "  Doe sangue  ", data: "2026-12-10", horario: "09:30", local: "  Belo Horizonte  " });
    expect(result.valid).toBe(true);
    expect(result.value.nome).toBe("Campanha Vida");
    expect(result.value.local).toBe("Belo Horizonte");
  });
});

describe("filterEvents", () => {
  const events = [
    { nome: "Mutirão de doação", local: "Belo Horizonte" },
    { nome: "Encontro de doadores", local: "Contagem" }
  ];
  it("ignora acentos e diferença entre maiúsculas e minúsculas", () => {
    expect(filterEvents(events, "MUTIRAO")).toEqual([events[0]]);
  });
  it("pesquisa também pelo local", () => {
    expect(filterEvents(events, "contagem")).toEqual([events[1]]);
  });
});

describe("canManageEvent", () => {
  it("permite somente ao autor editar ou excluir", () => {
    expect(canManageEvent({ autorId: "lucas" }, "lucas")).toBe(true);
    expect(canManageEvent({ autorId: "comunidade" }, "lucas")).toBe(false);
  });
});
