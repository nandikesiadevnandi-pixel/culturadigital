import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Swords, Trophy, Shield, Zap, Medal, ChevronRight, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useSquad, FORMATIONS, Formation, Strategy, ShieldConfig, LineupSlot, calcPower, powerBadge, MatchResult, STRATEGY_BONUS, Squad } from '@/hooks/useSquad';
import { useAuth } from '@/hooks/useAuth';
import { CopaBackground } from '@/components/album/CopaBackground';
import { ShieldSVG } from '@/components/album/ShieldSVG';
import { ALBUM_PLAYERS, AlbumPlayer, getFallbackAvatar, getFlagUrl } from '@/data/albumPlayers';

// ── Constants ──────────────────────────────────────────────────────────────

const COLORS = ['#e63946','#457b9d','#2dc653','#f4a261','#7b2d8b','#111','#fff','#e76f51','#2196f3','#ff9800'];
const FORMATIONS_LIST: Formation[] = ['4-4-2','4-3-3','3-5-2','5-3-2','4-2-3-1'];
const STRATEGIES: { id: Strategy; icon: string; label: string; desc: string }[] = [
  { id: 'ofensiva',  icon: '⚡', label: 'Ofensiva',      desc: 'Atacar sempre, pressão máxima' },
  { id: 'defensiva', icon: '🛡️', label: 'Defensiva',     desc: 'Bloquear e explodir no contra' },
  { id: 'posse',     icon: '🎯', label: 'Posse de Bola', desc: 'Controlar o ritmo do jogo' },
  { id: 'contra',    icon: '🚀', label: 'Contra-ataque', desc: 'Absorver e atacar rápido' },
  { id: 'pressao',   icon: '💪', label: 'Pressão Alta',  desc: 'Não deixar o adversário respirar' },
];
const SHAPES = ['classic','italian','round','modern','oval'] as const;
const DIVISIONS = ['solid','half-v','half-h','quarters','diagonal','stripes'] as const;
const SYMBOLS = ['bolt','star','flame','crown','ball','lion','eagle','diamond','letter'] as const;
const WIZARD_STEPS = ['Seleção', 'Identidade', 'Uniforme', 'Formação', 'Escalação'];

const NATIONAL_TEAMS = [
  { code: 'br',     name: 'Brasil',        primary: '#009C3B', secondary: '#FFDF00', starId: 'br-vinicius' },
  { code: 'ar',     name: 'Argentina',     primary: '#74ACDF', secondary: '#003DA5', starId: 'ar-messi' },
  { code: 'fr',     name: 'França',        primary: '#002395', secondary: '#ED2939', starId: 'fr-mbappe' },
  { code: 'gb-eng', name: 'Inglaterra',    primary: '#CF081F', secondary: '#FFFFFF', starId: 'en-bellingham' },
  { code: 'es',     name: 'Espanha',       primary: '#AA151B', secondary: '#F1BF00', starId: 'es-rodri' },
  { code: 'pt',     name: 'Portugal',      primary: '#006600', secondary: '#FF0000', starId: 'pt-ronaldo' },
  { code: 'de',     name: 'Alemanha',      primary: '#1C1C1C', secondary: '#DD0000', starId: 'de-wirtz' },
  { code: 'nl',     name: 'Holanda',       primary: '#FF6300', secondary: '#FFFFFF', starId: 'nl-vandijk' },
  { code: 'no',     name: 'Noruega',       primary: '#EF2B2D', secondary: '#003087', starId: 'no-haaland' },
  { code: 'hr',     name: 'Croácia',       primary: '#CC0000', secondary: '#FFFFFF', starId: 'hr-modric' },
  { code: 'be',     name: 'Bélgica',       primary: '#EF3340', secondary: '#FDDA24', starId: 'be-debruyne' },
  { code: 'it',     name: 'Itália',        primary: '#003399', secondary: '#FFFFFF', starId: 'it-barella' },
  { code: 'uy',     name: 'Uruguai',       primary: '#5BBFEB', secondary: '#FFFFFF', starId: 'uy-valverde' },
  { code: 'ma',     name: 'Marrocos',      primary: '#006233', secondary: '#C1272D', starId: 'ma-hakimi' },
  { code: 'kr',     name: 'Coreia do Sul', primary: '#003478', secondary: '#CD2E3A', starId: 'kr-son' },
  { code: 'jp',     name: 'Japão',         primary: '#BC002D', secondary: '#FFFFFF', starId: 'jp-mitoma' },
];

const DEFAULT_SHIELD: ShieldConfig = { shape: 'classic', primary: '#1E9B5F', secondary: '#FBBA16', division: 'half-v', symbol: 'star' };

// ── Helpers ────────────────────────────────────────────────────────────────

function positionCategory(label: string): AlbumPlayer['position'] {
  if (label === 'GOL') return 'GK';
  if (label === 'ZAG' || label === 'LAT') return 'DEF';
  if (label === 'MEI' || label === 'VOL') return 'MID';
  return 'ATK';
}

function autoFillLineup(
  flagCode: string,
  slots: { key: string; label: string; top: number; left: number }[]
): LineupSlot[] {
  const squad = ALBUM_PLAYERS.filter(p => p.flagCode === flagCode).sort((a, b) => b.overall - a.overall);
  const byPos: Record<string, AlbumPlayer[]> = { GK: [], DEF: [], MID: [], ATK: [] };
  for (const p of squad) byPos[p.position].push(p);
  const used = new Set<string>();
  const pick = (pos: AlbumPlayer['position']): string | null => {
    const found = byPos[pos].find(p => !used.has(p.id));
    if (found) { used.add(found.id); return found.id; }
    const any = squad.find(p => !used.has(p.id));
    if (any) { used.add(any.id); return any.id; }
    return null;
  };
  return slots.map(s => ({
    positionKey: s.key,
    positionLabel: s.label,
    playerId: pick(positionCategory(s.label)),
  }));
}

// ── Sub-components ─────────────────────────────────────────────────────────

function PlayerToken({ player, compact = false }: { player: AlbumPlayer; compact?: boolean }) {
  const dim = compact ? 'w-9 h-9' : 'w-14 h-14';
  const ringColor = player.rarity === 'legendary' ? 'ring-[#FBBA16]'
    : player.rarity === 'epic' ? 'ring-violet-400'
    : player.rarity === 'rare' ? 'ring-blue-400' : 'ring-gray-500';
  const glow = compact ? '' : player.rarity === 'legendary' ? 'shadow-[0_0_14px_#FBBA1699]'
    : player.rarity === 'epic' ? 'shadow-[0_0_10px_#a78bfa77]'
    : player.rarity === 'rare' ? 'shadow-[0_0_8px_#60a5fa55]' : '';
  const photo = player.photoUrl ?? getFallbackAvatar(player);
  const shortName = (player.name.split(' ').pop() ?? player.name).slice(0, 9);

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className={`relative ${dim} rounded-full ring-2 ${ringColor} ${glow} overflow-hidden bg-gray-900 flex-shrink-0`}>
        <img src={photo} alt={player.name}
          className="h-full w-full object-cover object-top"
          loading="lazy"
          onError={e => { (e.target as HTMLImageElement).src = getFallbackAvatar(player); }} />
        {!compact && (
          <div className={`absolute bottom-0 right-0 h-[18px] w-[18px] rounded-full bg-black/90 flex items-center justify-center font-black text-[7px] leading-none ${player.rarity === 'legendary' ? 'text-[#FBBA16]' : player.rarity === 'epic' ? 'text-violet-300' : 'text-white'}`}>
            {player.overall}
          </div>
        )}
      </div>
      <span className={`font-black text-white text-center leading-tight truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${compact ? 'text-[7px] max-w-[36px]' : 'text-[9px] max-w-[56px]'}`}>
        {shortName}
      </span>
    </div>
  );
}

