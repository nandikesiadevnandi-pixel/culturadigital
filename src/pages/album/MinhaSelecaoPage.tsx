import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Swords, Trophy, Shield, Zap, Medal, ChevronRight, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useSquad, FORMATIONS, Formation, Strategy, ShieldConfig, LineupSlot, calcPower, powerBadge, simulateMatch, MatchResult } from '@/hooks/useSquad';
import { useAuth } from '@/hooks/useAuth';
import { CopaBackground } from '@/components/album/CopaBackground';
import { ShieldSVG } from '@/components/album/ShieldSVG';
import { ALBUM_PLAYERS, AlbumPlayer } from '@/data/albumPlayers';

// ── Constants ─────────────────────────────────────────────────────────────

const COLORS = ['#e63946','#457b9d','#2dc653','#f4a261','#7b2d8b','#111','#fff','#e76f51','#2196f3','#ff9800'];
const FORMATIONS_LIST: Formation[] = ['4-4-2','4-3-3','3-5-2','5-3-2','4-2-3-1'];
const STRATEGIES: { id: Strategy; icon: string; label: string; desc: string }[] = [
  { id: 'ofensiva',  icon: '⚡', label: 'Ofensiva',       desc: 'Atacar sempre, pressão máxima' },
  { id: 'defensiva', icon: '🛡️', label: 'Defensiva',      desc: 'Bloquear e explodir no contra' },
  { id: 'posse',     icon: '🎯', label: 'Posse de Bola',  desc: 'Controlar o ritmo do jogo' },
  { id: 'contra',    icon: '🚀', label: 'Contra-ataque',  desc: 'Absorver e atacar rápido' },
  { id: 'pressao',   icon: '💪', label: 'Pressão Alta',   desc: 'Não deixar o adversário respirar' },
];
const SHAPES = ['classic','italian','round','modern','oval'] as const;
const DIVISIONS = ['solid','half-v','half-h','quarters','diagonal','stripes'] as const;
const SYMBOLS = ['bolt','star','flame','crown','ball','lion','eagle','diamond','letter'] as const;

const DEFAULT_SHIELD: ShieldConfig = { shape: 'classic', primary: '#1E9B5F', secondary: '#FBBA16', division: 'half-v', symbol: 'star' };

// ── Sub-components ─────────────────────────────────────────────────────────

function flagEmoji(code: string) {
  return code.toUpperCase().split('').map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join('');
}

