import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ALBUM_PLAYERS } from '@/data/albumPlayers';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, Crown, Medal } from 'lucide-react';
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
      const school = profile?.school ?? '';

      // Load all inventories for students at the same school
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, class_name')
        .eq('school', school);

      if (!profiles?.length) { setLoading(false); return; }

      const userIds = profiles.map((p: { user_id: string }) => p.user_id);

      const [invRes, statsRes] = await Promise.all([
        supabase.from('album_inventory').select('user_id,card_id,quantity').in('user_id', userIds),
        supabase.from('album_user_stats').select('user_id,legendaries,coins').in('user_id', userIds),
      ]);

      const invData = (invRes.data ?? []) as Array<{ user_id: string; card_id: string; quantity: number }>;
      const statsData = (statsRes.data ?? []) as Array<{ user_id: string; legendaries: number; coins: number }>;

      const statsMap = new Map(statsData.map(s => [s.user_id, s]));

      const entries: RankEntry[] = profiles.map((p: { user_id: string; full_name: string; class_name: string }) => {
        const userInv = invData.filter(e => e.user_id === p.user_id && e.quantity >= 1);
        const stats = statsMap.get(p.user_id);
        return {
          userId: p.user_id,
          name: p.full_name,
          className: p.class_name ?? '',
          uniqueCards: userInv.length,
          legendaries: stats?.legendaries ?? 0,
          coins: stats?.coins ?? 0,
        };
      });

      entries.sort((a, b) => b.uniqueCards - a.uniqueCards || b.legendaries - a.legendaries);
      setRanking(entries);
      setLoading(false);
    };
    load();
  }, [profile]);

  const myRank = ranking.findIndex(e => e.userId === user?.id) + 1;
  const total = ALBUM_PLAYERS.length;

  const medalIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-300" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="font-black text-violet-200/60 text-sm">{rank}º</span>;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#060612] via-[#0d0d28] to-[#060612]">
      <div className="container py-8 max-w-2xl">
        <Link to="/aluno/album">
          <Button variant="ghost" className="mb-6 text-violet-200 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Álbum
          </Button>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="font-black text-3xl text-white mb-1">🏆 Ranking da Escola</h1>
          <p className="text-violet-200/60">Quem tem a coleção mais completa?</p>
          {myRank > 0 && (
            <p className="mt-2 font-bold text-cyan-300">Você está em {myRank}º lugar!</p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-violet-200/50">Carregando ranking...</div>
        ) : ranking.length === 0 ? (
          <div className="text-center py-20 text-violet-200/40">
            <p className="text-4xl mb-3">🏟️</p>
            <p>Nenhum aluno abriu pacotes ainda. Seja o primeiro!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Top 3 podium */}
            {ranking.length >= 3 && (
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[1, 0, 2].map((rankIdx) => {
                  const entry = ranking[rankIdx];
                  if (!entry) return null;
                  const actualRank = rankIdx + 1;
                  const isFirst = actualRank === 1;
                  return (
                    <div
                      key={entry.userId}
                      className={cn(
                        'flex flex-col items-center rounded-2xl border p-4 text-center',
                        isFirst
                          ? 'border-yellow-400/50 bg-yellow-500/10 shadow-[0_0_30px_rgba(245,158,11,0.2)] col-start-2'
                          : 'border-violet-500/20 bg-[#0f0f24]/80',
                        actualRank === 2 && 'col-start-1 row-start-1',
                        actualRank === 3 && 'col-start-3 row-start-1',
                      )}
                    >
                      <div className="mb-2">{medalIcon(actualRank)}</div>
                      <div className={cn(
                        'h-12 w-12 rounded-full flex items-center justify-center text-xl font-black mb-2',
                        isFirst ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-violet-500 to-cyan-400',
                      )}>
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-bold text-white text-xs truncate w-full">{entry.name.split(' ')[0]}</p>
                      <p className="text-xs text-violet-200/50 truncate w-full">{entry.className}</p>
                      <p className={cn('font-black text-lg mt-1', isFirst ? 'text-yellow-300' : 'text-violet-300')}>
                        {entry.uniqueCards}
                      </p>
                      <p className="text-[10px] text-violet-200/40">figurinhas</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full list */}
            {ranking.map((entry, i) => {
              const rank = i + 1;
              const isMe = entry.userId === user?.id;
              return (
                <Card
                  key={entry.userId}
                  className={cn(
                    'flex items-center gap-4 border p-4 backdrop-blur-xl',
                    isMe ? 'border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'border-violet-500/20 bg-[#0f0f24]/80',
                  )}
                >
                  <div className="w-8 flex justify-center flex-shrink-0">{medalIcon(rank)}</div>
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center font-black text-white">
                    {entry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('font-bold text-sm truncate', isMe ? 'text-cyan-300' : 'text-white')}>
                      {entry.name} {isMe && '(você)'}
                    </p>
                    <p className="text-xs text-violet-200/50">Turma {entry.className}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-white">{entry.uniqueCards}/{total}</p>
                    <p className="text-xs text-violet-200/50">figurinhas</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="font-bold text-yellow-300">{entry.legendaries}🔥</p>
                    <p className="text-xs text-violet-200/50">lendárias</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="font-bold text-yellow-300">🪙{entry.coins}</p>
                    <p className="text-xs text-violet-200/50">moedas</p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
