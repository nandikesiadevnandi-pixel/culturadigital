// Aulas lúdicas + desafios para "Aprendendo a Codar"

export type Lesson = {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  metaphor: string;
  color: string; // tailwind gradient classes
  blocks: { kind: "p" | "code" | "tip" | "try"; text: string }[];
};

export const LESSONS: Lesson[] = [
  {
    id: "html",
    emoji: "🦴",
    title: "HTML — O Esqueleto",
    subtitle: "Dá forma e estrutura ao site",
    metaphor:
      "Pensa no teu corpo: o esqueleto segura tudo no lugar. O HTML é o esqueleto do site — ele diz o que tem na página: títulos, parágrafos, imagens, botões…",
    color: "from-orange-500 to-amber-500",
    blocks: [
      { kind: "p", text: "Tudo em HTML vive dentro de marcas chamadas TAGS, que se abrem e se fecham:" },
      { kind: "code", text: "<h1>Olá mundo!</h1>\n<p>Eu estou aprendendo a codar 💻</p>" },
      { kind: "tip", text: "h1 = título grande · p = parágrafo · img = imagem · button = botão" },
      { kind: "try", text: "Troca o texto dentro de <h1> pelo teu nome e aperta ▶ Rodar." },
    ],
  },
  {
    id: "css",
    emoji: "👕",
    title: "CSS — A Roupa e o Estilo",
    subtitle: "Dá cor, beleza e estilo",
    metaphor:
      "Se o HTML é o esqueleto, o CSS é a roupa, o cabelo, a maquiagem. É o que deixa o site bonito: cores, fontes, tamanhos, espaçamentos.",
    color: "from-cyan-500 to-blue-500",
    blocks: [
      { kind: "p", text: "Tu escolhes o elemento e dizes como ele deve ficar:" },
      { kind: "code", text: "h1 {\n  color: hotpink;\n  font-size: 60px;\n  text-align: center;\n}" },
      { kind: "tip", text: "color = cor da letra · background = cor de fundo · font-size = tamanho da letra" },
      { kind: "try", text: "Pinta o body com background: orange e o h1 com color: white." },
    ],
  },
  {
    id: "js",
    emoji: "🧠",
    title: "JavaScript — O Cérebro",
    subtitle: "Faz o site pensar e reagir",
    metaphor:
      "O JavaScript é o cérebro. Ele faz o site reagir: contar cliques, mudar cor sozinho, mostrar mensagens, fazer jogos!",
    color: "from-yellow-400 to-pink-500",
    blocks: [
      { kind: "p", text: "Aqui o JS muda o tamanho do título quando a página carrega:" },
      { kind: "code", text: "document.querySelector('h1').style.fontSize = '80px';" },
      { kind: "tip", text: "querySelector = 'achar elemento' · .style = mudar o visual · alert('oi') = mostra um aviso" },
      { kind: "try", text: "Troca '80px' por '120px' e veja o título crescer 🚀" },
    ],
  },
];

export type Challenge = {
  id: string;
  emoji: string;
  title: string;
  brief: string;
  xp: number;
  starter: { html: string; css: string; js: string };
  // checks rodam em strings de código (case-insensitive)
  checks: { description: string; test: (code: { html: string; css: string; js: string }) => boolean }[];
};

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "");

