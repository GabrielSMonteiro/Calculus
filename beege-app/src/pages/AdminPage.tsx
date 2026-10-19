import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonItem,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonBadge,
  IonToast
} from '@ionic/react';
import {
  bookOutline,
  helpCircleOutline,
  shieldCheckmarkOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  arrowBackOutline
} from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { DataService } from '../services/dataService';
import { Topico, Postagem } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import BeegeHeader from '../components/BeegeHeader';
import MathRenderer from '../components/MathRenderer';
import LimiaMascot from '../components/LimiaMascot';

export const AdminPage: React.FC = () => {
  const { isAdmin, universidade } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'topico' | 'questao' | 'moderacao'>('topico');
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [postagensPendentes, setPostagensPendentes] = useState<Postagem[]>([]);
  const [toastMsg, setToastMsg] = useState('');

  // Form Tópico
  const [tituloTopico, setTituloTopico] = useState('');
  const [descTopico, setDescTopico] = useState('');
  const [conteudoLatexTopico, setConteudoLatexTopico] = useState('');
  const [ordemTopico, setOrdemTopico] = useState(1);

  // Form Questão
  const [topicoSelecionado, setTopicoSelecionado] = useState('');
  const [enunciadoQuestao, setEnunciadoQuestao] = useState('');
  const [alt0, setAlt0] = useState('');
  const [alt1, setAlt1] = useState('');
  const [alt2, setAlt2] = useState('');
  const [alt3, setAlt3] = useState('');
  const [correta, setCorreta] = useState<number>(0);
  const [explicacaoQuestao, setExplicacaoQuestao] = useState('');
  const [dificuldade, setDificuldade] = useState<'facil' | 'medio' | 'dificil'>('medio');

  const loadData = async () => {
    if (!universidade) return;
    const t = await DataService.getTopicos(universidade.id);
    setTopicos(t);
    if (t.length > 0 && !topicoSelecionado) {
      setTopicoSelecionado(t[0].id);
    }
    const p = await DataService.getPostagens(universidade.id, true);
    setPostagensPendentes(p.filter((post) => post.status === 'pendente'));
  };

  useEffect(() => {
    loadData();
  }, [universidade, isAdmin]);

  const handleSalvarTopico = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tituloTopico || !conteudoLatexTopico || !universidade) return;

    await DataService.createTopico({
      universidade_id: universidade.id,
      titulo: tituloTopico,
      descricao: descTopico,
      conteudo_latex: conteudoLatexTopico,
      ordem: Number(ordemTopico)
    });

    setTituloTopico('');
    setDescTopico('');
    setConteudoLatexTopico('');
    setToastMsg('Tópico cadastrado com sucesso!');
    loadData();
  };

  const handleSalvarQuestao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enunciadoQuestao || !alt0 || !alt1 || !topicoSelecionado) return;

    await DataService.createQuestao({
      topico_id: topicoSelecionado,
      enunciado_latex: enunciadoQuestao,
      alternativas: [alt0, alt1, alt2 || 'Alternativa C', alt3 || 'Alternativa D'],
      resposta_correta: correta,
      explicacao_latex: explicacaoQuestao,
      dificuldade
    });

    setEnunciadoQuestao('');
    setAlt0('');
    setAlt1('');
    setAlt2('');
    setAlt3('');
    setExplicacaoQuestao('');
    setToastMsg('Questão cadastrada com sucesso!');
  };

  const handleModerar = async (id: string, status: 'aprovada' | 'reprovada') => {
    await DataService.moderarPostagem(id, status);
    setToastMsg(`Postagem ${status} com sucesso!`);
    loadData();
  };

  if (!isAdmin) {
    return (
      <IonPage>
        <BeegeHeader title="Acesso Restrito" />
        <IonContent className="ion-padding">
          <div style={{ maxWidth: '440px', margin: '40px auto', textAlign: 'center' }}>
            <LimiaMascot
              message="Esta área é reservada exclusivamente para moderadores e administradores da plataforma BeeGe."
              mood="thinking"
            />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F1926', marginTop: '20px' }}>
              Acesso Não Autorizado
            </h2>
            <p style={{ color: '#736B63', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.5' }}>
              Sua conta atual não possui permissões de administrador. Entre em contato com a equipe ou retorne ao painel de estudos.
            </p>
            <IonButton
              color="primary"
              onClick={() => navigate('/dashboard')}
              style={{ fontWeight: 800, '--border-radius': '9999px' }}
            >
              Voltar ao Início
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <BeegeHeader title="Painel Admin BeeGe" />
      <IonContent className="ion-padding">
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <IonButton
              fill="clear"
              color="warning"
              onClick={() => navigate('/dashboard')}
              style={{ fontWeight: 600, padding: 0 }}
            >
              <IonIcon slot="start" icon={arrowBackOutline} />
              Voltar ao Início
            </IonButton>

            <IonBadge color="warning" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              <IonIcon icon={shieldCheckmarkOutline} style={{ marginRight: '4px' }} />
              Acesso Administrativo
            </IonBadge>
          </div>

          <LimiaMascot
            message="Painel administrativo para gestao de topicos teoricos, cadastro de exercicios com KaTeX e moderacao de publicacoes do forum."
            mood="happy"
            compact
          />

          <IonSegment
            value={tab}
            onIonChange={(e) => setTab(e.detail.value as any)}
            style={{ margin: '16px 0 20px' }}
          >
            <IonSegmentButton value="topico">
              <IonIcon icon={bookOutline} />
              <IonLabel>Novo Tópico</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="questao">
              <IonIcon icon={helpCircleOutline} />
              <IonLabel>Nova Questão</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="moderacao">
              <IonIcon icon={shieldCheckmarkOutline} />
              <IonLabel>Moderar Fórum ({postagensPendentes.length})</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {/* TAB 1: CADASTRAR TÓPICO */}
          {tab === 'topico' && (
            <IonCard style={{ borderRadius: '16px', border: '1px solid #334155', background: 'var(--beege-card-bg)' }}>
              <IonCardHeader>
                <IonCardTitle style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  Cadastrar Tópico Teórico
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <form onSubmit={handleSalvarTopico}>
                  <IonItem style={{ marginBottom: '12px', borderRadius: '8px' }}>
                    <IonLabel position="stacked">Título do Tópico</IonLabel>
                    <IonInput
                      value={tituloTopico}
                      placeholder="Ex: 5. Teorema Fundamental do Cálculo"
                      required
                      onIonInput={(e) => setTituloTopico(e.detail.value!)}
                    />
                  </IonItem>

                  <IonItem style={{ marginBottom: '12px', borderRadius: '8px' }}>
                    <IonLabel position="stacked">Breve Descrição / Ementa</IonLabel>
                    <IonInput
                      value={descTopico}
                      placeholder="Ex: Relação entre derivação e integração e cálculo de áreas"
                      onIonInput={(e) => setDescTopico(e.detail.value!)}
                    />
                  </IonItem>

                  <IonItem style={{ marginBottom: '12px', borderRadius: '8px' }}>
                    <IonLabel position="stacked">Ordem de Exibição</IonLabel>
                    <IonInput
                      type="number"
                      value={ordemTopico}
                      onIonInput={(e) => setOrdemTopico(Number(e.detail.value))}
                    />
                  </IonItem>

                  <IonItem style={{ marginBottom: '16px', borderRadius: '8px' }}>
                    <IonLabel position="stacked">Conteúdo Teórico (Markdown + KaTeX)</IonLabel>
                    <IonTextarea
                      rows={8}
                      value={conteudoLatexTopico}
                      placeholder="Use $...$ para fórmulas em linha e $$...$$ para equações em destaque"
                      required
                      onIonInput={(e) => setConteudoLatexTopico(e.detail.value!)}
                    />
                  </IonItem>

                  {conteudoLatexTopico && (
                    <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', marginBottom: '4px' }}>
                        Live Preview com KaTeX:
                      </div>
                      <MathRenderer content={conteudoLatexTopico} />
                    </div>
                  )}

                  <IonButton expand="block" type="submit" color="warning" style={{ fontWeight: 700 }}>
                    Salvar Tópico
                  </IonButton>
                </form>
              </IonCardContent>
            </IonCard>
          )}

          {/* TAB 2: CADASTRAR QUESTÃO */}
          {tab === 'questao' && (
            <IonCard style={{ borderRadius: '16px', border: '1px solid #334155', background: 'var(--beege-card-bg)' }}>
              <IonCardHeader>
                <IonCardTitle style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  Cadastrar Questão de Revisão
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <form onSubmit={handleSalvarQuestao}>
                  <IonItem style={{ marginBottom: '12px', borderRadius: '8px' }}>
                    <IonLabel position="stacked">Vincular ao Tópico</IonLabel>
                    <IonSelect
                      value={topicoSelecionado}
                      onIonChange={(e) => setTopicoSelecionado(e.detail.value)}
                    >
                      {topicos.map((t) => (
                        <IonSelectOption key={t.id} value={t.id}>
                          {t.titulo}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>

                  <IonItem style={{ marginBottom: '12px', borderRadius: '8px' }}>
                    <IonLabel position="stacked">Enunciado (com KaTeX)</IonLabel>
                    <IonTextarea
                      rows={3}
                      value={enunciadoQuestao}
                      placeholder="Ex: Calcule o limite: $\lim_{x \to 0} \frac{\tan(x)}{x}$"
                      required
                      onIonInput={(e) => setEnunciadoQuestao(e.detail.value!)}
                    />
                  </IonItem>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    <IonItem style={{ borderRadius: '8px' }}>
                      <IonLabel position="stacked">Alternativa A</IonLabel>
                      <IonInput value={alt0} required onIonInput={(e) => setAlt0(e.detail.value!)} />
                    </IonItem>
                    <IonItem style={{ borderRadius: '8px' }}>
                      <IonLabel position="stacked">Alternativa B</IonLabel>
                      <IonInput value={alt1} required onIonInput={(e) => setAlt1(e.detail.value!)} />
                    </IonItem>
                    <IonItem style={{ borderRadius: '8px' }}>
                      <IonLabel position="stacked">Alternativa C</IonLabel>
                      <IonInput value={alt2} onIonInput={(e) => setAlt2(e.detail.value!)} />
                    </IonItem>
                    <IonItem style={{ borderRadius: '8px' }}>
                      <IonLabel position="stacked">Alternativa D</IonLabel>
                      <IonInput value={alt3} onIonInput={(e) => setAlt3(e.detail.value!)} />
                    </IonItem>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    <IonItem style={{ borderRadius: '8px' }}>
                      <IonLabel position="stacked">Gabarito Correto</IonLabel>
                      <IonSelect value={correta} onIonChange={(e) => setCorreta(Number(e.detail.value))}>
                        <IonSelectOption value={0}>A</IonSelectOption>
                        <IonSelectOption value={1}>B</IonSelectOption>
                        <IonSelectOption value={2}>C</IonSelectOption>
                        <IonSelectOption value={3}>D</IonSelectOption>
                      </IonSelect>
                    </IonItem>

                    <IonItem style={{ borderRadius: '8px' }}>
                      <IonLabel position="stacked">Dificuldade</IonLabel>
                      <IonSelect value={dificuldade} onIonChange={(e) => setDificuldade(e.detail.value)}>
                        <IonSelectOption value="facil">Fácil</IonSelectOption>
                        <IonSelectOption value="medio">Médio</IonSelectOption>
                        <IonSelectOption value="dificil">Difícil</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </div>

                  <IonItem style={{ marginBottom: '16px', borderRadius: '8px' }}>
                    <IonLabel position="stacked">Resolução Comentada da Limia (KaTeX)</IonLabel>
                    <IonTextarea
                      rows={3}
                      value={explicacaoQuestao}
                      placeholder="Explique o passo a passo matemático para quando o aluno errar ou acertar"
                      required
                      onIonInput={(e) => setExplicacaoQuestao(e.detail.value!)}
                    />
                  </IonItem>

                  <IonButton expand="block" type="submit" color="warning" style={{ fontWeight: 700 }}>
                    Cadastrar Questão
                  </IonButton>
                </form>
              </IonCardContent>
            </IonCard>
          )}

          {/* TAB 3: MODERAÇÃO DO FÓRUM */}
          {tab === 'moderacao' && (
            <div>
              {postagensPendentes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: 'var(--beege-card-bg)', borderRadius: '16px' }}>
                  <p style={{ color: '#64748b' }}>Nenhuma postagem pendente de moderacao no momento.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {postagensPendentes.map((p) => (
                    <IonCard key={p.id} style={{ margin: 0, borderRadius: '16px', border: '1px solid #334155', background: 'var(--beege-card-bg)' }}>
                      <IonCardHeader style={{ padding: '16px 20px 8px' }}>
                        <IonCardTitle style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                          {p.titulo}
                        </IonCardTitle>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                          Autor: {p.profiles?.nome || 'Estudante'} • {new Date(p.created_at).toLocaleString('pt-BR')}
                        </div>
                      </IonCardHeader>
                      <IonCardContent style={{ padding: '8px 20px 16px' }}>
                        <MathRenderer content={p.corpo} />
                        <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                          <IonButton
                            size="small"
                            color="success"
                            onClick={() => handleModerar(p.id, 'aprovada')}
                          >
                            <IonIcon slot="start" icon={checkmarkCircleOutline} />
                            Aprovar Postagem
                          </IonButton>
                          <IonButton
                            size="small"
                            color="danger"
                            onClick={() => handleModerar(p.id, 'reprovada')}
                          >
                            <IonIcon slot="start" icon={closeCircleOutline} />
                            Reprovar / Bloquear
                          </IonButton>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  ))}
                </div>
              )}
            </div>
          )}

          <IonToast
            isOpen={!!toastMsg}
            message={toastMsg}
            duration={2500}
            onDidDismiss={() => setToastMsg('')}
            color="success"
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminPage;
