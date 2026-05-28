export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type Position = 'GK' | 'DEF' | 'MID' | 'ATK';

export interface AlbumPlayer {
  id: string;
  name: string;
  country: string;
  flagCode: string;
  position: Position;
  rarity: Rarity;
  overall: number;
  sofascoreId?: number;
  photoUrl?: string;
  special?: string;
}

// Wikimedia Commons shorthand
const W = (path: string) => `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/330px-${path.split('/').pop()}`;

export const RARITY_CONFIG = {
  common: {
    label: 'Comum', color: 'from-gray-400 to-gray-600',
    glow: 'shadow-gray-500/30', border: 'border-gray-500/40',
    text: 'text-gray-300', bg: 'bg-gray-500/10', badge: 'bg-gray-500/20',
  },
  rare: {
    label: 'Raro', color: 'from-blue-400 to-blue-600',
    glow: 'shadow-blue-500/60', border: 'border-blue-400/60',
    text: 'text-blue-300', bg: 'bg-blue-500/10', badge: 'bg-blue-500/20',
  },
  epic: {
    label: 'Épico', color: 'from-violet-400 to-purple-700',
    glow: 'shadow-violet-500/70', border: 'border-violet-400/70',
    text: 'text-violet-200', bg: 'bg-violet-500/15', badge: 'bg-violet-500/25',
  },
  legendary: {
    label: 'Lendário', color: 'from-yellow-300 via-orange-400 to-red-500',
    glow: 'shadow-yellow-400/80', border: 'border-yellow-400/80',
    text: 'text-yellow-300', bg: 'bg-yellow-500/15', badge: 'bg-yellow-500/25',
  },
};

