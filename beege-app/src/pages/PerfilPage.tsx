import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonProgressBar
} from '@ionic/react';
import {
  logOutOutline,
  schoolOutline,
  flameOutline,
  trophyOutline,
  checkmarkCircleOutline,
  timeOutline,
  settingsOutline,
  sparklesOutline,
  chevronForwardOutline,
  refreshOutline
} from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ProgressService, ProgressData, TopicoProgress } from '../services/progressService';
import BeegeHeader from '../components/BeegeHeader';
import LimiaMascot from '../components/LimiaMascot';
import './PerfilPage.css';

export const PerfilPage: React.FC = () => {
  const { profile, universidade, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(() => ProgressService.getProgressoGeral());
  const [topicosProgress, setTopicosProgress] = useState<Record<string, TopicoProgress>>(() =>
    ProgressService.getAllTopicosProgress()
  );

  useEffect(() => {
    setStats(ProgressService.getProgressoGeral());
    setTopicosProgress(ProgressService.getAllTopicosProgress());
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleResetProgress = () => {
    if (window.confirm('Deseja realmente reiniciar seu progresso de exercícios?')) {
      ProgressService.resetProgress();
      setStats(ProgressService.getProgressoGeral());
      setTopicosProgress({});
    }
  };

  // Cálculo de nível do estudante
  const nivel =
    stats.totalExercicios >= 30
      ? { num: 4, titulo: 'Mestre do Cálculo' }
      : stats.totalExercicios >= 15
      ? { num: 3, titulo: 'Avançado' }
      : stats.totalExercicios >= 5
      ? { num: 2, titulo: 'Praticante' }
      : { num: 1, titulo: 'Iniciante' };

  // Mensagem motivacional da Limia baseada nas estatísticas reais
  const getMotivationalMessage = () => {
    if (stats.totalExercicios === 0) {
      return 'Bem-vindo ao BeeGe! Comece resolvendo questões na aba Prática para registrar suas primeiras conquistas!';
    }
    if (stats.questoesHoje >= stats.metaDiaria) {
      return `Sensacional! Você já bateu a meta diária de ${stats.metaDiaria} exercícios hoje. Continue brilhando!`;
    }
    if (stats.taxaAcerto >= 80 && stats.totalExercicios >= 5) {
      return `Impressionante! Sua taxa de acerto está em ${stats.taxaAcerto}%. Você está dominando os conceitos de Cálculo 1.`;
    }
    if (stats.taxaAcerto < 50 && stats.totalExercicios >= 3) {
      return 'Não se preocupe com os tropeços! Revise os passos analíticos com KaTeX na teoria antes de tentar novamente.';
    }
    return `Você já resolveu ${stats.totalExercicios} exercícios com ${stats.taxaAcerto}% de acerto. Cada questão aproxima você da aprovação!`;
  };

  const goalProgress = stats.metaDiaria > 0 ? Math.min(1, stats.questoesHoje / stats.metaDiaria) : 0;

  // Badges dinâmicas
  const badgeIniciativa = stats.totalExercicios > 0;
  const acertosLimites = topicosProgress['a1111111-1111-1111-1111-111111111111']?.acertos || 0;
  const badgeLimites = acertosLimites >= 3;
  const acertosDerivadas = topicosProgress['a2222222-2222-2222-2222-222222222222']?.acertos || 0;
  const badgeDerivadas = acertosDerivadas >= 3;
  const badgePrecisao = stats.totalExercicios >= 5 && stats.taxaAcerto >= 80;

  return (
    <IonPage>
      <BeegeHeader title="Meu Perfil" />
      <IonContent className="ion-padding">
        <div className="perfil-container">
          {/* User Card */}
          <div className="perfil-user-card">
            <div className="perfil-avatar-section">
              <img
                src="/limia.png"
                alt="Avatar"
                className="perfil-avatar-img"
                onError={(e) => {
                  if (!e.currentTarget.src.includes('mascote.svg')) {
                    e.currentTarget.src = '/mascote.svg';
                  }
                }}
              />
              <span className="perfil-level-badge">Nível {nivel.num}</span>
            </div>

            <div className="perfil-info-section">
              <h2 className="perfil-name">{profile?.nome || 'Estudante de Cálculo'}</h2>
              <p className="perfil-email">{profile?.email || 'aluno@unb.br'}</p>
              <button
                className="perfil-uni-tag-btn"
                onClick={() => navigate('/universidades')}
                title="Clique para alternar universidade"
              >
                <IonIcon icon={schoolOutline} />
                <span>{universidade?.sigla || 'UnB'} — {universidade?.nome || 'Universidade de Brasília'}</span>
                <span className="uni-tag-change-hint">Trocar</span>
              </button>
            </div>
          </div>

          {/* Instituição & Ementa Ativa */}
          <div className="perfil-institution-card">
            <div className="institution-card-header">
              <div className="institution-icon-badge">
                <IonIcon icon={schoolOutline} />
              </div>
              <div className="institution-text">
                <div className="institution-eyebrow">Instituição & Ementa Ativa</div>
                <h3 className="institution-name">{universidade?.nome || 'Universidade de Brasília'}</h3>
                <span className="institution-sigla-badge">{universidade?.sigla || 'UnB'} • Cálculo 1</span>
              </div>
            </div>
            <p className="institution-desc">
              Os tópicos teóricos, resumos e questões do BeeGe estão ajustados ao programa pedagógico desta instituição.
            </p>
            <button
              className="btn-change-institution"
              onClick={() => navigate('/universidades')}
              id="btn-trocar-universidade-perfil"
            >
              <IonIcon icon={schoolOutline} />
              <span>Trocar Universidade / Ementa</span>
              <IonIcon icon={chevronForwardOutline} style={{ marginLeft: 'auto' }} />
            </button>
          </div>

          {/* Limia Motivational Tip */}
          <LimiaMascot
            message={getMotivationalMessage()}
            mood={stats.taxaAcerto >= 70 ? 'cheer' : 'thinking'}
            size="small"
          />

          {/* Stats Grid */}
          <h3 className="perfil-section-title">Estatísticas de Estudo</h3>
          <div className="perfil-stats-grid">
            <div className="perfil-stat-card">
              <div className="stat-icon-wrapper flame">
                <IonIcon icon={flameOutline} />
              </div>
              <span className="stat-val">{stats.streak} {stats.streak === 1 ? 'dia' : 'dias'}</span>
              <span className="stat-lbl">Sequência ativa</span>
            </div>

            <div className="perfil-stat-card">
              <div className="stat-icon-wrapper trophy">
                <IonIcon icon={trophyOutline} />
              </div>
              <span className="stat-val">{stats.taxaAcerto}%</span>
              <span className="stat-lbl">Taxa de acerto</span>
            </div>

            <div className="perfil-stat-card">
              <div className="stat-icon-wrapper check">
                <IonIcon icon={checkmarkCircleOutline} />
              </div>
              <span className="stat-val">{stats.totalExercicios}</span>
              <span className="stat-lbl">{stats.totalAcertos} acertos</span>
            </div>

            <div className="perfil-stat-card">
              <div className="stat-icon-wrapper time">
                <IonIcon icon={timeOutline} />
              </div>
              <span className="stat-val">{stats.questoesHoje}</span>
              <span className="stat-lbl">Feitas hoje</span>
            </div>
          </div>

          {/* Daily Goal Progress */}
          <div className="perfil-goal-card">
            <div className="goal-header">
              <div className="goal-title-area">
                <IonIcon icon={sparklesOutline} className="goal-sparkle" />
                <span className="goal-title">Meta Diária de Exercícios</span>
              </div>
              <span className="goal-numbers">
                {stats.questoesHoje} / {stats.metaDiaria} questões
              </span>
            </div>
            <IonProgressBar value={goalProgress} className="goal-bar" />
            <p className="goal-tip">
              {stats.questoesHoje >= stats.metaDiaria
                ? 'Meta diária concluída! Excelente trabalho.'
                : `Faltam ${Math.max(0, stats.metaDiaria - stats.questoesHoje)} questões para bater a meta de hoje.`}
            </p>
          </div>

          {/* Desempenho por Tópico */}
          <h3 className="perfil-section-title">Progresso por Conteúdo</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {[
              { id: 'a1111111-1111-1111-1111-111111111111', nome: '1. Limites Fundamentais' },
              { id: 'a2222222-2222-2222-2222-222222222222', nome: '2. Derivadas e Regra da Cadeia' },
              { id: 'a3333333-3333-3333-3333-333333333333', nome: '3. Regra de L\'Hôpital' },
              { id: 'a4444444-4444-4444-4444-444444444444', nome: '4. Integrais Indefinidas' }
            ].map((t) => {
              const tp = topicosProgress[t.id];
              const total = tp ? tp.acertos + tp.erros : 0;
              const taxa = total > 0 ? Math.round((tp.acertos / total) * 100) : 0;

              return (
                <div
                  key={t.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '12px 14px',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F1926' }}>{t.nome}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7C3AED' }}>
                      {tp ? `${tp.acertos}/${total} (${taxa}%)` : 'Não iniciado'}
                    </span>
                  </div>
                  <IonProgressBar
                    value={total > 0 ? tp.acertos / Math.max(total, 6) : 0}
                    color="primary"
                    style={{ borderRadius: '9999px', height: '6px' }}
                  />
                </div>
              );
            })}
          </div>

          {/* Conquistas / Badges */}
          <h3 className="perfil-section-title">Conquistas Desbloqueadas</h3>
          <div className="perfil-badges-list">
            <div className={`badge-item ${badgeIniciativa ? 'unlocked' : 'locked'}`}>
              <span className="badge-emoji">🐝</span>
              <div className="badge-info">
                <strong>Iniciativa BeeGe</strong>
                <p>Primeiro exercício resolvido na plataforma.</p>
              </div>
              <IonBadge color={badgeIniciativa ? 'success' : 'medium'}>
                {badgeIniciativa ? 'Concluído' : 'Bloqueado'}
              </IonBadge>
            </div>

            <div className={`badge-item ${badgeLimites ? 'unlocked' : 'locked'}`}>
              <span className="badge-emoji">📐</span>
              <div className="badge-info">
                <strong>Mestre dos Limites</strong>
                <p>Acertou pelo menos 3 questões de limites ({acertosLimites}/3).</p>
              </div>
              <IonBadge color={badgeLimites ? 'success' : 'medium'}>
                {badgeLimites ? 'Concluído' : `${acertosLimites}/3`}
              </IonBadge>
            </div>

            <div className={`badge-item ${badgeDerivadas ? 'unlocked' : 'locked'}`}>
              <span className="badge-emoji">⚡</span>
              <div className="badge-info">
                <strong>Fera das Derivadas</strong>
                <p>Acertou pelo menos 3 questões de derivadas ({acertosDerivadas}/3).</p>
              </div>
              <IonBadge color={badgeDerivadas ? 'success' : 'medium'}>
                {badgeDerivadas ? 'Concluído' : `${acertosDerivadas}/3`}
              </IonBadge>
            </div>

            <div className={`badge-item ${badgePrecisao ? 'unlocked' : 'locked'}`}>
              <span className="badge-emoji">🎯</span>
              <div className="badge-info">
                <strong>Precisão Ninja</strong>
                <p>Taxa de acertos de 80%+ com 5+ exercícios.</p>
              </div>
              <IonBadge color={badgePrecisao ? 'success' : 'medium'}>
                {badgePrecisao ? 'Concluído' : 'Bloqueado'}
              </IonBadge>
            </div>
          </div>

          {/* Action List */}
          <div className="perfil-actions-list">
            <button
              className="perfil-action-row"
              onClick={() => navigate('/universidades')}
            >
              <div className="action-row-left">
                <IonIcon icon={schoolOutline} />
                <span>Trocar Universidade</span>
              </div>
              <IonIcon icon={chevronForwardOutline} className="action-chevron" />
            </button>

            <button
              className="perfil-action-row"
              onClick={handleResetProgress}
              style={{ color: '#6B7280' }}
            >
              <div className="action-row-left">
                <IonIcon icon={refreshOutline} />
                <span>Reiniciar Histórico de Questões</span>
              </div>
              <IonIcon icon={chevronForwardOutline} className="action-chevron" />
            </button>

            <button className="perfil-action-row danger" onClick={handleLogout}>
              <div className="action-row-left">
                <IonIcon icon={logOutOutline} />
                <span>Sair da Conta</span>
              </div>
              <IonIcon icon={chevronForwardOutline} className="action-chevron" />
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PerfilPage;
