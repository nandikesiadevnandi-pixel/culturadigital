export type QuizQuestion = {
  number: number;
  type: "multiple_choice";
  prompt: string;
  options: { key: "A" | "B" | "C" | "D" | "E"; text: string }[];
  correct: "A" | "B" | "C" | "D" | "E";
  acceptAll?: boolean;
};

export const quizQuestions: QuizQuestion[] = [
  {
    number: 1,
    type: "multiple_choice",
    prompt: "Qual das opções abaixo é um exemplo de tecnologia?",
    options: [
      { key: "A", text: "Um caderno" },
      { key: "B", text: "Um celular" },
      { key: "C", text: "Um lápis" },
      { key: "D", text: "Uma roda" },
      { key: "E", text: "Uma cadeira" },
    ],
    correct: "B",
    acceptAll: true,
  },
  {
    number: 2,
    type: "multiple_choice",
    prompt: "Qual dessas opções representa uma sequência lógica correta?",
    options: [
      { key: "A", text: "Dormir → Acordar → Tomar café" },
      { key: "B", text: "Tomar café → Acordar → Dormir" },
      { key: "C", text: "Acordar → Tomar café → Ir para escola" },
      { key: "D", text: "Ir para escola → Dormir → Acordar" },
      { key: "E", text: "Tomar café → Dormir → Ir para escola" },
    ],
    correct: "C",
  },
  {
    number: 3,
    type: "multiple_choice",
    prompt: "Qual dessas alternativas mostra uma rotina organizada?",
    options: [
      { key: "A", text: "Fazer tudo ao mesmo tempo sem ordem" },
      { key: "B", text: "Seguir uma sequência de atividades durante o dia" },
      { key: "C", text: "Fazer apenas o que quiser na hora" },
      { key: "D", text: "Não planejar o dia" },
      { key: "E", text: "Dormir o dia todo sem fazer nada" },
    ],
    correct: "B",
  },
  {
    number: 4,
    type: "multiple_choice",
    prompt: "Na lógica de programação, o que é um “passo a passo”?",
    options: [
      { key: "A", text: "Um erro no sistema" },
      { key: "B", text: "Uma sequência de instruções" },
      { key: "C", text: "Um tipo de computador" },
      { key: "D", text: "Um jogo" },
      { key: "E", text: "Um aplicativo" },
    ],
    correct: "B",
  },
  {
    number: 5,
    type: "multiple_choice",
    prompt: "Qual das opções abaixo mais se aproxima da ideia de cultura digital?",
    options: [
      { key: "A", text: "Apenas usar papel e caneta" },
      { key: "B", text: "Usar tecnologia para aprender, comunicar e resolver problemas" },
      { key: "C", text: "Ficar sem fazer nada" },
      { key: "D", text: "Apenas jogar jogos sem aprender nada" },
      { key: "E", text: "Evitar qualquer aparelho eletrônico" },
    ],
    correct: "B",
  },
  // ===== Tecnologia =====
  {
    number: 6,
    type: "multiple_choice",
    prompt: "Qual destes aparelhos NÃO é considerado uma tecnologia digital?",
    options: [
      { key: "A", text: "Tablet" },
      { key: "B", text: "Notebook" },
      { key: "C", text: "Martelo de madeira" },
      { key: "D", text: "Smartphone" },
      { key: "E", text: "Smart TV" },
    ],
    correct: "C",
  },
  {
    number: 7,
    type: "multiple_choice",
    prompt: "Para que serve um navegador de internet (como Chrome ou Firefox)?",
    options: [
      { key: "A", text: "Para ouvir música offline apenas" },
      { key: "B", text: "Para acessar sites e páginas da web" },
      { key: "C", text: "Para imprimir documentos" },
      { key: "D", text: "Para tirar fotos" },
      { key: "E", text: "Para carregar a bateria" },
    ],
    correct: "B",
  },
  {
    number: 8,
    type: "multiple_choice",
    prompt: "O que é um aplicativo (app)?",
    options: [
      { key: "A", text: "Um tipo de bateria" },
      { key: "B", text: "Um programa que roda no celular ou computador" },
      { key: "C", text: "Um tipo de tela" },
      { key: "D", text: "Uma rede social específica" },
      { key: "E", text: "Um cabo de energia" },
    ],
    correct: "B",
  },
  // ===== Fake news =====
  {
    number: 9,
    type: "multiple_choice",
    prompt: "O que são “fake news”?",
    options: [
      { key: "A", text: "Notícias verdadeiras de jornais" },
      { key: "B", text: "Notícias falsas que se passam por verdadeiras" },
      { key: "C", text: "Vídeos engraçados" },
      { key: "D", text: "Jogos online" },
      { key: "E", text: "Mensagens da família" },
    ],
    correct: "B",
  },
  {
    number: 10,
    type: "multiple_choice",
    prompt: "Você recebe uma notícia incrível no WhatsApp. Qual a atitude correta?",
    options: [
      { key: "A", text: "Repassar imediatamente para todos os grupos" },
      { key: "B", text: "Acreditar sem pensar" },
      { key: "C", text: "Conferir em sites confiáveis antes de compartilhar" },
      { key: "D", text: "Apagar o celular" },
      { key: "E", text: "Brigar com quem enviou" },
    ],
    correct: "C",
  },
  {
    number: 11,
    type: "multiple_choice",
    prompt: "Qual destes é um sinal de que uma notícia pode ser FALSA?",
    options: [
      { key: "A", text: "Tem fonte confiável citada" },
      { key: "B", text: "Aparece em vários jornais conhecidos" },
      { key: "C", text: "Pede para você compartilhar urgente com todos" },
      { key: "D", text: "Tem data e autor" },
      { key: "E", text: "Tem fotos com legenda real" },
    ],
    correct: "C",
  },
  {
    number: 12,
    type: "multiple_choice",
    prompt: "O que é “checar a fonte” de uma notícia?",
    options: [
      { key: "A", text: "Procurar de onde a informação veio e se é confiável" },
      { key: "B", text: "Aumentar o volume do vídeo" },
      { key: "C", text: "Apagar a notícia" },
      { key: "D", text: "Copiar e colar em outro grupo" },
      { key: "E", text: "Tirar print da tela" },
    ],
    correct: "A",
  },
  // ===== Segurança da informação =====
  {
    number: 13,
    type: "multiple_choice",
    prompt: "Qual destas é uma senha SEGURA?",
    options: [
      { key: "A", text: "123456" },
      { key: "B", text: "senha" },
      { key: "C", text: "seu próprio nome" },
      { key: "D", text: "Lua@2026!azul" },
      { key: "E", text: "abcdef" },
    ],
    correct: "D",
  },
  {
    number: 14,
    type: "multiple_choice",
    prompt: "Um desconhecido pede sua senha pela internet. O que fazer?",
    options: [
      { key: "A", text: "Mandar na hora" },
      { key: "B", text: "Nunca compartilhar e avisar um adulto" },
      { key: "C", text: "Mandar só metade" },
      { key: "D", text: "Trocar a senha e mandar a nova" },
      { key: "E", text: "Mandar e pedir segredo" },
    ],
    correct: "B",
  },
  {
    number: 15,
    type: "multiple_choice",
    prompt: "O que é um vírus de computador?",
    options: [
      { key: "A", text: "Um tipo de jogo educativo" },
      { key: "B", text: "Um programa que pode danificar o computador" },
      { key: "C", text: "Uma parte do teclado" },
      { key: "D", text: "Um tipo de e-mail" },
      { key: "E", text: "Uma rede de internet" },
    ],
    correct: "B",
  },
  {
    number: 16,
    type: "multiple_choice",
    prompt: "Você não deve compartilhar na internet:",
    options: [
      { key: "A", text: "Seu desenho favorito" },
      { key: "B", text: "Sua endereço, telefone e senhas" },
      { key: "C", text: "Uma foto da paisagem" },
      { key: "D", text: "Uma piada" },
      { key: "E", text: "Um emoji" },
    ],
    correct: "B",
  },
  // ===== Raciocínio lógico =====
  {
    number: 17,
    type: "multiple_choice",
    prompt: "Complete a sequência: 2, 4, 6, 8, ___",
    options: [
      { key: "A", text: "9" },
      { key: "B", text: "10" },
      { key: "C", text: "11" },
      { key: "D", text: "12" },
      { key: "E", text: "7" },
    ],
    correct: "B",
  },
  {
    number: 18,
    type: "multiple_choice",
    prompt: "Se HOJE é segunda, que dia será DEPOIS DE AMANHÃ?",
    options: [
      { key: "A", text: "Terça" },
      { key: "B", text: "Quarta" },
      { key: "C", text: "Quinta" },
      { key: "D", text: "Sexta" },
      { key: "E", text: "Domingo" },
    ],
    correct: "B",
  },
  {
    number: 19,
    type: "multiple_choice",
    prompt: "Qual figura NÃO pertence ao grupo: círculo, quadrado, triângulo, banana, retângulo?",
    options: [
      { key: "A", text: "Círculo" },
      { key: "B", text: "Quadrado" },
      { key: "C", text: "Triângulo" },
      { key: "D", text: "Banana" },
      { key: "E", text: "Retângulo" },
    ],
    correct: "D",
  },
  // ===== Lógica de programação =====
  {
    number: 20,
    type: "multiple_choice",
    prompt: "O que é um “algoritmo”?",
    options: [
      { key: "A", text: "Um tipo de robô" },
      { key: "B", text: "Uma sequência de passos para resolver um problema" },
      { key: "C", text: "Um aparelho de TV" },
      { key: "D", text: "Um vírus" },
      { key: "E", text: "Uma rede social" },
    ],
    correct: "B",
  },
  {
    number: 21,
    type: "multiple_choice",
    prompt: "Em programação, um “laço de repetição” serve para:",
    options: [
      { key: "A", text: "Apagar o computador" },
      { key: "B", text: "Repetir uma ação várias vezes" },
      { key: "C", text: "Aumentar o volume" },
      { key: "D", text: "Trocar a cor da tela" },
      { key: "E", text: "Desligar a internet" },
    ],
    correct: "B",
  },
  {
    number: 22,
    type: "multiple_choice",
    prompt: "Um robô só anda quando você dá o comando “andar”. Se você NÃO der o comando, ele:",
    options: [
      { key: "A", text: "Anda sozinho" },
      { key: "B", text: "Fica parado" },
      { key: "C", text: "Desliga a casa" },
      { key: "D", text: "Vira outro robô" },
      { key: "E", text: "Some" },
    ],
    correct: "B",
  },
];

export const MAX_AUTO_SCORE = quizQuestions.length; // 22
export const MAX_MANUAL_POINTS_PER_OPEN = 0;
export const OPEN_QUESTION_COUNT = 0;
export const MAX_MANUAL_SCORE = 0;
export const MAX_TOTAL_SCORE = MAX_AUTO_SCORE;
