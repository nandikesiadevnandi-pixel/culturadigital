import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlbum } from '@/hooks/useAlbum';
import { ALBUM_PLAYERS, AlbumPlayer, RARITY_CONFIG, Rarity } from '@/data/albumPlayers';
import { CardFigurina } from '@/components/album/CardFigurina';
import { CopaBackground } from '@/components/album/CopaBackground';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Search, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const COUNTRY_ORDER = [
  'Brasil','Argentina','França','Inglaterra','Espanha','Portugal',
  'Alemanha','Holanda','Noruega','Uruguai','Colômbia','Marrocos',
  'Japão','Coreia do Sul','EUA','México','Itália','Senegal','Nigéria',
  'Austrália','Bélgica','Croácia',
];

const FLAG: Record<string, string> = {
  'Brasil':'🇧🇷','Argentina':'🇦🇷','França':'🇫🇷','Inglaterra':'🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Espanha':'🇪🇸','Portugal':'🇵🇹','Alemanha':'🇩🇪','Holanda':'🇳🇱',
  'Noruega':'🇳🇴','Uruguai':'🇺🇾','Colômbia':'🇨🇴','Marrocos':'🇲🇦',
  'Japão':'🇯🇵','Coreia do Sul':'🇰🇷','EUA':'🇺🇸','México':'🇲🇽',
  'Itália':'🇮🇹','Senegal':'🇸🇳','Nigéria':'🇳🇬','Austrália':'🇦🇺',
  'Bélgica':'🇧🇪','Croácia':'🇭🇷',
};

type SubFilter = 'all' | 'owned' | 'missing' | Rarity;

