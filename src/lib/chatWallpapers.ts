export type Wallpaper = {
  id: string;
  name: string;
  emoji: string;
  // tailwind classes for background
  bg: string;
};

export const WALLPAPERS: Wallpaper[] = [
  { id: "default", name: "Padrão", emoji: "🌌", bg: "bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#0a0a1a]" },
  { id: "ocean", name: "Oceano", emoji: "🌊", bg: "bg-gradient-to-br from-[#0c2340] via-[#1a4a6e] to-[#2d8a9e]" },
  { id: "sunset", name: "Pôr do sol", emoji: "🌅", bg: "bg-gradient-to-br from-[#3b1c32] via-[#a4365d] to-[#e8a87c]" },
  { id: "forest", name: "Floresta", emoji: "🌲", bg: "bg-gradient-to-br from-[#0d1f17] via-[#1a3c2a] to-[#2d5a3d]" },
  { id: "candy", name: "Doce", emoji: "🍭", bg: "bg-gradient-to-br from-[#f8e8ee] via-[#e8c5d0] to-[#c9a0dc]" },
  { id: "carbon", name: "Grafite", emoji: "🪨", bg: "bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#4a4a4a]" },
];

export const wallpaperById = (id?: string | null) =>
  WALLPAPERS.find((w) => w.id === id) ?? WALLPAPERS[0];
