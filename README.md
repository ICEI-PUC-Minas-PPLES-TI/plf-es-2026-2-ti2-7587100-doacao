# DoAção

O objetivo do DoAção é aumentar a doação de sangue em Minas Gerais por meio da redução das barreiras de informação que dificultam a ida e a permanência dos doadores nos hemocentros.

A proposta é oferecer, de forma simples e acessível, informações sobre a elegibilidade para doação, o processo de atendimento e a necessidade atual dos estoques. Dessa forma, o projeto busca preparar o doador antes de sua ida ao hemocentro, reduzir dúvidas e inseguranças e facilitar a decisão de doar. Além disso, o DoAção pretende manter o doador informado sobre os momentos em que sua doação é necessária, fortalecendo a recorrência das doações e aproximando a população das necessidades dos hemocentros.

## Alunos integrantes da equipe

* Arthur Reis Nametala
* Daniel Carneiro de Castro Santos
* Gabriel Faria Milan Procópio
* Lucas Araújo Asth
* Lucas Fiúza Almeida
* Matheus Henrique Castilho Ricoy Guerra

## Professores responsáveis

* Rommel Vieira Carneiro
* Cleiton Silva Tavares

## Estrutura do repositório

| Pasta / arquivo | Conteúdo |
| --------------- | -------- |
| [`codigo/`](codigo/README.md) | Código-fonte da aplicação (Next.js + MongoDB Atlas). |
| [`docs/`](docs/README.md) | Documentação completa do projeto, dividida em seções. |
| [`divulgacao/`](divulgacao/) | Apresentações e vídeos de divulgação do projeto. |
| [`CITATION.cff`](CITATION.cff) | Descritor do projeto, usado na geração do certificado da disciplina. |

## Instruções de utilização

Pré-requisitos: [Node.js](https://nodejs.org/) 20 ou superior e acesso a um banco MongoDB (Atlas ou local).

1. Entre na pasta do código:

   ```bash
   cd codigo
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Copie o arquivo `.env.example` para `.env.local` e preencha `MONGODB_URI` (com usuário e senha do banco) e `MONGODB_DB`.

4. Inicie o servidor de desenvolvimento e acesse `http://localhost:3000`:

   ```bash
   npm run dev
   ```

Outros comandos disponíveis: `npm test` (testes com Vitest), `npm run lint` (ESLint), `npm run build` e `npm start` (build e execução em produção). Mais detalhes em [`codigo/README.md`](codigo/README.md).
