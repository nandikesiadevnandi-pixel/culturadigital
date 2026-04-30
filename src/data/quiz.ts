export type QuizQuestion =
  | {
      number: number;
      type: "multiple_choice";
      prompt: string;
      options: { key: "A" | "B" | "C" | "D"; text: string }[];
      correct: "A" | "B" | "C" | "D";
      acceptAll?: boolean;
    }
  | {
      number: number;
      type: "open" | "reflective";
      prompt: string;
    };

export const quizQuestions: QuizQuestion[] = [
  { number: 1, type: "open", prompt: "O que é tecnologia? Explique com suas próprias palavras." },
  {
    number: 2,
    type: "multiple_choice",
    prompt: "Qual das opções abaixo é um exemplo de tecnologia?",
    options: [
      { key: "A", text: "Um caderno" },
      { key: "B", text: "Um celular" },
      { key: "C", text: "Uma árvore" },
      { key: "D", text: "Um lápis de cor" },
    ],
    correct: "B",
    acceptAll: true,
  },
  { number: 3, type: "open", prompt: "Explique o que é lógica de programação de forma simples." },
  {
    number: 4,
    type: "multiple_choice",
    prompt: "Qual dessas opções representa uma sequência lógica correta?",
    options: [
      { key: "A", text: "Dormir → Acordar → Tomar café" },
      { key: "B", text: "Tomar café → Acordar → Dormir" },
      { key: "C", text: "Acordar → Tomar café → Ir para escola" },
      { key: "D", text: "Ir para escola → Dormir → Acordar" },
    ],
    correct: "C",
  },
  { number: 5, type: "open", prompt: "Escreva uma sequência de passos para fazer um bolo simples." },
  {
    number: 6,
    type: "multiple_choice",
    prompt: "Qual dessas alternativas mostra uma rotina organizada?",
    options: [
      { key: "A", text: "Fazer tudo ao mesmo tempo sem ordem" },
      { key: "B", text: "Seguir uma sequência de atividades durante o dia" },
      { key: "C", text: "Fazer apenas o que quiser na hora" },
      { key: "D", text: "Não planejar o dia" },
    ],
    correct: "B",
  },
  { number: 7, type: "open", prompt: "O que significa “seguir instruções” em uma atividade digital?" },
  {
    number: 8,
    type: "multiple_choice",
    prompt: "Na lógica de programação, o que é um “passo a passo”?",
    options: [
      { key: "A", text: "Um erro no sistema" },
      { key: "B", text: "Uma sequência de instruções" },
      { key: "C", text: "Um tipo de computador" },
      { key: "D", text: "Um jogo" },
    ],
    correct: "B",
  },
  { number: 9, type: "open", prompt: "Dê um exemplo de tecnologia que você usa no seu dia a dia e explique para que serve." },
  {
    number: 10,
    type: "multiple_choice",
    prompt: "Qual das opções abaixo mais se aproxima da ideia de cultura digital?",
    options: [
      { key: "A", text: "Apenas usar papel e caneta" },
      { key: "B", text: "Usar tecnologia para aprender, comunicar e resolver problemas" },
      { key: "C", text: "Ficar sem fazer nada" },
      { key: "D", text: "Apenas jogar jogos sem aprender nada" },
    ],
    correct: "B",
  },
  {
    number: 11,
    type: "reflective",
    prompt:
      "Descreva um exemplo da sua rotina diária (como acordar, estudar, brincar, etc.) e explique como essa rotina pode ser representada como um passo a passo (como na lógica de programação ou na cultura digital).",
  },
];

export const MAX_AUTO_SCORE = quizQuestions.filter((q) => q.type === "multiple_choice").length; // 5
export const MAX_MANUAL_POINTS_PER_OPEN = 2; // grade 0/1/2 per open question
export const OPEN_QUESTION_COUNT = quizQuestions.filter((q) => q.type !== "multiple_choice").length; // 6
export const MAX_MANUAL_SCORE = OPEN_QUESTION_COUNT * MAX_MANUAL_POINTS_PER_OPEN; // 12
export const MAX_TOTAL_SCORE = MAX_AUTO_SCORE + MAX_MANUAL_SCORE; // 17
