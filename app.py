"""Back-end Flask: serve o seu site e oferece uma API JSON para o banco de dados.  Gerado pelo Tutor Front.

Como funciona (leia de cima para baixo):
  1. O navegador abre o site (HTML, CSS, JS) - o Flask só entrega os arquivos.
  2. O JavaScript chama /api/<tabela> com fetch().
  3. O Flask valida o pedido e usa o db.py para ler/gravar no banco.
  4. O Flask responde em JSON e o JavaScript atualiza a tela.

Rodar no seu computador:   python app.py     (abre em http://127.0.0.1:5000)
Rodar na internet (Render): gunicorn app:app
"""
import hmac
import os
from pathlib import Path

from flask import Flask, abort, jsonify, request, send_from_directory
from werkzeug.security import generate_password_hash

import db

PASTA = Path(__file__).resolve().parent
app = Flask(__name__, static_folder=None)  # os arquivos do site são entregues pela rota abaixo, com lista de permissões

# Tabelas que qualquer visitante pode LISTAR (ex.: produtos do catálogo). As demais só o administrador lê.
LEITURA_PUBLICA = ['essencia_tokens', 'catalogoinicials', 'essencia_carrinhos', 'produtos_locais']

EXT_PERMITIDAS = {".html", ".css", ".js", ".mjs", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif", ".ico",
                  ".woff", ".woff2", ".ttf", ".json", ".txt", ".xml", ".webmanifest"}
PASTAS_PROIBIDAS = {"venv", "__pycache__", "node_modules", "modelagem", "docs", "tests", "instance"}
ARQUIVOS_PROIBIDOS = {"requirements.txt"}

db.iniciar()


def eh_admin():
    """Admin = quem manda o cabeçalho X-Admin-Token certo. Sem ADMIN_TOKEN definido, só vale no seu computador (localhost)."""
    token = os.environ.get("ADMIN_TOKEN", "")
    if token:
        return hmac.compare_digest(request.headers.get("X-Admin-Token", ""), token)
    return request.remote_addr in ("127.0.0.1", "::1")


def exigir_admin():
    if not eh_admin():
        abort(401, "Área do administrador: informe o token (ADMIN_TOKEN).")


def tabela_ou_404(nome):
    if nome not in db.TABELAS:
        abort(404, "Tabela não existe.")
    return db.TABELAS[nome]


def chave_da_url(t, valor):
    """Tabelas com chave primária simples usam /api/<tabela>/<id>."""
    if len(t["pk"]) != 1:
        abort(400, "Esta tabela tem chave composta: use ?" + "&".join(c + "=..." for c in t["pk"]))
    pk = t["pk"][0]
    return {pk: int(valor) if t["colunas"][pk] == "INTEGER" and valor.lstrip("-").isdigit() else valor}


def chave_da_consulta(t):
    chave = {c: request.args.get(c) for c in t["pk"]}
    if None in chave.values():
        abort(400, "Informe a chave: " + ", ".join(t["pk"]))
    return chave


def preparar(t, dados):
    """Converte tipos, troca 'senha' por hash e descarta campos que não existem na tabela."""
    if not isinstance(dados, dict):
        abort(400, "Envie um objeto JSON.")
    limpo, ignorados = {}, []
    for nome, valor in dados.items():
        if nome == "senha" and "senha_hash" in t["colunas"]:
            if valor:
                limpo["senha_hash"] = generate_password_hash(str(valor))
            continue
        if nome not in t["colunas"]:
            ignorados.append(nome)
            continue
        tipo = t["colunas"][nome]
        if valor == "":
            valor = None
        try:
            if valor is not None and tipo == "INTEGER":
                valor = int(valor)
            elif valor is not None and tipo == "REAL":
                valor = float(str(valor).replace(",", "."))
            elif valor is not None and tipo == "BOOLEAN":
                valor = 1 if str(valor).lower() in ("1", "true", "on", "sim") else 0
        except ValueError:
            abort(400, "O campo " + nome + " deve ser do tipo " + tipo + ".")
        limpo[nome] = valor
    return limpo, ignorados


@app.errorhandler(400)
@app.errorhandler(401)
@app.errorhandler(404)
def erro_http(e):
    return jsonify({"ok": False, "erro": e.description}), e.code


