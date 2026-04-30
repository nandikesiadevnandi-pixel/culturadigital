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
    prompt: "O que é tecnologia?",
    options: [
      { key: "A", text: "Apenas aparelhos eletrônicos modernos" },
      { key: "B", text: "Tudo que o ser humano cria para facilitar a vida e resolver problemas" },
      { key: "C", text: "Somente computadores e celulares" },
      { key: "D", text: "Algo que só existe na internet" },
      { key: "E", text: "Apenas robôs e máquinas industriais" },
    ],
    correct: "B",
  },
  {
    number: 2,
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
    number: 3,
    type: "multiple_choice",
    prompt: "O que é lógica de programação?",
    options: [
      { key: "A", text: "Um tipo de computador" },
      { key: "B", text: "Um aplicativo de celular" },
      { key: "C", text: "Uma forma de organizar pensamentos em uma sequência de passos para resolver um problema" },
      { key: "D", text: "Um jogo eletrônico" },
      { key: "E", text: "Um tipo de internet" },
    ],
    correct: "C",
  },
  {
    number: 4,
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
    number: 5,
    type: "multiple_choice",
    prompt: "Qual é a sequência correta de passos para fazer um bolo simples?",
    options: [
      { key: "A", text: "Assar → Misturar ingredientes → Servir" },
      { key: "B", text: "Separar ingredientes → Misturar → Colocar na forma → Assar → Servir" },
      { key: "C", text: "Servir → Assar → Misturar" },
      { key: "D", text: "Comer → Misturar → Assar" },
      { key: "E", text: "Colocar na forma → Servir → Misturar" },
    ],
    correct: "B",
  },
  {
    number: 6,
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
    number: 7,
    type: "multiple_choice",
    prompt: "O que significa “seguir instruções” em uma atividade digital?",
    options: [
      { key: "A", text: "Fazer o que quiser sem ler nada" },
      { key: "B", text: "Apenas observar a tela" },
      { key: "C", text: "Ler e executar os passos na ordem certa para concluir a atividade" },
      { key: "D", text: "Desligar o computador" },
      { key: "E", text: "Pedir para outra pessoa fazer" },
    ],
    correct: "C",
  },
  {
    number: 8,
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
    number: 9,
    type: "multiple_choice",
    prompt: "Qual destes é um exemplo de tecnologia usada no dia a dia e sua função correta?",
    options: [
      { key: "A", text: "Geladeira – serve para conservar alimentos" },
      { key: "B", text: "Celular – serve apenas para brincar" },
      { key: "C", text: "Televisão – serve para cozinhar" },
      { key: "D", text: "Computador – serve apenas para dormir" },
      { key: "E", text: "Liquidificador – serve para lavar roupa" },
    ],
    correct: "A",
  },
  {
    number: 10,
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
  {
    number: 11,
    type: "multiple_choice",
    prompt:
      "Sobre representar a rotina diária como um passo a passo (lógica de programação), qual alternativa está correta?",
    options: [
      { key: "A", text: "A rotina não tem nada a ver com lógica de programação" },
      { key: "B", text: "Só programadores têm rotina organizada" },
      { key: "C", text: "Acordar → escovar os dentes → tomar café → estudar → brincar é um exemplo de passo a passo da rotina" },
      { key: "D", text: "Rotina é fazer tudo de forma desordenada" },
      { key: "E", text: "Rotina só existe em computadores" },
    ],
    correct: "C",
  },
];

export const MAX_AUTO_SCORE = quizQuestions.length; // 11
export const MAX_MANUAL_POINTS_PER_OPEN = 0;
export const OPEN_QUESTION_COUNT = 0;
export const MAX_MANUAL_SCORE = 0;
export const MAX_TOTAL_SCORE = MAX_AUTO_SCORE; // 11
