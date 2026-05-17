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
];

export const TOTAL_CHALLENGE_XP = CHALLENGES.reduce((a, c) => a + c.xp, 0);
export { norm };
