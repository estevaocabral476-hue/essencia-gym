# Relatório de qualidade — gym

Gerado pelo tutor em 23/10/2026.

| Categoria | Nota |
|---|---|
| HTML | 86 (antes: 86) |
| CSS | 98 (antes: 98) |
| Responsivo | 98 (antes: 98) |
| Acessibilidade | 76 (antes: 76) |
| SEO | 88 (antes: 88) |
| JavaScript | 68 (antes: 68) |
| Desempenho | 91 (antes: 91) |
| Publicação | 72 (antes: 66) |
| **Geral** | **85** (antes: 84) |

Erros: 5 · Avisos: 20 · Dicas: 18

## [C14] Contraste insuficiente entre texto e fundo (erro)

**Por quê:** Texto com contraste baixo é ilegível ao sol, em telas ruins e para quem tem baixa visão. A WCAG exige pelo menos 4,5:1 para texto normal.

**Como corrigir:** Escureça o texto ou clareie o fundo (o tutor mostra a razão calculada). Teste em webaim.org/resources/contrastchecker.

Onde: css/login.css:105 (.painel-marca .frase: #8a8578 sobre #ffffff = 3.68:1)

## [J03] innerHTML com conteúdo variável (risco de XSS) (erro)

**Por quê:** Se o texto vier do usuário (um campo, a URL, uma API), ele pode conter <script> ou <img onerror=...> e executar código no navegador de outras pessoas.

**Como corrigir:** Use textContent para texto e createElement/appendChild (como no JS Relâmpago). Se precisar mesmo de HTML, sanitize (DOMPurify).

Onde: js/produtos.js:233 (cartao.innerHTML = `)

## [S12] Link para localhost / 127.0.0.1 (erro)

**Por quê:** Aponta para o computador de quem visita, não para o seu.

**Como corrigir:** Troque por caminho relativo ou pelo endereço real publicado.

Onde: js/cadastro.js:1 (http://localhost:3000/api); js/login.js:1 (http://localhost:3000/api); js/produtos.js:1 (http://localhost:3000/api)

## [E01] Falta <meta name="description"> (aviso)

**Por quê:** É o resumo que o Google mostra abaixo do título nos resultados.

**Como corrigir:** <meta name="description" content="Resumo de 120 a 160 caracteres.">

Onde: cadastro.html; index.html; login.html

## [H08] Faltam áreas semânticas (header, nav, main, footer) (aviso)

**Por quê:** Essas tags dizem o PAPEL de cada região. Com elas, quem usa teclado ou leitor de tela salta direto para o conteúdo principal.

**Como corrigir:** Estruture: <header> (topo), <nav> (menu), <main> (conteúdo, só um), <footer> (rodapé).

Onde: cadastro.html (faltam: header, nav, footer); index.html (faltam: main); login.html (faltam: header, nav, footer)

## [H15] Link sem destino útil (<a> sem href ou href="#") (aviso)

**Por quê:** Link sem href não é focável pelo teclado; href="#" leva ao topo da página e engana o usuário.

**Como corrigir:** Use um destino real. Se a ação não navega (abre menu, salva...), o certo é <button type="button">.

Onde: login.html:108 (href="#")

## [H19] Campo de formulário sem atributo name (aviso)

**Por quê:** Sem name, o valor não é enviado no formulário e fica difícil ler com FormData.

**Como corrigir:** Adicione name="..." a cada input, select e textarea.

Onde: login.html:104

## [J05] Eventos escritos no HTML (onclick="...") (aviso)

**Por quê:** Mistura HTML com lógica, só aceita funções globais e não permite vários ouvintes.

**Como corrigir:** No JS: elemento.addEventListener('click', funcao).

Onde: login.html:121 (onclick em <button>)

## [J08] Função muito longa (> 40 linhas) (aviso)

**Por quê:** Função grande faz muitas coisas, é difícil de testar e de entender.

**Como corrigir:** Quebre em funções pequenas com UM trabalho cada (ler dados, validar, criar elemento, salvar).

Onde: js/cadastro.js:3 ((anônima): 109 linhas); js/db.js:7 (abrirBanco: 55 linhas); js/login.js:3 ((anônima): 87 linhas); js/produtos.js:332 (renderizarCarrinho: 43 linhas); server/server.js:60 (iniciar: 144 linhas)

## [S05] Âncora (#id) que não existe na página (aviso)

**Por quê:** O link não leva a lugar nenhum.

**Como corrigir:** Confira se existe um elemento com o id exato citado no href.

Onde: index.html:35 (#whey em index.html); index.html:36 (#creatina em index.html); index.html:37 (#hipercalorico em index.html); index.html:167 (#whey em index.html); index.html:168 (#creatina em index.html); index.html:169 (#hipercalorico em index.html)

## [C08] z-index muito alto (dica)

**Por quê:** Números mágicos (999, 9999) viram uma corrida armamentista entre componentes.

**Como corrigir:** Defina uma escala em variáveis (--z-menu: 10; --z-modal: 20).

Onde: css/style.css:709 (z-index: 100)

## [C11] Media queries só com max-width (desktop-first) (dica)

**Por quê:** Desktop-first obriga a desfazer estilos no celular; mobile-first costuma gerar CSS menor e mais simples.

**Como corrigir:** Escreva o estilo base para telas pequenas e use min-width para acrescentar o que é preciso em telas maiores.

Onde: css/login.css:367

## [C19] Texto pequeno demais (< 0,875rem) (dica)

**Por quê:** Abaixo de ~14px o texto cansa e exclui quem enxerga pior.

**Como corrigir:** Use pelo menos 1rem para texto corrido e 0.875rem para textos de apoio.

Onde: css/login.css:105 (.painel-marca .frase: 11px)

## [E03] Falta Open Graph (og:title, og:description, og:image) (dica)

**Por quê:** É o que aparece quando alguém compartilha o link no WhatsApp, LinkedIn, Discord...

**Como corrigir:** <meta property="og:title" content="...">  <meta property="og:image" content="https://.../capa.png">

Onde: cadastro.html; index.html; login.html

## [E04] Falta favicon (dica)

**Por quê:** O ícone da aba dá identidade ao site; sem ele o navegador faz uma requisição que dá erro 404.

**Como corrigir:** <link rel="icon" href="favicon.svg" type="image/svg+xml">

Onde: index.html

## [H27] Falta um link 'pular para o conteúdo' (dica)

**Por quê:** Quem navega por teclado teria que passar por todo o menu em cada página.

**Como corrigir:** Primeiro elemento do body: <a class="pular" href="#conteudo">Pular para o conteúdo</a> (visível só ao receber foco).

Onde: index.html

## [J07] alert / prompt / confirm (dica)

**Por quê:** Bloqueiam a página, não combinam com o seu design e são ruins no celular. Servem para aprender, não para produção.

**Como corrigir:** Mostre mensagens na própria página (um <p role="status"> como no JS Relâmpago) ou use <dialog>.

Onde: js/cadastro.js:102 (alert); js/login.js:81 (alert)

## [P03] Imagem sem width e height (dica)

**Por quê:** O navegador não sabe o espaço da imagem, e o texto 'pula' quando ela carrega (CLS).

**Como corrigir:** <img src="..." alt="..." width="800" height="450">  +  img { height: auto; max-width: 100%; }

Onde: cadastro.html:24 (1 de 1 imagens); index.html:25 (3 de 3 imagens); login.html:24 (1 de 1 imagens)

## [P04] Imagens sem loading="lazy" (dica)

**Por quê:** Imagens fora da primeira tela podem esperar o usuário rolar.

**Como corrigir:** Adicione loading="lazy" nas imagens abaixo da dobra (não na primeira).

Onde: index.html:80

## [P06] Fonte do Google sem display=swap (dica)

**Por quê:** Sem swap o texto fica invisível até a fonte chegar (FOIT).

**Como corrigir:** Termine a URL com &display=swap.

Onde: cadastro.html:10; index.html:10; login.html:10

## [P09] Imagens PNG/JPG grandes sem alternativa moderna (dica)

**Por quê:** WebP/AVIF costumam ter 25–50% do tamanho com a mesma qualidade.

**Como corrigir:** Converta (squoosh.app) e, se quiser compatibilidade total, use <picture> (veja o material de HTML).

Onde: assets/logo-essencia-gym.png (1 imagem(ns) PNG/JPG grandes)

