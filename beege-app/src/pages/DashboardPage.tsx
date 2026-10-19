import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonSpinner
} from '@ionic/react';
import {
  bookOutline,
  helpCircleOutline,
  chatbubblesOutline,
  settingsOutline,
  chevronForwardOutline,
  flameOutline,
  refreshOutline,
  checkmarkCircle
} from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { DataService } from '../services/dataService';
import { ProgressService, TopicoProgress } from '../services/progressService';
import { getLimiaTip } from '../utils/limiaTips';
import { Topico } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import BeegeHeader from '../components/BeegeHeader';
import LimiaMascot from '../components/LimiaMascot';

export const DashboardPage: React.FC = () => {
  const { universidade, profile, isAdmin } = useAuth();
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [loading, setLoading] = useState(true);
  const [limiaTip, setLimiaTip] = useState(() => getLimiaTip('dashboard'));
  const [topicosProgress, setTopicosProgress] = useState<Record<string, TopicoProgress>>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (universidade) {
      setLoading(true);
      DataService.getTopicos(universidade.id).then((data) => {
        setTopicos(data);
        setTopicosProgress(ProgressService.getAllTopicosProgress());
        setLoading(false);
      });
    }
  }, [universidade]);

  return (
    <IonPage>
      <BeegeHeader title="Revisao de Calculo 1" />
      <IonContent className="ion-padding">
        <div style={{ maxWidth: '440px', margin: '0 auto', paddingBottom: '24px' }}>
          {/* Banner de boas-vindas */}
          <div
            style={{
              background: 'var(--beege-purple, #7C3AED)',
              borderRadius: '20px',
              padding: '20px',
              color: 'white',
              marginBottom: '16px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', inset: 0, opacity: 0.06, background: 'radial-gradient(circle at 80% 20%, white 0%, transparent 50%)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                {universidade?.sigla || 'UnB'} — Calculo 1
              </span>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '10px 0 4px' }}>
                Ola, {profile?.nome?.split(' ')[0] || 'Estudante'}
              </h1>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '0.88rem', fontWeight: 500 }}>
                Conteudo de revisao para {universidade?.nome || 'sua instituicao'}.
              </p>

              <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                <IonButton
                  size="small"
                  fill="solid"
                  style={{
                    '--background': 'rgba(255,255,255,0.2)',
                    '--color': 'white',
                    '--border-radius': '10px',
                    fontWeight: 700,
                    fontSize: '0.8rem'
                  } as any}
                  onClick={() => navigate('/pratica')}
                >
                  <IonIcon slot="start" icon={flameOutline} />
                  Exercicios
                </IonButton>
                <IonButton
                  size="small"
                  fill="solid"
                  style={{
                    '--background': 'rgba(255,255,255,0.15)',
                    '--color': 'white',
                    '--border-radius': '10px',
                    fontWeight: 600,
                    fontSize: '0.8rem'
                  } as any}
                  onClick={() => navigate('/forum')}
                >
                  <IonIcon slot="start" icon={chatbubblesOutline} />
                  Forum
                </IonButton>
                {isAdmin && (
                  <IonButton
                    size="small"
                    fill="solid"
                    style={{
                      '--background': 'rgba(255,255,255,0.15)',
                      '--color': 'white',
                      '--border-radius': '10px',
                      fontWeight: 600,
                      fontSize: '0.8rem'
                    } as any}
                    onClick={() => navigate('/admin')}
                  >
                    <IonIcon slot="start" icon={settingsOutline} />
                    Painel
                  </IonButton>
                )}
              </div>
            </div>
          </div>

          {/* Mascote Limia com dica dinâmica e rotativa */}
          <div style={{ position: 'relative' }}>
            <LimiaMascot
              message={limiaTip}
              mood="tip"
              compact
            />
            <button
              onClick={() => setLimiaTip(getLimiaTip('dashboard'))}
              style={{
                position: 'absolute',
                right: '12px',
                bottom: '8px',
                background: 'rgba(124, 58, 237, 0.08)',
                border: 'none',
                borderRadius: '8px',
                padding: '3px 8px',
                color: '#6D28D9',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Ver outra dica da Limia"
            >
              <IonIcon icon={refreshOutline} />
              Nova dica
            </button>
          </div>

          {/* Cabecalho da secao */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 10px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--beege-text, #2D2A26)', margin: 0 }}>
              Topicos
            </h2>
            <IonBadge
              style={{
                fontSize: '0.75rem',
                padding: '4px 10px',
                background: 'var(--beege-purple-light, #EDE9FE)',
                color: 'var(--beege-purple, #7C3AED)',
                borderRadius: '8px'
              }}
            >
              {topicos.length} topicos
            </IonBadge>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <IonSpinner name="crescent" color="primary" />
              <p style={{ color: 'var(--beege-text-muted)', fontSize: '0.9rem', marginTop: '10px' }}>
                Carregando topicos...
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topicos.map((topico, idx) => {
                const prog = topicosProgress[topico.id];
                const total = prog ? prog.acertos + prog.erros : 0;

                return (
                  <IonCard
                    key={topico.id}
                    style={{
                      margin: 0,
                      borderRadius: '16px',
                      border: '1px solid var(--beege-border, #E8DDD0)',
                      background: '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
                    }}
                  >
                    <IonCardHeader style={{ padding: '14px 16px 6px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '10px',
                            background: total > 0 ? 'rgba(16, 185, 129, 0.12)' : 'var(--beege-purple-light, #EDE9FE)',
                            color: total > 0 ? '#10B981' : 'var(--beege-purple, #7C3AED)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            flexShrink: 0
                          }}
                        >
                          {total > 0 ? '✓' : idx + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <IonCardTitle style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--beege-text)' }}>
                            {topico.titulo}
                          </IonCardTitle>
                          {topico.descricao && (
                            <IonCardSubtitle style={{ color: 'var(--beege-text-muted)', marginTop: '2px', fontSize: '0.8rem' }}>
                              {topico.descricao}
                            </IonCardSubtitle>
                          )}
                          {total > 0 && (
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: 'rgba(16, 185, 129, 0.1)',
                                color: '#059669',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                marginTop: '6px'
                              }}
                            >
                              <IonIcon icon={checkmarkCircle} />
                              <span>
                                {prog.acertos}/{total} acertos ({Math.round((prog.acertos / total) * 100)}%)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </IonCardHeader>

                    <IonCardContent style={{ padding: '6px 16px 14px' }}>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <IonButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/topico/${topico.id}`)}
                          style={{ fontWeight: 600, '--border-radius': '10px', fontSize: '0.8rem' }}
                        >
                          <IonIcon slot="start" icon={bookOutline} />
                          Revisar
                        </IonButton>
                        <IonButton
                          size="small"
                          fill="outline"
                          color="primary"
                          onClick={() => navigate(`/pratica?topico=${topico.id}`)}
                          style={{ fontWeight: 600, '--border-radius': '10px', fontSize: '0.8rem' }}
                        >
                          <IonIcon slot="start" icon={helpCircleOutline} />
                          Exercicios
                        </IonButton>
                      </div>
                    </IonCardContent>
                  </IonCard>
                );
              })}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;
