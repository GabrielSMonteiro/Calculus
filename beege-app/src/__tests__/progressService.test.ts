import { describe, it, expect, beforeEach } from 'vitest';
import { ProgressService } from '../services/progressService';

describe('ProgressService (US12)', () => {
  beforeEach(() => {
    localStorage.clear();
    ProgressService.resetProgress();
  });

  it('deve iniciar com progresso vazio', () => {
    const geral = ProgressService.getProgressoGeral();
    expect(geral.totalExercicios).toBe(0);
    expect(geral.totalAcertos).toBe(0);
    expect(geral.totalErros).toBe(0);
    expect(geral.taxaAcerto).toBe(0);
    expect(geral.streak).toBe(0);
  });

  it('deve registrar respostas corretas e incorretas por tópico', () => {
    const topicoId = 'topico-limites-1';

    ProgressService.registrarResposta(topicoId, true);
    ProgressService.registrarResposta(topicoId, true);
    ProgressService.registrarResposta(topicoId, false);

    const progresso = ProgressService.getProgressoTopico(topicoId);
    expect(progresso.acertos).toBe(2);
    expect(progresso.erros).toBe(1);
    expect(progresso.ultimaData).toBeTruthy();

    const geral = ProgressService.getProgressoGeral();
    expect(geral.totalExercicios).toBe(3);
    expect(geral.totalAcertos).toBe(2);
    expect(geral.totalErros).toBe(1);
    expect(geral.taxaAcerto).toBe(67); // Math.round(2/3 * 100) = 67
    expect(geral.questoesHoje).toBe(3);
  });

  it('deve calcular sequência de dias (streak) corretamente', () => {
    const hoje = new Date().toISOString().split('T')[0];
    const ontem = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const anteontem = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];

    const logsConsecutivos = [
      { data: hoje, questoesResolvidas: 5 },
      { data: ontem, questoesResolvidas: 3 },
      { data: anteontem, questoesResolvidas: 2 }
    ];

    expect(ProgressService.calcularStreak(logsConsecutivos)).toBe(3);

    const logsComQuebra = [
      { data: hoje, questoesResolvidas: 5 },
      { data: '2026-01-01', questoesResolvidas: 2 } // quebra de vários dias
    ];

    expect(ProgressService.calcularStreak(logsComQuebra)).toBe(1);

    expect(ProgressService.calcularStreak([])).toBe(0);
  });

  it('deve permitir resetar o progresso', () => {
    ProgressService.registrarResposta('topico-1', true);
    expect(ProgressService.getProgressoGeral().totalExercicios).toBe(1);

    ProgressService.resetProgress();
    expect(ProgressService.getProgressoGeral().totalExercicios).toBe(0);
    expect(ProgressService.getProgressoTopico('topico-1').acertos).toBe(0);
  });
});
