// ===========================================================
// Essência Gym — Servidor da API (Express + SQLite via sql.js)
//
// Endpoints:
//   GET  /api/produtos            -> lista o catálogo
//   GET  /api/produtos/:id        -> detalhe de um produto
//   POST /api/cadastro            -> cria um usuário
//   POST /api/login               -> autentica um usuário
//   POST /api/pedidos             -> registra um pedido (auth opcional)
//   GET  /api/pedidos/:id         -> consulta um pedido
//
// Para rodar:
//   cd server
//   npm install
//   npm start
// ===========================================================

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { abrirBanco, todos, um, executar } = require('./db');

const PORTA = process.env.PORT || 3000;
const CHAVE_JWT = process.env.JWT_SECRET || 'essencia-gym-chave-de-desenvolvimento';

/* ---------- Utilidades ---------- */

function formatarProduto(linha) {
    return {
        id: linha.id,
        categoria: linha.categoria,
        nome: linha.nome,
        sabor: linha.sabor,
        descricao: linha.descricao,
        preco: linha.preco,
        precoAntigo: linha.preco_antigo,
        selo: linha.selo,
        estoque: linha.estoque
    };
}

function autenticacaoOpcional(req, _res, next) {
    const cabecalho = req.headers.authorization;

    if (cabecalho && cabecalho.startsWith('Bearer ')) {
        try {
            const token = cabecalho.replace('Bearer ', '');
            req.usuario = jwt.verify(token, CHAVE_JWT);
        } catch (erro) {
            // token inválido ou expirado: segue sem usuário autenticado
        }
    }

    next();
}

/* ---------- Inicialização ---------- */

async function iniciar() {
    const db = await abrirBanco();

    const app = express();
    app.use(cors());
    app.use(express.json());

    /* ---------- Produtos ---------- */

    app.get('/api/produtos', (req, res) => {
        const { categoria } = req.query;

        const linhas = categoria
            ? todos(db, 'SELECT * FROM produtos WHERE categoria = ? ORDER BY id', [categoria])
            : todos(db, 'SELECT * FROM produtos ORDER BY id');

        res.json(linhas.map(formatarProduto));
    });

    app.get('/api/produtos/:id', (req, res) => {
        const linha = um(db, 'SELECT * FROM produtos WHERE id = ?', [req.params.id]);

        if (!linha) {
            return res.status(404).json({ erro: 'Produto não encontrado.' });
        }

        res.json(formatarProduto(linha));
    });

    /* ---------- Cadastro ---------- */

    app.post('/api/cadastro', async (req, res) => {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: 'Preencha nome, e-mail e senha.' });
        }

        if (senha.length < 6) {
            return res.status(400).json({ erro: 'A senha precisa ter no mínimo 6 caracteres.' });
        }

        const emailNormalizado = email.trim().toLowerCase();
        const existente = um(db, 'SELECT id FROM usuarios WHERE email = ?', [emailNormalizado]);

        if (existente) {
            return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const resultado = executar(db, `
            INSERT INTO usuarios (nome, email, senha_hash)
            VALUES (?, ?, ?)
        `, [nome.trim(), emailNormalizado, senhaHash]);

        const usuario = { id: resultado.lastInsertRowid, nome: nome.trim(), email: emailNormalizado };
        const token = jwt.sign(usuario, CHAVE_JWT, { expiresIn: '7d' });

        res.status(201).json({ usuario, token });
    });

    /* ---------- Login ---------- */

    app.post('/api/login', async (req, res) => {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: 'Informe e-mail e senha.' });
        }

        const linha = um(db, 'SELECT * FROM usuarios WHERE email = ?', [email.trim().toLowerCase()]);

        if (!linha) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
        }

        const senhaConfere = await bcrypt.compare(senha, linha.senha_hash);

        if (!senhaConfere) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
        }

        const usuario = { id: linha.id, nome: linha.nome, email: linha.email };
        const token = jwt.sign(usuario, CHAVE_JWT, { expiresIn: '7d' });

        res.json({ usuario, token });
    });

    /* ---------- Pedidos ---------- */

    app.post('/api/pedidos', autenticacaoOpcional, (req, res) => {
        const { itens, total } = req.body;

        if (!Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({ erro: 'O pedido precisa ter pelo menos um item.' });
        }

        const usuarioId = req.usuario ? req.usuario.id : null;

        try {
            const resultadoPedido = executar(db, `
                INSERT INTO pedidos (usuario_id, total, status)
                VALUES (?, ?, 'pendente')
            `, [usuarioId, total]);

            const pedidoId = resultadoPedido.lastInsertRowid;

            itens.forEach(item => {
                executar(db, `
                    INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario)
                    VALUES (?, ?, ?, ?)
                `, [pedidoId, item.produtoId, item.quantidade, item.precoUnitario]);
            });

            res.status(201).json({ id: pedidoId, status: 'pendente' });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: 'Não foi possível registrar o pedido.' });
        }
    });

    app.get('/api/pedidos/:id', (req, res) => {
        const pedido = um(db, 'SELECT * FROM pedidos WHERE id = ?', [req.params.id]);

        if (!pedido) {
            return res.status(404).json({ erro: 'Pedido não encontrado.' });
        }

        const itens = todos(db, `
            SELECT itens_pedido.*, produtos.nome, produtos.sabor
            FROM itens_pedido
            JOIN produtos ON produtos.id = itens_pedido.produto_id
            WHERE pedido_id = ?
        `, [req.params.id]);

        res.json({ ...pedido, itens });
    });

    app.listen(PORTA, () => {
        console.log(`Servidor da Essência Gym rodando em http://localhost:${PORTA}`);
        console.log(`Banco de dados salvo em server/essencia.db`);
    });
}

iniciar().catch(erro => {
    console.error('Não foi possível iniciar o servidor:', erro);
    process.exit(1);
});
