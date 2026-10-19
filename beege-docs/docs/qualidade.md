# Plano de Qualidade de Software: BeeGe

Diretrizes, ferramentas e metricas para assegurar a corretude, manutenibilidade e desempenho do sistema em todas as suas camadas.

---

## 1. Ferramental de Qualidade

### 1.1 Analise Estatica e Tipagem
- **TypeScript:** Verificacao estrita de tipos em tempo de compilacao (`tsc --noEmit`), prevenindo erros de tipagem em chamadas de API, estados e propriedades de componentes.
- **ESLint:** Padronizacao do estilo de codigo e prevencao de antipadronizacoes no ecossistema React/Ionic.

### 1.2 Testes Automatizados
- **Testes Unitarios e de Componentes:** Executados com **Vitest** e **React Testing Library**, com foco na validacao isolada de regras de negocio (calculo de pontuacao, filtros por universidade) e componentes visuais (renderizador `MathRenderer`).
- **Testes de Integracao e E2E:** Estruturados com **Cypress** para simular a navegacao completa do aluno desde a autenticacao ate a submissao de exercicios e postagem no forum.

### 1.3 Integracao Continua (CI)
- Validacao automatica a cada submissao de Pull Request para a branch `main`:
  - Execucao de linter.
  - Compilacao sem erros do TypeScript.
  - Execucao da suite de testes unitarios.
  - Geracao do build estatico com o Vite.

---

## 2. Criterios de Aceitacao de Codigo

Para que uma funcionalidade seja considerada concluida (`Done`), deve atender aos seguintes criterios:

1. Codigo fonte livre de advertencias criticas do linter.
2. Compilacao limpa com `npm run build` com codigo de retorno 0.
3. Notacao matematica renderizada sem quebras de layout em dispositivos moveis (telas de 360px a 1080px).
4. Rotas e politicas de seguranca (RLS) devidamente aplicadas no banco de dados para evitar vazamento de postagens nao moderadas.

---

## 3. Metricas Alvo

| Metrica | Alvo Estabelecido | Mecanismo de Afericao |
|---|---|---|
| Sucesso de Compilacao | 100% dos builds em branch principal | Pipeline de CI / `npm run build` |
| Tempo de Carregamento Inicial | Abaixo de 1.5s em redes 4G | Google Lighthouse / DevTools |
| Cobertura de Regras de Negocio | Pelo menos 80% das funcoes de servico | Vitest Coverage Report |
| Erros de Renderizacao KaTeX | Zero erros nao tratados em tela | Logs e testes de regressao visual |
