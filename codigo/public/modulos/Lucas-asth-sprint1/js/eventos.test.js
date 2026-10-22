import { describe, expect, it } from "vitest";
import { validarEvento } from "./eventos.js";

describe("validarEvento", () => {
  it("rejeita os quatro campos obrigatórios vazios", () => {
    const resultado = validarEvento({ nome: " ", data: "", horario: " ", local: "" });
    expect(resultado.valido).toBe(false);
    expect(resultado.erros).toEqual({
      nome: "Informe o nome do evento.",
      data: "Informe a data.",
      horario: "Informe o horário.",
      local: "Informe o local."
    });
  });

  it("limpa espaços antes de devolver um evento válido", () => {
    const resultado = validarEvento({
      nome: "  Campanha Vida  ",
      descricao: "  Evento aberto  ",
      data: "2026-12-10",
      horario: "09:30",
      local: "  Belo Horizonte  "
    });
    expect(resultado.valido).toBe(true);
    expect(resultado.evento.nome).toBe("Campanha Vida");
    expect(resultado.evento.local).toBe("Belo Horizonte");
  });
});

describe("filtrarEventos", () => {
  const eventos = [
    { nome: "Mutirão de doação", local: "Belo Horizonte" },
    { nome: "Encontro de doadores", local: "Contagem" }
  ];

  it("pesquisa pelo nome ignorando acentos e letras maiúsculas", async () => {
    const { filtrarEventos } = await import("./eventos.js");
    expect(filtrarEventos(eventos, "MUTIRAO")).toEqual([eventos[0]]);
  });

  it("pesquisa também pelo local", async () => {
    const { filtrarEventos } = await import("./eventos.js");
    expect(filtrarEventos(eventos, "contagem")).toEqual([eventos[1]]);
  });
});
