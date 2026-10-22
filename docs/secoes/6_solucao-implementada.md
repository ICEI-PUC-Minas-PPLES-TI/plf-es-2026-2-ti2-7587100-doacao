[⬅ Voltar ao índice](../README.md)

# Solução Implementada

Esta seção apresenta os detalhes da solução criada no projeto. O desenvolvimento está em andamento, e os itens abaixo são atualizados ao longo das sprints.

## Vídeo do Projeto

[PREENCHER: link do vídeo de apresentação do projeto, quando houver. Ele também deve ser listado em [`divulgacao/video`](../../divulgacao/video/README.md).]

## Funcionalidades

As funcionalidades seguem a priorização definida no [Product Design](3_product-design.md#priorização-de-requisitos).

| ID | Funcionalidade | Rota | Status |
| -- | -------------- | ---- | ------ |
| RF-01 | Cadastro e perfil do doador | `/perfil` | Em desenvolvimento |
| RF-02 | Pré-triagem online | `/doar` | Em desenvolvimento |
| RF-03 | Agendamento online | `/doar` | Em desenvolvimento |
| RF-04 | Alertas segmentados | — | A fazer |
| RF-05 | Localização de hemocentros | `/locais` | Em desenvolvimento |
| RF-13 | Eventos e campanhas (comunidade) | `/comunidade`, `/comunidade/cadastro`, `/comunidade/eventos/[id]` | Em desenvolvimento (Sprint 1, Lucas Asth) |

[PREENCHER: para cada funcionalidade entregue, descrever o que ela faz, as instruções de acesso e uma imagem da tela]

## Estruturas de Dados

Os dados ficam no MongoDB Atlas, em oito coleções. O modelo completo, com exemplos, está em [`codigo/src/lib/database_model.json`](../../codigo/src/lib/database_model.json).

| Coleção | Conteúdo | Principais campos |
| ------- | -------- | ----------------- |
| `usuarios` | Cadastro do usuário, com pré-triagens e conquistas embutidas | `nome`, `email`, `dataNascimento`, `sexo`, `tipoSanguineo`, `papeis`, `preferencias`, `preTriagens`, `conquistas` |
| `centros` | Hemocentros e hospitais que coletam sangue, com o estoque embutido | `nome`, `hospital`, `endereco`, `bairro`, `lat`, `lng`, `horarioFuncionamento`, `estoque` |
| `chamados` | Campanhas e pedidos de doação, separados pelo campo `tipo` | `tipo`, `titulo`, `centroId`, `tiposSanguineos`, `inicio`, `fim`, `urgente`, `status` |
| `doacoes` | Agendamento e doação no mesmo registro, diferenciados pelo `status` | `usuarioId`, `centroId`, `chamadoId`, `dataHora`, `status`, `volumeMl` |
| `publicacoes` | Feed, fórum e eventos da comunidade, separados pelo `tipo` | `tipo`, `autorId`, `texto`, `imagemUrl`, `curtidas`, `comentarios` |
| `chat` | Conversas do usuário com o assistente | `usuarioId`, `titulo`, `mensagens` |
| `quizzes` | Quizzes educativos | `titulo`, `questoes` |
| `conquistas` | Conquistas e o critério para obtê-las | `nome`, `descricao`, `criterio` |

Exemplo de documento da coleção `centros`:

```json
{
  "_id": "670000000000000000002001",
  "nome": "Hemocentro de Belo Horizonte",
  "hospital": false,
  "endereco": "Alameda Ezequiel Dias, 321",
  "bairro": "Santa Efigênia",
  "lat": -19.924653,
  "lng": -43.931722,
  "horarioFuncionamento": "Seg a sex, 7h às 18h. Sáb, 7h às 13h (entrada de doadores até 12h).",
  "estoque": { "A+": "BAIXO" },
  "estoqueAtualizadoEm": "2026-10-06T10:00:00Z"
}
```

## Módulos e APIs

Esta seção apresenta os módulos e APIs utilizados na solução.

| Propósito | Plataforma | Link |
| :-------- | :--------- | :--- |
| **Framework** | Next.js 16 (Pages Router) | [https://nextjs.org/](https://nextjs.org/) |
| **Biblioteca de UI** | React 19 | [https://react.dev/](https://react.dev/) |
| **Estilos** | Bootstrap 5 | [https://getbootstrap.com/](https://getbootstrap.com/) |
| **Ícones** | Bootstrap Icons | [https://icons.getbootstrap.com/](https://icons.getbootstrap.com/) |
| **Banco de dados** | MongoDB Atlas + driver oficial `mongodb` | [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas) |
| **Testes** | Vitest e Testing Library | [https://vitest.dev/](https://vitest.dev/) |
| **Qualidade** | ESLint (`eslint-config-next`) | [https://eslint.org/](https://eslint.org/) |

---

[⬅ Anterior: Metodologia](5_metodologia.md) | [⬅ Voltar ao índice](../README.md) | [Próximo: Referências Bibliográficas ➡](7_referencias.md)
