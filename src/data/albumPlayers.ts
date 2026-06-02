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
  { id: 'br-danilo',     name: 'Danilo',           country: 'Brasil',    flagCode: 'br', position: 'DEF', rarity: 'rare',      overall: 80,
    photoUrl: W('d/d0/Danilo_T%C3%BCrk_2014.jpg') },
  { id: 'br-marquinhos', name: 'Marquinhos',       country: 'Brasil',    flagCode: 'br', position: 'DEF', rarity: 'epic',      overall: 86, sofascoreId: 50801,  special: 'Capitão da Defesa',
    photoUrl: W('d/dc/FC_Salzburg_gegen_Paris_Saint-Germain_UEFA_Champions_League_49_%28cropped%29.jpg') },
  { id: 'br-bento',     name: 'Bento',            country: 'Brasil',    flagCode: 'br', position: 'GK',  rarity: 'rare',      overall: 83,
    photoUrl: W('0/02/Esteghlal_F.C._v_Al_Nassr_FC%2C_3_March_2025_%28Bento_Matheus_Krepski%29.jpg') },
  { id: 'br-ederson',   name: 'Ederson',          country: 'Brasil',    flagCode: 'br', position: 'GK',  rarity: 'rare',      overall: 84,
    photoUrl: W('7/73/Ederson_%28cropped%29.png') },
  { id: 'br-bremer',    name: 'Bremer',           country: 'Brasil',    flagCode: 'br', position: 'DEF', rarity: 'rare',      overall: 83 },
  { id: 'br-andre',     name: 'André',            country: 'Brasil',    flagCode: 'br', position: 'MID', rarity: 'rare',      overall: 82,
    photoUrl: W('2/2f/Andre_Fluminense_vs_Vila_Nova_2022.png') },
  { id: 'br-vinicius',  name: 'Vinicius Jr',      country: 'Brasil',    flagCode: 'br', position: 'ATK', rarity: 'legendary', overall: 95, sofascoreId: 903036, special: 'Drible Impossível 🔥',
    photoUrl: W('c/c6/2023_05_06_Final_de_la_Copa_del_Rey_-_52879242230_%28cropped%29.jpg') },
  { id: 'br-rodrygo',   name: 'Rodrygo',          country: 'Brasil',    flagCode: 'br', position: 'ATK', rarity: 'epic',      overall: 85, sofascoreId: 843901, special: 'Gênio do Drible',
    photoUrl: W('0/05/Rodrygo_2023_%28cropped%29.jpg') },
  { id: 'br-paqueta',   name: 'Lucas Paquetá',    country: 'Brasil',    flagCode: 'br', position: 'MID', rarity: 'epic',      overall: 84, sofascoreId: 394536, special: 'Maestro do Meio',
    photoUrl: W('d/dc/Lucas_Paqueta_of_West_Ham.jpeg') },
  { id: 'br-bruno',     name: 'Bruno Guimarães',  country: 'Brasil',    flagCode: 'br', position: 'MID', rarity: 'rare',      overall: 83, sofascoreId: 814789,
    photoUrl: W('8/8e/Bruno_Guimar%C3%A3es.png') },
  { id: 'br-raphinha',  name: 'Raphinha',         country: 'Brasil',    flagCode: 'br', position: 'ATK', rarity: 'rare',      overall: 83, sofascoreId: 833836,
    photoUrl: W('c/c6/RaphinhaBenfica_%28cropped%29.png') },
  { id: 'br-endrick',   name: 'Endrick',          country: 'Brasil',    flagCode: 'br', position: 'ATK', rarity: 'epic',      overall: 84, sofascoreId: 1196608,special: 'Joia da Próxima Era ⭐',
    photoUrl: W('a/a1/Endrick-Palmeiras-Liverpool-abr24.jpg') },
  { id: 'br-savinho',   name: 'Savinho',          country: 'Brasil',    flagCode: 'br', position: 'ATK', rarity: 'rare',      overall: 80, sofascoreId: 1116726,
    photoUrl: W('b/b4/Paris_Saint-Germain_-_Manchester_City_FC%2C_22_January_2025_%2874%29_%28cropped%29.jpg') },
  { id: 'br-gabriel',   name: 'Gabriel Magalhães',country: 'Brasil',    flagCode: 'br', position: 'DEF', rarity: 'common',    overall: 78,
    photoUrl: W('3/30/1_Gabriel_Magalh%C3%A3es_2026.jpg') },
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
  { id: 'ar-emiliano',  name: 'Emiliano Martínez',country: 'Argentina', flagCode: 'ar', position: 'GK',  rarity: 'epic',      overall: 87, sofascoreId: 52255,  special: 'O Dibu',
    photoUrl: W('4/41/St._Louis_City_vs_Aston_Villa_%28Jul_2025%29_14_%28Emiliano_Mart%C3%ADnez%29.jpg') },
  { id: 'ar-lmartinez', name: 'Lisandro Martínez',country: 'Argentina', flagCode: 'ar', position: 'DEF', rarity: 'rare',      overall: 83, sofascoreId: 836542,
    photoUrl: W('6/61/Lisandro_Martinez_2022.jpg') },
  { id: 'ar-lautaro',   name: 'Lautaro Martínez', country: 'Argentina', flagCode: 'ar', position: 'ATK', rarity: 'epic',      overall: 87, sofascoreId: 745102, special: 'El Toro',
    photoUrl: W('2/2e/Lautaro_Martinez_ARGENTINA_VS_VENEZUELA_2017.jpg') },
  { id: 'ar-julian',    name: 'Julián Álvarez',   country: 'Argentina', flagCode: 'ar', position: 'ATK', rarity: 'epic',      overall: 86, sofascoreId: 863830, special: 'La Araña',
    photoUrl: W('0/03/Argentina_national_football_team_-_2_-_2022_%28Juli%C3%A1n_%C3%81lvarez%29.jpg') },
  { id: 'ar-macallister',name: 'Mac Allister',    country: 'Argentina', flagCode: 'ar', position: 'MID', rarity: 'rare',      overall: 83, sofascoreId: 794503,
    photoUrl: W('4/49/Alexis_Mac_Allister_WC_2022.jpg') },
  { id: 'ar-depaul',    name: 'Rodrigo De Paul',  country: 'Argentina', flagCode: 'ar', position: 'MID', rarity: 'rare',      overall: 82, sofascoreId: 358075,
    photoUrl: W('d/df/Rodrigo_De_Paul_NYCFC_Miami_24_Sep_2025-018_%28cropped%29.jpg') },
  { id: 'ar-dimaria',   name: 'Ángel Di María',   country: 'Argentina', flagCode: 'ar', position: 'ATK', rarity: 'epic',      overall: 84, special: 'El Fideo',
    photoUrl: W('8/8c/NIG-ARG_%285%29.jpg') },
  { id: 'ar-enzo',      name: 'Enzo Fernández',   country: 'Argentina', flagCode: 'ar', position: 'MID', rarity: 'epic',      overall: 85, special: 'Maestro Campeão',
    photoUrl: W('0/0a/Enzo_Fern%C3%A1ndez_2025_FIFA_Club_World_Cup_Final.jpg') },
  { id: 'ar-romero',    name: 'Cristian Romero',  country: 'Argentina', flagCode: 'ar', position: 'DEF', rarity: 'rare',      overall: 84,
    photoUrl: W('9/9a/Cristian_Romero_WC2022.jpg') },
  { id: 'ar-molina',    name: 'Nahuel Molina',    country: 'Argentina', flagCode: 'ar', position: 'DEF', rarity: 'common',    overall: 78,
    photoUrl: W('f/f8/Universidad_Cat%C3%B3lica_-_Rosario_Central_20190313_04.jpg') },

  // ───── FRANÇA ─────
  { id: 'fr-mbappe',    name: 'Kylian Mbappé',    country: 'França',    flagCode: 'fr', position: 'ATK', rarity: 'legendary', overall: 96, sofascoreId: 231747, special: 'Velocidade Máxima ⚡',
    photoUrl: W('6/66/Picture_with_Mbapp%C3%A9_%28cropped_and_rotated%29.jpg') },
  { id: 'fr-maignan',   name: 'Mike Maignan',     country: 'França',    flagCode: 'fr', position: 'GK',  rarity: 'rare',      overall: 85, sofascoreId: 131540,
    photoUrl: W('e/e1/Mike_Maignan_2022_Salzburg_vs_AC_Milan_2022-09-06.jpg') },
  { id: 'fr-saliba',    name: 'William Saliba',   country: 'França',    flagCode: 'fr', position: 'DEF', rarity: 'rare',      overall: 84, sofascoreId: 891526,
    photoUrl: W('8/8a/1_william_saliba_arsenal_2025_%28cropped%29.jpg') },
  { id: 'fr-dembele',   name: 'Ousmane Dembélé',  country: 'França',    flagCode: 'fr', position: 'ATK', rarity: 'rare',      overall: 84, sofascoreId: 348063,
    photoUrl: W('4/4a/Ousmane_Demb%C3%A9l%C3%A9_2018_%28cropped%29.jpg') },
  { id: 'fr-tchouameni',name: 'Tchouaméni',       country: 'França',    flagCode: 'fr', position: 'MID', rarity: 'rare',      overall: 83, sofascoreId: 882099,
    photoUrl: W('0/0f/2025_04_26_Final_de_la_Copa_del_Rey_-_Aur%C3%A9lien_Tchouam%C3%A9ni.jpg') },
  { id: 'fr-camavinga', name: 'Camavinga',        country: 'França',    flagCode: 'fr', position: 'MID', rarity: 'rare',      overall: 83, sofascoreId: 934907,
    photoUrl: W('0/05/Ofrenda_de_la_Liga_y_la_Champions-13-L.Mill%C3%A1n_%2852109790215%29_%28cropped%29.jpg') },
  { id: 'fr-thuram',    name: 'Marcus Thuram',    country: 'França',    flagCode: 'fr', position: 'ATK', rarity: 'rare',      overall: 82, sofascoreId: 880595,
    photoUrl: W('6/69/Marcus_Thuram_in_2023.jpg') },
  { id: 'fr-hernandez', name: 'Theo Hernández',   country: 'França',    flagCode: 'fr', position: 'DEF', rarity: 'rare',      overall: 83, sofascoreId: 429376,
    photoUrl: W('3/39/FC_Salzburg_vs._AC_Mailand_%28UEFA_Championsleague_2022-09-06%29_Th%C3%A9o_Hernandez.jpg') },

  // ───── INGLATERRA ─────
  { id: 'en-pickford',  name: 'Jordan Pickford',  country: 'Inglaterra',flagCode: 'gb-eng', position: 'GK',  rarity: 'rare',  overall: 83, sofascoreId: 73944,
    photoUrl: W('8/86/Jordan_Pickford_2022-07-16_1.jpg') },
  { id: 'en-bellingham',name: 'Jude Bellingham',  country: 'Inglaterra',flagCode: 'gb-eng', position: 'MID', rarity: 'epic',  overall: 89, sofascoreId: 1043351, special: 'Rei do Meio-Campo',
    photoUrl: W('f/f9/25th_Laureus_World_Sports_Awards_-_Red_Carpet_-_Jude_Bellingham_-_240422_190551-2_%28cropped%29.jpg') },
  { id: 'en-kane',      name: 'Harry Kane',       country: 'Inglaterra',flagCode: 'gb-eng', position: 'ATK', rarity: 'epic',  overall: 87, sofascoreId: 452865, special: 'Artilheiro Implacável',
    photoUrl: W('9/91/Harry_Kane_on_October_10%2C_2023.jpg') },
  { id: 'en-saka',      name: 'Bukayo Saka',      country: 'Inglaterra',flagCode: 'gb-eng', position: 'ATK', rarity: 'rare',  overall: 85, sofascoreId: 934235,
    photoUrl: W('c/cd/1_bukayo_saka_arsenal_2025_%28cropped%29.jpg') },
  { id: 'en-foden',     name: 'Phil Foden',       country: 'Inglaterra',flagCode: 'gb-eng', position: 'MID', rarity: 'rare',  overall: 86, sofascoreId: 778824,
    photoUrl: W('5/53/2023-10-04_Fu%C3%9Fball%2C_M%C3%A4nner%2C_UEFA_Champions_League%2C_RB_Leipzig_-_Manchester_City_FC_1DX_2613%2C_Phil_Foden.jpg') },
  { id: 'en-rice',      name: 'Declan Rice',      country: 'Inglaterra',flagCode: 'gb-eng', position: 'MID', rarity: 'rare',  overall: 84, sofascoreId: 793234,
    photoUrl: W('e/ea/1_declan_rice_arsenal_2025_%28cropped%29.jpg') },
  { id: 'en-trent',     name: 'Trent A.-Arnold',  country: 'Inglaterra',flagCode: 'gb-eng', position: 'DEF', rarity: 'rare',  overall: 84, sofascoreId: 688756,
    photoUrl: W('5/5d/Trent_Alexander-Arnold_2018_%28cropped%29.jpg') },
  { id: 'en-walker',    name: 'Kyle Walker',      country: 'Inglaterra',flagCode: 'gb-eng', position: 'DEF', rarity: 'common',overall: 80,
    photoUrl: W('0/01/Kyle_Walker.jpg') },
  { id: 'en-palmer',    name: 'Cole Palmer',      country: 'Inglaterra',flagCode: 'gb-eng', position: 'MID', rarity: 'epic',  overall: 87, special: 'Gênio de Chelsea',
    photoUrl: W('f/fb/Cole_Palmer_2025_FIFA_Club_World_Cup_Final.jpg') },
  { id: 'en-mainoo',    name: 'Kobbie Mainoo',    country: 'Inglaterra',flagCode: 'gb-eng', position: 'MID', rarity: 'rare',  overall: 80 },

  // ───── ESPANHA ─────
  { id: 'es-simon',     name: 'Unai Simón',       country: 'Espanha',   flagCode: 'es', position: 'GK',  rarity: 'rare',      overall: 83,
    photoUrl: W('b/ba/Unai_Sim%C3%B3n_2025_%28cropped%29.jpg') },
  { id: 'es-carvajal',  name: 'Dani Carvajal',    country: 'Espanha',   flagCode: 'es', position: 'DEF', rarity: 'rare',      overall: 83, sofascoreId: 101817,
    photoUrl: W('b/b6/UEFA_EURO_qualifiers_Sweden_vs_Spain_20191015_Dani_Carvajal_10_%28cropped%29.jpg') },
  { id: 'es-rodri',     name: 'Rodri',            country: 'Espanha',   flagCode: 'es', position: 'MID', rarity: 'epic',      overall: 90, sofascoreId: 700041, special: 'Controle Total',
    photoUrl: W('4/41/RODRI_-_SWE_vs_ESP_-_UEFA_EURO_2020_QUALIFIERS_-_2019.10.15_%28cropped%29.jpg') },
  { id: 'es-pedri',     name: 'Pedri',            country: 'Espanha',   flagCode: 'es', position: 'MID', rarity: 'epic',      overall: 87, sofascoreId: 984498, special: 'Maestro Catalão',
    photoUrl: W('1/13/Pedri.jpg') },
  { id: 'es-yamal',     name: 'Lamine Yamal',     country: 'Espanha',   flagCode: 'es', position: 'ATK', rarity: 'epic',      overall: 87, sofascoreId: 1130889,special: 'Prodígio do Futuro 🌟',
    photoUrl: W('e/e3/Lamine_Yamal_in_2025.jpg') },
  { id: 'es-morata',    name: 'Álvaro Morata',    country: 'Espanha',   flagCode: 'es', position: 'ATK', rarity: 'rare',      overall: 82,
    photoUrl: W('6/62/%C3%81lvaro_Morata_in_2025.jpg') },
  { id: 'es-fabian',    name: 'Fabián Ruiz',      country: 'Espanha',   flagCode: 'es', position: 'MID', rarity: 'rare',      overall: 82, sofascoreId: 474524,
    photoUrl: W('7/7e/Ruiz_asse_psg_2425.png') },
  { id: 'es-nwilliams', name: 'Nico Williams',   country: 'Espanha',   flagCode: 'es', position: 'ATK', rarity: 'epic',      overall: 85, special: 'Velocidade Basca',
    photoUrl: W('1/1d/ATHLETIC-OSASUNA_SEMIFINAL._MAIDER_GOIKOETXEA_%28168%29_%28cropped%29.jpg') },
  { id: 'es-gavi',      name: 'Gavi',            country: 'Espanha',   flagCode: 'es', position: 'MID', rarity: 'epic',      overall: 85, special: 'Joia do Barça',
    photoUrl: W('1/1e/Jugadors_pretemporada_pels_Estats_Units_%28cropped%292.jpg') },
  { id: 'es-olmo',      name: 'Dani Olmo',       country: 'Espanha',   flagCode: 'es', position: 'MID', rarity: 'rare',      overall: 83,
    photoUrl: W('e/e0/Dani_Olmo_2022.jpg') },

  // ───── PORTUGAL ─────
  { id: 'pt-ronaldo',   name: 'Cristiano Ronaldo',country: 'Portugal',  flagCode: 'pt', position: 'ATK', rarity: 'legendary', overall: 93, sofascoreId: 36569,  special: 'CR7 — A Lenda ⭐',
    photoUrl: W('9/9c/President_Donald_Trump_meets_with_Cristiano_Ronaldo_in_the_Oval_Office_%2854933344262%29_%28cropped_and_rotated%29.jpg') },
  { id: 'pt-dcosta',    name: 'Diogo Costa',      country: 'Portugal',  flagCode: 'pt', position: 'GK',  rarity: 'rare',      overall: 83, sofascoreId: 877903,
    photoUrl: W('c/c3/Portugal_national_football_team_0866_%28Diogo_Costa%29.jpg') },
  { id: 'pt-rdias',     name: 'Rúben Dias',       country: 'Portugal',  flagCode: 'pt', position: 'DEF', rarity: 'epic',      overall: 87, sofascoreId: 521213, special: 'Muro de Pedra',
    photoUrl: W('9/9a/Portugal_national_football_team_0866_%28R%C3%BAben_Dias%29.jpg') },
  { id: 'pt-bernardo',  name: 'Bernardo Silva',   country: 'Portugal',  flagCode: 'pt', position: 'MID', rarity: 'epic',      overall: 87, sofascoreId: 162281, special: 'Polvo do Campo',
    photoUrl: W('c/cf/Bernardo_Silva_%28Isto_%C3%89_Gozar_Com_Quem_Trabalha%2C_2024%29.png') },
  { id: 'pt-bruno',     name: 'Bruno Fernandes',  country: 'Portugal',  flagCode: 'pt', position: 'MID', rarity: 'epic',      overall: 86, sofascoreId: 200717, special: 'Chefe da Criação',
    photoUrl: W('c/c7/Bruno_Fernandes_USMNT_v_Portugal_Mar_31_2026-27_%28cropped%29.jpg') },
  { id: 'pt-jfelix',    name: 'João Félix',       country: 'Portugal',  flagCode: 'pt', position: 'ATK', rarity: 'rare',      overall: 83, sofascoreId: 905399,
    photoUrl: W('5/55/Jo%C3%A3o_F%C3%A9lix_USMNT_v_Portugal_Mar_31_2026-22_%28cropped%29.jpg') },
  { id: 'pt-rleao',     name: 'Rafael Leão',      country: 'Portugal',  flagCode: 'pt', position: 'ATK', rarity: 'rare',      overall: 83, sofascoreId: 829290,
    photoUrl: W('0/02/RafaelLe%C3%A3oPortugal23.jpg') },
  { id: 'pt-cancelo',   name: 'João Cancelo',     country: 'Portugal',  flagCode: 'pt', position: 'DEF', rarity: 'rare',      overall: 83, sofascoreId: 187241,
    photoUrl: W('2/28/Jo%C3%A3o_Cancelo_USMNT_v_Portugal_Mar_31_2026-30_%28cropped%29.jpg') },
  { id: 'pt-gramos',    name: 'Gonçalo Ramos',    country: 'Portugal',  flagCode: 'pt', position: 'ATK', rarity: 'rare',      overall: 83,
    photoUrl: W('c/ce/Gon%C3%A7alo_Ramos_USMNT_v_Portugal_Mar_31_2026-32_%28cropped%29.jpg') },
  { id: 'pt-vitinha',   name: 'Vitinha',          country: 'Portugal',  flagCode: 'pt', position: 'MID', rarity: 'rare',      overall: 83,
    photoUrl: W('4/44/Vitinha_USMNT_v_Portugal_Mar_31_2026-50_%28cropped%29.jpg') },
  { id: 'pt-jneves',    name: 'João Neves',       country: 'Portugal',  flagCode: 'pt', position: 'MID', rarity: 'rare',      overall: 82,
    photoUrl: W('c/ce/Jo%C3%A3o_Neves_USMNT_v_Portugal_Mar_31_2026-18_%28cropped%29.jpg') },

  // ───── ALEMANHA ─────
  { id: 'de-neuer',     name: 'Manuel Neuer',     country: 'Alemanha',  flagCode: 'de', position: 'GK',  rarity: 'epic',      overall: 85, sofascoreId: 16484,  special: 'Sweep-Keeper Lendário',
    photoUrl: W('1/10/20180602_FIFA_Friendly_Match_Austria_vs._Germany_Manuel_Neuer_850_0723.jpg') },
  { id: 'de-rudiger',   name: 'Antonio Rüdiger',  country: 'Alemanha',  flagCode: 'de', position: 'DEF', rarity: 'rare',      overall: 84, sofascoreId: 236817,
    photoUrl: W('0/08/2025_04_26_Final_de_la_Copa_del_Rey_-_54482387776_%28Elenco_do_Real_Madrid%29_%28Antonio_R%C3%BCdiger%29.jpg') },
  { id: 'de-wirtz',     name: 'Florian Wirtz',    country: 'Alemanha',  flagCode: 'de', position: 'MID', rarity: 'epic',      overall: 87, sofascoreId: 1082762,special: 'Wunderkind',
    photoUrl: W('5/5d/Florian_Wirtz%2C_2022-07-31%2C_Saisoner%C3%B6ffnung_Bayer_04%2C_Leverkusen_%281%29_%28cropped%29.jpg') },
  { id: 'de-musiala',   name: 'Jamal Musiala',    country: 'Alemanha',  flagCode: 'de', position: 'MID', rarity: 'epic',      overall: 86, sofascoreId: 1010796,special: 'Bailarino do Campo',
    photoUrl: W('4/44/Jamal_Musiala_2022_%28cropped%29.jpg') },
  { id: 'de-havertz',   name: 'Kai Havertz',      country: 'Alemanha',  flagCode: 'de', position: 'ATK', rarity: 'rare',      overall: 83, sofascoreId: 773323,
    photoUrl: W('e/e8/2019-06-11_Fu%C3%9Fball%2C_M%C3%A4nner%2C_L%C3%A4nderspiel%2C_Deutschland-Estland_StP_2059_LR10_by_Stepro.jpg') },
  { id: 'de-kimmich',   name: 'Joshua Kimmich',   country: 'Alemanha',  flagCode: 'de', position: 'MID', rarity: 'rare',      overall: 85, sofascoreId: 319765,
    photoUrl: W('4/48/2019-06-11_Fu%C3%9Fball%2C_M%C3%A4nner%2C_L%C3%A4nderspiel%2C_Deutschland-Estland_StP_2078_LR10_by_Stepro_%28cropped%29.jpg') },
  { id: 'de-sane',      name: 'Leroy Sané',       country: 'Alemanha',  flagCode: 'de', position: 'ATK', rarity: 'rare',      overall: 82, sofascoreId: 338721,
    photoUrl: W('b/bf/FC_Red_Bull_Salzburg_gegen_Bayern_M%C3%BCnchen_%282025-01-06_Testspiel%29_22.jpg') },

  // ───── HOLANDA ─────
  { id: 'nl-vandijk',   name: 'Virgil van Dijk',  country: 'Holanda',   flagCode: 'nl', position: 'DEF', rarity: 'epic',      overall: 88, sofascoreId: 236501, special: 'Gigante da Defesa',
    photoUrl: W('5/5d/20160604_AUT_NED_8876_%28cropped%29.jpg') },
  { id: 'nl-dumfries',  name: 'Denzel Dumfries',  country: 'Holanda',   flagCode: 'nl', position: 'DEF', rarity: 'rare',      overall: 82, sofascoreId: 617498,
    photoUrl: W('b/b7/Edison_ndreca_inter_egnati_%28cropped_Denzel_Dumfries%29.jpg') },
  { id: 'nl-gakpo',     name: 'Cody Gakpo',       country: 'Holanda',   flagCode: 'nl', position: 'ATK', rarity: 'rare',      overall: 83, sofascoreId: 826062,
    photoUrl: W('4/4f/Cody_Gakpo_06042025_%282%29_%28cropped%29.jpg') },
  { id: 'nl-xavi',      name: 'Xavi Simons',      country: 'Holanda',   flagCode: 'nl', position: 'MID', rarity: 'rare',      overall: 83, sofascoreId: 1082748,
    photoUrl: W('6/6d/Xavi_Simons%2C_Nick_Verhagen_in_duel_met_Xavi_Simons.jpg') },
  { id: 'nl-reijnders', name: 'Tijjani Reijnders',country: 'Holanda',   flagCode: 'nl', position: 'MID', rarity: 'rare',      overall: 82,
    photoUrl: W('5/5b/Reijnders_arriva_in_albergo_%28cropped%29.jpg') },
  { id: 'nl-ake',       name: 'Nathan Aké',       country: 'Holanda',   flagCode: 'nl', position: 'DEF', rarity: 'common',    overall: 80,
    photoUrl: W('3/34/Yokohama_F._Marinos_-_Manchester_City_%283-5%29_-_53075276224_%28Nathan_Ake%29.jpg') },
  { id: 'nl-dejong',    name: 'Frenkie de Jong',  country: 'Holanda',   flagCode: 'nl', position: 'MID', rarity: 'epic',      overall: 85, special: 'Maestro Laranja',
    photoUrl: W('4/42/Frenkie_De_Jong_2022_%28cropped%29.jpg') },
  { id: 'nl-depay',     name: 'Memphis Depay',    country: 'Holanda',   flagCode: 'nl', position: 'ATK', rarity: 'rare',      overall: 82,
    photoUrl: W('1/1c/Memphis_Depay_2019.jpg') },

  // ───── NORUEGA (Haaland) ─────
  { id: 'no-haaland',   name: 'Erling Haaland',   country: 'Noruega',   flagCode: 'no', position: 'ATK', rarity: 'legendary', overall: 96, sofascoreId: 839956, special: 'Máquina de Gols 🚀',
    photoUrl: W('7/71/Erling_Haaland_June_2025.jpg') },
  { id: 'no-odegaard',  name: 'Martin Ødegaard',  country: 'Noruega',   flagCode: 'no', position: 'MID', rarity: 'epic',      overall: 87, sofascoreId: 490905, special: 'Capitão do Arsenal',
    photoUrl: W('a/aa/Norway_Italy_-_June_2025_E_04.jpg') },
  { id: 'no-sorloth',   name: 'A. Sørloth',       country: 'Noruega',   flagCode: 'no', position: 'ATK', rarity: 'rare',      overall: 81,
    photoUrl: W('e/e2/Norway_Italy_-_June_2025_E_10.jpg') },

  // ───── URUGUAI ─────
  { id: 'uy-darwin',    name: 'Darwin Núñez',     country: 'Uruguai',   flagCode: 'uy', position: 'ATK', rarity: 'epic',      overall: 86, sofascoreId: 863798, special: 'Explosão Celeste',
    photoUrl: W('1/11/Darwin_N%C3%BA%C3%B1ez_%28cropped%29.jpg') },
  { id: 'uy-valverde',  name: 'Federico Valverde',country: 'Uruguai',   flagCode: 'uy', position: 'MID', rarity: 'epic',      overall: 87, sofascoreId: 710657, special: 'Bulldozer',
    photoUrl: W('7/73/Federico_Valverde_2021_%28cropped%29.jpg') },
  { id: 'uy-araujo',    name: 'Ronald Araújo',    country: 'Uruguai',   flagCode: 'uy', position: 'DEF', rarity: 'rare',      overall: 84, sofascoreId: 863743,
    photoUrl: W('3/3f/FC_Red_Bull_Salzburg_gegen_CF_Barcelona_%28Testspiel_4._August_2021%29_45_%28cropped%29.jpg') },
  { id: 'uy-bentancur', name: 'R. Bentancur',     country: 'Uruguai',   flagCode: 'uy', position: 'MID', rarity: 'rare',      overall: 82,
    photoUrl: W('c/c8/20171114_AUT_URU_4518_-_Rodrigo_Bentancur_%28cropped%29_2.jpg') },
  { id: 'uy-suarez',    name: 'Luis Suárez',      country: 'Uruguai',   flagCode: 'uy', position: 'ATK', rarity: 'rare',      overall: 79,
    photoUrl: W('f/f7/Luis_Su%C3%A1rez_2026_%28cropped%29.jpg') },
  { id: 'uy-olivera',   name: 'Mathías Olivera',  country: 'Uruguai',   flagCode: 'uy', position: 'DEF', rarity: 'common',    overall: 77,
    photoUrl: W('f/f5/Math%C3%ADas_Olivera_WC2022.jpg') },

  // ───── COLÔMBIA ─────
  { id: 'co-james',     name: 'James Rodríguez',  country: 'Colômbia',  flagCode: 'co', position: 'MID', rarity: 'epic',      overall: 83, sofascoreId: 99388,  special: 'El 10 de Ouro',
    photoUrl: W('7/79/James_Rodriguez_2018.jpg') },
  { id: 'co-luisdiaz',  name: 'Luis Díaz',        country: 'Colômbia',  flagCode: 'co', position: 'ATK', rarity: 'epic',      overall: 86, sofascoreId: 786694, special: 'Velocidade Colombiana',
    photoUrl: W('c/c7/FC_RB_Salzburg_gegen_FC_Bayern_M%C3%BCnchen_%282026-01-06_Testspiel%29_40_%28Luiz_D%C3%ADaz%29.jpg') },
  { id: 'co-cuadrado',  name: 'Juan Cuadrado',    country: 'Colômbia',  flagCode: 'co', position: 'ATK', rarity: 'rare',      overall: 79 },
  { id: 'co-arias',     name: 'Daniel Muñoz',     country: 'Colômbia',  flagCode: 'co', position: 'DEF', rarity: 'common',    overall: 76,
    photoUrl: W('d/df/Fredrikstad_Fotballklubb_v_Crystal_Palace_FC%2C_28_August_2025_A36.jpg') },

  // ───── MARROCOS ─────
  { id: 'ma-bono',      name: 'Yassine Bounou',   country: 'Marrocos',  flagCode: 'ma', position: 'GK',  rarity: 'epic',      overall: 85, sofascoreId: 154490, special: 'O Bono Invencível' },
  { id: 'ma-hakimi',    name: 'Achraf Hakimi',    country: 'Marrocos',  flagCode: 'ma', position: 'DEF', rarity: 'epic',      overall: 87, sofascoreId: 773669, special: 'Foguete pela Direita',
    photoUrl: W('5/56/Achraf_Hakimi_%28cropped2%29.jpg') },
  { id: 'ma-amrabat',   name: 'Sofyan Amrabat',   country: 'Marrocos',  flagCode: 'ma', position: 'MID', rarity: 'rare',      overall: 82, sofascoreId: 620980,
    photoUrl: W('0/0f/Sofyan_Amrabat_vs_Niger_%28cropped%29.jpg') },
  { id: 'ma-ziyech',    name: 'Hakim Ziyech',     country: 'Marrocos',  flagCode: 'ma', position: 'ATK', rarity: 'rare',      overall: 82, sofascoreId: 390854,
    photoUrl: W('e/e1/Hakim_Ziyech_2021.jpg') },
  { id: 'ma-ennesyri',  name: 'En-Nesyri',        country: 'Marrocos',  flagCode: 'ma', position: 'ATK', rarity: 'rare',      overall: 80,
    photoUrl: W('2/26/Ennesyri.jpg') },

  // ───── JAPÃO ─────
  { id: 'jp-mitoma',    name: 'Kaoru Mitoma',     country: 'Japão',     flagCode: 'jp', position: 'ATK', rarity: 'epic',      overall: 83, sofascoreId: 867893, special: 'Raio do Japão',
    photoUrl: W('9/90/Kaoru_Mitoma_%282022%29.jpg') },
  { id: 'jp-kubo',      name: 'Takefusa Kubo',    country: 'Japão',     flagCode: 'jp', position: 'ATK', rarity: 'epic',      overall: 83, sofascoreId: 972706, special: 'Samurai Habilidoso',
    photoUrl: W('b/be/Takefusa_Kubo_2019.png') },
  { id: 'jp-doan',      name: 'Ritsu Dōan',       country: 'Japão',     flagCode: 'jp', position: 'ATK', rarity: 'rare',      overall: 81,
    photoUrl: W('1/17/Ritsu_Doan%2C_2019_AFC_Asian_Cup_1.jpg') },
  { id: 'jp-endo',      name: 'Wataru Endō',      country: 'Japão',     flagCode: 'jp', position: 'MID', rarity: 'rare',      overall: 80,
    photoUrl: W('f/fe/Wataru_Endo_at_Iran-Japan_pre-match_conference.jpg') },
  { id: 'jp-tanaka',    name: 'Hidemasa Morita',  country: 'Japão',     flagCode: 'jp', position: 'MID', rarity: 'common',    overall: 76,
    photoUrl: W('4/45/%E5%AE%88%E7%94%B0%E8%8B%B1%E6%AD%A3_%28cropped%29.jpg') },

  // ───── COREIA DO SUL ─────
  { id: 'kr-son',       name: 'Son Heung-min',    country: 'Coreia do Sul', flagCode: 'kr', position: 'ATK', rarity: 'epic',  overall: 88, sofascoreId: 175562, special: 'Capitão Asiático 🎮',
    photoUrl: W('b/b0/BFA_2023_-2_Heung-Min_Son_%28cropped%29.jpg') },
  { id: 'kr-kim',       name: 'Kim Min-jae',      country: 'Coreia do Sul', flagCode: 'kr', position: 'DEF', rarity: 'rare',  overall: 84, sofascoreId: 852105,
    photoUrl: W('8/80/FC_Red_Bull_Salzburg_gegen_Bayern_M%C3%BCnchen_%282025-01-06_Testspiel%29_26.jpg') },
  { id: 'kr-lee',       name: 'Lee Kang-in',      country: 'Coreia do Sul', flagCode: 'kr', position: 'MID', rarity: 'rare',  overall: 81, sofascoreId: 998906,
    photoUrl: W('1/13/Lee_Kang-in_-_2022_%2852551771501%29_%28cropped%29.jpg') },
  { id: 'kr-hwang',     name: 'Hwang Hee-chan',   country: 'Coreia do Sul', flagCode: 'kr', position: 'ATK', rarity: 'common',overall: 77,
    photoUrl: W('b/be/240622_%ED%99%A9%ED%9D%AC%EC%B0%AC_%ED%92%8B%EB%B3%BC_%ED%8E%98%EC%8A%A4%ED%8B%B0%EB%B2%8C.jpg') },

  // ───── EUA ─────
  { id: 'us-pulisic',   name: 'Christian Pulisic',country: 'EUA',       flagCode: 'us', position: 'ATK', rarity: 'epic',      overall: 83, sofascoreId: 726724, special: 'Captain America ⚽',
    photoUrl: W('7/71/Christian_Pulisic_USMNT_v_Belgium_Mar_28_2026-73_%28cropped%29.jpg') },
  { id: 'us-reyna',     name: 'Giovanni Reyna',   country: 'EUA',       flagCode: 'us', position: 'MID', rarity: 'rare',      overall: 80, sofascoreId: 935429,
    photoUrl: W('2/25/Gio_Reyna_USMNT_v_Belgium_Mar_28_2026-60_%28cropped%29.jpg') },
  { id: 'us-mckennie',  name: 'Weston McKennie',  country: 'EUA',       flagCode: 'us', position: 'MID', rarity: 'rare',      overall: 79, sofascoreId: 799429,
    photoUrl: W('d/d5/Weston_McKennie_USMNT_v_Belgium_Mar_28_2026-68_%28cropped%29.jpg') },
  { id: 'us-dest',      name: 'Sergiño Dest',     country: 'EUA',       flagCode: 'us', position: 'DEF', rarity: 'common',    overall: 76,
    photoUrl: W('6/6e/Sergino_Dest.jpg') },

  // ───── MÉXICO ─────
  { id: 'mx-ochoa',     name: 'Guillermo Ochoa',  country: 'México',    flagCode: 'mx', position: 'GK',  rarity: 'rare',      overall: 82,
    photoUrl: W('2/2f/Mex-Kor_%281%29_%28cropped%29.jpg') },
  { id: 'mx-lozano',    name: 'Hirving Lozano',   country: 'México',    flagCode: 'mx', position: 'ATK', rarity: 'epic',      overall: 82, sofascoreId: 397501, special: 'El Chucky',
    photoUrl: W('e/e3/Hirving_Lozano.png') },
  { id: 'mx-gimenez',   name: 'Santiago Giménez', country: 'México',    flagCode: 'mx', position: 'ATK', rarity: 'epic',      overall: 84, special: 'El Bebote',
    photoUrl: W('d/d8/Santiago_Gim%C3%A9nez.png') },
  { id: 'mx-alvarez',   name: 'Edson Álvarez',    country: 'México',    flagCode: 'mx', position: 'MID', rarity: 'rare',      overall: 81, sofascoreId: 786699,
    photoUrl: W('9/91/Edson_%C3%81lvarez.png') },

  // ───── ITÁLIA ─────
  { id: 'it-donnarumma',name: 'G. Donnarumma',    country: 'Itália',    flagCode: 'it', position: 'GK',  rarity: 'epic',      overall: 87, sofascoreId: 401174, special: 'Il Gigante',
    photoUrl: W('2/2d/Norway_Italy_-_June_2025_A_17_%28Gianluigi_Donnarumma%29.jpg') },
  { id: 'it-barella',   name: 'Nicolò Barella',   country: 'Itália',    flagCode: 'it', position: 'MID', rarity: 'epic',      overall: 86, sofascoreId: 376310, special: 'Motor da Azzurra',
    photoUrl: W('3/33/Nicol%C3%B2_Barella_in_2021_%28cropped_2%29.jpg') },
  { id: 'it-bastoni',   name: 'A. Bastoni',       country: 'Itália',    flagCode: 'it', position: 'DEF', rarity: 'rare',      overall: 85, sofascoreId: 750645,
    photoUrl: W('6/65/Norway_Italy_-_June_2025_A_36_%28cropped%29.jpg') },
  { id: 'it-chiesa',    name: 'Federico Chiesa',  country: 'Itália',    flagCode: 'it', position: 'ATK', rarity: 'rare',      overall: 82, sofascoreId: 524613,
    photoUrl: W('2/29/Federico_Chiesa_vs_Zenit_2021-10-20_%28cropped2%29.jpg') },
  { id: 'it-raspadori', name: 'G. Raspadori',     country: 'Itália',    flagCode: 'it', position: 'ATK', rarity: 'common',    overall: 79,
    photoUrl: W('9/95/Raspadori_Nazionale.jpg') },
  { id: 'it-retegui',   name: 'Mateo Retegui',    country: 'Itália',    flagCode: 'it', position: 'ATK', rarity: 'common',    overall: 78,
    photoUrl: W('d/d6/Norway_Italy_-_June_2025_A_21_%28cropped%29.jpg') },

  // ───── SENEGAL ─────
  { id: 'sn-mane',      name: 'Sadio Mané',       country: 'Senegal',   flagCode: 'sn', position: 'ATK', rarity: 'epic',      overall: 85, sofascoreId: 75616,  special: 'Leão de Teranga',
    photoUrl: W('1/1a/Sadio_Mane_Al-Nassr.jpg') },
  { id: 'sn-diallo',    name: 'Ismaïla Sarr',     country: 'Senegal',   flagCode: 'sn', position: 'ATK', rarity: 'rare',      overall: 80,
    photoUrl: W('0/0b/Ismaila_Sarr_2022.jpg') },
  { id: 'sn-kouyate',   name: 'Idrissa Gueye',    country: 'Senegal',   flagCode: 'sn', position: 'MID', rarity: 'common',    overall: 77,
    photoUrl: W('a/ac/Idrissa_Gueye_%28cropped%29.jpg') },

  // ───── NIGÉRIA ─────
  { id: 'ng-osimhen',   name: 'Victor Osimhen',   country: 'Nigéria',   flagCode: 'ng', position: 'ATK', rarity: 'epic',      overall: 87, sofascoreId: 828702, special: 'Super Águia',
    photoUrl: W('3/34/Victor-osimhen-nigeria-2024-3-4.jpg') },
  { id: 'ng-lookman',   name: 'Ademola Lookman',  country: 'Nigéria',   flagCode: 'ng', position: 'ATK', rarity: 'rare',      overall: 82, sofascoreId: 790186,
    photoUrl: W('b/b7/Ademola_Lookman_%282019%29_%28cropped%29.jpg') },
  { id: 'ng-iheanacho', name: 'K. Iheanacho',     country: 'Nigéria',   flagCode: 'ng', position: 'ATK', rarity: 'common',    overall: 76,
    photoUrl: W('3/3b/Kelechi_Iheanacho_24-02-15_02.jpg') },

  // ───── AUSTRÁLIA ─────
  { id: 'au-hrustic',   name: 'Ajdin Hrustic',    country: 'Austrália', flagCode: 'au', position: 'MID', rarity: 'common',    overall: 75,
    photoUrl: W('3/34/Ajdin_Hrusti%C4%87_bij_Heracles_Almelo_%282025%29.JPG') },
  { id: 'au-duke',      name: 'Mitchell Duke',    country: 'Austrália', flagCode: 'au', position: 'ATK', rarity: 'common',    overall: 73,
    photoUrl: W('0/00/Mitchell_Duke_2020.png') },
  { id: 'au-sainsbury', name: 'Trent Sainsbury',  country: 'Austrália', flagCode: 'au', position: 'DEF', rarity: 'common',    overall: 72,
    photoUrl: W('d/d5/20180601_FIFA_Friendly_Match_Czech_Republic_vs._Australia_Trent_Sainsbury_850_0224.jpg') },

  // ───── BÉLGICA ─────
  { id: 'be-debruyne',  name: 'Kevin De Bruyne',  country: 'Bélgica',   flagCode: 'be', position: 'MID', rarity: 'legendary', overall: 92, special: 'Arquiteto do Campo 🎯',
    photoUrl: W('4/40/Kevin_De_Bruyne_USMNT_v_Belgium_Mar_28_2026-64_%28cropped%29.jpg') },
  { id: 'be-lukaku',    name: 'Romelu Lukaku',    country: 'Bélgica',   flagCode: 'be', position: 'ATK', rarity: 'epic',      overall: 87, special: 'Big Rom',
    photoUrl: W('d/dc/Romelu_Lukaku_2021.jpg') },
  { id: 'be-doku',      name: 'Jérémy Doku',      country: 'Bélgica',   flagCode: 'be', position: 'ATK', rarity: 'rare',      overall: 82,
    photoUrl: W('0/06/J%C3%A9r%C3%A9my_Doku_USMNT_v_Belgium_Mar_28_2026-27_%28cropped%29.jpg') },
  { id: 'be-tielemans', name: 'Youri Tielemans',  country: 'Bélgica',   flagCode: 'be', position: 'MID', rarity: 'rare',      overall: 81,
    photoUrl: W('f/ff/Youri_Tielemans_USMNT_v_Belgium_Mar_28_2026-20_%28cropped%29.jpg') },
  { id: 'be-onana',     name: 'Amadou Onana',     country: 'Bélgica',   flagCode: 'be', position: 'MID', rarity: 'rare',      overall: 82,
    photoUrl: W('3/36/Amadou_Onana_USMNT_v_Belgium_Mar_28_2026-96_%28cropped%29.jpg') },

  // ───── CROÁCIA ─────
  { id: 'hr-modric',    name: 'Luka Modrić',      country: 'Croácia',   flagCode: 'hr', position: 'MID', rarity: 'legendary', overall: 91, special: 'O Eterno Maestro ⭐',
    photoUrl: W('1/1b/Ofrenda_de_la_Liga_y_la_Champions-57-L.Mill%C3%A1n_%2852109310843%29_%28Luka_Modri%C4%87%29.jpg') },
  { id: 'hr-gvardiol',  name: 'Joško Gvardiol',   country: 'Croácia',   flagCode: 'hr', position: 'DEF', rarity: 'epic',      overall: 86, special: 'Rocha da Croácia',
    photoUrl: W('6/6a/2023-10-04_Fu%C3%9Fball%2C_M%C3%A4nner%2C_UEFA_Champions_League%2C_RB_Leipzig_-_Manchester_City_FC_1DX_2611_%28Jo%C5%A1ko_Gvardiol%29.jpg') },
  { id: 'hr-kovacic',   name: 'Mateo Kovačić',    country: 'Croácia',   flagCode: 'hr', position: 'MID', rarity: 'epic',      overall: 84, special: 'Motor Croata',
    photoUrl: W('d/d9/Chelsea_vs._Arsenal%2C_29_May_2019_18_Kovacic.jpg') },
  { id: 'hr-brozovic',  name: 'Marcelo Brozović', country: 'Croácia',   flagCode: 'hr', position: 'MID', rarity: 'rare',      overall: 83,
    photoUrl: W('c/c9/Marcelo_Brozovi%C4%87_2021_%28cropped%29.jpg') },
  { id: 'hr-perisic',   name: 'Ivan Perišić',     country: 'Croácia',   flagCode: 'hr', position: 'ATK', rarity: 'rare',      overall: 81,
    photoUrl: W('8/85/Ivan_Peri%C5%A1i%C4%87_%28cropped%29.jpg') },
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
