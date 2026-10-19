-- ==============================================================================
-- BeeGe - Schema Inicial do Banco de Dados (Supabase / PostgreSQL)
-- Multi-Universidade SaaS para Revisão de Cálculo 1
-- ==============================================================================

-- Habilita extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('aluno', 'admin');
CREATE TYPE questao_dificuldade AS ENUM ('facil', 'medio', 'dificil');
CREATE TYPE postagem_status AS ENUM ('pendente', 'aprovada', 'reprovada');

-- 2. TABELA: Universidades
CREATE TABLE IF NOT EXISTS public.universidades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    sigla VARCHAR(10) NOT NULL UNIQUE,
    logo_url TEXT,
    ativa BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA: Profiles (vinculado a auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    nome TEXT NOT NULL,
    role user_role DEFAULT 'aluno' NOT NULL,
    universidade_id UUID REFERENCES public.universidades(id) ON DELETE SET NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA: Tópicos de Cálculo 1
CREATE TABLE IF NOT EXISTS public.topicos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    universidade_id UUID NOT NULL REFERENCES public.universidades(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descricao TEXT,
    conteudo_latex TEXT NOT NULL,
    ordem INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABELA: Questões
CREATE TABLE IF NOT EXISTS public.questoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topico_id UUID NOT NULL REFERENCES public.topicos(id) ON DELETE CASCADE,
    enunciado_latex TEXT NOT NULL,
    alternativas JSONB NOT NULL, -- Array de strings com as opções
    resposta_correta INTEGER NOT NULL, -- Índice da alternativa correta (0 a N-1)
    explicacao_latex TEXT NOT NULL,
    dificuldade questao_dificuldade DEFAULT 'medio' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABELA: Progresso do Aluno
CREATE TABLE IF NOT EXISTS public.progresso_aluno (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aluno_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    questao_id UUID NOT NULL REFERENCES public.questoes(id) ON DELETE CASCADE,
    acertou BOOLEAN NOT NULL,
    respondida_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_aluno_questao UNIQUE (aluno_id, questao_id)
);

-- 7. TABELA: Postagens do Fórum
CREATE TABLE IF NOT EXISTS public.postagens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    autor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    universidade_id UUID NOT NULL REFERENCES public.universidades(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    corpo TEXT NOT NULL,
    status postagem_status DEFAULT 'pendente' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TABELA: Comentários do Fórum
CREATE TABLE IF NOT EXISTS public.comentarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    postagem_id UUID NOT NULL REFERENCES public.postagens(id) ON DELETE CASCADE,
    autor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    corpo TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- TRIGGER: Criação automática de perfil ao cadastrar em auth.users
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, nome, role, universidade_id)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
        COALESCE((new.raw_user_meta_data->>'role')::user_role, 'aluno'),
        (new.raw_user_meta_data->>'universidade_id')::uuid
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Ativar RLS em todas as tabelas
ALTER TABLE public.universidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progresso_aluno ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.postagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios ENABLE ROW LEVEL SECURITY;

-- Helper function: Verifica se usuário autenticado é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies: Universidades (Leitura pública, escrita admin)
CREATE POLICY "Universidades são públicas para visualização"
    ON public.universidades FOR SELECT
    USING (true);

CREATE POLICY "Apenas admins gerenciam universidades"
    ON public.universidades FOR ALL
    USING (public.is_admin());

-- Policies: Profiles
CREATE POLICY "Perfis visíveis para autenticados"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Usuário pode atualizar o próprio perfil"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Policies: Tópicos (Leitura para todos, escrita admin)
CREATE POLICY "Tópicos são visíveis para todos os autenticados"
    ON public.topicos FOR SELECT
    USING (true);

CREATE POLICY "Apenas admins criam ou alteram tópicos"
    ON public.topicos FOR ALL
    USING (public.is_admin());

-- Policies: Questões (Leitura para todos, escrita admin)
CREATE POLICY "Questões são visíveis para autenticados"
    ON public.questoes FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Apenas admins criam ou alteram questões"
    ON public.questoes FOR ALL
    USING (public.is_admin());

-- Policies: Progresso do Aluno
CREATE POLICY "Alunos gerenciam seu próprio progresso"
    ON public.progresso_aluno FOR ALL
    TO authenticated
    USING (auth.uid() = aluno_id)
    WITH CHECK (auth.uid() = aluno_id);

-- Policies: Postagens do Fórum
-- Postagens aprovadas são visíveis para todos. O autor ou admins podem ver pendentes/reprovadas.
CREATE POLICY "Postagens aprovadas são públicas para a universidade"
    ON public.postagens FOR SELECT
    TO authenticated
    USING (
        status = 'aprovada'
        OR autor_id = auth.uid()
        OR public.is_admin()
    );

CREATE POLICY "Alunos autenticados podem criar postagens"
    ON public.postagens FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = autor_id);

CREATE POLICY "Autores podem editar suas postagens pendentes"
    ON public.postagens FOR UPDATE
    TO authenticated
    USING (auth.uid() = autor_id AND status = 'pendente');

CREATE POLICY "Admins podem moderar qualquer postagem"
    ON public.postagens FOR UPDATE
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Autores ou admins podem deletar postagens"
    ON public.postagens FOR DELETE
    TO authenticated
    USING (auth.uid() = autor_id OR public.is_admin());

-- Policies: Comentários do Fórum
CREATE POLICY "Comentários visíveis para postagens liberadas"
    ON public.comentarios FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.postagens p
            WHERE p.id = postagem_id
            AND (p.status = 'aprovada' OR p.autor_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Usuários autenticados podem comentar"
    ON public.comentarios FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = autor_id);

CREATE POLICY "Autores e admins podem remover comentários"
    ON public.comentarios FOR DELETE
    TO authenticated
    USING (auth.uid() = autor_id OR public.is_admin());
