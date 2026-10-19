import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import MathRenderer from '../components/MathRenderer';

describe('MathRenderer Component', () => {
  it('deve renderizar texto plano', () => {
    const { container } = render(<MathRenderer content="Texto introdutório de Cálculo" />);
    expect(container.textContent).toContain('Texto introdutório de Cálculo');
  });

  it('deve processar headings markdown (###, ##, #)', () => {
    const markdown = '### Limite Fundamental\n## Continuidade\n# Introdução';
    const { container } = render(<MathRenderer content={markdown} />);

    expect(container.querySelector('h4.beege-h3')).toBeTruthy();
    expect(container.querySelector('h3.beege-h2')).toBeTruthy();
    expect(container.querySelector('h2.beege-h1')).toBeTruthy();
  });

  it('deve processar listas com marcadores', () => {
    const listContent = '- Item 1: Limite\n- Item 2: Derivada\n- Item 3: Integral';
    const { container } = render(<MathRenderer content={listContent} />);

    const list = container.querySelector('ul.beege-list');
    expect(list).toBeTruthy();
    const items = container.querySelectorAll('li');
    expect(items.length).toBe(3);
  });

  it('deve processar blockquotes', () => {
    const bqContent = '> Dica de cálculo: multiplique pelo conjugado.';
    const { container } = render(<MathRenderer content={bqContent} />);

    const bq = container.querySelector('blockquote.beege-blockquote');
    expect(bq).toBeTruthy();
    expect(bq?.textContent).toContain('Dica de cálculo');
  });

  it('deve processar expressões inline com $ ... $ via KaTeX', () => {
    const inlineContent = 'Seja a função $f(x) = x^2$.';
    const { container } = render(<MathRenderer content={inlineContent} />);

    expect(container.querySelector('.katex')).toBeTruthy();
  });

  it('deve processar fórmulas em bloco $$ ... $$ via KaTeX', () => {
    const blockContent = '$$\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$$';
    const { container } = render(<MathRenderer content={blockContent} />);

    expect(container.querySelector('.katex-display-wrapper')).toBeTruthy();
  });
});
