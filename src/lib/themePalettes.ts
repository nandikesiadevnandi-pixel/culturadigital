// Paletas de cores que o aluno pode escolher no perfil.
// Aplicadas como classes utilitárias no dashboard.
export type Palette = {
  id: string;
  name: string;
  emoji: string;
  // Tailwind gradient stops used in dashboards
  from: string;
  via: string;
  to: string;
  accent: string; // hex usado em algumas bordas
};

export const PALETTES: Palette[] = [
  { id: "violet", name: "Roxo Neon", emoji: "🟣", from: "from-violet-500", via: "via-purple-600", to: "to-cyan-400", accent: "#a78bfa" },
  { id: "sunset", name: "Pôr do Sol", emoji: "🌅", from: "from-orange-500", via: "via-pink-500", to: "to-rose-500", accent: "#fb923c" },
  { id: "ocean", name: "Oceano", emoji: "🌊", from: "from-cyan-500", via: "via-blue-600", to: "to-indigo-600", accent: "#22d3ee" },
  { id: "forest", name: "Floresta", emoji: "🌲", from: "from-emerald-500", via: "via-green-600", to: "to-teal-500", accent: "#34d399" },
  { id: "candy", name: "Doce", emoji: "🍭", from: "from-pink-500", via: "via-fuchsia-500", to: "to-purple-500", accent: "#f472b6" },
  { id: "gold", name: "Ouro", emoji: "🏆", from: "from-amber-400", via: "via-yellow-500", to: "to-orange-500", accent: "#fbbf24" },
];

export const paletteById = (id?: string | null) =>
  PALETTES.find((p) => p.id === id) || PALETTES[0];
