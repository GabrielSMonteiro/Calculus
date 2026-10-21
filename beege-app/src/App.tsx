import React from 'react';
import { Navigate, Route, useLocation, useNavigate } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { App as CapApp } from '@capacitor/app';
import { AuthProvider } from './context/AuthContext';

/* Componentes de Layout Mobile */
import MobileDeviceFrame from './components/MobileDeviceFrame';
import MobileTabBar from './components/MobileTabBar';
import ProtectedRoute from './components/ProtectedRoute';

/* Páginas */
import OnboardingPage from './pages/OnboardingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import TopicoDetailPage from './pages/TopicoDetailPage';
import PraticaPage from './pages/PraticaPage';
import ForumPage from './pages/ForumPage';
import UniversidadesPage from './pages/UniversidadesPage';
import PerfilPage from './pages/PerfilPage';
import AdminPage from './pages/AdminPage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Dark mode theme */
import '@ionic/react/css/palettes/dark.system.css';

/* KaTeX & Theme variables */
import './theme/variables.css';

setupIonicReact({
  mode: 'md' // Material Design consistente
});

const AndroidBackButtonHandler: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    let listenerHandle: any = null;

    CapApp.addListener('backButton', () => {
      const currentPath = window.location.pathname;

      // Se estiver nas telas iniciais ou de autenticação, fecha o app
      if (
        currentPath === '/dashboard' ||
        currentPath === '/login' ||
        currentPath === '/onboarding' ||
        currentPath === '/'
      ) {
        CapApp.exitApp();
      } else {
        // Em listas de exercícios (/pratica) ou outras sub-telas, retorna para o Dashboard
        navigate('/dashboard');
      }
    })
      .then((h) => {
        listenerHandle = h;
      })
      .catch(() => {});

    return () => {
      if (listenerHandle && typeof listenerHandle.remove === 'function') {
        listenerHandle.remove();
      }
    };
  }, [navigate]);

  return null;
};

const RootRedirect: React.FC = () => {
  const onboardingDone = localStorage.getItem('beege_onboarding_done');
  if (onboardingDone !== 'true') {
    return <Navigate to="/onboarding" replace />;
  }
  const savedUser = localStorage.getItem('beege_current_user');
  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to="/dashboard" replace />;
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <IonReactRouter>
        <AndroidBackButtonHandler />
        <MobileDeviceFrame>
          <IonRouterOutlet>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/topico/:id"
              element={
                <ProtectedRoute>
                  <TopicoDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pratica"
              element={
                <ProtectedRoute>
                  <PraticaPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forum"
              element={
                <ProtectedRoute>
                  <ForumPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/universidades"
              element={
                <ProtectedRoute>
                  <UniversidadesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <PerfilPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<RootRedirect />} />
          </IonRouterOutlet>
          <MobileTabBar />
        </MobileDeviceFrame>
      </IonReactRouter>
    </AuthProvider>
  </IonApp>
);

export default App;
