export type ActivityRow = {
  data: string;
  escola: string;
  turmas: string;
  atividades: string;
};

export type TurmaRow = { turma: string; alunos: string };

export type SchoolBlock = {
  nome: string;
  diaSemana: string;
  observacao: string;
  turmas: TurmaRow[];
};

export type Relatorio = {
  titulo: string;
  periodo: string;
  escolasAtendidas: string;
  credenciada: string;
  cnpj: string;
  contrato: string;
  oficina: string;
  oficineira: string;
  cargaTema: string;
  introducao: string;
  objetivos: string;
  schools: SchoolBlock[];
  activities: ActivityRow[];
  consideracoes: string;
  encaminhamentos: string;
  cidadeData: string;
  assinanteNome: string;
  assinaturaImg?: string;
};

export const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export const MESES_CURTO = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

// periodKey: "YYYY-MM"
export function parsePeriodKey(key: string): { year: number; month: number } {
  const [y, m] = key.split("-").map(Number);
  return { year: y, month: m };
}

export function formatPeriodKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function emptyRelatorio(periodKey: string): Relatorio {
  const { year, month } = parsePeriodKey(periodKey);
  const mes = MESES[month - 1];
  return {
    titulo: `RELATÓRIO DE ATIVIDADES\nOFICINAS DE CULTURA DIGITAL – ${mes.toUpperCase()}/${year}`,
    periodo: `${mes} de ${year}`,
    escolasAtendidas: "Escolas atendidas: ",
    credenciada: "Interação Comunicação e Marketing Ltda",
    cnpj: "40.949.328/0001-73",
    contrato: "4397",
    oficina: "22535",
    oficineira: "Késia Weige Nandi",
    cargaTema: "",
    introducao: "",
    objetivos: "",
    schools: [],
    activities: [],
    consideracoes: "",
    encaminhamentos: "",
    cidadeData: `Canela/RS, `,
    assinanteNome: "KESIA WEIGE NANDI",
  };
}

