-- Banco PostgreSQL (Supabase) gerado pelo Tutor Front

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome TEXT,
    email TEXT,
    senha_hash TEXT,
    criado_em TIMESTAMP
);

CREATE TABLE IF NOT EXISTS essencia_tokens (
    id SERIAL PRIMARY KEY,
    criado_em TIMESTAMP
);

CREATE TABLE IF NOT EXISTS essencia_usuarios (
    id SERIAL PRIMARY KEY,
    criado_em TIMESTAMP
);

CREATE TABLE IF NOT EXISTS catalogoinicials (
    id SERIAL PRIMARY KEY,
    categoria TEXT,
    nome TEXT,
    sabor TEXT,
    descricao TEXT,
    preco DOUBLE PRECISION,
    preco_antigo DOUBLE PRECISION,
    selo TEXT,
    estoque TEXT,
    criado_em TIMESTAMP
);

CREATE TABLE IF NOT EXISTS essencia_carrinhos (
    id SERIAL PRIMARY KEY,
    criado_em TIMESTAMP
);

CREATE TABLE IF NOT EXISTS produtos_locais (
    id SERIAL PRIMARY KEY,
    categoria TEXT,
    nome TEXT,
    sabor TEXT,
    descricao TEXT,
    preco DOUBLE PRECISION,
    precoantigo DOUBLE PRECISION,
    selo TEXT,
    criado_em TIMESTAMP
);

-- Segurança: o Supabase também expõe as tabelas por uma API pública (Data API).
-- Com RLS ligado e SEM políticas, essa API pública não enxerga nada.
-- O seu Flask acessa pela conexão direta do banco (usuário postgres), que continua funcionando.
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE essencia_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE essencia_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogoinicials ENABLE ROW LEVEL SECURITY;
ALTER TABLE essencia_carrinhos ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos_locais ENABLE ROW LEVEL SECURITY;
