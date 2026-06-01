import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAlbum } from '@/hooks/useAlbum';
import { PackOpeningModal } from '@/components/album/PackOpeningModal';
import { AlbumFeed } from '@/components/album/AlbumFeed';
import { CopaBackground } from '@/components/album/CopaBackground';
import { AlbumPlayer, ALBUM_PLAYERS } from '@/data/albumPlayers';
import { ArrowLeft, Package, BookOpen, ArrowLeftRight, Trophy, Zap, Sparkles, Swords } from 'lucide-react';
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

  const tiles = [
    { to: '/aluno/album/inventario', icon: BookOpen,       label: 'Inventário',  desc: `${album.uniqueCards}/${totalCards} figurinhas`, color: 'bg-[#6B21A8]' },
    { to: '/aluno/album/craques',    icon: Sparkles,       label: 'Craques da Turma', desc: 'Crie sua figurinha lendária ⭐', color: 'bg-gradient-to-br from-[#FBBA16] to-[#F59E0B] text-gray-900' },
    { to: '/aluno/album/selecao',   icon: Swords,         label: 'Minha Seleção',    desc: 'Monte seu time e desafie a turma ⚽', color: 'bg-gradient-to-br from-green-500 to-emerald-700' },
    { to: '/aluno/album/trocas',     icon: ArrowLeftRight, label: 'Trocas',       desc: album.pendingIncoming > 0 ? `${album.pendingIncoming} proposta(s)!` : 'Trocar repetidas', color: 'bg-[#00B4D8]', badge: album.pendingIncoming },
    { to: '/aluno/album/desafios',   icon: Zap,            label: 'Desafios',     desc: 'Ganhe pacotes codando', color: 'bg-[#D43B2A]' },
    { to: '/aluno/album/ranking',    icon: Trophy,         label: 'Ranking',      desc: 'Melhor coleção da turma', color: 'bg-[#1E9B5F]' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-x-hidden">
      <CopaBackground />

      <div className="relative z-10 container py-8">
        <Link to="/aluno">
          <button type="button" className="mb-6 flex items-center gap-2 text-white/80 hover:text-white text-sm font-bold transition-colors">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
        </Link>

        {/* ── Hero / Album Cover ── */}
        <div className="mb-8 text-center">
          <div className="inline-block mb-3">
            <div className="copa-hero-number font-black text-white select-none">
              20<span className="text-[#FBBA16]">⚽</span>6
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px flex-1 max-w-24 bg-white/40" />
            <span className="text-[10px] font-black tracking-[0.35em] text-white/80 uppercase">FIFA World Cup</span>
            <div className="h-px flex-1 max-w-24 bg-white/40" />
          </div>
          <h1 className="copa-hero-title font-black text-2xl md:text-3xl text-white mb-1">
            Álbum Panini Digital 2026
          </h1>
          <p className="text-white/70 text-sm">Colecione · Troque · Domine o campeonato</p>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Figurinhas', value: `${album.uniqueCards}/${totalCards}`, emoji: '🃏', accent: 'text-white' },
            { label: 'Coleção',    value: `${collectionPct}%`,                  emoji: '📊', accent: 'text-[#38BDF8]' },
            { label: 'Moedas',     value: album.stats.coins,                    emoji: '🪙', accent: 'text-[#FBBA16]' },
            { label: 'Pacotes',    value: album.stats.packsAvail,               emoji: '📦', accent: 'text-[#1E9B5F]' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl bg-white/15 border border-white/25 backdrop-blur-md p-4 text-center">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className={`font-black text-xl ${s.accent}`}>{s.value}</div>
              <div className="text-xs text-white/60">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Open Pack CTA ── */}
        <div className="mb-8 rounded-2xl border border-white/25 bg-white/10 backdrop-blur-md p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Pack visual */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="copa-pack-shadow flex h-20 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D43B2A] to-[#FBBA16]">
                  <Package className="h-8 w-8 text-white" />
                </div>
                {/* Pack stack shadow */}
                <div className="absolute -z-10 top-1 left-1 h-20 w-14 rounded-2xl bg-[#6B21A8] opacity-60" />
              </div>
              <div>
                <h2 className="font-black text-xl text-white">Pacotes Disponíveis</h2>
                <p className="text-white/70 text-sm">{album.stats.packsAvail} pacote(s) · 5 figurinhas cada</p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {Array.from({ length: Math.max(album.stats.packsAvail, 0) }).map((_, i) => (
                    <div key={i} className="copa-pack-bar h-3 w-8 rounded-sm" />
                  ))}
                  {album.stats.packsAvail === 0 && (
                    <span className="text-xs text-white/50">Complete desafios para ganhar mais</span>
                  )}
                </div>
              </div>
            </div>

            <div className="sm:ml-auto flex flex-col gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleOpenPack}
                disabled={album.stats.packsAvail < 1 || album.loading}
                className="copa-open-btn w-full sm:w-auto font-black text-gray-900 text-lg px-8 py-4 rounded-2xl"
              >
                <span className="flex items-center gap-2 justify-center">
                  <Package className="h-5 w-5" /> Abrir Pacote!
                </span>
              </button>
              <p className="text-center text-xs text-white/40">{album.stats.totalPacks} pacotes abertos</p>
            </div>
          </div>
        </div>

        {/* ── Navigation tiles ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {tiles.map(t => (
            <Link key={t.to} to={t.to} className="relative group block">
              {t.badge ? (
                <span className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#D43B2A] text-white text-[10px] font-black shadow-lg">
                  {t.badge}
                </span>
              ) : null}
              <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-5 transition-all hover:bg-white/20 hover:border-white/40 hover:scale-[1.03] cursor-pointer">
                <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${t.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <t.icon className="h-6 w-6" />
                </div>
                <h3 className="font-black text-white text-base">{t.label}</h3>
                <p className="text-xs text-white/60 mt-0.5">{t.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Realtime feed ── */}
        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md overflow-hidden">
          <div className="px-5 py-4 border-b border-white/15 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#1E9B5F] animate-pulse" />
            <h2 className="font-black text-white text-sm">Feed da Turma {profile?.class_name ?? ''} — ao vivo</h2>
          </div>
          <div className="p-5 max-h-72 overflow-y-auto">
            <AlbumFeed feed={album.feed} currentUserId={user?.id} />
          </div>
        </div>
      </div>

      {openedCards && (
        <PackOpeningModal cards={openedCards} onClose={() => setOpenedCards(null)} />
      )}
    </div>
  );
}
