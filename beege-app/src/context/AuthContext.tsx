import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, Profile, Universidade } from '../lib/supabaseClient';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  universidade: Universidade | null;
  loading: boolean;
  isAdmin: boolean;
  setUniversidade: (univ: Universidade) => void;
  login: (email: string, pass: string) => Promise<{ error?: string }>;
  signup: (email: string, pass: string, nome: string, universidadeId?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  useMockMode: boolean;
  toggleMockAdmin: () => void;
}

const DEFAULT_UNIVERSIDADE: Universidade = {
  id: '11111111-1111-1111-1111-111111111111',
  nome: 'Universidade Federal do Rio de Janeiro',
  sigla: 'UFRJ',
  logo_url: 'https://ufrj.br/favicon.ico',
  ativa: true
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [universidade, setUniversidadeState] = useState<Universidade | null>(DEFAULT_UNIVERSIDADE);
  const [loading, setLoading] = useState<boolean>(true);
  const [useMockMode, setUseMockMode] = useState<boolean>(false);

  useEffect(() => {
    // Carregar universidade salva localmente
    const savedUniv = localStorage.getItem('beege_selected_univ');
    if (savedUniv) {
      try {
        setUniversidadeState(JSON.parse(savedUniv));
      } catch {
        setUniversidadeState(DEFAULT_UNIVERSIDADE);
      }
    }

    // Verificar se Supabase está configurado
    const hasKeys = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!hasKeys) {
      // Modo Mock ativado por padrão para teste imediato
      setUseMockMode(true);
      const mockProfile: Profile = {
        id: 'mock-user-id',
        nome: 'Estudante de Cálculo',
        email: 'estudante@calculus.app',
        role: 'aluno',
        universidade_id: DEFAULT_UNIVERSIDADE.id
      };
      setProfile(mockProfile);
      setUser({ id: 'mock-user-id', email: 'estudante@calculus.app' });
      setLoading(false);
      return;
    }

    // Inicialização com Supabase real
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data as Profile);
      }
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  const setUniversidade = (univ: Universidade) => {
    setUniversidadeState(univ);
    localStorage.setItem('beege_selected_univ', JSON.stringify(univ));
  };

  const login = async (email: string, pass: string): Promise<{ error?: string }> => {
    if (useMockMode) {
      const isAdminLogin = email.toLowerCase().includes('admin');
      const mockProfile: Profile = {
        id: 'mock-user-id',
        nome: isAdminLogin ? 'Professor Admin' : 'Lucas Ferreira (Aluno)',
        email,
        role: isAdminLogin ? 'admin' : 'aluno',
        universidade_id: universidade?.id ?? DEFAULT_UNIVERSIDADE.id
      };
      setProfile(mockProfile);
      setUser({ id: 'mock-user-id', email });
      return {};
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) return { error: error.message };
    return {};
  };

  const signup = async (email: string, pass: string, nome: string, universidadeId?: string): Promise<{ error?: string }> => {
    if (useMockMode) {
      const mockProfile: Profile = {
        id: 'mock-user-id-' + Date.now(),
        nome,
        email,
        role: 'aluno',
        universidade_id: universidadeId || universidade?.id
      };
      setProfile(mockProfile);
      setUser({ id: mockProfile.id, email });
      return {};
    }

    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          nome,
          universidade_id: universidadeId || universidade?.id
        }
      }
    });

    if (error) return { error: error.message };
    return {};
  };

  const logout = async () => {
    if (useMockMode) {
      setUser(null);
      setProfile(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const toggleMockAdmin = () => {
    if (!profile) return;
    const newRole = profile.role === 'admin' ? 'aluno' : 'admin';
    setProfile({ ...profile, role: newRole });
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        universidade,
        loading,
        isAdmin,
        setUniversidade,
        login,
        signup,
        logout,
        useMockMode,
        toggleMockAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
