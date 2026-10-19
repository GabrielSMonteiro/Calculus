import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  block?: boolean;
}

/**
 * Renderiza textos mistos contendo Markdown básico e fórmulas matemáticas em LaTeX:
 * - Fórmulas em bloco: $$ expressao $$
 * - Fórmulas inline: $ expressao $
 * - Headings: ###, ##, #
 * - Listas: - item
 * - Blockquotes: > texto
 * - Negrito: **texto**
 * - Linhas horizontais: ---
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '', block = false }) => {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    // Se for solicitado forçado em bloco e não tiver delimitadores
    if (block && !content.includes('$')) {
      try {
        return katex.renderToString(content, { displayMode: true, throwOnError: false });
      } catch (err) {
        console.error('KaTeX error:', err);
        return content;
      }
    }

    // 1) Processar blocos $$ ... $$ (preservar como placeholders para não afetar markdown)
    const blockPlaceholders: string[] = [];
    let text = content.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
      try {
        const rendered = `<div class="katex-display-wrapper">${katex.renderToString(math.trim(), {
          displayMode: true,
          throwOnError: false
        })}</div>`;
        blockPlaceholders.push(rendered);
        return `%%KATEX_BLOCK_${blockPlaceholders.length - 1}%%`;
      } catch {
        blockPlaceholders.push(`<code>${math}</code>`);
        return `%%KATEX_BLOCK_${blockPlaceholders.length - 1}%%`;
      }
    });

    // 2) Processar inline $ ... $ (preservar como placeholders)
    const inlinePlaceholders: string[] = [];
    text = text.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
      try {
        const rendered = katex.renderToString(math.trim(), {
          displayMode: false,
          throwOnError: false
        });
        inlinePlaceholders.push(rendered);
        return `%%KATEX_INLINE_${inlinePlaceholders.length - 1}%%`;
      } catch {
        inlinePlaceholders.push(`<code>${math}</code>`);
        return `%%KATEX_INLINE_${inlinePlaceholders.length - 1}%%`;
      }
    });

    // 3) Processar Markdown por linhas
    const lines = text.split('\n');
    const processedLines: string[] = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Linha horizontal ---
      if (/^---+\s*$/.test(line.trim())) {
        if (inList) { processedLines.push('</ul>'); inList = false; }
        processedLines.push('<hr class="beege-hr" />');
        continue;
      }

      // Headings ### ## #
      const h3Match = line.match(/^###\s+(.+)$/);
      if (h3Match) {
        if (inList) { processedLines.push('</ul>'); inList = false; }
        processedLines.push(`<h4 class="beege-heading beege-h3">${processInlineMarkdown(h3Match[1])}</h4>`);
        continue;
      }

      const h2Match = line.match(/^##\s+(.+)$/);
      if (h2Match) {
        if (inList) { processedLines.push('</ul>'); inList = false; }
        processedLines.push(`<h3 class="beege-heading beege-h2">${processInlineMarkdown(h2Match[1])}</h3>`);
        continue;
      }

      const h1Match = line.match(/^#\s+(.+)$/);
      if (h1Match) {
        if (inList) { processedLines.push('</ul>'); inList = false; }
        processedLines.push(`<h2 class="beege-heading beege-h1">${processInlineMarkdown(h1Match[1])}</h2>`);
        continue;
      }

      // Blockquote > texto
      const bqMatch = line.match(/^>\s*(.+)$/);
      if (bqMatch) {
        if (inList) { processedLines.push('</ul>'); inList = false; }
        processedLines.push(`<blockquote class="beege-blockquote">${processInlineMarkdown(bqMatch[1])}</blockquote>`);
        continue;
      }

      // Lista - item ou numero. item
      const listMatch = line.match(/^[-*]\s+(.+)$/) || line.match(/^\d+\.\s+(.+)$/);
      if (listMatch) {
        if (!inList) { processedLines.push('<ul class="beege-list">'); inList = true; }
        processedLines.push(`<li>${processInlineMarkdown(listMatch[1])}</li>`);
        continue;
      }

      // Linha vazia
      if (line.trim() === '') {
        if (inList) { processedLines.push('</ul>'); inList = false; }
        processedLines.push('<div class="beege-spacer"></div>');
        continue;
      }

      // Linha de texto normal
      if (inList) { processedLines.push('</ul>'); inList = false; }
      processedLines.push(`<p class="beege-paragraph">${processInlineMarkdown(line)}</p>`);
    }

    if (inList) { processedLines.push('</ul>'); }

    let result = processedLines.join('\n');

    // 4) Restaurar placeholders KaTeX
    blockPlaceholders.forEach((html, idx) => {
      result = result.replace(`%%KATEX_BLOCK_${idx}%%`, html);
    });
    inlinePlaceholders.forEach((html, idx) => {
      result = result.replace(`%%KATEX_INLINE_${idx}%%`, html);
    });

    return result;
  }, [content, block]);

  return (
    <div
      className={`beege-math-content ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

/** Processar formatação inline: negrito, itálico, código */
function processInlineMarkdown(text: string): string {
  // Negrito **texto**
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Itálico *texto*
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Código `texto`
  text = text.replace(/`([^`]+)`/g, '<code class="beege-inline-code">$1</code>');
  return text;
}

export default MathRenderer;
