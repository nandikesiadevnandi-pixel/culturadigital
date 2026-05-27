import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlbum } from '@/hooks/useAlbum';
import { ALBUM_PLAYERS, AlbumPlayer, RARITY_CONFIG, Rarity } from '@/data/albumPlayers';
import { CardFigurina } from '@/components/album/CardFigurina';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Filter, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'owned' | 'missing' | 'duplicates' | Rarity;

export default function InventarioPage() {
  const album = useAlbum();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<AlbumPlayer | null>(null);

  const invMap = useMemo(() => {
    const m = new Map<string, number>();
    album.inventory.forEach(e => m.set(e.cardId, e.quantity));
    return m;
  }, [album.inventory]);

  const filtered = useMemo(() => {
    return ALBUM_PLAYERS.filter(p => {
      const qty = invMap.get(p.id) ?? 0;
      const matchSearch = search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.country.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;
      switch (filter) {
        case 'owned':      return qty >= 1;
        case 'missing':    return qty === 0;
        case 'duplicates': return qty > 1;
        case 'common': case 'rare': case 'epic': case 'legendary':
          return p.rarity === filter;
        default: return true;
      }
    });
  }, [invMap, search, filter]);

  const owned = ALBUM_PLAYERS.filter(p => (invMap.get(p.id) ?? 0) >= 1).length;
  const total = ALBUM_PLAYERS.length;

  const filters: { key: Filter; label: string; color?: string }[] = [
    { key: 'all',        label: `Todas (${total})` },
    { key: 'owned',      label: `Tenho (${owned})`,  color: 'text-emerald-300' },
    { key: 'missing',    label: `Faltam (${total - owned})`, color: 'text-red-400' },
    { key: 'duplicates', label: `Repetidas (${album.duplicates.length})`, color: 'text-cyan-300' },
    { key: 'legendary',  label: '🔥 Lendárias', color: RARITY_CONFIG.legendary.text },
    { key: 'epic',       label: '💫 Épicas',    color: RARITY_CONFIG.epic.text },
    { key: 'rare',       label: '💎 Raras',     color: RARITY_CONFIG.rare.text },
    { key: 'common',     label: '◾ Comuns',    color: RARITY_CONFIG.common.text },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#060612] via-[#0d0d28] to-[#060612]">
      <div className="container py-8">
        <Link to="/aluno/album">
          <Button variant="ghost" className="mb-6 text-violet-200 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Álbum
          </Button>
        </Link>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <h1 className="font-black text-3xl text-white">🃏 Meu Inventário</h1>
            <p className="text-violet-200/60">{owned}/{total} figurinhas · {Math.round((owned/total)*100)}% completo</p>
          </div>
          <div className="sm:ml-auto w-full sm:w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-400" />
            <input
              className="w-full rounded-xl bg-[#1a1a3a] border border-violet-500/30 pl-9 pr-3 py-2 text-sm text-white placeholder:text-violet-200/40 focus:outline-none focus:border-cyan-400/60"
              placeholder="Buscar jogador ou país..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-3 rounded-full bg-violet-950 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all shadow-[0_0_10px_rgba(103,232,249,0.5)]"
            style={{ width: `${(owned/total)*100}%` }}
          />
        </div>

        {/* Filter chips */}
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-bold transition-all border',
                filter === f.key
                  ? 'bg-violet-500 border-violet-400 text-white'
                  : 'border-violet-500/30 bg-violet-500/10 text-violet-200/70 hover:border-violet-400/50',
                f.color && filter !== f.key && f.color,
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Card grid */}
        <div className="flex flex-wrap gap-3 justify-start">
          {filtered.map(player => {
            const qty = invMap.get(player.id) ?? 0;
            const owned = qty >= 1;
            return (
              <div
                key={player.id}
                className={cn('relative transition-all', !owned && 'opacity-30 grayscale')}
                onClick={() => owned ? setSelected(player) : undefined}
              >
                <CardFigurina
                  player={player}
                  quantity={qty}
                  size="md"
                  showQuantity={owned}
                  glow={owned && player.rarity === 'legendary'}
                  animate={owned}
                />
                {!owned && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
                    <Lock className="h-6 w-6 text-white/50" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-violet-200/40">
            <p className="text-4xl mb-3">🔍</p>
            <p>Nenhuma figurinha encontrada.</p>
          </div>
        )}
      </div>

      {/* Player detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur" onClick={() => setSelected(null)}>
          <Card className="w-full max-w-sm border-violet-500/30 bg-[#0d0d24] p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-center mb-4">
              <CardFigurina player={selected} size="lg" glow />
            </div>
            <div className="text-center space-y-2">
              <h2 className="font-black text-xl text-white">{selected.name}</h2>
              <p className="text-violet-200/60">{selected.country} · {selected.position}</p>
              <div className={cn('inline-block rounded-full px-3 py-1 text-sm font-bold', RARITY_CONFIG[selected.rarity].badge, RARITY_CONFIG[selected.rarity].text)}>
                {RARITY_CONFIG[selected.rarity].label}
              </div>
              <p className={cn('text-3xl font-black', RARITY_CONFIG[selected.rarity].text)}>{selected.overall}</p>
              {selected.special && (
                <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
                  ✨ {selected.special}
                </div>
              )}
              <p className="text-xs text-violet-200/50">
                Quantidade: {invMap.get(selected.id) ?? 0}x
                {(invMap.get(selected.id) ?? 0) > 1 && ' (tem repetida!)'}
              </p>
            </div>
            <Button onClick={() => setSelected(null)} className="w-full mt-4 bg-gradient-to-r from-violet-500 to-cyan-400">
              Fechar
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
