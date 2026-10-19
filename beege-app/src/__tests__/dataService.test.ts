import { describe, it, expect } from 'vitest';
import { DataService } from '../services/dataService';

describe('DataService & Mock Dataset', () => {
  it('deve carregar a lista de universidades ativas', async () => {
    const unis = await DataService.getUniversidades();
    expect(unis.length).toBeGreaterThanOrEqual(3);
    const ufrj = unis.find((u) => u.sigla === 'UFRJ');
    expect(ufrj).toBeDefined();
    expect(ufrj?.nome).toContain('Rio de Janeiro');
  });

  it('deve carregar os tópicos teóricos', async () => {
    const topicos = await DataService.getTopicos('11111111-1111-1111-1111-111111111111');
    expect(topicos.length).toBeGreaterThanOrEqual(4);
    expect(topicos[0].titulo).toContain('Limites');
    expect(topicos[1].titulo).toContain('Derivadas');
    expect(topicos[2].titulo).toContain('L\'Hôpital');
    expect(topicos[3].titulo).toContain('Integrais');
  });

  it('deve possuir no mínimo 20 questões no banco (meta MVP 20+)', async () => {
    const todasQuestoes = await DataService.getAllQuestoes();
    expect(todasQuestoes.length).toBeGreaterThanOrEqual(20);
    expect(todasQuestoes.length).toBe(24); // 6 por tópico

    // Cada questão deve possuir enunciado, 4 alternativas, resposta_correta e explicação
    todasQuestoes.forEach((q) => {
      expect(q.enunciado_latex).toBeTruthy();
      expect(q.alternativas.length).toBeGreaterThanOrEqual(4);
      expect(q.resposta_correta).toBeGreaterThanOrEqual(0);
      expect(q.resposta_correta).toBeLessThan(q.alternativas.length);
      expect(q.explicacao_latex).toBeTruthy();
    });
  });

  it('deve criar postagens como pendentes e respeitar moderação', async () => {
    const uniId = '11111111-1111-1111-1111-111111111111';
    const novaPostagem = await DataService.createPostagem({
      autor_id: 'user-aluno-test',
      universidade_id: uniId,
      titulo: 'Dúvida sobre limite do seno',
      corpo: 'Como demonstrar que $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$?',
      autor_nome: 'Aluno Teste'
    });

    expect(novaPostagem.status).toBe('pendente');

    // Usuário comum (não-admin e não-autor) não deve ver a postagem pendente
    const postsPublicos = await DataService.getPostagens(uniId, false, 'outro-user');
    expect(postsPublicos.some((p) => p.id === novaPostagem.id)).toBe(false);

    // O autor da postagem deve ver sua própria postagem pendente
    const postsAutor = await DataService.getPostagens(uniId, false, 'user-aluno-test');
    expect(postsAutor.some((p) => p.id === novaPostagem.id)).toBe(true);

    // O administrador deve ver todas as postagens pendentes
    const postsAdmin = await DataService.getPostagens(uniId, true);
    expect(postsAdmin.some((p) => p.id === novaPostagem.id)).toBe(true);

    // Administrador aprova a postagem
    await DataService.moderarPostagem(novaPostagem.id, 'aprovada');
    const postsAposAprovacao = await DataService.getPostagens(uniId, false);
    expect(postsAposAprovacao.some((p) => p.id === novaPostagem.id)).toBe(true);
  });
});
