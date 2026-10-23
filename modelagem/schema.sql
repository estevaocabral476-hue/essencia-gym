-- Banco SQLite gerado pelo Tutor Front
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT,
    senha_hash TEXT,
    criado_em TEXT
);

CREATE TABLE IF NOT EXISTS essencia_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    criado_em TEXT
);

CREATE TABLE IF NOT EXISTS essencia_usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    criado_em TEXT
);

CREATE TABLE IF NOT EXISTS catalogoinicials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categoria TEXT,
    nome TEXT,
    sabor TEXT,
    descricao TEXT,
    preco REAL,
    preco_antigo REAL,
    selo TEXT,
    estoque TEXT,
    criado_em TEXT
);

CREATE TABLE IF NOT EXISTS essencia_carrinhos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    criado_em TEXT
);

CREATE TABLE IF NOT EXISTS produtos_locais (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categoria TEXT,
    nome TEXT,
    sabor TEXT,
    descricao TEXT,
    preco REAL,
    precoantigo REAL,
    selo TEXT,
    criado_em TEXT
);
