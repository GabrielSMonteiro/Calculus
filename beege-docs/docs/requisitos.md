# Documento de Requisitos (RF e RNF): BeeGe

Especificacao dos requisitos funcionais e nao-funcionais do sistema, categorizados por prioridade (Essencial, Importante e Desejavel).

---

## 1. Requisitos Funcionais (RF)

| ID | Descricao | Ator | Prioridade |
|---|---|---|---|
| RF01 | O sistema deve permitir o cadastro de novos usuarios com nome, email e senha. | Aluno / Admin | Essencial |
| RF02 | O sistema deve autenticar usuarios com credenciais cadastradas e gerenciar sessoes. | Aluno / Admin | Essencial |
| RF03 | O usuario deve poder selecionar e alternar a universidade ativa para filtrar os conteudos. | Aluno | Essencial |
| RF04 | O sistema deve listar sequencialmente os modulos teoricos da instituicao selecionada. | Aluno | Essencial |
| RF05 | O sistema deve exibir o conteudo teorico completo com formulas renderizadas em KaTeX. | Aluno | Essencial |
| RF06 | O sistema deve disponibilizar exercicios de multipla escolha associados a cada topico. | Aluno | Essencial |
| RF07 | O sistema deve avaliar a alternativa selecionada pelo aluno de forma imediata (acerto/erro). | Aluno | Essencial |
| RF08 | O sistema deve exibir a explicacao analitica comentada com notacao LaTeX apos a resposta. | Aluno | Essencial |
| RF09 | O sistema deve registrar a pontuacao de acertos e o progresso da lista de exercicios. | Aluno | Essencial |
| RF10 | O sistema deve permitir a criacao de postagens no forum da universidade com suporte a LaTeX. | Aluno | Importante |
| RF11 | O sistema deve permitir a publicacao de respostas e comentarios em postagens do forum. | Aluno | Importante |
| RF12 | O painel administrativo deve permitir criar, editar e excluir modulos teoricos. | Admin | Essencial |
| RF13 | O painel administrativo deve permitir criar questoes com alternativas e gabarito. | Admin | Essencial |
| RF14 | O painel administrativo deve permitir a moderacao (aprovacao ou rejeicao) de duvidas do forum. | Admin | Essencial |
| RF15 | O sistema deve exibir orientacoes e observacoes conceituais associadas a mascote Limia. | Aluno | Importante |

---

## 2. Requisitos Nao-Funcionais (RNF)

| ID | Descricao | Categoria | Prioridade |
|---|---|---|---|
| RNF01 | O aplicativo deve operar em Android e iOS a partir de base unica via Capacitor e Ionic. | Portabilidade | Essencial |
| RNF02 | O idioma padrao de interface e dos conteudos do sistema e o Portugues do Brasil (pt-BR). | Localizacao | Essencial |
| RNF03 | O sistema deve renderizar formulas matematicas no cliente de forma fluida utilizando KaTeX. | Usabilidade | Essencial |
| RNF04 | O backend deve utilizar PostgreSQL hospedado no Supabase com politicas de seguranca (RLS). | Arquitetura | Essencial |
| RNF05 | Senhas de usuarios e tokens de sessao devem ser criptografados conforme o padrao do Supabase Auth. | Seguranca | Essencial |
| RNF06 | O frontend deve dispor de camada de dados local para execucao autônoma em homologacao/offline. | Confiabilidade | Essencial |
| RNF07 | A interface deve ser responsiva e manter legibilidade em telas de smartphones de 360px a tablets e desktops. | Usabilidade | Essencial |
| RNF08 | O tempo de renderizacao inicial das paginas e transicoes nao deve ultrapassar 1 segundo em condicoes normais. | Desempenho | Importante |
