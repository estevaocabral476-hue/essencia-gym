"""Seu PRIMEIRO CRUD, passo a passo, na tabela "usuarios".   Rode:  python exemplo_crud.py
CRUD = Create (criar), Read (ler), Update (atualizar), Delete (apagar): as 4 operações básicas de qualquer sistema.
"""
import db

db.iniciar()  # cria as tabelas se ainda não existirem

# C - CREATE: guarda um registro novo (INSERT INTO ...).
novo_id = db.criar("usuarios", {"nome": 'nome de exemplo 1', "email": 'pessoa1@exemplo.com', "criado_em": '2025-01-01 10:00:00'})
print("C - criei o registro de id", novo_id)

# R - READ: busca o registro (SELECT ... WHERE id = ?) e depois todos (SELECT *).
print("R - um registro:", db.obter("usuarios", {"id": novo_id}))
print("R - todos:", db.listar("usuarios"))

# U - UPDATE: muda o campo "nome" só desse registro (UPDATE ... SET ... WHERE id = ?).
db.atualizar("usuarios", {"id": novo_id}, {"nome": 'nome de exemplo 2'})
print("U - depois de atualizar:", db.obter("usuarios", {"id": novo_id}))

# D - DELETE: apaga só esse registro (DELETE FROM ... WHERE id = ?). Sem o WHERE apagaria a tabela inteira!
db.apagar("usuarios", {"id": novo_id})
print("D - depois de apagar, sobraram:", len(db.listar("usuarios")), "registro(s)")
