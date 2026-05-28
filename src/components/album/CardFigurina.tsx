import { useEffect, useRef, useState } from 'react';
import { AlbumPlayer, RARITY_CONFIG, getFlagUrl } from '@/data/albumPlayers';
import { usePlayerPhoto } from '@/hooks/usePlayerPhoto';
import { cn } from '@/lib/utils';

interface Props {
  player: AlbumPlayer;
  quantity?: number;
  size?: 'sm' | 'md' | 'lg';
  showQuantity?: boolean;
  selected?: boolean;
  onClick?: () => void;
  glow?: boolean;
  animate?: boolean;
}

function PlayerSilhouette() {
  return (
    <svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-hidden="true">
      <circle cx="50" cy="22" r="18" fill="rgba(255,255,255,0.22)" />
      <path d="M22 56 L31 42 L45 48 L50 66 L55 48 L69 42 L78 56 L73 96 L27 96 Z" fill="rgba(255,255,255,0.18)" />
      <path d="M27 60 L8 80 L16 82 L32 64" fill="rgba(255,255,255,0.15)" />
      <path d="M73 60 L92 80 L84 82 L68 64" fill="rgba(255,255,255,0.15)" />
      <rect x="29" y="93" width="42" height="18" rx="4" fill="rgba(255,255,255,0.25)" />
      <rect x="31" y="109" width="15" height="26" rx="6" fill="rgba(255,255,255,0.18)" />
      <rect x="54" y="109" width="15" height="26" rx="6" fill="rgba(255,255,255,0.18)" />
      <ellipse cx="38" cy="137" rx="12" ry="4" fill="rgba(255,255,255,0.28)" />
      <ellipse cx="61" cy="137" rx="12" ry="4" fill="rgba(255,255,255,0.28)" />
    </svg>
  );
}

export function CardFigurina({ player, quantity = 1, size = 'md', showQuantity, selected, onClick, glow = false, animate = false }: Props) {
  const [photoOk, setPhotoOk] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const resolvedPhotoUrl = usePlayerPhoto(player);

  const cfg = RARITY_CONFIG[player.rarity];

  const sizeClass = {
    sm: 'w-24 h-36',
    md: 'w-36 h-52',
    lg: 'w-44 h-64',
  }[size];

  const fontSizes = {
    sm: { name: 'text-[10px]', overall: 'text-base', pos: 'text-[8px]' },
    md: { name: 'text-xs',     overall: 'text-xl',   pos: 'text-[10px]' },
    lg: { name: 'text-sm',     overall: 'text-2xl',  pos: 'text-xs' },
  }[size];

  const isLegendary = player.rarity === 'legendary';
  const isEpic      = player.rarity === 'epic';

  // Reset photo state when the resolved URL changes
  useEffect(() => {
    setPhotoOk(false);
    setPhotoError(false);
    const img = imgRef.current;
    if (img && img.complete) {
      if (img.naturalWidth > 0) setPhotoOk(true);
      else setPhotoError(true);
    }
  }, [resolvedPhotoUrl]);

  const hasPhoto = !!resolvedPhotoUrl && !photoError;
  const showSilhouette = !hasPhoto || !photoOk;

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer select-none',
        sizeClass,
        cfg.border,
        isLegendary ? 'card-legendary legendary-card' : isEpic ? 'card-epic epic-card' : 'card-base',
        selected && 'ring-4 ring-cyan-400 scale-105',
        glow && `shadow-lg ${cfg.glow}`,
        animate && 'hover:scale-105 hover:-translate-y-1',
      )}
    >
      {/* Holographic shimmer for legendary */}
      {isLegendary && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute inset-0 shimmer-gold opacity-30" />
        </div>
      )}

      {/* Top bar: rarity badge + flag */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-2 py-1">
        <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider', cfg.badge, cfg.text)}>
          {cfg.label}
        </span>
        <img
          src={getFlagUrl(player.flagCode)}
          alt={player.country}
          className="h-4 w-5 rounded-sm object-cover shadow"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>

      {/* Player photo — fills card, fades in on load */}
      {hasPhoto && (
        <img
          ref={imgRef}
          src={resolvedPhotoUrl!}
          alt={player.name}
          onLoad={() => setPhotoOk(true)}
          onError={() => setPhotoError(true)}
          className={cn(
            'absolute inset-0 h-full w-full object-cover object-top card-photo-mask transition-opacity duration-500',
            photoOk ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}

      {/* Silhouette — shown while loading or when no photo */}
      {showSilhouette && (
        <div className="absolute inset-0 flex items-end justify-center pb-10">
          <div className="w-3/4 h-3/4">
            <PlayerSilhouette />
          </div>
        </div>
      )}

      {/* Gradient overlay bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-2">
        <div className={cn('font-black leading-none', fontSizes.overall, cfg.text)}>{player.overall}</div>
        <div className={cn('rounded px-1 py-0.5 font-black uppercase w-fit bg-white/20 text-white/90 mb-1', fontSizes.pos)}>
          {player.position}
        </div>
        <div className={cn('font-extrabold text-white leading-tight line-clamp-2', fontSizes.name)}>{player.name}</div>
        <div className={cn('text-white/60', fontSizes.pos)}>{player.country}</div>
        {player.special && (isLegendary || isEpic) && size !== 'sm' && (
          <div className={cn('mt-1 rounded px-1 py-0.5 truncate', fontSizes.pos, cfg.badge, cfg.text)}>
            {player.special}
          </div>
        )}
      </div>

      {/* Quantity badge */}
      {showQuantity && quantity > 1 && (
        <div className="absolute top-6 right-1 z-30 rounded-full bg-cyan-500 text-white text-[9px] font-black h-5 w-5 flex items-center justify-center shadow-lg">
          ×{quantity}
        </div>
      )}
      {showQuantity && quantity === 1 && (
        <div className="absolute top-6 right-1 z-30 rounded-full bg-emerald-500 text-white text-[8px] font-black px-1 shadow-lg">
          NEW
        </div>
      )}
    </div>
  );
}
