# Cronograma e Roadmap do MVP: BeeGe

Planejamento temporal das sprints de desenvolvimento ate a entrega formal do Produto Minimo Viavel (MVP).

- **Data de Inicio:** 20 de Setembro de 2026
- **Data Alvo do MVP:** 19 de Outubro de 2026
- **Duracao das Sprints:** Ciclos semanais (Scrum adaptado)

---

## Sprint 0: Fundacao e Planejamento (20/09 a 23/09)
- [x] Levantamento de requisitos e casos de uso do sistema.
- [x] Estruturacao modular dos tres repositorios (`beege-docs`, `beege-app`, `beege-api`).
- [x] Configuracao do ambiente de documentacao técnica com MkDocs Material.
- [x] Definicao da identidade visual, mascote Limia e paleta cromatica.

---

## Sprint 1: Infraestrutura e Autenticacao (24/09 a 30/09)
- [x] Modelagem do esquema relacional de dados (PostgreSQL no Supabase).
- [x] Implementacao das politicas de Row Level Security (RLS) e triggers automaticos de perfil.
- [x] Configuracao do cliente Supabase e contexto global de autenticacao (`AuthContext`).
- [x] Desenvolvimento da interface de autenticacao (`/login`) com suporte a modo local/mock.

---

## Sprint 2: Conteudo, Teoria e Painel Administrativo (01/10 a 07/10)
- [x] Implementacao do filtro multi-universidade (`/universidades`).
- [x] Desenvolvimento do painel administrativo (`/admin`) com abas para gestao de topicos e questoes.
- [x] Integracao do motor KaTeX (`MathRenderer`) para renderizacao de formulas matematicas em tempo real.
- [x] Desenvolvimento da pagina de leitura teorica (`/topico/:id`).

---

## Sprint 3: Pratica, Forum e Integracao da Mascote (08/10 a 13/10)
- [x] Implementacao do simulador interativo de questoes (`/pratica`) com correcao automatica e resolucao analitica.
- [x] Desenvolvimento do forum academico (`/forum`) com criacao de topicos, respostas encadeadas e moderacao.
- [x] Integracao visual e pedagogica da mascote oficial Limia em componentes e alertas de estudo.
- [x] Carga inicial de dados (`seed.sql`) com topicos e questoes reais da UnB.

---

## Sprint 4: Homologacao, Compilacao e Entrega (14/10 a 19/10)
- [x] Expansao do banco de questoes para 24 itens completos com gabarito e explicacao analitica KaTeX (meta MVP 20+ superada).
- [x] Implementacao da persistencia de progresso do estudante via `ProgressService` (streak, taxa de acertos, meta diaria e conquistas no perfil).
- [x] Integracao do motor de dicas contextuais e dinamicas da mascote Limia (`limiaTips`) no Dashboard, Teoria, Pratica, Forum e Perfil.
- [x] Blindagem de seguranca de rotas com `ProtectedRoute` e guarda de acesso administrativo (`AdminGuard`).
- [x] Fluxo de moderacao previa de postagens no forum academico com visibilidade para o autor e painel do moderador.
- [x] Suite de testes unitarios automatizados com Vitest e React Testing Library (17 testes passando com 100% de sucesso).
- [x] Execucao de testes de compilacao com TypeScript e Vite (`npm run build` gerando bundle de producao).
- [x] Sincronizacao dos artefatos mobile com o container nativo Capacitor.
- [x] Entrega formal do MVP e encerramento do ciclo com total conformidade.
