# Cadastro e gerenciamento de eventos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar um módulo funcional e responsivo para cadastrar, listar, pesquisar, editar e excluir eventos da comunidade.

**Architecture:** Um aplicativo Next.js ficará em `Codigo`, reutilizando a navegação do template compartilhado. Regras puras e persistência local ficarão separadas dos componentes React, e os dados públicos do aluno ficarão na pasta obrigatória `Codigo/public/modulos/Lucas-asth-sprint1`.

**Tech Stack:** Next.js, React, CSS, Vitest, Testing Library e localStorage.

**Spec:** `docs/superpowers/specs/2026-10-12-cadastro-eventos.md`

## Global Constraints
- Repositório oficial: `ICEI-PUC-Minas-PPLES-TI/plf-es-2026-2-ti2-7587100-doacao`.
- Aplicação dentro de `Codigo`.
- Pasta obrigatória: `Codigo/public/modulos/Lucas-asth-sprint1`.
- Campos obrigatórios: nome, data, horário e local.
- Somente o autor pode editar ou excluir.
- A interface deve funcionar em celular, tablet e computador.

## Review Focus
- Rejeitar campos contendo somente espaços.
- Ignorar maiúsculas, minúsculas e acentos na pesquisa.
- Tratar dados inválidos no localStorage.
- Bloquear edição e exclusão por outro usuário.
- Não duplicar eventos após salvar.

---

### Task 1: Base Next.js e módulo público

**Files:** `Codigo/package.json`, páginas base, estilos globais e `Codigo/public/modulos/Lucas-asth-sprint1`.

- [ ] Configurar scripts, navegação e dados iniciais.
- [ ] Confirmar que a aplicação inicia e abre Comunidade.
- [ ] Commit: `chore: estrutura modulo de eventos da sprint 1`.

### Task 2: Regras e persistência de eventos

**Files:** `Codigo/src/modules/lucas-asth-sprint1/eventRules.js`, `eventRepository.js` e testes.

**Interfaces:** `validateEvent(input)`, `filterEvents(events, query)`, `canManageEvent(event, userId)` e `createEventRepository(storage)`.

- [ ] Escrever testes falhando para validação, busca e autoria.
- [ ] Implementar o mínimo necessário e executar os testes.
- [ ] Escrever testes falhando para persistência e dados corrompidos.
- [ ] Implementar o repositório e executar a suíte.
- [ ] Commit: `feat: adiciona regras e persistencia de eventos`.

### Task 3: Interface de cadastro e gerenciamento

**Files:** página Comunidade, componentes de cartão, formulário e lista, CSS responsivo e teste de integração.

- [ ] Escrever teste falhando do cadastro e validação.
- [ ] Implementar página e formulário.
- [ ] Escrever teste falhando de edição, exclusão e autoria.
- [ ] Implementar ações, confirmação e mensagens.
- [ ] Executar testes e revisar responsividade.
- [ ] Commit: `feat: implementa cadastro e gerenciamento de eventos`.

### Task 4: Acabamento e entrega

**Files:** `Codigo/README.md` e `Entrega/Lucas-asth-sprint1`.

- [ ] Rodar lint, testes e build.
- [ ] Registrar instruções e cenários testados.
- [ ] Capturar as telas finais.
- [ ] Preencher o documento de avaliação com quatro cenários.
- [ ] Gerar o ZIP sem `node_modules`.
- [ ] Commit: `docs: prepara entrega individual da sprint 1`.

