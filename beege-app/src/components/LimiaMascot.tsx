import React from 'react';
import './LimiaMascot.css';

interface LimiaMascotProps {
  message?: string;
  mood?: 'happy' | 'thinking' | 'cheer' | 'tip';
  size?: 'small' | 'medium' | 'large';
  compact?: boolean;
}

export const LimiaMascot: React.FC<LimiaMascotProps> = ({
  message = 'Anotacoes e dicas conceituais para a revisao de Calculo 1.',
  mood = 'happy',
  size = 'medium',
  compact = false
}) => {
  return (
    <div className={`limia-container size-${size} ${compact ? 'compact' : ''}`}>
      <div className="limia-avatar-wrapper">
        <img
          src="/limia.png"
          alt="Limia - Mascote BeeGe"
          className={`limia-avatar mood-${mood}`}
          onError={(e) => {
            // Fallback para mascote.svg se limia.jpg falhar
            if (!e.currentTarget.src.includes('mascote.svg')) {
              e.currentTarget.src = '/mascote.svg';
            }
          }}
        />
        <div className="limia-badge">Limia</div>
      </div>
      {message && (
        <div className="limia-bubble">
          <div className="limia-bubble-arrow" />
          <p className="limia-message">{message}</p>
        </div>
      )}
    </div>
  );
};

export default LimiaMascot;
