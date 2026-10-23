"use strict";
/* api.js — conversa com o back-end Flask (Tutor Front).
   1) api.listar / criar / atualizar / apagar: funções para usar no seu JavaScript.
   2) Formulários com data-api="tabela" são enviados sozinhos para /api/tabela. */
const BASE = window.API_BASE || ""; // vazio = mesmo endereço do site; se o front ficar no GitHub Pages, defina window.API_BASE = "https://seu-app.onrender.com"
const api = {
  async pedir(metodo, url, corpo) {
    const opcoes = { method: metodo, headers: { Accept: "application/json" } };
    if (corpo !== undefined) {
      opcoes.headers["Content-Type"] = "application/json";
      opcoes.body = JSON.stringify(corpo);
    }
    const token = sessionStorage.getItem("admin_token");
    if (token) opcoes.headers["X-Admin-Token"] = token;
    const resposta = await fetch(BASE + url, opcoes);
    const dados = await resposta.json().catch(() => ({ ok: false, erro: "Resposta inesperada do servidor." }));
    if (!resposta.ok) throw new Error(dados.erro || "Erro " + resposta.status);
    return dados;
  },
  listar(tabela) { return this.pedir("GET", "/api/" + tabela); },
  criar(tabela, dados) { return this.pedir("POST", "/api/" + tabela, dados); },
  atualizar(tabela, id, dados) { return this.pedir("PUT", "/api/" + tabela + "/" + id, dados); },
  apagar(tabela, id) { return this.pedir("DELETE", "/api/" + tabela + "/" + id); },
};

function formularioParaObjeto(form) {
  const dados = {};
  for (const campo of form.elements) {
    if (!campo.name || campo.disabled || campo.type === "submit" || campo.type === "button") continue;
    if (campo.type === "checkbox") dados[campo.name] = campo.checked ? 1 : 0;
    else if (campo.type === "radio") { if (campo.checked) dados[campo.name] = campo.value; }
    else dados[campo.name] = campo.value;
  }
  return dados;
}

function avisoDoFormulario(form) {
  let aviso = form.querySelector(".aviso-api");
  if (!aviso) {
    aviso = document.createElement("p");
    aviso.className = "aviso-api";
    aviso.setAttribute("role", "status");
    form.append(aviso);
  }
  return aviso;
}

document.querySelectorAll("form[data-api]").forEach((form) => {
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const aviso = avisoDoFormulario(form);
    aviso.textContent = "Enviando...";
    try {
      await api.criar(form.dataset.api, formularioParaObjeto(form));
      aviso.textContent = "Pronto! Recebemos seus dados.";
      form.reset();
    } catch (erro) {
      aviso.textContent = "Não foi possível enviar: " + erro.message;
    }
  });
});
