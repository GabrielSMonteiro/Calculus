# Canvas MVP: BeeGe

<p align="center">
  <img src="assets/limia.jpg" alt="Limia - Mascote BeeGe" width="120" style="border-radius: 50%; border: 2.5px solid #f59e0b;" />
</p>

Resumo do Produto Minimo Viavel em pagina unica, sintetizando a proposta de valor, público-alvo, escopo funcional e métricas de acompanhamento.

---

## 1. Problema Central

Estudantes de Calculo 1 enfrentam dificuldades para encontrar materiais alinhados com a ordem dos tópicos e o estilo de avaliação adotados especificamente por suas universidades. Materiais genericos disponíveis na internet costumam ser dispersos, excessivamente teoricos e desprovidos de um canal estruturado para resolução de duvidas com outros estudantes da mesma disciplina.

---

## 2. Segmento de Clientes

| Segmento | Perfil e Necessidade |
|---|---|
| Aluno Inicial | Calouro cursando Calculo 1 pela primeira vez, buscando direcionamento focado na ementa da sua instituicao. |
| Aluno em Repeticao | Estudante veterano que precisa de revisao rapida e resolucao orientada de questoes para recuperacao. |
| Administrador / Monitor | Monitor ou docente responsavel pela criacao e organizacao de questoes, revisao teorica e moderacao do forum. |

---

## 3. Proposta de Valor

Plataforma de revisao de Calculo 1 com segmentacao por universidade (modelo SaaS multi-inquilino), reunindo teoria sintetizada, renderizacao precisa de formulas matematicas via KaTeX, exercicios com explicacao passo a passo e espaco colaborativo de duvidas moderado.

---

## 4. Jornada do Usuario no MVP

```
[Acesso ao Aplicativo]
       │
       ▼
[Cadastro / Autenticacao]
       │
       ▼
[Selecao da Universidade (ex: USP, UFMG)]
       │
       ▼
[Navegacao por Topicos da Disciplina]
       │
  ┌────┴───────────────────────────┐
  ▼                                ▼
[Leitura da Teoria (KaTeX)]   [Resolucao de Exercicios]
  │                                │
  └───────────────┬────────────────┘
                  ▼
   [Publicacao de Duvidas no Forum]
```

---

## 5. Escopo Funcional do MVP

| Modulo | Funcionalidade | Classificacao |
|---|---|---|
| Autenticacao | Cadastro com email institucional/pessoal e senha | Essencial |
| Autenticacao | Login persistente e recuperacao de credenciais | Essencial |
| Multi-Universidade | Selecao da instituicao e filtragem automatica de conteudo | Essencial |
| Conteudo Programatico | Listagem sequencial dos modulos de Calculo 1 | Essencial |
| Renderizacao Matematica | Suporte nativo a sintaxe LaTeX com KaTeX | Essencial |
| Banco de Questoes | Exercicios de multipla escolha com gabarito comentado | Essencial |
| Forum Comunitario | Criacao de postagens de duvidas e envio de respostas | Essencial |
| Moderacao | Painel para aprovacao ou rejeicao de postagens | Essencial |
| Administracao | Cadastro e edicao de topicos teoricos e questoes | Essencial |
| Metricas de Progresso | Historico persistente de acertos por estudante (`ProgressService`) | Essencial (Implementado) |
| Notificacoes Push | Avisos sobre novas respostas e datas de provas | Pos-MVP |

---

## 6. Arquitetura e Recursos Tecnicos

| Camada | Tecnologia Adotada | Justificativa | Custo |
|---|---|---|---|
| Frontend Mobile / Web | Ionic Framework + React | Interface responsiva e unificada para web e dispositivos moveis | Gratuito |
| Encapsulamento Nativo | Capacitor | Geracao de artefatos para Android e iOS sem duplicacao de base | Gratuito |
| Backend e Banco de Dados | Supabase (PostgreSQL) | Servico gerenciado com suporte a RLS, autenticacao e funcoes | Gratuito |
| Renderizacao de Formulas | KaTeX | Renderizacao performatica no lado do cliente sem sobrecarga | Gratuito |
| Documentacao | MkDocs Material | Gerador estatico versionado com o codigo-fonte | Gratuito |

---

## 7. Metricas de Sucesso para o MVP

- Registro de pelo menos 10 usuarios de teste no ambiente de homologacao.
- Disponibilizacao de 4 ou mais topicos essenciais de Calculo 1.
- Inclusao de pelo menos 20 questoes com explicacoes analiticas completas.
- Publicacao e moderacao bem-sucedida de duvidas no forum academico.
- Geracao do build do aplicativo para navegadores e pacote Android via Capacitor.

---

## 8. Cronograma de Entregas

| Periodo | Marco | Principais Entregaveis |
|---|---|---|
| 20/09 a 23/09 | Sprint 0 | Definicao de arquitetura, estruturacao dos repositorios e documentacao base. |
| 24/09 a 30/09 | Sprint 1 | Modelagem de dados, configuracao do Supabase e fluxo de autenticacao. |
| 01/10 a 07/10 | Sprint 2 | Desenvolvimento do painel administrativo, listagem de topicos e resolucao de questoes. |
| 08/10 a 13/10 | Sprint 3 | Forum da comunidade, fluxo de moderacao, integracao KaTeX e refinamento de interface. |
| 14/10 a 19/10 | Sprint 4 | Validacao de requisitos, testes integrados, geracao de builds e entrega final do MVP. |
