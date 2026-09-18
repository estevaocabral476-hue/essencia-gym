# Essência Gym

Loja online de suplementos para quem busca qualidade, preço acessível e praticidade para manter uma rotina de treino consistente.

O projeto combina uma vitrine responsiva em HTML, CSS e JavaScript com uma API em Node.js/Express. O catálogo, os usuários e os pedidos são armazenados em SQLite por meio do `sql.js`.

## Visão geral

### Funcionalidades

- Vitrine de whey protein, creatina e hipercalóricos
- Filtro de produtos por categoria
- Carrinho de compras
- Cadastro e login de clientes
- Autenticação com JWT
- Registro e consulta de pedidos
- Banco SQLite inicializado e populado automaticamente
- Interface responsiva para desktop e dispositivos móveis

### Tecnologias

- **Frontend:** HTML5, CSS3 e JavaScript
- **Backend:** Node.js e Express
- **Banco de dados:** SQLite com `sql.js`
- **Autenticação:** `bcryptjs` e JSON Web Token
- **Hospedagem recomendada:** Reserved VM no Replit

## Estrutura do projeto

```text
.
├── assets/                 # Logo e imagens da loja
├── css/                    # Estilos da vitrine e autenticação
├── js/                     # Lógica do frontend e integração com a API
├── cadastro.html           # Tela de criação de conta
├── index.html              # Página principal da loja
├── login.html              # Tela de login
├── package.json            # Dependências usadas na execução
├── replit.md               # Orientações de execução e publicação
└── server/
    ├── db                 # Inicialização, consultas e persistência do banco
    ├── essencia.db       # Banco SQLite local
    ├── package.json       # Manifesto original do backend
    └── server.js         # Servidor Express e rotas da API
```

## Requisitos

- Node.js 20 ou superior
- npm

## Como executar localmente

Na raiz do projeto, instale as dependências:

```bash
npm install
```

Inicie o servidor:

```bash
node server/server.js
```

Depois, abra [http://localhost:5000](http://localhost:5000).

O mesmo servidor entrega o frontend e a API. Por isso, as chamadas do navegador usam o caminho relativo `/api`, sem depender de um segundo processo ou de uma porta separada.

Para usar outra porta:

```bash
PORT=8080 node server/server.js
```

## API

As rotas abaixo ficam disponíveis a partir de `/api`.

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/produtos` | Lista todos os produtos |
| `GET` | `/api/produtos/:id` | Consulta um produto por ID |
| `GET` | `/api/produtos?categoria=whey` | Filtra produtos por categoria |
| `POST` | `/api/cadastro` | Cria uma conta de cliente |
| `POST` | `/api/login` | Autentica um cliente |
| `POST` | `/api/pedidos` | Registra um pedido |
| `GET` | `/api/pedidos/:id` | Consulta um pedido por ID |

### Exemplo de cadastro

```bash
curl -X POST http://localhost:5000/api/cadastro \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria Silva","email":"maria@example.com","senha":"senha123"}'
```

### Exemplo de login

```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@example.com","senha":"senha123"}'
```

### Exemplo de pedido

```bash
curl -X POST http://localhost:5000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "itens": [
      {
        "produtoId": 1,
        "quantidade": 1,
        "precoUnitario": 129.90
      }
    ],
    "total": 129.90
  }'
```

## Banco de dados

O banco local fica em `server/essencia.db`. Na primeira inicialização, o servidor:

1. Cria as tabelas necessárias caso elas ainda não existam;
2. Insere o catálogo inicial quando a tabela de produtos está vazia;
3. Persiste alterações de usuários e pedidos no arquivo SQLite.

Como o armazenamento é local, a publicação está configurada para Reserved VM. Uma futura migração para autoscaling deve substituir o SQLite por um banco persistente e compartilhado.

## Variáveis de ambiente

| Variável | Obrigatória | Finalidade |
| --- | --- | --- |
| `PORT` | Não | Porta HTTP do servidor; o padrão é `5000` |
| `JWT_SECRET` | Recomendada | Chave usada para assinar tokens de autenticação |
| `SESSION_SECRET` | Alternativa | Chave usada quando `JWT_SECRET` não está definida |

Em ambientes públicos, configure uma chave segura usando os Secrets do Replit. Não coloque chaves reais no código ou no README.

## Publicação no Replit

A configuração atual usa:

- **Tipo:** Reserved VM
- **Build:** `npm install --no-audit`
- **Comando:** `node server/server.js`
- **Porta:** `5000`

No Replit, basta abrir a ferramenta de publicação e clicar em **Publish**. O servidor precisa responder à rota `/` com status HTTP `200`, condição atendida pelo `server/server.js`.

## Licença

Este projeto ainda não define uma licença de distribuição. Adicione um arquivo `LICENSE` antes de publicar o código para reutilização por terceiros.
