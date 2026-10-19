# BeeGe API e Banco de Dados (Supabase)

Infraestrutura de backend, esquemas relacionais PostgreSQL, migracoes versionadas, politicas de controle de acesso (Row Level Security - RLS) e carga inicial de dados para a plataforma **BeeGe**.

---

## Modelagem do Banco de Dados

O banco de dados relacional e gerenciado no **Supabase** e contempla as seguintes entidades:

- `profiles`: Dados cadastrais e nivel de acesso (aluno ou admin), vinculados a tabela `auth.users`.
- `universidades`: Instituicoes de ensino superior cadastradas (UnB, UFMG, USP, entre outras).
- `topicos`: Modulos de conteudo teorico de Calculo 1, com suporte a notacao LaTeX.
- `questoes`: Exercicios de multipla escolha com alternativas, gabarito, explicacao detalhada e nivel de dificuldade.
- `progresso_aluno`: Rastreamento de questoes respondidas e indice de acerto por estudante.
- `postagens`: Topicos de discussao do forum academico, com estados de moderacao (`pendente`, `aprovada`, `reprovada`).
- `comentarios`: Respostas associadas a cada postagem do forum.

---

## Politicas de Seguranca (Row Level Security - RLS)

Todas as tabelas possuem politicas de seguranca ativas:
- **Topicos e Universidades:** Leitura publica para usuarios autenticados; criacao e alteracao restritas a usuarios com papel `admin`.
- **Forum Comunitario:** Alunos visualizam postagens com status `aprovada` ou postagens de sua propria autoria; administradores visualizam todas as postagens para moderacao.
- **Progresso do Aluno:** Cada estudante acessa e atualiza exclusivamente seu proprio historico de questoes.

---

## Aplicacao de Migracoes e Carga Inicial

### 1. Via Supabase CLI (Ambiente Local)
```bash
supabase link --project-ref seu-project-ref
supabase db push
supabase db reset
```

### 2. Via Supabase Dashboard (Editor SQL Web)
1. Acesse o painel do seu projeto no Supabase.
2. Navegue ate **SQL Editor** -> **New Query**.
3. Execute o script `supabase/migrations/20261015000000_init_schema.sql` para criar tabelas, triggers e politicas de RLS.
4. Execute o script `supabase/seed.sql` para carregar universidades, modulos de Calculo 1 e questoes de teste.

---

## Variaveis de Ambiente para o Frontend

No diretorio `beege-app`, defina no arquivo `.env.local`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```
