# Metodologia de Trabalho: BeeGe

Abordagem metodologica adotada no desenvolvimento do projeto, detalhando o framework de gestao, organizacao de ciclos e praticas de engenharia.

---

## 1. Scrum Adaptado

Considerando o cronograma objetivo com entrega final do MVP fixada em **19 de Outubro de 2026**, adotou-se uma variacao pragmatica do framework Scrum com ciclos semanais:

- **Sprints de 1 Semana:** Permitem iteracoes curtas com foco em entregas incrementais e validacao contínua de funcionalidades.
- **Planejamento de Sprint:** Reuniao inicial para selecao de historias do backlog prioritarias e divisao de tarefas tecnicas.
- **Revisao e Retrospectiva:** Avaliacao dos entregaveis concluidos ao termino de cada sprint, com analise de gargalos tecnicos e ajustes para a iteracao seguinte.
- **Kanban Integrado:** Gestao visual do fluxo de desenvolvimento atraves dos estados padrao: `Backlog`, `To Do`, `In Progress`, `Review` e `Done`.

---

## 2. Divisao de Responsabilidades

| Papel | Atribuicoes |
|---|---|
| Product Owner (PO) | Definicao de prioridades do backlog, validacao de requisitos com o publico universitario e aceite das entregas. |
| Tech Lead / Desenvolvedor | Implementacao da arquitetura cliente-servidor, desenvolvimento do aplicativo mobile/web, modelagem do Supabase e garantia de qualidade de codigo. |
| Orientador Pedagogico | Revisao da exatidao formal dos enunciados de Calculo 1 e correspondencia com as ementas da UnB e demais universidades. |

---

## 3. Praticas de Engenharia de Software

- **Arquitetura Modular:** Separacao rigorosa entre documentacao (`beege-docs`), aplicacao cliente (`beege-app`) e infraestrutura de dados (`beege-api`).
- **Controle de Versao Semantico:** Adoção de Conventional Commits para padronizar historicos de alteracao no Git.
- **Resiliencia Local:** Implementacao de camada de dados mockada integrada para garantir operacao e testes continuos mesmo em situacoes de instabilidade de rede ou chave de API ausente.
- **Design-First com KaTeX:** Priorizacao da fidelidade visual de equacoes matematicas desde a concepcao dos componentes visuais.
