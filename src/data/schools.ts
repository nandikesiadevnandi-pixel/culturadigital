// Mapeamento de turmas → escola.
// Para adicionar turmas a uma escola, basta incluir o número da turma
// no array `classes` da escola correspondente.
export type School = {
  id: string;
  name: string;
  short: string;
  /** Dia da semana em que a prof Késia dá aula nessa escola */
  day: string;
  /** Cor de destaque (classe utilitária do design system) */
  accent: string;
  classes: string[];
};

export const schools: School[] = [
  {
    id: "bertholdo",
    name: "Escola Bertholdo",
    short: "Bertholdo",
    day: "Segunda-feira",
    accent: "gradient-blue",
    classes: ["6A", "6B"],
  },
  {
    id: "ernesto",
    name: "Escola Ernesto",
    short: "Ernesto",
    day: "Terça-feira",
    accent: "gradient-green",
    classes: [],
  },
  {
    id: "dante",
    name: "Escola Dante Bertoluci",
    short: "Dante Bertoluci",
    day: "Sexta-feira",
    accent: "gradient-purple",
    classes: ["141", "142", "151", "152"],
  },
];

export const getSchoolByClass = (classNumber: string): School | undefined =>
  schools.find((s) => s.classes.includes(classNumber));

export const getSchoolName = (classNumber: string): string =>
  getSchoolByClass(classNumber)?.short ?? "Outra escola";
