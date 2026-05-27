import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAlbum, TradeProposal } from '@/hooks/useAlbum';
import { TradeModal } from '@/components/album/TradeModal';
import { ClassChat } from '@/components/album/ClassChat';
import { CardFigurina } from '@/components/album/CardFigurina';
import { CopaBackground } from '@/components/album/CopaBackground';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Check, X, ArrowLeftRight } from 'lucide-react';
import { getPlayerById } from '@/data/albumPlayers';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Tab = 'active' | 'incoming' | 'chat';

export default function TrocasPage() {
  const { user } = useAuth();
  const album = useAlbum();
  const [tab, setTab] = useState<Tab>('active');
  const [showModal, setShowModal] = useState(false);

  const myTrades   = album.trades.filter(t => t.fromUserId === user?.id && t.status !== 'cancelled');
  const incoming   = album.trades.filter(t => t.toUserId   === user?.id && t.status === 'pending');
  const openTrades = album.trades.filter(t => t.status === 'open' && t.fromUserId !== user?.id);

  const handlePropose = async (offeredCards: string[], requestedCards: string[], message: string) => {
    await album.proposeTrade({ offeredCards, requestedCards, message });
    toast.success('Troca publicada! Aguarde interessados.');
    setShowModal(false);
  };

  const handleRespond = async (tradeId: string, accept: boolean) => {
    await album.respondTrade(tradeId, accept);
    toast.success(accept ? 'Troca aceita! Figurinhas transferidas.' : 'Troca recusada.');
  };

  const handleCancel = async (tradeId: string) => {
    await album.cancelTrade(tradeId);
    toast.info('Troca cancelada.');
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'active',   label: 'Disponíveis', count: openTrades.length },
    { key: 'incoming', label: 'Para mim',    count: incoming.length },
    { key: 'chat',     label: 'Chat',        count: 0 },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-x-hidden">
      <CopaBackground />

      <div className="relative z-10 container py-8">
        <Link to="/aluno/album">
          <Button variant="ghost" className="mb-6 text-white/80 hover:text-white hover:bg-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> Álbum
          </Button>
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="copa-hero-title font-black text-3xl text-white">🔄 Centro de Trocas</h1>
            <p className="text-white/60">Troque repetidas com colegas em tempo real</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="copa-open-btn text-gray-900 font-black border-0 rounded-2xl"
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Troca
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button
              type="button"
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'relative rounded-xl px-4 py-2 text-sm font-bold transition-all',
                tab === t.key ? 'copa-filter-active' : 'copa-filter-inactive',
              )}
            >
              {t.label}
              {t.count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-[#D43B2A] text-white text-[10px] font-black flex items-center justify-center">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'active' && (
          <div className="space-y-4">
            {myTrades.filter(t => t.status === 'open').length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-black text-white/50 uppercase mb-3 tracking-wider">Minhas ofertas abertas</p>
                <div className="grid gap-3">
                  {myTrades.filter(t => t.status === 'open').map(trade => (
                    <TradeCard key={trade.id} trade={trade} isOwn onCancel={() => handleCancel(trade.id)} />
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs font-black text-white/50 uppercase mb-3 tracking-wider">Trocas disponíveis ({openTrades.length})</p>
            {openTrades.length === 0 ? (
              <div className="text-center py-16 text-white/40">
                <ArrowLeftRight className="mx-auto h-12 w-12 mb-3 opacity-30" />
                <p>Nenhuma troca aberta no momento.</p>
                <p className="text-sm mt-1">Seja o primeiro a publicar!</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {openTrades.map(trade => (
                  <TradeCard key={trade.id} trade={trade} onAccept={() => handleRespond(trade.id, true)} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'incoming' && (
          <div className="space-y-3">
            {incoming.length === 0 ? (
              <div className="text-center py-16 text-white/40">
                <p className="text-4xl mb-3">📬</p>
                <p>Nenhuma proposta para você.</p>
              </div>
            ) : incoming.map(trade => (
              <TradeCard
                key={trade.id}
                trade={trade}
                onAccept={() => handleRespond(trade.id, true)}
                onDecline={() => handleRespond(trade.id, false)}
              />
            ))}
          </div>
        )}

        {tab === 'chat' && (
          <ClassChat messages={album.chat} currentUserId={user?.id} onSend={album.sendChat} />
        )}
      </div>

      {showModal && (
        <TradeModal
          myInventory={album.inventory}
          onPropose={handlePropose}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

function TradeCard({ trade, isOwn, onAccept, onDecline, onCancel }: {
  trade: TradeProposal;
  isOwn?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onCancel?: () => void;
}) {
  const statusLabel: Record<string, string> = {
    open: 'Aberta', pending: 'Aguardando', accepted: 'Aceita', declined: 'Recusada', cancelled: 'Cancelada',
  };
  const statusColor: Record<string, string> = {
    open: 'text-[#1E9B5F]', pending: 'text-[#FBBA16]', accepted: 'text-[#38BDF8]',
    declined: 'text-[#D43B2A]', cancelled: 'text-white/40',
  };

  return (
    <div className="copa-panel p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-bold text-white text-sm">{isOwn ? 'Minha oferta' : trade.fromName}</p>
          <p className="text-xs text-white/50">
            {formatDistanceToNow(new Date(trade.createdAt), { addSuffix: true, locale: ptBR })}
            {trade.fromClass && ` · Turma ${trade.fromClass}`}
          </p>
        </div>
        <span className={cn('text-xs font-black', statusColor[trade.status])}>
          {statusLabel[trade.status]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-[10px] font-black text-white/50 uppercase mb-1 tracking-wider">Oferece ({trade.offeredCards.length})</p>
          <div className="flex flex-wrap gap-1">
            {trade.offeredCards.slice(0, 3).map(id => {
              const p = getPlayerById(id);
              return p ? <CardFigurina key={id} player={p} size="sm" /> : null;
            })}
            {trade.offeredCards.length > 3 && <span className="text-xs text-white/60 self-end">+{trade.offeredCards.length - 3}</span>}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black text-white/50 uppercase mb-1 tracking-wider">
            {trade.requestedCards.length ? `Quer (${trade.requestedCards.length})` : 'Aceita qualquer'}
          </p>
          <div className="flex flex-wrap gap-1">
            {trade.requestedCards.length === 0
              ? <span className="text-xs text-[#38BDF8]/80">Proposta livre</span>
              : trade.requestedCards.slice(0, 3).map(id => {
                  const p = getPlayerById(id);
                  return p ? <CardFigurina key={id} player={p} size="sm" /> : null;
                })
            }
            {trade.requestedCards.length > 3 && <span className="text-xs text-white/60 self-end">+{trade.requestedCards.length - 3}</span>}
          </div>
        </div>
      </div>

      {trade.message && (
        <p className="text-xs text-white/60 italic bg-white/10 rounded-lg px-3 py-2 mb-3">"{trade.message}"</p>
      )}

      {(onAccept || onDecline || onCancel) && !['accepted','declined','cancelled'].includes(trade.status) && (
        <div className="flex gap-2">
          {onAccept && (
            <button type="button" onClick={onAccept} className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-[#1E9B5F]/20 border border-[#1E9B5F]/40 text-[#1E9B5F] text-sm font-black py-2 hover:bg-[#1E9B5F]/30 transition-colors">
              <Check className="h-3.5 w-3.5" /> Aceitar
            </button>
          )}
          {onDecline && (
            <button type="button" onClick={onDecline} className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-[#D43B2A]/20 border border-[#D43B2A]/40 text-[#D43B2A] text-sm font-black py-2 hover:bg-[#D43B2A]/30 transition-colors">
              <X className="h-3.5 w-3.5" /> Recusar
            </button>
          )}
          {onCancel && (
            <button type="button" onClick={onCancel} title="Cancelar troca" aria-label="Cancelar troca" className="rounded-xl bg-white/10 border border-white/20 text-white/60 px-3 py-2 hover:bg-white/20 transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
