"use strict";
/* painel.js — lista as tabelas do banco e deixa criar, editar e apagar registros (CRUD).
   Escreve tudo com textContent (nunca monta HTML a partir de texto) para não abrir brecha de segurança (XSS). */
const area = document.getElementById("area");
const abas = document.getElementById("abas");
const situacao = document.getElementById("situacao");
let esquema = {};
let atual = "";

async function pedir(metodo, url, corpo) {
  const opcoes = { method: metodo, headers: { Accept: "application/json" } };
  if (corpo !== undefined) { opcoes.headers["Content-Type"] = "application/json"; opcoes.body = JSON.stringify(corpo); }
  const token = sessionStorage.getItem("admin_token");
  if (token) opcoes.headers["X-Admin-Token"] = token;
  const r = await fetch(url, opcoes);
  const d = await r.json().catch(() => ({ erro: "Resposta inesperada." }));
  if (!r.ok) throw new Error(d.erro || "Erro " + r.status);
  return d;
}

function el(tag, texto, classe) {
  const e = document.createElement(tag);
  if (texto !== undefined) e.textContent = texto;
  if (classe) e.className = classe;
  return e;
}

function tipoDoCampo(tipo) {
  return { INTEGER: "number", REAL: "number", DATE: "date", DATETIME: "datetime-local", BOOLEAN: "checkbox" }[tipo] || "text";
}

function formulario(nome, t, linha) {
  const form = el("form", undefined, "linha");
  const editando = Boolean(linha);
  for (const [coluna, tipo] of Object.entries(t.colunas)) {
    if (t.auto.includes(coluna)) continue;
    const rotulo = el("label", coluna + (t.obrigatorias.includes(coluna) ? " *" : ""));
    const campo = el("input");
    campo.type = tipoDoCampo(tipo);
    campo.name = coluna;
    if (tipo === "REAL") campo.step = "any";
    if (editando && linha[coluna] !== null && linha[coluna] !== undefined) {
      if (tipo === "BOOLEAN") campo.checked = Boolean(linha[coluna]); else campo.value = linha[coluna];
    }
    if (editando && t.pk.includes(coluna)) campo.disabled = true;
    rotulo.append(campo);
    form.append(rotulo);
  }
  const salvar = el("button", editando ? "Salvar alterações" : "Criar registro");
  salvar.type = "submit";
  const msg = el("p", "", "");
  msg.setAttribute("role", "status");
  form.append(salvar, msg);
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const dados = {};
    for (const c of form.elements) {
      if (!c.name || c.disabled) continue;
      dados[c.name] = c.type === "checkbox" ? (c.checked ? 1 : 0) : c.value;
    }
    try {
      if (editando) await pedir("PUT", "/api/" + nome + "/" + linha[t.pk[0]], dados);
      else await pedir("POST", "/api/" + nome, dados);
      await mostrar(nome);
    } catch (e) { msg.textContent = e.message; msg.className = "erro"; }
  });
  return form;
}

async function mostrar(nome) {
  atual = nome;
  area.replaceChildren();
  const t = esquema[nome];
  const cartao = el("section");
  cartao.append(el("h2", "Tabela " + nome));
  let linhas = [];
  try { linhas = (await pedir("GET", "/api/" + nome)).dados; }
  catch (e) { cartao.append(el("p", e.message, "erro")); area.append(cartao); return; }
  const colunas = Object.keys(t.colunas);
  const rolavel = el("div", undefined, "tabela-rolavel");
  const tabela = el("table");
  const cab = el("tr");
  colunas.forEach((c) => cab.append(el("th", c)));
  cab.append(el("th", "ações"));
  tabela.append(cab);
  for (const linha of linhas) {
    const tr = el("tr");
    colunas.forEach((c) => tr.append(el("td", linha[c] === null ? "" : String(linha[c]))));
    const td = el("td");
    if (t.pk.length === 1) {
      const editar = el("button", "Editar", "sec");
      editar.type = "button";
      editar.addEventListener("click", () => { form.replaceWith(formulario(nome, t, linha)); });
      const apagar = el("button", "Apagar", "perigo");
      apagar.type = "button";
      apagar.addEventListener("click", async () => {
        try { await pedir("DELETE", "/api/" + nome + "/" + linha[t.pk[0]]); await mostrar(nome); }
        catch (e) { situacao.textContent = e.message; situacao.className = "erro"; }
      });
      td.append(editar, " ", apagar);
    }
    tr.append(td);
    tabela.append(tr);
  }
  rolavel.append(tabela);
  cartao.append(el("p", linhas.length + " registro(s)."), rolavel);
  const form = formulario(nome, t);
  cartao.append(el("h3", "Novo registro"), form);
  area.append(cartao);
  abas.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.tabela === nome)));
}

async function iniciar() {
  try {
    const d = await pedir("GET", "/api/_esquema");
    esquema = d.tabelas;
    if (!d.admin) {
      situacao.textContent = "Informe o token de administrador para ver e editar os dados.";
      document.getElementById("form-token").hidden = false;
      return;
    }
    situacao.textContent = "Acesso liberado.";
    situacao.className = "ok";
    document.getElementById("form-token").hidden = true;
    abas.replaceChildren();
    Object.keys(esquema).forEach((nome) => {
      const b = el("button", nome, "sec");
      b.type = "button"; b.dataset.tabela = nome;
      b.addEventListener("click", () => mostrar(nome));
      abas.append(b);
    });
    if (atual || Object.keys(esquema)[0]) await mostrar(atual || Object.keys(esquema)[0]);
  } catch (e) { situacao.textContent = e.message; situacao.className = "erro"; }
}

document.getElementById("form-token").addEventListener("submit", (ev) => {
  ev.preventDefault();
  sessionStorage.setItem("admin_token", document.getElementById("token").value);
  iniciar();
});
iniciar();
