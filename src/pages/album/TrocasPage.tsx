import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAlbum, TradeProposal } from '@/hooks/useAlbum';
import { TradeModal } from '@/components/album/TradeModal';
import { ClassChat } from '@/components/album/ClassChat';
import { CardFigurina } from '@/components/album/CardFigurina';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Check, X, Clock, ArrowLeftRight, MessageCircle } from 'lucide-react';
import { getPlayerById, RARITY_CONFIG } from '@/data/albumPlayers';
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

  const myTrades = album.trades.filter(t => t.fromUserId === user?.id && t.status !== 'cancelled');
  const incoming = album.trades.filter(t => t.toUserId === user?.id && t.status === 'pending');
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

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#060612] via-[#0d0d28] to-[#060612]">
      <div className="container py-8">
        <Link to="/aluno/album">
          <Button variant="ghost" className="mb-6 text-violet-200 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Álbum
          </Button>
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-black text-3xl text-white">🔄 Centro de Trocas</h1>
            <p className="text-violet-200/60">Troque repetidas com colegas em tempo real</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-violet-500 to-cyan-400 font-black rounded-2xl"
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Troca
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {([
            { key: 'active',   label: 'Disponíveis', count: openTrades.length },
            { key: 'incoming', label: 'Para mim',    count: incoming.length },
            { key: 'chat',     label: 'Chat',        count: 0 },
          ] as { key: Tab; label: string; count: number }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'relative rounded-xl px-4 py-2 text-sm font-bold transition-all border',
                tab === t.key
                  ? 'bg-violet-500 border-violet-400 text-white'
                  : 'border-violet-500/30 bg-violet-500/10 text-violet-200/70',
              )}
            >
              {t.label}
              {t.count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'active' && (
          <div className="space-y-4">
            {/* My open trades */}
            {myTrades.filter(t => t.status === 'open').length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-bold text-violet-200/50 uppercase mb-3">Minhas ofertas abertas</p>
                <div className="grid gap-3">
                  {myTrades.filter(t => t.status === 'open').map(trade => (
                    <TradeCard key={trade.id} trade={trade} isOwn onCancel={() => handleCancel(trade.id)} />
                  ))}
                </div>
              </div>
            )}

            {/* Others' open trades */}
            <p className="text-xs font-bold text-violet-200/50 uppercase mb-3">Trocas disponíveis ({openTrades.length})</p>
            {openTrades.length === 0 ? (
              <div className="text-center py-16 text-violet-200/40">
                <ArrowLeftRight className="mx-auto h-12 w-12 mb-3 opacity-30" />
                <p>Nenhuma troca aberta no momento.</p>
                <p className="text-sm mt-1">Seja o primeiro a publicar!</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {openTrades.map(trade => (
                  <TradeCard
                    key={trade.id}
                    trade={trade}
                    onAccept={() => handleRespond(trade.id, true)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'incoming' && (
          <div className="space-y-3">
            {incoming.length === 0 ? (
              <div className="text-center py-16 text-violet-200/40">
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
          <ClassChat
            messages={album.chat}
            currentUserId={user?.id}
            onSend={album.sendChat}
          />
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
  const statusColors: Record<string, string> = {
    open: 'text-emerald-400',
    pending: 'text-yellow-400',
    accepted: 'text-cyan-400',
    declined: 'text-red-400',
    cancelled: 'text-gray-500',
  };

  return (
    <Card className="border-violet-500/20 bg-[#0f0f24]/80 p-4 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-bold text-white text-sm">{isOwn ? 'Minha oferta' : trade.fromName}</p>
          <p className="text-xs text-violet-200/50">
            {formatDistanceToNow(new Date(trade.createdAt), { addSuffix: true, locale: ptBR })}
            {trade.fromClass && ` · Turma ${trade.fromClass}`}
          </p>
        </div>
        <span className={cn('text-xs font-bold capitalize', statusColors[trade.status])}>
          {trade.status === 'open' ? 'Aberta' : trade.status === 'pending' ? 'Aguardando' : trade.status === 'accepted' ? 'Aceita' : trade.status === 'declined' ? 'Recusada' : 'Cancelada'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-[10px] font-bold text-violet-200/50 uppercase mb-1">Oferece ({trade.offeredCards.length})</p>
          <div className="flex flex-wrap gap-1">
            {trade.offeredCards.slice(0, 3).map(id => {
              const p = getPlayerById(id);
              return p ? <CardFigurina key={id} player={p} size="sm" /> : null;
            })}
            {trade.offeredCards.length > 3 && <span className="text-xs text-violet-200/60 self-end">+{trade.offeredCards.length - 3}</span>}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-violet-200/50 uppercase mb-1">
            {trade.requestedCards.length ? `Quer (${trade.requestedCards.length})` : 'Aceita qualquer'}
          </p>
          <div className="flex flex-wrap gap-1">
            {trade.requestedCards.length === 0
              ? <span className="text-xs text-cyan-300/70">Proposta livre</span>
              : trade.requestedCards.slice(0, 3).map(id => {
                  const p = getPlayerById(id);
                  return p ? <CardFigurina key={id} player={p} size="sm" /> : null;
                })
            }
            {trade.requestedCards.length > 3 && <span className="text-xs text-violet-200/60 self-end">+{trade.requestedCards.length - 3}</span>}
          </div>
        </div>
      </div>

      {trade.message && (
        <p className="text-xs text-violet-200/60 italic bg-violet-500/10 rounded-lg px-3 py-2 mb-3">"{trade.message}"</p>
      )}

      {(onAccept || onDecline || onCancel) && trade.status !== 'accepted' && trade.status !== 'declined' && trade.status !== 'cancelled' && (
        <div className="flex gap-2">
          {onAccept && (
            <Button size="sm" onClick={onAccept} className="flex-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 font-bold">
              <Check className="mr-1 h-3 w-3" /> Aceitar
            </Button>
          )}
          {onDecline && (
            <Button size="sm" onClick={onDecline} variant="ghost" className="flex-1 text-red-400 hover:text-red-300 font-bold">
              <X className="mr-1 h-3 w-3" /> Recusar
            </Button>
          )}
          {onCancel && (
            <Button size="sm" onClick={onCancel} variant="ghost" className="text-violet-200/60 hover:text-white">
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
