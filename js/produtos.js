/* ===========================================================
   Essência Gym — Catálogo, filtros e carrinho
   Tenta buscar os produtos da API (banco de dados). Se o
   backend não estiver rodando, usa o catálogo local abaixo,
   então o site funciona sozinho e também com o servidor.
   =========================================================== */

const API_BASE = window.ESSENCIA_API_BASE || 'http://localhost:3000/api';

// Catálogo local (espelha os dados semeados no banco em server/db.js)
const PRODUTOS_LOCAIS = [
    {
        id: 1,
        categoria: 'whey',
        nome: 'Whey Protein Concentrado',
        sabor: 'Chocolate — 900g',
        descricao: '24g de proteína por dose para recuperação muscular no dia a dia. Ótimo custo-benefício para quem treina com constância.',
        preco: 129.90,
        precoAntigo: 149.90,
        selo: 'Mais vendido'
    },
    {
        id: 2,
        categoria: 'whey',
        nome: 'Whey Protein Isolado',
        sabor: 'Baunilha — 900g',
        descricao: 'Baixo teor de lactose e gordura, com absorção rápida. Indicado para quem busca definição e menos inchaço.',
        preco: 179.90,
        precoAntigo: null,
        selo: null
    },
    {
        id: 3,
        categoria: 'whey',
        nome: 'Whey Protein Hidrolisado',
        sabor: 'Morango — 900g',
        descricao: 'Proteína pré-digerida, de absorção ainda mais rápida. Ideal para o pós-treino de quem treina pesado.',
        preco: 199.90,
        precoAntigo: null,
        selo: 'Premium'
    },
    {
        id: 4,
        categoria: 'creatina',
        nome: 'Creatina Monohidratada',
        sabor: 'Sem sabor — 300g',
        descricao: 'Aumenta a força e a explosão nos treinos. 100% pura, sem misturas, com absorção comprovada.',
        preco: 89.90,
        precoAntigo: null,
        selo: null
    },
    {
        id: 5,
        categoria: 'creatina',
        nome: 'Creatina Monohidratada',
        sabor: 'Sem sabor — 500g',
        descricao: 'A mesma fórmula pura em pote maior, com custo por dose mais baixo para quem já faz parte da rotina.',
        preco: 129.90,
        precoAntigo: 149.90,
        selo: 'Economia'
    },
    {
        id: 6,
        categoria: 'creatina',
        nome: 'Creatina Creapure',
        sabor: 'Sem sabor — 300g',
        descricao: 'Creatina alemã de altíssima pureza, com controle rígido de qualidade. Escolha de quem não abre mão de performance.',
        preco: 149.90,
        precoAntigo: null,
        selo: 'Premium'
    },
    {
        id: 7,
        categoria: 'hipercalorico',
        nome: 'Hipercalórico Mass',
        sabor: 'Chocolate — 3kg',
        descricao: 'Carboidratos e proteínas em alta densidade calórica, pensado para quem quer ganhar massa e tem dificuldade de comer o suficiente.',
        preco: 149.90,
        precoAntigo: null,
        selo: null
    },
    {
        id: 8,
        categoria: 'hipercalorico',
        nome: 'Hipercalórico Titanium',
        sabor: 'Baunilha — 3kg',
        descricao: 'Blend de carboidratos de absorção variada com proteína extra, para ganho de peso sem exageros de açúcar.',
        preco: 169.90,
        precoAntigo: 189.90,
        selo: 'Oferta'
    },
    {
        id: 9,
        categoria: 'hipercalorico',
        nome: 'Hipercalórico Extreme Gainer',
        sabor: 'Cookies — 3kg',
        descricao: 'Mais calórico da linha, indicado para biotipos que têm muita dificuldade de ganhar peso mesmo comendo bastante.',
        preco: 189.90,
        precoAntigo: null,
        selo: 'Mais calorias'
    }
];

const NOMES_CATEGORIA = {
    whey: 'Whey Protein',
    creatina: 'Creatina',
    hipercalorico: 'Hipercalórico'
};

const estado = {
    produtos: [],
    filtroAtivo: 'todos',
    carrinho: carregarCarrinho()
};

/* ---------- Utilidades ---------- */

