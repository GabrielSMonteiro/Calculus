-- ==============================================================================
-- BeeGe - Dados Iniciais (Seed Data)
-- Suporte multi-universidade expansivel
-- ==============================================================================

-- 1. Inserir Universidades
INSERT INTO public.universidades (id, nome, sigla, logo_url, ativa)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Universidade Federal do Rio de Janeiro', 'UFRJ', 'https://ufrj.br/favicon.ico', true),
    ('22222222-2222-2222-2222-222222222222', 'Universidade Federal de Minas Gerais', 'UFMG', 'https://ufmg.br/favicon.ico', true),
    ('33333333-3333-3333-3333-333333333333', 'Universidade de Sao Paulo', 'USP', 'https://usp.br/favicon.ico', true)
ON CONFLICT (sigla) DO NOTHING;

-- 2. Inserir Topicos de Calculo 1
INSERT INTO public.topicos (id, universidade_id, titulo, descricao, ordem, conteudo_latex)
VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Limites Fundamentais e Continuidade',
    'Conceito formal de limite, limites laterais, indeterminacoes e o primeiro limite fundamental.',
    1,
    E'### O Conceito Intuitivo de Limite\n\nDizemos que o limite de $f(x)$ quando $x$ tende a $a$ e igual a $L$:\n\n$$\\lim_{x \\to a} f(x) = L$$\n\nSe for possivel aproximar os valores de $f(x)$ arbitrariamente proximos de $L$, tomando $x$ suficientemente proximo de $a$ (com $x \\neq a$).\n\n### Limite Fundamental Trigonometrico\n\nO limite trigonometrico classico cobrado em Calculo 1 e:\n\n$$\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$$\n\n> **Observacao pratica:** Para calcular $\\lim_{x \\to 0} \\frac{\\sin(k x)}{x}$, multiplique e divida a fracao pela constante $k$, obtendo $k \\cdot 1 = k$.\n\n### Condicoes de Continuidade\n\nUma funcao $f(x)$ e continua em um ponto $x = c$ quando satisfaz simultaneamente tres condicoes:\n1. $f(c)$ esta definida no dominio.\n2. $\\lim_{x \\to c} f(x)$ existe.\n3. $\\lim_{x \\to c} f(x) = f(c)$.'
),
(
    'a2222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Derivadas e Regra da Cadeia',
    'Taxa instantanea de variacao, regras operatorias fundamentais e diferenciacao de funcoes compostas.',
    2,
    E'### Definicao de Derivada\n\nA derivada de $f(x)$ em um ponto $x$ expressa o limite do quociente de diferencas:\n\n$$f''(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$\n\n### Regra da Cadeia\n\nPara a composicao $y = f(g(x))$, a diferenciacao com relacao a $x$ segue:\n\n$$\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx} \\quad \\text{onde } u = g(x)$$\n\nOu equivalentemente:\n\n$$(f(g(x)))'' = f''(g(x)) \\cdot g''(x)$$\n\n### Regras Operatorias\n- Regra do Produto: $(u \\cdot v)'' = u''v + uv''$\n- Regra do Quociente: $\\left(\\frac{u}{v}\\right)'' = \\frac{u''v - uv''}{v^2}$'
),
(
    'a3333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Aplicacoes da Derivada e Regra de L\'Hopital',
    'Determinacao de pontos criticos, maximos e minimos locais, concavidade e indeterminacoes.',
    3,
    E'### Regra de L\'Hopital\n\nCaso o limite $\\lim_{x \\to a} \\frac{f(x)}{g(x)}$ resulte em indeterminacao do tipo $\\left[\\frac{0}{0}\\right]$ ou $\\left[\\frac{\\pm \\infty}{\\pm \\infty}\\right]$, tem-se:\n\n$$\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f''(x)}{g''(x)}$$\n\ncontanto que o limite dos quocientes das derivadas exista ou seja infinito.\n\n### Teste da Primeira Derivada\n- Se o sinal de $f''(x)$ muda de positivo para negativo ao passar por um ponto critico $c$, entao $c$ e ponto de maximo local.\n- Se o sinal muda de negativo para positivo, entao $c$ e ponto de minimo local.'
),
(
    'a4444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'Integrais Indefinidas e Tecnicas de Integracao',
    'Primitivas, integracao por substituicao de variavel e integracao por partes.',
    4,
    E'### Integral Indefinida\n\nA integral indefinida determina a familia de antiderivadas de uma funcao:\n\n$$\\int f(x) \\, dx = F(x) + C \\quad \\text{onde } F''(x) = f(x)$$\n\n### Integracao por Partes\n\nDerivada diretamente da regra do produto para diferenciacao:\n\n$$\\int u \\, dv = u \\cdot v - \\int v \\, du$$\n\nRecomenda-se escolher $u$ como o termo que se simplifica ao ser derivado, e $dv$ como o termo facilmente integravel.'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Inserir Questoes de Revisao (24 Questoes - 6 por topico)
INSERT INTO public.questoes (id, topico_id, enunciado_latex, alternativas, resposta_correta, explicacao_latex, dificuldade)
VALUES
(
    'b1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'Calcule o limite fundamental: $$\\lim_{x \\to 0} \\frac{\\sin(5x)}{2x}$$',
    '["5/2","0","1","2/5","Não existe"]'::jsonb,
    0,
    'Reescreva a expressão: $$\\lim_{x \\to 0} \\frac{\\sin(5x)}{2x} = \\frac{5}{2} \\cdot \\lim_{x \\to 0} \\frac{\\sin(5x)}{5x} = \\frac{5}{2} \\cdot 1 = \\frac{5}{2}$$.',
    'facil'
),
(
    'b1111111-1111-1111-1111-111111111112',
    'a1111111-1111-1111-1111-111111111111',
    'Calcule: $$\\lim_{x \\to 0} \\frac{\\tan(3x)}{\\sin(2x)}$$',
    '["3/2","2/3","1","0"]'::jsonb,
    0,
    'Reescreva: $$\\frac{\\tan(3x)}{\\sin(2x)} = \\frac{\\sin(3x)}{\\cos(3x) \\cdot \\sin(2x)}$$.
Quando $x \\to 0$, $\\cos(3x) \\to 1$, e usando limites fundamentais:
$$\\frac{\\sin(3x)}{\\sin(2x)} = \\frac{3x}{2x} \\cdot \\frac{\\sin(3x)/3x}{\\sin(2x)/2x} \\to \\frac{3}{2} \\cdot \\frac{1}{1} = \\frac{3}{2}$$.',
    'medio'
),
(
    'b1111111-1111-1111-1111-111111111113',
    'a1111111-1111-1111-1111-111111111111',
    'Determine: $$\\lim_{x \\to 4} \\frac{\\sqrt{x} - 2}{x - 4}$$',
    '["1/4","1/2","0","4"]'::jsonb,
    0,
    'Multiplique pelo conjugado:
$$\\frac{\\sqrt{x} - 2}{x - 4} \\cdot \\frac{\\sqrt{x} + 2}{\\sqrt{x} + 2} = \\frac{x - 4}{(x - 4)(\\sqrt{x} + 2)} = \\frac{1}{\\sqrt{x} + 2}$$
Para $x \\to 4$: $\\frac{1}{\\sqrt{4} + 2} = \\frac{1}{4}$.',
    'facil'
),
(
    'b1111111-1111-1111-1111-111111111114',
    'a1111111-1111-1111-1111-111111111111',
    'Avalie a continuidade de $f(x)$ em $x = 2$:
$$f(x) = \\begin{cases} x^2 - 1 & \\text{se } x < 2 \\\\ 3 & \\text{se } x = 2 \\\\ 2x - 1 & \\text{se } x > 2 \\end{cases}$$',
    '["Contínua","Descontínua (limites laterais diferentes)","Descontínua (limite ≠ f(2))","Descontínua (f(2) não existe)"]'::jsonb,
    0,
    'Verificação:
1. $f(2) = 3$ ✓
2. $\\lim_{x \\to 2^-} f(x) = 4 - 1 = 3$ e $\\lim_{x \\to 2^+} f(x) = 4 - 1 = 3$, logo $\\lim_{x \\to 2} f(x) = 3$ ✓
3. $\\lim_{x \\to 2} f(x) = f(2) = 3$ ✓
Todas as condições de continuidade são satisfeitas.',
    'medio'
),
(
    'b1111111-1111-1111-1111-111111111115',
    'a1111111-1111-1111-1111-111111111111',
    'Calcule o limite exponencial fundamental: $$\\lim_{x \\to 0} \\frac{e^x - 1}{x}$$',
    '["1","0","e","\\\\infty"]'::jsonb,
    0,
    'Este é um dos limites fundamentais mais importantes:
$$\\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1$$
Pode ser demonstrado pela expansão em série de Taylor: $e^x = 1 + x + \\frac{x^2}{2!} + \\cdots$',
    'facil'
),
(
    'b1111111-1111-1111-1111-111111111116',
    'a1111111-1111-1111-1111-111111111111',
    'Determine: $$\\lim_{x \\to \\infty} \\frac{3x^2 + 5x - 1}{2x^2 - x + 4}$$',
    '["3/2","0","\\\\infty","5"]'::jsonb,
    0,
    'Divida numerador e denominador pelo termo de maior grau $x^2$:
$$\\lim_{x \\to \\infty} \\frac{3 + 5/x - 1/x^2}{2 - 1/x + 4/x^2} = \\frac{3 + 0 - 0}{2 - 0 + 0} = \\frac{3}{2}$$',
    'facil'
),
(
    'b2222222-2222-2222-2222-222222222222',
    'a2222222-2222-2222-2222-222222222222',
    'Determine a derivada da função: $$f(x) = e^{3x} \\cdot \\cos(x)$$',
    '["e^{3x}(3\\\\cos(x) - \\\\sin(x))","3e^{3x}\\\\cos(x)","-e^{3x}\\\\sin(x)","e^{3x}(\\\\cos(x) + 3\\\\sin(x))"]'::jsonb,
    0,
    'Pela Regra do Produto: $(u \\cdot v)'' = u''v + uv''$.
Com $u=e^{3x} \\implies u''=3e^{3x}$ e $v=\\cos(x) \\implies v''=-\\sin(x)$.
Resultado: $e^{3x}(3\\cos(x) - \\sin(x))$.',
    'medio'
),
(
    'b2222222-2222-2222-2222-222222222223',
    'a2222222-2222-2222-2222-222222222222',
    'Derive usando a Regra da Cadeia: $$f(x) = \\sin(x^3 + 2x)$$',
    '["(3x^2 + 2)\\\\cos(x^3 + 2x)","\\\\cos(x^3 + 2x)","3x^2 \\\\cos(x^3)","(x^3 + 2x)\\\\cos(x^3 + 2x)"]'::jsonb,
    0,
    'Pela Regra da Cadeia: $f''(x) = \\cos(g(x)) \\cdot g''(x)$.
Com $g(x) = x^3 + 2x \\implies g''(x) = 3x^2 + 2$.
Resultado: $(3x^2 + 2)\\cos(x^3 + 2x)$.',
    'medio'
),
(
    'b2222222-2222-2222-2222-222222222224',
    'a2222222-2222-2222-2222-222222222222',
    'Determine $f''(x)$ para: $$f(x) = \\frac{x^2 + 1}{x - 3}$$',
    '["\\\\frac{x^2 - 6x - 1}{(x-3)^2}","\\\\frac{2x}{1}","\\\\frac{2x(x-3) - x^2}{(x-3)^2}","\\\\frac{x^2 - 1}{(x-3)^2}"]'::jsonb,
    0,
    'Pela Regra do Quociente: $\\left(\\frac{u}{v}\\right)'' = \\frac{u''v - uv''}{v^2}$.
$u = x^2+1, u'' = 2x, v = x-3, v'' = 1$.
$$f''(x) = \\frac{2x(x-3) - (x^2+1)(1)}{(x-3)^2} = \\frac{2x^2-6x-x^2-1}{(x-3)^2} = \\frac{x^2-6x-1}{(x-3)^2}$$',
    'medio'
),
(
    'b2222222-2222-2222-2222-222222222225',
    'a2222222-2222-2222-2222-222222222222',
    'Qual é a derivada de $f(x) = \\ln(\\cos(x))$?',
    '["-\\\\tan(x)","\\\\frac{1}{\\\\cos(x)}","-\\\\sin(x)","\\\\tan(x)"]'::jsonb,
    0,
    'Regra da Cadeia com $u = \\cos(x)$:
$$f''(x) = \\frac{1}{\\cos(x)} \\cdot (-\\sin(x)) = \\frac{-\\sin(x)}{\\cos(x)} = -\\tan(x)$$',
    'medio'
),
(
    'b2222222-2222-2222-2222-222222222226',
    'a2222222-2222-2222-2222-222222222222',
    'Encontre a equação da reta tangente a $f(x) = x^3$ no ponto $x = 1$.',
    '["y = 3x - 2","y = 3x - 1","y = x","y = 3x"]'::jsonb,
    0,
    '$f(1) = 1$ e $f''(x) = 3x^2 \\implies f''(1) = 3$.
Equação da tangente: $y - y_0 = m(x - x_0) \\implies y - 1 = 3(x - 1) \\implies y = 3x - 2$.',
    'facil'
),
(
    'b2222222-2222-2222-2222-222222222227',
    'a2222222-2222-2222-2222-222222222222',
    'Derive: $f(x) = e^{\\sqrt{x}}$',
    '["\\\\frac{e^{\\\\sqrt{x}}}{2\\\\sqrt{x}}","e^{\\\\sqrt{x}}","\\\\sqrt{x} \\\\cdot e^{\\\\sqrt{x}-1}","\\\\frac{e^{\\\\sqrt{x}}}{\\\\sqrt{x}}"]'::jsonb,
    0,
    'Cadeia com $u = \\sqrt{x} = x^{1/2}$:
$$f''(x) = e^{\\sqrt{x}} \\cdot \\frac{d}{dx}(x^{1/2}) = e^{\\sqrt{x}} \\cdot \\frac{1}{2\\sqrt{x}} = \\frac{e^{\\sqrt{x}}}{2\\sqrt{x}}$$',
    'dificil'
),
(
    'b3333333-3333-3333-3333-333333333333',
    'a3333333-3333-3333-3333-333333333333',
    'Utilize a Regra de L''Hôpital para calcular: $$\\lim_{x \\to 0} \\frac{e^x - 1 - x}{x^2}$$',
    '["1/2","0","1","2","\\\\infty"]'::jsonb,
    0,
    'Substituindo $x=0$, temos $[0/0]$.
1ª derivada: $\\lim_{x \\to 0} \\frac{e^x - 1}{2x} = [0/0]$.
2ª derivada: $\\lim_{x \\to 0} \\frac{e^x}{2} = \\frac{1}{2}$.',
    'medio'
),
(
    'b3333333-3333-3333-3333-333333333334',
    'a3333333-3333-3333-3333-333333333333',
    'Aplique L''Hôpital: $$\\lim_{x \\to 0} \\frac{\\sin(x) - x}{x^3}$$',
    '["-1/6","0","-1/3","1/6"]'::jsonb,
    0,
    'Substituindo $x=0$: $[0/0]$.
1ª L''Hôpital: $\\frac{\\cos(x) - 1}{3x^2} \\to [0/0]$.
2ª L''Hôpital: $\\frac{-\\sin(x)}{6x} \\to [0/0]$.
3ª L''Hôpital: $\\frac{-\\cos(x)}{6} = \\frac{-1}{6}$.',
    'dificil'
),
(
    'b3333333-3333-3333-3333-333333333335',
    'a3333333-3333-3333-3333-333333333333',
    'Encontre os intervalos de crescimento de $f(x) = x^3 - 3x^2 + 4$.',
    '["(-\\\\infty, 0) \\\\cup (2, \\\\infty)","(0, 2)","(-\\\\infty, \\\\infty)","(-\\\\infty, -1) \\\\cup (1, \\\\infty)"]'::jsonb,
    0,
    '$f''(x) = 3x^2 - 6x = 3x(x - 2)$.
Pontos críticos: $x = 0$ e $x = 2$.
$f''(x) > 0$ para $x < 0$ e $x > 2$ → crescente em $(-\\infty, 0) \\cup (2, \\infty)$.
$f''(x) < 0$ para $0 < x < 2$ → decrescente.',
    'medio'
),
(
    'b3333333-3333-3333-3333-333333333336',
    'a3333333-3333-3333-3333-333333333333',
    'Classifique o ponto crítico $x = -1$ de $f(x) = x^3 - 3x + 2$ usando a segunda derivada.',
    '["Máximo local","Mínimo local","Ponto de inflexão","Não é ponto crítico"]'::jsonb,
    0,
    '$f''(x) = 3x^2 - 3$. Em $x = -1$: $f''(-1) = 3 - 3 = 0$ ✓ (ponto crítico).
$f''''(x) = 6x$. Em $x = -1$: $f''''(-1) = -6 < 0$ → concavidade para baixo → **Máximo local**.',
    'medio'
),
(
    'b3333333-3333-3333-3333-333333333337',
    'a3333333-3333-3333-3333-333333333333',
    'Calcule: $$\\lim_{x \\to 0^+} x \\ln(x)$$',
    '["0","-\\\\infty","1","Não existe"]'::jsonb,
    0,
    'Indeterminação $0 \\cdot (-\\infty)$. Reescreva como:
$$\\lim_{x \\to 0^+} \\frac{\\ln(x)}{1/x} = \\frac{-\\infty}{+\\infty}$$
L''Hôpital: $\\frac{1/x}{-1/x^2} = \\frac{x^2}{-x} = -x \\to 0$.',
    'dificil'
),
(
    'b3333333-3333-3333-3333-333333333338',
    'a3333333-3333-3333-3333-333333333333',
    'Calcule usando L''Hôpital: $$\\lim_{x \\to \\infty} \\frac{\\ln(x)}{\\sqrt{x}}$$',
    '["0","1","\\\\infty","2"]'::jsonb,
    0,
    'Forma $\\frac{\\infty}{\\infty}$. L''Hôpital:
$$\\lim_{x \\to \\infty} \\frac{1/x}{1/(2\\sqrt{x})} = \\lim_{x \\to \\infty} \\frac{2\\sqrt{x}}{x} = \\lim_{x \\to \\infty} \\frac{2}{\\sqrt{x}} = 0$$',
    'medio'
),
(
    'b4444444-4444-4444-4444-444444444444',
    'a4444444-4444-4444-4444-444444444444',
    'Calcule a integral por partes: $$\\int x e^x \\, dx$$',
    '["e^x(x - 1) + C","e^x(x + 1) + C","x e^x + C","\\\\frac{x^2}{2}e^x + C"]'::jsonb,
    0,
    'Escolha $u=x \\implies du=dx$ e $dv=e^x dx \\implies v=e^x$.
$$\\int u dv = uv - \\int v du = x e^x - \\int e^x dx = e^x(x - 1) + C$$.',
    'medio'
),
(
    'b4444444-4444-4444-4444-444444444445',
    'a4444444-4444-4444-4444-444444444444',
    'Resolva por substituição: $$\\int 2x \\cos(x^2) \\, dx$$',
    '["\\\\sin(x^2) + C","\\\\cos(x^2) + C","x^2 \\\\sin(x^2) + C","-\\\\sin(x^2) + C"]'::jsonb,
    0,
    'Faça $u = x^2 \\implies du = 2x \\, dx$.
$$\\int 2x \\cos(x^2) dx = \\int \\cos(u) du = \\sin(u) + C = \\sin(x^2) + C$$',
    'facil'
),
(
    'b4444444-4444-4444-4444-444444444446',
    'a4444444-4444-4444-4444-444444444444',
    'Calcule: $$\\int \\frac{1}{x^2 + 1} \\, dx$$',
    '["\\\\arctan(x) + C","\\\\ln(x^2+1) + C","\\\\frac{-1}{x} + C","\\\\arcsin(x) + C"]'::jsonb,
    0,
    'Esta é uma integral fundamental tabelada:
$$\\int \\frac{1}{x^2 + 1} dx = \\arctan(x) + C$$
É a antiderivada da função $\\frac{d}{dx}[\\arctan(x)] = \\frac{1}{x^2+1}$.',
    'facil'
),
(
    'b4444444-4444-4444-4444-444444444447',
    'a4444444-4444-4444-4444-444444444444',
    'Resolva: $$\\int x^2 e^x \\, dx$$',
    '["e^x(x^2 - 2x + 2) + C","e^x(x^2 + 2x + 2) + C","x^2 e^x + C","e^x(x^2 - 2) + C"]'::jsonb,
    0,
    'Integração por partes dupla:
1ª: $u=x^2, dv=e^x dx \\implies x^2 e^x - 2\\int x e^x dx$.
2ª: $\\int x e^x dx = e^x(x-1)$ (resultado anterior).
Resultado: $e^x(x^2 - 2x + 2) + C$.',
    'dificil'
),
(
    'b4444444-4444-4444-4444-444444444448',
    'a4444444-4444-4444-4444-444444444444',
    'Determine: $$\\int \\frac{3x}{x^2 + 4} \\, dx$$',
    '["\\\\frac{3}{2}\\\\ln(x^2+4) + C","3\\\\arctan(x/2) + C","\\\\frac{3}{2}\\\\ln|x+2| + C","3\\\\ln(x^2+4) + C"]'::jsonb,
    0,
    'Faça $u = x^2 + 4 \\implies du = 2x \\, dx$.
$$\\int \\frac{3x}{x^2+4} dx = \\frac{3}{2} \\int \\frac{du}{u} = \\frac{3}{2} \\ln|u| + C = \\frac{3}{2}\\ln(x^2+4) + C$$',
    'medio'
),
(
    'b4444444-4444-4444-4444-444444444449',
    'a4444444-4444-4444-4444-444444444444',
    'Calcule: $$\\int \\ln(x) \\, dx$$',
    '["x\\\\ln(x) - x + C","\\\\frac{1}{x} + C","x\\\\ln(x) + C","\\\\frac{\\\\ln(x)^2}{2} + C"]'::jsonb,
    0,
    'Por partes com $u = \\ln(x), dv = dx$:
$du = \\frac{1}{x}dx, v = x$.
$$\\int \\ln(x) dx = x\\ln(x) - \\int x \\cdot \\frac{1}{x} dx = x\\ln(x) - x + C$$',
    'medio'
)
ON CONFLICT (id) DO NOTHING;
