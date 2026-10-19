import { createClient } from '@supabase/supabase-js';

// Variáveis de ambiente (configure no .env.local)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não configuradas. Configure o arquivo .env.local.');
}

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')
);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Tipos do banco de dados
export interface Universidade {
  id: string;
  nome: string;
  sigla: string;
  logo_url?: string;
  ativa: boolean;
}

export interface Topico {
  id: string;
  universidade_id: string;
  titulo: string;
  descricao?: string;
  conteudo_latex: string;
  ordem: number;
  created_at: string;
}

export interface Questao {
  id: string;
  topico_id: string;
  enunciado_latex: string;
  alternativas: string[];
  resposta_correta: number;
  explicacao_latex: string;
  dificuldade: 'facil' | 'medio' | 'dificil';
}

export interface Postagem {
  id: string;
  autor_id: string;
  universidade_id: string;
  titulo: string;
  corpo: string;
  status: 'pendente' | 'aprovada' | 'reprovada';
  created_at: string;
  profiles?: { nome: string };
}

export interface Comentario {
  id: string;
  postagem_id: string;
  autor_id: string;
  corpo: string;
  created_at: string;
  profiles?: { nome: string };
}

export interface Profile {
  id: string;
  nome: string;
  email: string;
  role: 'aluno' | 'admin';
  universidade_id?: string;
}