function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function carregarCarrinho() {
    try {
        const salvo = localStorage.getItem('essencia_carrinho');
        return salvo ? JSON.parse(salvo) : [];
    } catch (erro) {
        return [];
    }
}

function salvarCarrinho() {
    try {
        localStorage.setItem('essencia_carrinho', JSON.stringify(estado.carrinho));
    } catch (erro) {
        console.error('Não foi possível salvar o carrinho:', erro);
    }
}

function mostrarToast(mensagem) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = mensagem;
    toast.classList.add('mostrar');

    clearTimeout(mostrarToast._timer);
    mostrarToast._timer = setTimeout(() => {
        toast.classList.remove('mostrar');
    }, 2200);
}

/* ---------- Busca de produtos (API com fallback local) ---------- */

async function buscarProdutos() {
    try {
        const resposta = await fetch(`${API_BASE}/produtos`);
        if (!resposta.ok) throw new Error('Falha ao buscar produtos da API');

        const dados = await resposta.json();
        estado.produtos = dados;
    } catch (erro) {
        console.warn('API indisponível, usando catálogo local:', erro.message);
        estado.produtos = PRODUTOS_LOCOS_OU_LOCAIS();
    }

    renderizarProdutos();
}

function PRODUTOS_LOCOS_OU_LOCAIS() {
    return PRODUTOS_LOCAIS;
}

/* ---------- Renderização da vitrine ---------- */

function renderizarProdutos() {
    const grade = document.getElementById('grade-produtos');
    if (!grade) return;

    const lista = estado.filtroAtivo === 'todos'
        ? estado.produtos
        : estado.produtos.filter(p => p.categoria === estado.filtroAtivo);

    grade.innerHTML = '';

    if (lista.length === 0) {
        grade.innerHTML = '<p style="color: var(--cinza-texto);">Nenhum produto encontrado nesta categoria.</p>';
        return;
    }

    lista.forEach(produto => {
        grade.appendChild(criarCartaoProduto(produto));
    });
}

// Cor de destaque conforme o sabor do produto (usada no selo do pote e no rótulo)
function corDoSabor(sabor) {
    const texto = sabor.toLowerCase();

    if (texto.includes('chocolate') || texto.includes('cookies')) return '#8a5a3a';
    if (texto.includes('morango')) return '#c26b6b';
    if (texto.includes('baunilha')) return '#e3d3a0';
    if (texto.includes('sem sabor')) return '#b9b2a0';

    return '#9c8558';
}

// Ícones ilustrados próprios (SVG), um desenho por categoria, para não
// depender de fotos de produtos de terceiros
function iconeCategoria(categoria, corSabor) {
    const overlay = {
        whey: `
            <g stroke="var(--bege-forte)" stroke-width="2.4" stroke-linecap="round">
                <circle cx="42" cy="56" r="4.2" fill="var(--bege-forte)" stroke="none" />
                <circle cx="58" cy="56" r="4.2" fill="var(--bege-forte)" stroke="none" />
                <circle cx="50" cy="44" r="4.2" fill="var(--bege-forte)" stroke="none" />
                <line x1="43" y1="53" x2="49" y2="47" />
                <line x1="57" y1="53" x2="51" y2="47" />
            </g>
        `,
        creatina: `
            <polygon points="53,38 43,58 49,58 45,74 63,52 55,52 59,38"
                fill="var(--bege-forte)" stroke="none" />
        `,
        hipercalorico: `
            <path d="M50 38 C45 47 39 52 39 61 C39 70 44 76 50 76 C56 76 61 70 61 61
                     C61 56 58 52 56 48 C56 54 52 56 50 53 C48 49 49 43 50 38 Z"
                fill="var(--bege-forte)" stroke="none" />
        `
    };

    return `
        <svg viewBox="0 0 100 100" width="72" height="72" fill="none">
            <ellipse cx="50" cy="30" rx="21" ry="7" fill="${corSabor}" opacity="0.9" />
            <path d="M29 30 L29 79 Q29 85 50 85 Q71 85 71 79 L71 30"
                stroke="var(--bronze)" stroke-width="2.2" fill="var(--preto)" />
            <ellipse cx="50" cy="30" rx="21" ry="7" stroke="var(--bronze)" stroke-width="2.2" fill="none" />
            <ellipse cx="50" cy="22" rx="13" ry="4.5" fill="var(--preto-carta)" stroke="var(--bronze)" stroke-width="2" />
            ${overlay[categoria] || overlay.whey}
        </svg>
    `;
}

