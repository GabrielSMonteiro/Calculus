import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonSpinner
} from '@ionic/react';
import { arrowBackOutline, flameOutline, checkmarkDoneOutline } from 'ionicons/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { getLimiaTipForTopico } from '../utils/limiaTips';
import { Topico } from '../lib/supabaseClient';
import BeegeHeader from '../components/BeegeHeader';
import MathRenderer from '../components/MathRenderer';
import LimiaMascot from '../components/LimiaMascot';

export const TopicoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [topico, setTopico] = useState<Topico | null>(null);
  const [loading, setLoading] = useState(true);
  const [mascotTip, setMascotTip] = useState('Observe as definições conceituais e os limites fundamentais antes de tentar resolver os exercícios.');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      DataService.getTopicoById(id).then((t) => {
        setTopico(t || null);
        if (t) {
          setMascotTip(getLimiaTipForTopico(t.titulo));
        }
        setLoading(false);
      });
    }
  }, [id]);

  return (
    <IonPage>
      <BeegeHeader title={topico?.titulo || 'Teoria de Cálculo 1'} />
      <IonContent className="ion-padding">
        <div style={{ maxWidth: '440px', margin: '0 auto', paddingBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <IonButton
              fill="clear"
              color="primary"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                navigate('/dashboard');
              }}
              style={{ fontWeight: 700, padding: 0 }}
              id="btn-voltar-topico"
            >
              <IonIcon slot="start" icon={arrowBackOutline} />
              Voltar
            </IonButton>

            {topico && (
              <IonButton
                size="small"
                color="primary"
                onClick={() => navigate(`/pratica?topico=${topico.id}`)}
                style={{ fontWeight: 700, '--border-radius': '9999px' }}
              >
                <IonIcon slot="start" icon={flameOutline} />
                Praticar
              </IonButton>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <IonSpinner name="crescent" color="primary" />
              <p style={{ color: '#8C8680', marginTop: '12px', fontSize: '0.9rem' }}>
                Carregando fórmulas matemáticas com KaTeX...
              </p>
            </div>
          ) : topico ? (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <span
                  style={{
                    background: 'rgba(124, 58, 237, 0.1)',
                    color: '#6D28D9',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em'
                  }}
                >
                  Teoria Essencial • Passo a Passo
                </span>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1F1926', margin: '10px 0 6px' }}>
                  {topico.titulo}
                </h1>
                {topico.descricao && (
                  <p style={{ color: '#736B63', fontSize: '0.92rem', lineHeight: '1.45', margin: 0 }}>
                    {topico.descricao}
                  </p>
                )}
              </div>

              <LimiaMascot
                message={mascotTip}
                mood="thinking"
                size="small"
              />

              <IonCard
                style={{
                  borderRadius: '18px',
                  border: '1px solid rgba(124, 58, 237, 0.12)',
                  background: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                  margin: '18px 0'
                }}
              >
                <IonCardContent style={{ padding: '20px', fontSize: '0.95rem', lineHeight: '1.65' }}>
                  {/* Renderizador com KaTeX */}
                  <MathRenderer content={topico.conteudo_latex} />
                </IonCardContent>
              </IonCard>

              {/* Botão de Conclusão / Prática */}
              <div style={{ textAlign: 'center', margin: '24px 0 10px' }}>
                <IonButton
                  expand="block"
                  color="primary"
                  onClick={() => navigate(`/pratica?topico=${topico.id}`)}
                  style={{ fontWeight: 800, '--border-radius': '9999px', height: '50px' }}
                >
                  <IonIcon slot="start" icon={checkmarkDoneOutline} />
                  Praticar Exercícios deste Tópico
                </IonButton>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <IonButton
                color="primary"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/dashboard');
                }}
              >
                Voltar ao Início
              </IonButton>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TopicoDetailPage;
