# Plano de Gestao de Riscos: BeeGe

Identificacao, avaliacao de probabilidade e impacto, e definicao de planos de acao preventivos e corretivos para os riscos do projeto.

---

## Matriz de Riscos

| ID | Risco Identificado | Categoria | Probabilidade | Impacto | Estrategia de Mitigacao | Plano de Contingencia |
|---|---|---|---|---|---|---|
| R01 | Exaustao dos limites do plano gratuito (Free Tier) do Supabase | Infraestrutura | Media | Alto | Otimizar chamadas com cache local no aplicativo, paginar consultas do forum e evitar salvar imagens pesadas no banco. | Ativar camada de persistencia local indexada (IndexedDB/Storage) para leitura offline. |
| R02 | Falhas ou distorcoes na renderizacao de formulas KaTeX em telas pequenas | Usabilidade | Media | Alto | Isolar o componente `MathRenderer` com overflow horizontal controlado e testes em resolucoes de 360px. | Exibir fallback com codigo LaTeX legivel em formatacao monospacada caso ocorra erro de sintaxe. |
| R03 | Degradacao de desempenho no WebView em aparelhos Android de entrada | Desempenho | Baixa | Medio | Utilizar componentes nativos do Ionic, evitar estilizacoes desnecessarias e realizar profiling com DevTools. | Desativar animacoes secundarias em dispositivos com baixa capacidade de processamento. |
| R04 | Publicacao de conteudos inadequados ou descontextualizados no forum | Seguranca | Media | Medio | Implementar fluxo estrito de moderacao onde postagens de alunos entram como `pendente` antes de liberacao. | Ferramenta rapida de rejeicao e banimento de usuario no Painel Admin. |
| R05 | Divergencia entre professores quanto a ementa ou ordem dos topicos de Calculo 1 | Negocio / Escopo | Alta | Baixo | Adotar a ementa oficial padrao do departamento de matematica de cada instituicao parceira. | Permitir navegacao livre e busca textual entre qualquer topico da disciplina. |
