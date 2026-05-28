import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlbum } from '@/hooks/useAlbum';
import { ALBUM_CHALLENGES, AlbumChallenge, CHALLENGE_TYPE_CONFIG, DIFFICULTY_CONFIG } from '@/data/albumChallenges';
import { CopaBackground } from '@/components/album/CopaBackground';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, XCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase as supabaseTyped } from '@/integrations/supabase/client';
const supabase = supabaseTyped as any;
import { useAuth } from '@/hooks/useAuth';

export default function DesafiosAlbumPage() {
  const { user } = useAuth();
  const album = useAlbum();
  const [done, setDone] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<AlbumChallenge | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('album_challenge_done').select('challenge_id').eq('user_id', user.id)
      .then(({ data }: { data: Array<{ challenge_id: string }> | null }) => {
        if (data) setDone(new Set(data.map(r => r.challenge_id)));
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
        await album.postFeedEvent('challenge_won', { challengeTitle: active.title, packs: active.packsReward });
        toast.success(`+${active.packsReward} pacote(s) · +${active.coinsReward} moedas · +${active.xpReward} XP!`);
      } else {
        toast.info('Você já completou esse desafio.');
      }
    } else {
      toast.error('Resposta errada! ' + active.explanation);
    }
  };

  const filteredChallenges = ALBUM_CHALLENGES.filter(c => filter === 'all' || c.type === filter);

  const filterOptions = [
    { key: 'all', label: 'Todos' },
    ...Object.entries(CHALLENGE_TYPE_CONFIG).map(([k, v]) => ({ key: k, label: `${v.emoji} ${v.label}` })),
  ];

  // Packs earned from challenges (vs. starter packs)
  const earnedFromChallenges = done.size > 0
    ? [...done].reduce((sum, id) => {
        const ch = ALBUM_CHALLENGES.find(c => c.id === id);
        return sum + (ch?.packsReward ?? 0);
      }, 0)
    : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-x-hidden">
      <CopaBackground />

      <div className="relative z-10 container py-8">
        <Link to="/aluno/album">
          <Button variant="ghost" className="mb-6 text-white/80 hover:text-white hover:bg-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> Álbum
          </Button>
        </Link>

        <div className="mb-6">
          <h1 className="copa-hero-title font-black text-3xl text-white">⚡ Desafios de Programação</h1>
          <p className="text-white/60">Acerte e ganhe pacotes, moedas e XP</p>
        </div>

        {/* Starter packs info banner */}
        <div
          className={cn(
            'mb-6 rounded-2xl border transition-all overflow-hidden',
            showInfo
              ? 'border-[#38BDF8]/40 bg-[#38BDF8]/10'
              : 'border-white/10 bg-white/5',
          )}
        >
          <button
            type="button"
            onClick={() => setShowInfo(v => !v)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left"
          >
            <Info className="h-4 w-4 text-[#38BDF8] flex-shrink-0" />
            <p className="text-sm font-bold text-white/80">
              📦 Seus pacotes incluem 3 de boas-vindas + ganhos em desafios
            </p>
            <span className="ml-auto text-xs text-white/40">{showInfo ? '▲' : '▼'}</span>
          </button>
          {showInfo && (
            <div className="px-4 pb-4 space-y-1.5 text-sm text-white/70">
              <p>• Ao entrar na plataforma você recebe <strong className="text-white">3 pacotes de boas-vindas</strong> automaticamente.</p>
              <p>• Cada desafio concluído adiciona mais pacotes à sua conta.</p>
              <p>• Os pacotes ficam disponíveis para abrir no <strong className="text-white">Hub do Álbum</strong>.</p>
              <p className="text-[#1E9B5F] font-bold">Desafios completos: {done.size} · Pacotes ganhos neles: {earnedFromChallenges}</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Completos', value: `${done.size}/${ALBUM_CHALLENGES.length}`, color: 'text-white', sub: `${Math.round(done.size / ALBUM_CHALLENGES.length * 100)}%` },
            { label: 'Pacotes',   value: album.stats.packsAvail,                   color: 'text-[#1E9B5F]', sub: '3 iniciais + desafios' },
            { label: 'Moedas',    value: album.stats.coins,                        color: 'text-[#FBBA16]', sub: null },
          ].map(s => (
            <div key={s.label} className="copa-panel p-3 text-center">
              <div className={`font-black text-2xl ${s.color}`}>{s.value}</div>
              <div className="text-xs text-white/60">{s.label}</div>
              {s.sub && <div className="text-[9px] text-white/35 mt-0.5 leading-tight">{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterOptions.map(f => (
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

        {!active ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChallenges.map(ch => {
              const isDone = done.has(ch.id);
              const typeCfg = CHALLENGE_TYPE_CONFIG[ch.type];
              const diffCfg = DIFFICULTY_CONFIG[ch.difficulty];

              return (
                <div
                  key={ch.id}
                  onClick={() => !isDone && setActive(ch)}
                  className={cn(
                    'copa-panel group relative p-5 transition-all',
                    !isDone && 'cursor-pointer hover:bg-white/20 hover:border-white/40',
                    isDone && 'opacity-60',
                  )}
                >
                  {isDone && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="h-5 w-5 text-[#1E9B5F]" />
                    </div>
                  )}

                  <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${typeCfg.color} text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                    {ch.emoji}
                  </div>

                  <h3 className="font-black text-white text-sm mb-1">{ch.title}</h3>
                  <p className="text-xs text-white/60 mb-3">{ch.description}</p>

                  <div className="flex items-center justify-between">
                    <span className={cn('text-xs font-bold', diffCfg.color)}>{diffCfg.label}</span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-white/80">📦×{ch.packsReward}</span>
                      <span className="text-[#FBBA16]">🪙{ch.coinsReward}</span>
                      <span className="text-[#38BDF8]">⚡{ch.xpReward}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="copa-panel p-8">
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
                  const isCorrect  = idx === active.correct;
                  return (
                    <button
                      type="button"
                      key={idx}
                      disabled={answered}
                      onClick={() => handleAnswer(idx)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all',
                        !answered && 'border-white/20 bg-white/10 text-white hover:border-[#FBBA16]/60 hover:bg-white/15',
                        answered && isCorrect  && 'border-[#1E9B5F] bg-[#1E9B5F]/20 text-white',
                        answered && isSelected && !isCorrect && 'border-[#D43B2A] bg-[#D43B2A]/20 text-white',
                        answered && !isSelected && !isCorrect && 'border-white/10 bg-white/5 text-white/40',
                      )}
                    >
                      <span className="font-mono text-[#FBBA16] mr-3">{String.fromCharCode(65 + idx)}.</span>
                      <span className="flex-1">{opt}</span>
                      {answered && isCorrect   && <CheckCircle2 className="h-5 w-5 text-[#1E9B5F] ml-2 flex-shrink-0" />}
                      {answered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-[#D43B2A] ml-2 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className={cn(
                  'rounded-2xl border p-4 mb-6',
                  selected === active.correct
                    ? 'border-[#1E9B5F]/40 bg-[#1E9B5F]/10'
                    : 'border-[#D43B2A]/40 bg-[#D43B2A]/10',
                )}>
                  <p className="font-bold text-sm mb-1 text-white">
                    {selected === active.correct
                      ? `🎉 Correto! +${active.packsReward} pacote(s) · +${active.coinsReward} moedas · +${active.xpReward} XP`
                      : '❌ Errado!'}
                  </p>
                  <p className="text-sm text-white/80">{active.explanation}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setActive(null); setSelected(null); setAnswered(false); }}
                  className="flex-1 rounded-xl border border-white/20 bg-white/10 text-white font-bold py-2.5 hover:bg-white/20 transition-colors"
                >
                  ← Voltar
                </button>
                {answered && (
                  <button
                    type="button"
                    onClick={() => { setActive(null); setSelected(null); setAnswered(false); }}
                    className="copa-open-btn flex-1 rounded-xl text-gray-900 font-black py-2.5"
                  >
                    Próximo →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
