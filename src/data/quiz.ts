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
];

export const MAX_AUTO_SCORE = quizQuestions.length; // 5
export const MAX_MANUAL_POINTS_PER_OPEN = 0;
export const OPEN_QUESTION_COUNT = 0;
export const MAX_MANUAL_SCORE = 0;
export const MAX_TOTAL_SCORE = MAX_AUTO_SCORE; // 5
