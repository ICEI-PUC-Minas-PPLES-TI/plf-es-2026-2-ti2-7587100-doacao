# Código do Projeto

Este diretório mantém todo o código-fonte do DoAção, uma aplicação web construída com [Next.js](https://nextjs.org/) (Pages Router), [React](https://react.dev/), [Bootstrap](https://getbootstrap.com/) e [MongoDB Atlas](https://www.mongodb.com/atlas).

## Estrutura de diretórios

```
codigo/
├── public/                 # Arquivos estáticos (logo, imagens)
│   └── modulos/            # Módulos individuais de cada aluno por sprint
│       └── <Aluno>-sprint1/
├── src/
│   ├── components/         # Componentes reutilizáveis (NavbarSuperior, MobileSidebar)
│   ├── lib/                # Acesso ao banco (mongodb.js) e modelo de dados (database_model.json)
│   ├── pages/              # Rotas da aplicação (/, /comunidade, /doar, /locais, /perfil)
│   └── styles/             # CSS global e CSS Modules
├── .env.example            # Modelo das variáveis de ambiente
├── jsconfig.json           # Alias de imports
└── package.json
```

## Executar

1. Entre na pasta `codigo`.
2. Execute `npm install`.
3. Copie `.env.example` para `.env.local` e preencha `MONGODB_URI` e `MONGODB_DB`.
4. Execute `npm run dev`.
5. Abra `http://localhost:3000`.

## Testar

- `npm test`
- `npm run lint`
- `npm run build`

## Módulos por sprint

| Sprint | Aluno | Módulo | Pasta |
| ------ | ----- | ------ | ----- |
| 1 | Lucas Araújo Asth | Cadastro e gerenciamento de eventos da comunidade (`/comunidade`) | [`public/modulos/Lucas-asth-sprint1`](public/modulos/Lucas-asth-sprint1/) |
| 1 | Arthur Reis Nametala | Em desenvolvimento | [`public/modulos/Arthur-Nametala-sprint1`](public/modulos/Arthur-Nametala-sprint1/) |
| 1 | Daniel Carneiro de Castro Santos | Em desenvolvimento | [`public/modulos/Daniel-Carneiro-sprint1`](public/modulos/Daniel-Carneiro-sprint1/) |
| 1 | Gabriel Faria Milan Procópio | Em desenvolvimento | [`public/modulos/Gabriel-Faria-sprint1`](public/modulos/Gabriel-Faria-sprint1/) |
| 1 | Lucas Fiúza Almeida | Em desenvolvimento | [`public/modulos/Lucas-Fiuza-sprint1`](public/modulos/Lucas-Fiuza-sprint1/) |
| 1 | Matheus Henrique Castilho Ricoy Guerra | Em desenvolvimento | [`public/modulos/Matheus-Henrique-sprint1`](public/modulos/Matheus-Henrique-sprint1/) |
