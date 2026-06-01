import { useCallback, useEffect, useState } from 'react';
import { supabase as sb } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ALBUM_PLAYERS, AlbumPlayer } from '@/data/albumPlayers';

const supabase = sb as any;

// ── Types ──────────────────────────────────────────────────────────────────

export type Strategy = 'ofensiva' | 'defensiva' | 'posse' | 'contra' | 'pressao';
export type Formation = '4-4-2' | '4-3-3' | '3-5-2' | '5-3-2' | '4-2-3-1';

export interface ShieldConfig {
  shape: 'classic' | 'italian' | 'round' | 'modern' | 'oval';
  primary: string;
  secondary: string;
  division: 'solid' | 'half-v' | 'half-h' | 'quarters' | 'diagonal' | 'stripes';
  symbol: 'bolt' | 'star' | 'flame' | 'crown' | 'ball' | 'lion' | 'eagle' | 'diamond' | 'letter';
}

export interface LineupSlot {
  positionKey: string; // e.g. "GK", "DEF-1", "MID-2"
  positionLabel: string; // e.g. "GOL", "ZAG", "MEI", "ATA"
  playerId: string | null;
}

export interface Squad {
  id: string;
  userId: string;
  className: string;
  teamName: string;
  shield: ShieldConfig;
  jerseyColor: string;
  jerseyStyle: string;
  formation: Formation;
  strategy: Strategy;
  lineup: LineupSlot[];
  powerScore: number;
  createdAt: string;
  // joined
  ownerName: string;
}

export interface MatchResult {
  id: string;
  homeSquadId: string;
  awaySquadId: string;
  homeScore: number;
  awayScore: number;
  homeGoals: string[];
  awayGoals: string[];
  playedAt: string;
  // joined for display
  homeTeamName?: string;
  awayTeamName?: string;
  homeOwnerName?: string;
  awayOwnerName?: string;
}

// ── Formation layouts ──────────────────────────────────────────────────────

