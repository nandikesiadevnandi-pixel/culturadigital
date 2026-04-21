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
    title: "Introdução ao Chromebook",
    emoji: "💻",
    color: "purple",
    objective:
      "Apresentar o Chromebook como ferramenta de aprendizagem e desenvolver familiaridade com o equipamento.",
    taught:
      "Partes do Chromebook, ligar/desligar, login, navegação básica, teclado e touchpad, cuidados com o equipamento.",
    activities: [
      "Exploração guiada do equipamento",
      "Prática de digitação e navegação",
      "Abertura e fechamento de abas no navegador",
      "Identificação dos principais ícones do sistema",
    ],
    results:
      "A maioria dos alunos conseguiu realizar login e navegar pela interface ao final da aula. Engajamento alto pela curiosidade.",
    difficulties:
      "Alguns alunos tiveram dificuldade com o touchpad e com o conceito de senha. Diferentes ritmos exigiram acompanhamento individual.",
    reflection:
      "Iniciar pelo concreto — tocar, explorar, errar — foi essencial. Perceber o brilho nos olhos ao ligar o próprio Chromebook reforça a importância da inclusão digital real.",
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
