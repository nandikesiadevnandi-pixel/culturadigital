import { useState } from 'react';
import { AlbumPlayer, ALBUM_PLAYERS, RARITY_CONFIG, getPlayerById } from '@/data/albumPlayers';
import { InventoryEntry } from '@/hooks/useAlbum';
import { CardFigurina } from './CardFigurina';
import { Button } from '@/components/ui/button';
import { X, ArrowLeftRight, Send, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  myInventory: InventoryEntry[];
  onPropose: (offeredCards: string[], requestedCards: string[], message: string) => Promise<void>;
  onClose: () => void;
}

export function TradeModal({ myInventory, onPropose, onClose }: Props) {
  const [step, setStep] = useState<'offer' | 'request' | 'confirm'>('offer');
  const [offered, setOffered] = useState<string[]>([]);
  const [requested, setRequested] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [sending, setSending] = useState(false);

  const myCards = myInventory.filter(e => e.quantity >= 1).map(e => getPlayerById(e.cardId)).filter(Boolean) as AlbumPlayer[];
  const myDuplicates = myInventory.filter(e => e.quantity > 1).map(e => getPlayerById(e.cardId)).filter(Boolean) as AlbumPlayer[];
  const myOwnedIds = new Set(myInventory.filter(e => e.quantity >= 1).map(e => e.cardId));
  const wantableCards = ALBUM_PLAYERS.filter(p => !myOwnedIds.has(p.id));

  const filteredCards = (step === 'offer' ? myCards : wantableCards)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.country.toLowerCase().includes(search.toLowerCase()));

  const toggle = (id: string) => {
    if (step === 'offer') {
      setOffered(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    } else {
      setRequested(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    }
  };

  const handleSend = async () => {
    if (!offered.length) return;
    setSending(true);
    await onPropose(offered, requested, message);
    setSending(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 p-0 sm:p-4 backdrop-blur">
      <div className="w-full max-w-2xl rounded-t-3xl sm:rounded-3xl border border-violet-500/30 bg-[#0d0d24] shadow-[0_0_60px_rgba(139,92,246,0.3)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-violet-500/20">
          <div>
            <h2 className="font-black text-xl text-white">🔄 Propor Troca</h2>
            <p className="text-violet-200/60 text-sm">
              {step === 'offer' ? 'O que você oferece?' : step === 'request' ? 'O que você quer receber?' : 'Confirme a troca'}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-violet-200 hover:text-white rounded-xl">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Steps indicator */}
        <div className="flex gap-2 px-5 py-3">
          {(['offer', 'request', 'confirm'] as const).map((s, i) => (
            <div key={s} className={cn('flex-1 h-1.5 rounded-full transition-all', step === s ? 'bg-gradient-to-r from-violet-500 to-cyan-400' : i < ['offer','request','confirm'].indexOf(step) ? 'bg-violet-500/50' : 'bg-violet-500/20')} />
          ))}
        </div>

        {step !== 'confirm' ? (
          <>
            {/* Quick filter duplicates */}
            {step === 'offer' && myDuplicates.length > 0 && (
              <div className="px-5 pb-2">
                <Button variant="ghost" size="sm" onClick={() => setOffered(myDuplicates.slice(0,3).map(p => p.id))} className="text-cyan-300 hover:text-white text-xs">
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
                {filteredCards.slice(0, 40).map((player) => {
                  const sel = step === 'offer' ? offered.includes(player.id) : requested.includes(player.id);
                  return (
                    <div key={player.id} className="relative">
                      <CardFigurina player={player} size="sm" selected={sel} onClick={() => toggle(player.id)} animate />
                    </div>
                  );
                })}
                {filteredCards.length === 0 && (
                  <p className="text-violet-200/50 text-sm py-8 w-full text-center">Nenhuma figurinha encontrada</p>
                )}
              </div>
            </div>

            {/* Selection summary */}
            <div className="px-5 py-3 border-t border-violet-500/20 bg-[#0f0f24]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-violet-200/70">
                  {step === 'offer' ? `${offered.length} selecionada(s) para oferecer` : `${requested.length} selecionada(s) para pedir`}
                </span>
                <Button
                  onClick={() => setStep(step === 'offer' ? 'request' : 'confirm')}
                  disabled={step === 'offer' && offered.length === 0}
                  className="bg-gradient-to-r from-violet-500 to-cyan-400 font-bold"
                >
                  {step === 'offer' ? 'Próximo →' : 'Revisar →'}
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Confirm step */
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-violet-200/60 uppercase mb-2">Você oferece ({offered.length})</p>
                <div className="flex flex-wrap gap-1">
                  {offered.map(id => {
                    const p = getPlayerById(id);
                    return p ? <CardFigurina key={id} player={p} size="sm" /> : null;
                  })}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-violet-200/60 uppercase mb-2">Você quer ({requested.length})</p>
                <div className="flex flex-wrap gap-1">
                  {requested.length === 0 && <p className="text-violet-200/40 text-xs">Qualquer figurinha</p>}
                  {requested.map(id => {
                    const p = getPlayerById(id);
                    return p ? <CardFigurina key={id} player={p} size="sm" /> : null;
                  })}
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-violet-200/60 uppercase mb-2">Mensagem (opcional)</p>
              <textarea
                className="w-full rounded-xl bg-[#1a1a3a] border border-violet-500/30 px-3 py-2 text-sm text-white placeholder:text-violet-200/40 focus:outline-none focus:border-cyan-400/60 resize-none"
                placeholder="Ex: Tenho Messi ×2, quero Mbappé..."
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep('request')} className="flex-1 text-violet-200">← Voltar</Button>
              <Button onClick={handleSend} disabled={sending || offered.length === 0} className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-400 font-black">
                <Send className="mr-2 h-4 w-4" /> {sending ? 'Enviando...' : 'Publicar Troca'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