export const ALBUM_PLAYERS: AlbumPlayer[] = [
  // ───── BRASIL ─────
  { id: 'br-alisson',    name: 'Alisson Becker',  country: 'Brasil',    flagCode: 'br', position: 'GK',  rarity: 'epic',      overall: 88, sofascoreId: 32868,  special: 'Mãos de Ouro',
    photoUrl: W('4/4f/20180610_FIFA_Friendly_Match_Austria_vs._Brazil_850_1625.jpg') },
  { id: 'br-danilo',     name: 'Danilo',           country: 'Brasil',    flagCode: 'br', position: 'DEF', rarity: 'rare',      overall: 80 },
  { id: 'br-marquinhos', name: 'Marquinhos',       country: 'Brasil',    flagCode: 'br', position: 'DEF', rarity: 'epic',      overall: 86, sofascoreId: 50801,  special: 'Capitão da Defesa',
    photoUrl: W('d/dc/FC_Salzburg_gegen_Paris_Saint-Germain_UEFA_Champions_League_49_%28cropped%29.jpg') },
  { id: 'br-militao',   name: 'Éder Militão',     country: 'Brasil',    flagCode: 'br', position: 'DEF', rarity: 'rare',      overall: 83 },
  { id: 'br-vinicius',  name: 'Vinicius Jr',      country: 'Brasil',    flagCode: 'br', position: 'ATK', rarity: 'legendary', overall: 95, sofascoreId: 903036, special: 'Drible Impossível 🔥',
    photoUrl: W('c/c6/2023_05_06_Final_de_la_Copa_del_Rey_-_52879242230_%28cropped%29.jpg') },
  { id: 'br-rodrygo',   name: 'Rodrygo',          country: 'Brasil',    flagCode: 'br', position: 'ATK', rarity: 'epic',      overall: 85, sofascoreId: 843901, special: 'Gênio do Drible',
    photoUrl: W('0/05/Rodrygo_2023_%28cropped%29.jpg') },
  { id: 'br-paqueta',   name: 'Lucas Paquetá',    country: 'Brasil',    flagCode: 'br', position: 'MID', rarity: 'epic',      overall: 84, sofascoreId: 394536, special: 'Maestro do Meio' },
  { id: 'br-bruno',     name: 'Bruno Guimarães',  country: 'Brasil',    flagCode: 'br', position: 'MID', rarity: 'rare',      overall: 83, sofascoreId: 814789,
    photoUrl: W('8/8e/Bruno_Guimar%C3%A3es.png') },
  { id: 'br-raphinha',  name: 'Raphinha',         country: 'Brasil',    flagCode: 'br', position: 'ATK', rarity: 'rare',      overall: 83, sofascoreId: 833836 },
  { id: 'br-endrick',   name: 'Endrick',          country: 'Brasil',    flagCode: 'br', position: 'ATK', rarity: 'epic',      overall: 84, sofascoreId: 1196608,special: 'Joia da Próxima Era ⭐' },
  { id: 'br-savinho',   name: 'Savinho',          country: 'Brasil',    flagCode: 'br', position: 'ATK', rarity: 'rare',      overall: 80, sofascoreId: 1116726 },
  { id: 'br-gabriel',   name: 'Gabriel Magalhães',country: 'Brasil',    flagCode: 'br', position: 'DEF', rarity: 'common',    overall: 78 },
  { id: 'br-neymar',    name: 'Neymar Jr',        country: 'Brasil',    flagCode: 'br', position: 'ATK', rarity: 'legendary', overall: 92, special: 'O Rei do Drible 👑',
    photoUrl: W('b/bb/Neymar_Jr._with_Al_Hilal%2C_3_October_2023_-_03_%28cropped%29.jpg') },
  { id: 'br-richarlison',name: 'Richarlison',     country: 'Brasil',    flagCode: 'br', position: 'ATK', rarity: 'rare',      overall: 82,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Richarlison_%C3%A9_homenageado_na_ALES_%2810.July.2019%29_01_%28cropped%29.jpg' },
  { id: 'br-martinelli', name: 'Gabriel Martinelli',country: 'Brasil',  flagCode: 'br', position: 'ATK', rarity: 'rare',      overall: 81,
    photoUrl: W('d/df/1_Gabriel_Martinelli_arsenal_2025_%28cropped%29.jpg') },
  { id: 'br-casemiro',  name: 'Casemiro',         country: 'Brasil',    flagCode: 'br', position: 'MID', rarity: 'epic',      overall: 85, special: 'Escudo do Brasil',
    photoUrl: W('d/dc/Casemiro_Brazil_Austria_June_2018.jpg') },

  // ───── ARGENTINA ─────
  { id: 'ar-messi',     name: 'Lionel Messi',     country: 'Argentina', flagCode: 'ar', position: 'ATK', rarity: 'legendary', overall: 98, sofascoreId: 56186,  special: 'O GOAT 🐐',
    photoUrl: W('6/6b/Lionel_Messi_White_House_2026_%283x4_cropped%29.jpg') },
  { id: 'ar-emiliano',  name: 'Emiliano Martínez',country: 'Argentina', flagCode: 'ar', position: 'GK',  rarity: 'epic',      overall: 87, sofascoreId: 52255,  special: 'O Dibu' },
  { id: 'ar-lmartinez', name: 'Lisandro Martínez',country: 'Argentina', flagCode: 'ar', position: 'DEF', rarity: 'rare',      overall: 83, sofascoreId: 836542 },
  { id: 'ar-lautaro',   name: 'Lautaro Martínez', country: 'Argentina', flagCode: 'ar', position: 'ATK', rarity: 'epic',      overall: 87, sofascoreId: 745102, special: 'El Toro',
    photoUrl: W('2/2e/Lautaro_Martinez_ARGENTINA_VS_VENEZUELA_2017.jpg') },
  { id: 'ar-julian',    name: 'Julián Álvarez',   country: 'Argentina', flagCode: 'ar', position: 'ATK', rarity: 'rare',      overall: 84, sofascoreId: 863830 },
  { id: 'ar-macallister',name: 'Mac Allister',    country: 'Argentina', flagCode: 'ar', position: 'MID', rarity: 'rare',      overall: 83, sofascoreId: 794503 },
  { id: 'ar-depaul',    name: 'Rodrigo De Paul',  country: 'Argentina', flagCode: 'ar', position: 'MID', rarity: 'rare',      overall: 82, sofascoreId: 358075 },
  { id: 'ar-molina',    name: 'Nahuel Molina',    country: 'Argentina', flagCode: 'ar', position: 'DEF', rarity: 'common',    overall: 78 },

  // ───── FRANÇA ─────
  { id: 'fr-mbappe',    name: 'Kylian Mbappé',    country: 'França',    flagCode: 'fr', position: 'ATK', rarity: 'legendary', overall: 96, sofascoreId: 231747, special: 'Velocidade Máxima ⚡',
    photoUrl: W('6/66/Picture_with_Mbapp%C3%A9_%28cropped_and_rotated%29.jpg') },
  { id: 'fr-maignan',   name: 'Mike Maignan',     country: 'França',    flagCode: 'fr', position: 'GK',  rarity: 'rare',      overall: 85, sofascoreId: 131540 },
  { id: 'fr-saliba',    name: 'William Saliba',   country: 'França',    flagCode: 'fr', position: 'DEF', rarity: 'rare',      overall: 84, sofascoreId: 891526 },
  { id: 'fr-griezmann', name: 'Antoine Griezmann',country: 'França',    flagCode: 'fr', position: 'ATK', rarity: 'epic',      overall: 86, sofascoreId: 82928,  special: 'Artista do Gol',
    photoUrl: W('6/6e/FRA-ARG_%2810%29_%28cropped%29.jpg') },
  { id: 'fr-dembele',   name: 'Ousmane Dembélé',  country: 'França',    flagCode: 'fr', position: 'ATK', rarity: 'rare',      overall: 84, sofascoreId: 348063 },
  { id: 'fr-tchouameni',name: 'Tchouaméni',       country: 'França',    flagCode: 'fr', position: 'MID', rarity: 'rare',      overall: 83, sofascoreId: 882099 },
  { id: 'fr-camavinga', name: 'Camavinga',        country: 'França',    flagCode: 'fr', position: 'MID', rarity: 'rare',      overall: 83, sofascoreId: 934907 },
  { id: 'fr-thuram',    name: 'Marcus Thuram',    country: 'França',    flagCode: 'fr', position: 'ATK', rarity: 'rare',      overall: 82, sofascoreId: 880595 },
  { id: 'fr-hernandez', name: 'Theo Hernández',   country: 'França',    flagCode: 'fr', position: 'DEF', rarity: 'rare',      overall: 83, sofascoreId: 429376 },

  // ───── INGLATERRA ─────
  { id: 'en-pickford',  name: 'Jordan Pickford',  country: 'Inglaterra',flagCode: 'gb-eng', position: 'GK',  rarity: 'rare',  overall: 83, sofascoreId: 73944 },
  { id: 'en-bellingham',name: 'Jude Bellingham',  country: 'Inglaterra',flagCode: 'gb-eng', position: 'MID', rarity: 'epic',  overall: 89, sofascoreId: 1043351, special: 'Rei do Meio-Campo',
    photoUrl: W('f/f9/25th_Laureus_World_Sports_Awards_-_Red_Carpet_-_Jude_Bellingham_-_240422_190551-2_%28cropped%29.jpg') },
  { id: 'en-kane',      name: 'Harry Kane',       country: 'Inglaterra',flagCode: 'gb-eng', position: 'ATK', rarity: 'epic',  overall: 87, sofascoreId: 452865, special: 'Artilheiro Implacável',
    photoUrl: W('9/91/Harry_Kane_on_October_10%2C_2023.jpg') },
  { id: 'en-saka',      name: 'Bukayo Saka',      country: 'Inglaterra',flagCode: 'gb-eng', position: 'ATK', rarity: 'rare',  overall: 85, sofascoreId: 934235,
    photoUrl: W('c/cd/1_bukayo_saka_arsenal_2025_%28cropped%29.jpg') },
  { id: 'en-foden',     name: 'Phil Foden',       country: 'Inglaterra',flagCode: 'gb-eng', position: 'MID', rarity: 'rare',  overall: 86, sofascoreId: 778824,
    photoUrl: W('5/53/2023-10-04_Fu%C3%9Fball%2C_M%C3%A4nner%2C_UEFA_Champions_League%2C_RB_Leipzig_-_Manchester_City_FC_1DX_2613%2C_Phil_Foden.jpg') },
  { id: 'en-rice',      name: 'Declan Rice',      country: 'Inglaterra',flagCode: 'gb-eng', position: 'MID', rarity: 'rare',  overall: 84, sofascoreId: 793234 },
  { id: 'en-trent',     name: 'Trent A.-Arnold',  country: 'Inglaterra',flagCode: 'gb-eng', position: 'DEF', rarity: 'rare',  overall: 84, sofascoreId: 688756 },
  { id: 'en-walker',    name: 'Kyle Walker',      country: 'Inglaterra',flagCode: 'gb-eng', position: 'DEF', rarity: 'common',overall: 80 },

  // ───── ESPANHA ─────
  { id: 'es-simon',     name: 'Unai Simón',       country: 'Espanha',   flagCode: 'es', position: 'GK',  rarity: 'rare',      overall: 83 },
  { id: 'es-carvajal',  name: 'Dani Carvajal',    country: 'Espanha',   flagCode: 'es', position: 'DEF', rarity: 'rare',      overall: 83, sofascoreId: 101817 },
  { id: 'es-rodri',     name: 'Rodri',            country: 'Espanha',   flagCode: 'es', position: 'MID', rarity: 'epic',      overall: 90, sofascoreId: 700041, special: 'Controle Total' },
  { id: 'es-pedri',     name: 'Pedri',            country: 'Espanha',   flagCode: 'es', position: 'MID', rarity: 'epic',      overall: 87, sofascoreId: 984498, special: 'Maestro Catalão' },
  { id: 'es-yamal',     name: 'Lamine Yamal',     country: 'Espanha',   flagCode: 'es', position: 'ATK', rarity: 'epic',      overall: 87, sofascoreId: 1130889,special: 'Prodígio do Futuro 🌟' },
  { id: 'es-morata',    name: 'Álvaro Morata',    country: 'Espanha',   flagCode: 'es', position: 'ATK', rarity: 'rare',      overall: 82 },
  { id: 'es-fabian',    name: 'Fabián Ruiz',      country: 'Espanha',   flagCode: 'es', position: 'MID', rarity: 'rare',      overall: 82, sofascoreId: 474524 },
  { id: 'es-cucurella', name: 'Marc Cucurella',   country: 'Espanha',   flagCode: 'es', position: 'DEF', rarity: 'common',    overall: 79 },

  // ───── PORTUGAL ─────
  { id: 'pt-ronaldo',   name: 'Cristiano Ronaldo',country: 'Portugal',  flagCode: 'pt', position: 'ATK', rarity: 'legendary', overall: 93, sofascoreId: 36569,  special: 'CR7 — A Lenda ⭐',
    photoUrl: W('9/9c/President_Donald_Trump_meets_with_Cristiano_Ronaldo_in_the_Oval_Office_%2854933344262%29_%28cropped_and_rotated%29.jpg') },
  { id: 'pt-dcosta',    name: 'Diogo Costa',      country: 'Portugal',  flagCode: 'pt', position: 'GK',  rarity: 'rare',      overall: 83, sofascoreId: 877903 },
  { id: 'pt-rdias',     name: 'Rúben Dias',       country: 'Portugal',  flagCode: 'pt', position: 'DEF', rarity: 'epic',      overall: 87, sofascoreId: 521213, special: 'Muro de Pedra' },
  { id: 'pt-bernardo',  name: 'Bernardo Silva',   country: 'Portugal',  flagCode: 'pt', position: 'MID', rarity: 'epic',      overall: 87, sofascoreId: 162281, special: 'Polvo do Campo' },
  { id: 'pt-bruno',     name: 'Bruno Fernandes',  country: 'Portugal',  flagCode: 'pt', position: 'MID', rarity: 'epic',      overall: 86, sofascoreId: 200717, special: 'Chefe da Criação',
    photoUrl: W('c/c7/Bruno_Fernandes_USMNT_v_Portugal_Mar_31_2026-27_%28cropped%29.jpg') },
  { id: 'pt-jfelix',    name: 'João Félix',       country: 'Portugal',  flagCode: 'pt', position: 'ATK', rarity: 'rare',      overall: 83, sofascoreId: 905399 },
  { id: 'pt-rleao',     name: 'Rafael Leão',      country: 'Portugal',  flagCode: 'pt', position: 'ATK', rarity: 'rare',      overall: 83, sofascoreId: 829290 },
  { id: 'pt-cancelo',   name: 'João Cancelo',     country: 'Portugal',  flagCode: 'pt', position: 'DEF', rarity: 'rare',      overall: 83, sofascoreId: 187241 },

  // ───── ALEMANHA ─────
  { id: 'de-neuer',     name: 'Manuel Neuer',     country: 'Alemanha',  flagCode: 'de', position: 'GK',  rarity: 'epic',      overall: 85, sofascoreId: 16484,  special: 'Sweep-Keeper Lendário' },
  { id: 'de-rudiger',   name: 'Antonio Rüdiger',  country: 'Alemanha',  flagCode: 'de', position: 'DEF', rarity: 'rare',      overall: 84, sofascoreId: 236817 },
  { id: 'de-wirtz',     name: 'Florian Wirtz',    country: 'Alemanha',  flagCode: 'de', position: 'MID', rarity: 'epic',      overall: 87, sofascoreId: 1082762,special: 'Wunderkind' },
  { id: 'de-musiala',   name: 'Jamal Musiala',    country: 'Alemanha',  flagCode: 'de', position: 'MID', rarity: 'epic',      overall: 86, sofascoreId: 1010796,special: 'Bailarino do Campo' },
  { id: 'de-havertz',   name: 'Kai Havertz',      country: 'Alemanha',  flagCode: 'de', position: 'ATK', rarity: 'rare',      overall: 83, sofascoreId: 773323 },
  { id: 'de-kimmich',   name: 'Joshua Kimmich',   country: 'Alemanha',  flagCode: 'de', position: 'MID', rarity: 'rare',      overall: 85, sofascoreId: 319765 },
  { id: 'de-sane',      name: 'Leroy Sané',       country: 'Alemanha',  flagCode: 'de', position: 'ATK', rarity: 'rare',      overall: 82, sofascoreId: 338721 },
  { id: 'de-gnabry',    name: 'Serge Gnabry',     country: 'Alemanha',  flagCode: 'de', position: 'ATK', rarity: 'common',    overall: 79 },

  // ───── HOLANDA ─────
  { id: 'nl-vandijk',   name: 'Virgil van Dijk',  country: 'Holanda',   flagCode: 'nl', position: 'DEF', rarity: 'epic',      overall: 88, sofascoreId: 236501, special: 'Gigante da Defesa' },
  { id: 'nl-dumfries',  name: 'Denzel Dumfries',  country: 'Holanda',   flagCode: 'nl', position: 'DEF', rarity: 'rare',      overall: 82, sofascoreId: 617498 },
  { id: 'nl-gakpo',     name: 'Cody Gakpo',       country: 'Holanda',   flagCode: 'nl', position: 'ATK', rarity: 'rare',      overall: 83, sofascoreId: 826062 },
  { id: 'nl-xavi',      name: 'Xavi Simons',      country: 'Holanda',   flagCode: 'nl', position: 'MID', rarity: 'rare',      overall: 83, sofascoreId: 1082748 },
  { id: 'nl-reijnders', name: 'Tijjani Reijnders',country: 'Holanda',   flagCode: 'nl', position: 'MID', rarity: 'rare',      overall: 82 },
  { id: 'nl-ake',       name: 'Nathan Aké',       country: 'Holanda',   flagCode: 'nl', position: 'DEF', rarity: 'common',    overall: 80 },

  // ───── NORUEGA (Haaland) ─────
  { id: 'no-haaland',   name: 'Erling Haaland',   country: 'Noruega',   flagCode: 'no', position: 'ATK', rarity: 'legendary', overall: 96, sofascoreId: 839956, special: 'Máquina de Gols 🚀',
    photoUrl: W('7/71/Erling_Haaland_June_2025.jpg') },
  { id: 'no-odegaard',  name: 'Martin Ødegaard',  country: 'Noruega',   flagCode: 'no', position: 'MID', rarity: 'epic',      overall: 87, sofascoreId: 490905, special: 'Capitão do Arsenal' },
  { id: 'no-sorloth',   name: 'A. Sørloth',       country: 'Noruega',   flagCode: 'no', position: 'ATK', rarity: 'rare',      overall: 81 },

  // ───── URUGUAI ─────
  { id: 'uy-darwin',    name: 'Darwin Núñez',     country: 'Uruguai',   flagCode: 'uy', position: 'ATK', rarity: 'epic',      overall: 86, sofascoreId: 863798, special: 'Explosão Celeste' },
  { id: 'uy-valverde',  name: 'Federico Valverde',country: 'Uruguai',   flagCode: 'uy', position: 'MID', rarity: 'epic',      overall: 87, sofascoreId: 710657, special: 'Bulldozer' },
  { id: 'uy-araujo',    name: 'Ronald Araújo',    country: 'Uruguai',   flagCode: 'uy', position: 'DEF', rarity: 'rare',      overall: 84, sofascoreId: 863743 },
  { id: 'uy-bentancur', name: 'R. Bentancur',     country: 'Uruguai',   flagCode: 'uy', position: 'MID', rarity: 'rare',      overall: 82 },
  { id: 'uy-suarez',    name: 'Luis Suárez',      country: 'Uruguai',   flagCode: 'uy', position: 'ATK', rarity: 'rare',      overall: 79 },
  { id: 'uy-olivera',   name: 'Mathías Olivera',  country: 'Uruguai',   flagCode: 'uy', position: 'DEF', rarity: 'common',    overall: 77 },

  // ───── COLÔMBIA ─────
  { id: 'co-james',     name: 'James Rodríguez',  country: 'Colômbia',  flagCode: 'co', position: 'MID', rarity: 'epic',      overall: 83, sofascoreId: 99388,  special: 'El 10 de Ouro' },
  { id: 'co-luisdiaz',  name: 'Luis Díaz',        country: 'Colômbia',  flagCode: 'co', position: 'ATK', rarity: 'epic',      overall: 86, sofascoreId: 786694, special: 'Velocidade Colombiana' },
  { id: 'co-cuadrado',  name: 'Juan Cuadrado',    country: 'Colômbia',  flagCode: 'co', position: 'ATK', rarity: 'rare',      overall: 79 },
  { id: 'co-arias',     name: 'Daniel Muñoz',     country: 'Colômbia',  flagCode: 'co', position: 'DEF', rarity: 'common',    overall: 76 },

  // ───── MARROCOS ─────
  { id: 'ma-bono',      name: 'Yassine Bounou',   country: 'Marrocos',  flagCode: 'ma', position: 'GK',  rarity: 'epic',      overall: 85, sofascoreId: 154490, special: 'O Bono Invencível' },
  { id: 'ma-hakimi',    name: 'Achraf Hakimi',    country: 'Marrocos',  flagCode: 'ma', position: 'DEF', rarity: 'epic',      overall: 87, sofascoreId: 773669, special: 'Foguete pela Direita' },
  { id: 'ma-amrabat',   name: 'Sofyan Amrabat',   country: 'Marrocos',  flagCode: 'ma', position: 'MID', rarity: 'rare',      overall: 82, sofascoreId: 620980 },
  { id: 'ma-ziyech',    name: 'Hakim Ziyech',     country: 'Marrocos',  flagCode: 'ma', position: 'ATK', rarity: 'rare',      overall: 82, sofascoreId: 390854 },
  { id: 'ma-ennesyri',  name: 'En-Nesyri',        country: 'Marrocos',  flagCode: 'ma', position: 'ATK', rarity: 'rare',      overall: 80 },

  // ───── JAPÃO ─────
  { id: 'jp-mitoma',    name: 'Kaoru Mitoma',     country: 'Japão',     flagCode: 'jp', position: 'ATK', rarity: 'epic',      overall: 83, sofascoreId: 867893, special: 'Raio do Japão' },
  { id: 'jp-kubo',      name: 'Takefusa Kubo',    country: 'Japão',     flagCode: 'jp', position: 'ATK', rarity: 'epic',      overall: 83, sofascoreId: 972706, special: 'Samurai Habilidoso' },
  { id: 'jp-doan',      name: 'Ritsu Dōan',       country: 'Japão',     flagCode: 'jp', position: 'ATK', rarity: 'rare',      overall: 81 },
  { id: 'jp-endo',      name: 'Wataru Endō',      country: 'Japão',     flagCode: 'jp', position: 'MID', rarity: 'rare',      overall: 80 },
  { id: 'jp-tanaka',    name: 'Hidemasa Morita',  country: 'Japão',     flagCode: 'jp', position: 'MID', rarity: 'common',    overall: 76 },

  // ───── COREIA DO SUL ─────
  { id: 'kr-son',       name: 'Son Heung-min',    country: 'Coreia do Sul', flagCode: 'kr', position: 'ATK', rarity: 'epic',  overall: 88, sofascoreId: 175562, special: 'Capitão Asiático 🎮' },
  { id: 'kr-kim',       name: 'Kim Min-jae',      country: 'Coreia do Sul', flagCode: 'kr', position: 'DEF', rarity: 'rare',  overall: 84, sofascoreId: 852105 },
  { id: 'kr-lee',       name: 'Lee Kang-in',      country: 'Coreia do Sul', flagCode: 'kr', position: 'MID', rarity: 'rare',  overall: 81, sofascoreId: 998906 },
  { id: 'kr-hwang',     name: 'Hwang Hee-chan',   country: 'Coreia do Sul', flagCode: 'kr', position: 'ATK', rarity: 'common',overall: 77 },

  // ───── EUA ─────
  { id: 'us-pulisic',   name: 'Christian Pulisic',country: 'EUA',       flagCode: 'us', position: 'ATK', rarity: 'epic',      overall: 83, sofascoreId: 726724, special: 'Captain America ⚽' },
  { id: 'us-reyna',     name: 'Giovanni Reyna',   country: 'EUA',       flagCode: 'us', position: 'MID', rarity: 'rare',      overall: 80, sofascoreId: 935429 },
  { id: 'us-mckennie',  name: 'Weston McKennie',  country: 'EUA',       flagCode: 'us', position: 'MID', rarity: 'rare',      overall: 79, sofascoreId: 799429 },
  { id: 'us-dest',      name: 'Sergiño Dest',     country: 'EUA',       flagCode: 'us', position: 'DEF', rarity: 'common',    overall: 76 },

  // ───── MÉXICO ─────
  { id: 'mx-ochoa',     name: 'Guillermo Ochoa',  country: 'México',    flagCode: 'mx', position: 'GK',  rarity: 'rare',      overall: 82 },
  { id: 'mx-lozano',    name: 'Hirving Lozano',   country: 'México',    flagCode: 'mx', position: 'ATK', rarity: 'epic',      overall: 82, sofascoreId: 397501, special: 'El Chucky' },
  { id: 'mx-jimenez',   name: 'Raúl Jiménez',     country: 'México',    flagCode: 'mx', position: 'ATK', rarity: 'rare',      overall: 80, sofascoreId: 120419 },
  { id: 'mx-alvarez',   name: 'Edson Álvarez',    country: 'México',    flagCode: 'mx', position: 'MID', rarity: 'rare',      overall: 81, sofascoreId: 786699 },
  { id: 'mx-guardado',  name: 'Andrés Guardado',  country: 'México',    flagCode: 'mx', position: 'MID', rarity: 'common',    overall: 75 },

  // ───── ITÁLIA ─────
  { id: 'it-donnarumma',name: 'G. Donnarumma',    country: 'Itália',    flagCode: 'it', position: 'GK',  rarity: 'epic',      overall: 87, sofascoreId: 401174, special: 'Il Gigante' },
  { id: 'it-barella',   name: 'Nicolò Barella',   country: 'Itália',    flagCode: 'it', position: 'MID', rarity: 'epic',      overall: 86, sofascoreId: 376310, special: 'Motor da Azzurra' },
  { id: 'it-bastoni',   name: 'A. Bastoni',       country: 'Itália',    flagCode: 'it', position: 'DEF', rarity: 'rare',      overall: 85, sofascoreId: 750645 },
  { id: 'it-chiesa',    name: 'Federico Chiesa',  country: 'Itália',    flagCode: 'it', position: 'ATK', rarity: 'rare',      overall: 82, sofascoreId: 524613 },
  { id: 'it-raspadori', name: 'G. Raspadori',     country: 'Itália',    flagCode: 'it', position: 'ATK', rarity: 'common',    overall: 79 },
  { id: 'it-retegui',   name: 'Mateo Retegui',    country: 'Itália',    flagCode: 'it', position: 'ATK', rarity: 'common',    overall: 78 },

  // ───── SENEGAL ─────
  { id: 'sn-mane',      name: 'Sadio Mané',       country: 'Senegal',   flagCode: 'sn', position: 'ATK', rarity: 'epic',      overall: 85, sofascoreId: 75616,  special: 'Leão de Teranga' },
  { id: 'sn-diallo',    name: 'Ismaïla Sarr',     country: 'Senegal',   flagCode: 'sn', position: 'ATK', rarity: 'rare',      overall: 80 },
  { id: 'sn-kouyate',   name: 'Idrissa Gueye',    country: 'Senegal',   flagCode: 'sn', position: 'MID', rarity: 'common',    overall: 77 },

  // ───── NIGÉRIA ─────
  { id: 'ng-osimhen',   name: 'Victor Osimhen',   country: 'Nigéria',   flagCode: 'ng', position: 'ATK', rarity: 'epic',      overall: 87, sofascoreId: 828702, special: 'Super Águia' },
  { id: 'ng-lookman',   name: 'Ademola Lookman',  country: 'Nigéria',   flagCode: 'ng', position: 'ATK', rarity: 'rare',      overall: 82, sofascoreId: 790186 },
  { id: 'ng-iheanacho', name: 'K. Iheanacho',     country: 'Nigéria',   flagCode: 'ng', position: 'ATK', rarity: 'common',    overall: 76 },

  // ───── AUSTRÁLIA ─────
  { id: 'au-hrustic',   name: 'Ajdin Hrustic',    country: 'Austrália', flagCode: 'au', position: 'MID', rarity: 'common',    overall: 75 },
  { id: 'au-duke',      name: 'Mitchell Duke',    country: 'Austrália', flagCode: 'au', position: 'ATK', rarity: 'common',    overall: 73 },
  { id: 'au-sainsbury', name: 'Trent Sainsbury',  country: 'Austrália', flagCode: 'au', position: 'DEF', rarity: 'common',    overall: 72 },
];

export function getPlayerById(id: string): AlbumPlayer | undefined {
  return ALBUM_PLAYERS.find(p => p.id === id);
}

export function getPlayerImageUrl(player: AlbumPlayer): string {
  return player.photoUrl ?? '';
}

export function getFallbackAvatar(player: AlbumPlayer): string {
  const bg = { legendary: 'f59e0b', epic: '8b5cf6', rare: '3b82f6', common: '64748b' }[player.rarity];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=${bg}&color=fff&bold=true&size=256`;
}

export function getFlagUrl(code: string): string {
  return `https://flagcdn.com/48x36/${code.toLowerCase()}.png`;
}

export function drawRandomPack(size = 5, goldGuaranteed = false): AlbumPlayer[] {
  const result: AlbumPlayer[] = [];
  const weights = { legendary: 3, epic: 12, rare: 30, common: 55 };

  for (let i = 0; i < size; i++) {
    const roll = Math.random() * 100;
    let rarity: Rarity;
    if (roll < weights.legendary) rarity = 'legendary';
    else if (roll < weights.legendary + weights.epic) rarity = 'epic';
    else if (roll < weights.legendary + weights.epic + weights.rare) rarity = 'rare';
    else rarity = 'common';

    if (i === 0 && goldGuaranteed) rarity = Math.random() < 0.5 ? 'legendary' : 'epic';

    const pool = ALBUM_PLAYERS.filter(p => p.rarity === rarity);
    result.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return result;
}
