import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonBadge
} from '@ionic/react';
import { shieldCheckmarkOutline, personCircleOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface BeegeHeaderProps {
  title?: string;
}

export const BeegeHeader: React.FC<BeegeHeaderProps> = ({ title = 'BeeGe' }) => {
  const { profile, isAdmin, toggleMockAdmin, useMockMode } = useAuth();
  const navigate = useNavigate();

  return (
    <IonHeader className="ion-no-border">
      <IonToolbar style={{ '--background': 'var(--beege-cream, #FAF5EE)', '--border-width': '0' } as any}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '4px 16px', justifyContent: 'space-between' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          >
            <img
              src="/limia.png"
              alt="BeeGe"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--beege-purple, #7C3AED)'
              }}
              onError={(e) => {
                if (!e.currentTarget.src.includes('mascote.svg')) {
                  e.currentTarget.src = '/mascote.svg';
                }
              }}
            />
            <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--beege-purple, #7C3AED)', letterSpacing: '-0.02em' }}>
              BeeGe
            </span>
          </div>

          <IonButtons slot="end" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {useMockMode && (
              <IonButton
                fill="solid"
                size="small"
                color={isAdmin ? 'primary' : 'medium'}
                onClick={toggleMockAdmin}
                title="Alternar entre Aluno e Admin"
                style={{ fontSize: '0.7rem', '--border-radius': '10px' }}
              >
                <IonIcon slot="start" icon={shieldCheckmarkOutline} />
                {isAdmin ? 'Admin' : 'Aluno'}
              </IonButton>
            )}

            {profile ? (
              <IonButton
                fill="clear"
                color="primary"
                onClick={() => navigate('/perfil')}
                title="Meu Perfil"
                style={{ '--color': 'var(--beege-purple, #7C3AED)' }}
              >
                <IonIcon icon={personCircleOutline} style={{ fontSize: '1.45rem' }} />
              </IonButton>
            ) : (
              <IonButton fill="clear" color="primary" onClick={() => navigate('/login')}>
                <IonIcon icon={personCircleOutline} style={{ fontSize: '1.45rem' }} />
              </IonButton>
            )}
          </IonButtons>
        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default BeegeHeader;