export const abril2026: Relatorio = {
  titulo: "RELATÓRIO DE ATIVIDADES\nOFICINAS DE CULTURA DIGITAL – ABRIL/2026",
  periodo: "Abril de 2026",
  escolasAtendidas: "Escolas atendidas: EMEF Bertholdo Oppitz e EMEF Dante Bertoluci",
  credenciada: "Interação Comunicação e Marketing Ltda",
  cnpj: "40.949.328/0001-73",
  contrato: "4397",
  oficina: "22535",
  oficineira: "Késia Weige Nandi",
  cargaTema: "50h aula",
  introducao:
    "O presente relatório sistematiza as atividades desenvolvidas nas Oficinas de Cultura Digital realizadas no contraturno escolar, ao longo do mês de abril de 2026, nas escolas municipais Bertholdo Oppitz e Dante Bertoluci, no município de Canela/RS. No período, o trabalho concentrou-se na organização inicial da oferta, no reconhecimento das condições técnicas de atendimento, na alfabetização digital introdutória, na abordagem de noções básicas de lógica de programação e no primeiro contato dos estudantes com ferramentas como conta Google e Scratch, com ajustes metodológicos e operacionais definidos em diálogo com cada escola.",
  objetivos:
    "As atividades priorizaram a compreensão inicial do que é tecnologia, para que ela serve, como organizar comandos em sequência e como utilizar recursos digitais de maneira orientada e progressiva. O percurso do mês combinou alinhamento institucional, reconhecimento da infraestrutura disponível, definição de protocolos de uso dos equipamentos e desenvolvimento das primeiras atividades práticas com os estudantes.",
  schools: [
    {
      nome: "EMEF Bertholdo Oppitz",
      diaSemana: "Sexta-feira",
      observacao:
        "As turmas são atendidas em sistema de rodízio quinzenal, definidos pela escola. As oficinas têm em média 50min efetivos para compensar os períodos de intervalo para lanche, recreio e para não prejudicar os alunos que saem às 16h45 com o transporte escolar.",
      turmas: [
        { turma: "6º A", alunos: "32" },
        { turma: "6º B", alunos: "32" },
        { turma: "7º A", alunos: "28" },
        { turma: "7º B", alunos: "30" },
        { turma: "8º A", alunos: "22" },
        { turma: "8º B", alunos: "25" },
      ],
    },
    {
      nome: "EMEF Dante Bertoluci",
      diaSemana: "Sexta-feira",
      observacao:
        "Atendimento reorganizado para sexta-feira. Inicialmente, o atendimento seria realizado às terças-feiras, a partir de 07/04.",
      turmas: [
        { turma: "141", alunos: "" },
        { turma: "142", alunos: "" },
        { turma: "151", alunos: "" },
        { turma: "152", alunos: "" },
        { turma: "Total", alunos: "118" },
      ],
    },
  ],
  activities: [
    { data: "06/04", escola: "EMEF Bertholdo Oppitz", turmas: "6ºB, 7ºA, 7ºB, 8ºA e 8ºB", atividades: "Início do ciclo de oficinas com apresentação da proposta de Cultura Digital, sensibilização sobre o que é tecnologia e para que ela serve, além de introdução à lógica de programação por meio do exemplo da receita do bolo, trabalhando noções iniciais de algoritmo e sequência de comandos com as turmas atendidas no primeiro rodízio. A escola não possuía computadores nesse dia e o trabalho foi todo desconectado." },
    { data: "07/04", escola: "EMEF Dante Bertoluci", turmas: "Equipe gestora, OP, prof. Daise e turmas observadas", atividades: "Visita de reconhecimento e alinhamento institucional com o diretor André, a vice-diretora Andressa, a equipe de orientação pedagógica e a professora Daise. Definiu-se que a oficina de Cultura Digital assumiria a alfabetização digital das turmas de 4º e 5º anos como laboratório de teste, com possibilidade de ampliação futura para 3º anos, e que o atendimento passaria para as sextas-feiras. Acompanhamento de duas turmas atendidas pela professora Daise. Recebimento dos novos computadores e identificação da ausência dos drivers da placa Wi-Fi. Definição de protocolo de uso dos equipamentos." },
    { data: "13/04", escola: "EMEF Bertholdo Oppitz", turmas: "6ºA, 7ºA, 7ºB, 8ºA e 8ºB", atividades: "Apoio na instalação, organização e configuração inicial dos novos Chromebooks recebidos pela escola. Identificação da ausência dos drivers de Wi-Fi, estabelecimento de protocolo de uso, guarda, conferência e preparação prévia dos equipamentos. Aguardo da equipe de TI da Secretaria para configuração da rede e dos softwares. Preparação da plataforma digital de acompanhamento evolutivo dos alunos e atendimento offline." },
    { data: "17/04", escola: "EMEF Dante Bertoluci", turmas: "141, 142, 151 e 152", atividades: "Semana 1 de atendimento efetivo após reorganização do cronograma. Aula introdutória de alfabetização digital com introdução à lógica de programação a partir da metáfora da receita do bolo: primeiros conceitos de algoritmo, sequência de comandos e organização do pensamento computacional." },
    { data: "24/04", escola: "EMEF Dante Bertoluci", turmas: "141, 142, 151 e 152", atividades: "Semana 2. Criação e uso da conta Google e primeiro contato com a plataforma Scratch, com exploração do ambiente, compreensão de comandos simples e construção orientada de um primeiro jogo, respeitando o nível de alfabetização digital das turmas." },
    { data: "27/04", escola: "EMEF Bertholdo Oppitz", turmas: "6ºB, 7ºA, 7ºB, 8ºA, 8ºB", atividades: "Retomada da aula de lógica de programação com inserção do uso de computadores. Ensino sobre o bom manuseio e protocolo de responsabilidade. Criação e uso da conta Google e primeiro contato com o Scratch." },
    { data: "30/04", escola: "EMEF Dante Bertoluci", turmas: "141, 142, 151 e 152", atividades: "Semana 3, antecipada para quinta-feira em função do feriado. Retomada dos conteúdos das semanas anteriores e atividade de revisão/avaliação diagnóstica sobre o que os estudantes aprenderam de tecnologia, lógica de programação, comandos e uso inicial das ferramentas digitais." },
  ],
  consideracoes:
    "O trabalho desenvolvido em abril demonstrou a relevância da oficina de Cultura Digital como espaço de iniciação tecnológica e pensamento computacional no contraturno escolar. Mesmo em um cenário inicial de implantação, com necessidade de ajustes de agenda e de infraestrutura, foi possível estabelecer bases pedagógicas consistentes para a continuidade do trabalho nas duas escolas atendidas. O mês teve forte componente de organização institucional e técnica, especialmente em função da chegada dos novos equipamentos, da ausência de drivers de conectividade e da necessidade de pactuar protocolos de uso e divisão do laboratório.",
  encaminhamentos:
    "Recomenda-se a continuidade do percurso formativo com aprofundamento progressivo em alfabetização digital, uso orientado de contas institucionais, ampliação das práticas no Scratch, acompanhamento sistemático da operacionalização dos laboratórios e registro contínuo das próximas etapas em diário de campo, de modo a fortalecer a memória pedagógica do projeto e subsidiar futuras prestações de contas.",
  cidadeData: "Canela/RS, 03 de maio de 2026",
  assinanteNome: "KESIA WEIGE NANDI",
};
