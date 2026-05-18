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

export type ChallengeStep = {
  instruction: string;
  hint: string;
};

export type Challenge = {
  id: string;
  emoji: string;
  title: string;
  brief: string;
  xp: number;
  starter: { html: string; css: string; js: string };
  // checks rodam em strings de código (case-insensitive)
  checks: { description: string; test: (code: { html: string; css: string; js: string }) => boolean }[];
  steps?: ChallengeStep[];
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
    steps: [
      {
        instruction: "No HTML, troca o texto dentro do <h1> pelo nome do seu site. Só mude o texto entre as tags.",
        hint: "<h1>Minha Página</h1>",
      },
      {
        instruction: "Agora vai no CSS e escreve h1 { — isso abre o bloco de estilo do título.",
        hint: "h1 {\n\n}",
      },
      {
        instruction: "Dentro das chaves { }, escreve color: pink; para pintar o título de rosa.",
        hint: "h1 {\n  color: pink;\n}",
      },
      {
        instruction: "Clica em Rodar e veja o título rosa! Tenta trocar pink por hotpink para um rosa mais forte.",
        hint: "h1 {\n  color: hotpink;\n}",
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
    steps: [
      {
        instruction: "No CSS, dentro de body { }, escreve background: orange; — isso pinta o fundo de laranja.",
        hint: "body {\n  background: orange;\n}",
      },
      {
        instruction: "No HTML, depois do <h1>Oi!</h1>, escreve a tag de botão com o texto 'Clique aqui'.",
        hint: "<button>Clique aqui</button>",
      },
      {
        instruction: "Tenta trocar orange por outra cor que você gostar! (purple, green, #ff6b6b...)",
        hint: "body {\n  background: purple;\n}",
      },
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
    steps: [
      {
        instruction: "Apaga o comentário '// escreve aqui' e começa a digitar: alert( — sim, a palavra alert e depois um parêntese.",
        hint: "alert(",
      },
      {
        instruction: "Dentro dos parênteses, coloca o texto entre aspas simples. Ex: 'Oi turma!'",
        hint: "alert('Oi turma!'",
      },
      {
        instruction: "Fecha com ) e ponto e vírgula ; — depois clica em Rodar. Uma janela vai aparecer!",
        hint: "alert('Oi turma!');",
      },
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
    steps: [
      {
        instruction: "No HTML, substitui 'Teu nome' pelo seu nome real dentro do <h1>.",
        hint: "<h1>Maria Silva</h1>",
      },
      {
        instruction: "Substitui 'Turma' pela sua turma real dentro do <p>.",
        hint: "<p>6 ano - Turma 401</p>",
      },
      {
        instruction: "No CSS, apaga o comentário e escreve text-align: center; dentro de body { }.",
        hint: "body {\n  text-align: center;\n}",
      },
      {
        instruction: "Agora personaliza com cores! Adiciona background e color no body para deixar com a sua cara.",
        hint: "body {\n  text-align: center;\n  background: #1a1a2e;\n  color: white;\n  padding: 40px;\n}",
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
    steps: [
      {
        instruction: "No JS, apaga o comentário e escreve document.getElementById('titulo') — isso pega o elemento pelo id.",
        hint: "document.getElementById('titulo')",
      },
      {
        instruction: "Depois do getElementById, adiciona .onclick = function() { — isso diz o que acontece ao clicar.",
        hint: "document.getElementById('titulo').onclick = function() {",
      },
      {
        instruction: "Dentro das chaves { }, muda a cor com this.style.color = 'hotpink';",
        hint: "document.getElementById('titulo').onclick = function() {\n  this.style.color = 'hotpink';\n}",
      },
      {
        instruction: "Fecha com }; e clica em Rodar. Agora clica no titulo na preview e veja a magia!",
        hint: "document.getElementById('titulo').onclick = function() {\n  this.style.color = 'hotpink';\n};",
      },
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
    steps: [
      {
        instruction: "Substitui [SEU NOME AQUI] pelo seu nome real no <h1> e também no <title> no topo do HTML.",
        hint: "<title>Carlos Mendes</title>\n...\n<h1>Carlos Mendes</h1>",
      },
      {
        instruction: "Preenche [IDADE] e [CIDADE] com os seus dados reais no primeiro parágrafo.",
        hint: "<p>Tenho 12 anos e moro em Salvador.</p>",
      },
      {
        instruction: "Dentro de <strong>, escreve algo que você gosta muito (ex: futebol, dança, culinária).",
        hint: "<strong>jogar futebol</strong>",
      },
      {
        instruction: "Dentro de <em>, escreve outra coisa que gosta — vai aparecer em itálico.",
        hint: "<em>ouvir música baiana</em>",
      },
      {
        instruction: "Complete os dois ultimos parágrafos com seu lugar favorito e o que quer aprender.",
        hint: "<p>Meu lugar favorito é a Praia do Porto da Barra em Salvador.</p>",
      },
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
    steps: [
      {
        instruction: "No <h1>, escreve o nome de um prato brasileiro que você gosta. Ex: Acarajé, Coxinha, Feijoada.",
        hint: "<h1>Acarajé</h1>",
      },
      {
        instruction: "No <title> (dentro do <head>), coloca o mesmo nome do prato.",
        hint: "<title>Acarajé</title>",
      },
      {
        instruction: "Na seção Ingredientes, escreve os ingredientes dentro do <p>.",
        hint: "<p>Feijão-fradinho, camarão seco, azeite de dendê, cebola e sal.</p>",
      },
      {
        instruction: "Envolve pelo menos um ingrediente importante com <strong>ingrediente</strong> para destacar.",
        hint: "<p>Feijão-fradinho, camarão seco, <strong>azeite de dendê</strong>, cebola e sal.</p>",
      },
      {
        instruction: "No <h3>, escreve um título de subseção — ex: Dica Especial ou Tempo de Preparo.",
        hint: "<h3>Dica Especial</h3>",
      },
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
    steps: [
      {
        instruction: "Substitui [SEU BAIRRO OU CIDADE] pelo nome do seu bairro ou cidade no <h1>.",
        hint: "<h1>Cores do Bairro Pelourinho</h1>",
      },
      {
        instruction: "No CSS do body (dentro do <style>), substitui /* SUA COR */ por uma cor de fundo para a página.",
        hint: "background-color: #f5f0e8;",
      },
      {
        instruction: "Em .elemento-1, troca /* COR */ por uma cor real em color (texto) e outra em background-color.",
        hint: ".elemento-1 { color: white; background-color: #e74c3c; padding: 12px; margin-bottom: 10px; }",
      },
      {
        instruction: "Repete para .elemento-2, .elemento-3 e .elemento-4 com cores diferentes cada um.",
        hint: ".elemento-2 { color: white; background-color: #3498db; padding: 12px; margin-bottom: 10px; }",
      },
      {
        instruction: "Substitui [DESCREVA] em cada parágrafo com uma frase real sobre esse lugar do seu bairro.",
        hint: "<p class=\"elemento-1\"><strong>A Praca:</strong> E onde todo mundo se encontra no fim de semana.</p>",
      },
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
    steps: [
      {
        instruction: "No body do CSS, escreve background-color: #1a1a2e; para um fundo escuro elegante.",
        hint: "body {\n  background-color: #1a1a2e;\n  font-family: Arial, sans-serif;\n  padding: 40px;\n}",
      },
      {
        instruction: "No .card, escreve width: 300px; e background-color: #2a2a3e; para o tamanho e cor do card.",
        hint: ".card {\n  width: 300px;\n  background-color: #2a2a3e;\n}",
      },
      {
        instruction: "Adiciona border: 2px solid gold; e border-radius: 12px; no .card para a borda dourada arredondada.",
        hint: ".card {\n  width: 300px;\n  background-color: #2a2a3e;\n  border: 2px solid gold;\n  border-radius: 12px;\n  padding: 20px;\n}",
      },
      {
        instruction: "No <h2>, escreve o nome de um atleta brasileiro. Ex: Marta, Rebeca Andrade, Neymar.",
        hint: "<h2>Rebeca Andrade</h2>",
      },
      {
        instruction: "No <p class='esporte'>, escreve o esporte. No outro <p>, escreve uma conquista famosa.",
        hint: "<p class=\"esporte\">Ginastica Artistica</p>\n<p>Primeira brasileira a ganhar ouro olimpico na modalidade.</p>",
      },
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
    steps: [
      {
        instruction: "Substitui 'NOME DO TIME' pelo nome de um time brasileiro no <div class='logo'>.",
        hint: "<div class=\"logo\">Flamengo</div>",
      },
      {
        instruction: "No .navbar do CSS, escreve display: flex; e align-items: center; para alinhar os itens.",
        hint: "display: flex;\nalign-items: center;",
      },
      {
        instruction: "Adiciona justify-content: space-between; para separar logo, links e botão nas extremidades.",
        hint: "justify-content: space-between;\npadding: 0 32px;\nheight: 64px;",
      },
      {
        instruction: "Adiciona background-color com a cor do time. Ex: #e31d1c para o Flamengo.",
        hint: "background-color: #e31d1c;",
      },
      {
        instruction: "No .links a, escreve color: white; e text-decoration: none; para os links ficarem bonitos.",
        hint: "color: white;\ntext-decoration: none;\npadding: 8px;",
      },
    ],
  },
];

export const TOTAL_CHALLENGE_XP = CHALLENGES.reduce((a, c) => a + c.xp, 0);
export { norm };
