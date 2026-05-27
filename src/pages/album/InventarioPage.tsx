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

  const filters: { key: Filter; label: string }[] = [
    { key: 'all',        label: `Todas (${total})` },
    { key: 'owned',      label: `Tenho (${owned})` },
    { key: 'missing',    label: `Faltam (${total - owned})` },
    { key: 'duplicates', label: `Repetidas (${album.duplicates.length})` },
    { key: 'legendary',  label: '🔥 Lendárias' },
    { key: 'epic',       label: '💫 Épicas' },
    { key: 'rare',       label: '💎 Raras' },
    { key: 'common',     label: '◾ Comuns' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-x-hidden">
      <CopaBackground />

      <div className="relative z-10 container py-8">
        <Link to="/aluno/album">
          <Button variant="ghost" className="mb-6 text-white/80 hover:text-white hover:bg-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> Álbum
          </Button>
        </Link>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <h1 className="copa-hero-title font-black text-3xl text-white">🃏 Meu Inventário</h1>
            <p className="text-white/60">{owned}/{total} figurinhas · {Math.round((owned/total)*100)}% completo</p>
          </div>
          <div className="sm:ml-auto w-full sm:w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              className="w-full rounded-xl bg-white/10 border border-white/20 pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#FBBA16]/60"
              placeholder="Buscar jogador ou país..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-3 rounded-full bg-black/30 overflow-hidden border border-white/10">
          <div
            className="copa-progress-bar"
            style={{ width: `${(owned/total)*100}%` }}
          />
        </div>

        {/* Filter chips */}
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map(f => (
            <button
              type="button"
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-bold transition-all',
                filter === f.key ? 'copa-filter-active' : 'copa-filter-inactive',
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
          <div className="text-center py-20 text-white/50">
            <p className="text-4xl mb-3">🔍</p>
            <p>Nenhuma figurinha encontrada.</p>
          </div>
        )}
      </div>

      {/* Player detail modal */}
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
