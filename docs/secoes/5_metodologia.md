[⬅ Voltar ao índice](../README.md)

# Metodologia

Detalhes sobre a organização do grupo e o ferramental empregado. A relação completa das ferramentas está no [índice da documentação](../README.md#ferramentas).

## Abordagem de Trabalho

O projeto segue o processo proposto pela disciplina, que combina Design Thinking e desenvolvimento ágil.

Na fase de **Design Thinking**, passamos pelas etapas de:

- **Empatia:** matriz CSD, mapa de stakeholders, roteiro e entrevistas qualitativas, highlights de pesquisa;
- **Definição:** personas, mapas de empatia e proposta de valor;
- **Ideação:** requisitos e priorização;
- **Prototipagem:** wireframes, user flow e protótipo interativo.

Na fase de **desenvolvimento ágil**, o sistema será construído em três sprints:

1. **Sprint 1:** layout e cadastros;
2. **Sprint 2:** fluxos principais (pré-triagem, agendamento e alertas);
3. **Sprint 3:** integração, testes e avaliação final, seguida da implantação e da apresentação.

A equipe se reúne toda semana, presencialmente ou online, para revisar o andamento das tarefas e dividir as próximas. No dia a dia, a comunicação acontece pelo grupo de WhatsApp e pelo Discord (com transmissão pelo Google Meet).

## Gerenciamento do Projeto

### Divisão de Papéis

Todos os integrantes participaram das atividades coletivas no Miro. A tabela abaixo mostra as principais contribuições de cada um e o papel previsto para a fase de desenvolvimento.

| Integrante | Principais contribuições | Papel no desenvolvimento |
| ---------- | ------------------------ | ------------------------ |
| Arthur Reis Nametala | Condução das etapas de Design Thinking; entrevistas qualitativas; apoio na criação dos wireframes. | Banco de dados e Front-end |
| Daniel Carneiro de Castro Santos | Entrevistas qualitativas; elaboração do pitch deck e da apresentação; organização das reuniões da equipe. | Back-end e API |
| Gabriel Faria Milan Procópio | Matriz CSD e mapa de stakeholders; apoio na consolidação dos requisitos. | Banco de dados |
| Lucas Araújo Asth | Entrevistas qualitativas; descrição do minimundo. | Back-end e API |
| Lucas Fiúza Almeida | Entrevistas qualitativas; documentação do projeto. | Documentação e testes |
| Matheus Henrique Castilho Ricoy Guerra | Responsável pelos wireframes e pelo protótipo no Figma. | Front-end e UI |

### Quadro Kanban

As tarefas são acompanhadas em um quadro Kanban no GitHub Projects, vinculado ao repositório do projeto, com as colunas **A fazer**, **Em andamento** e **Concluído**. Cada tarefa é registrada como uma issue no repositório, com descrição e responsáveis.

- Quadro Kanban: https://github.com/orgs/ICEI-PUC-Minas-PPLES-TI/projects/914
- Issues: https://github.com/ICEI-PUC-Minas-PPLES-TI/plf-es-2026-2-ti2-7587100-doacao/issues

[PREENCHER: incluir uma captura de tela atual do quadro em `docs/images/kanban.png` e exibi-la aqui com `![Kanban do projeto](../images/kanban.png)`]

Situação do quadro no momento da entrega da fase de Concepção:

| Status | Tarefa | Responsáveis |
| ------ | ------ | ------------ |
| A fazer | Sprint 1: layout responsivo e cadastros (RF-01) | Front-end e back-end |
| A fazer | Sprint 2: pré-triagem, agendamento e alertas (RF-02 a RF-05) | Equipe |
| A fazer | Sprint 3: funcionalidades importantes, integração e testes | Equipe |
| A fazer | Implantação em plataforma PaaS | Back-end |
| A fazer | Apresentação final | Equipe |
| Concluído | Matriz CSD e mapa de stakeholders | Gabriel e equipe |
| Concluído | Roteiro e entrevistas qualitativas | Arthur, Daniel, Lucas Asth e Lucas Fiúza |
| Concluído | Highlights de pesquisa, personas e mapas de empatia | Equipe |
| Concluído | Proposta de valor, requisitos e priorização | Equipe |
| Concluído | Wireframes | Matheus e Arthur |
| Concluído | User flow e protótipo interativo | Matheus e Arthur |
| Concluído | Descrição do minimundo | Lucas Asth |
| Concluído | Pitch deck e apresentação | Daniel |
| Concluído | Documentação do projeto | Lucas Fiúza |
| Concluído | Organização do repositório, issues e Project Board | Equipe |

### Gestão de Configuração

O código e a documentação são versionados neste repositório no GitHub. As mensagens de commit seguem o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/) (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`), e cada aluno mantém o seu módulo individual por sprint em `codigo/public/modulos/<Aluno>-sprintN`.

---

[⬅ Anterior: Minimundo](4_minimundo.md) | [⬅ Voltar ao índice](../README.md) | [Próximo: Solução Implementada ➡](6_solucao-implementada.md)