export const FORMATIONS: Record<Formation, { key: string; label: string; top: number; left: number }[]> = {
  '4-4-2': [
    { key: 'GK',    label: 'GOL', top: 85, left: 50 },
    { key: 'DEF-1', label: 'ZAG', top: 68, left: 20 },
    { key: 'DEF-2', label: 'ZAG', top: 68, left: 40 },
    { key: 'DEF-3', label: 'ZAG', top: 68, left: 60 },
    { key: 'DEF-4', label: 'LAT', top: 68, left: 80 },
    { key: 'MID-1', label: 'MEI', top: 48, left: 20 },
    { key: 'MID-2', label: 'MEI', top: 48, left: 40 },
    { key: 'MID-3', label: 'MEI', top: 48, left: 60 },
    { key: 'MID-4', label: 'MEI', top: 48, left: 80 },
    { key: 'ATK-1', label: 'ATA', top: 25, left: 35 },
    { key: 'ATK-2', label: 'ATA', top: 25, left: 65 },
  ],
  '4-3-3': [
    { key: 'GK',    label: 'GOL', top: 85, left: 50 },
    { key: 'DEF-1', label: 'LAT', top: 68, left: 15 },
    { key: 'DEF-2', label: 'ZAG', top: 68, left: 38 },
    { key: 'DEF-3', label: 'ZAG', top: 68, left: 62 },
    { key: 'DEF-4', label: 'LAT', top: 68, left: 85 },
    { key: 'MID-1', label: 'MEI', top: 48, left: 25 },
    { key: 'MID-2', label: 'VOL', top: 48, left: 50 },
    { key: 'MID-3', label: 'MEI', top: 48, left: 75 },
    { key: 'ATK-1', label: 'ATA', top: 22, left: 20 },
    { key: 'ATK-2', label: 'ATA', top: 18, left: 50 },
    { key: 'ATK-3', label: 'ATA', top: 22, left: 80 },
  ],
  '3-5-2': [
    { key: 'GK',    label: 'GOL', top: 85, left: 50 },
    { key: 'DEF-1', label: 'ZAG', top: 68, left: 25 },
    { key: 'DEF-2', label: 'ZAG', top: 68, left: 50 },
    { key: 'DEF-3', label: 'ZAG', top: 68, left: 75 },
    { key: 'MID-1', label: 'LAT', top: 48, left: 10 },
    { key: 'MID-2', label: 'MEI', top: 48, left: 30 },
    { key: 'MID-3', label: 'VOL', top: 48, left: 50 },
    { key: 'MID-4', label: 'MEI', top: 48, left: 70 },
    { key: 'MID-5', label: 'LAT', top: 48, left: 90 },
    { key: 'ATK-1', label: 'ATA', top: 25, left: 35 },
    { key: 'ATK-2', label: 'ATA', top: 25, left: 65 },
  ],
  '5-3-2': [
    { key: 'GK',    label: 'GOL', top: 85, left: 50 },
    { key: 'DEF-1', label: 'LAT', top: 68, left: 10 },
    { key: 'DEF-2', label: 'ZAG', top: 68, left: 28 },
    { key: 'DEF-3', label: 'ZAG', top: 68, left: 50 },
    { key: 'DEF-4', label: 'ZAG', top: 68, left: 72 },
    { key: 'DEF-5', label: 'LAT', top: 68, left: 90 },
    { key: 'MID-1', label: 'MEI', top: 45, left: 25 },
    { key: 'MID-2', label: 'VOL', top: 45, left: 50 },
    { key: 'MID-3', label: 'MEI', top: 45, left: 75 },
    { key: 'ATK-1', label: 'ATA', top: 23, left: 35 },
    { key: 'ATK-2', label: 'ATA', top: 23, left: 65 },
  ],
  '4-2-3-1': [
    { key: 'GK',    label: 'GOL', top: 85, left: 50 },
    { key: 'DEF-1', label: 'LAT', top: 70, left: 15 },
    { key: 'DEF-2', label: 'ZAG', top: 70, left: 38 },
    { key: 'DEF-3', label: 'ZAG', top: 70, left: 62 },
    { key: 'DEF-4', label: 'LAT', top: 70, left: 85 },
    { key: 'MID-1', label: 'VOL', top: 53, left: 35 },
    { key: 'MID-2', label: 'VOL', top: 53, left: 65 },
    { key: 'MID-3', label: 'MEI', top: 36, left: 20 },
    { key: 'MID-4', label: 'MEI', top: 36, left: 50 },
    { key: 'MID-5', label: 'MEI', top: 36, left: 80 },
    { key: 'ATK-1', label: 'ATA', top: 16, left: 50 },
  ],
};

// ── Power calculation ──────────────────────────────────────────────────────

const RARITY_BONUS: Record<string, number> = { legendary: 4, epic: 2, rare: 1, common: 0 };
const STRATEGY_BONUS: Record<string, Record<string, number>> = {
  ofensiva:  { defensiva: 5, posse: 3, contra: -3, pressao: 0, ofensiva: 0 },
  defensiva: { contra: 5, ofensiva: -3, posse: 0, pressao: 3, defensiva: 0 },
  posse:     { pressao: 5, contra: 3, ofensiva: 0, defensiva: -2, posse: 0 },
  contra:    { ofensiva: 3, defensiva: -5, posse: -3, pressao: 5, contra: 0 },
  pressao:   { posse: -5, defensiva: -3, contra: -5, ofensiva: 3, pressao: 0 },
};

export function calcPower(lineup: LineupSlot[], _strategy: Strategy): number {
  const players = lineup
    .filter(s => s.playerId)
    .map(s => ALBUM_PLAYERS.find(p => p.id === s.playerId))
    .filter(Boolean) as AlbumPlayer[];

  if (players.length === 0) return 0;
  const avgOverall = players.reduce((a, p) => a + p.overall, 0) / players.length;
  const rarityBonus = players.reduce((a, p) => a + (RARITY_BONUS[p.rarity] ?? 0), 0);
  return Math.min(100, Math.round(avgOverall * 0.7 + rarityBonus * 1.5 + players.length * 0.8));
}

