# Essência Gym — Loja de Suplementos

Site completo (HTML, CSS, JavaScript) + backend com banco de dados
para a loja de suplementos Essência Gym: whey protein, creatina e
hipercalórico, com carrinho de compras, cadastro/login e registro de
pedidos.

## Estrutura do projeto

```
essencia-gym/
├── index.html          -> página principal da loja (vitrine + carrinho)
├── login.html           -> tela de login
├── cadastro.html         -> tela de criar conta
├── css/
│   ├── login.css         -> estilo base (fornecido por você)
│   └── style.css         -> estilo da loja, estendendo o mesmo visual
├── js/
│   ├── produtos.js        -> catálogo, filtros e carrinho (fala com a API)
│   ├── cadastro.js        -> validação + envio do formulário de cadastro
│   └── login.js           -> validação + envio do formulário de login
├── assets/
│   └── logo-essencia-gym.png
└── server/                -> backend com banco de dados (Node + Express + SQLite)
    ├── server.js
    ├── db.js
    ├── package.json
    └── essencia.db         -> criado automaticamente na 1ª execução
```

## Como abrir só o site (sem banco de dados)

Basta abrir `index.html` no navegador. O site funciona sozinho: se a
API não estiver rodando, ele usa um catálogo de produtos local
(dentro de `js/produtos.js`) e o carrinho é guardado no navegador
(localStorage). Cadastro, login e finalizar pedido, porém, precisam
do backend rodando (passo abaixo).

## Como rodar com o banco de dados (backend completo)

Pré-requisito: [Node.js](https://nodejs.org) instalado (versão 18 ou
mais recente).

```bash
cd server
npm install
npm start
```

Isso vai:
1. Instalar as dependências (Express, SQLite via `sql.js`, bcrypt, JWT) —
   tudo em JavaScript puro, sem precisar compilar nada (nada de Python
   ou Visual Studio Build Tools).
2. Criar automaticamente o arquivo `server/essencia.db` (SQLite) na
   primeira execução, já com as tabelas e os 9 produtos cadastrados.
3. Subir a API em `http://localhost:3000`.

Com o servidor rodando, abra `index.html` normalmente — o site passa
a buscar os produtos do banco, e cadastro, login e "Finalizar
pedido" vão gravar dados reais no SQLite.

### Rotas da API

| Método | Rota                | O que faz                                  |
|--------|----------------------|---------------------------------------------|
| GET    | `/api/produtos`      | lista todos os produtos (filtro `?categoria=whey`) |
| GET    | `/api/produtos/:id`  | detalhe de um produto                       |
| POST   | `/api/cadastro`      | cria um usuário (`nome`, `email`, `senha`)  |
| POST   | `/api/login`         | autentica (`email`, `senha`), devolve token |
| POST   | `/api/pedidos`       | registra um pedido (`itens`, `total`)       |
| GET    | `/api/pedidos/:id`   | consulta um pedido pelo id                  |

### Trocando o SQLite por outro banco

O arquivo `server/db.js` concentra toda a configuração do banco
(usa `sql.js`, um SQLite que roda em WebAssembly puro — não precisa
compilar nada). Para usar MySQL, PostgreSQL ou outro banco, basta
trocar esse arquivo pela sua conexão (ex.: `mysql2`, `pg`) e ajustar
as chamadas em `server.js` — o restante do site continua igual, pois
ele só conversa com a API por `fetch`.

## Personalizar produtos e preços

- **Com backend rodando:** edite o array `catalogoInicial` em
  `server/db.js` antes da primeira execução, ou insira/edite direto
  no banco `essencia.db` (ex.: com [DB Browser for SQLite](https://sqlitebrowser.org/)).
- **Sem backend:** edite o array `PRODUTOS_LOCAIS` em `js/produtos.js`.

## Próximos passos sugeridos

- Página de detalhe do produto e histórico de pedidos do usuário logado.
- Integração com um gateway de pagamento real (Pix, cartão) na finalização do pedido.
- Painel administrativo simples para cadastrar produtos sem mexer no código.
