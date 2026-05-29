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
import dante1 from "@/assets/week5/dante-1.mp4";
import dante2 from "@/assets/week5/dante-2.mp4";
import week6_1 from "@/assets/week6/aula-1.jpeg";
import week6_2 from "@/assets/week6/aula-2.jpeg";
import week6_3 from "@/assets/week6/aula-3.jpeg";
import week6_4 from "@/assets/week6/aula-4.jpeg";
import week6_5 from "@/assets/week6/aula-5.jpeg";
import week7_1 from "@/assets/week7/aula-1.jpeg";
import week7_2 from "@/assets/week7/aula-2.jpeg";
import week7_3 from "@/assets/week7/aula-3.jpeg";
import week7_4 from "@/assets/week7/aula-4.jpeg";
import week7_5 from "@/assets/week7/aula-5.jpeg";
import week7_6 from "@/assets/week7/aula-6.jpeg";
import week7_7 from "@/assets/week7/aula-7.jpeg";
import week7_8 from "@/assets/week7/aula-8.jpeg";
import week8AlbumDemo from "@/assets/week8/album-copa-demo.mp4";

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
    media: [
      { type: "video", src: dante1, caption: "Turma construindo o Jogo da Maçã no Scratch 🍎" },
      { type: "video", src: dante2, caption: "SE tocar na maçã, ENTÃO soma ponto! 🎯" },
    ],
  },
  {
    number: 6,
    date: "11/05 — Segunda-feira",
    title: "O que é Tecnologia da Informação + Scratch na prática",
    emoji: "🧠",
    color: "blue",
    objective:
      "Construir o conceito de Tecnologia da Informação (TI) e mostrar, na prática, como ela aparece no Scratch quando criamos jogos que recebem dados, processam e devolvem um resultado na tela.",
    taught:
      "O que é Tecnologia da Informação: o conjunto de recursos (hardware, software e pessoas) usado para coletar, armazenar, processar e transmitir informação. Diferença entre dado e informação, exemplos do dia a dia (WhatsApp, Google, jogos, escola) e como o Scratch é, ele mesmo, uma ferramenta de TI: a gente dá uma entrada (tecla, clique), ele processa (blocos de lógica) e devolve uma saída (movimento, som, pontuação).",
    activities: [
      "Roda de conversa: 'o que vocês acham que é Tecnologia da Informação?' — quadro cheio de exemplos da turma",
      "Explicação com exemplos reais: a escola usa TI no diário online, no WhatsApp dos pais, no Google de pesquisa",
      "Diferenciação prática entre dado (37) e informação (37 °C de febre)",
      "Volta ao Scratch: cada aluno abriu seu projeto e identificou onde está a entrada, o processamento e a saída",
      "Continuação dos jogos pessoais no Scratch — alguns evoluindo o Jogo da Maçã, outros criando novos projetos com o que aprenderam",
    ],
    results:
      "A turma percebeu que TI não é 'coisa de empresa grande' — está em tudo que eles já usam. E, ao olhar o próprio projeto Scratch com esse olhar, entenderam que já estão produzindo Tecnologia da Informação, não só consumindo.",
    difficulties:
      "A diferença entre dado e informação confundiu alguns no início. Resolvemos com vários exemplos do cotidiano até a ficha cair de vez.",
    reflection:
      "Foi lindo ver eles conectarem o conceito ao que já fazem no Scratch. Quando entendem que o jogo deles é TI de verdade, mudam a postura: passam de usuários para criadores. É exatamente isso que eu quero plantar.",
    media: [
      { type: "image", src: week6_1, caption: "Galera no Scratch aplicando o conceito de TI 💻" },
      { type: "image", src: week6_2, caption: "Entrada, processamento e saída acontecendo na tela 🎮" },
      { type: "image", src: week6_3, caption: "Turma concentrada — cada um no seu projeto 🧠" },
      { type: "image", src: week6_4, caption: "Sala inteira produzindo Tecnologia da Informação ✨" },
      { type: "image", src: week6_5, caption: "Trabalho em dupla, trocando ideias sobre os jogos 🤝" },
    ],
  },
  {
    number: 7,
    date: "12/05 — Terça-feira",
    title: "Ernesto Dorneles: primeiros passos em HTML, CSS e JS no CodePen",
    emoji: "🌐",
    color: "purple",
    objective:
      "Mostrar para as turmas de 6º, 7º e 8º ano do Ernesto Dorneles como nasce um site de verdade — apresentando HTML, CSS e JavaScript e deixando cada um sentir o gostinho de construir a primeira página da vida no CodePen.",
    taught:
      "O que é a web e como um site é feito por três 'idiomas' que conversam: HTML (a estrutura — os ossos), CSS (o estilo — a roupa) e JavaScript (o comportamento — o cérebro). Apresentei o CodePen como um editor online onde dá pra escrever os três e ver o resultado na hora, sem instalar nada. Mostramos tags básicas (h1, p, button), propriedades simples de CSS (cor, fundo, fonte) e uma pitada de JS reagindo a cliques.",
    activities: [
      "Abertura: 'como vocês acham que um site é feito?' — chuva de palpites no quadro",
      "Demonstração ao vivo no CodePen: HTML, CSS e JS lado a lado, com a prévia atualizando em tempo real",
      "Cada aluno criou seu próprio Pen e escreveu o primeiro <h1> com o nome dele",
      "Estilização guiada: trocaram cor de fundo, cor da fonte e tamanho do texto no CSS",
      "Primeira interação em JS: um botão que muda o texto ou a cor da página ao ser clicado",
      "Tempo livre para personalizar — cada um deixou a página com a sua cara",
    ],
    results:
      "Foi 'uau' atrás de 'uau' na sala. Quando viram a página mudando ao vivo conforme escreviam o código, muitos disseram 'então é assim que faz site, prof?!'. Saíram com a primeira página de verdade salva no CodePen.",
    difficulties:
      "No começo confundiam onde escrever cada coisa (HTML x CSS x JS) e esqueciam de fechar tags. Resolvi mostrando vários exemplos pequenos antes de soltar para a personalização livre.",
    reflection:
      "Adoro essa aula porque ela quebra um mito. Eles acham que site é coisa de gênio — e descobrem que, com três blocos de código simples, já estão construindo o seu. Esse 'então eu também consigo' é o que abre a porta para todo o resto.",
    media: [
      { type: "image", src: week7_1, caption: "Primeira página no CodePen: <h1>voar</h1> 🚀" },
      { type: "image", src: week7_2, caption: "Sala inteira mergulhada no HTML, CSS e JS 💻" },
      { type: "image", src: week7_3, caption: "Aprendendo o que é Tecnologia da Informação na prática 🌐" },
      { type: "image", src: week7_4, caption: "Turma do Ernesto construindo seus primeiros sites ✨" },
      { type: "image", src: week7_5, caption: "Cada notebook, uma página nascendo do zero 🧑‍💻" },
      { type: "image", src: week7_6, caption: "Trabalho em grupo: descobrindo as tags juntos 🤝" },
      { type: "image", src: week7_7, caption: "Foco total no CodePen — vendo o site ganhar vida 🎨" },
      { type: "image", src: week7_8, caption: "Os pequenos devs do Ernesto em ação 💙" },
    ],
  },
];
