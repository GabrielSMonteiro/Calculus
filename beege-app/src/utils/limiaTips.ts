/**
 * Pool de dicas contextuais da Limia (US08)
 *
 * Dicas categorizadas por contexto, com seleção aleatória não-repetitiva.
 */

export type TipContext =
  | 'dashboard'
  | 'pratica_inicio'
  | 'pratica_acerto'
  | 'pratica_erro'
  | 'pratica_fim'
  | 'forum'
  | 'topico_limites'
  | 'topico_derivadas'
  | 'topico_lhopital'
  | 'topico_integrais'
  | 'perfil'
  | 'admin';

const tipsPool: Record<TipContext, string[]> = {
  dashboard: [
    'Revise as definições de limites e a regra da cadeia antes dos exercícios práticos.',
    'Que tal resolver pelo menos 5 questões hoje? Consistência é o segredo!',
    'Lembre-se: entender a demonstração ajuda mais do que decorar fórmulas.',
    'Revisão espaçada funciona melhor do que maratonar tudo na véspera da prova!',
    'Comece pelo tópico que você tem mais dificuldade — o cérebro aprende melhor quando desafiado.',
    'Dica de ouro: resolva primeiro sem olhar a explicação, depois confira o passo a passo.'
  ],
  pratica_inicio: [
    'Leia cada questão com atenção. Identifique o tipo de limite/derivada antes de começar a calcular.',
    'Não tenha pressa! Pense na estratégia antes de selecionar a alternativa.',
    'Tente resolver no papel antes de conferir as opções — isso treina seu raciocínio algébrico.',
    'Fique atento às indeterminações: 0/0, ∞/∞, 0·∞ são as mais comuns em prova.'
  ],
  pratica_acerto: [
    'Parabéns! Resposta correta. Revise o desenvolvimento abaixo para memorizar o método.',
    'Mandou bem! Entender o porquê da resposta é tão importante quanto acertar.',
    'Excelente! Tente agora a mesma técnica em uma questão mais difícil.',
    'Arrasou! Esse tipo de questão costuma cair na P1 da UnB. Continue praticando!'
  ],
  pratica_erro: [
    'Ainda não foi dessa vez. Analise a resolução passo a passo abaixo para entender onde ocorreu o detalhe.',
    'Errar faz parte! Revise o passo a passo com calma — a próxima vez será diferente.',
    'Não desanime! Verifique se o erro foi algébrico ou conceitual, isso ajuda muito.',
    'Atenção ao sinal e às simplificações. Muitos erros acontecem na manipulação algébrica.'
  ],
  pratica_fim: [
    'Sessão finalizada! Revise os exercícios que errou para fixar o método correto.',
    'Ótimo treino! Volte amanhã para manter a sequência de estudos ativa.',
    'Concluído! Se teve dificuldade, poste sua dúvida no Fórum para receber ajuda.'
  ],
  forum: [
    'Use $formula$ para equações na mesma linha ou $$formula$$ para blocos destacados.',
    'Ao postar uma dúvida, inclua o número da questão e a lista. Isso ajuda os colegas a identificarem o exercício.',
    'Responda dúvidas de colegas — ensinar é uma das melhores formas de aprender!',
    'Pesquise se sua dúvida já foi respondida antes de criar uma nova postagem.'
  ],
  topico_limites: [
    'Observe as definições conceituais e os limites fundamentais antes de tentar resolver os exercícios.',
    'Limites laterais são essenciais para funções definidas por partes — não esqueça de verificar ambos os lados!',
    'O Teorema do Confronto (Sanduíche) é uma ferramenta poderosa para limites trigonométricos.',
    'Lembre: se substituir e não der indeterminação, o limite é direto!'
  ],
  topico_derivadas: [
    'Domine as regras básicas (potência, produto, quociente) antes de avançar para a Regra da Cadeia.',
    'A Regra da Cadeia é a técnica mais cobrada em derivadas compostas. Pratique bastante!',
    'Derivada de função composta: derive "de fora para dentro" multiplicando as derivadas parciais.',
    'Não esqueça que a derivada de uma constante é sempre zero!'
  ],
  topico_lhopital: [
    'A Regra de L\'Hôpital só funciona quando a substituição direta resulta em 0/0 ou ∞/∞.',
    'Às vezes é mais eficiente fatorar ou racionalizar do que aplicar L\'Hôpital repetidamente.',
    'Pontos críticos: onde f\'(c) = 0 ou f\'(c) não existe. Teste a segunda derivada para classificar.',
    'Para máximos e mínimos, a segunda derivada positiva indica mínimo local (concavidade para cima).'
  ],
  topico_integrais: [
    'Na integração por partes, use LIATE para escolher u: Logarítmica, Inversa trig, Algébrica, Trig, Exponencial.',
    'Substituição (u-sub): escolha u como a parte "de dentro" da função composta.',
    'Não esqueça a constante de integração C nas integrais indefinidas!',
    'Para integrais definidas, aplique os limites de integração após encontrar a antiderivada.'
  ],
  perfil: [
    'Você está indo muito bem! Continue praticando para dominar todos os tópicos.',
    'Manter uma sequência de estudos diária é o caminho para o sucesso na prova!',
    'Já completou a meta diária de exercícios? Cada questão conta!',
    'Revise os tópicos com menor taxa de acerto para melhorar seu desempenho geral.'
  ],
  admin: [
    'Painel administrativo para gestão de tópicos teóricos, cadastro de exercícios com KaTeX e moderação de publicações do fórum.',
    'Lembre de adicionar explicações detalhadas nas questões — isso ajuda muito os alunos!',
    'Modere o fórum regularmente para manter a qualidade das discussões.'
  ]
};

// Armazena o último índice usado por contexto para evitar repetição imediata
const lastUsedIndex: Record<string, number> = {};

/**
 * Retorna uma dica aleatória para o contexto especificado,
 * evitando repetir a última dica mostrada naquele contexto.
 */
export function getLimiaTip(context: TipContext): string {
  const tips = tipsPool[context];
  if (!tips || tips.length === 0) {
    return 'Bons estudos com o BeeGe!';
  }

  if (tips.length === 1) {
    return tips[0];
  }

  let idx: number;
  do {
    idx = Math.floor(Math.random() * tips.length);
  } while (idx === lastUsedIndex[context]);

  lastUsedIndex[context] = idx;
  return tips[idx];
}

/**
 * Retorna a dica contextual de tópico com base no título do tópico.
 */
export function getLimiaTipForTopico(titulo: string): string {
  const tituloLower = titulo.toLowerCase();

  if (tituloLower.includes('limite') || tituloLower.includes('continuidade')) {
    return getLimiaTip('topico_limites');
  }
  if (tituloLower.includes('derivad') || tituloLower.includes('cadeia')) {
    return getLimiaTip('topico_derivadas');
  }
  if (tituloLower.includes('hôpital') || tituloLower.includes('hopital') || tituloLower.includes('máximo') || tituloLower.includes('mínimo')) {
    return getLimiaTip('topico_lhopital');
  }
  if (tituloLower.includes('integral') || tituloLower.includes('antiderivada')) {
    return getLimiaTip('topico_integrais');
  }

  return getLimiaTip('dashboard');
}