function criarCartaoProduto(produto) {
    const cartao = document.createElement('article');
    cartao.className = 'cartao-produto';

    const temPromocao = produto.precoAntigo && produto.precoAntigo > produto.preco;
    const corSabor = corDoSabor(produto.sabor);

    cartao.innerHTML = `
        <div class="imagem-produto">
            ${produto.selo ? `<span class="selo-produto">${produto.selo}</span>` : ''}
            ${iconeCategoria(produto.categoria, corSabor)}
        </div>
        <div class="corpo-produto">
            <span class="categoria-produto">${NOMES_CATEGORIA[produto.categoria] || produto.categoria}</span>
            <h3 class="nome-produto">${produto.nome}</h3>
            <span class="sabor-produto">${produto.sabor}</span>
            <p class="descricao-produto">${produto.descricao}</p>
            <div class="rodape-produto">
                <div class="preco-produto">
                    ${temPromocao ? `<span class="de">${formatarPreco(produto.precoAntigo)}</span>` : ''}
                    <span class="por">${formatarPreco(produto.preco)}</span>
                    <span class="parcelas">ou 3x de ${formatarPreco(produto.preco / 3)}</span>
                </div>
                <button class="botao-adicionar" data-id="${produto.id}">
                    Adicionar
                </button>
            </div>
        </div>
    `;

    return cartao;
}

/* ---------- Filtros de categoria ---------- */

function iniciarFiltros() {
    const botoes = document.querySelectorAll('.filtro-botao');

    botoes.forEach(botao => {
        botao.addEventListener('click', () => {
            botoes.forEach(b => b.classList.remove('ativo'));
            botao.classList.add('ativo');

            estado.filtroAtivo = botao.dataset.filtro;
            renderizarProdutos();
        });
    });
}

/* ---------- Carrinho ---------- */

function adicionarAoCarrinho(idProduto) {
    const produto = estado.produtos.find(p => String(p.id) === String(idProduto));
    if (!produto) return;

    const itemExistente = estado.carrinho.find(item => String(item.id) === String(idProduto));

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        estado.carrinho.push({
            id: produto.id,
            nome: produto.nome,
            sabor: produto.sabor,
            preco: produto.preco,
            quantidade: 1
        });
    }

    salvarCarrinho();
    atualizarContadorCarrinho();
    renderizarCarrinho();
    mostrarToast(`${produto.nome} adicionado ao carrinho`);
}

function alterarQuantidade(idProduto, delta) {
    const item = estado.carrinho.find(i => String(i.id) === String(idProduto));
    if (!item) return;

    item.quantidade += delta;

    if (item.quantidade <= 0) {
        estado.carrinho = estado.carrinho.filter(i => String(i.id) !== String(idProduto));
    }

    salvarCarrinho();
    atualizarContadorCarrinho();
    renderizarCarrinho();
}

function removerDoCarrinho(idProduto) {
    estado.carrinho = estado.carrinho.filter(i => String(i.id) !== String(idProduto));
    salvarCarrinho();
    atualizarContadorCarrinho();
    renderizarCarrinho();
}

function calcularSubtotal() {
    return estado.carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
}

function atualizarContadorCarrinho() {
    const contador = document.getElementById('contador-carrinho');
    if (!contador) return;

    const totalItens = estado.carrinho.reduce((total, item) => total + item.quantidade, 0);
    contador.textContent = totalItens;
    contador.style.display = totalItens > 0 ? 'flex' : 'none';
}