@app.after_request
def cabecalhos(resp):
    resp.headers["X-Content-Type-Options"] = "nosniff"
    if request.path.startswith("/api/"):
        resp.headers["Cache-Control"] = "no-store"
    return resp


# ---------------------------------------------------------------- API (CRUD)
@app.get("/api/_esquema")
def esquema():
    visivel = eh_admin()
    saida = {}
    for nome, t in db.TABELAS.items():
        saida[nome] = {"colunas": {c: tp for c, tp in t["colunas"].items() if c not in t["ocultas"]}, "pk": t["pk"], "auto": t["auto"],
                       "obrigatorias": t["obrigatorias"], "leitura_publica": nome in LEITURA_PUBLICA}
    return jsonify({"ok": True, "admin": visivel, "banco": "postgresql" if getattr(db, "USA_PG", False) else "sqlite", "tabelas": saida})


@app.get("/api/<tabela>")
def listar(tabela):
    tabela_ou_404(tabela)
    if tabela not in LEITURA_PUBLICA:
        exigir_admin()
    return jsonify({"ok": True, "dados": db.listar(tabela)})


@app.post("/api/<tabela>")
def criar(tabela):
    t = tabela_ou_404(tabela)  # criar é público: é o que os formulários do site usam
    dados, ignorados = preparar(t, request.get_json(silent=True))
    try:
        novo = db.criar(tabela, dados)
    except ValueError as e:
        abort(400, str(e))
    except db.erro_do_banco() as e:
        abort(400, "O banco recusou os dados (campo repetido ou ligação inválida): " + str(e))
    return jsonify({"ok": True, "id": novo, "ignorados": ignorados}), 201


@app.get("/api/<tabela>/<valor>")
def obter(tabela, valor):
    t = tabela_ou_404(tabela)
    if tabela not in LEITURA_PUBLICA:
        exigir_admin()
    linha = db.obter(tabela, chave_da_url(t, valor))
    if linha is None:
        abort(404, "Não encontrei esse registro.")
    return jsonify({"ok": True, "dados": linha})


@app.put("/api/<tabela>/<valor>")
def atualizar(tabela, valor):
    exigir_admin()
    t = tabela_ou_404(tabela)
    dados, _ = preparar(t, request.get_json(silent=True))
    try:
        mudou = db.atualizar(tabela, chave_da_url(t, valor), dados)
    except ValueError as e:
        abort(400, str(e))
    except db.erro_do_banco() as e:
        abort(400, "O banco recusou os dados: " + str(e))
    if not mudou:
        abort(404, "Não encontrei esse registro.")
    return jsonify({"ok": True})


@app.delete("/api/<tabela>/<valor>")
def apagar_um(tabela, valor):
    exigir_admin()
    t = tabela_ou_404(tabela)
    try:
        apagou = db.apagar(tabela, chave_da_url(t, valor))
    except db.erro_do_banco() as e:
        abort(400, "Não deu para apagar (outra tabela depende deste registro): " + str(e))
    if not apagou:
        abort(404, "Não encontrei esse registro.")
    return jsonify({"ok": True})


@app.delete("/api/<tabela>")
def apagar_composta(tabela):
    exigir_admin()
    t = tabela_ou_404(tabela)
    try:
        apagou = db.apagar(tabela, chave_da_consulta(t))
    except db.erro_do_banco() as e:
        abort(400, "Não deu para apagar: " + str(e))
    return jsonify({"ok": bool(apagou)})


# ---------------------------------------------------------------- site estático
@app.get("/")
def inicio():
    return send_from_directory(PASTA, "index.html")


@app.get("/<path:caminho>")
def arquivos(caminho):
    partes = Path(caminho).parts
    if any(p.startswith(".") or p in PASTAS_PROIBIDAS for p in partes) or Path(caminho).name in ARQUIVOS_PROIBIDOS:
        abort(404)
    if (PASTA / caminho).is_dir():
        caminho = caminho.rstrip("/") + "/index.html"
    if Path(caminho).suffix.lower() not in EXT_PERMITIDAS:
        abort(404)
    if not (PASTA / caminho).is_file():
        nao = PASTA / "404.html"
        if nao.is_file():
            return send_from_directory(PASTA, "404.html"), 404
        abort(404)
    return send_from_directory(PASTA, caminho)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", "5000")), debug=False)
