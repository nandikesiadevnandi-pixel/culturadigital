import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAlbum } from '@/hooks/useAlbum';
import { supabase as supabaseTyped } from '@/integrations/supabase/client';
import { getPlayerById, getFallbackAvatar, RARITY_CONFIG } from '@/data/albumPlayers';
import { CopaBackground } from '@/components/album/CopaBackground';
import { toast } from 'sonner';
import { ArrowLeft, Trophy, Clock, Zap, Star, Users } from 'lucide-react';

const supabase = supabaseTyped as any;

// ─── Types ─────────────────────────────────────────────────────

interface CardBet { id: string; name: string; rarity: string }

interface BafoMatch {
  id: string;
  className: string;
  challengerId: string;
  challengedId: string;
  challengerName: string;
  challengedName: string;
  challengerCards: CardBet[];
  challengedCards: CardBet[];
  challengerPower: number | null;
  challengedPower: number | null;
  winnerId: string | null;
  winnerName: string | null;
  status: 'pending' | 'accepted' | 'betting' | 'playing' | 'finished' | 'declined' | 'cancelled';
  updatedAt: string;
}

interface BafoRanking {
  userId: string;
  playerName: string;
  wins: number;
  losses: number;
  cardsWon: number;
  streak: number;
}

type Screen = 'lobby' | 'betting' | 'countdown' | 'playing' | 'waiting' | 'result';

// ─── Helpers ───────────────────────────────────────────────────

function mapMatch(r: Record<string, unknown>): BafoMatch {
  return {
    id: String(r.id),
    className: String(r.class_name ?? ''),
    challengerId: String(r.challenger_id),
    challengedId: String(r.challenged_id),
    challengerName: String(r.challenger_name ?? ''),
    challengedName: String(r.challenged_name ?? ''),
    challengerCards: (r.challenger_cards as CardBet[]) ?? [],
    challengedCards: (r.challenged_cards as CardBet[]) ?? [],
    challengerPower: r.challenger_power != null ? Number(r.challenger_power) : null,
    challengedPower: r.challenged_power != null ? Number(r.challenged_power) : null,
    winnerId: r.winner_id ? String(r.winner_id) : null,
    winnerName: r.winner_name ? String(r.winner_name) : null,
    status: String(r.status) as BafoMatch['status'],
    updatedAt: String(r.updated_at ?? ''),
  };
}

function rarityStyle(rarity: string) {
  switch (rarity) {
    case 'legendary': return 'border-yellow-400/70 shadow-yellow-400/60 bg-gradient-to-b from-yellow-900/50 to-amber-950/60';
    case 'epic':      return 'border-violet-400/70 shadow-violet-500/60 bg-gradient-to-b from-violet-900/50 to-purple-950/60';
    case 'rare':      return 'border-blue-400/60 shadow-blue-400/40 bg-gradient-to-b from-blue-900/40 to-blue-950/60';
    default:          return 'border-gray-500/40 shadow-gray-400/20 bg-gradient-to-b from-gray-800/40 to-gray-900/60';
  }
}

function powerLabel(v: number) {
  if (v >= 85) return '🔥 PERFEITO!';
  if (v >= 65) return '⚡ Muito Bom!';
  if (v >= 45) return '👍 Ok!';
  if (v >= 25) return '😐 Fraco';
  return '😢 Missão';
}

function powerColor(v: number) {
  if (v >= 70) return '#22c55e';
  if (v >= 45) return '#eab308';
  return '#ef4444';
}

// ─── Mini Card ─────────────────────────────────────────────────

