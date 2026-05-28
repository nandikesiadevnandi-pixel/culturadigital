import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAlbum } from '@/hooks/useAlbum';
import { useAuth } from '@/hooks/useAuth';
import {
  ALBUM_CHALLENGES, AlbumChallenge,
  CHALLENGE_TYPE_CONFIG, DIFFICULTY_CONFIG, GRADE_CONFIG, GradeGroup,
} from '@/data/albumChallenges';
import { CopaBackground } from '@/components/album/CopaBackground';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, XCircle, Info, Package } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase as supabaseTyped } from '@/integrations/supabase/client';
const supabase = supabaseTyped as any;

// ── Packs rewarded per attempt ──
const PACKS_FIRST   = 3;
const PACKS_SECOND  = 1;
const COOLDOWN_MS   = 5 * 60 * 1000; // 5 minutes

const cdlKey = (userId: string, challengeId: string) => `cdl_${userId}_${challengeId}`;

function saveCooldown(userId: string, challengeId: string, wrongIdx: number, until: number) {
  localStorage.setItem(cdlKey(userId, challengeId), JSON.stringify({ wrongIdx, until }));
}

function loadCooldown(userId: string, challengeId: string): { wrongIdx: number; until: number } | null {
  try {
    const raw = localStorage.getItem(cdlKey(userId, challengeId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearCooldown(userId: string, challengeId: string) {
  localStorage.removeItem(cdlKey(userId, challengeId));
}

type GameState = 'playing' | 'wrong-first' | 'won' | 'lost';

export default function DesafiosAlbumPage() {
  const { user, profile } = useAuth();
  const album             = useAlbum();
  const navigate          = useNavigate();

  const [done,        setDone]        = useState<Set<string>>(new Set());
  const [active,      setActive]      = useState<AlbumChallenge | null>(null);
  const [typeFilter,  setTypeFilter]  = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<GradeGroup | 'all'>('all');
  const [showInfo,    setShowInfo]    = useState(false);

  // Per-question state
  const [gameState,     setGameState]     = useState<GameState>('playing');
  const [wrongChoice,   setWrongChoice]   = useState<number | null>(null);   // first wrong pick
  const [finalChoice,   setFinalChoice]   = useState<number | null>(null);   // second pick (right or wrong)
  const [packsEarned,   setPacksEarned]   = useState(0);

  // Cooldown state
  const [remaining, setRemaining] = useState(0); // seconds
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-select grade based on student profile
  useEffect(() => {
    const gy = (profile as any)?.grade_year as number | undefined;
    if (gy) setGradeFilter(gy <= 5 ? '4-5' : '6-8');
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('album_challenge_done')
      .select('challenge_id')
      .eq('user_id', user.id)
      .then(({ data }: { data: Array<{ challenge_id: string }> | null }) => {
        if (data) setDone(new Set(data.map(r => r.challenge_id)));
      });
  }, [user]);

  const startCooldown = (until: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const tick = () => {
      const secs = Math.max(0, Math.ceil((until - Date.now()) / 1000));
      setRemaining(secs);
      if (secs === 0 && timerRef.current) clearInterval(timerRef.current);
    };
    tick();
    timerRef.current = setInterval(tick, 500);
  };

  // Clean up timer on unmount
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const resetQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('playing');
    setWrongChoice(null);
    setFinalChoice(null);
    setPacksEarned(0);
    setRemaining(0);
  };

  const openChallenge = (ch: AlbumChallenge) => {
    resetQuiz();
    // Restore cooldown if still active
    if (user) {
      const saved = loadCooldown(user.id, ch.id);
      if (saved) {
        const secs = Math.ceil((saved.until - Date.now()) / 1000);
        setWrongChoice(saved.wrongIdx);
        setGameState('wrong-first');
        if (secs > 0) startCooldown(saved.until);
      }
    }
    setActive(ch);
  };

  const closeChallenge = () => {
    resetQuiz();
    setActive(null);
  };

  const handleAnswer = async (idx: number) => {
    if (!active || !user) return;
    if (gameState === 'won' || gameState === 'lost') return;
    if (gameState === 'wrong-first' && remaining > 0) return; // cooldown active
    if (gameState === 'wrong-first' && idx === wrongChoice) return; // can't re-pick same wrong

    const isCorrect   = idx === active.correct;
    const isFirstTry  = gameState === 'playing';

    if (isCorrect) {
      const packs    = isFirstTry ? PACKS_FIRST : PACKS_SECOND;
      const coins    = isFirstTry ? active.coinsReward : Math.ceil(active.coinsReward / 2);
      const xp       = isFirstTry ? active.xpReward    : Math.ceil(active.xpReward    / 2);

      clearCooldown(user.id, active.id);
      const saved = await album.completeChallenge(active.id);
      if (saved) {
        setDone(prev => new Set([...prev, active.id]));
        await album.addReward(packs, coins, xp);
        await album.postFeedEvent('challenge_won', { challengeTitle: active.title, packs });
        setPacksEarned(packs);
      }
      setFinalChoice(idx);
      setGameState('won');
    } else {
      if (isFirstTry) {
        // First wrong — start cooldown, show hint
        const until = Date.now() + COOLDOWN_MS;
        saveCooldown(user.id, active.id, idx, until);
        setWrongChoice(idx);
        setGameState('wrong-first');
        startCooldown(until);
      } else {
        // Second wrong — game over, reveal answer
        clearCooldown(user.id, active.id);
        setFinalChoice(idx);
        setGameState('lost');
      }
    }
  };

  const typeOptions = [
    { key: 'all', label: 'Todos' },
    ...Object.entries(CHALLENGE_TYPE_CONFIG).map(([k, v]) => ({ key: k, label: `${v.emoji} ${v.label}` })),
  ];
  const gradeOptions: { key: GradeGroup | 'all'; label: string }[] = [
    { key: 'all', label: '📚 Todas as séries' },
    { key: '4-5', label: '🟢 4ª-5ª série' },
    { key: '6-8', label: '🔵 6ª-8ª série' },
  ];

  const filteredChallenges = useMemo(() => ALBUM_CHALLENGES.filter(c => {
    if (typeFilter  !== 'all' && c.type       !== typeFilter)  return false;
    if (gradeFilter !== 'all' && c.gradeGroup !== gradeFilter) return false;
    return true;
  }), [typeFilter, gradeFilter]);

  const earnedFromChallenges = [...done].reduce((sum, id) => {
    const ch = ALBUM_CHALLENGES.find(c => c.id === id);
    return sum + (ch ? (PACKS_FIRST) : 0); // simplified estimate
  }, 0);

  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // ── Attempt indicator ──
  const attemptDots = (
    <div className="flex gap-1.5 items-center">
      <div className={cn('h-3 w-3 rounded-full', gameState !== 'playing' && gameState !== 'wrong-first' ? 'bg-white/30' : 'bg-[#FBBA16]')} />
      <div className={cn('h-3 w-3 rounded-full', gameState === 'lost' ? 'bg-[#D43B2A]' : gameState === 'won' ? 'bg-[#1E9B5F]' : gameState === 'wrong-first' ? 'bg-[#FBBA16]' : 'bg-white/20')} />
      <p className="text-xs text-white/50 ml-1">
        {gameState === 'playing'     && 'Tentativa 1 de 2'}
        {gameState === 'wrong-first' && remaining > 0 && `Próxima tentativa em ${fmtTime(remaining)}`}
        {gameState === 'wrong-first' && remaining === 0 && 'Tentativa 2 de 2 — última chance!'}
        {gameState === 'won'         && 'Correto! 🎉'}
        {gameState === 'lost'        && 'Esgotado 😅'}
      </p>
    </div>
  );

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
          <h1 className="copa-hero-title font-black text-3xl text-white">⚡ Desafios</h1>
          <p className="text-white/60">Acerte de 1ª → 3 pacotes · Acerte de 2ª → 1 pacote</p>
        </div>

        {/* Info banner */}
        <div className={cn('mb-6 rounded-2xl border overflow-hidden transition-all', showInfo ? 'border-[#38BDF8]/40 bg-[#38BDF8]/10' : 'border-white/10 bg-white/5')}>
          <button type="button" onClick={() => setShowInfo(v => !v)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
            <Info className="h-4 w-4 text-[#38BDF8] flex-shrink-0" />
            <p className="text-sm font-bold text-white/80">📦 Como funcionam os pacotes?</p>
            <span className="ml-auto text-xs text-white/40">{showInfo ? '▲' : '▼'}</span>
          </button>
          {showInfo && (
            <div className="px-4 pb-4 space-y-1.5 text-sm text-white/70">
              <p>• Você tem <strong className="text-white">2 tentativas</strong> por desafio.</p>
              <p>• Acertar na <strong className="text-[#FBBA16]">1ª tentativa</strong>: ganhe <strong className="text-white">3 📦 pacotes</strong>.</p>
              <p>• Acertar na <strong className="text-white">2ª tentativa</strong>: ganhe <strong className="text-white">1 📦 pacote</strong>.</p>
              <p>• Se errar as duas: nenhum pacote. A resposta será revelada para aprender.</p>
              <p>• Ao entrar na plataforma você já recebe <strong className="text-white">3 pacotes de boas-vindas</strong>.</p>
              <p className="text-[#1E9B5F] font-bold">Desafios completos: {done.size} · Pacotes estimados ganhos: {earnedFromChallenges}</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Completos', value: `${done.size}/${ALBUM_CHALLENGES.length}`, color: 'text-white' },
            { label: 'Pacotes',   value: album.stats.packsAvail,                   color: 'text-[#1E9B5F]' },
            { label: 'Moedas',    value: album.stats.coins,                        color: 'text-[#FBBA16]' },
          ].map(s => (
            <div key={s.label} className="copa-panel p-3 text-center">
              <div className={`font-black text-2xl ${s.color}`}>{s.value}</div>
              <div className="text-xs text-white/60">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Grade filter */}
        <div className="flex gap-2 mb-3">
          {gradeOptions.map(g => (
            <button
              type="button"
              key={g.key}
              onClick={() => setGradeFilter(g.key)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-bold transition-all',
                gradeFilter === g.key ? 'copa-filter-active' : 'copa-filter-inactive',
              )}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {typeOptions.map(f => (
            <button
              type="button"
              key={f.key}
              onClick={() => setTypeFilter(f.key)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-bold transition-all',
                typeFilter === f.key ? 'copa-filter-active' : 'copa-filter-inactive',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Challenge grid ── */}
        {!active ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChallenges.map(ch => {
              const isDone    = done.has(ch.id);
              const typeCfg   = CHALLENGE_TYPE_CONFIG[ch.type];
              const diffCfg   = DIFFICULTY_CONFIG[ch.difficulty];
              const gradeCfg  = GRADE_CONFIG[ch.gradeGroup];
              return (
                <div
                  key={ch.id}
                  onClick={() => !isDone && openChallenge(ch)}
                  className={cn(
                    'copa-panel group relative p-5 transition-all',
                    !isDone && 'cursor-pointer hover:bg-white/20 hover:border-white/40',
                    isDone && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  {isDone && <div className="absolute top-3 right-3"><CheckCircle2 className="h-5 w-5 text-[#1E9B5F]" /></div>}

                  <div className="flex items-start justify-between mb-3">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${typeCfg.color} text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                      {ch.emoji}
                    </div>
                    <span className={cn('rounded-full border text-[9px] font-black px-2 py-0.5 uppercase tracking-wide', gradeCfg.bg, gradeCfg.color)}>
                      {gradeCfg.label}
                    </span>
                  </div>

                  <h3 className="font-black text-white text-sm mb-1">{ch.title}</h3>
                  <p className="text-xs text-white/60 mb-3">{ch.description}</p>

                  <div className="flex items-center justify-between">
                    <span className={cn('text-xs font-bold', diffCfg.color)}>{diffCfg.label}</span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-white/80">📦×3</span>
                      <span className="text-[#FBBA16]">🪙{ch.coinsReward}</span>
                      <span className="text-[#38BDF8]">⚡{ch.xpReward}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredChallenges.length === 0 && (
              <div className="col-span-3 text-center py-16 text-white/40">
                <p className="text-4xl mb-3">🔍</p>
                <p>Nenhum desafio encontrado com esses filtros.</p>
              </div>
            )}
          </div>
        ) : (

          /* ── Active challenge ── */
          <div className="max-w-2xl mx-auto">

            {/* ── WON screen ── */}
            {gameState === 'won' && (
              <div className="copa-panel p-8 text-center">
                <div className="text-6xl mb-4 animate-bounce">
                  {packsEarned === PACKS_FIRST ? '🎉' : '✅'}
                </div>
                <h2 className="font-black text-3xl text-white mb-2">
                  {packsEarned === PACKS_FIRST ? 'Incrível! Acertou de primeira!' : 'Mandou bem! Acertou na segunda.'}
                </h2>
                <p className="text-white/60 mb-8">
                  {packsEarned === PACKS_FIRST
                    ? 'Resposta certa logo de cara — você é fera!'
                    : 'Persistiu e acertou. Isso que conta!'}
                </p>

                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className="rounded-2xl border-2 border-[#1E9B5F]/60 bg-[#1E9B5F]/15 px-8 py-5">
                    <div className="text-5xl font-black text-[#1E9B5F] leading-none">{packsEarned}</div>
                    <div className="text-sm text-white/60 mt-1 flex items-center justify-center gap-1">
                      <Package className="h-4 w-4" /> pacotes ganhos!
                    </div>
                  </div>
                </div>

                <p className="text-white/50 text-sm mb-6">
                  +{packsEarned === PACKS_FIRST ? active.coinsReward : Math.ceil(active.coinsReward / 2)} moedas
                  · +{packsEarned === PACKS_FIRST ? active.xpReward : Math.ceil(active.xpReward / 2)} XP
                  adicionados ao seu perfil
                </p>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => navigate('/aluno/album')}
                    className="w-full bg-gradient-to-r from-[#1E9B5F] to-[#38BDF8] text-white font-black text-lg py-6 rounded-2xl shadow-[0_0_30px_rgba(30,155,95,0.5)]"
                  >
                    📦 Ir abrir meus pacotes!
                  </Button>
                  <button
                    type="button"
                    onClick={closeChallenge}
                    className="text-sm text-white/50 hover:text-white/80 py-2"
                  >
                    Continuar nos desafios →
                  </button>
                </div>
              </div>
            )}

            {/* ── LOST screen ── */}
            {gameState === 'lost' && (
              <div className="copa-panel p-8">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">😅</div>
                  <h2 className="font-black text-2xl text-white mb-1">Quase lá!</h2>
                  <p className="text-white/60">Você errou as duas tentativas. Mas aprender com o erro também é evoluir!</p>
                </div>

                <div className="rounded-2xl border border-[#1E9B5F]/40 bg-[#1E9B5F]/10 p-4 mb-4">
                  <p className="text-xs font-black text-[#1E9B5F] uppercase tracking-wider mb-2">✅ A resposta certa era:</p>
                  <p className="font-bold text-white">{active.options[active.correct]}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-6">
                  <p className="text-xs font-black text-white/50 uppercase tracking-wider mb-2">💡 Explicação</p>
                  <p className="text-sm text-white/80 leading-relaxed">{active.explanation}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeChallenge}
                    className="flex-1 rounded-xl border border-white/20 bg-white/10 text-white font-bold py-2.5 hover:bg-white/20 transition-colors"
                  >
                    ← Voltar aos desafios
                  </button>
                </div>
              </div>
            )}

            {/* ── PLAYING / WRONG-FIRST screens ── */}
            {(gameState === 'playing' || gameState === 'wrong-first') && (
              <div className="copa-panel p-8">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`flex-shrink-0 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${CHALLENGE_TYPE_CONFIG[active.type].color} text-3xl shadow-lg`}>
                    {active.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h2 className="font-black text-xl text-white">{active.title}</h2>
                      <span className={cn('rounded-full border text-[9px] font-black px-2 py-0.5 uppercase', GRADE_CONFIG[active.gradeGroup].bg, GRADE_CONFIG[active.gradeGroup].color)}>
                        {GRADE_CONFIG[active.gradeGroup].label}
                      </span>
                    </div>
                    <p className={cn('text-sm font-bold', DIFFICULTY_CONFIG[active.difficulty].color)}>
                      {DIFFICULTY_CONFIG[active.difficulty].label}
                    </p>
                  </div>
                </div>

                {/* Attempt indicator */}
                <div className="mb-5">{attemptDots}</div>

                {/* "Wrong first" banner — cooldown or hint */}
                {gameState === 'wrong-first' && remaining > 0 && (
                  <div className="mb-4 rounded-xl border border-[#D43B2A]/40 bg-[#D43B2A]/10 px-4 py-5 text-center">
                    <p className="font-black text-[#D43B2A] text-sm mb-3">⏳ Resposta errada! Aguarde para tentar de novo.</p>
                    <div className="font-mono text-4xl font-black text-white mb-2">{fmtTime(remaining)}</div>
                    <p className="text-xs text-white/40">Sua segunda chance estará disponível em breve.</p>
                    <div className="mt-3 rounded-lg bg-[#FBBA16]/10 border border-[#FBBA16]/20 px-3 py-2">
                      <p className="text-sm text-white/70">💡 Dica: {active.hint}</p>
                    </div>
                  </div>
                )}
                {gameState === 'wrong-first' && remaining === 0 && (
                  <div className="mb-4 rounded-xl border border-[#FBBA16]/40 bg-[#FBBA16]/10 px-4 py-3">
                    <p className="font-black text-[#FBBA16] text-sm mb-1">⚠️ Opa! Não foi dessa vez.</p>
                    <p className="text-sm text-white/70">💡 Dica: {active.hint}</p>
                    <p className="text-xs text-white/40 mt-1">Você ainda tem 1 chance. Pense bem antes de responder!</p>
                  </div>
                )}

                {/* Question */}
                <p className="text-white text-lg font-bold mb-6 leading-relaxed">{active.question}</p>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {active.options.map((opt, idx) => {
                    const isFirstWrong = idx === wrongChoice;
                    const onCooldown   = gameState === 'wrong-first' && remaining > 0;
                    const isDisabled   = isFirstWrong || onCooldown;

                    return (
                      <button
                        type="button"
                        key={idx}
                        disabled={isDisabled}
                        onClick={() => handleAnswer(idx)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all',
                          !isDisabled && 'border-white/20 bg-white/10 text-white hover:border-[#FBBA16]/60 hover:bg-white/15 cursor-pointer',
                          isFirstWrong && 'border-[#D43B2A]/60 bg-[#D43B2A]/15 text-white/50 cursor-not-allowed opacity-60',
                          onCooldown && !isFirstWrong && 'border-white/10 bg-white/5 text-white/30 cursor-not-allowed',
                        )}
                      >
                        <span className="font-mono text-[#FBBA16] flex-shrink-0">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isFirstWrong && <XCircle className="h-4 w-4 text-[#D43B2A] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Reward preview */}
                <div className="flex items-center justify-between text-xs text-white/40 border-t border-white/10 pt-4">
                  <span>Acertando de 1ª: <strong className="text-[#1E9B5F]">3 📦 pacotes</strong></span>
                  <span>Acertando de 2ª: <strong className="text-white/60">1 📦 pacote</strong></span>
                </div>

                <button
                  type="button"
                  onClick={closeChallenge}
                  className="mt-4 text-xs text-white/30 hover:text-white/60 w-full text-center"
                >
                  ← Voltar aos desafios
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
