:root {
    --preto: #0a0a09;
    --preto-carta: #141310;
    --bege: #d9cbaa;
    --bege-forte: #e9dfc7;
    --bronze: #9c8558;
    --bronze-escuro: #4a3f2a;
    --cinza-texto: #8a8578;
    --erro: #c96a5a;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html,
body {
    min-height: 100%;
}

body {
    font-family: 'Inter', sans-serif;

    background:
        radial-gradient(
            circle at 20% 15%,
            rgba(156, 133, 88, 0.08),
            transparent 45%
        ),
        radial-gradient(
            circle at 85% 90%,
            rgba(156, 133, 88, 0.06),
            transparent 40%
        ),
        var(--preto);

    color: var(--bege);

    min-height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 24px;
}

.login-wrap {
    width: 100%;
    max-width: 960px;

    display: grid;
    grid-template-columns: 1fr 1fr;

    background: var(--preto-carta);

    border: 1px solid var(--bronze-escuro);

    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);

    overflow: hidden;
}

.painel-marca {
    position: relative;

    padding: 48px 40px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text-align: center;

    background:
        linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.35),
            rgba(0, 0, 0, 0.75)
        ),
        repeating-linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.02) 0px,
            rgba(255, 255, 255, 0.02) 1px,
            transparent 1px,
            transparent 6px
        );

    border-right: 1px solid var(--bronze-escuro);
}

.painel-marca img {
    width: 100%;
    max-width: 280px;
    height: auto;

    filter: drop-shadow(
        0 10px 25px rgba(0, 0, 0, 0.6)
    );
}

.painel-marca .frase {
    margin-top: 22px;

    font-size: 11px;
    letter-spacing: 3px;
    line-height: 1.9;

    color: var(--cinza-texto);
}

.linha-ouro {
    width: 56px;
    height: 2px;

    background: var(--bronze);

    margin: 18px 0;
}

.painel-form {
    padding: 56px 48px;

    display: flex;
    flex-direction: column;
    justify-content: center;
}

.titulo-form {
    font-family: 'Bebas Neue', sans-serif;

    font-size: 40px;
    letter-spacing: 1px;
    line-height: 1;

    color: var(--bege-forte);
}

.subtitulo-form {
    margin-top: 10px;
    margin-bottom: 34px;

    font-size: 14px;

    color: var(--cinza-texto);
}

.campo {
    position: relative;

    margin-bottom: 26px;
}

.campo label {
    display: block;

    margin-bottom: 8px;

    font-size: 12px;
    letter-spacing: 1px;

    color: var(--cinza-texto);
}

.campo input {
    width: 100%;

    background: transparent;

    border: none;
    border-bottom: 1px solid var(--bronze-escuro);

    padding: 8px 40px 10px 2px;

    font-family: 'Inter', sans-serif;
    font-size: 15px;

    color: var(--bege-forte);

    transition: border-color 0.25s ease;
}

.campo input::placeholder {
    color: #5c5648;
}

.campo input:focus {
    outline: none;

    border-bottom-color: var(--bronze);
}

.campo .icone {
    position: absolute;

    right: 2px;
    bottom: 10px;

    font-size: 15px;

    color: var(--cinza-texto);
}

.botao-olho {
    pointer-events: auto;

    cursor: pointer;

    background: none;
    border: none;

    font: inherit;

    color: var(--cinza-texto);
}

.botao-olho:hover {
    color: var(--bege-forte);
}


.mensagem-erro {
    display: none;

    margin-top: 8px;

    font-size: 12px;

    color: var(--erro);
}

.campo.invalido input {
    border-bottom-color: var(--erro);
}

.campo.invalido .mensagem-erro {
    display: block;
}

.linha-opcoes {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 30px;

    font-size: 13px;
}

.lembrar {
    display: flex;
    align-items: center;

    gap: 8px;

    color: var(--cinza-texto);

    cursor: pointer;
    user-select: none;
}

.lembrar input {
    width: 14px;
    height: 14px;

    accent-color: var(--bronze);
}

.link-recuperar {
    color: var(--bronze);

    text-decoration: none;
}

.link-recuperar:hover {
    text-decoration: underline;
}


.botao-entrar {
    width: 100%;

    padding: 14px;

    background: var(--bege);

    color: var(--preto);

    border: none;

    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 2px;

    cursor: pointer;

    transition:
        background 0.25s ease,
        transform 0.15s ease;
}

.botao-entrar:hover {
    background: var(--bege-forte);
}

.botao-entrar:active {
    transform: scale(0.99);
}


.botao-secundario {
    margin-top: 14px;

    background: transparent;

    border: 1px solid var(--bronze-escuro);

    color: var(--bege-forte);
}

.botao-secundario:hover {
    background: rgba(156, 133, 88, 0.12);
}


.texto-destaque {
    color: var(--bege-forte);

    font-weight: 600;
}

.rodape-form {
    margin-top: 28px;

    text-align: center;

    font-size: 13px;

    color: var(--cinza-texto);
}

.rodape-form a {
    margin-left: 4px;

    color: var(--bege-forte);

    text-decoration: none;

    font-weight: 600;
}

.rodape-form a:hover {
    color: var(--bronze);
}

a:focus-visible,
input:focus-visible,
button:focus-visible {
    outline: 2px solid var(--bronze);
    outline-offset: 2px;
}


@media (max-width: 760px) {

    body {
        padding: 16px;
    }

    .login-wrap {
        grid-template-columns: 1fr;

        max-width: 420px;
    }

    .painel-marca {
        padding: 36px 24px;

        border-right: none;
        border-bottom: 1px solid var(--bronze-escuro);
    }

    .painel-marca img {
        max-width: 190px;
    }

    .painel-form {
        padding: 40px 30px;
    }

    .titulo-form {
        font-size: 36px;
    }
}

@media (prefers-reduced-motion: reduce) {

    * {
        transition: none !important;
    }
}
