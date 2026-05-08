import cakeLogic from "@/assets/week1/cake-logic.png";
import classroom1 from "@/assets/week2/classroom-1.jpeg";
import classroom2 from "@/assets/week2/classroom-2.jpeg";
import video1 from "@/assets/week2/video-1.mp4";
import video2 from "@/assets/week2/video-2.mp4";
import video3 from "@/assets/week2/video-3.mp4";
import video4 from "@/assets/week2/video-4.mp4";
import week3Video1 from "@/assets/week3/avaliacao-1.mp4";
import ernesto1 from "@/assets/week5/ernesto-1.png";
import ernesto2 from "@/assets/week5/ernesto-2.png";
import ernesto3 from "@/assets/week5/ernesto-3.png";
import ernesto4 from "@/assets/week5/ernesto-4.png";

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
  {
    number: 3,
    date: "30/04 — Sexta-feira",
    title: "Avaliação: o que aprenderam sobre tecnologia e lógica",
    emoji: "📝",
    color: "green",
    objective:
      "Revisar de forma divertida tudo o que vimos até aqui — receita do bolo, aluno-robô, Scratch — e aplicar uma avaliação para medir o que a turma realmente aprendeu sobre tecnologia e lógica de programação.",
    taught:
      "Retomamos a 'receita do bolo invertida', em que os alunos precisavam colocar os comandos na ordem certa para o resultado dar certo. Reforçamos a brincadeira do robô: um colega imitava um robô e só executava comandos exatos dados pela turma, mostrando na prática o que é lógica de programação. Também revisamos o Scratch — suas funções, blocos e como gerar resultados combinando comandos certos. Tudo isso caiu na avaliação: o que é tecnologia, o que é lógica, como funciona o Scratch e como pensar em passos.",
    activities: [
      "Aquecimento com a 'receita do bolo invertida' — turma reorganizando os passos na ordem correta",
      "Rodada do aluno-robô: colegas davam comandos certos para o 'robô' chegar ao objetivo",
      "Revisão rápida do Scratch: blocos, eventos e como combinar comandos para gerar resultados",
      "Aplicação da avaliação online com 11 questões de múltipla escolha sobre tecnologia, lógica e Scratch",
      "Resultado liberado na hora — cada aluno viu sua nota e a turma acompanhou o ranking ao vivo. Os 5 melhores ganharam chocolate da prof Késia como gratificação pelo empenho! 🍫",
    ],
    results:
      "A turma se saiu muito bem! As brincadeiras de aquecimento ajudaram a destravar o raciocínio e a maioria conseguiu boas notas. Os resultados estão registrados na página de Ranking e no card de Resultado das avaliações.",
    difficulties:
      "Algumas perguntas envolviam diferenciar 'tecnologia' de 'lógica' — conceitos próximos. As atividades de aquecimento foram essenciais para esclarecer essas dúvidas antes da prova.",
    reflection:
      "Foi gratificante ver na avaliação o quanto eles evoluíram desde a primeira aula. Eles entraram achando que 'tecnologia é só celular' e saíram entendendo que tecnologia é tudo que o ser humano cria para resolver problemas — e que lógica de programação está em cada passo do dia a dia.",
    media: [
      { type: "video", src: week3Video1, caption: "Turma concentrada durante a avaliação 📝" },
    ],
  },
  {
    number: 4,
    date: "05/05 — Segunda-feira",
    title: "Ernesto Dorneles: cuidados com o notebook e segurança digital",
    emoji: "💻",
    color: "yellow",
    objective:
      "Iniciar o ciclo na EMEF Ernesto Dorneles construindo, com 5º, 6º, 7º e 8º anos, uma cultura de cuidado com os equipamentos e os primeiros conceitos de segurança no uso da tecnologia.",
    taught:
      "Como funciona um notebook (ligar/desligar, área de trabalho, teclado, touchpad e navegador), protocolo de responsabilidade — cada aluno recebeu um número fixo e ficará sempre com o mesmo notebook — e o conceito de segurança digital: senhas fortes, dados pessoais, links suspeitos e contatos desconhecidos.",
    activities: [
      "Entrega dos notebooks e atribuição de um número fixo para cada estudante (sempre responsável pelo mesmo equipamento)",
      "Combinados de transporte, abertura, guarda e limpeza dos aparelhos",
      "Reconhecimento prático das funções básicas do notebook",
      "Roda de conversa: o que é segurança quando estamos usando tecnologia?",
      "Trabalho em grupos sobre segurança digital — cada grupo construiu suas próprias dicas para se proteger online",
    ],
    results:
      "A turma assumiu o cuidado com o equipamento como algo deles — o número virou identidade. Nos grupos, surgiram ótimas reflexões sobre senhas, golpes e o que NÃO compartilhar na internet.",
    difficulties:
      "Por ser a primeira aula, foi preciso bastante tempo para combinados e para todos se familiarizarem com o notebook antes de partir para a parte conceitual.",
    reflection:
      "Começar pelo cuidado e pela segurança é começar pelo respeito — ao equipamento, a si mesmo e aos colegas. A turma se mostrou super responsável e curiosa, base perfeita para as próximas oficinas.",
    media: [
      { type: "image", src: ernesto1, caption: "Turma toda na ativa nos primeiros notebooks 💻" },
      { type: "image", src: ernesto2, caption: "Acompanhando de perto cada grupo 👩‍🏫" },
      { type: "image", src: ernesto3, caption: "Explorando juntos as funções do notebook 🔍" },
      { type: "image", src: ernesto4, caption: "Trabalho em grupo sobre segurança digital 🛡️" },
    ],
  },
  {
    number: 5,
    date: "07/05 — Quinta-feira",
    title: "Dante Bertoluci: entrada, saída e SE… ENTÃO no Scratch (Jogo da Maçã)",
    emoji: "🍎",
    color: "pink",
    objective:
      "Aprofundar a lógica de programação no Scratch trabalhando blocos de entrada e saída e introduzindo a estrutura condicional 'SE… ENTÃO', que permite ao programa tomar decisões.",
    taught:
      "Eventos de entrada (teclado e mouse) e respostas do palco como saída; condição como uma pergunta que o programa faz; e como o bloco 'SE… ENTÃO' executa uma ação só quando a condição é verdadeira. Tudo aplicado na construção do Jogo da Maçã.",
    activities: [
      "Revisão rápida de palco, sprites e blocos de eventos",
      "Apresentação dos blocos de entrada (setas do teclado) e de saída (movimento, som, pontuação)",
      "Explicação da estrutura SE… ENTÃO com exemplos do dia a dia ('SE chover, ENTÃO levo guarda-chuva')",
      "Construção guiada do Jogo da Maçã: o cesto se move com as setas (entrada) e, SE tocar na maçã, ENTÃO ela some, soma 1 ponto e reaparece em posição aleatória (saída)",
      "Cada aluno personalizou seu jogo — trocou personagens, cenário e regras de pontuação",
    ],
    results:
      "A galera entendeu na prática que programar é ensinar o computador a decidir. O Jogo da Maçã rodando na tela com a pontuação aumentando foi a 'virada de chave' — todos viram a condição funcionando.",
    difficulties:
      "No começo confundiam onde encaixar o bloco SE… ENTÃO dentro do 'sempre'. Resolvemos passo a passo, mostrando que a condição precisa ser checada o tempo todo.",
    reflection:
      "Quando o jogo deles começa a reagir sozinho às ações, eles percebem o poder da lógica. Saímos da aula com a turma já pensando em novas condições para criar — exatamente o pensamento computacional acontecendo.",
  },
];
