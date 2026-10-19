import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonSearchbar
} from '@ionic/react';
import { checkmarkCircleOutline, arrowForwardOutline, schoolOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { DataService } from '../services/dataService';
import { Universidade } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import BeegeHeader from '../components/BeegeHeader';
import LimiaMascot from '../components/LimiaMascot';

export const UniversidadesPage: React.FC = () => {
  const [universidades, setUniversidades] = useState<Universidade[]>([]);
  const [busca, setBusca] = useState('');
  const { universidade, setUniversidade } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    DataService.getUniversidades().then((data) => setUniversidades(data));
  }, []);

  const handleSelect = (u: Universidade) => {
    setUniversidade(u);
    navigate('/dashboard');
  };

  const filtered = universidades.filter(
    (u) =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.sigla.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <IonPage>
      <BeegeHeader title="Selecionar Universidade" />
      <IonContent className="ion-padding">
        <div style={{ maxWidth: '440px', margin: '0 auto', paddingBottom: '24px' }}>
          <LimiaMascot
            message="O BeeGe ajusta automaticamente as listas de exercícios e o plano de revisão conforme o plano de ensino da sua instituição."
            mood="happy"
            size="small"
          />

          <div style={{ margin: '18px 0 12px' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1F1926', margin: '0 0 4px' }}>
              Faculdades & Ementas
            </h2>
            <p style={{ color: '#78716C', fontSize: '0.86rem', margin: 0 }}>
              Selecione a sua universidade para carregar o programa de Cálculo 1 correspondente.
            </p>
          </div>

          <IonSearchbar
            value={busca}
            onIonInput={(e) => setBusca(e.detail.value || '')}
            placeholder="Buscar por UnB, USP, UFRJ..."
            style={{
              padding: 0,
              marginBottom: '16px',
              '--background': '#FFFFFF',
              '--border-radius': '14px',
              '--box-shadow': '0 2px 8px rgba(0,0,0,0.04)'
            } as any}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map((u) => {
              const isSelected = universidade?.id === u.id;
              return (
                <div
                  key={u.id}
                  onClick={() => handleSelect(u)}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '16px',
                    border: isSelected
                      ? '2px solid #7C3AED'
                      : '1px solid rgba(109, 40, 217, 0.08)',
                    boxShadow: isSelected
                      ? '0 6px 18px rgba(124, 58, 237, 0.12)'
                      : '0 2px 8px rgba(0, 0, 0, 0.03)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: isSelected
                          ? '#7C3AED'
                          : 'rgba(124, 58, 237, 0.08)',
                        color: isSelected ? '#FFFFFF' : '#7C3AED',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem'
                      }}
                    >
                      {u.sigla.slice(0, 3)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '0.98rem', color: '#1F1926' }}>
                          {u.sigla}
                        </strong>
                        {isSelected && (
                          <span
                            style={{
                              background: '#7C3AED',
                              color: '#FFFFFF',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '6px'
                            }}
                          >
                            Ativa
                          </span>
                        )}
                      </div>
                      <p style={{ margin: '2px 0 0', color: '#8C8680', fontSize: '0.8rem' }}>
                        {u.nome}
                      </p>
                    </div>
                  </div>

                  <IonIcon
                    icon={isSelected ? checkmarkCircleOutline : arrowForwardOutline}
                    style={{
                      fontSize: '1.25rem',
                      color: isSelected ? '#7C3AED' : '#C4B5FD'
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UniversidadesPage;
