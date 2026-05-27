import { useEffect, useState } from 'react';
import { AlbumPlayer, RARITY_CONFIG } from '@/data/albumPlayers';
import { CardFigurina } from './CardFigurina';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronRight, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  cards: AlbumPlayer[];
  onClose: () => void;
}

export function PackOpeningModal({ cards, onClose }: Props) {
  const [phase, setPhase] = useState<'shake' | 'reveal' | 'done'>('shake');
  const [revealed, setRevealed] = useState<boolean[]>(cards.map(() => false));
  const [currentIdx, setCurrentIdx] = useState(-1);

  useEffect(() => {
    const t = setTimeout(() => setPhase('reveal'), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== 'reveal') return;
    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= cards.length) { clearInterval(interval); setPhase('done'); return; }
      setCurrentIdx(idx);
      setRevealed(prev => { const n = [...prev]; n[idx] = true; return n; });
      idx++;
    }, 600);
    return () => clearInterval(interval);
  }, [phase, cards.length]);

  const hasLegendary = cards.some(c => c.rarity === 'legendary');
  const hasEpic = cards.some(c => c.rarity === 'epic');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl">
      {/* Background glow */}
      <div className={cn(
        'absolute inset-0 pointer-events-none',
        hasLegendary ? 'bg-gradient-radial from-yellow-500/10 via-transparent to-transparent' :
        hasEpic ? 'bg-gradient-radial from-violet-500/10 via-transparent to-transparent' : '',
      )} />

      {/* Shake phase */}
      {phase === 'shake' && (
        <div className="flex flex-col items-center gap-6 animate-bounce">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/40 to-cyan-400/40 blur-2xl" />
            <div className="relative flex h-40 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-[0_0_60px_rgba(139,92,246,0.6)]">
              <Package className="h-16 w-16 text-white" />
            </div>
          </div>
          <p className="text-2xl font-black text-white animate-pulse">Abrindo pacote...</p>
          <div className="flex gap-1">
            {[0,1,2].map(i => (
              <div key={i} className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* Reveal phase */}
      {(phase === 'reveal' || phase === 'done') && (
        <div className="flex w-full max-w-2xl flex-col items-center gap-6">
          <div className="text-center">
            <h2 className="font-black text-2xl text-white">
              {hasLegendary ? '🔥 LENDÁRIO!' : hasEpic ? '💫 Épico!' : '📦 Pacote aberto!'}
            </h2>
            <p className="text-violet-200/70">
              {phase === 'done' ? `${cards.length} figurinhas adicionadas ao inventário` : 'Revelando...'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {cards.map((card, i) => (
              <div
                key={i}
                className={cn(
                  'transition-all duration-500',
                  revealed[i] ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-8',
                  i === currentIdx && phase === 'reveal' && 'animate-pulse',
                )}
              >
                <CardFigurina
                  player={card}
                  size="md"
                  glow={revealed[i]}
                  animate={false}
                />
                {revealed[i] && (
                  <div className={cn('mt-1 text-center text-xs font-bold', RARITY_CONFIG[card.rarity].text)}>
                    {RARITY_CONFIG[card.rarity].label}
                  </div>
                )}
              </div>
            ))}
          </div>

          {phase === 'done' && (
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
              {hasLegendary && (
                <div className="flex items-center gap-2 rounded-2xl bg-yellow-500/20 border border-yellow-400/40 px-4 py-2">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  <span className="font-black text-yellow-300">VOCÊ TIROU UM LENDÁRIO!</span>
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                </div>
              )}
              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-violet-500 to-cyan-400 font-black text-white hover:opacity-90"
              >
                Continuar <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
