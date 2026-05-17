// Gera um "email interno" determinístico para alunos a partir de
// nome completo + turma + escola, para que o aluno não precise digitar email.

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

export function studentLoginEmail(fullName: string, className: string, school: string) {
  const n = slug(fullName);
  const c = slug(className) || "sem-turma";
  const s = slug(school) || "sem-escola";
  return `${n}.${c}.${s}@aluno.cultura.local`;
}