function MiniCard({ cardId, selected, available, onClick }: {
  cardId: string; selected?: boolean; available?: number; onClick?: () => void;
}) {
  const player = getPlayerById(cardId);
  if (!player) return null;
  const rc = RARITY_CONFIG[player.rarity];
  const photo = player.photoUrl ?? getFallbackAvatar(player);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center rounded-xl border-2 overflow-hidden transition-all duration-150 cursor-pointer shadow-lg
        ${rarityStyle(player.rarity)}
        ${selected ? 'scale-110 ring-2 ring-white/80 shadow-xl' : 'hover:scale-105 opacity-90 hover:opacity-100'}
        w-[72px] h-[100px]`}
    >
      <div className="w-full h-[62px] overflow-hidden">
        <img
          src={photo} alt={player.name}
          className="w-full h-full object-cover object-top"
          onError={e => { (e.target as HTMLImageElement).src = getFallbackAvatar(player); }}
        />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-0.5 pb-0.5 w-full">
        <span className="text-[8px] font-black text-white text-center leading-tight line-clamp-2 w-full px-0.5">
          {player.name}
        </span>
        <span className={`text-[7px] font-bold ${rc.text}`}>{rc.label}</span>
      </div>
      {selected && (
        <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center z-10">
          <span className="text-[8px] text-black font-black">✓</span>
        </div>
      )}
      {available != null && available > 0 && (
        <div className="absolute bottom-0.5 right-0.5 bg-blue-600 text-white text-[7px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center">
          {available}
        </div>
      )}
    </button>
  );
}

// ─── Betting Card (larger, for stakes display) ─────────────────

function StakeCard({ card, faded }: { card: CardBet; faded?: boolean }) {
  const player = getPlayerById(card.id);
  if (!player) return null;
  const photo = player.photoUrl ?? getFallbackAvatar(player);
  return (
    <div className={`relative rounded-xl border-2 overflow-hidden shadow-lg w-16 h-[90px] transition-all
      ${rarityStyle(card.rarity)} ${faded ? 'opacity-50 grayscale' : 'animate-bounce'}`}
      style={{ animationDuration: '1.2s' }}
    >
      <div className="w-full h-[62px] overflow-hidden">
        <img src={photo} alt={card.name} className="w-full h-full object-cover object-top"
          onError={e => { if (player) (e.target as HTMLImageElement).src = getFallbackAvatar(player); }} />
      </div>
      <div className="flex items-center justify-center px-0.5 py-0.5">
        <span className="text-[7px] font-black text-white text-center leading-tight line-clamp-2">{card.name}</span>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────

export default function ArenaDobafoPage() {
  const { user, profile } = useAuth();
  const album = useAlbum();

  const [screen, setScreenState]              = useState<Screen>('lobby');
  const [activeMatch, setActiveMatch]         = useState<BafoMatch | null>(null);
  const [onlineUsers, setOnlineUsers]         = useState<{ id: string; name: string }[]>([]);
  const [rankings, setRankings]               = useState<BafoRanking[]>([]);
  const [recentMatches, setRecentMatches]     = useState<BafoMatch[]>([]);
  const [selectedCards, setSelectedCards]     = useState<string[]>([]);
  const [powerDisplay, setPowerDisplay]       = useState(50);
  const [myPower, setMyPower]                 = useState<number | null>(null);
  const [countdownNum, setCountdownNum]       = useState(3);
  const [incomingChallenge, setIncomingChallenge] = useState<BafoMatch | null>(null);
  const [bettingSubmitted, setBettingSubmitted]   = useState(false);

  const presenceCh  = useRef<any>(null);
  const matchCh     = useRef<any>(null);
  const animId      = useRef<number | null>(null);
  const powerRef    = useRef(50);
  const startTime   = useRef(0);
  const pollRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Guards to prevent duplicate state transitions ──
  const screenRef            = useRef<Screen>('lobby');
  const countdownFiredRef    = useRef(false);
  const hasFinalizedRef      = useRef(false);
  const bettingSubmittedRef  = useRef(false);

  // Wrapper so all setScreen calls keep screenRef in sync
  const setScreen = useCallback((s: Screen) => {
    screenRef.current = s;
    setScreenState(s);
  }, []);

  const className = profile?.class_name ?? '';
  const userName  = profile?.full_name ?? '';

  // ── Duplicates available for betting ──
  const myDuplicates = useMemo(() =>
    album.inventory
      .filter(e => e.quantity > 1)
      .map(e => {
        const p = getPlayerById(e.cardId);
        return p ? { ...p, available: e.quantity - 1 } : null;
      })
      .filter(Boolean)
      .sort((a, b) => (b!.overall ?? 0) - (a!.overall ?? 0)) as
        (NonNullable<ReturnType<typeof getPlayerById>> & { available: number })[],
    [album.inventory]
  );

  // ── Load lobby data (rankings + recent matches) ──
  const loadLobbyData = useCallback(async () => {
    if (!className) return;
    const [rankRes, matchRes] = await Promise.all([
      supabase.from('bafo_rankings').select('*')
        .eq('class_name', className).order('wins', { ascending: false }).limit(10),
      supabase.from('bafo_matches').select('*')
        .eq('class_name', className).eq('status', 'finished')
        .order('updated_at', { ascending: false }).limit(8),
    ]);
    if (rankRes.data) {
      setRankings(rankRes.data.map((r: Record<string, unknown>) => ({
        userId: String(r.user_id), playerName: String(r.player_name),
        wins: Number(r.wins), losses: Number(r.losses),
        cardsWon: Number(r.cards_won), streak: Number(r.streak),
      })));
    }
    if (matchRes.data) setRecentMatches(matchRes.data.map(mapMatch));
  }, [className]);

  // ── Check for pending challenges on mount ──
  const checkPendingChallenge = useCallback(async () => {
    if (!user || !className) return;
    const { data } = await supabase.from('bafo_matches').select('*')
      .eq('challenged_id', user.id).eq('class_name', className).eq('status', 'pending')
      .order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (data) setIncomingChallenge(mapMatch(data));
  }, [user, className]);

  useEffect(() => {
    loadLobbyData();
    checkPendingChallenge();
  }, [loadLobbyData, checkPendingChallenge]);

  // ── Presence: who's online ──
  useEffect(() => {
    if (!user || !className) return;
    const ch = supabase.channel(`bafo:presence:${className}`, {
      config: { presence: { key: user.id } },
    });
    ch
      .on('presence', { event: 'sync' }, () => {
        const state = ch.presenceState() as Record<string, any[]>;
        const players = Object.values(state)
          .flatMap(s => s)
          .map((s: any) => ({ id: String(s.userId), name: String(s.name) }))
          .filter(p => p.id !== user.id);
        setOnlineUsers(players);
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await ch.track({ userId: user.id, name: userName });
        }
      });
    presenceCh.current = ch;
    return () => { ch.unsubscribe(); };
  }, [user, className, userName]);

  // ── Power bar animation ──
  const startPowerBar = useCallback(() => {
    startTime.current = Date.now();
    const tick = () => {
      const t = (Date.now() - startTime.current) / 1000;
      const speed = 1.3 + Math.min(t * 0.12, 0.7);
      const v = 50 + 48 * Math.sin(t * Math.PI * speed);
      powerRef.current = v;
      setPowerDisplay(v);
      animId.current = requestAnimationFrame(tick);
    };
    animId.current = requestAnimationFrame(tick);
  }, []);

  const stopPowerBar = useCallback(() => {
    if (animId.current) { cancelAnimationFrame(animId.current); animId.current = null; }
  }, []);

  const clearPoll = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  // ── Countdown then power bar — guarded against double-fire ──
  const triggerCountdown = useCallback((m: BafoMatch) => {
    // FIX: Prevent double countdown from poll + realtime both firing
    if (countdownFiredRef.current) return;
    countdownFiredRef.current = true;

    setMyPower(null);
    setScreen('countdown');
    setCountdownNum(3);
    let n = 3;
    const iv = setInterval(() => {
      n--;
      if (n <= 0) {
        clearInterval(iv);
        setActiveMatch(m);
        setScreen('playing');
        startPowerBar();
      } else {
        setCountdownNum(n);
      }
    }, 900);
  }, [startPowerBar, setScreen]);

  // ── Realtime: match updates ──
  useEffect(() => {
    if (!user || !className) return;
    const ch = supabase.channel(`bafo:matches:${user.id}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bafo_matches', filter: `class_name=eq.${className}` },
        (payload: any) => {
          const m = mapMatch(payload.new);
          if (m.challengedId === user.id && m.status === 'pending') {
            setIncomingChallenge(m);
          }
        })
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'bafo_matches', filter: `class_name=eq.${className}` },
        (payload: any) => {
          const m = mapMatch(payload.new);
          if (m.challengerId !== user.id && m.challengedId !== user.id) return;
          setActiveMatch(m);
          handleExternalUpdate(m);
        })
      .subscribe();
    matchCh.current = ch;
    return () => { ch.unsubscribe(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, className]);

  // Handle external (opponent-driven) state transitions
  const handleExternalUpdate = useCallback((m: BafoMatch) => {
    if (m.status === 'betting') {
      // FIX: Don't reset betting state if player is already in betting flow
      // (challenger goes to 'waiting' first, so screenRef will be 'waiting' or 'lobby').
      // Skip reset only if already on 'betting' screen OR already submitted bet ('waiting').
      const cur = screenRef.current;
      if (cur === 'betting' || (cur === 'waiting' && bettingSubmittedRef.current)) return;
      setScreen('betting');
      setBettingSubmitted(false);
      bettingSubmittedRef.current = false;
      setSelectedCards([]);
    }
    if (m.status === 'playing') {
      // FIX: Clear poll before triggering countdown; triggerCountdown itself guards against double-fire
      clearPoll();
      triggerCountdown(m);
    }
    if (m.status === 'finished') {
      stopPowerBar();
      clearPoll();
      // FIX: Run finalizeMatch on the OTHER side too (loser) so inventory + ranking sync.
      // The challenger flips status to 'finished' which fires this UPDATE on the loser
      // before their own poll catches bothPlayed — without this, the loser keeps their cards.
      if (!hasFinalizedRef.current && m.challengerPower !== null && m.challengedPower !== null) {
        finalizeMatch(m);
        return;
      }
      if (screenRef.current !== 'result') {
        setScreen('result');
        loadLobbyData();
        album.reload();
      }
    }
    if (m.status === 'declined' || m.status === 'cancelled') {
      toast.error('O desafio foi recusado.');
      setScreen('lobby');
      setActiveMatch(null);
    }
  }, [clearPoll, stopPowerBar, triggerCountdown, loadLobbyData, album, setScreen]);


  // ── Challenge a player ──
  const challengePlayer = useCallback(async (targetId: string, targetName: string) => {
    if (!user) return;
    if (myDuplicates.length === 0) {
      toast.error('Você precisa de figurinhas repetidas para jogar!');
      return;
    }
    const { data, error } = await supabase.from('bafo_matches').insert({
      class_name: className,
      challenger_id: user.id,
      challenged_id: targetId,
      challenger_name: userName,
      challenged_name: targetName,
      status: 'pending',
    }).select().single();
    if (error) { toast.error('Erro ao desafiar. Tente novamente.'); return; }
    const m = mapMatch(data as Record<string, unknown>);
    setActiveMatch(m);
    setBettingSubmitted(false);
    bettingSubmittedRef.current = false;
    setSelectedCards([]);
    countdownFiredRef.current = false;
    hasFinalizedRef.current = false;
    // FIX: Wait for opponent to accept before showing betting screen
    setScreen('waiting');
    toast.success(`Desafio enviado para ${targetName}! Aguardando resposta...`);
  }, [user, className, userName, myDuplicates, setScreen]);

  // ── Cancel a pending challenge (challenger only) ──
  const cancelChallenge = useCallback(async () => {
    if (!activeMatch) return;
    await supabase.from('bafo_matches').update({ status: 'cancelled' }).eq('id', activeMatch.id);
    setScreen('lobby');
    setActiveMatch(null);
    toast('Desafio cancelado.');
  }, [activeMatch, setScreen]);

  // ── Accept or decline incoming challenge ──
  const respondChallenge = useCallback(async (m: BafoMatch, accept: boolean) => {
    if (!accept) {
      await supabase.from('bafo_matches').update({ status: 'declined' }).eq('id', m.id);
      setIncomingChallenge(null);
      toast('Desafio recusado.');
      return;
    }
    const { data } = await supabase.from('bafo_matches')
      .update({ status: 'betting' }).eq('id', m.id).select().single();
    if (data) {
      const updated = mapMatch(data as Record<string, unknown>);
      setActiveMatch(updated);
      setIncomingChallenge(null);
      setBettingSubmitted(false);
      bettingSubmittedRef.current = false;
      setSelectedCards([]);
      countdownFiredRef.current = false;
      hasFinalizedRef.current = false;
      setScreen('betting');
    }
  }, [setScreen]);

  // ── Submit bet cards ──
  const submitBet = useCallback(async () => {
    if (!activeMatch || !user) return;
    if (selectedCards.length === 0) { toast.error('Selecione pelo menos 1 figurinha!'); return; }

    const cards: CardBet[] = selectedCards.map(id => {
      const p = getPlayerById(id);
      return { id, name: p?.name ?? id, rarity: p?.rarity ?? 'common' };
    });

    const isChallenger = user.id === activeMatch.challengerId;
    const field = isChallenger ? 'challenger_cards' : 'challenged_cards';
    const { data } = await supabase.from('bafo_matches')
      .update({ [field]: cards }).eq('id', activeMatch.id).select().single();

    if (!data) { toast.error('Erro ao salvar aposta.'); return; }

    const updated = mapMatch(data as Record<string, unknown>);
    setActiveMatch(updated);
    setBettingSubmitted(true);
    bettingSubmittedRef.current = true;

    // If both sides have cards → start game
    const bothReady = updated.challengerCards.length > 0 && updated.challengedCards.length > 0;
    if (bothReady) {
      await supabase.from('bafo_matches').update({ status: 'playing' }).eq('id', activeMatch.id);
      // triggerCountdown is guarded; realtime will also fire but won't double-trigger
      triggerCountdown(updated);
    } else {
      setScreen('waiting');
      toast.success('Aposta confirmada! Aguardando adversário escolher...');
      // Poll as backup in case realtime update is missed
      pollRef.current = setInterval(async () => {
        const { data: d } = await supabase.from('bafo_matches').select('*').eq('id', activeMatch.id).single();
        if (!d) return;
        const m2 = mapMatch(d as Record<string, unknown>);
        if (m2.status === 'playing') {
          clearPoll();
          triggerCountdown(m2);
        } else if (m2.challengerCards.length > 0 && m2.challengedCards.length > 0) {
          clearPoll();
          await supabase.from('bafo_matches').update({ status: 'playing' }).eq('id', activeMatch.id);
          triggerCountdown(m2);
        }
      }, 2000);
      setTimeout(() => clearPoll(), 180_000);
    }
  }, [activeMatch, user, selectedCards, triggerCountdown, clearPoll, setScreen]);

  // ── Click the power bar ──
  const handleBafo = useCallback(async () => {
    if (myPower !== null || !activeMatch || !user) return;
    stopPowerBar();
    const power = Math.round(powerRef.current);
    setMyPower(power);

    const isChallenger = user.id === activeMatch.challengerId;
    const field = isChallenger ? 'challenger_power' : 'challenged_power';
    const { data } = await supabase.from('bafo_matches')
      .update({ [field]: power }).eq('id', activeMatch.id).select().single();

    if (!data) { toast.error('Erro ao registrar bafo.'); return; }
    const updated = mapMatch(data as Record<string, unknown>);
    setActiveMatch(updated);

    const bothPlayed = updated.challengerPower !== null && updated.challengedPower !== null;
    if (bothPlayed) {
      await finalizeMatch(updated);
    } else {
      setScreen('waiting');
      // Poll until opponent plays (backup for missed realtime)
      pollRef.current = setInterval(async () => {
        const { data: d } = await supabase.from('bafo_matches').select('*').eq('id', activeMatch.id).single();
        if (!d) return;
        const m2 = mapMatch(d as Record<string, unknown>);
        if (m2.status === 'finished') {
          clearPoll();
          setActiveMatch(m2);
          if (screenRef.current !== 'result') {
            setScreen('result');
            loadLobbyData();
            album.reload();
          }
        } else if (m2.challengerPower !== null && m2.challengedPower !== null) {
          clearPoll();
          finalizeMatch(m2);
        }
      }, 1500);
      setTimeout(() => clearPoll(), 60_000);
    }
  }, [myPower, activeMatch, user, stopPowerBar, clearPoll, loadLobbyData, setScreen]);

  // ── Determine winner + transfer cards — guarded against double-finalize ──
  const finalizeMatch = useCallback(async (m: BafoMatch) => {
    // FIX: Prevent double-finalization from poll + realtime
    if (hasFinalizedRef.current) return;
    hasFinalizedRef.current = true;

    if (m.challengerPower === null || m.challengedPower === null) return;
    const challengerWins = m.challengerPower >= m.challengedPower;
    const winnerId   = challengerWins ? m.challengerId   : m.challengedId;
    const winnerName = challengerWins ? m.challengerName : m.challengedName;
    const loserId    = challengerWins ? m.challengedId   : m.challengerId;
    const allCards   = [...m.challengerCards, ...m.challengedCards];
    const loserCards = challengerWins ? m.challengedCards : m.challengerCards;

    // Only challenger writes 'finished' (prevents double-write with .eq status guard)
    if (user?.id === m.challengerId) {
      await supabase.from('bafo_matches')
        .update({ status: 'finished', winner_id: winnerId, winner_name: winnerName })
        .eq('id', m.id).eq('status', 'playing');
    }

    const iAmWinner = user?.id === winnerId;
    const iAmLoser  = user?.id === loserId;

    // Winner receives all cards
    if (iAmWinner) {
      for (const card of allCards) {
        const existing = album.inventory.find(e => e.cardId === card.id);
        await supabase.from('album_inventory').upsert(
          { user_id: winnerId, card_id: card.id, quantity: (existing?.quantity ?? 0) + 1 },
          { onConflict: 'user_id,card_id' },
        );
      }
    }

    // Loser loses their wagered cards
    if (iAmLoser) {
      for (const card of loserCards) {
        const existing = album.inventory.find(e => e.cardId === card.id);
        const newQty = (existing?.quantity ?? 1) - 1;
        if (newQty <= 0) {
          await supabase.from('album_inventory').delete().eq('user_id', loserId).eq('card_id', card.id);
        } else {
          await supabase.from('album_inventory').update({ quantity: newQty }).eq('user_id', loserId).eq('card_id', card.id);
        }
      }
    }

    // Update my ranking row
    if (user) {
      const myOldRank = rankings.find(r => r.userId === user.id);
      const newWins  = (myOldRank?.wins  ?? 0) + (iAmWinner ? 1 : 0);
      const newLoss  = (myOldRank?.losses ?? 0) + (iAmLoser  ? 1 : 0);
      const newStreak = iAmWinner ? (myOldRank?.streak ?? 0) + 1 : 0;
      await supabase.from('bafo_rankings').upsert({
        user_id: user.id,
        class_name: className,
        player_name: userName,
        wins: newWins,
        losses: newLoss,
        cards_won: (allCards.length) + (iAmWinner ? allCards.length : 0),
        cards_lost: iAmLoser ? loserCards.length : 0,
        streak: newStreak,
        best_streak: Math.max(newStreak, myOldRank?.streak ?? 0),
        total_matches: (myOldRank?.wins ?? 0) + (myOldRank?.losses ?? 0) + 1,
      }, { onConflict: 'user_id' });
    }

    setActiveMatch({ ...m, status: 'finished', winnerId, winnerName });
    setScreen('result');
    loadLobbyData();
    album.reload();
  }, [user, className, userName, album, rankings, loadLobbyData, setScreen]);

  // ── Return to lobby ──
  const returnToLobby = useCallback(() => {
    stopPowerBar();
    clearPoll();
    // Reset all guards for next match
    countdownFiredRef.current = false;
    hasFinalizedRef.current = false;
    bettingSubmittedRef.current = false;
    setScreen('lobby');
    setActiveMatch(null);
    setSelectedCards([]);
    setMyPower(null);
    setBettingSubmitted(false);
    setIncomingChallenge(null);
  }, [stopPowerBar, clearPoll, setScreen]);

  // ── Derived ──
  const iWon     = activeMatch?.winnerId === user?.id;
  const allStake = activeMatch ? [...activeMatch.challengerCards, ...activeMatch.challengedCards] : [];
  const myStake  = !activeMatch ? [] : user?.id === activeMatch.challengerId
    ? activeMatch.challengerCards : activeMatch.challengedCards;
  const oppName  = !activeMatch ? '' : user?.id === activeMatch.challengerId
    ? activeMatch.challengedName : activeMatch.challengerName;
  const myPowerScore  = !activeMatch || !user ? null
    : user.id === activeMatch.challengerId ? activeMatch.challengerPower : activeMatch.challengedPower;
  const oppPowerScore = !activeMatch || !user ? null
    : user.id === activeMatch.challengerId ? activeMatch.challengedPower : activeMatch.challengerPower;

  const pColor = powerColor(powerDisplay);

  // ── Waiting screen context ──
  const waitingTitle = activeMatch?.status === 'pending'
    ? `Aguardando ${oppName} aceitar...`
    : `Aguardando ${oppName}...`;
  const waitingSubtitle = activeMatch?.status === 'pending'
    ? 'O adversário precisa aceitar seu desafio para a partida começar.'
    : 'O jogo começa quando o adversário estiver pronto!';
  const isChallenger = user?.id === activeMatch?.challengerId;

  // ─── Render ───────────────────────────────────────────────────

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-x-hidden">
      <CopaBackground />

      <div className="relative z-10 container py-8">
        {/* Back button */}
        <Link to="/aluno/album">
          <button type="button" className="mb-6 flex items-center gap-2 text-white/80 hover:text-white text-sm font-bold transition-colors">
            <ArrowLeft className="h-4 w-4" /> Voltar ao Álbum
          </button>
        </Link>

        {/* Page Header */}
        <div className="mb-7 text-center">
          <div className="text-5xl mb-2 drop-shadow-lg">🖐️</div>
          <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow">Arena do Bafo</h1>
          <p className="text-white/50 text-sm mt-1">Vire as figurinhas do colega com a força do Bafo!</p>
        </div>

        {/* ── Incoming Challenge Notification ── */}
        {incomingChallenge && (screen === 'lobby' || screen === 'betting') && (
          <div className="mb-6 rounded-2xl border-2 border-yellow-400/70 bg-yellow-500/20 backdrop-blur-md p-5 shadow-xl shadow-yellow-500/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🖐️</span>
                <div>
                  <p className="text-yellow-300 font-black text-lg">Desafio de Bafo!</p>
                  <p className="text-white/80 text-sm">
                    <span className="font-bold text-white">{incomingChallenge.challengerName}</span> quer te desafiar!
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => respondChallenge(incomingChallenge, true)}
                  className="bg-green-500 hover:bg-green-400 active:scale-95 text-white font-black px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg"
                >
                  🖐️ Aceitar!
                </button>
                <button
                  onClick={() => respondChallenge(incomingChallenge, false)}
                  className="bg-white/20 hover:bg-white/30 text-white/80 font-bold px-4 py-2.5 rounded-xl text-sm transition-all"
                >
                  Recusar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════ LOBBY ══════════════════════════════════ */}
        {screen === 'lobby' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Online classmates */}
            <div className="lg:col-span-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />
                <h2 className="font-black text-white text-base">
                  {onlineUsers.length > 0 ? `${onlineUsers.length} colega(s) online` : 'Ninguém online ainda'}
                </h2>
                <Users className="h-4 w-4 text-white/40 ml-auto" />
              </div>

              {onlineUsers.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-3">👻</div>
                  <p className="text-white/50 text-sm">Nenhum colega online agora.</p>
                  <p className="text-white/30 text-xs mt-1">Chame um amigo para jogar!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {onlineUsers.map(u => (
                    <div key={u.id} className="rounded-xl bg-white/10 border border-green-400/30 p-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center font-black text-white text-sm">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-green-400 shrink-0" />
                          <span className="text-white text-sm font-bold truncate">{u.name}</span>
                        </div>
                        <p className="text-white/40 text-xs">online agora</p>
                      </div>
                      <button
                        onClick={() => challengePlayer(u.id, u.name)}
                        disabled={myDuplicates.length === 0}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 active:scale-95 text-white text-xs font-black px-3 py-1.5 rounded-lg transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        🖐️ Desafiar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {myDuplicates.length === 0 && (
                <div className="mt-4 rounded-xl bg-yellow-500/20 border border-yellow-400/40 p-3 text-center">
                  <p className="text-yellow-300 text-sm font-bold">⚠️ Você não tem figurinhas repetidas para apostar!</p>
                  <p className="text-yellow-200/60 text-xs mt-0.5">Abra pacotes no Álbum para conseguir repetidas.</p>
                </div>
              )}
            </div>

            {/* Ranking */}
            <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-5">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <h2 className="font-black text-white text-base">Ranking do Bafo</h2>
              </div>
              {rankings.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🏆</div>
                  <p className="text-white/40 text-sm">Seja o primeiro campeão!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {rankings.slice(0, 8).map((r, i) => (
                    <div
                      key={r.userId}
                      className={`flex items-center gap-2 p-2.5 rounded-xl transition-all ${
                        r.userId === user?.id
                          ? 'bg-yellow-500/20 border border-yellow-400/40'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-base w-7 text-center shrink-0">
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : <span className="text-white/40 text-xs">{i + 1}</span>}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-bold truncate">{r.playerName}</p>
                        <p className="text-white/40 text-xs">{r.wins}V {r.losses}D · {r.cardsWon} fig.</p>
                      </div>
                      {r.streak >= 3 && (
                        <span className="text-orange-400 text-xs font-black shrink-0">🔥{r.streak}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent matches */}
            {recentMatches.length > 0 && (
              <div className="lg:col-span-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-white/50" />
                  <h2 className="font-black text-white text-base">Últimas Partidas</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentMatches.map(m => {
                    const loserName = m.winnerId === m.challengerId ? m.challengedName : m.challengerName;
                    const total = m.challengerCards.length + m.challengedCards.length;
                    return (
                      <div key={m.id} className="text-xs bg-white/10 rounded-lg px-3 py-1.5 text-white/70">
                        🖐️ <span className="font-bold text-white">{m.winnerName}</span> virou {total} fig. de {loserName}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════ BETTING ══════════════════════════════════ */}
        {screen === 'betting' && activeMatch && (
          <div className="max-w-lg mx-auto">
            <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6">
              <div className="text-center mb-5">
                <div className="text-3xl mb-1">💰</div>
                <h2 className="text-xl font-black text-white">Escolha sua Aposta</h2>
                <p className="text-white/50 text-sm mt-1">
                  {isChallenger ? (
                    <>Você desafiou <span className="text-white font-bold">{oppName}</span></>
                  ) : (
                    <>Desafio de <span className="text-white font-bold">{oppName}</span></>
                  )}
                  {' '}· Até 3 figurinhas repetidas
                </p>
              </div>

              {bettingSubmitted ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3 animate-bounce">⏳</div>
                  <p className="text-white font-black text-lg">Aposta confirmada!</p>
                  <p className="text-white/50 text-sm mt-1">Aguardando {oppName} escolher...</p>
                  <div className="mt-4 flex justify-center gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-white/50 animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              ) : myDuplicates.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">😢</div>
                  <p className="text-white/60">Você não tem figurinhas repetidas!</p>
                  <button onClick={returnToLobby} className="mt-4 text-sm text-white/40 underline">Voltar</button>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 justify-center mb-5 max-h-72 overflow-y-auto py-1 px-1">
                    {myDuplicates.map(p => (
                      <MiniCard
                        key={p.id}
                        cardId={p.id}
                        selected={selectedCards.includes(p.id)}
                        available={p.available}
                        onClick={() => {
                          setSelectedCards(prev =>
                            prev.includes(p.id)
                              ? prev.filter(c => c !== p.id)
                              : prev.length < 3 ? [...prev, p.id] : prev
                          );
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm">
                    <span className="text-white/50">{selectedCards.length}/3 selecionadas</span>
                    {selectedCards.length > 0 && (
                      <div className="flex gap-1 flex-wrap justify-end">
                        {selectedCards.map(id => {
                          const p = getPlayerById(id);
                          return (
                            <span key={id} className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                              {p?.name}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={submitBet}
                    disabled={selectedCards.length === 0}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 active:scale-[0.98] text-white font-black text-lg py-3.5 rounded-2xl transition-all shadow-xl shadow-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    🖐️ Confirmar Aposta
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════ WAITING ══════════════════════════════════ */}
        {screen === 'waiting' && (
          <div className="max-w-sm mx-auto text-center">
            <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-12">
              <div className="text-5xl mb-4">⏳</div>
              <h2 className="text-xl font-black text-white mb-2">{waitingTitle}</h2>
              <p className="text-white/40 text-sm">{waitingSubtitle}</p>
              <div className="mt-5 flex justify-center gap-1.5">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/30 animate-pulse"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              {/* FIX: Allow challenger to cancel a pending challenge */}
              {activeMatch?.status === 'pending' && isChallenger && (
                <button
                  onClick={cancelChallenge}
                  className="mt-6 text-sm text-white/30 hover:text-white/60 underline transition-colors"
                >
                  Cancelar desafio
                </button>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════ COUNTDOWN ══════════════════════════════════ */}
        {screen === 'countdown' && (
          <div className="max-w-sm mx-auto text-center">
            <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-16">
              <p className="text-white/50 font-bold text-sm mb-6 uppercase tracking-widest">Prepare-se!</p>
              <div
                className="text-[120px] font-black text-white leading-none drop-shadow-2xl"
                key={countdownNum}
                style={{ animation: 'ping 0.7s ease-out forwards', transformOrigin: 'center' }}
              >
                {countdownNum}
              </div>
              <p className="text-white/30 text-sm mt-6">vs {oppName}</p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════ PLAYING ══════════════════════════════════ */}
        {screen === 'playing' && activeMatch && (
          <div className="max-w-md mx-auto">
            <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-7 text-center">
              <h2 className="text-2xl font-black text-white mb-1">🖐️ BAFO!</h2>
              <p className="text-white/50 text-sm mb-5">Clique no momento certo para virar mais figurinhas!</p>

              {/* Cards on the table */}
              <div className="mb-6">
                <p className="text-white/40 text-xs mb-2 font-bold uppercase tracking-wider">Na mesa</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {allStake.map((c, i) => <StakeCard key={`${c.id}-${i}`} card={c} />)}
                </div>
              </div>

              {myPower === null ? (
                <>
                  {/* Power bar */}
                  <div className="relative h-12 bg-black/40 rounded-full overflow-hidden mb-3 border border-white/20 shadow-inner">
                    {/* Perfect zone (65–95%) */}
                    <div className="absolute top-0 bottom-0 left-[65%] right-[5%] bg-green-500/25 border-x border-green-400/50 pointer-events-none" />
                    <span className="absolute top-1 left-[66%] text-[9px] text-green-400/70 font-bold pointer-events-none">ZONA</span>

                    {/* Fill */}
                    <div
                      className="absolute top-0 left-0 bottom-0 rounded-full opacity-40 transition-none"
                      style={{ width: `${Math.min(powerDisplay, 100)}%`, background: pColor }}
                    />
                    {/* Cursor */}
                    <div
                      className="absolute top-1 bottom-1 w-3 rounded-full shadow-lg transition-none"
                      style={{
                        left: `calc(${Math.min(powerDisplay, 97)}% - 6px)`,
                        background: pColor,
                        boxShadow: `0 0 16px ${pColor}, 0 0 32px ${pColor}80`,
                      }}
                    />
                  </div>

                  <p className="font-black text-lg mb-5" style={{ color: pColor }}>
                    {powerLabel(powerDisplay)}
                  </p>

                  <button
                    onClick={handleBafo}
                    className="w-full py-5 rounded-2xl font-black text-3xl text-black shadow-2xl active:scale-95 transition-transform"
                    style={{
                      background: `linear-gradient(135deg, ${pColor}, #fb923c)`,
                      boxShadow: `0 0 40px ${pColor}60`,
                    }}
                  >
                    🖐️ BAFO!
                  </button>
                </>
              ) : (
                <div className="py-6 text-center">
                  <div className="text-5xl mb-3">
                    {myPower >= 85 ? '🔥' : myPower >= 65 ? '⚡' : myPower >= 45 ? '👍' : '😅'}
                  </div>
                  <p className="text-white font-black text-2xl">Poder: {myPower}%</p>
                  <p className="text-white/40 text-sm mt-2">Aguardando {oppName}...</p>
                  <div className="mt-4 flex justify-center gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-white/40 animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════ RESULT ══════════════════════════════════ */}
        {screen === 'result' && activeMatch && (
          <div className="max-w-md mx-auto">
            <div className={`rounded-2xl border-2 p-7 text-center backdrop-blur-md shadow-2xl ${
              iWon
                ? 'border-yellow-400/60 bg-gradient-to-b from-yellow-900/40 to-amber-950/50 shadow-yellow-400/20'
                : 'border-white/20 bg-white/10 shadow-white/5'
            }`}>
              <div className="text-6xl mb-3" style={{ animation: 'bounce 1s infinite' }}>
                {iWon ? '🏆' : '😢'}
              </div>
              <h2 className={`text-3xl font-black mb-1 ${iWon ? 'text-yellow-300' : 'text-white'}`}>
                {iWon ? 'Você VENCEU!' : 'Você perdeu...'}
              </h2>
              <p className="text-white/50 text-sm mb-6">
                {iWon
                  ? `Você ganhou ${allStake.length} figurinha${allStake.length !== 1 ? 's' : ''}! 🎉`
                  : `${activeMatch.winnerName} virou suas figurinhas!`
                }
              </p>

              {/* Cards won */}
              {iWon && allStake.length > 0 && (
                <div className="mb-6">
                  <p className="text-white/50 text-xs mb-3 font-bold uppercase tracking-wider">
                    ✨ Figurinhas Conquistadas
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {allStake.map((c, i) => (
                      <div key={`${c.id}-${i}`}
                        className="animate-bounce"
                        style={{ animationDelay: `${i * 0.1}s`, animationDuration: '1s' }}
                      >
                        <StakeCard card={c} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cards lost */}
              {!iWon && myStake.length > 0 && (
                <div className="mb-6">
                  <p className="text-white/50 text-xs mb-3 font-bold uppercase tracking-wider">
                    💔 Figurinhas Perdidas
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {myStake.map((c, i) => <StakeCard key={`${c.id}-${i}`} card={c} faded />)}
                  </div>
                </div>
              )}

              {/* Power scores */}
              <div className="flex justify-center gap-10 mb-6 mt-2 text-sm">
                <div className="text-center">
                  <p className="text-white/40 text-xs mb-1">Seu Poder</p>
                  <p className="font-black text-white text-2xl">{myPowerScore ?? '—'}%</p>
                </div>
                <div className="text-white/20 flex items-center text-2xl font-black">vs</div>
                <div className="text-center">
                  <p className="text-white/40 text-xs mb-1">{oppName}</p>
                  <p className="font-black text-white text-2xl">{oppPowerScore ?? '—'}%</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={returnToLobby}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-400 hover:to-violet-500 active:scale-[0.98] text-white font-black text-base py-3.5 rounded-2xl transition-all shadow-lg"
                >
                  🖐️ Jogar Novamente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Inline keyframe for countdown ping */}
      <style>{`
        @keyframes ping {
          0%   { transform: scale(0.5); opacity: 0; }
          50%  { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
