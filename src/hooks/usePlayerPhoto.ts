import { useEffect, useState } from 'react';
import { AlbumPlayer } from '@/data/albumPlayers';

// Wikipedia article title overrides for players whose display name differs from article title
const WIKI_MAP: Record<string, string> = {
  'br-bento':        'Bento Krepski',
  'br-ederson':      'Ederson (footballer, born 1993)',
  'br-bremer':       'Gleison Bremer',
  'br-andre':        'André (footballer, born 2001)',
  'br-endrick':      'Endrick (footballer)',
  'br-savinho':      'Savinho (footballer)',
  'br-gabriel':      'Gabriel Magalhães',
  'br-paqueta':      'Lucas Paquetá',
  'br-raphinha':     'Raphinha',
  'ar-macallister':  'Alexis Mac Allister',
  'ar-emiliano':     'Emiliano Martínez',
  'ar-julian':       'Julián Álvarez',
  'ar-molina':       'Nahuel Molina',
  'fr-tchouameni':   'Aurélien Tchouaméni',
  'fr-camavinga':    'Eduardo Camavinga',
  'fr-saliba':       'William Saliba',
  'fr-dembele':      'Ousmane Dembélé',
  'fr-thuram':       'Marcus Thuram',
  'fr-hernandez':    'Theo Hernández',
  'en-trent':        'Trent Alexander-Arnold',
  'en-pickford':     'Jordan Pickford',
  'en-rice':         'Declan Rice',
  'en-walker':       'Kyle Walker',
  'en-palmer':       'Cole Palmer',
  'en-mainoo':       'Kobbie Mainoo',
  'es-simon':        'Unai Simón',
  'es-carvajal':     'Dani Carvajal',
  'es-rodri':        'Rodri (footballer)',
  'es-pedri':        'Pedri',
  'es-yamal':        'Lamine Yamal',
  'es-fabian':       'Fabián Ruiz',
  'es-nwilliams':    'Nico Williams',
  'es-gavi':         'Gavi (footballer)',
  'es-olmo':         'Dani Olmo',
  'es-morata':       'Álvaro Morata',
  'pt-dcosta':       'Diogo Costa (footballer)',
  'pt-rdias':        'Rúben Dias',
  'pt-bernardo':     'Bernardo Silva',
  'pt-jfelix':       'João Félix',
  'pt-rleao':        'Rafael Leão',
  'pt-cancelo':      'João Cancelo',
  'pt-gramos':       'Gonçalo Ramos',
  'pt-vitinha':      'Vitinha (Portuguese footballer)',
  'pt-jneves':       'João Neves (footballer)',
  'de-neuer':        'Manuel Neuer',
  'de-rudiger':      'Antonio Rüdiger',
  'de-musiala':      'Jamal Musiala',
  'de-kimmich':      'Joshua Kimmich',
  'de-sane':         'Leroy Sané',
  'nl-dumfries':     'Denzel Dumfries',
  'nl-reijnders':    'Tijjani Reijnders',
  'nl-ake':          'Nathan Aké',
  'nl-dejong':       'Frenkie de Jong',
  'nl-depay':        'Memphis Depay',
  'no-odegaard':     'Martin Ødegaard',
  'no-sorloth':      'Alexander Sørloth',
  'uy-darwin':       'Darwin Núñez',
  'uy-valverde':     'Federico Valverde',
  'uy-araujo':       'Ronald Araújo',
  'uy-suarez':       'Luis Suárez',
  'uy-olivera':      'Mathías Olivera',
  'co-james':        'James Rodríguez',
  'co-luisdiaz':     'Luis Díaz',
  'co-cuadrado':     'Juan Cuadrado',
  'co-arias':        'Daniel Muñoz (footballer)',
  'ma-amrabat':      'Sofyan Amrabat',
  'ma-ziyech':       'Hakim Ziyech',
  'ma-ennesyri':     'Youssef En-Nesyri',
  'jp-doan':         'Ritsu Dōan',
  'jp-kubo':         'Takefusa Kubo',
  'kr-kim':          'Kim Min-jae',
  'us-reyna':        'Giovanni Reyna',
  'us-mckennie':     'Weston McKennie',
  'us-dest':         'Sergiño Dest',
  'mx-ochoa':        'Guillermo Ochoa',
  'mx-lozano':       'Hirving Lozano',
  'mx-alvarez':      'Edson Álvarez',
  'it-donnarumma':   'Gianluigi Donnarumma',
  'it-barella':      'Nicolò Barella',
  'it-bastoni':      'Alessandro Bastoni',
  'it-chiesa':       'Federico Chiesa',
  'it-raspadori':    'Giacomo Raspadori',
  'it-retegui':      'Mateo Retegui',
  'sn-mane':         'Sadio Mané',
  'sn-diallo':       'Ismaïla Sarr',
  'sn-kouyate':      'Idrissa Gueye',
  'ng-osimhen':      'Victor Osimhen',
  'ng-lookman':      'Ademola Lookman',
  'ng-iheanacho':    'Kelechi Iheanacho',
  'au-hrustic':      'Ajdin Hrustić',
  'au-duke':         'Mitchell Duke (footballer)',
  'au-sainsbury':    'Trent Sainsbury',
  'be-doku':         'Jérémy Doku',
  'be-tielemans':    'Youri Tielemans',
  'be-onana':        'Amadou Onana',
  'hr-kovacic':      'Mateo Kovačić',
  'hr-brozovic':     'Marcelo Brozović',
  'hr-perisic':      'Ivan Perišić',
};

// In-memory cache (survives re-renders, cleared on page reload)
const memCache = new Map<string, string>();

// Load from localStorage
try {
  const stored = localStorage.getItem('__wp_photos__');
  if (stored) {
    const parsed = JSON.parse(stored) as Record<string, string>;
    for (const [k, v] of Object.entries(parsed)) memCache.set(k, v);
  }
} catch { /* ignore */ }

function persist() {
  try {
    const obj: Record<string, string> = {};
    memCache.forEach((v, k) => { obj[k] = v; });
    localStorage.setItem('__wp_photos__', JSON.stringify(obj));
  } catch { /* ignore */ }
}

async function fetchWikiPhoto(title: string): Promise<string> {
  const encoded = encodeURIComponent(title.replace(/ /g, '_'));
  const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`);
  if (!res.ok) return '';
  const data = await res.json();
  return (data?.thumbnail?.source as string) ?? '';
}

export function usePlayerPhoto(player: AlbumPlayer): string | null {
  // If hardcoded, return immediately
  const hardcoded = player.photoUrl ?? null;

  const cacheKey = player.id;
  const [url, setUrl] = useState<string | null>(() => {
    if (hardcoded) return hardcoded;
    const cached = memCache.get(cacheKey);
    return cached ?? null;
  });

  useEffect(() => {
    if (hardcoded) { setUrl(hardcoded); return; }

    // Already cached (even empty string means "tried and failed")
    if (memCache.has(cacheKey)) {
      setUrl(memCache.get(cacheKey) || null);
      return;
    }

    const wikiTitle = WIKI_MAP[player.id] ?? player.name;
    fetchWikiPhoto(wikiTitle)
      .then(photoUrl => {
        memCache.set(cacheKey, photoUrl);
        persist();
        setUrl(photoUrl || null);
      })
      .catch(() => {
        memCache.set(cacheKey, '');
        persist();
        setUrl(null);
      });
  }, [player.id, hardcoded, cacheKey]);

  return url;
}
