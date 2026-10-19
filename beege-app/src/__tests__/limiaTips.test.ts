import { describe, it, expect } from 'vitest';
import { getLimiaTip, getLimiaTipForTopico, TipContext } from '../utils/limiaTips';

describe('Limia Tips Utility (US08)', () => {
  const allContexts: TipContext[] = [
    'dashboard',
    'pratica_inicio',
    'pratica_acerto',
    'pratica_erro',
    'pratica_fim',
    'forum',
    'topico_limites',
    'topico_derivadas',
    'topico_lhopital',
    'topico_integrais',
    'perfil',
    'admin'
  ];

  it('deve retornar dicas não-vazias para todos os contextos suportados', () => {
    allContexts.forEach((ctx) => {
      const tip = getLimiaTip(ctx);
      expect(typeof tip).toBe('string');
      expect(tip.length).toBeGreaterThan(10);
    });
  });

  it('deve mapear tópicos para seus contextos adequados', () => {
    const tipLimites = getLimiaTipForTopico('1. Limites Fundamentais e Continuidade');
    expect(tipLimites).toBeTruthy();

    const tipDerivadas = getLimiaTipForTopico('2. Derivadas e Regra da Cadeia');
    expect(tipDerivadas).toBeTruthy();

    const tipLhopital = getLimiaTipForTopico('3. Aplicações e Regra de L\'Hôpital');
    expect(tipLhopital).toBeTruthy();

    const tipIntegrais = getLimiaTipForTopico('4. Integrais Indefinidas e Técnicas');
    expect(tipIntegrais).toBeTruthy();

    // Fallback genérico para tópico não mapeado
    const tipDesconhecido = getLimiaTipForTopico('Álgebra Linear e Matrizes');
    expect(tipDesconhecido).toBeTruthy();
  });
});
