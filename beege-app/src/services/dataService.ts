import {
  supabase,
  isSupabaseConfigured,
  Universidade,
  Topico,
  Questao,
  Postagem,
  Comentario
} from '../lib/supabaseClient';

// Dados em memória para funcionamento autônomo e fallback
const MOCK_UNIVERSIDADES: Universidade[] = [
  { id: '11111111-1111-1111-1111-111111111111', nome: 'Universidade Federal do Rio de Janeiro', sigla: 'UFRJ', logo_url: 'https://ufrj.br/favicon.ico', ativa: true },
  { id: '22222222-2222-2222-2222-222222222222', nome: 'Universidade Federal de Minas Gerais', sigla: 'UFMG', logo_url: 'https://ufmg.br/favicon.ico', ativa: true },
  { id: '33333333-3333-3333-3333-333333333333', nome: 'Universidade de São Paulo', sigla: 'USP', logo_url: 'https://usp.br/favicon.ico', ativa: true }
];

const MOCK_TOPICOS: Topico[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    universidade_id: '11111111-1111-1111-1111-111111111111',
    titulo: '1. Limites Fundamentais e Continuidade',
    conteudo_latex: `### O Conceito Intuitivo de Limite

Dizemos que o limite de $f(x)$ quando $x$ tende a $a$ é igual a $L$:

$$\\\\lim_{x \\\\to a} f(x) = L$$

Se pudermos tornar os valores de $f(x)$ arbitrariamente próximos de $L$, tomando $x$ suficientemente próximo de $a$.

### Limite Fundamental Trigonométrico
O limite mais cobrado nas provas de Cálculo 1:

$$\\\\lim_{x \\\\to 0} \\\\frac{\\\\sin(x)}{x} = 1$$

> **Dica de cálculo:** Multiplique e divida a fração para igualar o argumento trigonométrico. Exemplo: $\\\\lim_{x \\\\to 0} \\\\frac{\\\\sin(5x)}{2x} = \\\\frac{5}{2} \\\\cdot 1 = \\\\frac{5}{2}$.

### Continuidade
Uma função é contínua em $x = c$ se:
1. $f(c)$ existe.
2. $\\\\lim_{x \\\\to c} f(x)$ existe.
3. $\\\\lim_{x \\\\to c} f(x) = f(c)$.`,
    ordem: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    universidade_id: '11111111-1111-1111-1111-111111111111',
    titulo: '2. Derivadas e Regra da Cadeia',
    conteudo_latex: `### Definição da Derivada
A taxa de variação instantânea da função:

$$f'(x) = \\\\lim_{h \\\\to 0} \\\\frac{f(x+h) - f(x)}{h}$$

### Regra da Cadeia
Para funções compostas $y = f(g(x))$:

$$\\\\frac{dy}{dx} = f'(g(x)) \\\\cdot g'(x)$$

### Regras Operatórias Rápidas
- **Produto:** $(u \\\\cdot v)' = u'v + uv'$
- **Quociente:** $\\\\left(\\\\frac{u}{v}\\\\right)' = \\\\frac{u'v - uv'}{v^2}$
- **Potência:** $(x^n)' = n x^{n-1}$`,
    ordem: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    universidade_id: '11111111-1111-1111-1111-111111111111',
    titulo: '3. Aplicações da Derivada e Regra de L\'Hôpital',
    conteudo_latex: `### Regra de L'Hôpital
Para indeterminações do tipo $\\\\left[\\\\frac{0}{0}\\\\right]$ ou $\\\\left[\\\\frac{\\\\infty}{\\\\infty}\\\\right]$:

$$\\\\lim_{x \\\\to a} \\\\frac{f(x)}{g(x)} = \\\\lim_{x \\\\to a} \\\\frac{f'(x)}{g'(x)}$$

### Máximos e Mínimos
- Ponto crítico: onde $f'(c) = 0$ ou $f'(c)$ não existe.
- Se $f''(c) > 0$, temos concavidade para cima (Mínimo Local).
- Se $f''(c) < 0$, temos concavidade para baixo (Máximo Local).`,
    ordem: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    universidade_id: '11111111-1111-1111-1111-111111111111',
    titulo: '4. Integrais Indefinidas e Técnicas',
    conteudo_latex: `### Antiderivada e Integral Indefinida
$$\\\\int f(x) \\\\, dx = F(x) + C \\\\quad \\\\text{onde } F'(x) = f(x)$$

### Integração por Partes
$$\\\\int u \\\\, dv = u \\\\cdot v - \\\\int v \\\\, du$$

### Método da Substituição ($u$-sub)
Escolha $u = g(x) \\\\implies du = g'(x) \\\\, dx$.`,
    ordem: 4,
    created_at: new Date().toISOString()
  }
];

