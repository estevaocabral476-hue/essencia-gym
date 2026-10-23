"""Servidor mínimo (Flask) que publica o site HTML/CSS/JS desta pasta.

Gerado pelo tutor_projeto.py. Seus arquivos do site (index.html, style.css, js/...) não foram alterados.

Como usar:
  teste à mão:  DB_PATH=/tmp/teste.db python3 main.py        (abre em http://127.0.0.1:8000)
  produção:     gunicorn -w 2 -b 127.0.0.1:8000 --no-control-socket main:app   (o serviço systemd faz isso)

Rotas extras:  /saude  (responde ok se o banco funciona)   /api/visitas  ({"total": N} visitas registradas)
O banco SQLite (DB_PATH) guarda só o contador de visitas: serve para você praticar backup e restauração.
"""
import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, abort, jsonify, send_from_directory

BASE = Path(__file__).resolve().parent
DB_PATH = os.environ.get("DB_PATH", str(BASE / "dados-local.db"))

# Só estes tipos de arquivo são entregues; o código Python e os arquivos de configuração ficam fora do site.
EXTENSOES = {".html", ".htm", ".css", ".js", ".mjs", ".json", ".txt", ".md", ".xml", ".map", ".pdf",
             ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".webp", ".avif",
             ".woff", ".woff2", ".ttf", ".otf", ".mp3", ".mp4", ".webm", ".ogg"}
PRIVADOS = {"requirements.txt", "dados-local.db"}
PASTAS_PRIVADAS = {"venv", ".venv", "dados", "__pycache__", "node_modules"}

app = Flask(__name__, static_folder=None)


def conectar():
    return sqlite3.connect(DB_PATH, timeout=5)


def iniciar_banco():
    with conectar() as db:
        db.execute("CREATE TABLE IF NOT EXISTS acessos ("
                   "id INTEGER PRIMARY KEY AUTOINCREMENT, quando TEXT NOT NULL, caminho TEXT NOT NULL)")


def registrar_visita(caminho):
    try:
        with conectar() as db:
            db.execute("INSERT INTO acessos (quando, caminho) VALUES (?, ?)",
                       (datetime.now(timezone.utc).isoformat(timespec="seconds"), caminho[:200]))
    except sqlite3.Error:
        pass        # contar visitas nunca pode derrubar o site


iniciar_banco()     # se o DB_PATH estiver errado o serviço falha ao subir e o erro aparece no journalctl


@app.get("/saude")
def saude():
    with conectar() as db:
        db.execute("SELECT 1")
    return "ok\n", 200, {"Content-Type": "text/plain; charset=utf-8"}


@app.get("/api/visitas")
def visitas():
    with conectar() as db:
        total = db.execute("SELECT COUNT(*) FROM acessos").fetchone()[0]
    return jsonify(total=total)


def permitido(relativo):
    partes = Path(relativo).parts
    if not partes or any(p in ("..",) or p.startswith(".") for p in partes):
        return False
    if partes[0] in PASTAS_PRIVADAS or partes[-1] in PRIVADOS:
        return False
    return Path(relativo).suffix.lower() in EXTENSOES


@app.get("/", defaults={"caminho": ""})
@app.get("/<path:caminho>")
def site(caminho):
    if caminho == "" or (BASE / caminho).is_dir():
        caminho = (caminho.rstrip("/") + "/index.html").lstrip("/")
    if not permitido(caminho) or not (BASE / caminho).is_file():
        abort(404)
    if caminho.endswith((".html", ".htm")):
        registrar_visita("/" + caminho)
    return send_from_directory(BASE, caminho)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000)