export const CHALLENGES: Challenge[] = [
  {
    id: "ch-pink-title",
    emoji: "🌸",
    title: "Título rosa",
    brief: "Cria um <h1> e pinta de rosa (pink ou hotpink) usando CSS.",
    xp: 20,
    starter: { html: "<h1>Meu primeiro site</h1>", css: "", js: "" },
    checks: [
      { description: "Tem um <h1>", test: ({ html }) => /<h1[\s>]/i.test(html) },
      {
        description: "h1 com cor rosa no CSS",
        test: ({ css }) => /h1[^{]*\{[^}]*color\s*:\s*(pink|hotpink|#ff[0-9a-f]{4}|deeppink)/i.test(css),
      },
    ],
  },
  {
    id: "ch-bg-button",
    emoji: "🎨",
    title: "Fundo colorido + botão",
    brief: "Pinta o fundo da página e adiciona um <button> escrito 'Clique aqui'.",
    xp: 25,
    starter: { html: "<h1>Oi!</h1>\n", css: "body { }\n", js: "" },
    checks: [
      { description: "Body com background colorido", test: ({ css }) => /body[^{]*\{[^}]*background\s*:\s*[^;}]+/i.test(css) },
      { description: "Tem um <button>", test: ({ html }) => /<button[\s>]/i.test(html) },
      { description: "Botão tem o texto 'Clique aqui'", test: ({ html }) => /clique\s*aqui/i.test(html) },
    ],
  },
  {
    id: "ch-alert-js",
    emoji: "🧠",
    title: "Cérebro acordou!",
    brief: "Usa JavaScript para mostrar um alert com 'Oi turma!' quando a página carregar.",
    xp: 30,
    starter: { html: "<h1>JS em ação</h1>", css: "", js: "// escreve aqui" },
    checks: [
      { description: "Usa alert(...)", test: ({ js }) => /alert\s*\(/i.test(js) },
      { description: "Mensagem 'Oi turma'", test: ({ js }) => /oi\s*turma/i.test(js) },
    ],
  },
  {
    id: "ch-centered-card",
    emoji: "🪪",
    title: "Cartão de apresentação",
    brief: "Cria um <h1> com teu nome e um <p> com tua turma, centralizados na tela.",
    xp: 35,
    starter: { html: "<h1>Teu nome</h1>\n<p>Turma</p>", css: "body {\n  /* centraliza tudo */\n}", js: "" },
    checks: [
      { description: "Tem h1 e p", test: ({ html }) => /<h1[\s>]/i.test(html) && /<p[\s>]/i.test(html) },
      {
        description: "Está centralizado (text-align center ou flex)",
        test: ({ css }) => /text-align\s*:\s*center/i.test(css) || /display\s*:\s*flex/i.test(css),
      },
    ],
  },
  {
    id: "ch-click-color",
    emoji: "✨",
    title: "Clica e muda de cor",
    brief: "Quando clicarem no <h1>, ele deve mudar de cor usando JavaScript.",
    xp: 40,
    starter: {
      html: "<h1 id=\"titulo\">Clica em mim!</h1>",
      css: "h1 { cursor: pointer; }",
      js: "// dica: document.getElementById('titulo').onclick = ...",
    },
    checks: [
      { description: "Pega o elemento (getElementById ou querySelector)", test: ({ js }) => /getElementById|querySelector/i.test(js) },
      { description: "Define um onclick / addEventListener", test: ({ js }) => /onclick|addEventListener/i.test(js) },
      { description: "Muda style.color", test: ({ js }) => /style\.color/i.test(js) },
    ],
  },
  // ===== MÓDULO A — HTML =====
  {
    id: "ch-html-apresentacao",
    emoji: "👤",
    title: "Minha Apresentação Digital",
    brief: "Complete a página de apresentação pessoal — o código está 75% pronto, você preenche o conteúdo.",
    xp: 40,
    starter: {
      html: `<!DOCTYPE html>
<html>
  <head>
    <title>[SEU NOME]</title>
  </head>
  <body>
    <h1>[SEU NOME AQUI]</h1>

    <h2>Sobre mim</h2>
    <p>Tenho [IDADE] anos e moro em [CIDADE].</p>
    <p>Eu gosto muito de <strong>[ALGO QUE VOCÊ GOSTA]</strong>
    e também de <em>[OUTRA COISA]</em>.</p>

    <h2>Meu Lugar Favorito</h2>
    <p>[ESCREVA SOBRE SEU LUGAR FAVORITO NO BRASIL]</p>

    <h2>Uma Coisa que Quero Aprender</h2>
    <p>[O QUE VOCÊ QUER APRENDER]</p>
  </body>
</html>`,
      css: "",
      js: "",
    },
    checks: [
      { description: "Tem h1 com conteúdo real", test: ({ html }) => /<h1[^>]*>[^<[]+<\/h1>/i.test(html) },
      { description: "Tem pelo menos 3 seções h2", test: ({ html }) => (html.match(/<h2/gi) || []).length >= 3 },
      { description: "Usa <strong> para destaque", test: ({ html }) => /<strong[^>]*>[^<]+<\/strong>/i.test(html) },
      { description: "Usa <em> para itálico", test: ({ html }) => /<em[^>]*>[^<]+<\/em>/i.test(html) },
    ],
  },
  {
    id: "ch-html-receita",
    emoji: "🍳",
    title: "Página de Receita Brasileira",
    brief: "Crie uma página de receita de um prato brasileiro com: título, ingredientes, modo de preparo e dica especial.",
    xp: 50,
    starter: {
      html: `<!DOCTYPE html>
<html>
  <head>
    <title></title>
  </head>
  <body>
    <h1></h1>

    <h2>Ingredientes</h2>
    <p></p>

    <h2>Modo de Preparo</h2>


    <h3></h3>
    <p></p>
  </body>
</html>`,
      css: "",
      js: "",
    },
    checks: [
      { description: "Tem h1 com nome do prato", test: ({ html }) => /<h1[^>]*>[^<]+<\/h1>/i.test(html) },
      { description: "Tem seção Ingredientes", test: ({ html }) => /ingredientes/i.test(html) },
      { description: "Tem seção Modo de Preparo", test: ({ html }) => /preparo|preparo|modo/i.test(html) },
      { description: "Usa <strong> nos ingredientes", test: ({ html }) => /<strong[^>]*>[^<]+<\/strong>/i.test(html) },
      { description: "Tem h3 (subseção)", test: ({ html }) => /<h3/i.test(html) },
    ],
  },
  // ===== MÓDULO B — CSS =====
  {
    id: "ch-css-paleta-bairro",
    emoji: "🌈",
    title: "Paleta de Cores do Meu Bairro",
    brief: "Crie uma página com 4 elementos do seu bairro, cada um com uma cor diferente usando CSS.",
    xp: 40,
    starter: {
      html: `<!DOCTYPE html>
<html>
  <head>
    <title>Cores do Meu Bairro</title>
    <style>

      body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: /* SUA COR */;
      }

      h1 {
        color: /* SUA COR */;
        text-align: center;
      }

      .elemento-1 { color: /* COR */; background-color: /* COR */; padding: 12px; margin-bottom: 10px; }
      .elemento-2 { color: /* COR */; background-color: /* COR */; padding: 12px; margin-bottom: 10px; }
      .elemento-3 { color: /* COR */; background-color: /* COR */; padding: 12px; margin-bottom: 10px; }
      .elemento-4 { color: /* COR */; background-color: /* COR */; padding: 12px; margin-bottom: 10px; }

    </style>
  </head>
  <body>
    <h1>Cores do Bairro [SEU BAIRRO OU CIDADE]</h1>
    <p class="elemento-1"><strong>A Praça:</strong> [DESCREVA]</p>
    <p class="elemento-2"><strong>A Escola:</strong> [DESCREVA]</p>
    <p class="elemento-3"><strong>A Padaria:</strong> [DESCREVA]</p>
    <p class="elemento-4"><strong>O Parque:</strong> [DESCREVA]</p>
  </body>
</html>`,
      css: "",
      js: "",
    },
    checks: [
      { description: "Tem 4 classes de elementos", test: ({ html }) => (html.match(/class="elemento-[1-4]"/g) || []).length >= 4 },
      { description: "CSS tem background-color em pelo menos 2 classes", test: ({ html }) => (html.match(/background-color\s*:/g) || []).length >= 2 },
      { description: "Tem conteúdo real (não placeholder)", test: ({ html }) => !/\[DESCREVA\]|\[SUA COR\]|\[COR\]/.test(html) },
    ],
  },
  {
    id: "ch-css-card-atleta",
    emoji: "🏅",
    title: "Card de Atleta Brasileiro",
    brief: "Crie um card de perfil de um atleta brasileiro com: fundo escuro, card com borda colorida, cantos arredondados e nome em destaque.",
    xp: 55,
    starter: {
      html: `<!DOCTYPE html>
<html>
  <head>
    <title>Card de Atleta</title>
    <style>

      body {
        background-color: ;
        font-family: Arial, sans-serif;
        padding: 40px;
      }

      .card {
        width: px;
        background-color: ;
        border: px solid ;
        border-radius: px;
        padding: px;
      }

      .card h2 {
        color: ;
        font-size: px;
        margin-bottom: px;
      }

      .esporte {
        font-style: italic;
        color: ;
        margin-bottom: px;
      }

    </style>
  </head>
  <body>
    <div class="card">
      <h2></h2>
      <p class="esporte"></p>
      <p></p>
    </div>
  </body>
</html>`,
      css: "",
      js: "",
    },
    checks: [
      { description: "Tem .card com width definida", test: ({ html }) => /\.card\s*\{[^}]*width\s*:\s*\d+px/i.test(html) },
      { description: "Tem border-radius no card", test: ({ html }) => /\.card\s*\{[^}]*border-radius\s*:/i.test(html) },
      { description: "Tem padding no card", test: ({ html }) => /\.card\s*\{[^}]*padding\s*:\s*\d+/i.test(html) },
      { description: "Card tem conteúdo real", test: ({ html }) => /<h2[^>]*>[^<]+<\/h2>/i.test(html) },
    ],
  },
  // ===== MÓDULO C — CSS AVANÇADO =====
  {
    id: "ch-css-navbar-flex",
    emoji: "🧭",
    title: "Navbar com Flexbox",
    brief: "Crie a barra de navegação de um time de futebol brasileiro: logo à esquerda, links ao centro, botão à direita — usando display: flex.",
    xp: 40,
    starter: {
      html: `<!DOCTYPE html>
<html>
  <head>
    <title>Site do Time</title>
    <style>

      * { margin: 0; padding: 0; box-sizing: border-box; }

      body { font-family: Arial, sans-serif; }

      .navbar {
        /* Preencha: background-color do time, display: flex,
           align-items: center, justify-content: space-between,
           padding: 0 32px, height: 64px */
      }

      .logo {
        /* Preencha: color, font-size, font-weight, text-decoration */
      }

      .links {
        display: flex;
        gap: 8px;
        list-style: none;
      }

      .links a {
        /* Preencha: color, text-decoration, padding, font-size */
      }

      .links a:hover {
        /* Preencha: algum efeito de hover */
      }

      .btn-inscricao {
        /* Preencha: background-color, color, border, padding, border-radius, cursor */
      }

    </style>
  </head>
  <body>
    <nav class="navbar">
      <div class="logo">NOME DO TIME</div>
      <ul class="links">
        <li><a href="#">Início</a></li>
        <li><a href="#">Elenco</a></li>
        <li><a href="#">Jogos</a></li>
        <li><a href="#">Loja</a></li>
      </ul>
      <button class="btn-inscricao">Seja Sócio</button>
    </nav>
  </body>
</html>`,
      css: "",
      js: "",
    },
    checks: [
      { description: "Navbar tem display: flex", test: ({ html }) => /\.navbar\s*\{[^}]*display\s*:\s*flex/i.test(html) },
      { description: "Navbar tem justify-content: space-between", test: ({ html }) => /\.navbar\s*\{[^}]*justify-content\s*:\s*space-between/i.test(html) },
      { description: "Links têm color definida", test: ({ html }) => /\.links\s*a\s*\{[^}]*color\s*:/i.test(html) },
      { description: "Botão tem background-color", test: ({ html }) => /\.btn-inscricao\s*\{[^}]*background-color\s*:/i.test(html) },
    ],
  },
];

export const TOTAL_CHALLENGE_XP = CHALLENGES.reduce((a, c) => a + c.xp, 0);
export { norm };
