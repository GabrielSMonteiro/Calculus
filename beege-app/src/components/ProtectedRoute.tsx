import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IonSpinner } from '@ionic/react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * ProtectedRoute — Guarda de Rota
 *
 * Redireciona para /login se o usuário não estiver autenticado.
 * Se requireAdmin=true, redireciona para /dashboard se não for admin.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false
}) => {
  const { user, profile, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'var(--beege-cream, #FAF5EE)',
          gap: '12px'
        }}
      >
        <IonSpinner name="crescent" color="primary" />
        <span style={{ color: '#8C8680', fontSize: '0.88rem' }}>
          Verificando autenticação...
        </span>
      </div>
    );
  }

  const hasUser = user || (localStorage.getItem('beege_current_user') ? JSON.parse(localStorage.getItem('beege_current_user')!) : null);
  const hasProfile = profile || (localStorage.getItem('beege_current_profile') ? JSON.parse(localStorage.getItem('beege_current_profile')!) : null);

  if (!hasUser || !hasProfile) {
    return <Navigate to="/login" replace />;
  }

  const effectiveAdmin = (hasProfile?.role === 'admin') || isAdmin;

  if (requireAdmin && !effectiveAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
