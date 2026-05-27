import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlbum } from '@/hooks/useAlbum';
import { ALBUM_CHALLENGES, AlbumChallenge, CHALLENGE_TYPE_CONFIG, DIFFICULTY_CONFIG } from '@/data/albumChallenges';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, XCircle, Package, Coins, Zap, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function DesafiosAlbumPage() {
  const { user } = useAuth();
  const album = useAlbum();
  const [done, setDone] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<AlbumChallenge | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!user) return;
    supabase.from('album_challenge_done').select('challenge_id').eq('user_id', user.id)
      .then(({ data }) => {
        if (data) setDone(new Set(data.map((r: { challenge_id: string }) => r.challenge_id)));
      });
  }, [user]);

  const handleAnswer = async (idx: number) => {
    if (answered || !active) return;
    setSelected(idx);
    setAnswered(true);

    if (idx === active.correct) {
      const saved = await album.completeChallenge(active.id);
      if (saved) {
        setDone(prev => new Set([...prev, active.id]));
        await album.addReward(active.packsReward, active.coinsReward, active.xpReward);
        await album.postFeedEvent('challenge_won', {
          challengeTitle: active.title,
          packs: active.packsReward,
        });
        toast.success(`+${active.packsReward} pacote(s) · +${active.coinsReward} moedas · +${active.xpReward} XP!`);
      } else {
        toast.info('Você já completou esse desafio.');
      }
    } else {
      toast.error('Resposta errada! ' + active.explanation);
    }
  };

  const filteredChallenges = ALBUM_CHALLENGES.filter(c => filter === 'all' || c.type === filter);
  const completedCount = done.size;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#060612] via-[#0d0d28] to-[#060612]">
      <div className="container py-8">
        <Link to="/aluno/album">
          <Button variant="ghost" className="mb-6 text-violet-200 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Álbum
          </Button>
        </Link>

        <div className="mb-6">
          <h1 className="font-black text-3xl text-white">⚡ Desafios de Programação</h1>
          <p className="text-violet-200/60">Acerte e ganhe pacotes, moedas e XP</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="border-violet-500/20 bg-[#0f0f24]/80 p-3 text-center">
            <div className="font-black text-2xl text-white">{completedCount}/{ALBUM_CHALLENGES.length}</div>
            <div className="text-xs text-violet-200/60">Completos</div>
          </Card>
          <Card className="border-violet-500/20 bg-[#0f0f24]/80 p-3 text-center">
            <div className="font-black text-2xl text-cyan-300">{album.stats.packsAvail}</div>
            <div className="text-xs text-violet-200/60">Pacotes</div>
          </Card>
          <Card className="border-violet-500/20 bg-[#0f0f24]/80 p-3 text-center">
            <div className="font-black text-2xl text-yellow-300">{album.stats.coins}</div>
            <div className="text-xs text-violet-200/60">Moedas</div>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: 'Todos' },
            ...Object.entries(CHALLENGE_TYPE_CONFIG).map(([k, v]) => ({ key: k, label: `${v.emoji} ${v.label}` })),
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-bold transition-all border',
                filter === f.key
                  ? 'bg-violet-500 border-violet-400 text-white'
                  : 'border-violet-500/30 bg-violet-500/10 text-violet-200/70',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Challenge grid */}
        {!active ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChallenges.map(ch => {
              const isDone = done.has(ch.id);
              const typeCfg = CHALLENGE_TYPE_CONFIG[ch.type];
              const diffCfg = DIFFICULTY_CONFIG[ch.difficulty];

              return (
                <Card
                  key={ch.id}
                  onClick={() => !isDone && setActive(ch)}
                  className={cn(
                    'group relative border-violet-500/20 bg-[#0f0f24]/80 p-5 backdrop-blur-xl transition-all',
                    !isDone && 'cursor-pointer hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(103,232,249,0.2)]',
                    isDone && 'opacity-60',
                  )}
                >
                  {isDone && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    </div>
                  )}

                  <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${typeCfg.color} text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                    {ch.emoji}
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-white text-sm">{ch.title}</h3>
                  </div>
                  <p className="text-xs text-violet-200/60 mb-3">{ch.description}</p>

                  <div className="flex items-center justify-between">
                    <span className={cn('text-xs font-bold', diffCfg.color)}>{diffCfg.label}</span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-violet-300">📦×{ch.packsReward}</span>
                      <span className="text-yellow-300">🪙{ch.coinsReward}</span>
                      <span className="text-cyan-300">⚡{ch.xpReward} XP</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Active challenge */
          <div className="max-w-2xl mx-auto">
            <Card className="border-violet-500/30 bg-[#0f0f24]/80 p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${CHALLENGE_TYPE_CONFIG[active.type].color} text-3xl shadow-lg`}>
                  {active.emoji}
                </div>
                <div>
                  <h2 className="font-black text-xl text-white">{active.title}</h2>
                  <p className={cn('text-sm font-bold', DIFFICULTY_CONFIG[active.difficulty].color)}>
                    {DIFFICULTY_CONFIG[active.difficulty].label}
                  </p>
                </div>
              </div>

              <p className="text-white text-lg font-bold mb-6 leading-relaxed">{active.question}</p>

              <div className="space-y-3 mb-6">
                {active.options.map((opt, idx) => {
                  const isSelected = selected === idx;
                  const isCorrect = idx === active.correct;
                  return (
                    <button
                      key={idx}
                      disabled={answered}
                      onClick={() => handleAnswer(idx)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all',
                        !answered && 'border-violet-500/30 bg-[#1a1a3a] text-white hover:border-cyan-400',
                        answered && isCorrect && 'border-emerald-400 bg-emerald-500/20 text-white',
                        answered && isSelected && !isCorrect && 'border-red-500 bg-red-500/20 text-white',
                        answered && !isSelected && !isCorrect && 'border-violet-500/20 bg-[#1a1a3a] text-violet-200/50',
                      )}
                    >
                      <span className="font-mono text-violet-400 mr-3">{String.fromCharCode(65 + idx)}.</span>
                      <span className="flex-1">{opt}</span>
                      {answered && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-400 ml-2 flex-shrink-0" />}
                      {answered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-400 ml-2 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className={cn(
                  'rounded-2xl border p-4 mb-6',
                  selected === active.correct
                    ? 'border-emerald-400/40 bg-emerald-500/10'
                    : 'border-red-400/40 bg-red-500/10',
                )}>
                  <p className="font-bold text-sm mb-1 text-white">
                    {selected === active.correct ? '🎉 Correto!' : '❌ Errado!'} {selected === active.correct ? `+${active.packsReward} pacote(s) · +${active.coinsReward} moedas · +${active.xpReward} XP` : ''}
                  </p>
                  <p className="text-sm text-violet-200/80">{active.explanation}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => { setActive(null); setSelected(null); setAnswered(false); }}
                  className="flex-1 text-violet-200"
                >
                  ← Voltar
                </Button>
                {answered && (
                  <Button
                    onClick={() => { setActive(null); setSelected(null); setAnswered(false); }}
                    className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-400"
                  >
                    Próximo desafio →
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
