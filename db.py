"""Acesso ao banco: SQLite (arquivo local) OU PostgreSQL (Supabase), escolhido pela variável DATABASE_URL.

- Sem DATABASE_URL  -> usa o arquivo dados.db (SQLite), ótimo para estudar no seu computador.
- Com DATABASE_URL  -> usa o PostgreSQL do Supabase (dados permanentes, mesmo no Render grátis).
O app.py e o site NÃO mudam: só este arquivo sabe qual banco está em uso.
Gerado pelo Tutor Front. Os NOMES de tabelas/colunas vêm de TABELAS e os VALORES entram por parâmetros (anti SQL injection).
"""
import os
import sqlite3
from pathlib import Path

PASTA = Path(__file__).resolve().parent
CAMINHO = os.environ.get("DATABASE_PATH", str(PASTA / "dados.db"))
DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()
USA_PG = DATABASE_URL.startswith(("postgres://", "postgresql://"))
PH = "%s" if USA_PG else "?"   # PostgreSQL usa %s no lugar do ?

TABELAS = {'usuarios': {'colunas': {'id': 'INTEGER',
                          'nome': 'TEXT',
                          'email': 'TEXT',
                          'senha_hash': 'TEXT',
                          'criado_em': 'DATETIME'},
              'pk': ['id'],
              'auto': ['id'],
              'obrigatorias': [],
              'ocultas': ['senha_hash'],
              'leitura_publica': False},
 'essencia_tokens': {'colunas': {'id': 'INTEGER', 'criado_em': 'DATETIME'},
                     'pk': ['id'],
                     'auto': ['id'],
                     'obrigatorias': [],
                     'ocultas': [],
                     'leitura_publica': True},
 'essencia_usuarios': {'colunas': {'id': 'INTEGER', 'criado_em': 'DATETIME'},
                       'pk': ['id'],
                       'auto': ['id'],
                       'obrigatorias': [],
                       'ocultas': [],
                       'leitura_publica': False},
 'catalogoinicials': {'colunas': {'id': 'INTEGER',
                                  'categoria': 'TEXT',
                                  'nome': 'TEXT',
                                  'sabor': 'TEXT',
                                  'descricao': 'TEXT',
                                  'preco': 'REAL',
                                  'preco_antigo': 'REAL',
                                  'selo': 'TEXT',
                                  'estoque': 'TEXT',
                                  'criado_em': 'DATETIME'},
                      'pk': ['id'],
                      'auto': ['id'],
                      'obrigatorias': [],
                      'ocultas': [],
                      'leitura_publica': True},
 'essencia_carrinhos': {'colunas': {'id': 'INTEGER', 'criado_em': 'DATETIME'},
                        'pk': ['id'],
                        'auto': ['id'],
                        'obrigatorias': [],
                        'ocultas': [],
                        'leitura_publica': True},
 'produtos_locais': {'colunas': {'id': 'INTEGER',
                                 'categoria': 'TEXT',
                                 'nome': 'TEXT',
                                 'sabor': 'TEXT',
                                 'descricao': 'TEXT',
                                 'preco': 'REAL',
                                 'precoantigo': 'REAL',
                                 'selo': 'TEXT',
                                 'criado_em': 'DATETIME'},
                     'pk': ['id'],
                     'auto': ['id'],
                     'obrigatorias': [],
                     'ocultas': [],
                     'leitura_publica': True}}


def conectar():
    if USA_PG:
        import psycopg
        from psycopg.rows import dict_row
        return psycopg.connect(DATABASE_URL, row_factory=dict_row, sslmode="require")
    con = sqlite3.connect(CAMINHO)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA foreign_keys = ON")
    return con


def iniciar():
    """Cria as tabelas (schema_postgres.sql no Supabase, schema.sql no SQLite) se ainda não existirem."""
    sql = (PASTA / ("schema_postgres.sql" if USA_PG else "schema.sql")).read_text(encoding="utf-8")
    con = conectar()
    try:
        if USA_PG:
            con.execute(sql)
        else:
            con.executescript(sql)
        con.commit()
    finally:
        con.close()


def _tabela(nome):
    if nome not in TABELAS:
        raise KeyError("tabela desconhecida: " + str(nome))
    return TABELAS[nome]


def _onde(t, chave):
    if set(chave) != set(t["pk"]):
        raise ValueError("informe a chave primária completa: " + ", ".join(t["pk"]))
    return " AND ".join(c + " = " + PH for c in t["pk"]), [chave[c] for c in t["pk"]]


def _linha(t, row):
    d = dict(row)
    for oculta in t["ocultas"]:
        d.pop(oculta, None)
    return d


def criar(tabela, dados):
    """C - CREATE (INSERT). No PostgreSQL usamos RETURNING para saber o id novo."""
    t = _tabela(tabela)
    cols = [c for c in dados if c in t["colunas"] and c not in t["auto"]]
    faltam = [c for c in t["obrigatorias"] if dados.get(c) in (None, "")]
    if faltam:
        raise ValueError("campo(s) obrigatório(s): " + ", ".join(faltam))
    if not cols:
        raise ValueError("nenhum campo válido para gravar")
    sql = "INSERT INTO " + tabela + " (" + ", ".join(cols) + ") VALUES (" + ", ".join(PH for _ in cols) + ")"
    valores = [dados[c] for c in cols]
    con = conectar()
    try:
        if USA_PG:
            if t["auto"]:
                sql += " RETURNING " + t["auto"][0]
            cur = con.execute(sql, valores)
            novo = cur.fetchone()[t["auto"][0]] if t["auto"] else {c: dados[c] for c in t["pk"]}
        else:
            cur = con.execute(sql, valores)
            novo = cur.lastrowid if t["auto"] else {c: dados[c] for c in t["pk"]}
        con.commit()
        return novo
    finally:
        con.close()


def listar(tabela, limite=500):
    t = _tabela(tabela)
    con = conectar()
    try:
        return [_linha(t, r) for r in con.execute("SELECT * FROM " + tabela + " LIMIT " + PH, [limite]).fetchall()]
    finally:
        con.close()


def obter(tabela, chave):
    t = _tabela(tabela)
    onde, valores = _onde(t, chave)
    con = conectar()
    try:
        r = con.execute("SELECT * FROM " + tabela + " WHERE " + onde, valores).fetchone()
        return _linha(t, r) if r else None
    finally:
        con.close()


def atualizar(tabela, chave, dados):
    t = _tabela(tabela)
    cols = [c for c in dados if c in t["colunas"] and c not in t["pk"]]
    if not cols:
        raise ValueError("nenhum campo válido para atualizar")
    onde, valores = _onde(t, chave)
    sql = "UPDATE " + tabela + " SET " + ", ".join(c + " = " + PH for c in cols) + " WHERE " + onde
    con = conectar()
    try:
        cur = con.execute(sql, [dados[c] for c in cols] + valores)
        con.commit()
        return cur.rowcount
    finally:
        con.close()


def apagar(tabela, chave):
    t = _tabela(tabela)
    onde, valores = _onde(t, chave)
    con = conectar()
    try:
        cur = con.execute("DELETE FROM " + tabela + " WHERE " + onde, valores)
        con.commit()
        return cur.rowcount
    finally:
        con.close()


def erro_do_banco():
    if USA_PG:
        import psycopg
        return (psycopg.IntegrityError, psycopg.DataError, psycopg.ProgrammingError)
    return (sqlite3.IntegrityError, sqlite3.OperationalError)
