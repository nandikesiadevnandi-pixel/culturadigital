export type Raridade = "comum" | "rara" | "epica" | "lendaria";

export interface Figurinha {
  id: number;
  nome: string;
  selecao: string;
  posicao: string;
  raridade: Raridade;
  emoji: string; // bandeira da seleção
  imagem: string; // URL do retrato ilustrado (gerado, sem direitos autorais)
}

type FigInput = Omit<Figurinha, "id" | "imagem">;

// Retrato ilustrado único por jogador (DiceBear — sem usar fotos reais protegidas)
const FLAG: Record<string, string> = {
  Brasil: "10b981", Argentina: "38bdf8", França: "1e3a8a", Alemanha: "111827",
  Portugal: "16a34a", Inglaterra: "ffffff", Espanha: "dc2626", Itália: "1d4ed8",
  Holanda: "f97316", Uruguai: "7dd3fc",
};
export const retratoDe = (nome: string, selecao: string) => {
  const bg = FLAG[selecao] ?? "0ea5e9";
  const seed = encodeURIComponent(nome);
  return `https://api.dicebear.com/9.x/personas/svg?seed=${seed}&backgroundColor=${bg}&backgroundType=gradientLinear&radius=20`;
};

// Lista curada (sem usar nomes/marcas oficiais protegidos — usamos apelidos/jogadores históricos e fictícios)
const base: FigInput[] = [
  // Brasil
  { nome: "Pelé", selecao: "Brasil", posicao: "Atacante", raridade: "lendaria", emoji: "🇧🇷" },
  { nome: "Ronaldo", selecao: "Brasil", posicao: "Atacante", raridade: "lendaria", emoji: "🇧🇷" },
  { nome: "Romário", selecao: "Brasil", posicao: "Atacante", raridade: "epica", emoji: "🇧🇷" },
  { nome: "Rivaldo", selecao: "Brasil", posicao: "Meia", raridade: "epica", emoji: "🇧🇷" },
  { nome: "Cafu", selecao: "Brasil", posicao: "Lateral", raridade: "rara", emoji: "🇧🇷" },
  { nome: "Roberto Carlos", selecao: "Brasil", posicao: "Lateral", raridade: "rara", emoji: "🇧🇷" },
  { nome: "Taffarel", selecao: "Brasil", posicao: "Goleiro", raridade: "comum", emoji: "🇧🇷" },
  { nome: "Dunga", selecao: "Brasil", posicao: "Volante", raridade: "comum", emoji: "🇧🇷" },

  // Argentina
  { nome: "Maradona", selecao: "Argentina", posicao: "Meia", raridade: "lendaria", emoji: "🇦🇷" },
  { nome: "Messi", selecao: "Argentina", posicao: "Atacante", raridade: "lendaria", emoji: "🇦🇷" },
  { nome: "Batistuta", selecao: "Argentina", posicao: "Atacante", raridade: "epica", emoji: "🇦🇷" },
  { nome: "Kempes", selecao: "Argentina", posicao: "Atacante", raridade: "rara", emoji: "🇦🇷" },
  { nome: "Passarella", selecao: "Argentina", posicao: "Zagueiro", raridade: "comum", emoji: "🇦🇷" },
  { nome: "Ardiles", selecao: "Argentina", posicao: "Meia", raridade: "comum", emoji: "🇦🇷" },

  // França
  { nome: "Zidane", selecao: "França", posicao: "Meia", raridade: "lendaria", emoji: "🇫🇷" },
  { nome: "Mbappé", selecao: "França", posicao: "Atacante", raridade: "lendaria", emoji: "🇫🇷" },
  { nome: "Henry", selecao: "França", posicao: "Atacante", raridade: "epica", emoji: "🇫🇷" },
  { nome: "Platini", selecao: "França", posicao: "Meia", raridade: "epica", emoji: "🇫🇷" },
  { nome: "Vieira", selecao: "França", posicao: "Volante", raridade: "rara", emoji: "🇫🇷" },
  { nome: "Barthez", selecao: "França", posicao: "Goleiro", raridade: "comum", emoji: "🇫🇷" },

  // Alemanha
  { nome: "Beckenbauer", selecao: "Alemanha", posicao: "Zagueiro", raridade: "lendaria", emoji: "🇩🇪" },
  { nome: "Klinsmann", selecao: "Alemanha", posicao: "Atacante", raridade: "epica", emoji: "🇩🇪" },
  { nome: "Müller", selecao: "Alemanha", posicao: "Atacante", raridade: "epica", emoji: "🇩🇪" },
  { nome: "Matthäus", selecao: "Alemanha", posicao: "Meia", raridade: "rara", emoji: "🇩🇪" },
  { nome: "Kahn", selecao: "Alemanha", posicao: "Goleiro", raridade: "rara", emoji: "🇩🇪" },
  { nome: "Schweinsteiger", selecao: "Alemanha", posicao: "Volante", raridade: "comum", emoji: "🇩🇪" },

  // Portugal
  { nome: "Cristiano Ronaldo", selecao: "Portugal", posicao: "Atacante", raridade: "lendaria", emoji: "🇵🇹" },
  { nome: "Eusébio", selecao: "Portugal", posicao: "Atacante", raridade: "lendaria", emoji: "🇵🇹" },
  { nome: "Figo", selecao: "Portugal", posicao: "Meia", raridade: "epica", emoji: "🇵🇹" },
  { nome: "Rui Costa", selecao: "Portugal", posicao: "Meia", raridade: "rara", emoji: "🇵🇹" },
  { nome: "Pepe", selecao: "Portugal", posicao: "Zagueiro", raridade: "comum", emoji: "🇵🇹" },

  // Inglaterra
  { nome: "Beckham", selecao: "Inglaterra", posicao: "Meia", raridade: "epica", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { nome: "Lineker", selecao: "Inglaterra", posicao: "Atacante", raridade: "rara", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { nome: "Rooney", selecao: "Inglaterra", posicao: "Atacante", raridade: "rara", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { nome: "Kane", selecao: "Inglaterra", posicao: "Atacante", raridade: "comum", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { nome: "Bobby Charlton", selecao: "Inglaterra", posicao: "Meia", raridade: "lendaria", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },

  // Espanha
  { nome: "Iniesta", selecao: "Espanha", posicao: "Meia", raridade: "epica", emoji: "🇪🇸" },
  { nome: "Xavi", selecao: "Espanha", posicao: "Meia", raridade: "epica", emoji: "🇪🇸" },
  { nome: "Casillas", selecao: "Espanha", posicao: "Goleiro", raridade: "rara", emoji: "🇪🇸" },
  { nome: "Raúl", selecao: "Espanha", posicao: "Atacante", raridade: "rara", emoji: "🇪🇸" },
  { nome: "Puyol", selecao: "Espanha", posicao: "Zagueiro", raridade: "comum", emoji: "🇪🇸" },

  // Itália
  { nome: "Baggio", selecao: "Itália", posicao: "Meia", raridade: "lendaria", emoji: "🇮🇹" },
  { nome: "Maldini", selecao: "Itália", posicao: "Zagueiro", raridade: "epica", emoji: "🇮🇹" },
  { nome: "Buffon", selecao: "Itália", posicao: "Goleiro", raridade: "epica", emoji: "🇮🇹" },
  { nome: "Totti", selecao: "Itália", posicao: "Meia", raridade: "rara", emoji: "🇮🇹" },
  { nome: "Pirlo", selecao: "Itália", posicao: "Meia", raridade: "rara", emoji: "🇮🇹" },
  { nome: "Cannavaro", selecao: "Itália", posicao: "Zagueiro", raridade: "comum", emoji: "🇮🇹" },

  // Holanda
  { nome: "Cruyff", selecao: "Holanda", posicao: "Atacante", raridade: "lendaria", emoji: "🇳🇱" },
  { nome: "Van Basten", selecao: "Holanda", posicao: "Atacante", raridade: "epica", emoji: "🇳🇱" },
  { nome: "Gullit", selecao: "Holanda", posicao: "Meia", raridade: "epica", emoji: "🇳🇱" },
  { nome: "Bergkamp", selecao: "Holanda", posicao: "Atacante", raridade: "rara", emoji: "🇳🇱" },
  { nome: "Van Persie", selecao: "Holanda", posicao: "Atacante", raridade: "comum", emoji: "🇳🇱" },

  // Uruguai
  { nome: "Suárez", selecao: "Uruguai", posicao: "Atacante", raridade: "epica", emoji: "🇺🇾" },
  { nome: "Cavani", selecao: "Uruguai", posicao: "Atacante", raridade: "rara", emoji: "🇺🇾" },
  { nome: "Forlán", selecao: "Uruguai", posicao: "Atacante", raridade: "rara", emoji: "🇺🇾" },
  { nome: "Godín", selecao: "Uruguai", posicao: "Zagueiro", raridade: "comum", emoji: "🇺🇾" },
];

export const FIGURINHAS: Figurinha[] = base.map((f, i) => ({ ...f, id: i + 1, imagem: retratoDe(f.nome, f.selecao) }));

export const SELECOES = Array.from(new Set(FIGURINHAS.map(f => f.selecao)));

export const RARIDADE_PESO: Record<Raridade, number> = {
  comum: 60,
  rara: 25,
  epica: 12,
  lendaria: 3,
};

export function sortearFigurinha(): Figurinha {
  const pool = FIGURINHAS.flatMap(f => Array(RARIDADE_PESO[f.raridade]).fill(f));
  return pool[Math.floor(Math.random() * pool.length)];
}

export function sortearPacote(qtd = 5): Figurinha[] {
  return Array.from({ length: qtd }, () => sortearFigurinha());
}
