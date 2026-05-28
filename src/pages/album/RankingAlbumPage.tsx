import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase as supabaseTyped } from '@/integrations/supabase/client';
const supabase = supabaseTyped as any;
import { ALBUM_PLAYERS } from '@/data/albumPlayers';
import { CopaBackground } from '@/components/album/CopaBackground';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, Medal, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RankEntry {
  userId: string;
  name: string;
  className: string;
  uniqueCards: number;
  legendaries: number;
  coins: number;
}

export default function RankingAlbumPage() {
  const { user, profile } = useAuth();
  const [ranking, setRanking] = useState<RankEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const school = (profile as any)?.school ?? '';
      // Teachers have school = "Todas as escolas" — they see everyone
      const filterBySchool = school && school !== 'Todas as escolas';

      const profilesQuery = filterBySchool
        ? supabase.from('profiles').select('user_id, full_name, class_name').eq('school', school)
        : supabase.from('profiles').select('user_id, full_name, class_name');

      const { data: profiles } = await profilesQuery;

      if (!profiles?.length) { setLoading(false); return; }

      const userIds = profiles.map((p: { user_id: string }) => p.user_id);

      const [invRes, statsRes] = await Promise.all([
        supabase.from('album_inventory').select('user_id,card_id,quantity').in('user_id', userIds),
        supabase.from('album_user_stats').select('user_id,legendaries,coins').in('user_id', userIds),
      ]);

      const invData   = (invRes.data   ?? []) as Array<{ user_id: string; card_id: string; quantity: number }>;
      const statsData = (statsRes.data ?? []) as Array<{ user_id: string; legendaries: number; coins: number }>;
      const statsMap  = new Map(statsData.map(s => [s.user_id, s]));

      const entries: RankEntry[] = profiles
        .map((p: { user_id: string; full_name: string; class_name: string }) => {
          const userInv = invData.filter(e => e.user_id === p.user_id && e.quantity >= 1);
          const stats   = statsMap.get(p.user_id);
          return {
            userId: p.user_id,
            name: p.full_name ?? 'Anônimo',
            className: p.class_name ?? '',
            uniqueCards: userInv.length,
            legendaries: stats?.legendaries ?? 0,
            coins: stats?.coins ?? 0,
          };
        })
        // Only show users who have interacted with the album (have any stats row)
        .filter((e: RankEntry) => statsMap.has(e.userId) || e.uniqueCards > 0);

      entries.sort((a: RankEntry, b: RankEntry) => b.uniqueCards - a.uniqueCards || b.legendaries - a.legendaries);
      setRanking(entries);
      setLoading(false);
    };
    load();
  }, [profile]);

  const myRank  = ranking.findIndex(e => e.userId === user?.id) + 1;
  const total   = ALBUM_PLAYERS.length;
  const champs  = ranking.filter(e => e.uniqueCards >= total);

  const medalIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-[#FBBA16]" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-300" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="font-black text-white/60 text-sm">{rank}º</span>;
  };

  const podiumBg: Record<number, string> = {
    1: 'border-[#FBBA16]/50 bg-[#FBBA16]/15',
    2: 'border-white/25 bg-white/10',
    3: 'border-white/25 bg-white/10',
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-x-hidden">
      <CopaBackground />

      <div className="relative z-10 container py-8 max-w-2xl">
        <Link to="/aluno/album">
          <Button variant="ghost" className="mb-6 text-white/80 hover:text-white hover:bg-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> Álbum
          </Button>
        </Link>

        {/* Album completion champions banner */}
        {champs.length > 0 && (
          <div className="mb-6 rounded-2xl border-2 border-[#FBBA16] bg-gradient-to-r from-[#FBBA16]/20 via-[#E57200]/15 to-[#FBBA16]/20 p-5 text-center animate-pulse-slow">
            <div className="flex justify-center mb-2">
              <Trophy className="h-10 w-10 text-[#FBBA16]" />
            </div>
            <h2 className="font-black text-2xl text-[#FBBA16] mb-1">🏆 Campeão do Álbum!</h2>
            <p className="text-white/80 font-bold mb-3">
              {champs.length === 1
                ? `${champs[0].name} completou o álbum inteiro!`
                : `${champs.map(c => c.name.split(' ')[0]).join(', ')} completaram o álbum!`}
            </p>
            <div className="flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-2xl">⭐</span>
              ))}
            </div>
            <p className="text-[#FBBA16]/70 text-xs mt-2 font-bold uppercase tracking-wider">
              {total}/{total} figurinhas · Melhor da partida!
            </p>
          </div>
        )}

        <div className="mb-8 text-center">
          <h1 className="copa-hero-title font-black text-3xl text-white mb-1">🏆 Ranking da Turma</h1>
          <p className="text-white/60">Quem tem a coleção mais completa?</p>
          {myRank > 0 && (
            <p className="mt-2 font-black text-[#FBBA16]">
              Você está em {myRank}º lugar!
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/50">Carregando ranking...</div>
        ) : ranking.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            <p className="text-4xl mb-3">🏟️</p>
            <p>Nenhum aluno abriu pacotes ainda. Seja o primeiro!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Top 3 podium */}
            {ranking.length >= 3 && (
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[1, 0, 2].map((rankIdx) => {
                  const entry      = ranking[rankIdx];
                  if (!entry) return null;
                  const actualRank = rankIdx + 1;
                  const isFirst    = actualRank === 1;
                  const isChamp    = entry.uniqueCards >= total;
                  return (
                    <div
                      key={entry.userId}
                      className={cn(
                        'copa-panel flex flex-col items-center p-4 text-center',
                        podiumBg[actualRank],
                        isFirst  && 'col-start-2',
                        actualRank === 2 && 'col-start-1 row-start-1',
                        actualRank === 3 && 'col-start-3 row-start-1',
                        isChamp  && 'border-[#FBBA16] shadow-[0_0_20px_rgba(251,186,22,0.4)]',
                      )}
                    >
                      <div className="mb-2">{medalIcon(actualRank)}</div>
                      <div className={cn(
                        'h-12 w-12 rounded-full flex items-center justify-center text-xl font-black mb-2',
                        isFirst ? 'bg-gradient-to-br from-[#FBBA16] to-[#E57200]' : 'bg-white/20',
                      )}>
                        <span className="text-white">{entry.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <p className="font-bold text-white text-xs truncate w-full">{entry.name.split(' ')[0]}</p>
                      <p className="text-xs text-white/50 truncate w-full">{entry.className}</p>
                      <p className={cn('font-black text-lg mt-1', isFirst ? 'text-[#FBBA16]' : 'text-white')}>
                        {entry.uniqueCards}
                      </p>
                      <p className="text-[10px] text-white/40">/{total}</p>
                      {isChamp && <span className="text-xs mt-1">🏆</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full list */}
            {ranking.map((entry, i) => {
              const rank   = i + 1;
              const isMe   = entry.userId === user?.id;
              const isChamp = entry.uniqueCards >= total;
              const pct    = Math.round((entry.uniqueCards / total) * 100);
              return (
                <div
                  key={entry.userId}
                  className={cn(
                    'copa-panel flex items-center gap-4 p-4',
                    isMe    && 'border-[#FBBA16]/40 bg-[#FBBA16]/10',
                    isChamp && 'border-[#FBBA16]/70',
                  )}
                >
                  <div className="w-8 flex justify-center flex-shrink-0">{medalIcon(rank)}</div>
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[#D43B2A] to-[#FBBA16] flex items-center justify-center font-black text-white">
                    {entry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('font-bold text-sm truncate', isMe ? 'text-[#FBBA16]' : 'text-white')}>
                      {entry.name} {isMe && '(você)'} {isChamp && '🏆'}
                    </p>
                    <p className="text-xs text-white/50">Turma {entry.className}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-white">{entry.uniqueCards}/{total}</p>
                    <p className="text-xs text-white/50">{pct}%</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="font-bold text-[#FBBA16]">{entry.legendaries}🔥</p>
                    <p className="text-xs text-white/50">lendárias</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="font-bold text-[#FBBA16]">🪙{entry.coins}</p>
                    <p className="text-xs text-white/50">moedas</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
