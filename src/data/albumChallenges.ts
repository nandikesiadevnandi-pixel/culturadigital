export type ChallengeType = 'logic' | 'html' | 'css' | 'javascript';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface AlbumChallenge {
  id: string;
  type: ChallengeType;
  emoji: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  packsReward: number;
  coinsReward: number;
  xpReward: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const ALBUM_CHALLENGES: AlbumChallenge[] = [
  // ── LÓGICA ──
  {
    id: 'logic-1', type: 'logic', emoji: '🧩', difficulty: 'easy',
    title: 'Sequência do Gol', description: 'Descubra o padrão',
    packsReward: 1, coinsReward: 50, xpReward: 30,
    question: 'Messi fez 2 gols no 1º jogo, 4 no 2º, 8 no 3º. Quantos no 4º?',
    options: ['10', '12', '16', '14'],
    correct: 2,
    explanation: 'A sequência dobra: 2 → 4 → 8 → 16. Padrão de multiplicação por 2.',
  },
  {
    id: 'logic-2', type: 'logic', emoji: '🧠', difficulty: 'easy',
    title: 'Algoritmo do Juiz', description: 'Lógica de decisão',
    packsReward: 1, coinsReward: 50, xpReward: 30,
    question: 'Time A tem 9 pts (3V 0E 0D). Time B tem 7 pts (2V 1E 0D). Quem lidera?',
    options: ['Time B', 'Time A', 'Empate de pontos', 'Impossível saber'],
    correct: 1,
    explanation: 'Time A tem 9 pontos (3×3=9). Time B tem 7 pontos (2×3+1=7). Time A lidera.',
  },
  {
    id: 'logic-3', type: 'logic', emoji: '🔢', difficulty: 'medium',
    title: 'Placar Binário', description: 'Linguagem dos computadores',
    packsReward: 1, coinsReward: 75, xpReward: 50,
    question: 'O número 1010 em binário vale quanto em decimal?',
    options: ['8', '10', '12', '6'],
    correct: 1,
    explanation: '1×8 + 0×4 + 1×2 + 0×1 = 8+2 = 10. Base 2!',
  },
  {
    id: 'logic-4', type: 'logic', emoji: '🎯', difficulty: 'medium',
    title: 'Loop do Treino', description: 'Entenda iterações',
    packsReward: 1, coinsReward: 75, xpReward: 50,
    question: 'for(let i = 0; i < 5; i++) {} — quantas vezes o loop executa?',
    options: ['4', '5', '6', 'Infinito'],
    correct: 1,
    explanation: 'i vai de 0 até 4 (enquanto i < 5), executando 5 vezes: 0,1,2,3,4.',
  },
  {
    id: 'logic-5', type: 'logic', emoji: '⚡', difficulty: 'hard',
    title: 'Condição do Técnico', description: 'Operadores lógicos',
    packsReward: 2, coinsReward: 100, xpReward: 80,
    question: 'if (gols > 0 && tempo < 90) — É verdadeiro quando gols=2 e tempo=45?',
    options: ['false', 'true', 'undefined', 'error'],
    correct: 1,
    explanation: '2 > 0 é true && 45 < 90 é true. true AND true = true!',
  },
  {
    id: 'logic-6', type: 'logic', emoji: '🏆', difficulty: 'hard',
    title: 'Recursão da Copa', description: 'Funções que chamam a si mesmas',
    packsReward: 2, coinsReward: 120, xpReward: 100,
    question: 'função(3) retorna 3×função(2), função(2) retorna 2×função(1), função(1) retorna 1. Quanto é função(3)?',
    options: ['3', '6', '9', '12'],
    correct: 1,
    explanation: 'função(1)=1, função(2)=2×1=2, função(3)=3×2=6. Fatorial recursivo!',
  },

  // ── HTML ──
  {
    id: 'html-1', type: 'html', emoji: '🏗️', difficulty: 'easy',
    title: 'Título do Estádio', description: 'Estrutura HTML',
    packsReward: 1, coinsReward: 50, xpReward: 30,
    question: 'Qual tag HTML cria um título grande (nível 1)?',
    options: ['<title>', '<h1>', '<header>', '<big>'],
    correct: 1,
    explanation: '<h1> é o maior heading HTML. <title> define o nome na aba do navegador.',
  },
  {
    id: 'html-2', type: 'html', emoji: '🔗', difficulty: 'easy',
    title: 'Link do Estádio', description: 'Atributos de link',
    packsReward: 1, coinsReward: 50, xpReward: 30,
    question: 'Qual atributo define o destino de um link <a>?',
    options: ['src', 'href', 'link', 'url'],
    correct: 1,
    explanation: '<a href="https://...">Clique aqui</a> — href é o "hyper reference".',
  },
  {
    id: 'html-3', type: 'html', emoji: '📸', difficulty: 'easy',
    title: 'Foto do Jogador', description: 'Imagens em HTML',
    packsReward: 1, coinsReward: 50, xpReward: 30,
    question: 'Para mostrar uma imagem usamos a tag:',
    options: ['<image>', '<photo>', '<img>', '<pic>'],
    correct: 2,
    explanation: '<img src="foto.jpg" alt="descrição"> é o jeito correto de inserir imagens.',
  },
  {
    id: 'html-4', type: 'html', emoji: '📋', difficulty: 'medium',
    title: 'Lista de Convocados', description: 'Listas HTML',
    packsReward: 1, coinsReward: 75, xpReward: 50,
    question: 'Uma lista ORDENADA (1, 2, 3...) usa qual tag?',
    options: ['<ul>', '<list>', '<ol>', '<dl>'],
    correct: 2,
    explanation: '<ol> = ordered list (numerada). <ul> = unordered list (com bolinhas).',
  },
  {
    id: 'html-5', type: 'html', emoji: '📝', difficulty: 'medium',
    title: 'Formulário de Inscrição', description: 'Campos de formulário',
    packsReward: 1, coinsReward: 75, xpReward: 50,
    question: 'Para campo de senha usamos type=?',
    options: ['text', 'secret', 'password', 'hidden'],
    correct: 2,
    explanation: '<input type="password"> esconde o texto digitado com asteriscos.',
  },
  {
    id: 'html-6', type: 'html', emoji: '🎬', difficulty: 'hard',
    title: 'Vídeo do Gol', description: 'Mídia em HTML5',
    packsReward: 2, coinsReward: 100, xpReward: 80,
    question: 'Qual atributo faz um vídeo HTML5 tocar automaticamente?',
    options: ['play="true"', 'autoplay', 'auto="start"', 'start="auto"'],
    correct: 1,
    explanation: '<video autoplay muted> — autoplay precisa de muted para funcionar em navegadores modernos.',
  },

  // ── CSS ──
  {
    id: 'css-1', type: 'css', emoji: '🎨', difficulty: 'easy',
    title: 'Cores do Time', description: 'Propriedades de cor',
    packsReward: 1, coinsReward: 50, xpReward: 30,
    question: 'Para mudar a cor do TEXTO em CSS usamos:',
    options: ['text-color', 'font-color', 'color', 'text'],
    correct: 2,
    explanation: 'color: red; muda a cor do texto. background-color muda o fundo.',
  },
  {
    id: 'css-2', type: 'css', emoji: '📐', difficulty: 'easy',
    title: 'Tamanho do Campo', description: 'Dimensões',
    packsReward: 1, coinsReward: 50, xpReward: 30,
    question: 'Qual propriedade CSS define a largura de um elemento?',
    options: ['height', 'size', 'width', 'length'],
    correct: 2,
    explanation: 'width: 100px; define a largura. height: 100px; define a altura.',
  },
  {
    id: 'css-3', type: 'css', emoji: '🎭', difficulty: 'medium',
    title: 'Animação do Gol', description: 'Keyframes CSS',
    packsReward: 1, coinsReward: 75, xpReward: 50,
    question: 'Para criar animações CSS usamos:',
    options: ['@transition', '@keyframes', '@animate', '@motion'],
    correct: 1,
    explanation: '@keyframes define os estados da animação. animation: nome 1s aplica.',
  },
  {
    id: 'css-4', type: 'css', emoji: '📦', difficulty: 'medium',
    title: 'Formação no Campo', description: 'Flexbox',
    packsReward: 1, coinsReward: 75, xpReward: 50,
    question: 'Para centralizar itens horizontalmente com Flexbox:',
    options: ['align-items: center', 'text-align: center', 'justify-content: center', 'margin: auto'],
    correct: 2,
    explanation: 'justify-content: center centraliza no eixo principal (horizontal por padrão).',
  },
  {
    id: 'css-5', type: 'css', emoji: '🌈', difficulty: 'hard',
    title: 'Uniforme Gradiente', description: 'Gradientes',
    packsReward: 2, coinsReward: 100, xpReward: 80,
    question: 'Como criar um gradiente verde→azul em CSS?',
    options: ['background: gradient(green, blue)', 'background: linear-gradient(green, blue)', 'background-color: green blue', 'color: gradient(to right, green, blue)'],
    correct: 1,
    explanation: 'background: linear-gradient(to right, green, blue); — pode incluir direção.',
  },
  {
    id: 'css-6', type: 'css', emoji: '✨', difficulty: 'hard',
    title: 'Sombra Neon', description: 'Box shadow avançado',
    packsReward: 2, coinsReward: 120, xpReward: 100,
    question: 'Qual propriedade CSS cria efeito de sombra/brilho?',
    options: ['glow', 'shadow', 'box-shadow', 'filter-shadow'],
    correct: 2,
    explanation: 'box-shadow: 0 0 20px #a855f7; cria o efeito neon roxo!',
  },

  // ── JAVASCRIPT ──
  {
    id: 'js-1', type: 'javascript', emoji: '⚡', difficulty: 'easy',
    title: 'Variável do Artilheiro', description: 'Declaração de variáveis',
    packsReward: 1, coinsReward: 50, xpReward: 30,
    question: 'Como declarar uma variável moderna em JavaScript?',
    options: ['var gols = 10', 'let gols = 10', 'int gols = 10', 'gols := 10'],
    correct: 1,
    explanation: 'let e const são modernos (ES6+). var é antigo. int é de outras linguagens.',
  },
  {
    id: 'js-2', type: 'javascript', emoji: '🔔', difficulty: 'easy',
    title: 'Alerta do Gol', description: 'Funções do navegador',
    packsReward: 1, coinsReward: 50, xpReward: 30,
    question: 'Qual função JavaScript mostra uma mensagem pop-up?',
    options: ['console.log()', 'alert()', 'show()', 'print()'],
    correct: 1,
    explanation: 'alert("GOL!") abre um pop-up. console.log() escreve no console do dev.',
  },
  {
    id: 'js-3', type: 'javascript', emoji: '📊', difficulty: 'medium',
    title: 'Array da Seleção', description: 'Métodos de array',
    packsReward: 1, coinsReward: 75, xpReward: 50,
    question: 'Qual método adiciona um item no FIM de um array?',
    options: ['add()', 'append()', 'push()', 'insert()'],
    correct: 2,
    explanation: 'array.push(item) adiciona no fim. array.unshift(item) adiciona no início.',
  },
  {
    id: 'js-4', type: 'javascript', emoji: '🎯', difficulty: 'medium',
    title: 'Arrow Function', description: 'Funções modernas',
    packsReward: 1, coinsReward: 75, xpReward: 50,
    question: 'const golear = (n) => n * 2; — quanto retorna golear(5)?',
    options: ['5', '10', '25', 'undefined'],
    correct: 1,
    explanation: 'golear(5) = 5 * 2 = 10. Arrow functions retornam implicitamente em uma linha.',
  },
  {
    id: 'js-5', type: 'javascript', emoji: '🏅', difficulty: 'hard',
    title: 'Objeto do Jogador', description: 'Objetos e propriedades',
    packsReward: 2, coinsReward: 100, xpReward: 80,
    question: 'const p = {nome: "Vini", gols: 25}; Como acessar os gols?',
    options: ['p[gols]', 'p.gols', 'p->gols', 'p::gols'],
    correct: 1,
    explanation: 'p.gols (dot notation) ou p["gols"] (bracket notation) funcionam.',
  },
  {
    id: 'js-6', type: 'javascript', emoji: '🌐', difficulty: 'hard',
    title: 'Fetch da Copa', description: 'Requisições assíncronas',
    packsReward: 2, coinsReward: 150, xpReward: 100,
    question: 'fetch() é usado para:',
    options: ['Salvar arquivos locais', 'Buscar dados de uma API', 'Criar animações', 'Manipular CSS'],
    correct: 1,
    explanation: 'fetch("https://api.example.com/players") busca dados da internet de forma assíncrona.',
  },
];

export const CHALLENGE_TYPE_CONFIG: Record<ChallengeType, { label: string; emoji: string; color: string }> = {
  logic:      { label: 'Lógica',       emoji: '🧩', color: 'from-cyan-400 to-blue-500' },
  html:       { label: 'HTML',         emoji: '🏗️', color: 'from-orange-400 to-red-500' },
  css:        { label: 'CSS',          emoji: '🎨', color: 'from-pink-400 to-violet-500' },
  javascript: { label: 'JavaScript',   emoji: '⚡', color: 'from-yellow-400 to-orange-500' },
};

export const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string }> = {
  easy:   { label: 'Fácil',  color: 'text-emerald-400' },
  medium: { label: 'Médio',  color: 'text-yellow-400' },
  hard:   { label: 'Difícil',color: 'text-red-400' },
};