function MiniPlayerCard({ player }: { player: AlbumPlayer }) {
  const rarityBorder = player.rarity === 'legendary' ? 'border-[#FBBA16]'
    : player.rarity === 'epic' ? 'border-violet-400'
    : player.rarity === 'rare' ? 'border-blue-400' : 'border-gray-500';
  const rarityGlow = player.rarity === 'legendary' ? 'shadow-[0_0_8px_#FBBA16aa]'
    : player.rarity === 'epic' ? 'shadow-[0_0_8px_#a78bfa99]'
    : player.rarity === 'rare' ? 'shadow-[0_0_6px_#60a5fa88]' : '';
  const rarityStrip = player.rarity === 'legendary' ? 'bg-[#FBBA16]'
    : player.rarity === 'epic' ? 'bg-violet-500'
    : player.rarity === 'rare' ? 'bg-blue-500' : 'bg-gray-600';

  return (
    <div className={`w-11 h-[58px] rounded-lg overflow-hidden border-2 ${rarityBorder} ${rarityGlow} flex flex-col bg-gray-950 shadow-xl`}>
      {/* photo / flag */}
      <div className="flex-1 relative overflow-hidden">
        {player.photoUrl ? (
          <img src={player.photoUrl} alt={player.name}
            className="h-full w-full object-cover object-top"
            loading="lazy" />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-slate-700 to-slate-900 text-base">
            {flagEmoji(player.flagCode)}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black to-transparent" />
        {/* rarity dot */}
        <div className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${rarityStrip}`} />
      </div>
      {/* name strip */}
      <div className="bg-black/90 px-0.5 py-[2px]">
        <p className="text-[6.5px] font-black text-white text-center leading-tight truncate px-0.5 uppercase tracking-wide">
          {player.name.split(' ').pop()}
        </p>
      </div>
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
      {/* field lines */}
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
            {player && !compact ? (
              <>
                <MiniPlayerCard player={player} />
                <span className="text-[7px] bg-black/80 text-white px-1 rounded font-bold leading-tight max-w-[52px] truncate shadow">
                  {player.name.split(' ')[0]}
                </span>
              </>
            ) : (
              <>
                <div className={`rounded-full border-2 flex items-center justify-center font-black transition-all
                  ${compact ? 'w-7 h-7 text-[8px]' : 'w-9 h-9 text-[9px]'}
                  ${player ? 'bg-white/90 border-white text-gray-900' : 'bg-black/40 border-white/50 text-white group-hover:border-[#FBBA16]'}`}>
                  {player ? player.name.split(' ').pop()?.slice(0, 4) : slot.label}
                </div>
                {player && (
                  <span className="text-[7px] bg-black/70 text-white px-1 rounded font-bold leading-tight max-w-[44px] truncate">
                    {player.name.split(' ')[0]}
                  </span>
                )}
              </>
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
      {/* scoreboard */}
      <div className="text-center">
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">Resultado Final</p>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-white font-black text-base">{homeTeam}</p>
          </div>
          <div className="text-6xl font-black text-white tabular-nums">
            {result.homeScore} <span className="text-[#FBBA16]">×</span> {result.awayScore}
          </div>
          <div className="text-center">
            <p className="text-white font-black text-base">{awayTeam}</p>
          </div>
        </div>
        <p className={`mt-3 text-lg font-black ${won ? 'text-[#FBBA16]' : drew ? 'text-cyan-300' : 'text-red-400'}`}>
          {won ? '🏆 Vitória!' : drew ? '🤝 Empate!' : '😤 Derrota!'}
        </p>
      </div>

      {/* goals feed */}
      <div className="w-full max-w-sm space-y-2">
        {allGoals.slice(0, shown).map((g, i) => (
          <div key={i} className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-bold animate-in slide-in-from-bottom-2
            ${g.side === 'home' ? 'bg-[#FBBA16]/20 text-[#FBBA16] justify-start' : 'bg-white/10 text-white justify-end flex-row-reverse'}`}>
            <span>⚽</span>
            <span>{g.name}</span>
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

// ── Main Page ──────────────────────────────────────────────────────────────

type Tab = 'time' | 'campeonato' | 'rankings';

export default function MinhaSelecaoPage() {
  const { profile } = useAuth();
  const { mySquad, classSquads, matches, loading, saveSquad, playMatch, table } = useSquad();
  const [tab, setTab] = useState<Tab>('time');

  // wizard state
  const [editing, setEditing] = useState(false);
  const [wizStep, setWizStep] = useState(0);
  const [teamName, setTeamName] = useState('');
  const [shield, setShield] = useState<ShieldConfig>(DEFAULT_SHIELD);
  const [jerseyColor, setJerseyColor] = useState('#1E9B5F');
  const [jerseyStyle, setJerseyStyle] = useState<'solid'|'striped'>('solid');
  const [formation, setFormation] = useState<Formation>('4-3-3');
  const [strategy, setStrategy] = useState<Strategy>('ofensiva');
  const [lineup, setLineup] = useState<LineupSlot[]>([]);
  const [saving, setSaving] = useState(false);

  // slot picker
  const [pickerSlot, setPickerSlot] = useState<string | null>(null);

  // match
  const [simulating, setSimulating] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [matchOpp, setMatchOpp] = useState<{ home: string; away: string } | null>(null);

  // achievements
  const [newAchievement, setNewAchievement] = useState<string | null>(null);

  const slots = FORMATIONS[formation];

  // Sync lineup slots when formation changes
  useEffect(() => {
    setLineup(prev => slots.map(slot => {
      const existing = prev.find(l => l.positionKey === slot.key);
      return existing ?? { positionKey: slot.key, positionLabel: slot.label, playerId: null };
    }));
  }, [formation]);

  // Open wizard pre-filled if squad exists
  const openEdit = () => {
    if (mySquad) {
      setTeamName(mySquad.teamName);
      setShield(mySquad.shield);
      setJerseyColor(mySquad.jerseyColor);
      setJerseyStyle(mySquad.jerseyStyle as any);
      setFormation(mySquad.formation);
      setStrategy(mySquad.strategy);
      setLineup(mySquad.lineup);
    } else {
      setTeamName(''); setShield(DEFAULT_SHIELD); setJerseyColor('#1E9B5F');
      setJerseyStyle('solid'); setFormation('4-3-3'); setStrategy('ofensiva'); setLineup([]);
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
      if (!mySquad) {
        setNewAchievement('Fundador');
        setTimeout(() => setNewAchievement(null), 4000);
      }
    } else { toast.error(res.error ?? 'Erro ao salvar'); }
  };

  const handlePlayMatch = async (oppId: string) => {
    const opp = classSquads.find(s => s.id === oppId);
    if (!opp || !mySquad) return;
    setSimulating(true);
    const result = await playMatch(oppId);
    setSimulating(false);
    if (result) {
      setMatchResult(result);
      setMatchOpp({ home: mySquad.teamName, away: opp.teamName });
      if (result.homeScore > result.awayScore) {
        const myMatches = matches.filter(m => m.homeSquadId === mySquad.id || m.awaySquadId === mySquad.id);
        if (myMatches.length === 0) {
          setNewAchievement('Primeiro Apito');
          setTimeout(() => setNewAchievement(null), 4000);
        }
      }
    }
  };

  const power = calcPower(lineup, strategy);
  const badge = powerBadge(mySquad?.powerScore ?? power);

  // ── WIZARD ─────────────────────────────────────────────────────────────
  if (editing) {
    return (
      <div className="fixed inset-0 z-40 bg-black/85 flex items-center justify-center p-3 overflow-y-auto">
        <div className="w-full max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/15 shadow-2xl overflow-hidden my-4">
          {/* header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/30">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#FBBA16]" />
              <h2 className="font-black text-white">{mySquad ? 'Editar Time' : 'Criar Meu Time'}</h2>
            </div>
            <button type="button" onClick={() => setEditing(false)} className="text-white/60 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* progress */}
          <div className="flex gap-1 px-5 pt-4">
            {['Identidade','Uniforme','Formação','Escalação'].map((label, i) => (
              <div key={label} className="flex-1">
                <div className={`h-1.5 rounded-full ${i <= wizStep ? 'bg-[#FBBA16]' : 'bg-white/15'}`} />
                <p className={`text-[10px] mt-1 font-bold ${i === wizStep ? 'text-[#FBBA16]' : 'text-white/40'}`}>{label}</p>
              </div>
            ))}
          </div>

          <div className="p-5">
            {/* STEP 0 — Identidade */}
            {wizStep === 0 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-white/70 mb-1 block">Nome do Time</label>
                  <input value={teamName} onChange={e => setTeamName(e.target.value.slice(0,25))}
                    placeholder="Ex: Canela Tech FC" maxLength={25}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 outline-none focus:border-[#FBBA16]" />
                  <p className="text-[10px] text-white/30 mt-1">{teamName.length}/25</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-white/70 mb-2 block">Escudo</label>
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <ShieldSVG config={shield} size={80} letter={teamName[0] ?? 'T'} />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-[10px] text-white/50 mb-1">Formato</p>
                        <div className="flex gap-1 flex-wrap">
                          {SHAPES.map(s => (
                            <button key={s} type="button" onClick={() => setShield(p => ({...p, shape: s}))}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${shield.shape === s ? 'border-[#FBBA16] text-[#FBBA16] bg-[#FBBA16]/10' : 'border-white/20 text-white/60 hover:border-white/40'}`}>
                              {s === 'classic' ? 'Clássico' : s === 'italian' ? 'Italiano' : s === 'round' ? 'Redondo' : s === 'modern' ? 'Moderno' : 'Oval'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] text-white/50 mb-1">Cor primária</p>
                          <div className="flex flex-wrap gap-1">
                            {COLORS.map(c => (
                              <button key={c} type="button" onClick={() => setShield(p => ({...p, primary: c}))}
                                className={`w-6 h-6 rounded-md border-2 ${shield.primary === c ? 'border-white scale-110' : 'border-white/20'}`}
                                style={{ backgroundColor: c }} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/50 mb-1">Cor secundária</p>
                          <div className="flex flex-wrap gap-1">
                            {COLORS.map(c => (
                              <button key={c} type="button" onClick={() => setShield(p => ({...p, secondary: c}))}
                                className={`w-6 h-6 rounded-md border-2 ${shield.secondary === c ? 'border-white scale-110' : 'border-white/20'}`}
                                style={{ backgroundColor: c }} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50 mb-1">Divisão</p>
                        <div className="flex gap-1 flex-wrap">
                          {DIVISIONS.map(d => (
                            <button key={d} type="button" onClick={() => setShield(p => ({...p, division: d}))}
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
                            <button key={sym} type="button" onClick={() => setShield(p => ({...p, symbol: sym}))}
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

            {/* STEP 1 — Uniforme */}
            {wizStep === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-white/70 mb-2 block">Cor da Camisa</label>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map(c => (
                      <button key={c} type="button" onClick={() => setJerseyColor(c)}
                        className={`w-10 h-10 rounded-xl border-2 transition-all ${jerseyColor === c ? 'border-white scale-110' : 'border-white/20'}`}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-white/70 mb-2 block">Estilo</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{id:'solid',label:'Lisa'},{id:'striped',label:'Listrada'}].map(s => (
                      <button key={s.id} type="button" onClick={() => setJerseyStyle(s.id as any)}
                        className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${jerseyStyle === s.id ? 'border-[#FBBA16] bg-[#FBBA16]/10 text-[#FBBA16]' : 'border-white/20 text-white hover:border-white/40'}`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* jersey preview */}
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

            {/* STEP 2 — Formação & Estratégia */}
            {wizStep === 2 && (
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

            {/* STEP 3 — Escalação */}
            {wizStep === 3 && (
              <div className="grid md:grid-cols-2 gap-4">
                <FieldView slots={slots} lineup={lineup} onSlotClick={setPickerSlot} />
                <div>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border mb-3 ${powerBadge(power).border} ${powerBadge(power).bg}`}>
                    <Zap className={`h-4 w-4 ${powerBadge(power).color}`} />
                    <span className={`font-black text-sm ${powerBadge(power).color}`}>Poder: {power} — {powerBadge(power).label}</span>
                  </div>
                  <p className="text-[11px] text-white/60 mb-3">Clique em uma posição no campo para escalar um jogador</p>
                  <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                    {lineup.map(slot => {
                      const p = slot.playerId ? ALBUM_PLAYERS.find(x => x.id === slot.playerId) : null;
                      return (
                        <button key={slot.positionKey} type="button" onClick={() => setPickerSlot(slot.positionKey)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left">
                          <span className="text-[10px] font-black text-white/50 w-6">{slot.positionLabel}</span>
                          {p ? (
                            <>
                              <span className="text-xs font-bold text-white flex-1 truncate">{p.name}</span>
                              <span className="text-[9px] text-white/50">{p.overall}</span>
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
            <button type="button" onClick={() => setWizStep(s => Math.max(0, s-1))} disabled={wizStep===0}
              className="px-4 py-2 rounded-xl text-white/60 hover:text-white disabled:opacity-30 text-sm font-bold flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
            {wizStep < 3 ? (
              <button type="button" onClick={() => setWizStep(s => s+1)}
                disabled={wizStep===0 && !teamName.trim()}
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

        {/* Player picker modal */}
        {pickerSlot && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center" onClick={() => setPickerSlot(null)}>
            <div className="w-full max-w-lg bg-slate-900 rounded-t-3xl border-t border-white/15 p-4 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-black">Escolher Jogador — {slots.find(s => s.key === pickerSlot)?.label}</p>
                <button onClick={() => setPickerSlot(null)} className="text-white/60 hover:text-white"><X className="h-4 w-4" /></button>
              </div>
              {/* clear option */}
              <button type="button" onClick={() => {
                setLineup(prev => prev.map(l => l.positionKey === pickerSlot ? {...l, playerId: null} : l));
                setPickerSlot(null);
              }} className="w-full mb-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold text-left">
                ✕ Remover jogador desta posição
              </button>
              <div className="space-y-1">
                {ALBUM_PLAYERS.map(p => {
                  const alreadyUsed = lineup.some(l => l.playerId === p.id && l.positionKey !== pickerSlot);
                  return (
                    <button key={p.id} type="button" disabled={alreadyUsed}
                      onClick={() => {
                        setLineup(prev => prev.map(l => l.positionKey === pickerSlot ? {...l, playerId: p.id} : l));
                        setPickerSlot(null);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${alreadyUsed ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'}`}>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-white/10 text-white/70">{p.position}</span>
                      <span className="text-sm font-bold text-white flex-1 truncate">{p.name}</span>
                      <span className="text-[10px] text-white/50">{p.country}</span>
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${p.rarity === 'legendary' ? 'bg-[#FBBA16]/20 text-[#FBBA16]' : p.rarity === 'epic' ? 'bg-violet-500/20 text-violet-300' : p.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-white/50'}`}>
                        {p.overall}
                      </span>
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

  // ── MATCH ANIMATION ──────────────────────────────────────────────────────
  if (matchResult && matchOpp) {
    return <MatchAnim result={matchResult} homeTeam={matchOpp.home} awayTeam={matchOpp.away}
      onClose={() => { setMatchResult(null); setMatchOpp(null); setTab('campeonato'); }} />;
  }

  // ── MAIN PAGE ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-x-hidden">
      <CopaBackground />
      {/* Achievement pop */}
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

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/10 rounded-2xl mb-6 border border-white/10">
          {([['time','🛡️ Meu Time'],['campeonato','🏆 Campeonato'],['rankings','🥇 Rankings']] as [Tab, string][]).map(([t, label]) => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${tab === t ? 'bg-[#FBBA16] text-gray-900' : 'text-white/70 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* ── TAB: MEU TIME ─────────────────────────────────────────────── */}
        {tab === 'time' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-white/50 text-center py-16">Carregando…</div>
            ) : !mySquad ? (
              <div className="text-center py-16 rounded-2xl border border-white/15 bg-white/5">
                <div className="text-5xl mb-3">⚽</div>
                <h2 className="text-white font-black text-xl mb-1">Cria teu time!</h2>
                <p className="text-white/60 text-sm mb-6">Monte seu clube, escolha a formação e desafie a turma</p>
                <button type="button" onClick={openEdit}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#FBBA16] to-[#F59E0B] text-gray-900 font-black inline-flex items-center gap-2 shadow-lg">
                  <Shield className="h-5 w-5" /> Criar Meu Time
                </button>
              </div>
            ) : (
              <>
                {/* Team card */}
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
                  {/* field preview */}
                  <div className="mt-4 max-w-[200px] mx-auto">
                    <FieldView slots={FORMATIONS[mySquad.formation]} lineup={mySquad.lineup} compact />
                  </div>
                </div>

                {/* Match stats */}
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

                {/* Desafiar */}
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
                            <button type="button" onClick={() => handlePlayMatch(opp.id)} disabled={simulating}
                              className="px-3 py-1.5 rounded-lg bg-[#FBBA16] text-gray-900 font-black text-xs disabled:opacity-50 flex items-center gap-1">
                              <Swords className="h-3 w-3" /> {simulating ? '…' : 'Desafiar'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Últimas partidas */}
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

        {/* ── TAB: CAMPEONATO ──────────────────────────────────────────── */}
        {tab === 'campeonato' && (
          <div>
            <h2 className="text-white font-black text-lg mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#FBBA16]" /> Tabela da Turma {profile?.class_name}
            </h2>
            {table.length === 0 ? (
              <p className="text-white/40 text-sm italic text-center py-12">Nenhum time na turma ainda. Crie o seu!</p>
            ) : (
              <div className="rounded-2xl border border-white/15 overflow-hidden">
                <div className="grid grid-cols-[2rem_1fr_auto_auto_auto_auto_auto_auto_auto] gap-0 text-[10px] font-black text-white/50 uppercase px-3 py-2 bg-white/5 border-b border-white/10">
                  <span>#</span><span>Time</span><span className="text-center px-2">J</span><span className="text-center px-2">V</span>
                  <span className="text-center px-2">E</span><span className="text-center px-2">D</span>
                  <span className="text-center px-2">GF</span><span className="text-center px-2">GC</span>
                  <span className="text-center px-2">PTS</span>
                </div>
                {table.map((row, i) => {
                  const isMe = row.squad.userId === profile?.user_id;
                  return (
                    <div key={row.squad.id}
                      className={`grid grid-cols-[2rem_1fr_auto_auto_auto_auto_auto_auto_auto] gap-0 items-center px-3 py-3 border-b border-white/5 last:border-0 ${isMe ? 'bg-[#FBBA16]/10 border-[#FBBA16]/20' : 'hover:bg-white/5'}`}>
                      <span className={`font-black text-sm ${i === 0 ? 'text-[#FBBA16]' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-white/40'}`}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}`}
                      </span>
                      <div className="flex items-center gap-2 min-w-0">
                        <ShieldSVG config={row.squad.shield} size={24} letter={row.squad.teamName[0]} />
                        <div className="min-w-0">
                          <p className={`font-black text-xs truncate ${isMe ? 'text-[#FBBA16]' : 'text-white'}`}>{row.squad.teamName}</p>
                          <p className="text-[9px] text-white/40 truncate">{row.squad.ownerName}</p>
                        </div>
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
        )}

        {/* ── TAB: RANKINGS ───────────────────────────────────────────── */}
        {tab === 'rankings' && (
          <div className="space-y-6">
            {/* Melhor Técnico */}
            <div>
              <h3 className="text-white font-black mb-3 flex items-center gap-2"><Medal className="h-4 w-4 text-[#FBBA16]" /> Melhor Técnico</h3>
              <div className="space-y-2">
                {table.filter(r => r.J >= 1).sort((a, b) => b.pct - a.pct).map((row, i) => (
                  <div key={row.squad.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <span className={`font-black text-sm w-6 text-center ${i === 0 ? 'text-[#FBBA16]' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-white/40'}`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}º`}
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

            {/* Seleção mais forte */}
            <div>
              <h3 className="text-white font-black mb-3 flex items-center gap-2"><Zap className="h-4 w-4 text-cyan-300" /> Seleção Mais Forte</h3>
              <div className="space-y-2">
                {[...classSquads].sort((a, b) => b.powerScore - a.powerScore).map((squad, i) => {
                  const b = powerBadge(squad.powerScore);
                  return (
                    <div key={squad.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                      <span className={`font-black text-sm w-6 text-center ${i === 0 ? 'text-[#FBBA16]' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-white/40'}`}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}º`}
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

            {/* Conquistas */}
            <div>
              <h3 className="text-white font-black mb-3 flex items-center gap-2"><Trophy className="h-4 w-4 text-[#FBBA16]" /> Conquistas</h3>
              {(() => {
                if (!mySquad) return <p className="text-white/40 text-sm italic">Crie seu time para desbloquear conquistas</p>;
                const myM = matches.filter(m => m.homeSquadId === mySquad.id || m.awaySquadId === mySquad.id);
                const wins = myM.filter(m => (m.homeSquadId === mySquad.id ? m.homeScore : m.awayScore) > (m.homeSquadId === mySquad.id ? m.awayScore : m.homeScore)).length;
                const achList = [
                  { icon:'🏆', label:'Fundador',          desc:'Criou seu time',                   done: true },
                  { icon:'⚽', label:'Primeiro Apito',    desc:'Simulou a primeira partida',        done: myM.length > 0 },
                  { icon:'🎯', label:'Hat-trick',         desc:'3 vitórias seguidas',               done: wins >= 3 },
                  { icon:'🔥', label:'Invicto',           desc:'5 vitórias consecutivas',           done: wins >= 5 },
                  { icon:'👑', label:'Campeão da Turma',  desc:'1º na tabela com 5+ partidas',      done: table[0]?.squad.id === mySquad.id && myM.length >= 5 },
                  { icon:'🧠', label:'Melhor Técnico',    desc:'Maior % de aproveitamento',         done: table.filter(r=>r.J>=1).sort((a,b)=>b.pct-a.pct)[0]?.squad.id === mySquad.id },
                  { icon:'💎', label:'Seleção dos Sonhos',desc:'11 jogadores no campo',             done: mySquad.lineup.filter(l=>l.playerId).length >= 11 },
                  { icon:'⚡', label:'Poder Máximo',      desc:'Time com poder 95+',                done: mySquad.powerScore >= 95 },
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
