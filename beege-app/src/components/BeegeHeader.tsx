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
  const { profile, isAdmin } = useAuth();
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

          <IonButtons slot="end" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isAdmin && (
              <IonBadge
                color="tertiary"
                style={{ fontSize: '0.72rem', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
                onClick={() => navigate('/admin')}
                title="Ir para o Painel de Administração"
              >
                Painel Admin
              </IonBadge>
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
