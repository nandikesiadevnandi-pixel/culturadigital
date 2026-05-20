// Gera uma senha amigável: palavra + 3 dígitos (ex: "estrela-247")
const WORDS = [
  "estrela","planeta","foguete","leao","tigre","golfinho","abacate","banana",
  "cafe","cacau","sol","lua","nuvem","onda","raio","trovao","ouro","prata",
  "fogo","gelo","robo","drone","pixel","codigo","logica","brilho","aurora",
  "saturno","jupiter","marte","cosmo","galaxia","nebulosa","quark","atomo",
];

export function genStudentPassword(): string {
  const w = WORDS[Math.floor(Math.random() * WORDS.length)];
  const n = Math.floor(100 + Math.random() * 900);
  return `${w}${n}`;
}
