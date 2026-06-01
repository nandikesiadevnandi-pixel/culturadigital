import { StudentCard } from '@/hooks/useStudentCards';

interface Props {
  card: Pick<StudentCard,
    'playerName' | 'country' | 'countryFlag' | 'club' | 'position' |
    'jerseyNumber' | 'foot' | 'jerseyColor' | 'jerseyStyle' | 'frame' | 'photoUrl'
  >;
  size?: 'sm' | 'md' | 'lg';
}

const FRAMES: Record<string, string> = {
  gold:       'from-[#FBBA16] via-[#F59E0B] to-[#B45309]',
  diamond:    'from-[#7DD3FC] via-[#A5B4FC] to-[#C084FC]',
  holographic:'from-[#F472B6] via-[#A78BFA] to-[#22D3EE]',
};

export function StudentCardView({ card, size = 'md' }: Props) {
  const dims = size === 'sm'
    ? 'w-40 h-60'
    : size === 'lg'
      ? 'w-72 h-[27rem]'
      : 'w-56 h-80';

  const frameGrad = FRAMES[card.frame] ?? FRAMES.gold;

  return (
    <div className={`relative ${dims} rounded-2xl p-[3px] bg-gradient-to-br ${frameGrad} shadow-2xl select-none`}>
      {/* Holo shimmer overlay */}
      <div className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none bg-[conic-gradient(from_0deg,transparent,white,transparent,white,transparent)] mix-blend-overlay" />

      <div className="relative h-full w-full rounded-2xl overflow-hidden bg-gradient-to-b from-gray-900 to-black flex flex-col">
        {/* LEND badge */}
        <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-md bg-gradient-to-r from-[#FBBA16] to-[#F59E0B] text-[9px] font-black text-gray-900 tracking-wider shadow-lg">
          ★ LENDÁRIA
        </div>
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur text-[10px] font-black text-white">
          <span>{card.position}</span>
          <span className="text-[#FBBA16]">·</span>
          <span>#{card.jerseyNumber}</span>
        </div>

        {/* Photo with jersey color tint at bottom */}
        <div className="relative flex-1 overflow-hidden">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background: card.jerseyStyle === 'striped'
                ? `repeating-linear-gradient(90deg, ${card.jerseyColor} 0 12px, transparent 12px 24px)`
                : card.jerseyColor,
            }}
          />
          {card.photoUrl ? (
            <img src={card.photoUrl} alt={card.playerName} className="relative h-full w-full object-cover" />
          ) : (
            <div className="relative h-full w-full flex items-center justify-center text-white/30 text-xs">sem foto</div>
          )}
          {/* gradient bottom for legibility */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/90 to-transparent" />
        </div>

        {/* Info strip */}
        <div className="relative px-3 py-2 bg-black text-white border-t-2" style={{ borderColor: card.jerseyColor }}>
          <div className="flex items-center justify-between">
            <div className="font-black text-sm leading-tight truncate flex-1 uppercase tracking-wide">
              {card.playerName || '—'}
            </div>
            <span className="text-base ml-1">{card.countryFlag}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-white/70 mt-0.5">
            <span className="truncate">{card.club || card.country}</span>
            <span className="font-bold">Pé {card.foot[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
