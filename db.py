"""Acesso ao banco de dados SQLite (um arquivo local).  Gerado pelo Tutor Front: leia, mexa e aprenda.

Ideia central: o Python NUNCA monta SQL juntando o texto que veio do navegador.
Os NOMES de tabelas e colunas vêm da lista TABELAS (abaixo) e os VALORES entram por '?'.
Isso evita o ataque "SQL injection".
"""
import os
import sqlite3
from pathlib import Path

PASTA = Path(__file__).resolve().parent
CAMINHO = os.environ.get("DATABASE_PATH", str(PASTA / "dados.db"))

# Mapa do banco: o que existe, qual é a chave primária e o que é obrigatório.
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
    """Abre uma conexão. row_factory permite ler cada coluna pelo nome (linha["nome"])."""
    con = sqlite3.connect(CAMINHO)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA foreign_keys = ON")  # sem isso o SQLite ignora as chaves estrangeiras
    return con


def iniciar():
    """Cria as tabelas descritas em schema.sql (só cria o que ainda não existe)."""
    sql = (PASTA / "schema.sql").read_text(encoding="utf-8")
    con = conectar()
    try:
        con.executescript(sql)
        con.commit()
    finally:
        con.close()


def _tabela(nome):
    if nome not in TABELAS:
        raise KeyError("tabela desconhecida: " + str(nome))
    return TABELAS[nome]


def _onde(t, chave):
    """Monta 'coluna = ? AND coluna2 = ?' só com colunas que são chave primária."""
    if set(chave) != set(t["pk"]):
        raise ValueError("informe a chave primária completa: " + ", ".join(t["pk"]))
    return " AND ".join(c + " = ?" for c in t["pk"]), [chave[c] for c in t["pk"]]


def _linha(t, row):
    d = dict(row)
    for oculta in t["ocultas"]:
        d.pop(oculta, None)  # nunca devolve hash de senha
    return d


# ---------------------------------------------------------------- CRUD
def criar(tabela, dados):
    """C - CREATE:  INSERT INTO tabela (colunas) VALUES (?, ?, ...)  -> devolve a chave primária da nova linha."""
    t = _tabela(tabela)
    cols = [c for c in dados if c in t["colunas"] and c not in t["auto"]]
    faltam = [c for c in t["obrigatorias"] if dados.get(c) in (None, "")]
    if faltam:
        raise ValueError("campo(s) obrigatório(s): " + ", ".join(faltam))
    if not cols:
        raise ValueError("nenhum campo válido para gravar")
    sql = "INSERT INTO " + tabela + " (" + ", ".join(cols) + ") VALUES (" + ", ".join("?" for _ in cols) + ")"
    con = conectar()
    try:
        cur = con.execute(sql, [dados[c] for c in cols])
        con.commit()
        return cur.lastrowid if t["auto"] else {c: dados[c] for c in t["pk"]}
    finally:
        con.close()


def listar(tabela, limite=500):
    """R - READ (todas):  SELECT * FROM tabela"""
    t = _tabela(tabela)
    con = conectar()
    try:
        return [_linha(t, r) for r in con.execute("SELECT * FROM " + tabela + " LIMIT ?", [limite])]
    finally:
        con.close()


def obter(tabela, chave):
    """R - READ (uma):  SELECT * FROM tabela WHERE id = ?"""
    t = _tabela(tabela)
    onde, valores = _onde(t, chave)
    con = conectar()
    try:
        r = con.execute("SELECT * FROM " + tabela + " WHERE " + onde, valores).fetchone()
        return _linha(t, r) if r else None
    finally:
        con.close()


def atualizar(tabela, chave, dados):
    """U - UPDATE:  UPDATE tabela SET coluna = ? WHERE id = ?  -> devolve quantas linhas mudaram."""
    t = _tabela(tabela)
    cols = [c for c in dados if c in t["colunas"] and c not in t["pk"]]
    if not cols:
        raise ValueError("nenhum campo válido para atualizar")
    onde, valores = _onde(t, chave)
    sql = "UPDATE " + tabela + " SET " + ", ".join(c + " = ?" for c in cols) + " WHERE " + onde
    con = conectar()
    try:
        cur = con.execute(sql, [dados[c] for c in cols] + valores)
        con.commit()
        return cur.rowcount
    finally:
        con.close()


def apagar(tabela, chave):
    """D - DELETE:  DELETE FROM tabela WHERE id = ?  (sem o WHERE apagaria TUDO!)"""
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
    """Os tipos de erro que o app.py transforma em mensagem para o visitante."""
    return (sqlite3.IntegrityError, sqlite3.OperationalError)
