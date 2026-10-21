import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonProgressBar
} from '@ionic/react';
import {
  arrowBackOutline,
  checkmarkCircle,
  closeCircle,
  arrowForwardOutline,
  refreshOutline,
  bulbOutline
} from 'ionicons/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { ProgressService } from '../services/progressService';
import { getLimiaTip } from '../utils/limiaTips';
import { Questao } from '../lib/supabaseClient';
import BeegeHeader from '../components/BeegeHeader';
import MathRenderer from '../components/MathRenderer';
import LimiaMascot from '../components/LimiaMascot';

export const PraticaPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const topicoIdParam = searchParams.get('topico');

  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [limiaMsg, setLimiaMsg] = useState(() => getLimiaTip('pratica_inicio'));

  useEffect(() => {
    const loadQuestions = async () => {
      let list: Questao[] = [];
      if (topicoIdParam) {
        list = await DataService.getQuestoes(topicoIdParam);
      }
      if (!list.length) {
        list = await DataService.getAllQuestoes();
      }
      setQuestoes(list);
      setCurrentIndex(0);
      setSelectedOption(null);
      setAnswered(false);
      setScore(0);
      setLimiaMsg(getLimiaTip('pratica_inicio'));
    };
    loadQuestions();
  }, [topicoIdParam]);

  const currentQ = questoes[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (answered) return;
    setSelectedOption(idx);
  };

  const handleConfirm = () => {
    if (selectedOption === null || answered) return;
    setAnswered(true);
    setShowExplanation(true);
    const acertou = selectedOption === currentQ.resposta_correta;
    if (acertou) {
      setScore((s) => s + 1);
      setLimiaMsg(getLimiaTip('pratica_acerto'));
    } else {
      setLimiaMsg(getLimiaTip('pratica_erro'));
    }

    // Persiste acerto/erro no ProgressService (US12)
    ProgressService.registrarResposta(currentQ.topico_id, acertou);
  };

  const handleNext = () => {
    if (currentIndex < questoes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
      setShowExplanation(false);
      setLimiaMsg(getLimiaTip('pratica_inicio'));
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setShowExplanation(false);
    setScore(0);
    setLimiaMsg(getLimiaTip('pratica_inicio'));
  };

  const isCorrect = selectedOption === currentQ?.resposta_correta;
  const isLastQuestion = currentIndex === questoes.length - 1;

  return (
    <IonPage>
      <BeegeHeader title="Prática de Cálculo 1" />
      <IonContent className="ion-padding">
        <div style={{ maxWidth: '440px', margin: '0 auto', paddingBottom: '24px' }}>
          {/* Top Bar de Navegação */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <IonButton
              fill="clear"
              color="primary"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                navigate('/dashboard');
              }}
              style={{ fontWeight: 700, padding: 0 }}
              id="btn-voltar-pratica"
            >
              <IonIcon slot="start" icon={arrowBackOutline} />
              Voltar
            </IonButton>

            {questoes.length > 0 && (
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#6D28D9' }}>
                Questão {currentIndex + 1} de {questoes.length}
              </span>
            )}
          </div>

          {questoes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: '#78716C' }}>Nenhuma questão encontrada para este tópico.</p>
              <IonButton
                color="primary"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/dashboard');
                }}
              >
                Voltar
              </IonButton>
            </div>
          ) : (
            <div>
              {/* Barra de Progresso */}
              <IonProgressBar
                value={(currentIndex + (answered ? 1 : 0)) / questoes.length}
                color="primary"
                style={{ borderRadius: '9999px', height: '8px', marginBottom: '16px' }}
              />

              {/* Card da Questão */}
              <IonCard
                style={{
                  borderRadius: '20px',
                  border: '1px solid rgba(124, 58, 237, 0.12)',
                  background: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                  margin: '0 0 20px'
                }}
              >
                <IonCardHeader style={{ padding: '18px 18px 8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span
                      style={{
                        background: 'rgba(124, 58, 237, 0.1)',
                        color: '#6D28D9',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        textTransform: 'uppercase'
                      }}
                    >
                      Dificuldade: {currentQ.dificuldade}
                    </span>

                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8C8680' }}>
                      Acertos: {score}/{currentIndex + (answered ? 1 : 0)}
                    </span>
                  </div>

                  <IonCardTitle style={{ fontSize: '1.05rem', lineHeight: '1.5', fontWeight: 700, color: '#1F1926' }}>
                    <MathRenderer content={currentQ.enunciado_latex} />
                  </IonCardTitle>
                </IonCardHeader>

                <IonCardContent style={{ padding: '10px 18px 20px' }}>
                  {/* Dica da Limia para raciocinar sobre a questão */}
                  {!answered && (
                    <div style={{ margin: '8px 0 14px' }}>
                      <LimiaMascot
                        message={limiaMsg}
                        mood="tip"
                        compact
                        size="small"
                      />
                    </div>
                  )}

                  {/* Lista de Alternativas */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '12px 0' }}>
                    {currentQ.alternativas.map((alt, idx) => {
                      const isChosen = selectedOption === idx;
                      const isCorrectChoice = idx === currentQ.resposta_correta;

                      let borderColor = '#E8DDD0';
                      let bgColor = '#FFFFFF';

                      if (answered) {
                        if (isCorrectChoice) {
                          borderColor = '#10B981';
                          bgColor = 'rgba(16, 185, 129, 0.12)';
                        } else if (isChosen && !isCorrectChoice) {
                          borderColor = '#EF4444';
                          bgColor = 'rgba(239, 68, 68, 0.12)';
                        }
                      } else if (isChosen) {
                        borderColor = '#7C3AED';
                        bgColor = 'rgba(124, 58, 237, 0.08)';
                      }

                      return (
                        <div
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '14px',
                            border: `2px solid ${borderColor}`,
                            background: bgColor,
                            cursor: answered ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: isChosen ? '#7C3AED' : '#F0E8DD',
                              color: isChosen ? '#FFFFFF' : '#453E3B',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              flexShrink: 0
                            }}
                          >
                            {String.fromCharCode(65 + idx)}
                          </div>

                          <div style={{ flexGrow: 1, fontSize: '0.92rem', color: '#1F1926' }}>
                            <MathRenderer content={alt} />
                          </div>

                          {answered && isCorrectChoice && (
                            <IonIcon icon={checkmarkCircle} color="success" style={{ fontSize: '1.35rem' }} />
                          )}
                          {answered && isChosen && !isCorrectChoice && (
                            <IonIcon icon={closeCircle} color="danger" style={{ fontSize: '1.35rem' }} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Ações da questão */}
                  {!answered ? (
                    <IonButton
                      expand="block"
                      color="primary"
                      disabled={selectedOption === null}
                      onClick={handleConfirm}
                      style={{ fontWeight: 800, marginTop: '14px', '--border-radius': '9999px', height: '48px' }}
                    >
                      Confirmar Resposta
                    </IonButton>
                  ) : (
                    <div style={{ marginTop: '18px' }}>
                      {/* Mascote com feedback contextual */}
                      <LimiaMascot
                        message={limiaMsg}
                        mood={isCorrect ? 'cheer' : 'thinking'}
                        compact
                        size="small"
                      />

                      {/* Caixa de Explicação com KaTeX */}
                      {showExplanation && (
                        <div
                          style={{
                            background: 'rgba(124, 58, 237, 0.06)',
                            border: '1px solid rgba(124, 58, 237, 0.2)',
                            borderRadius: '14px',
                            padding: '14px',
                            margin: '14px 0'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6D28D9', fontWeight: 800, fontSize: '0.88rem', marginBottom: '6px' }}>
                            <IonIcon icon={bulbOutline} />
                            Resolução Analítica Passo a Passo
                          </div>
                          <MathRenderer content={currentQ.explicacao_latex} />
                        </div>
                      )}

                      {!isLastQuestion ? (
                        <IonButton
                          expand="block"
                          color="primary"
                          onClick={handleNext}
                          style={{ fontWeight: 800, '--border-radius': '9999px', height: '48px' }}
                        >
                          Próxima Questão
                          <IonIcon slot="end" icon={arrowForwardOutline} />
                        </IonButton>
                      ) : (
                        <div style={{ textAlign: 'center', marginTop: '16px' }}>
                          <h3 style={{ fontWeight: 800, color: '#6D28D9', margin: '0 0 6px' }}>
                            Sessão de Exercícios Concluída!
                          </h3>
                          <p style={{ color: '#78716C', fontSize: '0.9rem', margin: '0 0 14px' }}>
                            Você acertou {score} de {questoes.length} questões (
                            {Math.round((score / questoes.length) * 100)}%).
                          </p>
                          <IonButton
                            color="primary"
                            onClick={handleRestart}
                            style={{ fontWeight: 800, '--border-radius': '9999px' }}
                          >
                            <IonIcon slot="start" icon={refreshOutline} />
                            Reiniciar Exercícios
                          </IonButton>
                        </div>
                      )}
                    </div>
                  )}
                </IonCardContent>
              </IonCard>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PraticaPage;