function FieldView({ slots, lineup, onSlotClick, compact = false }: {
  slots: { key: string; label: string; top: number; left: number }[];
  lineup: LineupSlot[];
  onSlotClick?: (key: string) => void;
  compact?: boolean;
}) {
  return (
    <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden border border-green-700/60"
      style={{ background: 'linear-gradient(180deg,#1a5c1a 0%,#2d8c2d 40%,#2d8c2d 60%,#1a5c1a 100%)' }}>
      <div className="absolute inset-x-4 top-1/2 h-px bg-white/20" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/20" />
      <div className="absolute inset-x-[20%] top-[5%] h-[18%] border border-white/20 rounded-b-lg" />
      <div className="absolute inset-x-[20%] bottom-[5%] h-[18%] border border-white/20 rounded-t-lg" />
      {slots.map(slot => {
        const assigned = lineup.find(l => l.positionKey === slot.key);
        const player = assigned?.playerId ? ALBUM_PLAYERS.find(p => p.id === assigned.playerId) : null;
        return (
          <button key={slot.key} type="button"
            onClick={() => onSlotClick?.(slot.key)}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 group"
            style={{ top: `${slot.top}%`, left: `${slot.left}%` }}>
            {player ? (
              <PlayerToken player={player} compact={compact} />
            ) : (
              <div className={`rounded-full border-2 flex items-center justify-center font-black text-white transition-all
                ${compact ? 'w-7 h-7 text-[7px] border-white/30 bg-black/30' : 'w-10 h-10 text-[9px] border-dashed border-white/50 bg-black/30 group-hover:border-[#FBBA16] group-hover:text-[#FBBA16]'}`}>
                {slot.label}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function MatchAnim({ result, homeTeam, awayTeam, onClose }: {
  result: MatchResult; homeTeam: string; awayTeam: string; onClose: () => void;
}) {
  const [shown, setShown] = useState(0);
  const allGoals = [
    ...result.homeGoals.map(g => ({ name: g, team: homeTeam, side: 'home' })),
    ...result.awayGoals.map(g => ({ name: g, team: awayTeam, side: 'away' })),
  ].sort(() => Math.random() - 0.5);

  useEffect(() => {
    if (shown >= allGoals.length) return;
    const t = setTimeout(() => setShown(s => s + 1), 1200);
    return () => clearTimeout(t);
  }, [shown, allGoals.length]);

  const won = result.homeScore > result.awayScore;
  const drew = result.homeScore === result.awayScore;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 gap-6">
      <div className="text-center">
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">Resultado Final</p>
        <div className="flex items-center gap-6">
          <p className="text-white font-black text-base">{homeTeam}</p>
          <div className="text-6xl font-black text-white tabular-nums">
            {result.homeScore} <span className="text-[#FBBA16]">×</span> {result.awayScore}
          </div>
          <p className="text-white font-black text-base">{awayTeam}</p>
        </div>
        <p className={`mt-3 text-lg font-black ${won ? 'text-[#FBBA16]' : drew ? 'text-cyan-300' : 'text-red-400'}`}>
          {won ? '🏆 Vitória!' : drew ? '🤝 Empate!' : '😤 Derrota!'}
        </p>
      </div>
      <div className="w-full max-w-sm space-y-2">
        {allGoals.slice(0, shown).map((g, i) => (
          <div key={i} className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-bold animate-in slide-in-from-bottom-2
            ${g.side === 'home' ? 'bg-[#FBBA16]/20 text-[#FBBA16]' : 'bg-white/10 text-white flex-row-reverse'}`}>
            <span>⚽</span><span>{g.name}</span>
            <span className="text-[10px] opacity-60">{g.team}</span>
          </div>
        ))}
      </div>
      {shown >= allGoals.length && (
        <button onClick={onClose}
          className="mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-[#FBBA16] to-[#F59E0B] text-gray-900 font-black flex items-center gap-2">
          <Check className="h-4 w-4" /> Ver Tabela
        </button>
      )}
    </div>
  );
}

// ── Strategy helpers ───────────────────────────────────────────────────────

function stratAdvantage(myStrat: Strategy, oppStrat: Strategy) {
  const bonus = STRATEGY_BONUS[myStrat]?.[oppStrat] ?? 0;
  if (bonus >= 5)  return { label: 'GRANDE VANTAGEM', color: 'text-green-400',  border: 'border-green-400/50 bg-green-500/15',  tip: 'Tática perfeita contra essa!' };
  if (bonus >= 3)  return { label: 'Vantagem',        color: 'text-green-300',  border: 'border-green-400/40 bg-green-500/10',  tip: 'Boa escolha tática!' };
  if (bonus > 0)   return { label: 'Leve vantagem',   color: 'text-lime-300',   border: 'border-lime-400/30 bg-lime-500/10',    tip: 'Pequena vantagem tática.' };
  if (bonus === 0) return { label: 'Neutro',           color: 'text-white/50',   border: 'border-white/20 bg-white/5',           tip: 'Vence quem tiver mais talento.' };
  if (bonus >= -3) return { label: 'Desvantagem',     color: 'text-yellow-400', border: 'border-yellow-400/40 bg-yellow-500/10',tip: 'Cuidado — tente outra tática!' };
  return               { label: 'DESVANTAGEM GRAVE',  color: 'text-red-400',    border: 'border-red-400/50 bg-red-500/15',      tip: 'Muda de tática antes de jogar!' };
}

// ── PreMatchModal ──────────────────────────────────────────────────────────

function PreMatchModal({ mySquad, opponent, simulating, onClose, onPlay }: {
  mySquad: Squad; opponent: Squad; simulating: boolean;
  onClose: () => void; onPlay: (strat: Strategy) => void;
}) {
  const [matchStrat, setMatchStrat] = useState<Strategy>(mySquad.strategy);
  const bonus    = STRATEGY_BONUS[matchStrat]?.[opponent.strategy] ?? 0;
  const myPow    = Math.min(100, mySquad.powerScore + bonus);
  const adv      = stratAdvantage(matchStrat, opponent.strategy);
  const myBadge  = powerBadge(myPow);
  const oppBadge = powerBadge(opponent.powerScore);
  const oppInfo  = STRATEGIES.find(s => s.id === opponent.strategy);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/15 shadow-2xl my-4">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-[#FBBA16]" />
            <h2 className="font-black text-white text-lg">⚔️ Pré-Jogo</h2>
          </div>
          <button type="button" onClick={onClose} className="text-white/60 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-5 space-y-4">

          {/* Face-off */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 text-center space-y-1.5">
              <ShieldSVG config={mySquad.shield} size={56} letter={mySquad.teamName[0]} />
              <p className="text-white font-black text-sm truncate">{mySquad.teamName}</p>
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-black ${myBadge.border} ${myBadge.bg} ${myBadge.color}`}>
                ⚡ {myPow}
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[#FBBA16] font-black text-2xl">VS</span>
              <div className={`text-[11px] font-black px-2 py-1 rounded-lg border ${bonus > 0 ? 'border-green-400/40 text-green-300' : bonus < 0 ? 'border-red-400/40 text-red-300' : 'border-white/20 text-white/50'}`}>
                {bonus > 0 ? `+${bonus}` : bonus === 0 ? '±0' : `${bonus}`}
              </div>
            </div>
            <div className="flex-1 text-center space-y-1.5">
              <ShieldSVG config={opponent.shield} size={56} letter={opponent.teamName[0]} />
              <p className="text-white font-black text-sm truncate">{opponent.teamName}</p>
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-black ${oppBadge.border} ${oppBadge.bg} ${oppBadge.color}`}>
                ⚡ {opponent.powerScore}
              </div>
            </div>
          </div>

          {/* Opponent strategy reveal */}
          <div className="rounded-xl bg-white/5 border border-white/15 p-3 text-center">
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Tática do adversário</p>
            <p className="text-white font-black text-sm">{oppInfo?.icon} {oppInfo?.label}</p>
            <p className="text-white/50 text-[10px] mt-0.5">{oppInfo?.desc}</p>
          </div>

          {/* Advantage banner */}
          <div className={`rounded-2xl p-3 text-center border ${adv.border}`}>
            <p className={`font-black text-base ${adv.color}`}>{adv.label}</p>
            <p className="text-white/60 text-xs mt-0.5">{adv.tip}</p>
          </div>

          {/* Strategy picker */}
          <div>
            <p className="text-white/60 text-xs font-bold mb-2">🎮 Sua tática para este jogo:</p>
            <div className="space-y-1.5">
              {STRATEGIES.map(s => {
                const b   = STRATEGY_BONUS[s.id]?.[opponent.strategy] ?? 0;
                const a   = stratAdvantage(s.id, opponent.strategy);
                const sel = matchStrat === s.id;
                return (
                  <button key={s.id} type="button" onClick={() => setMatchStrat(s.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-left transition-all ${sel ? 'border-[#FBBA16] bg-[#FBBA16]/10' : 'border-white/15 hover:border-white/30'}`}>
                    <span className="text-xl">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-black ${sel ? 'text-[#FBBA16]' : 'text-white'}`}>{s.label}</p>
                      <p className="text-[10px] text-white/50">{s.desc}</p>
                    </div>
                    <div className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${b >= 3 ? 'bg-green-500/20 text-green-400' : b <= -3 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/50'}`}>
                      {b > 0 ? `+${b}` : b < 0 ? `${b}` : '—'}
                    </div>
                    <p className={`text-[9px] font-bold w-[72px] text-right shrink-0 ${a.color}`}>{a.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cycle legend */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-2.5 text-center">
            <p className="text-white/40 text-[10px] font-bold mb-1.5">🔄 Quem bate em quem</p>
            <div className="flex items-center justify-center flex-wrap gap-1 text-[9px] text-white/60 font-bold">
              {[['⚡','Ofensiva'],['🛡️','Defensiva'],['💪','Pressão'],['🎯','Posse'],['🚀','Contra']].map(([ic, lb], i, arr) => (
                <span key={lb} className="flex items-center gap-0.5">
                  <span>{ic} {lb}</span>
                  {i < arr.length - 1 && <span className="text-green-400 mx-0.5">→</span>}
                </span>
              ))}
              <span className="text-green-400 mx-0.5">→ ⚡</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/20 text-white/70 font-bold text-sm hover:bg-white/5">
              Cancelar
            </button>
            <button type="button" onClick={() => onPlay(matchStrat)} disabled={simulating}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FBBA16] to-[#F59E0B] text-gray-900 font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg">
              {simulating
                ? <><span className="animate-spin">⏳</span> Simulando…</>
                : <><Swords className="h-4 w-4" /> Começar Partida!</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

type Tab = 'time' | 'campeonato' | 'rankings';

export default function MinhaSelecaoPage() {
  const { profile } = useAuth();
  const { mySquad, classSquads, matches, loading, saveSquad, playMatch, table } = useSquad();
  const [tab, setTab] = useState<Tab>('time');

  const [editing, setEditing] = useState(false);
  const [wizStep, setWizStep] = useState(0);
  const [selectedTeamCode, setSelectedTeamCode] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [shield, setShield] = useState<ShieldConfig>(DEFAULT_SHIELD);
  const [jerseyColor, setJerseyColor] = useState('#1E9B5F');
  const [jerseyStyle, setJerseyStyle] = useState<'solid' | 'striped'>('solid');
  const [formation, setFormation] = useState<Formation>('4-3-3');
  const [strategy, setStrategy] = useState<Strategy>('ofensiva');
  const [lineup, setLineup] = useState<LineupSlot[]>([]);
  const [saving, setSaving] = useState(false);
  const [pickerSlot, setPickerSlot] = useState<string | null>(null);
  const [pickerFilter, setPickerFilter] = useState<'team' | 'all'>('team');
  const [simulating, setSimulating] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [matchOpp, setMatchOpp] = useState<{ home: string; away: string } | null>(null);
  const [newAchievement, setNewAchievement] = useState<string | null>(null);
  const [preMatchOpp, setPreMatchOpp] = useState<Squad | null>(null);

  const slots = FORMATIONS[formation];

  useEffect(() => {
    setLineup(prev => slots.map(slot => {
      const existing = prev.find(l => l.positionKey === slot.key);
      return existing ?? { positionKey: slot.key, positionLabel: slot.label, playerId: null };
    }));
  }, [formation]);

  const handleSelectTeam = (code: string) => {
    setSelectedTeamCode(code);
    const team = NATIONAL_TEAMS.find(t => t.code === code);
    if (team) {
      setShield(p => ({ ...p, primary: team.primary, secondary: team.secondary }));
      setJerseyColor(team.primary);
      if (!teamName) setTeamName(team.name);
    }
    setLineup(autoFillLineup(code, slots));
  };

  const openEdit = () => {
    if (mySquad) {
      setTeamName(mySquad.teamName);
      setShield(mySquad.shield);
      setJerseyColor(mySquad.jerseyColor);
      setJerseyStyle(mySquad.jerseyStyle as 'solid' | 'striped');
      setFormation(mySquad.formation);
      setStrategy(mySquad.strategy);
      setLineup(mySquad.lineup);
      const firstId = mySquad.lineup.find(l => l.playerId)?.playerId;
      const fp = firstId ? ALBUM_PLAYERS.find(p => p.id === firstId) : null;
      setSelectedTeamCode(fp?.flagCode ?? 'br');
    } else {
      setTeamName(''); setShield(DEFAULT_SHIELD); setJerseyColor('#1E9B5F');
      setJerseyStyle('solid'); setFormation('4-3-3'); setStrategy('ofensiva');
      setLineup([]); setSelectedTeamCode(null);
    }
    setWizStep(0);
    setEditing(true);
  };

  const handleSave = async () => {
    if (!teamName.trim()) { toast.error('Coloca o nome do time!'); return; }
    setSaving(true);
    const res = await saveSquad({ teamName: teamName.trim(), shield, jerseyColor, jerseyStyle, formation, strategy, lineup });
    setSaving(false);
    if (res.ok) {
      toast.success('⚽ Time salvo! Bora pra campo!');
      setEditing(false);
      if (!mySquad) { setNewAchievement('Fundador'); setTimeout(() => setNewAchievement(null), 4000); }
    } else { toast.error(res.error ?? 'Erro ao salvar'); }
  };

  const handlePreMatch = (oppId: string) => {
    const opp = classSquads.find(s => s.id === oppId);
    if (opp && mySquad) setPreMatchOpp(opp);
  };

  const handlePlayMatch = async (matchStrategy: Strategy) => {
    if (!preMatchOpp || !mySquad) return;
    const opp = preMatchOpp;
    setPreMatchOpp(null);
    setSimulating(true);
    const result = await playMatch(opp.id, matchStrategy);
    setSimulating(false);
    if (result) {
      setMatchResult(result);
      setMatchOpp({ home: mySquad.teamName, away: opp.teamName });
      if (result.homeScore > result.awayScore) {
        const myMatches = matches.filter(m => m.homeSquadId === mySquad.id || m.awaySquadId === mySquad.id);
        if (myMatches.length === 1) { setNewAchievement('Primeiro Apito'); setTimeout(() => setNewAchievement(null), 4000); }
      }
    }
  };

  const power = calcPower(lineup, strategy);
  const badge = powerBadge(mySquad?.powerScore ?? power);

  const pickerPlayers = (() => {
    if (!pickerSlot) return [];
    const posLabel = slots.find(s => s.key === pickerSlot)?.label ?? '';
    const posCat = positionCategory(posLabel);
    let pool = pickerFilter === 'team' && selectedTeamCode
      ? ALBUM_PLAYERS.filter(p => p.flagCode === selectedTeamCode)
      : ALBUM_PLAYERS;
    return [...pool].sort((a, b) => {
      const diff = (b.position === posCat ? 1 : 0) - (a.position === posCat ? 1 : 0);
      return diff !== 0 ? diff : b.overall - a.overall;
    });
  })();

  // ── WIZARD ──────────────────────────────────────────────────────────────
  if (editing) {
    return (
      <div className="fixed inset-0 z-40 bg-black/90 flex items-center justify-center p-3 overflow-y-auto">
        <div className="w-full max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/15 shadow-2xl overflow-hidden my-4">

          {/* header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/30">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#FBBA16]" />
              <h2 className="font-black text-white">{mySquad ? 'Editar Time' : 'Criar Meu Time'}</h2>
            </div>
            <button type="button" aria-label="Fechar" onClick={() => setEditing(false)} className="text-white/60 hover:text-white"><X className="h-5 w-5" /></button>
          </div>

          {/* progress */}
          <div className="flex gap-1 px-5 pt-4">
            {WIZARD_STEPS.map((label, i) => (
              <div key={label} className="flex-1">
                <div className={`h-1.5 rounded-full ${i <= wizStep ? 'bg-[#FBBA16]' : 'bg-white/15'}`} />
                <p className={`text-[10px] mt-1 font-bold ${i === wizStep ? 'text-[#FBBA16]' : 'text-white/40'}`}>{label}</p>
              </div>
            ))}
          </div>

          <div className="p-5">

            {/* ── STEP 0: Escolher Seleção ── */}
            {wizStep === 0 && (
              <div>
                <p className="text-white/60 text-xs mb-4">Escolha a seleção base — a escalação será preenchida automaticamente com os melhores jogadores! ⚽</p>
                <div className="grid grid-cols-4 gap-2 max-h-[400px] overflow-y-auto pr-1">
                  {NATIONAL_TEAMS.map(team => {
                    const star = ALBUM_PLAYERS.find(p => p.id === team.starId);
                    const isSelected = selectedTeamCode === team.code;
                    return (
                      <button key={team.code} type="button"
                        onClick={() => handleSelectTeam(team.code)}
                        className={`relative rounded-2xl overflow-hidden border-2 transition-all p-0 text-left ${isSelected ? 'border-[#FBBA16] scale-[1.04] shadow-[0_0_18px_#FBBA1666]' : 'border-white/10 hover:border-white/30 hover:scale-[1.02]'}`}>
                        <div className="h-14 flex items-center justify-center relative overflow-hidden"
                          style={{ background: `linear-gradient(135deg, ${team.primary} 0%, ${team.secondary} 100%)` }}>
                          <img src={getFlagUrl(team.code)} alt={team.name}
                            className="h-9 object-contain drop-shadow-lg"
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#FBBA16] flex items-center justify-center shadow-lg">
                              <Check className="h-3 w-3 text-gray-900" />
                            </div>
                          )}
                        </div>
                        <div className="bg-slate-900/95 px-1.5 py-2">
                          <p className="text-white font-black text-[10px] text-center leading-tight">{team.name}</p>
                          {star && (
                            <div className="flex items-center justify-center gap-1 mt-1">
                              <span className={`text-[8px] font-black px-1 rounded ${star.rarity === 'legendary' ? 'bg-[#FBBA16]/20 text-[#FBBA16]' : 'bg-white/10 text-white/60'}`}>
                                {star.overall}
                              </span>
                              <span className="text-[8px] text-white/50 truncate max-w-[44px]">{star.name.split(' ').pop()}</span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── STEP 1: Identidade ── */}
            {wizStep === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-white/70 mb-1 block">Nome do Time</label>
                  <input value={teamName} onChange={e => setTeamName(e.target.value.slice(0, 25))}
                    placeholder="Ex: Canela Tech FC" maxLength={25}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 outline-none focus:border-[#FBBA16]" />
                  <p className="text-[10px] text-white/30 mt-1">{teamName.length}/25</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-white/70 mb-2 block">Escudo</label>
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0"><ShieldSVG config={shield} size={80} letter={teamName[0] ?? 'T'} /></div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-[10px] text-white/50 mb-1">Formato</p>
                        <div className="flex gap-1 flex-wrap">
                          {SHAPES.map(s => (
                            <button key={s} type="button" onClick={() => setShield(p => ({ ...p, shape: s }))}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${shield.shape === s ? 'border-[#FBBA16] text-[#FBBA16] bg-[#FBBA16]/10' : 'border-white/20 text-white/60 hover:border-white/40'}`}>
                              {s === 'classic' ? 'Clássico' : s === 'italian' ? 'Italiano' : s === 'round' ? 'Redondo' : s === 'modern' ? 'Moderno' : 'Oval'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {(['primary', 'secondary'] as const).map(key => (
                          <div key={key}>
                            <p className="text-[10px] text-white/50 mb-1">{key === 'primary' ? 'Cor primária' : 'Cor secundária'}</p>
                            <div className="flex flex-wrap gap-1">
                              {COLORS.map(c => (
                                <button key={c} type="button" aria-label={`Cor ${c}`} onClick={() => setShield(p => ({ ...p, [key]: c }))}
                                  className={`w-6 h-6 rounded-md border-2 ${shield[key] === c ? 'border-white scale-110' : 'border-white/20'}`}
                                  style={{ backgroundColor: c }} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50 mb-1">Divisão</p>
                        <div className="flex gap-1 flex-wrap">
                          {DIVISIONS.map(d => (
                            <button key={d} type="button" onClick={() => setShield(p => ({ ...p, division: d }))}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${shield.division === d ? 'border-[#FBBA16] text-[#FBBA16]' : 'border-white/20 text-white/60'}`}>
                              {d === 'solid' ? 'Liso' : d === 'half-v' ? '½ Vert' : d === 'half-h' ? '½ Horiz' : d === 'quarters' ? 'Quartos' : d === 'diagonal' ? 'Diagonal' : 'Listras'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50 mb-1">Símbolo</p>
                        <div className="flex gap-1 flex-wrap">
                          {SYMBOLS.map(sym => (
                            <button key={sym} type="button" onClick={() => setShield(p => ({ ...p, symbol: sym }))}
                              className={`px-2 py-1 rounded-lg text-sm border ${shield.symbol === sym ? 'border-[#FBBA16] bg-[#FBBA16]/10' : 'border-white/20 hover:border-white/40'}`}>
                              {sym === 'letter' ? teamName[0]?.toUpperCase() ?? 'A' : sym === 'bolt' ? '⚡' : sym === 'star' ? '⭐' : sym === 'flame' ? '🔥' : sym === 'crown' ? '👑' : sym === 'ball' ? '⚽' : sym === 'lion' ? '🦁' : sym === 'eagle' ? '🦅' : '✦'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Uniforme ── */}
            {wizStep === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-white/70 mb-2 block">Cor da Camisa</label>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map(c => (
                      <button key={c} type="button" aria-label={`Cor ${c}`} onClick={() => setJerseyColor(c)}
                        className={`w-10 h-10 rounded-xl border-2 transition-all ${jerseyColor === c ? 'border-white scale-110' : 'border-white/20'}`}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-white/70 mb-2 block">Estilo</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ id: 'solid', label: 'Lisa' }, { id: 'striped', label: 'Listrada' }].map(s => (
                      <button key={s.id} type="button" onClick={() => setJerseyStyle(s.id as 'solid' | 'striped')}
                        className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${jerseyStyle === s.id ? 'border-[#FBBA16] bg-[#FBBA16]/10 text-[#FBBA16]' : 'border-white/20 text-white hover:border-white/40'}`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-24 h-28 rounded-xl border-2 border-white/20 flex items-center justify-center text-3xl"
                    style={{
                      background: jerseyStyle === 'striped'
                        ? `repeating-linear-gradient(90deg, ${jerseyColor} 0 10px, ${jerseyColor}88 10px 20px)`
                        : jerseyColor,
                    }}>
                    ⚽
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Formação & Estratégia ── */}
            {wizStep === 3 && (
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-white/70 mb-2 block">Formação</label>
                  <div className="space-y-1.5">
                    {FORMATIONS_LIST.map(f => (
                      <button key={f} type="button" onClick={() => setFormation(f)}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm font-black border-2 text-left flex items-center justify-between transition-all ${formation === f ? 'border-[#FBBA16] bg-[#FBBA16]/10 text-[#FBBA16]' : 'border-white/20 text-white hover:border-white/40'}`}>
                        <span>{f}</span>
                        {formation === f && <Check className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-white/70 mb-2 block">Estratégia</label>
                  <div className="space-y-1.5">
                    {STRATEGIES.map(s => (
                      <button key={s.id} type="button" onClick={() => setStrategy(s.id)}
                        className={`w-full px-3 py-2 rounded-xl text-left border-2 transition-all ${strategy === s.id ? 'border-[#FBBA16] bg-[#FBBA16]/10' : 'border-white/20 hover:border-white/40'}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{s.icon}</span>
                          <div>
                            <p className={`text-xs font-black ${strategy === s.id ? 'text-[#FBBA16]' : 'text-white'}`}>{s.label}</p>
                            <p className="text-[10px] text-white/50">{s.desc}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4: Escalação ── */}
            {wizStep === 4 && (
              <div className="grid md:grid-cols-2 gap-4">
                <FieldView slots={slots} lineup={lineup} onSlotClick={setPickerSlot} />
                <div>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border mb-3 ${powerBadge(power).border} ${powerBadge(power).bg}`}>
                    <Zap className={`h-4 w-4 ${powerBadge(power).color}`} />
                    <span className={`font-black text-sm ${powerBadge(power).color}`}>Poder: {power} — {powerBadge(power).label}</span>
                  </div>
                  <p className="text-[11px] text-white/60 mb-3">Clique em uma posição para trocar o jogador</p>
                  <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                    {lineup.map(slot => {
                      const p = slot.playerId ? ALBUM_PLAYERS.find(x => x.id === slot.playerId) : null;
                      return (
                        <button key={slot.positionKey} type="button" onClick={() => setPickerSlot(slot.positionKey)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left">
                          <span className="text-[10px] font-black text-white/50 w-6">{slot.positionLabel}</span>
                          {p ? (
                            <>
                              <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/20 flex-shrink-0">
                                <img src={p.photoUrl ?? getFallbackAvatar(p)} alt={p.name}
                                  className="h-full w-full object-cover object-top"
                                  onError={e => { (e.target as HTMLImageElement).src = getFallbackAvatar(p); }} />
                              </div>
                              <span className="text-xs font-bold text-white flex-1 truncate">{p.name}</span>
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${p.rarity === 'legendary' ? 'bg-[#FBBA16]/20 text-[#FBBA16]' : p.rarity === 'epic' ? 'bg-violet-500/20 text-violet-300' : 'bg-white/10 text-white/50'}`}>{p.overall}</span>
                            </>
                          ) : (
                            <span className="text-[10px] text-white/30 italic">— vazio —</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* footer */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/10 bg-black/30">
            <button type="button" onClick={() => setWizStep(s => Math.max(0, s - 1))} disabled={wizStep === 0}
              className="px-4 py-2 rounded-xl text-white/60 hover:text-white disabled:opacity-30 text-sm font-bold flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
            {wizStep < 4 ? (
              <button type="button" onClick={() => setWizStep(s => s + 1)}
                disabled={(wizStep === 0 && !selectedTeamCode) || (wizStep === 1 && !teamName.trim())}
                className="px-6 py-2.5 rounded-xl bg-[#FBBA16] text-gray-900 font-black flex items-center gap-2 disabled:opacity-40">
                Continuar <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="button" onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FBBA16] to-[#F59E0B] text-gray-900 font-black flex items-center gap-2 disabled:opacity-50">
                <Check className="h-4 w-4" /> {saving ? 'Salvando…' : 'Salvar Time'}
              </button>
            )}
          </div>
        </div>

        {/* Player picker */}
        {pickerSlot && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center" onClick={() => setPickerSlot(null)}>
            <div className="w-full max-w-lg bg-slate-900 rounded-t-3xl border-t border-white/15 p-4 max-h-[75vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-black">Trocar Jogador — {slots.find(s => s.key === pickerSlot)?.label}</p>
                <button type="button" aria-label="Fechar" onClick={() => setPickerSlot(null)} className="text-white/60 hover:text-white"><X className="h-4 w-4" /></button>
              </div>
              {selectedTeamCode && (
                <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-3">
                  {[
                    { id: 'team', label: NATIONAL_TEAMS.find(t => t.code === selectedTeamCode)?.name ?? 'Seleção' },
                    { id: 'all', label: '🌍 Mundo' },
                  ].map(f => (
                    <button key={f.id} type="button" onClick={() => setPickerFilter(f.id as 'team' | 'all')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${pickerFilter === f.id ? 'bg-[#FBBA16] text-gray-900' : 'text-white/60 hover:text-white'}`}>
                      {f.id === 'team' && selectedTeamCode && (
                        <img src={getFlagUrl(selectedTeamCode)} alt="" className="inline h-3 mr-1 object-contain"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      )}
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
              <button type="button" onClick={() => {
                setLineup(prev => prev.map(l => l.positionKey === pickerSlot ? { ...l, playerId: null } : l));
                setPickerSlot(null);
              }} className="w-full mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold text-left">
                ✕ Remover jogador desta posição
              </button>
              <div className="space-y-1.5">
                {pickerPlayers.map(p => {
                  const alreadyUsed = lineup.some(l => l.playerId === p.id && l.positionKey !== pickerSlot);
                  const posLabel = slots.find(s => s.key === pickerSlot)?.label ?? '';
                  const isIdeal = p.position === positionCategory(posLabel);
                  return (
                    <button key={p.id} type="button" disabled={alreadyUsed}
                      onClick={() => {
                        setLineup(prev => prev.map(l => l.positionKey === pickerSlot ? { ...l, playerId: p.id } : l));
                        setPickerSlot(null);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all border border-transparent ${alreadyUsed ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:border-white/10'}`}>
                      <div className={`w-11 h-11 rounded-full overflow-hidden ring-2 flex-shrink-0 ${p.rarity === 'legendary' ? 'ring-[#FBBA16]' : p.rarity === 'epic' ? 'ring-violet-400' : p.rarity === 'rare' ? 'ring-blue-400' : 'ring-gray-600'}`}>
                        <img src={p.photoUrl ?? getFallbackAvatar(p)} alt={p.name}
                          className="h-full w-full object-cover object-top"
                          onError={e => { (e.target as HTMLImageElement).src = getFallbackAvatar(p); }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-white truncate">{p.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <img src={getFlagUrl(p.flagCode)} alt={p.country} className="h-3 object-contain"
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          <span className="text-[10px] text-white/50">{p.country}</span>
                          {!isIdeal && <span className="text-[9px] text-orange-400 font-bold">(fora de pos.)</span>}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-[11px] font-black px-2 py-0.5 rounded ${p.rarity === 'legendary' ? 'bg-[#FBBA16]/20 text-[#FBBA16]' : p.rarity === 'epic' ? 'bg-violet-500/20 text-violet-300' : p.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-white/50'}`}>
                          {p.overall}
                        </span>
                        <span className="text-[9px] text-white/40">{p.position}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── PRE-MATCH MODAL ──────────────────────────────────────────────────────
  if (preMatchOpp && mySquad) {
    return (
      <PreMatchModal
        mySquad={mySquad}
        opponent={preMatchOpp}
        simulating={simulating}
        onClose={() => setPreMatchOpp(null)}
        onPlay={handlePlayMatch}
      />
    );
  }

  // ── MATCH ANIMATION ──────────────────────────────────────────────────────
  if (matchResult && matchOpp) {
    return <MatchAnim result={matchResult} homeTeam={matchOpp.home} awayTeam={matchOpp.away}
      onClose={() => { setMatchResult(null); setMatchOpp(null); setTab('campeonato'); }} />;
  }

  // ── MAIN PAGE ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-x-hidden">
      <CopaBackground />
      {newAchievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-[#FBBA16] to-[#F59E0B] text-gray-900 px-6 py-3 rounded-2xl shadow-2xl font-black flex items-center gap-2">
            🏆 Conquista: {newAchievement}!
          </div>
        </div>
      )}

      <div className="relative z-10 container py-8">
        <Link to="/aluno/album/craques">
          <button type="button" className="mb-6 flex items-center gap-2 text-white/80 hover:text-white text-sm font-bold">
            <ArrowLeft className="h-4 w-4" /> Craques da Turma
          </button>
        </Link>

        <h1 className="text-3xl font-black text-white mb-1">⚽ Minha Seleção</h1>
        <p className="text-white/60 text-sm mb-6">Monte seu time, desafie a turma e domine o campeonato</p>

        <div className="flex gap-1 p-1 bg-white/10 rounded-2xl mb-6 border border-white/10">
          {([['time', '🛡️ Meu Time'], ['campeonato', '🏆 Campeonato'], ['rankings', '🥇 Rankings']] as [Tab, string][]).map(([t, label]) => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${tab === t ? 'bg-[#FBBA16] text-gray-900' : 'text-white/70 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* ── TAB: MEU TIME ── */}
        {tab === 'time' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-white/50 text-center py-16">Carregando…</div>
            ) : !mySquad ? (
              <div className="text-center py-16 rounded-2xl border border-white/15 bg-white/5">
                <div className="text-5xl mb-3">⚽</div>
                <h2 className="text-white font-black text-xl mb-1">Cria teu time!</h2>
                <p className="text-white/60 text-sm mb-6">Escolha uma seleção real, monte seu clube e desafie a turma</p>
                <button type="button" onClick={openEdit}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#FBBA16] to-[#F59E0B] text-gray-900 font-black inline-flex items-center gap-2 shadow-lg">
                  <Shield className="h-5 w-5" /> Criar Meu Time
                </button>
              </div>
            ) : (
              <>
                <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-5">
                  <div className="flex items-center gap-4">
                    <ShieldSVG config={mySquad.shield} size={72} letter={mySquad.teamName[0]} />
                    <div className="flex-1">
                      <h2 className="text-white font-black text-xl">{mySquad.teamName}</h2>
                      <p className="text-white/60 text-xs mb-2">Técnico: {profile?.full_name} · {mySquad.formation} · {STRATEGIES.find(s => s.id === mySquad.strategy)?.label}</p>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black ${badge.border} ${badge.bg} ${badge.color}`}>
                        <Zap className="h-3 w-3" /> Poder {mySquad.powerScore} — {badge.label}
                      </div>
                    </div>
                    <button type="button" onClick={openEdit}
                      className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20">
                      Editar
                    </button>
                  </div>
                  <div className="mt-4 max-w-[200px] mx-auto">
                    <FieldView slots={FORMATIONS[mySquad.formation]} lineup={mySquad.lineup} compact />
                  </div>
                </div>

                {(() => {
                  const myMatches = matches.filter(m => m.homeSquadId === mySquad.id || m.awaySquadId === mySquad.id);
                  const W = myMatches.filter(m => (m.homeSquadId === mySquad.id ? m.homeScore : m.awayScore) > (m.homeSquadId === mySquad.id ? m.awayScore : m.homeScore)).length;
                  const D = myMatches.filter(m => m.homeScore === m.awayScore).length;
                  const L = myMatches.length - W - D;
                  return myMatches.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {[['J', myMatches.length, 'text-white'], ['V', W, 'text-[#2dc653]'], ['E', D, 'text-cyan-300'], ['D', L, 'text-red-400']].map(([l, v, c]) => (
                        <div key={String(l)} className="rounded-xl bg-white/10 border border-white/10 p-3 text-center">
                          <p className={`font-black text-xl ${c}`}>{v}</p>
                          <p className="text-white/50 text-[10px] font-bold">{l}</p>
                        </div>
                      ))}
                    </div>
                  ) : null;
                })()}

                <div>
                  <h3 className="text-white font-black mb-3 flex items-center gap-2"><Swords className="h-4 w-4 text-[#FBBA16]" /> Desafiar a Turma</h3>
                  {classSquads.filter(s => s.userId !== mySquad.userId).length === 0 ? (
                    <p className="text-white/40 text-sm italic">Nenhum outro time na turma ainda…</p>
                  ) : (
                    <div className="space-y-2">
                      {classSquads.filter(s => s.userId !== mySquad.userId).map(opp => {
                        const b = powerBadge(opp.powerScore);
                        return (
                          <div key={opp.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                            <ShieldSVG config={opp.shield} size={36} letter={opp.teamName[0]} />
                            <div className="flex-1">
                              <p className="text-white font-black text-sm">{opp.teamName}</p>
                              <p className="text-white/50 text-[10px]">Técnico: {opp.ownerName}</p>
                            </div>
                            <span className={`text-[10px] font-black ${b.color}`}>⚡ {opp.powerScore}</span>
                            <button type="button" onClick={() => handlePreMatch(opp.id)} disabled={simulating}
                              className="px-3 py-1.5 rounded-lg bg-[#FBBA16] text-gray-900 font-black text-xs disabled:opacity-50 flex items-center gap-1">
                              <Swords className="h-3 w-3" /> Desafiar
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {matches.filter(m => m.homeSquadId === mySquad.id || m.awaySquadId === mySquad.id).length > 0 && (
                  <div>
                    <h3 className="text-white font-black mb-3">Últimas Partidas</h3>
                    <div className="space-y-1.5">
                      {matches.filter(m => m.homeSquadId === mySquad.id || m.awaySquadId === mySquad.id).slice(0, 5).map(m => {
                        const isHome = m.homeSquadId === mySquad.id;
                        const myScore = isHome ? m.homeScore : m.awayScore;
                        const oppScore = isHome ? m.awayScore : m.homeScore;
                        const oppName = isHome ? m.awayTeamName : m.homeTeamName;
                        const won = myScore > oppScore;
                        const drew = myScore === oppScore;
                        return (
                          <div key={m.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm">
                            <span className={`font-black text-[10px] px-2 py-0.5 rounded ${won ? 'bg-green-500/20 text-green-400' : drew ? 'bg-cyan-500/20 text-cyan-400' : 'bg-red-500/20 text-red-400'}`}>
                              {won ? 'V' : drew ? 'E' : 'D'}
                            </span>
                            <span className="text-white/70 flex-1 truncate text-xs">{mySquad.teamName} {myScore}×{oppScore} {oppName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── TAB: CAMPEONATO ── */}
        {tab === 'campeonato' && (
          <div className="space-y-6">

            {/* ── Tabela com forma recente ── */}
            <div>
              <h2 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[#FBBA16]" /> Tabela da Turma {profile?.class_name}
              </h2>
              {table.length === 0 ? (
                <p className="text-white/40 text-sm italic text-center py-8">Nenhum time na turma ainda. Crie o seu!</p>
              ) : (
                <div className="rounded-2xl border border-white/15 overflow-hidden">
                  <div className="grid grid-cols-[2rem_1fr_auto_auto_auto_auto_auto_auto_auto] text-[10px] font-black text-white/50 uppercase px-3 py-2 bg-white/5 border-b border-white/10">
                    <span>#</span><span>Time</span>
                    {['J','V','E','D','GF','GC','PTS'].map(h => <span key={h} className="text-center px-2">{h}</span>)}
                  </div>
                  {table.map((row, i) => {
                    const isMe = row.squad.userId === profile?.user_id;
                    const teamMatches = matches
                      .filter(m => m.homeSquadId === row.squad.id || m.awaySquadId === row.squad.id)
                      .slice(0, 5);
                    const form = teamMatches.map(m => {
                      const isHome = m.homeSquadId === row.squad.id;
                      const ms = isHome ? m.homeScore : m.awayScore;
                      const os = isHome ? m.awayScore : m.homeScore;
                      return ms > os ? 'V' : ms === os ? 'E' : 'D';
                    });
                    return (
                      <div key={row.squad.id}
                        className={`grid grid-cols-[2rem_1fr_auto_auto_auto_auto_auto_auto_auto] items-center px-3 py-2.5 border-b border-white/5 last:border-0 ${isMe ? 'bg-[#FBBA16]/10' : 'hover:bg-white/5'}`}>
                        <span className={`font-black text-sm ${i === 0 ? 'text-[#FBBA16]' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-white/40'}`}>
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <ShieldSVG config={row.squad.shield} size={20} letter={row.squad.teamName[0]} />
                            <p className={`font-black text-xs truncate ${isMe ? 'text-[#FBBA16]' : 'text-white'}`}>{row.squad.teamName}</p>
                          </div>
                          {form.length > 0 && (
                            <div className="flex gap-0.5 mt-0.5 pl-6">
                              {form.map((r, fi) => (
                                <span key={fi} className={`text-[7px] font-black w-3 h-3 rounded-sm flex items-center justify-center ${r === 'V' ? 'bg-green-500 text-white' : r === 'E' ? 'bg-cyan-600 text-white' : 'bg-red-600 text-white'}`}>{r}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        {[row.J, row.W, row.D, row.L, row.GF, row.GA, row.pts].map((v, vi) => (
                          <span key={vi} className={`text-center px-2 text-xs font-bold ${vi === 6 ? 'text-[#FBBA16] font-black' : 'text-white/70'}`}>{v}</span>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Desafiar com pré-visualização tática ── */}
            {mySquad && (
              <div>
                <h2 className="text-white font-black text-lg mb-1 flex items-center gap-2">
                  <Swords className="h-5 w-5 text-[#FBBA16]" /> Desafiar Adversários
                </h2>
                <p className="text-white/50 text-xs mb-4">Analise as táticas e escolha a estratégia certa antes de jogar!</p>
                {classSquads.filter(s => s.userId !== mySquad.userId).length === 0 ? (
                  <p className="text-white/40 text-sm italic text-center py-8">Nenhum adversário na turma ainda.</p>
                ) : (
                  <div className="space-y-3">
                    {classSquads.filter(s => s.userId !== mySquad.userId).map(opp => {
                      const oppBadge   = powerBadge(opp.powerScore);
                      const bonus      = STRATEGY_BONUS[mySquad.strategy]?.[opp.strategy] ?? 0;
                      const adv        = stratAdvantage(mySquad.strategy, opp.strategy);
                      const oppStrat   = STRATEGIES.find(s => s.id === opp.strategy);
                      const myStrat    = STRATEGIES.find(s => s.id === mySquad.strategy);
                      const h2h        = matches.filter(m =>
                        (m.homeSquadId === mySquad.id && m.awaySquadId === opp.id) ||
                        (m.homeSquadId === opp.id && m.awaySquadId === mySquad.id));
                      const h2hW = h2h.filter(m => (m.homeSquadId === mySquad.id ? m.homeScore : m.awayScore) > (m.homeSquadId === mySquad.id ? m.awayScore : m.homeScore)).length;
                      const h2hL = h2h.filter(m => (m.homeSquadId === mySquad.id ? m.homeScore : m.awayScore) < (m.homeSquadId === mySquad.id ? m.awayScore : m.homeScore)).length;
                      return (
                        <div key={opp.id} className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm overflow-hidden">
                          <div className="flex items-center gap-3 p-4">
                            <ShieldSVG config={opp.shield} size={44} letter={opp.teamName[0]} />
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-black text-sm truncate">{opp.teamName}</p>
                              <p className="text-white/50 text-[10px]">Técnico: {opp.ownerName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-white/40">Tática:</span>
                                <span className="text-[10px] font-bold text-white/80">{oppStrat?.icon} {oppStrat?.label}</span>
                                <span className="text-[9px] text-white/30">· {opp.formation}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-black ${oppBadge.border} ${oppBadge.bg} ${oppBadge.color}`}>
                                ⚡ {opp.powerScore}
                              </div>
                              {h2h.length > 0 && (
                                <span className="text-[9px] text-white/40">H2H: {h2hW}V {h2h.length-h2hW-h2hL}E {h2hL}D</span>
                              )}
                            </div>
                          </div>
                          {/* Tactical matchup strip */}
                          <div className={`flex items-center justify-between px-4 py-2.5 border-t border-white/10 ${bonus >= 3 ? 'bg-green-500/10' : bonus <= -3 ? 'bg-red-500/10' : 'bg-black/20'}`}>
                            <div className="flex items-center gap-2 text-[10px] text-white/60">
                              <span>{myStrat?.icon} {myStrat?.label}</span>
                              <span className="text-white/30">→</span>
                              <span className={`font-black ${adv.color}`}>{bonus > 0 ? `▲ ${adv.label}` : bonus < 0 ? `▼ ${adv.label}` : `⚖ ${adv.label}`}</span>
                            </div>
                            <button type="button" onClick={() => handlePreMatch(opp.id)} disabled={simulating}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FBBA16] to-[#F59E0B] text-gray-900 font-black text-xs flex items-center gap-1.5 disabled:opacity-50 shadow-md">
                              <Swords className="h-3.5 w-3.5" /> Desafiar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Guia de estratégias ── */}
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
              <h3 className="text-white font-black text-sm mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#FBBA16]" /> Guia de Estratégias
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {([
                  { id: 'ofensiva',  beats: ['Defensiva', 'Posse'],       loses: ['Contra-ataque'] },
                  { id: 'defensiva', beats: ['Contra-ataque', 'Pressão'], loses: ['Ofensiva'] },
                  { id: 'posse',     beats: ['Pressão', 'Contra-ataque'], loses: ['Ofensiva'] },
                  { id: 'contra',    beats: ['Ofensiva', 'Pressão'],      loses: ['Defensiva'] },
                  { id: 'pressao',   beats: ['Ofensiva'],                 loses: ['Posse', 'Contra-ataque'] },
                ] as const).map(({ id, beats, loses }) => {
                  const info = STRATEGIES.find(s => s.id === id)!;
                  return (
                    <div key={id} className={`flex items-start gap-2 rounded-xl p-2.5 border ${mySquad?.strategy === id ? 'border-[#FBBA16]/40 bg-[#FBBA16]/10' : 'border-white/10 bg-white/5'}`}>
                      <span className="text-xl shrink-0">{info.icon}</span>
                      <div className="min-w-0">
                        <p className={`font-black text-[11px] ${mySquad?.strategy === id ? 'text-[#FBBA16]' : 'text-white'}`}>{info.label} {mySquad?.strategy === id && '← sua tática'}</p>
                        <p className="text-green-400 text-[10px]">✅ Bate: {beats.join(', ')}</p>
                        <p className="text-red-400 text-[10px]">❌ Perde: {loses.join(', ')}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: RANKINGS ── */}
        {tab === 'rankings' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-black mb-3 flex items-center gap-2"><Medal className="h-4 w-4 text-[#FBBA16]" /> Melhor Técnico</h3>
              <div className="space-y-2">
                {table.filter(r => r.J >= 1).sort((a, b) => b.pct - a.pct).map((row, i) => (
                  <div key={row.squad.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <span className={`font-black text-sm w-6 text-center ${i === 0 ? 'text-[#FBBA16]' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-white/40'}`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}º`}
                    </span>
                    <div className="flex-1">
                      <p className="text-white font-black text-sm">{row.squad.ownerName}</p>
                      <p className="text-white/50 text-[10px]">{row.squad.teamName} · {row.W}V {row.D}E {row.L}D</p>
                    </div>
                    <span className="text-[#FBBA16] font-black text-sm">{row.pct}%</span>
                  </div>
                ))}
                {table.filter(r => r.J >= 1).length === 0 && <p className="text-white/40 text-sm italic">Nenhuma partida jogada ainda</p>}
              </div>
            </div>

            <div>
              <h3 className="text-white font-black mb-3 flex items-center gap-2"><Zap className="h-4 w-4 text-cyan-300" /> Seleção Mais Forte</h3>
              <div className="space-y-2">
                {[...classSquads].sort((a, b) => b.powerScore - a.powerScore).map((squad, i) => {
                  const b = powerBadge(squad.powerScore);
                  return (
                    <div key={squad.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                      <span className={`font-black text-sm w-6 text-center ${i === 0 ? 'text-[#FBBA16]' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-white/40'}`}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}º`}
                      </span>
                      <ShieldSVG config={squad.shield} size={32} letter={squad.teamName[0]} />
                      <div className="flex-1">
                        <p className="text-white font-black text-sm">{squad.teamName}</p>
                        <p className="text-white/50 text-[10px]">{squad.formation} · {STRATEGIES.find(s => s.id === squad.strategy)?.label}</p>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-black ${b.border} ${b.bg} ${b.color}`}>
                        ⚡ {squad.powerScore}
                      </div>
                    </div>
                  );
                })}
                {classSquads.length === 0 && <p className="text-white/40 text-sm italic">Nenhum time criado ainda</p>}
              </div>
            </div>

            <div>
              <h3 className="text-white font-black mb-3 flex items-center gap-2"><Trophy className="h-4 w-4 text-[#FBBA16]" /> Conquistas</h3>
              {(() => {
                if (!mySquad) return <p className="text-white/40 text-sm italic">Crie seu time para desbloquear conquistas</p>;
                const myM = matches.filter(m => m.homeSquadId === mySquad.id || m.awaySquadId === mySquad.id);
                const wins = myM.filter(m => (m.homeSquadId === mySquad.id ? m.homeScore : m.awayScore) > (m.homeSquadId === mySquad.id ? m.awayScore : m.homeScore)).length;
                const achList = [
                  { icon: '🏆', label: 'Fundador',           desc: 'Criou seu time',                  done: true },
                  { icon: '⚽', label: 'Primeiro Apito',     desc: 'Simulou a primeira partida',       done: myM.length > 0 },
                  { icon: '🎯', label: 'Hat-trick',          desc: '3 vitórias',                       done: wins >= 3 },
                  { icon: '🔥', label: 'Invicto',            desc: '5 vitórias',                       done: wins >= 5 },
                  { icon: '👑', label: 'Campeão da Turma',   desc: '1º com 5+ partidas',               done: table[0]?.squad.id === mySquad.id && myM.length >= 5 },
                  { icon: '🧠', label: 'Melhor Técnico',     desc: 'Maior % de aproveitamento',        done: table.filter(r => r.J >= 1).sort((a, b) => b.pct - a.pct)[0]?.squad.id === mySquad.id },
                  { icon: '💎', label: 'Seleção dos Sonhos', desc: '11 jogadores no campo',            done: mySquad.lineup.filter(l => l.playerId).length >= 11 },
                  { icon: '⚡', label: 'Poder Máximo',       desc: 'Time com poder 95+',               done: mySquad.powerScore >= 95 },
                ];
                return (
                  <div className="grid grid-cols-2 gap-2">
                    {achList.map(a => (
                      <div key={a.label} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${a.done ? 'border-[#FBBA16]/40 bg-[#FBBA16]/10' : 'border-white/10 bg-white/5 opacity-50'}`}>
                        <span className="text-xl">{a.icon}</span>
                        <div>
                          <p className={`text-xs font-black ${a.done ? 'text-[#FBBA16]' : 'text-white/50'}`}>{a.label}</p>
                          <p className="text-[9px] text-white/40">{a.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
