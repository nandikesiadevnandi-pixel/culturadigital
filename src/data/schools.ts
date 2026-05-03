// Mapeamento de turmas → escola.
// Para adicionar uma nova escola, basta criar um novo objeto aqui
// listando as turmas que pertencem a ela.
export type School = {
  id: string;
  name: string;
  short: string;
  classes: string[];
};

export const schools: School[] = [
  {
    id: "dante",
    name: "Escola Dante Bertoluci",
    short: "Dante Bertoluci",
    classes: ["141", "142", "151", "152"],
  },
  // Exemplo para futuras escolas:
  // { id: "outra", name: "Escola XYZ", short: "XYZ", classes: ["161", "162"] },
];

export const getSchoolByClass = (classNumber: string): School | undefined =>
  schools.find((s) => s.classes.includes(classNumber));

export const getSchoolName = (classNumber: string): string =>
  getSchoolByClass(classNumber)?.short ?? "Outra escola";