function renderizarCarrinho() {
    const lista = document.getElementById('itens-carrinho');
    const subtotalEl = document.getElementById('valor-subtotal');
    if (!lista || !subtotalEl) return;

    if (estado.carrinho.length === 0) {
        lista.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio.<br>Adicione um whey, uma creatina ou um hipercalórico.</p>';
        subtotalEl.textContent = formatarPreco(0);
        return;
    }

    lista.innerHTML = '';

    estado.carrinho.forEach(item => {
        const linha = document.createElement('div');
        linha.className = 'item-carrinho';

        const produtoRef = estado.produtos.find(p => String(p.id) === String(item.id));
        const categoriaItem = produtoRef ? produtoRef.categoria : 'whey';
        const corSaborItem = corDoSabor(item.sabor);

        linha.innerHTML = `
            <div class="miniatura-item">${iconeCategoria(categoriaItem, corSaborItem)}</div>
            <div class="detalhe-item">
                <h4>${item.nome}</h4>
                <span>${item.sabor}</span>
                <div class="controle-qtd">
                    <button data-acao="diminuir" data-id="${item.id}">−</button>
                    <span>${item.quantidade}</span>
                    <button data-acao="aumentar" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="preco-item-carrinho">
                <span>${formatarPreco(item.preco * item.quantidade)}</span>
                <button class="remover-item" data-acao="remover" data-id="${item.id}">remover</button>
            </div>
        `;

        lista.appendChild(linha);
    });

    subtotalEl.textContent = formatarPreco(calcularSubtotal());
}

function iniciarCarrinho() {
    const botaoAbrir = document.getElementById('botao-abrir-carrinho');
    const botaoFechar = document.getElementById('fechar-carrinho');
    const fundo = document.getElementById('fundo-carrinho');
    const painel = document.getElementById('painel-carrinho');
    const botaoFinalizar = document.getElementById('botao-finalizar');

    function abrir() {
        painel.classList.add('aberto');
        fundo.classList.add('aberto');
    }

    function fechar() {
        painel.classList.remove('aberto');
        fundo.classList.remove('aberto');
    }

    if (botaoAbrir) botaoAbrir.addEventListener('click', abrir);
    if (botaoFechar) botaoFechar.addEventListener('click', fechar);
    if (fundo) fundo.addEventListener('click', fechar);

    document.addEventListener('click', (evento) => {
        const botaoAdicionar = evento.target.closest('.botao-adicionar');
        if (botaoAdicionar) {
            adicionarAoCarrinho(botaoAdicionar.dataset.id);
            abrir();
            return;
        }

        const acaoBotao = evento.target.closest('[data-acao]');
        if (acaoBotao) {
            const { acao, id } = acaoBotao.dataset;
            if (acao === 'aumentar') alterarQuantidade(id, 1);
            if (acao === 'diminuir') alterarQuantidade(id, -1);
            if (acao === 'remover') removerDoCarrinho(id);
        }
    });

    if (botaoFinalizar) {
        botaoFinalizar.addEventListener('click', finalizarPedido);
    }

    atualizarContadorCarrinho();
    renderizarCarrinho();
}

/* ---------- Finalizar pedido (grava no banco via API) ---------- */

async function finalizarPedido() {
    if (estado.carrinho.length === 0) {
        mostrarToast('Seu carrinho está vazio');
        return;
    }

    const botaoFinalizar = document.getElementById('botao-finalizar');
    const textoOriginal = botaoFinalizar.textContent;
    botaoFinalizar.textContent = 'Enviando...';
    botaoFinalizar.disabled = true;

    const pedido = {
        itens: estado.carrinho.map(item => ({
            produtoId: item.id,
            quantidade: item.quantidade,
            precoUnitario: item.preco
        })),
        total: calcularSubtotal()
    };

    try {
        const token = localStorage.getItem('essencia_token');

        const resposta = await fetch(`${API_BASE}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(pedido)
        });

        if (!resposta.ok) throw new Error('Falha ao registrar pedido');

        const dados = await resposta.json();

        estado.carrinho = [];
        salvarCarrinho();
        atualizarContadorCarrinho();
        renderizarCarrinho();

        mostrarToast(`Pedido #${dados.id} recebido com sucesso!`);
    } catch (erro) {
        console.error(erro);
        mostrarToast('Não foi possível enviar o pedido. Rode o servidor (server/) e tente novamente.');
    } finally {
        botaoFinalizar.textContent = textoOriginal;
        botaoFinalizar.disabled = false;
    }
}

/* ---------- Inicialização ---------- */

document.addEventListener('DOMContentLoaded', () => {
    iniciarFiltros();
    iniciarCarrinho();
    buscarProdutos();
});
