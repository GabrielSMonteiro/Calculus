import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
  homeOutline,
  home,
  flameOutline,
  flame,
  chatbubblesOutline,
  chatbubbles,
  personOutline,
  person
} from 'ionicons/icons';
import './MobileTabBar.css';

interface TabItem {
  key: string;
  label: string;
  path: string;
  iconOutline: string;
  iconSolid: string;
}

const tabs: TabItem[] = [
  {
    key: 'dashboard',
    label: 'Início',
    path: '/dashboard',
    iconOutline: homeOutline,
    iconSolid: home
  },
  {
    key: 'pratica',
    label: 'Prática',
    path: '/pratica',
    iconOutline: flameOutline,
    iconSolid: flame
  },
  {
    key: 'forum',
    label: 'Fórum',
    path: '/forum',
    iconOutline: chatbubblesOutline,
    iconSolid: chatbubbles
  },
  {
    key: 'perfil',
    label: 'Perfil',
    path: '/perfil',
    iconOutline: personOutline,
    iconSolid: person
  }
];

export const MobileTabBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide tab bar on onboarding, login, topico detail or admin if desired
  const isAuthOrOnboarding =
    location.pathname === '/login' ||
    location.pathname === '/onboarding' ||
    location.pathname === '/';

  if (isAuthOrOnboarding) {
    return null;
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname.startsWith('/topico');
    }
    if (path === '/perfil') {
      return location.pathname === '/perfil' || location.pathname === '/universidades';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="mobile-tab-bar" aria-label="Navegação Principal do App">
      <div className="mobile-tab-bar-inner">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          return (
            <button
              key={tab.key}
              className={`mobile-tab-item ${active ? 'active' : ''}`}
              onClick={() => navigate(tab.path)}
              id={`tab-btn-${tab.key}`}
            >
              <div className="tab-icon-wrapper">
                <IonIcon
                  icon={active ? tab.iconSolid : tab.iconOutline}
                  className="tab-icon"
                />
                {active && <span className="tab-active-glow" />}
              </div>
              <span className="tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileTabBar;
