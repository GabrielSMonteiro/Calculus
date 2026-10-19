# Diagramas UML: BeeGe

Modelagem visual dos casos de uso, classes do dominio, componentes da arquitetura e fluxos de interacao do sistema.

---

## 1. Diagrama de Casos de Uso

```mermaid
graph TD
    subgraph Atores
        A[Aluno]
        ADM[Administrador]
    end

    subgraph Sistema BeeGe
        UC1([Cadastrar-se])
        UC2([Fazer Login])
        UC3([Recuperar Senha])
        UC4([Selecionar Universidade])
        UC5([Listar Topicos])
        UC6([Ler Teoria com KaTeX])
        UC7([Resolver Questao])
        UC8([Criar Postagem no Forum])
        UC9([Comentar no Forum])
        UC10([Cadastrar Topico Teorico])
        UC11([Cadastrar Questao])
        UC12([Moderar Postagem no Forum])
        UC13([Gerenciar Universidades])
    end

    A --> UC1
    A --> UC2
    A --> UC3
    A --> UC4
    A --> UC5
    A --> UC6
    A --> UC7
    A --> UC8
    A --> UC9

    ADM --> UC2
    ADM --> UC10
    ADM --> UC11
    ADM --> UC12
    ADM --> UC13

    UC5 -.->|depende de| UC4
    UC6 -.->|depende de| UC5
    UC7 -.->|depende de| UC5
```

---

## 2. Diagrama de Classes de Dominio

```mermaid
classDiagram
    class User {
        +UUID id
        +String email
        +String nome
        +Enum role
        +UUID universidade_id
        +DateTime created_at
    }

    class Universidade {
        +UUID id
        +String nome
        +String sigla
        +String logo_url
        +Boolean ativa
    }

    class Topico {
        +UUID id
        +UUID universidade_id
        +String titulo
        +String conteudo_latex
        +Integer ordem
        +DateTime created_at
    }

    class Questao {
        +UUID id
        +UUID topico_id
        +String enunciado_latex
        +String[] alternativas
        +Integer resposta_correta
        +String explicacao_latex
        +Enum dificuldade
    }

    class Postagem {
        +UUID id
        +UUID autor_id
        +UUID universidade_id
        +String titulo
        +String corpo
        +Enum status
        +DateTime created_at
    }

    class Comentario {
        +UUID id
        +UUID postagem_id
        +UUID autor_id
        +String corpo
        +DateTime created_at
    }

    class ProgressoAluno {
        +UUID id
        +UUID aluno_id
        +UUID questao_id
        +Boolean acertou
        +DateTime respondida_em
    }

    User "1" --> "1" Universidade : pertence a
    Universidade "1" --> "*" Topico : contem
    Topico "1" --> "*" Questao : contem
    Questao "1" --> "*" ProgressoAluno : registra
    User "1" --> "*" ProgressoAluno : possui
    User "1" --> "*" Postagem : cria
    Postagem "1" --> "*" Comentario : recebe
    User "1" --> "*" Comentario : publica
    Universidade "1" --> "*" Postagem : hospeda
```

---

## 3. Diagrama de Componentes

```mermaid
graph TD
    subgraph "beege-app (Ionic + React + Capacitor)"
        subgraph "Paginas"
            P_LOGIN[LoginPage]
            P_CADASTRO[CadastroPage]
            P_UNIV[SelecionarUniversidadePage]
            P_DASH[DashboardPage]
            P_TOPICO[TopicoDetailPage]
            P_QUESTAO[QuestaoPage]
            P_FORUM[ForumPage]
            P_ADMIN[AdminPage]
        end

        subgraph "Componentes Compartilhados"
            C_KATEX[MathRenderer]
            C_HEADER[BeegeHeader]
            C_MASCOTE[LimiaMascot]
        end

        subgraph "Servicos e Contextos"
            S_AUTH[AuthContext]
            S_DATA[DataService]
            S_SUPA[supabaseClient]
        end
    end

    subgraph "beege-api (Supabase)"
        DB[(PostgreSQL + RLS)]
        AUTH_SB[Supabase Auth]
        STORAGE[Supabase Storage]
    end

    P_LOGIN --> S_AUTH
    P_CADASTRO --> S_AUTH
    S_AUTH --> S_SUPA
    S_SUPA --> AUTH_SB

    P_TOPICO --> C_KATEX
    P_QUESTAO --> C_KATEX
    P_FORUM --> C_KATEX
    P_DASH --> C_MASCOTE

    P_TOPICO --> S_DATA
    P_QUESTAO --> S_DATA
    P_FORUM --> S_DATA
    P_ADMIN --> S_DATA

    S_DATA --> S_SUPA
    S_SUPA --> DB
```

---

## 4. Diagrama de Sequencia: Autenticacao de Usuario

```mermaid
sequenceDiagram
    actor Aluno
    participant App as BeeGe App
    participant Supabase as Supabase Auth

    Aluno->>App: Informa email e senha
    App->>Supabase: signInWithPassword(email, senha)
    alt Credenciais Validas
        Supabase-->>App: Retorna sessao e dados do usuario
        App->>App: Registra estado no AuthContext
        App-->>Aluno: Redireciona para o Dashboard
    else Credenciais Invalidas
        Supabase-->>App: Retorna mensagem de erro
        App-->>Aluno: Exibe aviso de falha na autenticacao
    end
```

---

## 5. Diagrama de Sequencia: Moderacao de Postagens no Forum

```mermaid
sequenceDiagram
    actor Aluno
    actor Admin
    participant App as BeeGe App
    participant DB as Supabase PostgreSQL

    Aluno->>App: Submete nova duvida no forum
    App->>DB: INSERT INTO postagens (status = 'pendente')
    DB-->>App: Confirmacao de insercao
    App-->>Aluno: Notifica envio para moderacao

    Admin->>App: Acessa aba de moderacao no Painel Admin
    App->>DB: SELECT * FROM postagens WHERE status = 'pendente'
    DB-->>App: Lista de registros pendentes
    App-->>Admin: Renderiza postagens a moderar

    Admin->>App: Aprova a publicacao
    App->>DB: UPDATE postagens SET status = 'aprovada' WHERE id = :id
    DB-->>App: Atualizacao confirmada
    App-->>Admin: Remove item da fila de pendentes
```
