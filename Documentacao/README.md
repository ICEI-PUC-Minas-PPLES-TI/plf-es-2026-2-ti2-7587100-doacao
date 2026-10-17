# Introdução

Informações básicas do projeto.

* **Projeto:** DoAção
* **Disciplina:** Trabalho Interdisciplinar 2: Desenvolvimento Centrado no Usuário (Engenharia de Software, PUC Minas)
* **Repositório GitHub:** https://github.com/ICEI-PUC-Minas-PPLES-TI/plf-es-2026-2-ti2-7587100-doacao
* **Membros da equipe:**

  * [Arthur Reis Nametala](https://github.com/Nametala)
  * [Daniel Carneiro de Castro Santos](https://github.com/DanielSantos-lab44)
  * [Gabriel Faria Milan Procópio](https://github.com/GabrielFariaMilanProcopio)
  * [Lucas Araújo Asth](https://github.com/Lucasasth3)
  * [Lucas Fiúza Almeida](https://github.com/Lucasfiuza08)
  * [Matheus Henrique Castilho Ricoy Guerra](https://github.com/Cirker1226)

* **Professores:**

  * Rommel Vieira Carneiro
  * Cleiton Silva Tavares

A documentação do projeto é estruturada da seguinte forma:

1. Introdução
2. Contexto
3. Product Discovery
4. Product Design
5. Metodologia
6. Solução
7. Referências Bibliográficas

[Documentação de Design Thinking (MIRO)](https://miro.com/app/board/uXjVHyO4Fhk=/)

[Documentação de Design Thinking (PDF)](files/processo-dt.pdf)

# Contexto

O DoAção é uma aplicação que aproxima a população dos hemocentros do Brasil. A ideia é oferecer, de forma simples, as informações de que o doador precisa antes de sair de casa e avisá-lo quando a sua doação for realmente necessária.

A doação de sangue é um ato voluntário do qual dependem cirurgias, tratamentos de doenças crônicas e o atendimento a vítimas de acidentes. Como o sangue não pode ser fabricado e tem prazo de validade curto, os hemocentros precisam de um fluxo constante de doadores para manter os estoques em níveis seguros.

Em Minas Gerais, esse equilíbrio tem sido difícil de manter. Em agosto de 2026, a Fundação Hemominas alertou que os estoques estavam cerca de 45% abaixo do esperado no estado (G1, 2026), e o tipo O negativo chegou a ser classificado como crítico (ITATIAIA, 2026). Situações assim se repetem ao longo do ano e, quase sempre, a população só fica sabendo por campanhas pontuais compartilhadas nas redes sociais.

## Problema

Nas entrevistas realizadas, percebemos que a falta de sangue nos pontos de atendimento não é só falta de vontade de ajudar. Muita gente quer doar, mas adia ou desiste por falta de informação. Uma das entrevistadas, por exemplo, contou que viu uma campanha urgente e pesquisou o endereço do hemocentro, mas não foi por medo de descobrir, já no local, que um remédio que toma a impediria de doar.

O problema pode ser resumido assim:

> Potenciais doadores não sabem onde, quando e como doar, têm dúvidas sobre se estão aptos e não são avisados quando os estoques estão baixos. Por isso, deixam de doar ou doam apenas de forma esporádica, o que contribui para a falta de sangue nos hemocentros de Minas Gerais.

O problema aparece de formas diferentes para cada tipo de doador. Algumas pessoas deixam de ir por medo de não poder doar. Outras só se mobilizam quando alguém próximo precisa e, depois, não voltam. Já os doadores frequentes reclamaram de responder à mesma triagem a cada visita e de não receber avisos voltados ao seu tipo sanguíneo.

## Objetivos

**Objetivo geral:** aumentar a doação de sangue em Minas Gerais e no Brasil por meio da redução das barreiras de informação que dificultam a ida e a permanência dos doadores nos hemocentros.

Como objetivos específicos, o projeto busca:

- Permitir que o usuário verifique, antes de sair de casa, se está apto a doar, por meio de uma pré-triagem online;
- Facilitar a localização de hemocentros próximos e o agendamento da doação;
- Notificar os doadores de forma segmentada, de acordo com o tipo sanguíneo e o nível dos estoques;
- Explicar o processo de doação em linguagem simples, reduzindo o medo e a insegurança de quem nunca doou;
- Incentivar a recorrência das doações, mostrando ao doador o impacto das suas contribuições e quando ele poderá doar novamente.

## Justificativa

A escassez de sangue é um problema recorrente e com impacto direto na saúde pública: quando os estoques caem, cirurgias eletivas são adiadas e pacientes que dependem de transfusões ficam em risco. As notícias usadas como referência mostram que a situação em Minas Gerais chegou a níveis críticos em 2026 (G1, 2026; ITATIAIA, 2026; TV SIM BRASIL, 2026).

Ao mesmo tempo, as entrevistas mostraram pessoas dispostas a doar que não doam porque não recebem a informação no momento certo. Por isso, o grupo acredita que uma solução digital faz sentido aqui. Ela pode reunir informações que hoje estão espalhadas, tirar dúvidas que normalmente só são resolvidas na triagem presencial e ligar diretamente a necessidade dos hemocentros a quem pode ajudar. Mesmo um pequeno aumento no retorno dos doadores já faz diferença, porque cada doação pode ajudar mais de um paciente.

## Público-Alvo

O público-alvo do DoAção são pessoas residentes em Minas Gerais, que estão dentro da faixa etária permitida para doação (16 a 69 anos) e que têm acesso a um smartphone ou computador.

Dentro desse grupo, foram identificados três perfis principais, que deram origem às personas:

- **Doadores iniciantes ou eventuais**, que querem ajudar, mas têm dúvidas sobre o processo e sobre a própria aptidão;
- **Doadores mobilizados por uma necessidade específica**, como a de um familiar internado, que tendem a não voltar depois que essa necessidade passa;
- **Doadores recorrentes e engajados**, que já conhecem o processo e buscam agilidade e informações sobre o impacto das suas doações.

A solução também atende os hemocentros e hospitais, que passam a ter um canal para comunicar a necessidade de sangue a um público já interessado em doar.

# Product Discovery

## Etapa de Entendimento

Para compreender com maior profundidade o problema, o grupo seguiu o processo proposto pela disciplina, que combina Design Thinking e desenvolvimento ágil. Na etapa de empatia foram produzidos a matriz CSD, o mapa de stakeholders, o roteiro e as entrevistas qualitativas com doadores e profissionais da área, e os highlights de pesquisa. Todos os artefatos estão registrados no quadro do projeto no Miro.

A **Matriz de Alinhamento (CSD)** foi construída no início da fase de empatia. Nela, organizamos o que já sabíamos sobre o problema (certezas), o que achávamos, mas ainda não tínhamos confirmado (suposições), e o que precisávamos descobrir (dúvidas). As dúvidas e suposições serviram de base para o roteiro das entrevistas.

![Matriz CSD do projeto](images/matriz-csd.png)

## Etapa de Definição

### Personas

A partir das entrevistas qualitativas, foram construídas três personas, cada uma representando um dos perfis de público-alvo. Junto com cada uma, há um mapa de empatia que organiza o que ela pensa e sente, ouve, vê, fala e faz, além das suas dores e dos ganhos que espera. As figuras foram retiradas do quadro do projeto no Miro.

#### Persona 1: Camila


Camila tem 26 anos, é solteira e trabalha como analista de marketing em uma empresa de médio porte, com jornada cheia durante a semana. Por causa da profissão, nota e reage a campanhas compartilhadas nas redes sociais. Viu uma campanha urgente de doação no Instagram, pesquisou o endereço do hemocentro, mas adiou a ida por causa da semana cheia. Tem medo de agulha e ficou insegura sobre se um remédio que toma às vezes poderia impedir a doação, o que quase a fez desistir.

**Objetivos e necessidades:** quer ajudar diante de um pedido urgente, mas só aceita se deslocar se tiver a confirmação prévia de que está apta. Valoriza a solidariedade, mas precisa se sentir segura antes de agir e prefere indicações informais a canais oficiais.

![Persona e mapa de empatia da Camila](images/persona-camila.png)

| Dimensão | Descrição |
| -------- | --------- |
| **Pensa e sente** | Teme perder a viagem e está insegura sobre a própria elegibilidade. Quer ajudar, mas sem o risco de ser barrada. |
| **Ouve** | Amigos que já doaram e posts do Instagram. Nunca recebe um aviso oficial direto. |
| **Vê** | Campanhas compartilhadas sem explicação do processo, apenas com apelo de urgência. |
| **Fala e faz** | Pesquisa, mas adia. Pergunta a um amigo antes de agir sozinha. |
| **Dores** | O medo de agulha pesa na decisão, mesmo querendo ajudar; a incerteza sobre o remédio a faz temer perder a viagem; não sabe quanto tempo o processo consome; só fica sabendo de urgências por posts compartilhados, nunca por aviso direto. |
| **Ganhos** | Ajudar diante de um pedido urgente, desde que tenha confirmação prévia de que está apta; sentir-se parte de uma causa sem precisar se engajar formalmente. |

#### Persona 2: Marcos

Marcos tem 36 anos, é casado, tem ensino médio completo e trabalha há mais de dez anos no comércio local, com horário fixo durante a semana. Mora em um bairro residencial perto do hospital onde a esposa é atendida, em Belo Horizonte. Doou sangue com frequência até perto da pandemia, quando parou. Voltou a doar porque a esposa precisou, por indicação do hospital. Age rápido quando a necessidade aparece, sem planejar com antecedência, e prefere seguir a indicação de quem já resolveu o mesmo problema a pesquisar por conta própria.

**Objetivos e necessidades:** quer garantir sangue disponível para uma pessoa específica que conhece e resolver isso rápido, sem burocracia. Valoriza a lealdade a quem precisa dele, prefere praticidade a elaboração e confia em indicações diretas.

![Persona e mapa de empatia do Marcos](images/persona-marcos.png)

| Dimensão | Descrição |
| -------- | --------- |
| **Pensa e sente** | Quer resolver rápido, sem burocracia. Está preocupado apenas com a pessoa que precisa dele. |
| **Ouve** | A indicação direta do hospital. Não recebe nada de amigos ou redes sociais. |
| **Vê** | A rotina do hemocentro pela primeira vez em muito tempo, depois de anos afastado. |
| **Fala e faz** | Fala pouco, age rápido e segue quem o indicou sem questionar. |
| **Dores** | Não sabe se vai conseguir doar até chegar ao local; entrou no processo sem conhecer nenhuma etapa; perde o vínculo com a doação assim que a necessidade específica desaparece; o horário de trabalho fixo dificulta sair sem planejar. |
| **Ganhos** | Garantir sangue disponível para a pessoa que conhece; resolver rápido e sem burocracia. |

#### Persona 3: Eduardo

Eduardo tem 52 anos, é casado, mora em Belo Horizonte e é educador em saúde pública. Já doou sangue mais de 30 vezes e dá palestras semanais corrigindo mitos sobre a doação. Relativiza o próprio desconforto físico diante do impacto que a doação causa. Pensa o problema de forma sistêmica: critica a gestão institucional, mas elogia a equipe de atendimento.

**Objetivos e necessidades:** quer ver o impacto direto e mensurável das suas doações e saber quando o seu tipo sanguíneo está em falta. Também quer transformar o próprio engajamento em alcance, levando informação a quem está fora do meio da doação, e ver a gestão do hemocentro aproveitar melhor o tempo dos doadores recorrentes. Valoriza impacto mensurável, coerência entre discurso e prática e reconhecimento de quem trabalha bem.

![Persona e mapa de empatia do Eduardo](images/persona-eduardo.png)

| Dimensão | Descrição |
| -------- | --------- |
| **Pensa e sente** | Quer que o seu esforço tenha impacto visível. Incomoda-se com uma gestão que desperdiça engajamento como o dele. |
| **Ouve** | Elogios e dúvidas de quem assiste às suas palestras e críticas informais sobre a gestão do hemocentro. |
| **Vê** | Sala de espera ociosa, campanhas genéricas e uma equipe de atendimento que considera boa, apesar da gestão. |
| **Fala e faz** | Corrige mitos em público, usa a própria experiência como argumento e critica a gestão abertamente. |
| **Dores** | Recebe só campanhas genéricas quando queria alertas específicos para o seu tipo sanguíneo; vê o tempo da sala de espera desperdiçado; responde ao mesmo questionário de triagem a cada visita; vê pessoas fora do meio da doação sem acesso a nenhuma informação. |
| **Ganhos** | Ver o impacto direto da própria doação; levar informação a quem está fora do meio da doação; reconhecimento de quem trabalha bem e coerência entre discurso e prática. |

#### Síntese das personas

Apesar de perfis diferentes, as três personas compartilham uma mesma necessidade: receber a informação certa no momento certo. Camila precisa saber se está apta antes de sair de casa; Marcos precisa saber se vai conseguir doar antes de sair e de um motivo para continuar doando quando a necessidade da esposa passar; Eduardo precisa de agilidade e de avisos direcionados ao seu tipo sanguíneo. Foi essa conclusão que guiou a proposta de valor do DoAção e, a partir dela, os requisitos apresentados a seguir.