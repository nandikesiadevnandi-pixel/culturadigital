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
    date: "Sexta-feira",
    title: "Criando contas Google",
    emoji: "📧",
    color: "blue",
    objective:
      "Compreender o conceito de conta digital, identidade online e criar uma conta Google de forma segura.",
    taught:
      "O que é uma conta digital, importância de senhas seguras, dados pessoais, primeiros passos no Gmail e Drive.",
    activities: [
      "Criação supervisionada da conta Google",
      "Definição de senha segura",
      "Envio do primeiro e-mail entre colegas",
      "Exploração do Google Drive",
    ],
    results:
      "Todos os alunos conseguiram criar suas contas. Trocaram e-mails entre si pela primeira vez — momento marcante.",
    difficulties:
      "Verificações de idade e número de telefone exigiram adaptações. Alguns alunos esqueceram a senha logo em seguida.",
    reflection:
      "A conta Google é mais que um login: é a porta de entrada para a cidadania digital. Trabalhar segurança desde o início é responsabilidade nossa.",
  },
  {
    number: 3,
    date: "Sexta-feira",
    title: "Primeiro contato com Scratch",
    emoji: "🐱",
    color: "yellow",
    objective:
      "Apresentar o pensamento computacional por meio da programação visual em blocos no Scratch.",
    taught:
      "O que é programação, lógica de blocos, palco, sprites, eventos e movimento. Conceito de sequência.",
    activities: [
      "Exploração da interface do Scratch",
      "Movimentar o gato pela tela",
      "Criar a primeira animação com sons",
      "Compartilhar o projeto com a turma",
    ],
    results:
      "Alunos criaram pequenas animações com personagens em movimento. Risadas e descobertas tomaram conta da sala.",
    difficulties:
      "Encaixar blocos na ordem correta foi desafiador. Conexão com a internet oscilou em alguns momentos.",
    reflection:
      "Quando o aluno percebe que ele controla a máquina — e não o contrário — algo muda. O Scratch transforma consumidores em criadores.",
  },
];
