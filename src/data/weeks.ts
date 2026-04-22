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
  },
  {
    number: 2,
    date: "24/04 — Sexta-feira",
    title: "Contas Google e primeiro contato com Scratch",
    emoji: "📧",
    color: "blue",
    objective:
      "Dar acesso à identidade digital criando contas Google de forma segura e iniciar o pensamento computacional na prática, com o primeiro contato com programação em blocos no Scratch.",
    taught:
      "O que é uma conta digital, importância de senhas seguras, cuidados com dados pessoais, primeiros passos no Gmail e no Drive. Em seguida: o que é programação em blocos, interface do Scratch, palco, sprites, eventos e o conceito de sequência aplicado de verdade.",
    activities: [
      "Criação supervisionada da conta Google e definição de senha segura",
      "Envio do primeiro e-mail entre colegas e exploração do Google Drive",
      "Exploração da interface do Scratch e movimentação do gato pela tela",
      "Criação da primeira animação com som e compartilhamento do projeto com a turma",
    ],
    results:
      "Todos conseguiram criar suas contas e trocaram e-mails pela primeira vez — momento marcante. Logo depois, montaram pequenas animações no Scratch com muita risada e descoberta.",
    difficulties:
      "Verificações de idade e telefone exigiram adaptações na criação das contas. Alguns esqueceram a senha logo em seguida. No Scratch, encaixar os blocos na ordem certa foi o principal desafio.",
    reflection:
      "Foi a aula da virada: saíram do 'usar' para o 'criar'. Ter conta própria e ver o personagem obedecer ao próprio código transforma a relação dos alunos com a tecnologia.",
  },
];
