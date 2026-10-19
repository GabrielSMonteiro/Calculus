import React, { useState } from 'react';
import { IonPage, IonContent, IonSpinner, IonIcon } from '@ionic/react';
import {
  mailOutline,
  lockClosedOutline,
  personOutline,
  schoolOutline,
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MathChalkboardHeader from '../components/MathChalkboardHeader';
import './AuthPage.css';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'cadastro'>('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [nome, setNome] = useState('');
  const [universidadeNome, setUniversidadeNome] = useState('USP');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    const res = await login(email, senha);
    setLoading(false);
    if (res.error) {
      setErrorMsg(res.error);
    } else {
      navigate('/dashboard');
    }
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (senha !== confirmarSenha) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    const res = await signup(email, senha, nome);
    setLoading(false);
    if (res.error) {
      setErrorMsg(res.error);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <IonPage>
      <IonContent scrollY={true}>
        <div className="auth-mobile-page">
          {/* Top Math Chalkboard Header with status bar & wave curve */}
          <MathChalkboardHeader variant={mode === 'login' ? 'login' : 'signup'} />

          {/* Form Content Area with Cream Background */}
          <div className="auth-body-container">
            <h1 className="auth-main-title">
              {mode === 'login' ? 'Login' : 'Cadastre-se'}
            </h1>

            {errorMsg && (
              <div className="auth-alert-pill">
                <span>{errorMsg}</span>
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="auth-form-fields">
                {/* Email Pill Input */}
                <div className="auth-pill-field">
                  <IonIcon icon={mailOutline} className="auth-pill-icon" />
                  <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    id="input-login-email"
                  />
                </div>

                {/* Senha Pill Input */}
                <div className="auth-pill-field">
                  <IonIcon icon={lockClosedOutline} className="auth-pill-icon" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    autoComplete="current-password"
                    id="input-login-password"
                  />
                  <button
                    type="button"
                    className="auth-pill-eye-btn"
                    onClick={() => setShowPass(!showPass)}
                    tabIndex={-1}
                    aria-label="Ver senha"
                  >
                    <IonIcon icon={showPass ? eyeOffOutline : eyeOutline} />
                  </button>
                </div>

                {/* Dark Purple Pill Button: Entrar */}
                <div className="auth-action-center">
                  <button
                    type="submit"
                    className="auth-dark-pill-btn"
                    disabled={loading}
                    id="btn-login-submit"
                  >
                    {loading ? <IonSpinner name="crescent" color="light" /> : 'Entrar'}
                  </button>
                </div>

                {/* Link to switch */}
                <p className="auth-footer-link">
                  Não tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('cadastro');
                      setErrorMsg('');
                    }}
                    className="auth-link-highlight"
                  >
                    Cadastre-se
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleCadastro} className="auth-form-fields">
                {/* Nome Completo */}
                <div className="auth-pill-field">
                  <IonIcon icon={personOutline} className="auth-pill-icon" />
                  <input
                    type="text"
                    placeholder="nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    autoComplete="name"
                    id="input-signup-name"
                  />
                </div>

                {/* Email */}
                <div className="auth-pill-field">
                  <IonIcon icon={mailOutline} className="auth-pill-icon" />
                  <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    id="input-signup-email"
                  />
                </div>

                {/* Senha */}
                <div className="auth-pill-field">
                  <IonIcon icon={lockClosedOutline} className="auth-pill-icon" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    autoComplete="new-password"
                    id="input-signup-password"
                  />
                  <button
                    type="button"
                    className="auth-pill-eye-btn"
                    onClick={() => setShowPass(!showPass)}
                    tabIndex={-1}
                    aria-label="Ver senha"
                  >
                    <IonIcon icon={showPass ? eyeOffOutline : eyeOutline} />
                  </button>
                </div>

                {/* Confirme sua senha */}
                <div className="auth-pill-field">
                  <IonIcon icon={lockClosedOutline} className="auth-pill-icon" />
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    placeholder="confirme sua senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                    autoComplete="new-password"
                    id="input-signup-confirm-password"
                  />
                  <button
                    type="button"
                    className="auth-pill-eye-btn"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    tabIndex={-1}
                    aria-label="Ver confirmação de senha"
                  >
                    <IonIcon icon={showConfirmPass ? eyeOffOutline : eyeOutline} />
                  </button>
                </div>

                {/* Universidade */}
                <div className="auth-pill-field">
                  <IonIcon icon={schoolOutline} className="auth-pill-icon" />
                  <input
                    type="text"
                    placeholder="universidade..."
                    value={universidadeNome}
                    onChange={(e) => setUniversidadeNome(e.target.value)}
                    id="input-signup-university"
                  />
                </div>

                {/* Dark Purple Pill Button: Cadastrar */}
                <div className="auth-action-center">
                  <button
                    type="submit"
                    className="auth-dark-pill-btn"
                    disabled={loading}
                    id="btn-signup-submit"
                  >
                    {loading ? <IonSpinner name="crescent" color="light" /> : 'Cadastrar'}
                  </button>
                </div>

                {/* Link to switch */}
                <p className="auth-footer-link">
                  Já tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                    }}
                    className="auth-link-highlight"
                  >
                    Entrar
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AuthPage;
