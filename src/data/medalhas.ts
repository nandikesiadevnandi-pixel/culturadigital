export type Medal = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  // tipo de critério
  criterion:
    | { kind: "xp"; min: number }
    | { kind: "level"; min: number }
    | { kind: "challenges"; min: number }
    | { kind: "games"; min: number }
    | { kind: "quiz"; min: number }
    | { kind: "lessons"; min: number };
  color: string;
};

export const MEDALS: Medal[] = [
  { id: "primeiro-passo", emoji: "👣", title: "Primeiro Passo", description: "Ganhe seus primeiros 10 XP", criterion: { kind: "xp", min: 10 }, color: "from-emerald-400 to-cyan-500" },
  { id: "explorador", emoji: "🧭", title: "Explorador", description: "Acumule 50 XP", criterion: { kind: "xp", min: 50 }, color: "from-cyan-400 to-blue-500" },
  { id: "centurião", emoji: "💯", title: "Centurião", description: "Alcance 100 XP", criterion: { kind: "xp", min: 100 }, color: "from-blue-500 to-violet-500" },
  { id: "mestre-xp", emoji: "🏆", title: "Mestre do XP", description: "Acumule 300 XP", criterion: { kind: "xp", min: 300 }, color: "from-amber-400 to-orange-500" },
  { id: "nivel-3", emoji: "🥉", title: "Aprendiz Avançado", description: "Chegue ao nível 3", criterion: { kind: "level", min: 3 }, color: "from-orange-500 to-pink-500" },
  { id: "nivel-5", emoji: "🥇", title: "Hacker Iniciante", description: "Chegue ao nível 5", criterion: { kind: "level", min: 5 }, color: "from-pink-500 to-violet-500" },
  { id: "coder-1", emoji: "💻", title: "Primeiro Código", description: "Complete 1 desafio de código", criterion: { kind: "challenges", min: 1 }, color: "from-violet-500 to-cyan-400" },
  { id: "coder-3", emoji: "⌨️", title: "Programador Junior", description: "Complete 3 desafios de código", criterion: { kind: "challenges", min: 3 }, color: "from-pink-500 to-orange-500" },
  { id: "coder-all", emoji: "🦾", title: "Mestre do Código", description: "Complete TODOS os desafios", criterion: { kind: "challenges", min: 5 }, color: "from-amber-400 to-pink-500" },
  { id: "gamer", emoji: "🎮", title: "Gamer", description: "Jogue qualquer mini-game 1x", criterion: { kind: "games", min: 1 }, color: "from-cyan-400 to-violet-500" },
  { id: "gamer-pro", emoji: "🕹️", title: "Pro Gamer", description: "Jogue 5 partidas no total", criterion: { kind: "games", min: 5 }, color: "from-violet-500 to-pink-500" },
  { id: "quiz-1", emoji: "🎯", title: "Quiz Conquistado", description: "Responda 1 quiz inteiro", criterion: { kind: "quiz", min: 1 }, color: "from-emerald-400 to-blue-500" },
  { id: "leitor", emoji: "📚", title: "Leitor", description: "Leia 3 aulas da trilha", criterion: { kind: "lessons", min: 3 }, color: "from-blue-500 to-cyan-400" },
];

export type MedalStats = {
  xp: number;
  level: number;
  challengesCompleted: number;
  gamesPlayed: number;
  quizzesTaken: number;
  lessonsRead: number;
};

export const isMedalEarned = (m: Medal, s: MedalStats) => {
  switch (m.criterion.kind) {
    case "xp": return s.xp >= m.criterion.min;
    case "level": return s.level >= m.criterion.min;
    case "challenges": return s.challengesCompleted >= m.criterion.min;
    case "games": return s.gamesPlayed >= m.criterion.min;
    case "quiz": return s.quizzesTaken >= m.criterion.min;
    case "lessons": return s.lessonsRead >= m.criterion.min;
  }
};
