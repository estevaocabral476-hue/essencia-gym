# Documentação Técnica — gym

> Documento vivo: atualize as seções existentes a cada fase (não crie um documento novo). Modelo: `materiais/Modelo_Documentacao_Tecnica.pdf`.

| Campo | Informação |
|---|---|
| Nome do projeto | gym |
| Versão atual do documento | V2 |
| Responsável técnico | [Preencher] |
| Repositório principal | https://github.com/estevaocabral476-hue/essencia-gym |
| Site publicado | https://estevaocabral476-hue.github.io/essencia-gym/ |
| Última atualização | 23/10/2026 |
| Status | Em elaboração |

## 1. Histórico de versões

| Versão | Data | Alteração | Status |
|---|---|---|---|
| V2 | 23/10/2026 | Gerado pelo tutor com os dados do site | Rascunho |

## 2. Visão geral

**Objetivo:** [Descreva em 1 ou 2 frases o que o site entrega.]

**Público-alvo:** Pessas de academia

Tipo: site estático (HTML, CSS e JavaScript no navegador), sem servidor e sem banco de dados.

## 3. Requisitos funcionais

| ID | Requisito | Prioridade | Status |
|---|---|---|---|
| RF-001 | Após o preenchimento, o usuário pode clicar em "Criar conta". Também existe um link para | Média | Planejado |
| RF-002 | RF01 — Visualizar produtos: o usuário deve conseguir visualizar os produtos disponíveis | Média | Planejado |
| RF-003 | RF02 — Filtrar produtos: o usuário deve conseguir filtrar os produtos por categoria. | Média | Planejado |
| RF-004 | RF03 — Utilizar o carrinho: o usuário deve conseguir visualizar os produtos adicionados e | Média | Planejado |
| RF-005 | RF04 — Realizar login: o usuário deve conseguir informar e-mail e senha para acessar sua | Média | Planejado |
| RF-006 | RF05 — Criar conta: o usuário deve conseguir cadastrar nome, e-mail e senha. | Média | Planejado |
| RF-007 | RF06 — Validar cadastro: o sistema deve verificar informações como e-mail, tamanho da | Média | Planejado |
| RF-008 | RF07 — Navegar sem login: o usuário possui a opção de continuar utilizando a loja sem | Média | Planejado |
| RF-009 | RNF01 — Interface: o sistema deve apresentar uma interface organizada e visualmente | Média | Planejado |
| RF-010 | RNF02 — Responsividade: as páginas utilizam a configuração viewport, permitindo | Média | Planejado |
| RF-011 | RNF03 — Usabilidade: os campos possuem labels, placeholders e mensagens de erro | Média | Planejado |
| RF-012 | RNF04 — Organização: HTML, CSS, JavaScript e imagens são separados em diferentes | Média | Planejado |

## 4. Páginas e navegação

| Arquivo | Título | Descrição (meta description) |
|---|---|---|
| 404.html | Página não encontrada | [Preencher] |
| cadastro.html | Essência Gym | Criar conta | [Preencher] |
| index.html | Essência Gym | Suplementos para o seu treino | [Preencher] |
| login.html | Essência Gym | Entrar | [Preencher] |

## 5. Design

**Cores e variáveis (CSS):**

| Variável | Valor |
|---|---|
| `--preto` | #0a0a09 |
| `--preto-carta` | #141310 |
| `--bege` | #d9cbaa |
| `--bege-forte` | #e9dfc7 |
| `--bronze` | #9c8558 |
| `--bronze-escuro` | #4a3f2a |
| `--cinza-texto` | #8a8578 |
| `--erro` | #c96a5a |

- Breakpoints usados: 760px, 980px
- Abordagem: mobile first; contraste mínimo de 4,5:1 para textos (WCAG AA).
- Fontes: [Preencher]

## 6. Stack e ambiente

- HTML5 + CSS3 + JavaScript (sem backend).
- Arquivos JavaScript: js/cadastro.js, js/db.js, js/login.js, js/produtos.js, server/server.js
- Hospedagem: GitHub Pages (gratuita).
- Ver localmente: abrir `index.html` ou `python -m http.server`.

## 7. Estrutura do projeto

```
gym/
├── assets/
│   ├── a
│   └── logo-essencia-gym.png
├── css/
│   ├── login
│   ├── login.css
│   └── style.css
├── docs/
│   └── QUALIDADE.md
├── js/
│   ├── cadastro
│   ├── cadastro.js
│   ├── db.js
│   ├── login.js
│   └── produtos.js
├── server/
│   ├── db
│   ├── essencia.db
│   ├── package.json
│   └── server.js
├── .gitignore
├── 404.html
├── README.md
├── cadastro.html
├── favicon.svg
├── index.html
├── login.html
├── main.py
├── requirements.txt
├── robots.txt
└── sitemap.xml
```

## 8. Qualidade (auditoria do tutor)

| Categoria | Nota (0–100) |
|---|---|
| HTML | 86 |
| CSS | 98 |
| Responsivo | 98 |
| Acessibilidade | 76 |
| SEO | 88 |
| JavaScript | 68 |
| Desempenho | 91 |
| Publicação | 72 |
| **Geral** | **85** |

Detalhes e correções pendentes: `docs/QUALIDADE.md`.

## 9. Testes manuais

| ID | Teste | Status | Evidência |
|---|---|---|---|
| T-001 | Site abre em 320 px sem rolagem horizontal | Pendente | print do navegador (F12 → modo dispositivo) |
| T-002 | Todo o site funciona só com o teclado (Tab, Enter, Esc) | Pendente | |
| T-003 | Todos os links e imagens carregam no endereço publicado | Pendente | |
| T-004 | Formulários mostram mensagens de erro claras | Pendente | |
| T-005 | Lighthouse (F12 → Lighthouse): desempenho, acessibilidade e SEO acima de 90 | Pendente | print do relatório |

## 10. Publicação

Plataforma: GitHub Pages (branch `main`, pasta raiz). Endereço: https://estevaocabral476-hue.github.io/essencia-gym/.
Atenção: o endereço do projeto contém o nome do repositório; use caminhos relativos nos links.

## 11. Riscos e limitações

| ID | Risco | Mitigação |
|---|---|---|
| R-001 | Site estático não guarda dados de usuários no servidor | Usar localStorage só para preferências; para dados reais, serviços externos |
| R-002 | Chaves de API no JavaScript ficam públicas | Nunca colocar segredos no front; usar serviços com chave pública restrita |
| R-003 | Nome de arquivo com maiúscula diferente quebra no GitHub Pages | Padronizar nomes em minúsculas; o tutor testa em modo GitHub Pages |
