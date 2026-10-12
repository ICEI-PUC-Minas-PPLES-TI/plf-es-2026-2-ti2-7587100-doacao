import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import EventForm from "./EventForm";

describe("EventForm", () => {
  it("mostra os quatro erros obrigatórios e não envia formulário inválido", () => {
    const onSave = vi.fn();
    render(<EventForm onSave={onSave} onCancel={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /salvar evento/i }));
    expect(screen.getByText("Informe o nome do evento.")).toBeVisible();
    expect(screen.getByText("Informe a data.")).toBeVisible();
    expect(screen.getByText("Informe o horário.")).toBeVisible();
    expect(screen.getByText("Informe o local.")).toBeVisible();
    expect(onSave).not.toHaveBeenCalled();
  });
});
