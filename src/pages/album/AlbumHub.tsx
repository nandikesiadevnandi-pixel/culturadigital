import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAlbum } from '@/hooks/useAlbum';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PackOpeningModal } from '@/components/album/PackOpeningModal';
import { AlbumFeed } from '@/components/album/AlbumFeed';
import { AlbumPlayer, ALBUM_PLAYERS } from '@/data/albumPlayers';
import { ArrowLeft, Package, BookOpen, ArrowLeftRight, Trophy, Zap, Coins, Layers } from 'lucide-react';
import { toast } from 'sonner';

export default function AlbumHub() {
  const { user, profile } = useAuth();
  const album = useAlbum();
  const [openedCards, setOpenedCards] = useState<AlbumPlayer[] | null>(null);

  const handleOpenPack = async () => {
    if (album.stats.packsAvail < 1) { toast.error('Sem pacotes! Complete desafios para ganhar mais.'); return; }
    const cards = await album.openPack();
    if (cards) setOpenedCards(cards);
  };

  const totalCards = ALBUM_PLAYERS.length;
  const collectionPct = Math.round((album.uniqueCards / totalCards) * 100);
  const legendaries = album.inventory.filter(e => {
    const p = ALBUM_PLAYERS.find(x => x.id === e.cardId);
    return p?.rarity === 'legendary';
  }).length;

  const tiles = [
    { to: '/aluno/album/inventario', icon: BookOpen, label: 'Inventário', desc: `${album.uniqueCards}/${totalCards} figurinhas`, color: 'from-violet-500 to-purple-700' },
    { to: '/aluno/album/trocas', icon: ArrowLeftRight, label: 'Trocas', desc: album.pendingIncoming > 0 ? `${album.pendingIncoming} proposta(s)!` : 'Trocar repetidas', color: 'from-cyan-400 to-blue-600', badge: album.pendingIncoming },
    { to: '/aluno/album/desafios', icon: Zap, label: 'Desafios', desc: 'Ganhe pacotes codando', color: 'from-yellow-400 to-orange-500' },
    { to: '/aluno/album/ranking', icon: Trophy, label: 'Ranking', desc: 'Melhor coleção da turma', color: 'from-pink-500 to-rose-600' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#060612] via-[#0d0d28] to-[#060612]">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute top-1/2 right-0 h-64 w-64 rounded-full bg-cyan-500/8 blur-3xl" />
      </div>

      <div className="relative container py-8">
        <Link to="/aluno">
          <Button variant="ghost" className="mb-6 text-violet-200 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-black text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 mb-2">
            ⚽ Álbum da Copa 2026
          </h1>
          <p className="text-violet-200/60">Colecione, troque e domine o campeonato digital</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Figurinhas', value: `${album.uniqueCards}/${totalCards}`, emoji: '🃏', color: 'text-violet-300' },
            { label: 'Coleção', value: `${collectionPct}%`, emoji: '📊', color: 'text-cyan-300' },
            { label: 'Moedas', value: album.stats.coins, emoji: '🪙', color: 'text-yellow-300' },
            { label: 'Lendárias', value: legendaries, emoji: '🔥', color: 'text-orange-300' },
          ].map(s => (
            <Card key={s.label} className="border-violet-500/20 bg-[#0f0f24]/80 p-4 text-center backdrop-blur-xl">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className={`font-black text-xl ${s.color}`}>{s.value}</div>
              <div className="text-xs text-violet-200/50">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Open pack CTA */}
        <Card className="mb-8 border-violet-500/30 bg-gradient-to-br from-[#0f0f24] to-[#1a1050] p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(139,92,246,0.2)]">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/40 to-cyan-400/40 blur-xl" />
                <div className="relative flex h-20 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                  <Package className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h2 className="font-black text-2xl text-white">Pacotes Disponíveis</h2>
                <p className="text-violet-200/70">{album.stats.packsAvail} pacote(s) · 5 figurinhas cada</p>
                <div className="flex gap-1 mt-2">
                  {Array.from({ length: Math.max(album.stats.packsAvail, 0) }).map((_, i) => (
                    <div key={i} className="h-3 w-8 rounded-sm bg-gradient-to-r from-violet-500 to-cyan-400" />
                  ))}
                  {album.stats.packsAvail === 0 && <span className="text-xs text-violet-200/50">Complete desafios para ganhar mais</span>}
                </div>
              </div>
            </div>
            <div className="sm:ml-auto flex flex-col gap-2">
              <Button
                onClick={handleOpenPack}
                disabled={album.stats.packsAvail < 1 || album.loading}
                className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 font-black text-white text-lg px-8 py-6 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:opacity-90 disabled:opacity-40"
              >
                <Package className="mr-2 h-5 w-5" /> Abrir Pacote!
              </Button>
              <p className="text-center text-xs text-violet-200/40">{album.stats.totalPacks} pacotes abertos no total</p>
            </div>
          </div>
        </Card>

        {/* Navigation tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {tiles.map(t => (
            <Link key={t.to} to={t.to} className="relative">
              {t.badge ? (
                <span className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-xs font-black shadow-lg">
                  {t.badge}
                </span>
              ) : null}
              <Card className="group h-full cursor-pointer border-violet-500/20 bg-[#0f0f24]/80 p-5 backdrop-blur-xl transition-all hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(103,232,249,0.2)]">
                <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${t.color} shadow-lg group-hover:scale-110 transition-transform`}>
                  <t.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-black text-white text-base">{t.label}</h3>
                <p className="text-xs text-violet-200/60">{t.desc}</p>
              </Card>
            </Link>
          ))}
        </div>

        {/* Realtime feed */}
        <Card className="border-violet-500/20 bg-[#0f0f24]/80 backdrop-blur-xl">
          <div className="p-5 border-b border-violet-500/20 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="font-black text-white">Feed da Escola — ao vivo</h2>
          </div>
          <div className="p-5 max-h-80 overflow-y-auto">
            <AlbumFeed feed={album.feed} currentUserId={user?.id} />
          </div>
        </Card>
      </div>

      {openedCards && (
        <PackOpeningModal cards={openedCards} onClose={() => setOpenedCards(null)} />
      )}
    </div>
  );
}
