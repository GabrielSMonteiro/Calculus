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
  toggleMockAdmin?: () => void;
}

const DEFAULT_UNB: Universidade = {
  id: '11111111-1111-1111-1111-111111111111',
  nome: 'Universidade de Brasília',
  sigla: 'UnB',
  logo_url: 'https://unb.br/favicon.ico',
  ativa: true
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(() => {
    const saved = localStorage.getItem('beege_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  const [profile, setProfile] = useState<Profile | null>(() => {
    const saved = localStorage.getItem('beege_current_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  const [universidade, setUniversidadeState] = useState<Universidade | null>(DEFAULT_UNB);
  const [loading, setLoading] = useState<boolean>(false);
  const [useMockMode, setUseMockMode] = useState<boolean>(true);

  useEffect(() => {
    // Carregar universidade salva localmente
    const savedUniv = localStorage.getItem('beege_selected_univ');
    if (savedUniv) {
      try {
        setUniversidadeState(JSON.parse(savedUniv));
      } catch {
        setUniversidadeState(DEFAULT_UNB);
      }
    }

    // Verificar se Supabase está configurado com chaves reais
    const hasKeys = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!hasKeys) {
      setUseMockMode(true);
      return;
    }

    setUseMockMode(false);

    // Inicialização com Supabase real se configurado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
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
        localStorage.setItem('beege_current_profile', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
    }
  };

  const setUniversidade = (univ: Universidade) => {
    setUniversidadeState(univ);
    localStorage.setItem('beege_selected_univ', JSON.stringify(univ));
  };

  const login = async (emailOrUser: string, pass: string): Promise<{ error?: string }> => {
    const cleanId = (emailOrUser || '').trim().toLowerCase();
    const cleanPass = (pass || '').trim();

    if (!cleanId) {
      return { error: 'Por favor, informe seu usuário ou email.' };
    }

    // =========================================================================
    // REGRA DE OURO: ACESSO ADMIN
    // Apenas login "admin" com a senha exata "beegeadm" concede acesso de administrador.
    // Alunos comuns NUNCA recebem role admin.
    // =========================================================================
    if (cleanId === 'admin' || cleanId === 'admin@beege.com') {
      if (cleanPass !== 'beegeadm') {
        return { error: 'Senha incorreta para o administrador. Digite "beegeadm".' };
      }

      const adminProfile: Profile = {
        id: 'admin-master-id',
        nome: 'Administrador BeeGe',
        email: 'admin@beege.com',
        role: 'admin',
        universidade_id: universidade?.id ?? DEFAULT_UNB.id
      };
      const adminUser = { id: 'admin-master-id', email: 'admin@beege.com' };

      localStorage.setItem('beege_current_user', JSON.stringify(adminUser));
      localStorage.setItem('beege_current_profile', JSON.stringify(adminProfile));
      setUser(adminUser);
      setProfile(adminProfile);
      return {};
    }

    // =========================================================================
    // ACESSO DE ALUNO (Qualquer outro login)
    // =========================================================================
    if (useMockMode || (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
      const studentEmail = cleanId.includes('@') ? cleanId : `${cleanId}@unb.br`;
      const rawName = cleanId.includes('@') ? cleanId.split('@')[0] : cleanId;
      const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

      const studentProfile: Profile = {
        id: 'aluno-' + Date.now(),
        nome: `${formattedName}`,
        email: studentEmail,
        role: 'aluno', // Sempre aluno!
        universidade_id: universidade?.id ?? DEFAULT_UNB.id
      };
      const studentUser = { id: studentProfile.id, email: studentEmail };

      localStorage.setItem('beege_current_user', JSON.stringify(studentUser));
      localStorage.setItem('beege_current_profile', JSON.stringify(studentProfile));
      setUser(studentUser);
      setProfile(studentProfile);
      return {};
    }

    // Supabase real
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanId,
      password: pass
    });
    if (error) return { error: error.message };

    if (data?.user) {
      setUser(data.user);
      localStorage.setItem('beege_current_user', JSON.stringify(data.user));
      await fetchProfile(data.user.id);
    }
    return {};
  };

  const signup = async (email: string, pass: string, nome: string, universidadeId?: string): Promise<{ error?: string }> => {
    const cleanEmail = (email || '').trim().toLowerCase();

    if (useMockMode || (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
      const studentProfile: Profile = {
        id: 'mock-user-id-' + Date.now(),
        nome: nome || 'Estudante',
        email: cleanEmail,
        role: 'aluno', // Sempre aluno!
        universidade_id: universidadeId || universidade?.id || DEFAULT_UNB.id
      };
      const studentUser = { id: studentProfile.id, email: cleanEmail };

      localStorage.setItem('beege_current_user', JSON.stringify(studentUser));
      localStorage.setItem('beege_current_profile', JSON.stringify(studentProfile));
      setUser(studentUser);
      setProfile(studentProfile);
      return {};
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: pass,
      options: {
        data: {
          nome,
          universidade_id: universidadeId || universidade?.id
        }
      }
    });

    if (error) return { error: error.message };
    if (data?.user) {
      setUser(data.user);
      localStorage.setItem('beege_current_user', JSON.stringify(data.user));
    }
    return {};
  };

  const logout = async () => {
    localStorage.removeItem('beege_current_user');
    localStorage.removeItem('beege_current_profile');
    setUser(null);
    setProfile(null);

    if (!useMockMode && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
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
        useMockMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