// ============================================================================
// BANCO DE QUESTÕES EXPANDIDO — 24 questões (6 por tópico) para atingir meta MVP 20+
// ============================================================================
const MOCK_QUESTOES: Questao[] = [
  // === TÓPICO 1: Limites Fundamentais e Continuidade (6 questões) ===
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    topico_id: 'a1111111-1111-1111-1111-111111111111',
    enunciado_latex: 'Calcule o limite fundamental: $$\\\\lim_{x \\\\to 0} \\\\frac{\\\\sin(5x)}{2x}$$',
    alternativas: ['5/2', '0', '1', '2/5', 'Não existe'],
    resposta_correta: 0,
    explicacao_latex: 'Reescreva a expressão: $$\\\\lim_{x \\\\to 0} \\\\frac{\\\\sin(5x)}{2x} = \\\\frac{5}{2} \\\\cdot \\\\lim_{x \\\\to 0} \\\\frac{\\\\sin(5x)}{5x} = \\\\frac{5}{2} \\\\cdot 1 = \\\\frac{5}{2}$$.',
    dificuldade: 'facil'
  },
  {
    id: 'b1111111-1111-1111-1111-111111111112',
    topico_id: 'a1111111-1111-1111-1111-111111111111',
    enunciado_latex: 'Calcule: $$\\\\lim_{x \\\\to 0} \\\\frac{\\\\tan(3x)}{\\\\sin(2x)}$$',
    alternativas: ['3/2', '2/3', '1', '0'],
    resposta_correta: 0,
    explicacao_latex: 'Reescreva: $$\\\\frac{\\\\tan(3x)}{\\\\sin(2x)} = \\\\frac{\\\\sin(3x)}{\\\\cos(3x) \\\\cdot \\\\sin(2x)}$$.\nQuando $x \\\\to 0$, $\\\\cos(3x) \\\\to 1$, e usando limites fundamentais:\n$$\\\\frac{\\\\sin(3x)}{\\\\sin(2x)} = \\\\frac{3x}{2x} \\\\cdot \\\\frac{\\\\sin(3x)/3x}{\\\\sin(2x)/2x} \\\\to \\\\frac{3}{2} \\\\cdot \\\\frac{1}{1} = \\\\frac{3}{2}$$.',
    dificuldade: 'medio'
  },
  {
    id: 'b1111111-1111-1111-1111-111111111113',
    topico_id: 'a1111111-1111-1111-1111-111111111111',
    enunciado_latex: 'Determine: $$\\\\lim_{x \\\\to 4} \\\\frac{\\\\sqrt{x} - 2}{x - 4}$$',
    alternativas: ['1/4', '1/2', '0', '4'],
    resposta_correta: 0,
    explicacao_latex: 'Multiplique pelo conjugado:\n$$\\\\frac{\\\\sqrt{x} - 2}{x - 4} \\\\cdot \\\\frac{\\\\sqrt{x} + 2}{\\\\sqrt{x} + 2} = \\\\frac{x - 4}{(x - 4)(\\\\sqrt{x} + 2)} = \\\\frac{1}{\\\\sqrt{x} + 2}$$\nPara $x \\\\to 4$: $\\\\frac{1}{\\\\sqrt{4} + 2} = \\\\frac{1}{4}$.',
    dificuldade: 'facil'
  },
  {
    id: 'b1111111-1111-1111-1111-111111111114',
    topico_id: 'a1111111-1111-1111-1111-111111111111',
    enunciado_latex: 'Avalie a continuidade de $f(x)$ em $x = 2$:\n$$f(x) = \\\\begin{cases} x^2 - 1 & \\\\text{se } x < 2 \\\\\\\\ 3 & \\\\text{se } x = 2 \\\\\\\\ 2x - 1 & \\\\text{se } x > 2 \\\\end{cases}$$',
    alternativas: ['Contínua', 'Descontínua (limites laterais diferentes)', 'Descontínua (limite ≠ f(2))', 'Descontínua (f(2) não existe)'],
    resposta_correta: 0,
    explicacao_latex: 'Verificação:\n1. $f(2) = 3$ ✓\n2. $\\\\lim_{x \\\\to 2^-} f(x) = 4 - 1 = 3$ e $\\\\lim_{x \\\\to 2^+} f(x) = 4 - 1 = 3$, logo $\\\\lim_{x \\\\to 2} f(x) = 3$ ✓\n3. $\\\\lim_{x \\\\to 2} f(x) = f(2) = 3$ ✓\nTodas as condições de continuidade são satisfeitas.',
    dificuldade: 'medio'
  },
  {
    id: 'b1111111-1111-1111-1111-111111111115',
    topico_id: 'a1111111-1111-1111-1111-111111111111',
    enunciado_latex: 'Calcule o limite exponencial fundamental: $$\\\\lim_{x \\\\to 0} \\\\frac{e^x - 1}{x}$$',
    alternativas: ['1', '0', 'e', '\\\\infty'],
    resposta_correta: 0,
    explicacao_latex: 'Este é um dos limites fundamentais mais importantes:\n$$\\\\lim_{x \\\\to 0} \\\\frac{e^x - 1}{x} = 1$$\nPode ser demonstrado pela expansão em série de Taylor: $e^x = 1 + x + \\\\frac{x^2}{2!} + \\\\cdots$',
    dificuldade: 'facil'
  },
  {
    id: 'b1111111-1111-1111-1111-111111111116',
    topico_id: 'a1111111-1111-1111-1111-111111111111',
    enunciado_latex: 'Determine: $$\\\\lim_{x \\\\to \\\\infty} \\\\frac{3x^2 + 5x - 1}{2x^2 - x + 4}$$',
    alternativas: ['3/2', '0', '\\\\infty', '5'],
    resposta_correta: 0,
    explicacao_latex: 'Divida numerador e denominador pelo termo de maior grau $x^2$:\n$$\\\\lim_{x \\\\to \\\\infty} \\\\frac{3 + 5/x - 1/x^2}{2 - 1/x + 4/x^2} = \\\\frac{3 + 0 - 0}{2 - 0 + 0} = \\\\frac{3}{2}$$',
    dificuldade: 'facil'
  },

  // === TÓPICO 2: Derivadas e Regra da Cadeia (6 questões) ===
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    topico_id: 'a2222222-2222-2222-2222-222222222222',
    enunciado_latex: 'Determine a derivada da função: $$f(x) = e^{3x} \\\\cdot \\\\cos(x)$$',
    alternativas: [
      'e^{3x}(3\\\\cos(x) - \\\\sin(x))',
      '3e^{3x}\\\\cos(x)',
      '-e^{3x}\\\\sin(x)',
      'e^{3x}(\\\\cos(x) + 3\\\\sin(x))'
    ],
    resposta_correta: 0,
    explicacao_latex: 'Pela Regra do Produto: $(u \\\\cdot v)\' = u\'v + uv\'$.\nCom $u=e^{3x} \\\\implies u\'=3e^{3x}$ e $v=\\\\cos(x) \\\\implies v\'=-\\\\sin(x)$.\nResultado: $e^{3x}(3\\\\cos(x) - \\\\sin(x))$.',
    dificuldade: 'medio'
  },
  {
    id: 'b2222222-2222-2222-2222-222222222223',
    topico_id: 'a2222222-2222-2222-2222-222222222222',
    enunciado_latex: 'Derive usando a Regra da Cadeia: $$f(x) = \\\\sin(x^3 + 2x)$$',
    alternativas: [
      '(3x^2 + 2)\\\\cos(x^3 + 2x)',
      '\\\\cos(x^3 + 2x)',
      '3x^2 \\\\cos(x^3)',
      '(x^3 + 2x)\\\\cos(x^3 + 2x)'
    ],
    resposta_correta: 0,
    explicacao_latex: 'Pela Regra da Cadeia: $f\'(x) = \\\\cos(g(x)) \\\\cdot g\'(x)$.\nCom $g(x) = x^3 + 2x \\\\implies g\'(x) = 3x^2 + 2$.\nResultado: $(3x^2 + 2)\\\\cos(x^3 + 2x)$.',
    dificuldade: 'medio'
  },
  {
    id: 'b2222222-2222-2222-2222-222222222224',
    topico_id: 'a2222222-2222-2222-2222-222222222222',
    enunciado_latex: 'Determine $f\'(x)$ para: $$f(x) = \\\\frac{x^2 + 1}{x - 3}$$',
    alternativas: [
      '\\\\frac{x^2 - 6x - 1}{(x-3)^2}',
      '\\\\frac{2x}{1}',
      '\\\\frac{2x(x-3) - x^2}{(x-3)^2}',
      '\\\\frac{x^2 - 1}{(x-3)^2}'
    ],
    resposta_correta: 0,
    explicacao_latex: 'Pela Regra do Quociente: $\\\\left(\\\\frac{u}{v}\\\\right)\' = \\\\frac{u\'v - uv\'}{v^2}$.\n$u = x^2+1, u\' = 2x, v = x-3, v\' = 1$.\n$$f\'(x) = \\\\frac{2x(x-3) - (x^2+1)(1)}{(x-3)^2} = \\\\frac{2x^2-6x-x^2-1}{(x-3)^2} = \\\\frac{x^2-6x-1}{(x-3)^2}$$',
    dificuldade: 'medio'
  },
  {
    id: 'b2222222-2222-2222-2222-222222222225',
    topico_id: 'a2222222-2222-2222-2222-222222222222',
    enunciado_latex: 'Qual é a derivada de $f(x) = \\\\ln(\\\\cos(x))$?',
    alternativas: ['-\\\\tan(x)', '\\\\frac{1}{\\\\cos(x)}', '-\\\\sin(x)', '\\\\tan(x)'],
    resposta_correta: 0,
    explicacao_latex: 'Regra da Cadeia com $u = \\\\cos(x)$:\n$$f\'(x) = \\\\frac{1}{\\\\cos(x)} \\\\cdot (-\\\\sin(x)) = \\\\frac{-\\\\sin(x)}{\\\\cos(x)} = -\\\\tan(x)$$',
    dificuldade: 'medio'
  },
  {
    id: 'b2222222-2222-2222-2222-222222222226',
    topico_id: 'a2222222-2222-2222-2222-222222222222',
    enunciado_latex: 'Encontre a equação da reta tangente a $f(x) = x^3$ no ponto $x = 1$.',
    alternativas: ['y = 3x - 2', 'y = 3x - 1', 'y = x', 'y = 3x'],
    resposta_correta: 0,
    explicacao_latex: '$f(1) = 1$ e $f\'(x) = 3x^2 \\\\implies f\'(1) = 3$.\nEquação da tangente: $y - y_0 = m(x - x_0) \\\\implies y - 1 = 3(x - 1) \\\\implies y = 3x - 2$.',
    dificuldade: 'facil'
  },
  {
    id: 'b2222222-2222-2222-2222-222222222227',
    topico_id: 'a2222222-2222-2222-2222-222222222222',
    enunciado_latex: 'Derive: $f(x) = e^{\\\\sqrt{x}}$',
    alternativas: [
      '\\\\frac{e^{\\\\sqrt{x}}}{2\\\\sqrt{x}}',
      'e^{\\\\sqrt{x}}',
      '\\\\sqrt{x} \\\\cdot e^{\\\\sqrt{x}-1}',
      '\\\\frac{e^{\\\\sqrt{x}}}{\\\\sqrt{x}}'
    ],
    resposta_correta: 0,
    explicacao_latex: 'Cadeia com $u = \\\\sqrt{x} = x^{1/2}$:\n$$f\'(x) = e^{\\\\sqrt{x}} \\\\cdot \\\\frac{d}{dx}(x^{1/2}) = e^{\\\\sqrt{x}} \\\\cdot \\\\frac{1}{2\\\\sqrt{x}} = \\\\frac{e^{\\\\sqrt{x}}}{2\\\\sqrt{x}}$$',
    dificuldade: 'dificil'
  },

  // === TÓPICO 3: Aplicações da Derivada e L'Hôpital (6 questões) ===
  {
    id: 'b3333333-3333-3333-3333-333333333333',
    topico_id: 'a3333333-3333-3333-3333-333333333333',
    enunciado_latex: 'Utilize a Regra de L\'Hôpital para calcular: $$\\\\lim_{x \\\\to 0} \\\\frac{e^x - 1 - x}{x^2}$$',
    alternativas: ['1/2', '0', '1', '2', '\\\\infty'],
    resposta_correta: 0,
    explicacao_latex: 'Substituindo $x=0$, temos $[0/0]$.\n1ª derivada: $\\\\lim_{x \\\\to 0} \\\\frac{e^x - 1}{2x} = [0/0]$.\n2ª derivada: $\\\\lim_{x \\\\to 0} \\\\frac{e^x}{2} = \\\\frac{1}{2}$.',
    dificuldade: 'medio'
  },
  {
    id: 'b3333333-3333-3333-3333-333333333334',
    topico_id: 'a3333333-3333-3333-3333-333333333333',
    enunciado_latex: 'Aplique L\'Hôpital: $$\\\\lim_{x \\\\to 0} \\\\frac{\\\\sin(x) - x}{x^3}$$',
    alternativas: ['-1/6', '0', '-1/3', '1/6'],
    resposta_correta: 0,
    explicacao_latex: 'Substituindo $x=0$: $[0/0]$.\n1ª L\'Hôpital: $\\\\frac{\\\\cos(x) - 1}{3x^2} \\\\to [0/0]$.\n2ª L\'Hôpital: $\\\\frac{-\\\\sin(x)}{6x} \\\\to [0/0]$.\n3ª L\'Hôpital: $\\\\frac{-\\\\cos(x)}{6} = \\\\frac{-1}{6}$.',
    dificuldade: 'dificil'
  },
  {
    id: 'b3333333-3333-3333-3333-333333333335',
    topico_id: 'a3333333-3333-3333-3333-333333333333',
    enunciado_latex: 'Encontre os intervalos de crescimento de $f(x) = x^3 - 3x^2 + 4$.',
    alternativas: [
      '(-\\\\infty, 0) \\\\cup (2, \\\\infty)',
      '(0, 2)',
      '(-\\\\infty, \\\\infty)',
      '(-\\\\infty, -1) \\\\cup (1, \\\\infty)'
    ],
    resposta_correta: 0,
    explicacao_latex: '$f\'(x) = 3x^2 - 6x = 3x(x - 2)$.\nPontos críticos: $x = 0$ e $x = 2$.\n$f\'(x) > 0$ para $x < 0$ e $x > 2$ → crescente em $(-\\\\infty, 0) \\\\cup (2, \\\\infty)$.\n$f\'(x) < 0$ para $0 < x < 2$ → decrescente.',
    dificuldade: 'medio'
  },
  {
    id: 'b3333333-3333-3333-3333-333333333336',
    topico_id: 'a3333333-3333-3333-3333-333333333333',
    enunciado_latex: 'Classifique o ponto crítico $x = -1$ de $f(x) = x^3 - 3x + 2$ usando a segunda derivada.',
    alternativas: ['Máximo local', 'Mínimo local', 'Ponto de inflexão', 'Não é ponto crítico'],
    resposta_correta: 0,
    explicacao_latex: '$f\'(x) = 3x^2 - 3$. Em $x = -1$: $f\'(-1) = 3 - 3 = 0$ ✓ (ponto crítico).\n$f\'\'(x) = 6x$. Em $x = -1$: $f\'\'(-1) = -6 < 0$ → concavidade para baixo → **Máximo local**.',
    dificuldade: 'medio'
  },
  {
    id: 'b3333333-3333-3333-3333-333333333337',
    topico_id: 'a3333333-3333-3333-3333-333333333333',
    enunciado_latex: 'Calcule: $$\\\\lim_{x \\\\to 0^+} x \\\\ln(x)$$',
    alternativas: ['0', '-\\\\infty', '1', 'Não existe'],
    resposta_correta: 0,
    explicacao_latex: 'Indeterminação $0 \\\\cdot (-\\\\infty)$. Reescreva como:\n$$\\\\lim_{x \\\\to 0^+} \\\\frac{\\\\ln(x)}{1/x} = \\\\frac{-\\\\infty}{+\\\\infty}$$\nL\'Hôpital: $\\\\frac{1/x}{-1/x^2} = \\\\frac{x^2}{-x} = -x \\\\to 0$.',
    dificuldade: 'dificil'
  },
  {
    id: 'b3333333-3333-3333-3333-333333333338',
    topico_id: 'a3333333-3333-3333-3333-333333333333',
    enunciado_latex: 'Calcule usando L\'Hôpital: $$\\\\lim_{x \\\\to \\\\infty} \\\\frac{\\\\ln(x)}{\\\\sqrt{x}}$$',
    alternativas: ['0', '1', '\\\\infty', '2'],
    resposta_correta: 0,
    explicacao_latex: 'Forma $\\\\frac{\\\\infty}{\\\\infty}$. L\'Hôpital:\n$$\\\\lim_{x \\\\to \\\\infty} \\\\frac{1/x}{1/(2\\\\sqrt{x})} = \\\\lim_{x \\\\to \\\\infty} \\\\frac{2\\\\sqrt{x}}{x} = \\\\lim_{x \\\\to \\\\infty} \\\\frac{2}{\\\\sqrt{x}} = 0$$',
    dificuldade: 'medio'
  },

  // === TÓPICO 4: Integrais Indefinidas e Técnicas (6 questões) ===
  {
    id: 'b4444444-4444-4444-4444-444444444444',
    topico_id: 'a4444444-4444-4444-4444-444444444444',
    enunciado_latex: 'Calcule a integral por partes: $$\\\\int x e^x \\\\, dx$$',
    alternativas: [
      'e^x(x - 1) + C',
      'e^x(x + 1) + C',
      'x e^x + C',
      '\\\\frac{x^2}{2}e^x + C'
    ],
    resposta_correta: 0,
    explicacao_latex: 'Escolha $u=x \\\\implies du=dx$ e $dv=e^x dx \\\\implies v=e^x$.\n$$\\\\int u dv = uv - \\\\int v du = x e^x - \\\\int e^x dx = e^x(x - 1) + C$$.',
    dificuldade: 'medio'
  },
  {
    id: 'b4444444-4444-4444-4444-444444444445',
    topico_id: 'a4444444-4444-4444-4444-444444444444',
    enunciado_latex: 'Resolva por substituição: $$\\\\int 2x \\\\cos(x^2) \\\\, dx$$',
    alternativas: ['\\\\sin(x^2) + C', '\\\\cos(x^2) + C', 'x^2 \\\\sin(x^2) + C', '-\\\\sin(x^2) + C'],
    resposta_correta: 0,
    explicacao_latex: 'Faça $u = x^2 \\\\implies du = 2x \\\\, dx$.\n$$\\\\int 2x \\\\cos(x^2) dx = \\\\int \\\\cos(u) du = \\\\sin(u) + C = \\\\sin(x^2) + C$$',
    dificuldade: 'facil'
  },
  {
    id: 'b4444444-4444-4444-4444-444444444446',
    topico_id: 'a4444444-4444-4444-4444-444444444444',
    enunciado_latex: 'Calcule: $$\\\\int \\\\frac{1}{x^2 + 1} \\\\, dx$$',
    alternativas: ['\\\\arctan(x) + C', '\\\\ln(x^2+1) + C', '\\\\frac{-1}{x} + C', '\\\\arcsin(x) + C'],
    resposta_correta: 0,
    explicacao_latex: 'Esta é uma integral fundamental tabelada:\n$$\\\\int \\\\frac{1}{x^2 + 1} dx = \\\\arctan(x) + C$$\nÉ a antiderivada da função $\\\\frac{d}{dx}[\\\\arctan(x)] = \\\\frac{1}{x^2+1}$.',
    dificuldade: 'facil'
  },
  {
    id: 'b4444444-4444-4444-4444-444444444447',
    topico_id: 'a4444444-4444-4444-4444-444444444444',
    enunciado_latex: 'Resolva: $$\\\\int x^2 e^x \\\\, dx$$',
    alternativas: [
      'e^x(x^2 - 2x + 2) + C',
      'e^x(x^2 + 2x + 2) + C',
      'x^2 e^x + C',
      'e^x(x^2 - 2) + C'
    ],
    resposta_correta: 0,
    explicacao_latex: 'Integração por partes dupla:\n1ª: $u=x^2, dv=e^x dx \\\\implies x^2 e^x - 2\\\\int x e^x dx$.\n2ª: $\\\\int x e^x dx = e^x(x-1)$ (resultado anterior).\nResultado: $e^x(x^2 - 2x + 2) + C$.',
    dificuldade: 'dificil'
  },
  {
    id: 'b4444444-4444-4444-4444-444444444448',
    topico_id: 'a4444444-4444-4444-4444-444444444444',
    enunciado_latex: 'Determine: $$\\\\int \\\\frac{3x}{x^2 + 4} \\\\, dx$$',
    alternativas: [
      '\\\\frac{3}{2}\\\\ln(x^2+4) + C',
      '3\\\\arctan(x/2) + C',
      '\\\\frac{3}{2}\\\\ln|x+2| + C',
      '3\\\\ln(x^2+4) + C'
    ],
    resposta_correta: 0,
    explicacao_latex: 'Faça $u = x^2 + 4 \\\\implies du = 2x \\\\, dx$.\n$$\\\\int \\\\frac{3x}{x^2+4} dx = \\\\frac{3}{2} \\\\int \\\\frac{du}{u} = \\\\frac{3}{2} \\\\ln|u| + C = \\\\frac{3}{2}\\\\ln(x^2+4) + C$$',
    dificuldade: 'medio'
  },
  {
    id: 'b4444444-4444-4444-4444-444444444449',
    topico_id: 'a4444444-4444-4444-4444-444444444444',
    enunciado_latex: 'Calcule: $$\\\\int \\\\ln(x) \\\\, dx$$',
    alternativas: [
      'x\\\\ln(x) - x + C',
      '\\\\frac{1}{x} + C',
      'x\\\\ln(x) + C',
      '\\\\frac{\\\\ln(x)^2}{2} + C'
    ],
    resposta_correta: 0,
    explicacao_latex: 'Por partes com $u = \\\\ln(x), dv = dx$:\n$du = \\\\frac{1}{x}dx, v = x$.\n$$\\\\int \\\\ln(x) dx = x\\\\ln(x) - \\\\int x \\\\cdot \\\\frac{1}{x} dx = x\\\\ln(x) - x + C$$',
    dificuldade: 'medio'
  }
];

