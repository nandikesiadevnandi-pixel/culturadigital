import { ShieldConfig } from '@/hooks/useSquad';

const SYMBOLS: Record<string, string> = {
  bolt:    '⚡', star: '⭐', flame: '🔥', crown: '👑',
  ball:    '⚽', lion: '🦁', eagle: '🦅', diamond: '✦',
};

interface Props { config: ShieldConfig; size?: number; letter?: string; }

export function ShieldSVG({ config, size = 64, letter = 'T' }: Props) {
  const { primary, secondary, division, symbol, shape } = config;
  const s = size;
  const cx = s / 2;

  // Shield path by shape
  const paths: Record<string, string> = {
    classic: `M${cx},${s*0.04} L${s*0.93},${s*0.18} L${s*0.93},${s*0.55} Q${s*0.93},${s*0.82} ${cx},${s*0.97} Q${s*0.07},${s*0.82} ${s*0.07},${s*0.55} L${s*0.07},${s*0.18} Z`,
    italian: `M${cx},${s*0.04} L${s*0.94},${s*0.04} L${s*0.94},${s*0.65} Q${s*0.94},${s*0.85} ${cx},${s*0.97} Q${s*0.06},${s*0.85} ${s*0.06},${s*0.65} L${s*0.06},${s*0.04} Z`,
    round:   `M${cx},${s*0.97} A${s*0.45},${s*0.47} 0 1 1 ${cx},${s*0.03} A${s*0.45},${s*0.47} 0 0 1 ${cx},${s*0.97} Z`,
    modern:  `M${s*0.1},${s*0.04} L${s*0.9},${s*0.04} L${s*0.9},${s*0.7} L${cx},${s*0.97} L${s*0.1},${s*0.7} Z`,
    oval:    `M${cx},${s*0.97} A${s*0.43},${s*0.47} 0 1 1 ${cx},${s*0.03} A${s*0.43},${s*0.47} 0 0 1 ${cx},${s*0.97} Z`,
  };

  const clipId = `shield-clip-${Math.random().toString(36).slice(2)}`;
  const shieldPath = paths[shape] ?? paths.classic;

  // Division fill helpers
  const divisionFills = () => {
    switch (division) {
      case 'half-v':
        return (
          <>
            <rect x="0" y="0" width={cx} height={s} fill={primary} />
            <rect x={cx} y="0" width={cx} height={s} fill={secondary} />
          </>
        );
      case 'half-h':
        return (
          <>
            <rect x="0" y="0" width={s} height={s * 0.5} fill={primary} />
            <rect x="0" y={s * 0.5} width={s} height={s * 0.5} fill={secondary} />
          </>
        );
      case 'quarters':
        return (
          <>
            <rect x="0" y="0" width={cx} height={s * 0.5} fill={primary} />
            <rect x={cx} y="0" width={cx} height={s * 0.5} fill={secondary} />
            <rect x="0" y={s * 0.5} width={cx} height={s * 0.5} fill={secondary} />
            <rect x={cx} y={s * 0.5} width={cx} height={s * 0.5} fill={primary} />
          </>
        );
      case 'diagonal':
        return (
          <>
            <rect x="0" y="0" width={s} height={s} fill={primary} />
            <polygon points={`0,0 ${s},0 ${s},${s}`} fill={secondary} />
          </>
        );
      case 'stripes':
        return (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <rect key={i} x={(s / 5) * i} y="0" width={s / 5} height={s}
                fill={i % 2 === 0 ? primary : secondary} />
            ))}
          </>
        );
      default:
        return <rect x="0" y="0" width={s} height={s} fill={primary} />;
    }
  };

  const sym = symbol === 'letter' ? letter[0]?.toUpperCase() : SYMBOLS[symbol];

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={clipId}>
          <path d={shieldPath} />
        </clipPath>
      </defs>
      {/* background fill */}
      <g clipPath={`url(#${clipId})`}>
        {divisionFills()}
      </g>
      {/* border */}
      <path d={shieldPath} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={s * 0.03} />
      {/* symbol */}
      <text x={cx} y={s * 0.62} textAnchor="middle" dominantBaseline="middle"
        fontSize={s * 0.35} style={{ userSelect: 'none' }}>
        {sym}
      </text>
    </svg>
  );
}
