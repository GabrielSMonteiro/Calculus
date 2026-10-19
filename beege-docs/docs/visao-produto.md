# Visao do Produto: BeeGe

<p align="center">
  <img src="assets/limia.jpg" alt="Limia - Mascote Oficial" width="150" style="border-radius: 50%; border: 3px solid #f59e0b;" />
</p>

---

## 1. Declaracao do Problema

O ensino e a aprendizagem de Calculo 1 no ensino superior historicamente registram indices elevados de retencao e reprovacao. Estudantes frequentemente relatam que livros didaticos sao excessivamente extensos e abstratos, enquanto videoaulas disponiveis na web nao seguem o estilo de resolucao ou a profundidade exigida nas provas de sua instituicao especifica.

Existe, portanto, a demanda por uma solucao orientada a revisao que combine:
- Segmentacao por universidade, respeitando a ementa local.
- Renderizacao digital de notacao matematica em alta qualidade.
- Exercicios com passo a passo analitico dos gabaritos.
- Ambiente colaborativo de duvidas com moderacao ativa.

---

## 2. Declaracao de Posicionamento

O **BeeGe** e um aplicativo mobile e web focado na revisao e fixacao de Calculo 1, estruturado como um servico multi-institucional (SaaS). Diferentemente de cursos em video genericos ou plataformas abertas de questoes, o BeeGe organiza o conteudo a partir da ementa especifica da instituicao do estudante, integrando resumos teoricos em KaTeX, simuladores com feedback imediato e um forum moderado.

| Dimensao | Especificacao |
|---|---|
| **Para** | Estudantes de graduacao matriculados na disciplina de Calculo 1. |
| **Que buscam** | Material de revisao objetivo e focado no modelo de prova de sua universidade. |
| **O BeeGe e** | Um aplicativo mobile (Android/iOS) e plataforma web. |
| **Que oferece** | Teoria sintetizada, exercicios corrigidos instantaneamente e canal de duvidas institucional. |
| **Diferente de** | Cursos longos em video e manuais tradicionais de mais de 800 paginas. |
| **Nosso diferencial** | Adaptacao da ementa por universidade (iniciando pela UnB), KaTeX nativo e suporte da mascote Limia. |

---

## 3. Objetivos Estrategicos do Produto

- Reduzir o indice de retencao em Calculo 1 atraves de revisao ativa e orientada.
- Disponibilizar um ambiente seguro e academicamente moderado para esclarecimento de duvidas entre colegas e monitores.
- Fornecer ao corpo docente e monitores uma ferramenta administrativa agil para cadastro de materiais e acompanhamento de duvidas frequentes.
- Construir uma arquitetura extensivel para receber disciplinas subsequentes (Calculo 2, Calculo 3 e Algebra Linear).

---

## 4. Identidade Visual e Mascote (Limia)

A mascote oficial do projeto e a abelha **Limia**:
- **Caracteristicas Visuais:** Abelha estilizada com oculos redondos pretos e gravata borboleta roxa contendo simbolos matematicos gravados ($\int, \lim, \partial$).
- **Simbolismo:** Representa o rigor academico aliado a diligencia e ao trabalho em colmeia (aprendizagem colaborativa).
- **Papel no Sistema:** Atua como elemento de apoio pedagogico, apresentando observacoes conceituais, dicas de teoremas e mensagens de orientacao apos a resolucao de questoes.

---

## 5. Arquitetura e Tecnologias

- **Interface do Usuario:** Ionic Framework com React 19 e TypeScript.
- **Camada Mobile Nativa:** Capacitor (geracao de builds Android e iOS a partir de codebase unica).
- **Backend as a Service:** Supabase (banco de dados PostgreSQL com RLS, Autenticacao e Storage).
- **Motor de Renderizacao:** KaTeX (processamento local de sintaxe LaTeX para limites, integrais e derivadas).