let localPostagens: Postagem[] = [
  {
    id: 'p1',
    autor_id: 'user1',
    universidade_id: '11111111-1111-1111-1111-111111111111',
    titulo: 'Dúvida na Lista 2 do Prof. Ricardo (Limites com Raiz)',
    corpo: 'Alguém sabe como resolver o exercício 4 da Lista 2 de Cálculo 1? Quando $x \\\\to 4$, a expressão $\\\\frac{\\\\sqrt{x} - 2}{x - 4}$ dá indeterminação!',
    status: 'aprovada',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    profiles: { nome: 'Lucas Ferreira (Ciência da Computação)' }
  },
  {
    id: 'p2',
    autor_id: 'user2',
    universidade_id: '11111111-1111-1111-1111-111111111111',
    titulo: 'Dica de ouro para a Prova 1: Limites Trigonométricos',
    corpo: 'Lembrem de revisar o Teorema do Confronto (Sanduíche). Quase sempre cai uma questão envolvendo $\\\\lim_{x \\\\to 0} x^2 \\\\sin(1/x) = 0$!',
    status: 'aprovada',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    profiles: { nome: 'Mariana Costa (Engenharia)' }
  },
  {
    id: 'p3',
    autor_id: 'user3',
    universidade_id: '11111111-1111-1111-1111-111111111111',
    titulo: 'Grupo de estudos na BCE (Biblioteca Central) - Quinta 14h',
    corpo: 'Vamos nos reunir para resolver as provas antigas de 2023/2024. Quem quiser colar avisa aqui!',
    status: 'pendente',
    created_at: new Date().toISOString(),
    profiles: { nome: 'Rafael Alves (Monitor)' }
  }
];

