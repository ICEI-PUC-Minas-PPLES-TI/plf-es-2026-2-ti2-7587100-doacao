import { describe, expect, it } from "vitest";
import { createEventRepository } from "./eventRepository";

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => { data[key] = value; }
  };
}

describe("createEventRepository", () => {
  it("retorna a lista inicial quando não há dados salvos", () => {
    const repo = createEventRepository(memoryStorage(), [{ id: "1", nome: "Inicial" }]);
    expect(repo.list()).toEqual([{ id: "1", nome: "Inicial" }]);
  });

  it("recupera dados corrompidos sem derrubar a tela", () => {
    const repo = createEventRepository(memoryStorage({ "doacao:eventos": "inválido" }), [{ id: "1" }]);
    expect(repo.list()).toEqual([{ id: "1" }]);
  });

  it("cria, atualiza e exclui sem duplicar registros", () => {
    const repo = createEventRepository(memoryStorage(), []);
    repo.save({ id: "1", nome: "Evento" });
    repo.save({ id: "1", nome: "Evento repetido" });
    expect(repo.list()).toHaveLength(1);
    repo.update("1", { nome: "Atualizado" });
    expect(repo.list()[0].nome).toBe("Atualizado");
    repo.remove("1");
    expect(repo.list()).toEqual([]);
  });
});