export function powerBadge(score: number) {
  if (score >= 95) return { label: 'Diamante', color: 'text-cyan-300', bg: 'bg-cyan-500/20', border: 'border-cyan-400' };
  if (score >= 80) return { label: 'Ouro',     color: 'text-[#FBBA16]', bg: 'bg-[#FBBA16]/15', border: 'border-[#FBBA16]' };
  if (score >= 60) return { label: 'Prata',    color: 'text-gray-300', bg: 'bg-gray-400/15', border: 'border-gray-400' };
  return                  { label: 'Bronze',   color: 'text-amber-600', bg: 'bg-amber-700/15', border: 'border-amber-600' };
}

// ── Match simulation ───────────────────────────────────────────────────────

export function simulateMatch(home: Squad, away: Squad): { homeScore: number; awayScore: number; homeGoals: string[]; awayGoals: string[] } {
  const stratBonus = STRATEGY_BONUS[home.strategy]?.[away.strategy] ?? 0;
  const homePow = home.powerScore + stratBonus + (Math.random() * 20 - 10);
  const awayPow = away.powerScore - stratBonus + (Math.random() * 20 - 10);

  const total = Math.floor(Math.random() * 6) + 1; // 1-6 gols no total
  const homeScore = Math.round((homePow / (homePow + awayPow)) * total + Math.random() - 0.5);
  const awayScore = Math.max(0, total - homeScore);

  const getScorers = (squad: Squad, n: number): string[] => {
    const attackers = squad.lineup
      .filter(s => s.playerId && (s.positionLabel === 'ATA' || s.positionLabel === 'MEI'))
      .map(s => ALBUM_PLAYERS.find(p => p.id === s.playerId)?.name)
      .filter(Boolean) as string[];
    const pool = attackers.length > 0 ? attackers : [squad.teamName];
    return Array.from({ length: n }, () => pool[Math.floor(Math.random() * pool.length)]);
  };

  return {
    homeScore: Math.max(0, homeScore),
    awayScore: Math.max(0, awayScore),
    homeGoals: getScorers(home, Math.max(0, homeScore)),
    awayGoals: getScorers(away, Math.max(0, awayScore)),
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useSquad() {
  const { user, profile } = useAuth();
  const [mySquad, setMySquad]     = useState<Squad | null>(null);
  const [classSquads, setClassSquads] = useState<Squad[]>([]);
  const [matches, setMatches]     = useState<MatchResult[]>([]);
  const [loading, setLoading]     = useState(true);

  const className = profile?.class_name ?? '';

  const load = useCallback(async () => {
    if (!user || !className) { setLoading(false); return; }
    setLoading(true);
    try {
      const [{ data: squads }, { data: matchRows }] = await Promise.all([
        supabase.from('student_squads').select('*').eq('class_name', className),
        supabase.from('student_squad_matches').select('*').eq('class_name', className).order('played_at', { ascending: false }).limit(50),
      ]);

      const mapped: Squad[] = (squads ?? []).map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        className: r.class_name,
        teamName: r.team_name,
        shield: typeof r.shield_config === 'string' ? JSON.parse(r.shield_config) : (r.shield_config ?? {}),
        jerseyColor: r.jersey_color ?? '#1E9B5F',
        jerseyStyle: r.jersey_style ?? 'solid',
        formation: r.formation ?? '4-3-3',
        strategy: r.strategy ?? 'ofensiva',
        lineup: typeof r.lineup === 'string' ? JSON.parse(r.lineup) : (r.lineup ?? []),
        powerScore: r.power_score ?? 0,
        createdAt: r.created_at,
        ownerName: r.owner_name ?? '—',
      }));

      setClassSquads(mapped);
      setMySquad(mapped.find(s => s.userId === user.id) ?? null);

      const squadMap = Object.fromEntries(mapped.map(s => [s.id, s]));
      const matchMapped: MatchResult[] = (matchRows ?? []).map((r: any) => ({
        id: r.id,
        homeSquadId: r.home_squad_id,
        awaySquadId: r.away_squad_id,
        homeScore: r.home_score,
        awayScore: r.away_score,
        homeGoals: r.home_goals ?? [],
        awayGoals: r.away_goals ?? [],
        playedAt: r.played_at,
        homeTeamName: squadMap[r.home_squad_id]?.teamName ?? '—',
        awayTeamName: squadMap[r.away_squad_id]?.teamName ?? '—',
        homeOwnerName: squadMap[r.home_squad_id]?.ownerName ?? '—',
        awayOwnerName: squadMap[r.away_squad_id]?.ownerName ?? '—',
      }));
      setMatches(matchMapped);
    } catch { /* tables may not exist yet */ }
    setLoading(false);
  }, [user, className]);

  useEffect(() => { load(); }, [load]);

  const saveSquad = useCallback(async (data: {
    teamName: string; shield: ShieldConfig; jerseyColor: string; jerseyStyle: string;
    formation: Formation; strategy: Strategy; lineup: LineupSlot[];
  }): Promise<{ ok: boolean; error?: string }> => {
    if (!user || !profile) return { ok: false, error: 'Não autenticado' };
    const power = calcPower(data.lineup, data.strategy);
    const row = {
      user_id: user.id,
      class_name: className,
      owner_name: profile.full_name,
      team_name: data.teamName,
      shield_config: data.shield,
      jersey_color: data.jerseyColor,
      jersey_style: data.jerseyStyle,
      formation: data.formation,
      strategy: data.strategy,
      lineup: data.lineup,
      power_score: power,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('student_squads').upsert(row, { onConflict: 'user_id' });
    if (error) return { ok: false, error: error.message };
    await load();
    return { ok: true };
  }, [user, profile, className, load]);

  const playMatch = useCallback(async (opponentSquadId: string): Promise<MatchResult | null> => {
    if (!mySquad) return null;
    const opponent = classSquads.find(s => s.id === opponentSquadId);
    if (!opponent) return null;

    const sim = simulateMatch(mySquad, opponent);
    const row = {
      class_name: className,
      home_squad_id: mySquad.id,
      away_squad_id: opponent.id,
      home_score: sim.homeScore,
      away_score: sim.awayScore,
      home_goals: sim.homeGoals,
      away_goals: sim.awayGoals,
      played_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from('student_squad_matches').insert(row).select().single();
    if (error) return null;
    await load();
    return {
      ...sim,
      id: data.id,
      homeSquadId: mySquad.id,
      awaySquadId: opponent.id,
      playedAt: data.played_at,
      homeTeamName: mySquad.teamName,
      awayTeamName: opponent.teamName,
    };
  }, [mySquad, classSquads, className, load]);

  // Championship table
  const table = classSquads.map(squad => {
    const squadMatches = matches.filter(m => m.homeSquadId === squad.id || m.awaySquadId === squad.id);
    let W = 0, D = 0, L = 0, GF = 0, GA = 0;
    for (const m of squadMatches) {
      const isHome = m.homeSquadId === squad.id;
      const gf = isHome ? m.homeScore : m.awayScore;
      const ga = isHome ? m.awayScore : m.homeScore;
      GF += gf; GA += ga;
      if (gf > ga) W++; else if (gf === ga) D++; else L++;
    }
    const pts = W * 3 + D;
    const pct = squadMatches.length > 0 ? Math.round((pts / (squadMatches.length * 3)) * 100) : 0;
    return { squad, J: squadMatches.length, W, D, L, GF, GA, pts, pct };
  }).sort((a, b) => b.pts - a.pts || b.GF - b.GA - (a.GF - a.GA));

  return { mySquad, classSquads, matches, loading, saveSquad, playMatch, table, reload: load };
}
