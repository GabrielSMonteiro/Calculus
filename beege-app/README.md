# BeeGe: Mobile e Web App

Aplicativo multiplataforma (Android, iOS e Web) do **BeeGe**, desenvolvido com **Ionic Framework**, **React 19**, **TypeScript** e encapsulado com **Capacitor**.

---

## Funcionalidades Implementadas

- **Autenticacao e Perfis (`/login`):**
  - Cadastro com email, senha e nome do estudante.
  - Autenticacao integrada ao Supabase Auth.
  - Modo local de demonstracao com alternancia rápida entre perfis de Aluno e Administrador.
- **Segmentacao Multi-Universidade (`/universidades`):**
  - Selecao e alternancia da instituicao de ensino (USP, UFMG, UFRJ).
  - Filtragem dinamica de modulos e questoes de acordo com a universidade ativa.
- **Painel de Modulos de Calculo 1 (`/dashboard`):**
  - Listagem dos topicos da ementa (Limites, Derivadas, Regra da Cadeia, Regra de L'Hopital, Integrais Indefinidas).
  - Notas de estudo e lembretes pedagogicos da mascote Limia.
- **Revisao Teorica com KaTeX (`/topico/:id`):**
  - Renderizacao precisa de formulas matematicas em LaTeX (limites, derivadas, integrais e fracoes).
  - Explicacao analitica e condicoes de contorno dos teoremas.
- **Simulador e Pratica de Questoes (`/pratica`):**
  - Questoes de multipla escolha extraidas de padroes de provas universitarias.
  - Indicador imediato de acerto ou erro.
  - Explicacao passo a passo do gabarito em LaTeX.
  - Contador de desempenho e barra de conclusao.
- **Forum Academico (`/forum`):**
  - Publicacao de duvidas com suporte a sintaxe LaTeX.
  - Envio de respostas e discussoes encadeadas.
  - Controle de moderacao para aprovacao de novas postagens.
- **Painel Administrativo (`/admin`):**
  - Cadastro de topicos com visualizacao previa de formulas.
  - Cadastro de exercicios com alternativas e resolucao comentada.
  - Painel de moderacao de postagens pendentes.

---

## Tecnologias

- **Interface:** Ionic Framework com React 19
- **Linguagem e Ferramental:** TypeScript e Vite
- **Empacotamento Mobile:** Capacitor
- **Motor de Renderizacao Matematica:** KaTeX
- **Backend Gerenciado:** Supabase

---

## Como Executar

```bash
cd beege-app
npm install --legacy-peer-deps
npm run dev
```
Acesse em `http://localhost:5173`.

---

## Compilacao para Producao e Mobile

```bash
npm run build
npx cap sync
npx cap open android
```
