# Cadastro e gerenciamento de eventos — Especificação

## Objetivo
Implementar a funcionalidade individual da Sprint 1 referente ao cadastro e gerenciamento de eventos da comunidade, conforme a Issue #22 e o protótipo do projeto DoAção.

## Estrutura
- O aplicativo Next.js ficará em `Codigo`.
- O código executável ficará em `Codigo/src`.
- A pasta obrigatória do aluno será `Codigo/public/modulos/Lucas-asth-sprint1`.
- Essa pasta conterá dados públicos iniciais e uma identificação do módulo; os componentes React não serão colocados em `public`, pois arquivos nessa pasta não são compilados pelo Next.js.

## Escopo funcional
- Exibir a página Comunidade com as abas Feed, Eventos e Fórum.
- Listar e pesquisar eventos.
- Abrir formulário para criar evento.
- Validar nome, data, horário e local como obrigatórios.
- Permitir editar e excluir somente eventos criados pelo usuário atual.
- Solicitar confirmação antes da exclusão.
- Exibir mensagens de sucesso e erros de validação.
- Persistir os eventos no navegador para que a entrega funcione sem infraestrutura externa.
- Mostrar nome, data, horário, local e total de participantes nos cartões.
- Manter a interface responsiva e próxima do protótipo enviado.

## Dados
Cada evento terá `id`, `nome`, `descricao`, `data`, `horario`, `local`, `participantes` e `autorId`.

O identificador demonstrativo do usuário atual será `lucas`. A persistência local será isolada em um repositório de dados, permitindo substituição posterior por API e MongoDB.

## Fora do escopo desta primeira entrega
Autenticação real, API remota, MongoDB ativo e inscrição em eventos.

## Verificação
Testes das regras e dos fluxos, lint, build e conferência visual responsiva.