export default function InventarioPage() {
  const album = useAlbum();
  const [search, setSearch] = useState('');
  const [subFilter, setSubFilter] = useState<SubFilter>('all');
  const [country, setCountry] = useState<string>('all');
  const [selected, setSelected] = useState<AlbumPlayer | null>(null);

  const invMap = useMemo(() => {
    const m = new Map<string, number>();
    album.inventory.forEach(e => m.set(e.cardId, e.quantity));
    return m;
  }, [album.inventory]);

  const countries = useMemo(() => {
    const inData = new Set(ALBUM_PLAYERS.map(p => p.country));
    return COUNTRY_ORDER.filter(c => inData.has(c));
  }, []);

  const countryProgress = useMemo(() => {
    const map: Record<string, { owned: number; total: number }> = {};
    ALBUM_PLAYERS.forEach(p => {
      if (!map[p.country]) map[p.country] = { owned: 0, total: 0 };
      map[p.country].total++;
      if ((invMap.get(p.id) ?? 0) >= 1) map[p.country].owned++;
    });
    return map;
  }, [invMap]);

  const filtered = useMemo(() => {
    return ALBUM_PLAYERS.filter(p => {
      if (country !== 'all' && p.country !== country) return false;
      const qty = invMap.get(p.id) ?? 0;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      switch (subFilter) {
        case 'owned':   return qty >= 1;
        case 'missing': return qty === 0;
        case 'common': case 'rare': case 'epic': case 'legendary':
          return p.rarity === subFilter;
        default: return true;
      }
    });
  }, [country, invMap, search, subFilter]);

  const totalOwned = ALBUM_PLAYERS.filter(p => (invMap.get(p.id) ?? 0) >= 1).length;
  const total = ALBUM_PLAYERS.length;

  const subFilters: { key: SubFilter; label: string }[] = [
    { key: 'all',       label: 'Todos' },
    { key: 'owned',     label: 'Tenho' },
    { key: 'missing',   label: 'Faltam' },
    { key: 'legendary', label: '🔥 Lend.' },
    { key: 'epic',      label: '💫 Épic.' },
    { key: 'rare',      label: '💎 Raras' },
    { key: 'common',    label: '◾ Comuns' },
  ];

  const isAll = country === 'all';
  const prog = isAll
    ? { owned: totalOwned, total }
    : (countryProgress[country] ?? { owned: 0, total: 0 });

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-x-hidden">
      <CopaBackground />

      <div className="relative z-10 container py-8">
        <Link to="/aluno/album">
          <Button variant="ghost" className="mb-6 text-white/80 hover:text-white hover:bg-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> Álbum
          </Button>
        </Link>

        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <h1 className="copa-hero-title font-black text-3xl text-white">🃏 Meu Inventário</h1>
            <p className="text-white/60">{totalOwned}/{total} figurinhas · {Math.round((totalOwned/total)*100)}% completo</p>
          </div>
          <div className="sm:ml-auto w-full sm:w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              className="w-full rounded-xl bg-white/10 border border-white/20 pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#FBBA16]/60"
              placeholder="Buscar jogador..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Global progress bar */}
        <div className="mb-4 h-3 rounded-full bg-black/30 overflow-hidden border border-white/10">
          <div className="copa-progress-bar" style={{ width: `${(totalOwned/total)*100}%` }} />
        </div>

        {/* Sub-filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          {subFilters.map(f => (
            <button
              type="button"
              key={f.key}
              onClick={() => setSubFilter(f.key)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-bold transition-all',
                subFilter === f.key ? 'copa-filter-active' : 'copa-filter-inactive',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Country tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Todos tab */}
          <button
            type="button"
            onClick={() => setCountry('all')}
            className={cn(
              'flex-shrink-0 flex flex-col items-center gap-0.5 rounded-2xl border px-3 py-2 min-w-[60px] transition-all',
              isAll
                ? 'border-[#FBBA16]/80 bg-[#FBBA16]/15 shadow-[0_0_12px_rgba(251,186,22,0.3)]'
                : 'border-white/10 bg-white/5 hover:bg-white/10',
            )}
          >
            <span className="text-lg leading-none">🌍</span>
            <span className={cn('text-[9px] font-black whitespace-nowrap leading-none mt-0.5', isAll ? 'text-[#FBBA16]' : 'text-white/70')}>
              Todos
            </span>
            <span className={cn('text-[8px] font-bold leading-none', totalOwned === total ? 'text-[#1E9B5F]' : totalOwned > 0 ? 'text-white/50' : 'text-white/25')}>
              {totalOwned}/{total}
            </span>
          </button>

          {countries.map(c => {
            const p = countryProgress[c] ?? { owned: 0, total: 0 };
            const complete = p.owned === p.total && p.total > 0;
            return (
              <button
                type="button"
                key={c}
                onClick={() => setCountry(c)}
                className={cn(
                  'flex-shrink-0 flex flex-col items-center gap-0.5 rounded-2xl border px-3 py-2 min-w-[60px] transition-all',
                  country === c
                    ? 'border-[#FBBA16]/80 bg-[#FBBA16]/15 shadow-[0_0_12px_rgba(251,186,22,0.3)]'
                    : 'border-white/10 bg-white/5 hover:bg-white/10',
                )}
              >
                <span className="text-lg leading-none">{FLAG[c] ?? '🏳️'}</span>
                <span className={cn('text-[9px] font-black whitespace-nowrap leading-none mt-0.5', country === c ? 'text-[#FBBA16]' : 'text-white/70')}>
                  {c === 'Coreia do Sul' ? 'Coreia' : c === 'Inglaterra' ? 'Ingla.' : c}
                </span>
                <span className={cn('text-[8px] font-bold leading-none', complete ? 'text-[#1E9B5F]' : p.owned > 0 ? 'text-white/50' : 'text-white/25')}>
                  {p.owned}/{p.total}{complete ? '✓' : ''}
                </span>
              </button>
            );
          })}
        </div>

        {/* Section header */}
        {isAll ? (
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🌍</span>
            <div>
              <h2 className="font-black text-xl text-white leading-none">Todas as figurinhas</h2>
              <p className="text-sm text-white/50 mt-0.5">{totalOwned}/{total} figurinhas de todos os países</p>
            </div>
            {totalOwned === total && (
              <span className="ml-auto rounded-full bg-[#1E9B5F]/20 border border-[#1E9B5F]/40 text-[#1E9B5F] text-xs font-black px-3 py-1">
                🏆 Álbum Completo!
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{FLAG[country] ?? '🏳️'}</span>
            <div>
              <h2 className="font-black text-xl text-white leading-none">{country}</h2>
              <p className="text-sm text-white/50 mt-0.5">{prog.owned}/{prog.total} figurinhas</p>
            </div>
            {prog.owned === prog.total && prog.total > 0 && (
              <span className="ml-auto rounded-full bg-[#1E9B5F]/20 border border-[#1E9B5F]/40 text-[#1E9B5F] text-xs font-black px-3 py-1">
                🏆 Completo!
              </span>
            )}
          </div>
        )}

        {/* Section progress bar */}
        <div className="mb-6 h-2 rounded-full bg-black/30 overflow-hidden border border-white/10">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${prog.total > 0 ? (prog.owned / prog.total) * 100 : 0}%`,
              background: prog.owned === prog.total && prog.total > 0
                ? 'linear-gradient(90deg,#1E9B5F,#38BDF8)'
                : 'linear-gradient(90deg,#FBBA16,#E57200)',
            }}
          />
        </div>

        {/* Player grid */}
        <div className="flex flex-wrap gap-3 justify-start">
          {filtered.map(player => {
            const qty = invMap.get(player.id) ?? 0;
            const isOwned = qty >= 1;
            return (
              <div
                key={player.id}
                className={cn('relative transition-all', !isOwned && 'opacity-30 grayscale')}
                onClick={() => isOwned ? setSelected(player) : undefined}
              >
                <CardFigurina
                  player={player}
                  quantity={qty}
                  size="md"
                  showQuantity={isOwned}
                  glow={isOwned && player.rarity === 'legendary'}
                  animate={isOwned}
                />
                {!isOwned && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
                    <Lock className="h-6 w-6 text-white/50" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/50">
            <p className="text-4xl mb-3">🔍</p>
            <p>Nenhuma figurinha encontrada.</p>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur" onClick={() => setSelected(null)}>
          <Card className="w-full max-w-sm border-white/20 bg-[#0E3A7A]/90 p-6 backdrop-blur-xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-center mb-4">
              <CardFigurina player={selected} size="lg" glow />
            </div>
            <div className="text-center space-y-2">
              <h2 className="font-black text-xl text-white">{selected.name}</h2>
              <p className="text-white/60">{selected.country} · {selected.position}</p>
              <div className={cn('inline-block rounded-full px-3 py-1 text-sm font-bold', RARITY_CONFIG[selected.rarity].badge, RARITY_CONFIG[selected.rarity].text)}>
                {RARITY_CONFIG[selected.rarity].label}
              </div>
              <p className={cn('text-3xl font-black', RARITY_CONFIG[selected.rarity].text)}>{selected.overall}</p>
              {selected.special && (
                <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90">
                  ✨ {selected.special}
                </div>
              )}
              <p className="text-xs text-white/50">
                Quantidade: {invMap.get(selected.id) ?? 0}x
                {(invMap.get(selected.id) ?? 0) > 1 && ' (tem repetida!)'}
              </p>
            </div>
            <Button onClick={() => setSelected(null)} className="w-full mt-4 copa-open-btn text-gray-900 font-black border-0">
              Fechar
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
