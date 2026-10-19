# BeeGe Docs

Repositorio de documentacao do projeto **BeeGe**, construido com **MkDocs** e o tema **Material for MkDocs**.

---

## Estrutura da Documentacao

- **Planejamento:**
  - Visao do Produto
  - Canvas do MVP
  - Personas
  - Cronograma e Roadmap
  - Metodologia de Trabalho
  - Plano de Gestao de Riscos
  - Plano de Qualidade de Software
- **Requisitos e Modelagem:**
  - Requisitos Funcionais e Nao Funcionais (RF / RNF)
  - Backlog do Produto e Historias de Usuario
  - Diagramas UML (Casos de Uso, Classes, Componentes e Sequencia)
- **Arquitetura:**
  - Documento de Arquitetura de Software e Fluxo de Dados
- **Padroes:**
  - Guia de Contribuicao (Conventional Commits, padroes de branch)
  - Codigo de Conduta

---

## Como Executar Localmente

1. Certifique-se de possuir o Python 3.10 ou superior instalado.
2. Instale as dependencias necessarias:
   ```bash
   pip install mkdocs-material
   ```
3. Inicie o servidor local:
   ```bash
   mkdocs serve
   ```
4. Acesse pelo navegador em `http://127.0.0.1:8000`.

---

## Geracao do Site Estatico

Para compilar os arquivos HTML estaticos:
```bash
mkdocs build
```
Os arquivos gerados serao salvos no diretorio `site/`.
