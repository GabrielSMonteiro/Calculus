import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSpinner,
  IonToast
} from '@ionic/react';
import {
  chatbubblesOutline,
  addOutline,
  closeOutline,
  sendOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  personCircleOutline
} from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { DataService } from '../services/dataService';
import { getLimiaTip } from '../utils/limiaTips';
import { Postagem, Comentario } from '../lib/supabaseClient';
import BeegeHeader from '../components/BeegeHeader';
import MathRenderer from '../components/MathRenderer';
import LimiaMascot from '../components/LimiaMascot';

export const ForumPage: React.FC = () => {
  const { universidade, profile, isAdmin } = useAuth();
  const [postagens, setPostagens] = useState<Postagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [limiaMsg] = useState(() => getLimiaTip('forum'));

  // Modal de Criação de Postagem
  const [showModal, setShowModal] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novoCorpo, setNovoCorpo] = useState('');

  // Seção de Comentários
  const [activePostComments, setActivePostComments] = useState<string | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [novoComentario, setNovoComentario] = useState('');

  const loadPosts = async () => {
    if (!universidade) return;
    setLoading(true);
    const data = await DataService.getPostagens(universidade.id, isAdmin, profile?.id);
    setPostagens(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, [universidade, isAdmin, profile]);

  const handleCriarPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoTitulo.trim() || !novoCorpo.trim() || !universidade) return;

    await DataService.createPostagem({
      autor_id: profile?.id || 'anon',
      universidade_id: universidade.id,
      titulo: novoTitulo,
      corpo: novoCorpo,
      autor_nome: profile?.nome || 'Estudante'
    });

    setNovoTitulo('');
    setNovoCorpo('');
    setShowModal(false);
    setToastMsg('Dúvida enviada! Ela aguarda moderação e aparecerá para todos após aprovada.');
    loadPosts();
  };

  const handleModerar = async (id: string, status: 'aprovada' | 'reprovada') => {
    await DataService.moderarPostagem(id, status);
    loadPosts();
  };

  const toggleComments = async (postId: string) => {
    if (activePostComments === postId) {
      setActivePostComments(null);
      setComentarios([]);
    } else {
      setActivePostComments(postId);
      const data = await DataService.getComentarios(postId);
      setComentarios(data);
    }
  };

  const handleEnviarComentario = async (postId: string) => {
    if (!novoComentario.trim()) return;
    const added = await DataService.addComentario(
      postId,
      novoComentario,
      profile?.nome || 'Estudante'
    );
    setComentarios([...comentarios, added]);
    setNovoComentario('');
  };

  return (
    <IonPage>
      <BeegeHeader title="Fórum Comunitário" />
      <IonContent className="ion-padding">
        <div style={{ maxWidth: '440px', margin: '0 auto', paddingBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F1926', margin: 0 }}>
                Fórum Acadêmico{universidade?.sigla ? ` • ${universidade.sigla}` : ''}
              </h1>
              <p style={{ color: '#78716C', fontSize: '0.82rem', margin: '2px 0 0' }}>
                Dúvidas conceituais e resoluções com suporte a KaTeX.
              </p>
            </div>

            <IonButton
              color="primary"
              size="small"
              onClick={() => setShowModal(true)}
              style={{ fontWeight: 800, '--border-radius': '9999px' }}
            >
              <IonIcon slot="start" icon={addOutline} />
              Publicar
            </IonButton>
          </div>

          <LimiaMascot
            message={limiaMsg}
            mood="happy"
            compact
            size="small"
          />

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <IonSpinner name="crescent" color="primary" />
              <p style={{ color: '#8C8680', fontSize: '0.88rem', marginTop: '10px' }}>Carregando discussões...</p>
            </div>
          ) : postagens.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid rgba(124, 58, 237, 0.1)' }}>
              <p style={{ color: '#78716C', margin: 0 }}>Nenhuma postagem ainda. Seja o primeiro a postar uma dúvida!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {postagens.map((post) => {
                const isExpanded = activePostComments === post.id;
                return (
                  <IonCard
                    key={post.id}
                    style={{
                      margin: 0,
                      borderRadius: '18px',
                      border: '1px solid rgba(124, 58, 237, 0.1)',
                      background: '#FFFFFF',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
                    }}
                  >
                    <IonCardHeader style={{ padding: '14px 16px 6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <IonIcon icon={personCircleOutline} style={{ color: '#7C3AED', fontSize: '1.15rem' }} />
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6D28D9' }}>
                              {post.profiles?.nome || 'Estudante'}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#8C8680' }}>•</span>
                            <span style={{ fontSize: '0.72rem', color: '#8C8680' }}>
                              {new Date(post.created_at).toLocaleDateString('pt-BR')}
                            </span>
                          </div>

                          <IonCardTitle style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1F1926' }}>
                            {post.titulo}
                          </IonCardTitle>
                        </div>

                        {/* Status / Moderação */}
                        <div>
                          {post.status === 'pendente' && (
                            <IonBadge color="warning" style={{ fontSize: '0.65rem' }}>Pendente</IonBadge>
                          )}
                          {post.status === 'aprovada' && (
                            <IonBadge color="success" style={{ fontSize: '0.65rem' }}>Aprovada</IonBadge>
                          )}
                          {post.status === 'reprovada' && (
                            <IonBadge color="danger" style={{ fontSize: '0.65rem' }}>Reprovada</IonBadge>
                          )}
                        </div>
                      </div>
                    </IonCardHeader>

                    <IonCardContent style={{ padding: '6px 16px 14px' }}>
                      {/* Conteúdo com suporte a KaTeX */}
                      <div style={{ fontSize: '0.92rem', lineHeight: '1.55', margin: '6px 0 12px', color: '#2D2A26' }}>
                        <MathRenderer content={post.corpo} />
                      </div>

                      {/* Ações da Postagem */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F0E8DD', paddingTop: '8px', marginTop: '8px' }}>
                        <IonButton
                          size="small"
                          fill="clear"
                          color="primary"
                          onClick={() => toggleComments(post.id)}
                          style={{ fontWeight: 700, fontSize: '0.8rem', padding: 0 }}
                        >
                          <IonIcon slot="start" icon={chatbubblesOutline} />
                          {isExpanded ? 'Ocultar Respostas' : 'Ver Respostas'}
                        </IonButton>

                        {/* Moderação Admin */}
                        {isAdmin && post.status === 'pendente' && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <IonButton
                              size="small"
                              color="success"
                              onClick={() => handleModerar(post.id, 'aprovada')}
                            >
                              <IonIcon slot="start" icon={checkmarkCircleOutline} />
                              Aprovar
                            </IonButton>
                            <IonButton
                              size="small"
                              color="danger"
                              onClick={() => handleModerar(post.id, 'reprovada')}
                            >
                              <IonIcon slot="start" icon={closeCircleOutline} />
                              Reprovar
                            </IonButton>
                          </div>
                        )}
                      </div>

                      {/* Sessão Expandida de Comentários */}
                      {isExpanded && (
                        <div style={{ marginTop: '12px', background: 'rgba(124, 58, 237, 0.04)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(124, 58, 237, 0.1)' }}>
                          <h4 style={{ fontSize: '0.84rem', fontWeight: 700, margin: '0 0 8px', color: '#6D28D9' }}>
                            Respostas ({comentarios.length}):
                          </h4>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                            {comentarios.map((c) => (
                              <div
                                key={c.id}
                                style={{
                                  background: '#FFFFFF',
                                  padding: '8px 12px',
                                  borderRadius: '10px',
                                  border: '1px solid #E8DDD0'
                                }}
                              >
                                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#7C3AED', marginBottom: '2px' }}>
                                  {c.profiles?.nome || 'Colega'}:
                                </div>
                                <div style={{ fontSize: '0.88rem' }}>
                                  <MathRenderer content={c.corpo} />
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Input de Novo Comentário */}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <IonInput
                              value={novoComentario}
                              placeholder="Escreva sua resposta..."
                              onIonInput={(e) => setNovoComentario(e.detail.value!)}
                              style={{ background: '#FFFFFF', borderRadius: '10px', padding: '0 8px', fontSize: '0.88rem' }}
                            />
                            <IonButton
                              size="small"
                              color="primary"
                              onClick={() => handleEnviarComentario(post.id)}
                            >
                              <IonIcon icon={sendOutline} />
                            </IonButton>
                          </div>
                        </div>
                      )}
                    </IonCardContent>
                  </IonCard>
                );
              })}
            </div>
          )}

          {/* Modal para Nova Postagem */}
          <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            <IonHeader>
              <IonToolbar style={{ '--background': '#FAF5EE' } as any}>
                <IonTitle style={{ fontWeight: 800, color: '#1F1926' }}>Nova Dúvida</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowModal(false)}>
                    <IonIcon icon={closeOutline} />
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding" style={{ '--background': '#FAF5EE' } as any}>
              <form onSubmit={handleCriarPost}>
                <IonItem style={{ marginBottom: '14px', borderRadius: '12px', '--background': '#FFFFFF' } as any}>
                  <IonLabel position="stacked">Título da Dúvida</IonLabel>
                  <IonInput
                    value={novoTitulo}
                    placeholder="Ex: Como calcular o limite quando x tende a 0?"
                    required
                    onIonInput={(e) => setNovoTitulo(e.detail.value!)}
                  />
                </IonItem>

                <IonItem style={{ marginBottom: '16px', borderRadius: '12px', '--background': '#FFFFFF' } as any}>
                  <IonLabel position="stacked">Descrição Completa (com KaTeX)</IonLabel>
                  <IonTextarea
                    rows={5}
                    value={novoCorpo}
                    placeholder="Descreva o exercício. Use $f(x)$ para inline ou $$...$$ para blocos."
                    required
                    onIonInput={(e) => setNovoCorpo(e.detail.value!)}
                  />
                </IonItem>

                {novoCorpo && (
                  <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(124, 58, 237, 0.06)', borderRadius: '12px', border: '1px solid rgba(124, 58, 237, 0.15)' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#6D28D9', marginBottom: '4px' }}>
                      Pré-visualização KaTeX:
                    </div>
                    <MathRenderer content={novoCorpo} />
                  </div>
                )}

                <IonButton expand="block" type="submit" color="primary" style={{ fontWeight: 800, '--border-radius': '9999px', height: '48px' }}>
                  Publicar no Fórum
                </IonButton>
              </form>
            </IonContent>
          </IonModal>

          <IonToast
            isOpen={!!toastMsg}
            message={toastMsg}
            duration={3500}
            onDidDismiss={() => setToastMsg('')}
            color="primary"
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForumPage;
