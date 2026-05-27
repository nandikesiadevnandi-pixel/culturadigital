import { FeedEvent } from '@/hooks/useAlbum';
import { getPlayerById } from '@/data/albumPlayers';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const EVENT_CONFIG: Record<string, { emoji: string; label: (e: FeedEvent) => string; color: string }> = {
  pack_opened: {
    emoji: '📦',
    label: (e) => e.payload.legendary ? `abriu um pacote e tirou um LENDÁRIO: ${e.payload.legendaryCard}! 🔥` : 'abriu um pacote!',
    color: e => e.payload.legendary ? 'text-yellow-300' : 'text-violet-200',
  } as Parameters<typeof Object.assign>[1],
  trade_completed: {
    emoji: '🔄',
    label: (e) => `completou uma troca com ${e.payload.with}!`,
    color: 'text-cyan-300',
  },
  collection_completed: {
    emoji: '🏆',
    label: (e) => `completou a coleção de ${e.payload.country}!`,
    color: 'text-yellow-300',
  },
  challenge_won: {
    emoji: '⚡',
    label: (e) => `venceu o desafio "${e.payload.challengeTitle}" e ganhou ${e.payload.packs} pacote(s)!`,
    color: 'text-emerald-300',
  },
  duplicate_offered: {
    emoji: '♻️',
    label: (e) => `está oferecendo repetidas para troca!`,
    color: 'text-blue-300',
  },
};

interface Props {
  feed: FeedEvent[];
  currentUserId?: string;
}

export function AlbumFeed({ feed, currentUserId }: Props) {
  if (feed.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center text-violet-200/50">
        <span className="text-4xl">📡</span>
        <p className="text-sm">Nenhuma atividade ainda. Abra um pacote para começar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {feed.map((event) => {
        const cfg = EVENT_CONFIG[event.eventType];
        if (!cfg) return null;
        const isMe = event.userId === currentUserId;
        const isLegendary = event.eventType === 'pack_opened' && event.payload.legendary;

        return (
          <div
            key={event.id}
            className={cn(
              'flex items-start gap-3 rounded-2xl border p-3 transition-all',
              isLegendary
                ? 'border-yellow-400/40 bg-yellow-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                : 'border-violet-500/20 bg-[#0f0f24]/60',
              isMe && 'border-cyan-400/30',
            )}
          >
            <span className="text-2xl mt-0.5 flex-shrink-0">{cfg.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-relaxed">
                <span className={cn('font-extrabold', isMe ? 'text-cyan-300' : 'text-white')}>
                  {isMe ? 'Você' : event.userName}
                </span>{' '}
                <span className={cn(typeof cfg.color === 'function' ? (cfg.color as (e: FeedEvent) => string)(event) : cfg.color)}>
                  {cfg.label(event)}
                </span>
              </p>
              <p className="text-xs text-violet-200/40 mt-0.5">
                {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true, locale: ptBR })}
                {event.className && ` · Turma ${event.className}`}
              </p>
            </div>
            {isLegendary && <span className="text-lg animate-bounce">🔥</span>}
          </div>
        );
      })}
    </div>
  );
}
