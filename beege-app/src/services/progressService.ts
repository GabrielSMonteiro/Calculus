/**
 * ProgressService — Persistência de Progresso do Estudante (US12)
 *
 * Salva e recupera dados de desempenho por tópico usando localStorage.
 * Estrutura: { topicoId: { acertos, erros, ultimaData } }
 */

export interface TopicoProgress {
  acertos: number;
  erros: number;
  ultimaData: string; // ISO string
}

export interface DailyLog {
  data: string; // YYYY-MM-DD
  questoesResolvidas: number;
}

export interface ProgressData {
  topicos: Record<string, TopicoProgress>;
  streak: number;
  dailyLogs: DailyLog[];
  metaDiaria: number;
}

const STORAGE_KEY = 'beege_progress';
const DEFAULT_META_DIARIA = 10;

const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

const loadData = (): ProgressData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as ProgressData;
    }
  } catch {}
  return {
    topicos: {},
    streak: 0,
    dailyLogs: [],
    metaDiaria: DEFAULT_META_DIARIA
  };
};

const saveData = (data: ProgressData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const ProgressService = {
  /**
   * Registra a resposta de uma questão (acerto ou erro) para um tópico.
   */
  registrarResposta(topicoId: string, acertou: boolean): void {
    const data = loadData();

    if (!data.topicos[topicoId]) {
      data.topicos[topicoId] = { acertos: 0, erros: 0, ultimaData: '' };
    }

    if (acertou) {
      data.topicos[topicoId].acertos += 1;
    } else {
      data.topicos[topicoId].erros += 1;
    }

    data.topicos[topicoId].ultimaData = new Date().toISOString();

    // Atualizar log diário
    const hoje = getToday();
    const logHoje = data.dailyLogs.find((l) => l.data === hoje);
    if (logHoje) {
      logHoje.questoesResolvidas += 1;
    } else {
      data.dailyLogs.push({ data: hoje, questoesResolvidas: 1 });
    }

    // Calcular streak
    data.streak = this.calcularStreak(data.dailyLogs);

    saveData(data);
  },

  /**
   * Retorna o progresso de um tópico específico.
   */
  getProgressoTopico(topicoId: string): TopicoProgress {
    const data = loadData();
    return data.topicos[topicoId] || { acertos: 0, erros: 0, ultimaData: '' };
  },

  /**
   * Retorna o progresso geral de todos os tópicos.
   */
  getProgressoGeral(): {
    totalAcertos: number;
    totalErros: number;
    totalExercicios: number;
    taxaAcerto: number;
    streak: number;
    questoesHoje: number;
    metaDiaria: number;
  } {
    const data = loadData();
    let totalAcertos = 0;
    let totalErros = 0;

    Object.values(data.topicos).forEach((tp) => {
      totalAcertos += tp.acertos;
      totalErros += tp.erros;
    });

    const totalExercicios = totalAcertos + totalErros;
    const taxaAcerto = totalExercicios > 0 ? Math.round((totalAcertos / totalExercicios) * 100) : 0;

    const hoje = getToday();
    const logHoje = data.dailyLogs.find((l) => l.data === hoje);
    const questoesHoje = logHoje?.questoesResolvidas || 0;

    return {
      totalAcertos,
      totalErros,
      totalExercicios,
      taxaAcerto,
      streak: data.streak,
      questoesHoje,
      metaDiaria: data.metaDiaria || DEFAULT_META_DIARIA
    };
  },

  /**
   * Calcula a sequência de dias consecutivos de estudo.
   */
  calcularStreak(logs: DailyLog[]): number {
    if (logs.length === 0) return 0;

    // Ordena logs por data decrescente
    const sorted = [...logs].sort((a, b) => b.data.localeCompare(a.data));

    const hoje = getToday();
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    const ontemStr = ontem.toISOString().split('T')[0];

    // Verifica se o dia mais recente é hoje ou ontem
    if (sorted[0].data !== hoje && sorted[0].data !== ontemStr) {
      return 0;
    }

    let streak = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1].data);
      const curr = new Date(sorted[i].data);
      const diffDays = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  },

  /**
   * Retorna o mapa completo de progresso por tópico.
   */
  getAllTopicosProgress(): Record<string, TopicoProgress> {
    const data = loadData();
    return data.topicos;
  },

  /**
   * Limpa todos os dados de progresso (para debug/reset).
   */
  resetProgress(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};
