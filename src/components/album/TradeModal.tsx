import { useState } from 'react';
import { AlbumPlayer, ALBUM_PLAYERS, getPlayerById } from '@/data/albumPlayers';
import { InventoryEntry } from '@/hooks/useAlbum';
import { CardFigurina } from './CardFigurina';
import { Button } from '@/components/ui/button';
import { X, Send, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const TUTORIAL_KEY = 'trade_tutorial_seen';

interface Props {
  myInventory: InventoryEntry[];
  onPropose: (offeredCards: string[], requestedCards: string[], message: string) => Promise<void>;
  onClose: () => void;
}

type Step = 'intro' | 'offer' | 'request' | 'confirm';

export function TradeModal({ myInventory, onPropose, onClose }: Props) {
  const seenBefore = localStorage.getItem(TUTORIAL_KEY) === '1';

  const [step, setStep]       = useState<Step>(seenBefore ? 'offer' : 'intro');
  const [offered, setOffered] = useState<string[]>([]);
  const [requested, setReq]   = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [search, setSearch]   = useState('');
  const [sending, setSending] = useState(false);

  const myCards      = myInventory.filter(e => e.quantity >= 1).map(e => getPlayerById(e.cardId)).filter(Boolean) as AlbumPlayer[];
  const myDuplicates = myInventory.filter(e => e.quantity > 1).map(e => getPlayerById(e.cardId)).filter(Boolean) as AlbumPlayer[];
  const myOwnedIds   = new Set(myInventory.filter(e => e.quantity >= 1).map(e => e.cardId));
  const wantable     = ALBUM_PLAYERS.filter(p => !myOwnedIds.has(p.id));

  const filtered = (step === 'offer' ? myCards : wantable)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.country.toLowerCase().includes(search.toLowerCase()));

  const toggle = (id: string) => {
    if (step === 'offer') setOffered(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    else setReq(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const startTrade = () => {
    localStorage.setItem(TUTORIAL_KEY, '1');
    setStep('offer');
  };

  const handleSend = async () => {
    if (!offered.length) return;
    setSending(true);
    await onPropose(offered, requested, message);
    setSending(false);
    onClose();
  };

  const stepIndex = step === 'offer' ? 0 : step === 'request' ? 1 : 2;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 p-0 sm:p-4 backdrop-blur">
      <div className="w-full max-w-2xl rounded-t-3xl sm:rounded-3xl border border-violet-500/30 bg-[#0d0d24] shadow-[0_0_60px_rgba(139,92,246,0.3)] flex flex-col max-h-[90vh]">

        {/* ── INTRO / TUTORIAL step ── */}
        {step === 'intro' && (
          <>
            <div className="flex items-center justify-between p-5 border-b border-violet-500/20">
              <div>
                <h2 className="font-black text-xl text-white">🔄 Como funciona a troca?</h2>
                <p className="text-violet-200/60 text-sm">Leia com calma antes de começar!</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-violet-200 hover:text-white rounded-xl">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">

              {/* Step-by-step explanation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Step 1 */}
                <div className="rounded-2xl border-2 border-[#1E9B5F]/50 bg-[#1E9B5F]/10 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-[#1E9B5F] flex items-center justify-center font-black text-white text-lg flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-black text-white text-base leading-none">Você OFERECE</p>
                      <p className="text-[#1E9B5F] text-xs font-bold">📦 O que você vai DAR</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Escolha a figurinha que você quer <strong className="text-white">dar para o colega</strong>.
                  </p>
                  <p className="text-xs text-white/50 mt-2 bg-black/20 rounded-xl px-3 py-2">
                    💡 Dica: use as suas <strong className="text-white">repetidas</strong> — figurinhas que você tem mais de uma cópia!
                  </p>
                </div>

                {/* Step 2 */}
                <div className="rounded-2xl border-2 border-[#FBBA16]/50 bg-[#FBBA16]/10 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-[#FBBA16] flex items-center justify-center font-black text-gray-900 text-lg flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-black text-white text-base leading-none">Você PEDE</p>
                      <p className="text-[#FBBA16] text-xs font-bold">🎯 O que você quer RECEBER</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Escolha a figurinha que você <strong className="text-white">quer receber</strong> em troca do colega.
                  </p>
                  <p className="text-xs text-white/50 mt-2 bg-black/20 rounded-xl px-3 py-2">
                    💡 Pode deixar em branco se quiser receber <strong className="text-white">qualquer coisa</strong> — qualquer colega pode aceitar!
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="font-bold text-white text-sm">Depois você revisa tudo e publica</p>
                    <p className="text-xs text-white/50">Qualquer colega da turma poderá aceitar sua troca em tempo real</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={startTrade}
                className="w-full bg-gradient-to-r from-violet-500 to-cyan-400 text-white font-black text-base py-6 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.4)]"
              >
                Entendi! Vamos começar 🚀
              </Button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-xs text-violet-300/40 hover:text-violet-200 text-center py-1"
              >
                Cancelar
              </button>
            </div>
          </>
        )}

        {/* ── OFFER / REQUEST / CONFIRM steps ── */}
        {step !== 'intro' && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-violet-500/20">
              <div>
                <h2 className="font-black text-xl text-white">🔄 Propor Troca</h2>
                <p className="text-violet-200/60 text-sm">
                  {step === 'offer'   && 'Passo 1 — Qual figurinha você vai DAR ao colega?'}
                  {step === 'request' && 'Passo 2 — Qual figurinha você quer RECEBER?'}
                  {step === 'confirm' && 'Passo 3 — Confirme e publique a troca'}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-violet-200 hover:text-white rounded-xl">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Steps bar */}
            <div className="flex gap-2 px-5 py-3">
              {[0, 1, 2].map(i => (
                <div key={i} className={cn('flex-1 h-1.5 rounded-full transition-all',
                  i < stepIndex ? 'bg-violet-500/50' : i === stepIndex ? 'bg-gradient-to-r from-violet-500 to-cyan-400' : 'bg-violet-500/20'
                )} />
              ))}
            </div>

            {/* Instruction banner (always visible, changes per step) */}
            {(step === 'offer' || step === 'request') && (
              <div className={cn(
                'mx-5 mb-2 rounded-xl border px-4 py-2.5 flex items-start gap-3',
                step === 'offer'
                  ? 'border-[#1E9B5F]/40 bg-[#1E9B5F]/10'
                  : 'border-[#FBBA16]/40 bg-[#FBBA16]/10',
              )}>
                <span className="text-xl flex-shrink-0 mt-0.5">{step === 'offer' ? '📦' : '🎯'}</span>
                <div>
                  <p className={cn('text-sm font-black leading-none mb-1', step === 'offer' ? 'text-[#1E9B5F]' : 'text-[#FBBA16]')}>
                    {step === 'offer' ? 'Selecione o que você vai DAR' : 'Selecione o que você quer RECEBER'}
                  </p>
                  <p className="text-xs text-white/60">
                    {step === 'offer'
                      ? 'Clique nas figurinhas que você vai oferecer ao colega. Use as repetidas!'
                      : 'Clique nas figurinhas que você quer pegar. Pode pular (deixar vazio) se aceitar qualquer coisa.'}
                  </p>
                </div>
              </div>
            )}

            {step !== 'confirm' ? (
              <>
                {/* Quick select duplicates */}
                {step === 'offer' && myDuplicates.length > 0 && (
                  <div className="px-5 pb-2">
                    <Button variant="ghost" size="sm"
                      onClick={() => setOffered(myDuplicates.slice(0, 3).map(p => p.id))}
                      className="text-cyan-300 hover:text-white text-xs">
                      ♻️ Usar minhas repetidas ({myDuplicates.length} disponíveis)
                    </Button>
                  </div>
                )}

                {/* Search */}
                <div className="px-5 pb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-400" />
                    <input
                      className="w-full rounded-xl bg-[#1a1a3a] border border-violet-500/30 pl-9 pr-3 py-2 text-sm text-white placeholder:text-violet-200/40 focus:outline-none focus:border-cyan-400/60"
                      placeholder={step === 'offer' ? 'Buscar nas minhas figurinhas...' : 'Buscar figurinha que você quer...'}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Card grid */}
                <div className="flex-1 overflow-y-auto px-5 pb-3">
                  <div className="flex flex-wrap gap-2">
                    {filtered.slice(0, 40).map((player) => {
                      const sel = step === 'offer' ? offered.includes(player.id) : requested.includes(player.id);
                      return (
                        <div key={player.id} className="relative">
                          <CardFigurina player={player} size="sm" selected={sel} onClick={() => toggle(player.id)} animate />
                        </div>
                      );
                    })}
                    {filtered.length === 0 && (
                      <p className="text-violet-200/50 text-sm py-8 w-full text-center">Nenhuma figurinha encontrada</p>
                    )}
                  </div>
                </div>

                {/* Bottom bar */}
                <div className="px-5 py-3 border-t border-violet-500/20 bg-[#0f0f24]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-violet-200/70">
                      {step === 'offer'
                        ? offered.length > 0 ? `✅ ${offered.length} figurinha(s) para oferecer` : '⬆️ Selecione ao menos 1'
                        : requested.length > 0 ? `✅ ${requested.length} figurinha(s) para pedir` : 'Nenhuma = aceita qualquer coisa'}
                    </span>
                    <div className="flex gap-2">
                      {step === 'offer' && (
                        <Button variant="ghost" onClick={() => setStep('intro')} className="text-violet-200/60 text-xs px-3">
                          ? Ajuda
                        </Button>
                      )}
                      {step === 'request' && (
                        <Button variant="ghost" onClick={() => setStep('offer')} className="text-violet-200/60 text-xs px-3">
                          ← Voltar
                        </Button>
                      )}
                      <Button
                        onClick={() => { setSearch(''); setStep(step === 'offer' ? 'request' : 'confirm'); }}
                        disabled={step === 'offer' && offered.length === 0}
                        className="bg-gradient-to-r from-violet-500 to-cyan-400 font-bold"
                      >
                        {step === 'offer' ? 'Próximo →' : 'Revisar →'}
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Confirm step */
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-[#1E9B5F]/30 bg-[#1E9B5F]/8 p-3">
                    <p className="text-[10px] font-black text-[#1E9B5F] uppercase tracking-wider mb-2 flex items-center gap-1">
                      📦 Você oferece ({offered.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {offered.map(id => { const p = getPlayerById(id); return p ? <CardFigurina key={id} player={p} size="sm" /> : null; })}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#FBBA16]/30 bg-[#FBBA16]/8 p-3">
                    <p className="text-[10px] font-black text-[#FBBA16] uppercase tracking-wider mb-2 flex items-center gap-1">
                      🎯 Você quer ({requested.length || 'qualquer'})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {requested.length === 0
                        ? <p className="text-violet-200/40 text-xs italic">Aceita qualquer figurinha</p>
                        : requested.map(id => { const p = getPlayerById(id); return p ? <CardFigurina key={id} player={p} size="sm" /> : null; })}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-violet-200/60 uppercase mb-2">Mensagem para o colega (opcional)</p>
                  <textarea
                    className="w-full rounded-xl bg-[#1a1a3a] border border-violet-500/30 px-3 py-2 text-sm text-white placeholder:text-violet-200/40 focus:outline-none focus:border-cyan-400/60 resize-none"
                    placeholder='Ex: "Tenho Messi ×2, quero Mbappé!"'
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep('request')} className="flex-1 text-violet-200">← Voltar</Button>
                  <Button onClick={handleSend} disabled={sending || offered.length === 0}
                    className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-400 font-black">
                    <Send className="mr-2 h-4 w-4" /> {sending ? 'Publicando...' : 'Publicar Troca'}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
