/* ===========================================================
   Essência Gym — Validação e envio do formulário de login
   =========================================================== */

const API_BASE = window.ESSENCIA_API_BASE || 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('.form-login');
    if (!form) return;

    const campoEmail = form.querySelector('#email');
    const campoSenha = form.querySelector('#senha');

    /* ---------- Mostrar / esconder senha ---------- */

    form.querySelectorAll('.botao-olho').forEach(botao => {
        botao.addEventListener('click', () => {
            const input = botao.closest('.campo-senha').querySelector('input');
            const visivel = input.type === 'text';

            input.type = visivel ? 'password' : 'text';
            botao.textContent = visivel ? 'Mostrar' : 'Ocultar';
        });
    });

    /* ---------- Validação ---------- */

    function marcarInvalido(campoInput, invalido) {
        campoInput.closest('.campo').classList.toggle('invalido', invalido);
    }

    function validarEmail() {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const valido = regex.test(campoEmail.value.trim());
        marcarInvalido(campoEmail, !valido);
        return valido;
    }

    function validarSenha() {
        const valido = campoSenha.value.length > 0;
        marcarInvalido(campoSenha, !valido);
        return valido;
    }

    campoEmail.addEventListener('blur', validarEmail);
    campoSenha.addEventListener('blur', validarSenha);

    /* ---------- Envio ---------- */

    form.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const emailValido = validarEmail();
        const senhaValida = validarSenha();

        if (!emailValido || !senhaValida) return;

        const botaoEntrar = form.querySelector('.botao-entrar');
        const textoOriginal = botaoEntrar.textContent;
        botaoEntrar.disabled = true;
        botaoEntrar.textContent = 'Entrando...';

        try {
            const resposta = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: campoEmail.value.trim(),
                    senha: campoSenha.value
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                marcarInvalido(campoSenha, true);
                campoSenha.closest('.campo').querySelector('.mensagem-erro').textContent =
                    dados.erro || 'E-mail ou senha inválidos.';
                throw new Error(dados.erro || 'E-mail ou senha inválidos.');
            }

            localStorage.setItem('essencia_token', dados.token);
            localStorage.setItem('essencia_usuario', JSON.stringify(dados.usuario));

            window.location.href = 'index.html';

        } catch (erro) {
            console.error(erro);
            if (erro.message.includes('fetch')) {
                alert('Não foi possível conectar ao servidor. Verifique se o backend (pasta server/) está rodando.');
            }
        } finally {
            botaoEntrar.disabled = false;
            botaoEntrar.textContent = textoOriginal;
        }
    });

});
