import { useState } from 'react';
import { AlbumPlayer, RARITY_CONFIG, getPlayerImageUrl, getFallbackAvatar, getFlagUrl } from '@/data/albumPlayers';
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

export function CardFigurina({ player, quantity = 1, size = 'md', showQuantity, selected, onClick, glow = false, animate = false }: Props) {
  const [imgError, setImgError] = useState(false);
  const cfg = RARITY_CONFIG[player.rarity];

  const sizeClass = {
    sm: 'w-24 h-36',
    md: 'w-36 h-52',
    lg: 'w-44 h-64',
  }[size];

  const fontSizes = {
    sm: { name: 'text-[10px]', overall: 'text-base', pos: 'text-[8px]' },
    md: { name: 'text-xs', overall: 'text-xl', pos: 'text-[10px]' },
    lg: { name: 'text-sm', overall: 'text-2xl', pos: 'text-xs' },
  }[size];

  const isLegendary = player.rarity === 'legendary';
  const isEpic = player.rarity === 'epic';

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer select-none',
        sizeClass,
        cfg.border,
        selected && 'ring-4 ring-cyan-400 scale-105',
        glow && `shadow-lg ${cfg.glow}`,
        animate && 'hover:scale-105 hover:-translate-y-1',
        isLegendary && 'legendary-card',
        isEpic && 'epic-card',
      )}
      style={isLegendary ? {
        background: 'linear-gradient(135deg, #1a0a00, #2d1600, #1a0a00)',
        boxShadow: '0 0 30px rgba(245,158,11,0.6), inset 0 0 30px rgba(245,158,11,0.1)',
      } : isEpic ? {
        background: 'linear-gradient(135deg, #0d0016, #1a003a, #0d0016)',
        boxShadow: '0 0 20px rgba(139,92,246,0.5), inset 0 0 20px rgba(139,92,246,0.1)',
      } : {
        background: 'linear-gradient(135deg, #0a0a1a, #141432)',
      }}
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

      {/* Player photo */}
      <div className="absolute inset-0 flex items-center justify-center pt-6">
        <img
          src={imgError || !player.sofascoreId ? getFallbackAvatar(player) : getPlayerImageUrl(player)}
          alt={player.name}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover object-top"
          style={{ maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)' }}
        />
      </div>

      {/* Gradient overlay bottom */}
      <div className={cn('absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10')} />

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-2">
        {/* Overall rating */}
        <div className={cn('font-black leading-none', fontSizes.overall, cfg.text)}>
          {player.overall}
        </div>

        {/* Position badge */}
        <div className={cn('rounded px-1 py-0.5 font-black uppercase w-fit', fontSizes.pos, 'bg-white/20 text-white/90 mb-1')}>
          {player.position}
        </div>

        {/* Name */}
        <div className={cn('font-extrabold text-white leading-tight line-clamp-2', fontSizes.name)}>
          {player.name}
        </div>

        {/* Country */}
        <div className={cn('text-white/60', fontSizes.pos)}>{player.country}</div>

        {/* Special skill */}
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

      {/* "NEW" badge */}
      {showQuantity && quantity === 1 && (
        <div className="absolute top-6 right-1 z-30 rounded-full bg-emerald-500 text-white text-[8px] font-black px-1 shadow-lg">
          NEW
        </div>
      )}
    </div>
  );
}
