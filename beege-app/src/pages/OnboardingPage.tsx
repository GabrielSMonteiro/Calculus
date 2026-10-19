import React, { useState, useRef } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import './OnboardingPage.css';

interface SlideData {
  title: string;
  subtitle: string;
  btnText: string;
}

const slides: SlideData[] = [
  {
    title: 'Cálculo 1 descomplicado',
    subtitle: 'Revise limites, derivadas e integrais com material estruturado para a sua universidade.',
    btnText: 'Começar'
  },
  {
    title: 'Pratique no seu ritmo',
    subtitle: 'Simulados interativos com fórmulas nítidas em KaTeX e resolução comentada passo a passo.',
    btnText: 'Próximo'
  },
  {
    title: 'Fórum da comunidade',
    subtitle: 'Tire dúvidas acadêmicas com monitores e colegas universitários sem complicação.',
    btnText: 'Próximo'
  },
  {
    title: 'Multi-Universidade',
    subtitle: 'Ementas alinhadas com USP, UFMG e outras instituições para você estudar o que cai na prova.',
    btnText: 'Continuar'
  }
];

export const OnboardingPage: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const touchStartX = useRef<number | null>(null);

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      localStorage.setItem('beege_onboarding_done', 'true');
      navigate('/login');
    }
  };

  const handleBack = () => {
    if (current > 0) {
      setCurrent((c) => c - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50 && current < slides.length - 1) {
      handleNext();
    } else if (diff < -50 && current > 0) {
      handleBack();
    }
    touchStartX.current = null;
  };

  return (
    <IonPage>
      <IonContent scrollY={false}>
        <div
          className="onboarding-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Status bar */}
          <div className="onboarding-status-bar">
            <span className="status-time">9:41</span>
            <div className="status-icons">
              <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
                <rect x="0.5" y="7.5" width="2.5" height="3" rx="0.5" fill="currentColor"/>
                <rect x="4.5" y="5.5" width="2.5" height="5" rx="0.5" fill="currentColor"/>
                <rect x="8.5" y="3.5" width="2.5" height="7" rx="0.5" fill="currentColor"/>
                <rect x="12.5" y="0.5" width="2.5" height="10" rx="0.5" fill="currentColor"/>
              </svg>
              <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                <path d="M7.5 10.5C8.05228 10.5 8.5 10.0523 8.5 9.5C8.5 8.94772 8.05228 8.5 7.5 8.5C6.94772 8.5 6.5 8.94772 6.5 9.5C6.5 10.0523 6.94772 10.5 7.5 10.5Z" fill="currentColor"/>
                <path d="M4.3 6.8C5.2 6.1 6.3 5.7 7.5 5.7C8.7 5.7 9.8 6.1 10.7 6.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M2.1 4.2C3.6 3.1 5.5 2.5 7.5 2.5C9.5 2.5 11.4 3.1 12.9 4.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M0.5 1.8C2.5 0.6 4.9 0 7.5 0C10.1 0 12.5 0.6 14.5 1.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <svg width="24" height="11" viewBox="0 0 24 11" fill="none">
                <rect x="0.5" y="0.5" width="20" height="10" rx="3" stroke="currentColor"/>
                <rect x="2" y="2" width="15" height="7" rx="1.5" fill="currentColor"/>
                <path d="M22 3.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Mascot Section */}
          <div className="onboarding-mascot-hero">
            <img
              src="/limia.png"
              alt="Limia Mascote BeeGe"
              className="onboarding-mascot-img"
              onError={(e) => {
                if (!e.currentTarget.src.includes('mascote.svg')) {
                  e.currentTarget.src = '/mascote.svg';
                }
              }}
            />
          </div>

          {/* Text and Actions Section */}
          <div className="onboarding-bottom-card">
            <div className="onboarding-text-block">
              <h1 className="onboarding-title">{slides[current].title}</h1>
              <p className="onboarding-subtitle">{slides[current].subtitle}</p>
            </div>

            {/* Pagination Dots */}
            <div className="onboarding-dots-container">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  className={`onboarding-dot-pill ${idx === current ? 'active' : ''}`}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Main Action Button */}
            <button
              className="onboarding-main-btn"
              onClick={handleNext}
              id={`onboarding-btn-slide-${current}`}
            >
              {slides[current].btnText}
            </button>

            {/* Back Button or placeholder to maintain spacing */}
            <div className="onboarding-back-wrapper">
              {current > 0 ? (
                <button className="onboarding-back-link" onClick={handleBack}>
                  Voltar
                </button>
              ) : (
                <span className="onboarding-back-placeholder">&nbsp;</span>
              )}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OnboardingPage;
