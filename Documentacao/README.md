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