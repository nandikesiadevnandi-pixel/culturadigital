import cakeLogic from "@/assets/week1/cake-logic.png";
import classroom1 from "@/assets/week2/classroom-1.jpeg";
import classroom2 from "@/assets/week2/classroom-2.jpeg";
import video1 from "@/assets/week2/video-1.mp4";
import video2 from "@/assets/week2/video-2.mp4";
import video3 from "@/assets/week2/video-3.mp4";
import video4 from "@/assets/week2/video-4.mp4";

export type MediaItem = {
  type: "image" | "video";
  src: string;
  caption?: string;
};

export type Week = {
  number: number;
  date: string;
  title: string;
  emoji: string;
  color: "purple" | "blue" | "yellow" | "green" | "pink";
  objective: string;
  taught: string;
  activities: string[];
  results: string;
  difficulties: string;
  reflection: string;
  media?: MediaItem[];
};

export const weeks: Week[] = [
  {
    number: 1,
    date: "Sexta-feira",
    title: "Introdução à lógica de programação — a receita do bolo",
    emoji: "🎂",
    color: "purple",
    objective:
      "Apresentar a lógica de programação de forma lúdica, mostrando que programar é, antes de tudo, pensar em passos claros e na ordem certa.",
    taught:
      "O conceito de algoritmo, sequência de comandos, importância da ordem das instruções e como pequenas trocas mudam todo o resultado. Tudo sem computador — só com imaginação, papel e o corpo.",
    activities: [
      "Aula da 'receita do bolo errada': apresentei os passos fora de ordem e perguntei o que aconteceria",
      "Os alunos corrigiram a sequência da receita — todos acertaram com facilidade!",
      "Brincadeira do aluno-robô: um aluno virou 'robô' e só obedecia comandos exatos da turma",
      "Cada aluno escreveu em uma folha o que entendeu por lógica de programação, usando uma rotina do dia a dia (escovar os dentes, tomar banho, fazer um lanche) descrita passo a passo",
    ],
    results:
      "Engajamento altíssimo. A turma entendeu rapidinho que computador é literal e que precisamos ser claros. As rotinas escritas mostraram compreensão real do conceito de algoritmo.",
    difficulties:
      "No início alguns pulavam etapas óbvias (como 'pegar a escova' antes de 'escovar'). A brincadeira do robô ajudou a perceber esses 'buracos' no raciocínio.",
    reflection:
      "Foi uma das aulas mais divertidas — risadas o tempo todo com o aluno-robô. Eles saíram entendendo que já pensam como programadores no dia a dia. Começar pelo concreto, sem tela, faz toda a diferença.",
    media: [
      {
        type: "image",
        src: cakeLogic,
        caption: "Resumo visual da aula: a receita do bolo virou algoritmo 🎂✨",
      },
    ],
  },
  {
    number: 2,
    date: "24/04 — Sexta-feira",
    title: "Contas Google e primeiro contato com Scratch",
    emoji: "🎮",
    color: "blue",
    objective:
      "Dar acesso à identidade digital criando contas Google de forma segura e dar o primeiro mergulho na lógica de programação na prática, construindo o primeirinho jogo no Scratch passo a passo.",
    taught:
      "Criação de conta Google, senhas seguras e cuidados com dados pessoais. Em seguida, mergulhamos de cabeça na lógica de programação no Scratch: o que é programação em blocos, palco, sprites, eventos, sequência, repetição e como combinar blocos para dar vida a um personagem. Tudo aplicado na construção do primeiro jogo da turma, feito junto, comando por comando.",
    activities: [
      "Criação supervisionada da conta Google e definição de senhas seguras",
      "Primeiro e-mail entre colegas e exploração rápida do Google Drive",
      "Tour pela interface do Scratch: palco, blocos, eventos e sprites",
      "Construção do primeiro jogo seguindo orientações passo a passo — todos acompanhando juntos no telão",
      "Cada aluno personalizou o próprio jogo no Chromebook, mudando cenário, personagem e movimentos",
    ],
    results:
      "Foi mágico! Cada Chromebook virou um mini estúdio de jogos. Seguindo o passo a passo, a turma inteira conseguiu rodar o primeiro jogo — e logo começaram a criar variações próprias, descobrindo na prática como a lógica de programação funciona.",
    difficulties:
      "Algumas contas precisaram de ajuste por causa da verificação de idade, e encaixar os blocos na ordem certa exigiu atenção. Mas o passo a passo no telão ajudou todo mundo a chegar junto no resultado.",
    reflection:
      "Essa foi a aula em que eles deixaram de só usar a tecnologia para começar a criar com ela. Ver a turma comemorando o próprio jogo rodando na tela é a prova de que a lógica de programação, quando bem guiada, vira diversão pura.",
    media: [
      { type: "image", src: classroom1, caption: "Turma inteira programando junto no Scratch 💻" },
      { type: "image", src: classroom2, caption: "O primeiro jogo ganhando vida no telão 🎮" },
      { type: "video", src: video1, caption: "Construindo o jogo passo a passo ✨" },
      { type: "video", src: video2, caption: "Cada Chromebook, um mini estúdio de games 🎯" },
      { type: "video", src: video3, caption: "Lógica de programação na prática 🧠" },
      { type: "video", src: video4, caption: "A galera testando suas criações 🚀" },
    ],
  },
];