let localComentarios: Record<string, Comentario[]> = {
  p1: [
    {
      id: 'c1',
      postagem_id: 'p1',
      autor_id: 'user2',
      corpo: 'Multiplica pelo conjugado do numerador! $(\\\\sqrt{x} + 2) / (\\\\sqrt{x} + 2)$. O numerador vira $(x - 4)$ e simplifica com o de baixo, dando $1 / (\\\\sqrt{4} + 2) = 1/4$!',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      profiles: { nome: 'Mariana Costa' }
    }
  ]
};

// Funções de Acesso a Dados
export const DataService = {
  async getUniversidades(): Promise<Universidade[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('universidades').select('*').eq('ativa', true);
        if (!error && data && data.length > 0) return data as Universidade[];
      } catch {}
    }
    return MOCK_UNIVERSIDADES;
  },

  async getTopicos(universidadeId: string): Promise<Topico[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('topicos')
          .select('*')
          .eq('universidade_id', universidadeId)
          .order('ordem', { ascending: true });
        if (!error && data && data.length > 0) return data as Topico[];
      } catch {}
    }
    return MOCK_TOPICOS;
  },

  async getTopicoById(id: string): Promise<Topico | undefined> {
    const list = await this.getTopicos('11111111-1111-1111-1111-111111111111');
    return list.find((t) => t.id === id);
  },

  async getQuestoes(topicoId: string): Promise<Questao[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('questoes')
          .select('*')
          .eq('topico_id', topicoId);
        if (!error && data && data.length > 0) return data as Questao[];
      } catch {}
    }
    return MOCK_QUESTOES.filter((q) => q.topico_id === topicoId);
  },

  async getAllQuestoes(): Promise<Questao[]> {
    return MOCK_QUESTOES;
  },

  async createTopico(topico: Partial<Topico>): Promise<Topico> {
    const newTopico: Topico = {
      id: 'topico-' + Date.now(),
      universidade_id: topico.universidade_id || '11111111-1111-1111-1111-111111111111',
      titulo: topico.titulo || 'Novo Tópico',
      conteudo_latex: topico.conteudo_latex || '',
      ordem: topico.ordem || 99,
      created_at: new Date().toISOString()
    };
    MOCK_TOPICOS.push(newTopico);
    return newTopico;
  },

  async createQuestao(questao: Partial<Questao>): Promise<Questao> {
    const newQuestao: Questao = {
      id: 'q-' + Date.now(),
      topico_id: questao.topico_id || MOCK_TOPICOS[0].id,
      enunciado_latex: questao.enunciado_latex || '',
      alternativas: questao.alternativas || ['Opção A', 'Opção B', 'Opção C', 'Opção D'],
      resposta_correta: questao.resposta_correta ?? 0,
      explicacao_latex: questao.explicacao_latex || '',
      dificuldade: questao.dificuldade || 'medio'
    };
    MOCK_QUESTOES.push(newQuestao);
    return newQuestao;
  },

  async getPostagens(universidadeId: string, isAdmin: boolean = false, authorId?: string): Promise<Postagem[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('postagens').select('*, profiles(nome)').eq('universidade_id', universidadeId);
        if (!isAdmin) {
          query = query.eq('status', 'aprovada');
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Postagem[];
      } catch {}
    }
    if (isAdmin) {
      return [...localPostagens];
    }
    return localPostagens.filter(
      (p) => p.status === 'aprovada' || (authorId && p.autor_id === authorId)
    );
  },

  async createPostagem(post: { autor_id: string; universidade_id: string; titulo: string; corpo: string; autor_nome?: string }): Promise<Postagem> {
    const newPost: Postagem = {
      id: 'post-' + Date.now(),
      autor_id: post.autor_id,
      universidade_id: post.universidade_id,
      titulo: post.titulo,
      corpo: post.corpo,
      status: 'pendente', // Moderação prévia — postagem aguarda aprovação admin (US15/US18)
      created_at: new Date().toISOString(),
      profiles: { nome: post.autor_nome || 'Estudante' }
    };
    localPostagens = [newPost, ...localPostagens];
    return newPost;
  },

  async moderarPostagem(id: string, status: 'aprovada' | 'reprovada'): Promise<void> {
    localPostagens = localPostagens.map((p) => (p.id === id ? { ...p, status } : p));
  },

  async getComentarios(postagemId: string): Promise<Comentario[]> {
    return localComentarios[postagemId] || [];
  },

  async addComentario(postagemId: string, corpo: string, autorNome: string): Promise<Comentario> {
    const comment: Comentario = {
      id: 'c-' + Date.now(),
      postagem_id: postagemId,
      autor_id: 'user-' + Date.now(),
      corpo,
      created_at: new Date().toISOString(),
      profiles: { nome: autorNome }
    };
    if (!localComentarios[postagemId]) {
      localComentarios[postagemId] = [];
    }
    localComentarios[postagemId].push(comment);
    return comment;
  }
};
