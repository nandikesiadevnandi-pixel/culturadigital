import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase as supabaseTyped } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AlbumPlayer, drawRandomPack, getPlayerById } from '@/data/albumPlayers';

// Album tables aren't in the generated DB types yet — cast to loosen typing.
const supabase = supabaseTyped as any;

// ─── Types ────────────────────────────────────────────────

export interface AlbumStats {
  coins: number;
  packsAvail: number;
  totalPacks: number;
  legendaries: number;
}

export interface InventoryEntry {
  cardId: string;
  quantity: number;
}

export interface TradeProposal {
  id: string;
  fromUserId: string;
  toUserId: string | null;
  fromName: string;
  toName: string;
  fromClass: string;
  offeredCards: string[];
  requestedCards: string[];
  message: string | null;
  status: 'open' | 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: string;
}

export interface FeedEvent {
  id: string;
  userId: string;
  userName: string;
  className: string;
  eventType: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: string;
}

// ─── Hook ─────────────────────────────────────────────────

export function useAlbum() {
  const { user, profile } = useAuth();

  const [stats, setStats] = useState<AlbumStats>({ coins: 100, packsAvail: 3, totalPacks: 0, legendaries: 0 });
  const [inventory, setInventory] = useState<InventoryEntry[]>([]);
  const [trades, setTrades] = useState<TradeProposal[]>([]);
  const [feed, setFeed] = useState<FeedEvent[]>([]);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const className = profile?.class_name ?? '';
  const school = profile?.school ?? '';
  const userName = profile?.full_name ?? '';

  // ── Load initial data ──
  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const [statsRes, invRes, tradesRes, feedRes, chatRes] = await Promise.all([
      supabase.from('album_user_stats').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('album_inventory').select('card_id,quantity').eq('user_id', user.id),
      supabase.from('album_trades').select('*').or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id},status.eq.open`).order('created_at', { ascending: false }).limit(50),
      supabase.from('album_feed').select('*').eq('class_name', className).order('created_at', { ascending: false }).limit(30),
      supabase.from('album_chat').select('*').eq('class_name', className).order('created_at', { ascending: false }).limit(50),
    ]);

    if (statsRes.data) {
      const d = statsRes.data as Record<string, unknown>;
      setStats({ coins: Number(d.coins), packsAvail: Number(d.packs_avail), totalPacks: Number(d.total_packs), legendaries: Number(d.legendaries) });
    } else {
      // bootstrap stats row
      await supabase.from('album_user_stats').upsert({ user_id: user.id, coins: 100, packs_avail: 3, total_packs: 0, legendaries: 0 });
    }

    if (invRes.data) setInventory((invRes.data as Array<{ card_id: string; quantity: number }>).map(r => ({ cardId: r.card_id, quantity: r.quantity })));

    if (tradesRes.data) setTrades(mapTrades(tradesRes.data as Record<string, unknown>[]));
    if (feedRes.data)   setFeed(mapFeed(feedRes.data as Record<string, unknown>[]));
    if (chatRes.data)   setChat(mapChat((chatRes.data as Record<string, unknown>[]).reverse()));

    setLoading(false);
  }, [user, school, className]);

  useEffect(() => { load(); }, [load]);

  // ── Realtime subscriptions ──
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!user) return;

    const ch = supabase.channel(`album:${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'album_feed', filter: `school=eq.${school}` },
        (payload) => setFeed(prev => [mapFeedRow(payload.new as Record<string, unknown>), ...prev].slice(0, 50)))
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'album_chat', filter: `class_name=eq.${className}` },
        (payload) => setChat(prev => [...prev, mapChatRow(payload.new as Record<string, unknown>)].slice(-100)))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'album_trades' },
        () => { supabase.from('album_trades').select('*').or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id},status.eq.open`).order('created_at', { ascending: false }).limit(50).then(({ data }) => { if (data) setTrades(mapTrades(data as Record<string, unknown>[])); }); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'album_inventory', filter: `user_id=eq.${user.id}` },
        (payload) => {
          const row = payload.new as { card_id: string; quantity: number } | null;
          if (!row) return;
          setInventory(prev => {
            const existing = prev.findIndex(e => e.cardId === row.card_id);
            if (existing >= 0) { const next = [...prev]; next[existing] = { cardId: row.card_id, quantity: row.quantity }; return next; }
            return [...prev, { cardId: row.card_id, quantity: row.quantity }];
          });
        })
      .subscribe();

    channelRef.current = ch;
    return () => { ch.unsubscribe(); };
  }, [user, school, className]);

  // ── Open pack ──
  const openPack = useCallback(async (goldGuaranteed = false): Promise<AlbumPlayer[] | null> => {
    if (!user) return null;
    if (stats.packsAvail < 1) return null;

    const cards = drawRandomPack(5, goldGuaranteed);
    const newLegendaries = cards.filter(c => c.rarity === 'legendary').length;

    // Upsert each card in inventory
    for (const card of cards) {
      const existing = inventory.find(e => e.cardId === card.id);
      await supabase.from('album_inventory').upsert({
        user_id: user.id,
        card_id: card.id,
        quantity: (existing?.quantity ?? 0) + 1,
      }, { onConflict: 'user_id,card_id' });
    }

    // Update stats
    const newStats = {
      user_id: user.id,
      packs_avail: stats.packsAvail - 1,
      total_packs: stats.totalPacks + 1,
      legendaries: stats.legendaries + newLegendaries,
      coins: stats.coins,
    };
    await supabase.from('album_user_stats').upsert(newStats);
    setStats(s => ({ ...s, packsAvail: s.packsAvail - 1, totalPacks: s.totalPacks + 1, legendaries: s.legendaries + newLegendaries }));

    // Post to feed
    await postFeedEvent('pack_opened', {
      cards: cards.map(c => c.id),
      legendary: newLegendaries > 0,
      legendaryCard: newLegendaries > 0 ? cards.find(c => c.rarity === 'legendary')?.name : null,
    });

    return cards;
  }, [user, stats, inventory]);

  // ── Add coins + packs (from challenges) ──
  const addReward = useCallback(async (packs: number, coins: number, xp: number) => {
    if (!user) return;
    const updated = {
      user_id: user.id,
      packs_avail: stats.packsAvail + packs,
      total_packs: stats.totalPacks,
      legendaries: stats.legendaries,
      coins: stats.coins + coins,
    };
    await supabase.from('album_user_stats').upsert(updated);
    setStats(s => ({ ...s, packsAvail: s.packsAvail + packs, coins: s.coins + coins }));

    // Also add XP to main profile
    if (xp > 0) {
      await supabase.rpc('has_role', { _role: 'student', _user_id: user.id }); // just a probe; real XP update:
      await supabase.from('xp_events').insert({ user_id: user.id, amount: xp, source: 'album_challenge', reason: 'Desafio do Álbum' });
    }
  }, [user, stats]);

  // ── Propose trade ──
  const proposeTrade = useCallback(async (opts: {
    toUserId?: string; toName?: string;
    offeredCards: string[]; requestedCards: string[];
    message?: string;
  }) => {
    if (!user) return null;
    const { data, error } = await supabase.from('album_trades').insert({
      from_user_id: user.id,
      to_user_id: opts.toUserId ?? null,
      from_name: userName,
      to_name: opts.toName ?? '',
      from_class: className,
      offered_cards: opts.offeredCards,
      requested_cards: opts.requestedCards,
      message: opts.message ?? null,
      status: opts.toUserId ? 'pending' : 'open',
    }).select().single();
    if (error) return null;
    return data;
  }, [user, userName, className]);

  // ── Accept / decline trade ──
  const respondTrade = useCallback(async (tradeId: string, accept: boolean) => {
    if (!user) return;
    const trade = trades.find(t => t.id === tradeId);
    if (!trade) return;

    if (accept) {
      // Swap cards
      for (const cardId of trade.offeredCards) {
        await supabase.from('album_inventory').upsert({ user_id: user.id, card_id: cardId, quantity: (inventory.find(e => e.cardId === cardId)?.quantity ?? 0) + 1 }, { onConflict: 'user_id,card_id' });
      }
      for (const cardId of trade.requestedCards) {
        const qty = inventory.find(e => e.cardId === cardId)?.quantity ?? 0;
        if (qty > 1) await supabase.from('album_inventory').update({ quantity: qty - 1 }).eq('user_id', user.id).eq('card_id', cardId);
        else await supabase.from('album_inventory').delete().eq('user_id', user.id).eq('card_id', cardId);
      }
      await postFeedEvent('trade_completed', { with: trade.fromName, offered: trade.offeredCards, received: trade.requestedCards });
    }

    await supabase.from('album_trades').update({ status: accept ? 'accepted' : 'declined', updated_at: new Date().toISOString() }).eq('id', tradeId);
  }, [user, trades, inventory]);

  const cancelTrade = useCallback(async (tradeId: string) => {
    await supabase.from('album_trades').update({ status: 'cancelled' }).eq('id', tradeId);
  }, []);

  // ── Chat ──
  const sendChat = useCallback(async (message: string) => {
    if (!user || !message.trim()) return;
    await supabase.from('album_chat').insert({ user_id: user.id, user_name: userName, class_name: className, school, message: message.trim() });
  }, [user, userName, className, school]);

  // ── Feed helper ──
  const postFeedEvent = useCallback(async (eventType: string, payload: Record<string, unknown>) => {
    if (!user) return;
    await supabase.from('album_feed').insert({ user_id: user.id, user_name: userName, class_name: className, school, event_type: eventType, payload });
  }, [user, userName, className, school]);

  // ── Challenge complete ──
  const completeChallenge = useCallback(async (challengeId: string): Promise<boolean> => {
    if (!user) return false;
    const { error } = await supabase.from('album_challenge_done').insert({ user_id: user.id, challenge_id: challengeId });
    return !error;
  }, [user]);

  const isDoneChallenged = useCallback(async (challengeId: string): Promise<boolean> => {
    if (!user) return false;
    const { data } = await supabase.from('album_challenge_done').select('id').eq('user_id', user.id).eq('challenge_id', challengeId).maybeSingle();
    return !!data;
  }, [user]);

  // ── Derived ──
  const uniqueCards = inventory.filter(e => e.quantity >= 1).length;
  const duplicates = inventory.filter(e => e.quantity > 1);
  const owned = new Set(inventory.filter(e => e.quantity >= 1).map(e => e.cardId));
  const pendingIncoming = trades.filter(t => t.toUserId === user?.id && t.status === 'pending').length;

  return {
    loading,
    stats,
    inventory,
    trades,
    feed,
    chat,
    owned,
    duplicates,
    uniqueCards,
    pendingIncoming,
    openPack,
    addReward,
    proposeTrade,
    respondTrade,
    cancelTrade,
    sendChat,
    postFeedEvent,
    completeChallenge,
    isDoneChallenged,
    reload: load,
  };
}

// ─── Map helpers ──────────────────────────────────────────

function mapTrades(rows: Record<string, unknown>[]): TradeProposal[] {
  return rows.map(r => ({
    id: String(r.id),
    fromUserId: String(r.from_user_id),
    toUserId: r.to_user_id ? String(r.to_user_id) : null,
    fromName: String(r.from_name ?? ''),
    toName: String(r.to_name ?? ''),
    fromClass: String(r.from_class ?? ''),
    offeredCards: (r.offered_cards as string[]) ?? [],
    requestedCards: (r.requested_cards as string[]) ?? [],
    message: r.message ? String(r.message) : null,
    status: String(r.status) as TradeProposal['status'],
    createdAt: String(r.created_at),
  }));
}

function mapFeedRow(r: Record<string, unknown>): FeedEvent {
  return {
    id: String(r.id),
    userId: String(r.user_id),
    userName: String(r.user_name ?? ''),
    className: String(r.class_name ?? ''),
    eventType: String(r.event_type),
    payload: (r.payload as Record<string, unknown>) ?? {},
    createdAt: String(r.created_at),
  };
}

function mapFeed(rows: Record<string, unknown>[]): FeedEvent[] {
  return rows.map(mapFeedRow);
}

function mapChatRow(r: Record<string, unknown>): ChatMessage {
  return {
    id: String(r.id),
    userId: String(r.user_id),
    userName: String(r.user_name ?? ''),
    message: String(r.message),
    createdAt: String(r.created_at),
  };
}

function mapChat(rows: Record<string, unknown>[]): ChatMessage[] {
  return rows.map(mapChatRow);
}
