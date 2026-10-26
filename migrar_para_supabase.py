"""Copia os dados do SQLite (dados.db) para o PostgreSQL do Supabase.   Gerado pelo Tutor Front.

Uso (no terminal, na pasta do projeto):
    Linux/macOS:  DATABASE_URL="postgresql://..." python migrar_para_supabase.py
    Windows PS :  $env:DATABASE_URL="postgresql://..."; python migrar_para_supabase.py
A senha do banco fica só nessa variável: não escreva no código nem envie ao GitHub.
"""
import os
import sqlite3
import sys

import psycopg

import db

URL = os.environ.get("DATABASE_URL", "").strip()
if not URL.startswith(("postgres://", "postgresql://")):
    sys.exit("Defina DATABASE_URL com a string de conexão do Supabase (Connect > Session pooler).")

origem = sqlite3.connect(db.PASTA / "dados.db")
origem.row_factory = sqlite3.Row
destino = psycopg.connect(URL, sslmode="require")

ordem = ['usuarios', 'essencia_tokens', 'essencia_usuarios', 'catalogoinicials', 'essencia_carrinhos', 'produtos_locais']  # tabelas na ordem certa: primeiro as que são apontadas por chaves estrangeiras
destino.execute((db.PASTA / "schema_postgres.sql").read_text(encoding="utf-8"))
for nome in ordem:
    t = db.TABELAS[nome]
    colunas = list(t["colunas"])
    linhas = origem.execute("SELECT " + ", ".join(colunas) + " FROM " + nome).fetchall()
    for linha in linhas:
        valores = []
        for c in colunas:
            v = linha[c]
            if t["colunas"][c] == "BOOLEAN" and v is not None:
                v = bool(v)  # SQLite guarda 0/1; o PostgreSQL quer true/false
            valores.append(v)
        destino.execute("INSERT INTO " + nome + " (" + ", ".join(colunas) + ") VALUES (" + ", ".join("%s" for _ in colunas) + ") ON CONFLICT DO NOTHING", valores)
    if t["auto"]:  # ajusta o contador automático (SERIAL) para continuar depois do maior id copiado
        pk = t["auto"][0]
        destino.execute("SELECT setval(pg_get_serial_sequence(%s, %s), COALESCE((SELECT MAX(" + pk + ") FROM " + nome + "), 1))", [nome, pk])
    print(nome + ":", len(linhas), "linha(s) copiada(s)")
destino.commit()
print("Pronto! Confira no Supabase: Table Editor.")
