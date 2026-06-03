import { useCallback, useEffect, useState } from 'react';
import { supabase as supabaseTyped } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const supabase = supabaseTyped as any;

export interface StudentCard {
  id: string;
  userId: string;
  className: string;
  school: string | null;
  playerName: string;
  country: string;
  countryFlag: string;
  club: string;
  position: string;
  jerseyNumber: number;
  foot: string;
  jerseyColor: string;
  jerseyStyle: string;
  frame: string;
  photoUrl: string;
  views: number;
  createdAt: string;
  likes: { like: number; fire: number; star: number };
  myReactions: Set<string>;
}

export interface CreateCardInput {
  playerName: string;
  country: string;
  countryFlag: string;
  club: string;
  position: string;
  jerseyNumber: number;
  foot: string;
  jerseyColor: string;
  jerseyStyle: string;
  frame: string;
  photoBlob: Blob;
}

function mapRow(r: any, likes: any[], userId?: string): StudentCard {
  const counts = { like: 0, fire: 0, star: 0 } as Record<string, number>;
  const mine = new Set<string>();
  for (const l of likes) {
    if (l.card_id !== r.id) continue;
    counts[l.reaction] = (counts[l.reaction] ?? 0) + 1;
    if (userId && l.user_id === userId) mine.add(l.reaction);
  }
  return {
    id: r.id,
    userId: r.user_id,
    className: r.class_name ?? '',
    school: r.school ?? null,
    playerName: r.player_name,
    country: r.country,
    countryFlag: r.country_flag,
    club: r.club,
    position: r.position,
    jerseyNumber: r.jersey_number,
    foot: r.foot,
    jerseyColor: r.jersey_color,
    jerseyStyle: r.jersey_style,
    frame: r.frame,
    photoUrl: r.photo_url,
    views: r.views ?? 0,
    createdAt: r.created_at,
    likes: { like: counts.like, fire: counts.fire, star: counts.star },
    myReactions: mine,
  };
}

export function useStudentCards() {
  const { user, profile } = useAuth();
  const [cards, setCards] = useState<StudentCard[]>([]);
  const [myCard, setMyCard] = useState<StudentCard | null>(null);
  const [loading, setLoading] = useState(true);

  const className = profile?.class_name ?? '';

  const load = useCallback(async () => {
    if (!user || !className) { setLoading(false); return; }
    setLoading(true);

    const { data: rows } = await supabase
      .from('student_cards')
      .select('*')
      .eq('class_name', className)
      .order('created_at', { ascending: false });

    const ids = (rows ?? []).map((r: any) => r.id);
    let likes: any[] = [];
    if (ids.length > 0) {
      const { data: likeRows } = await supabase
        .from('student_card_likes')
        .select('*')
        .in('card_id', ids);
      likes = likeRows ?? [];
    }

    const mapped = (rows ?? []).map((r: any) => mapRow(r, likes, user.id));
    setCards(mapped);
    setMyCard(mapped.find(c => c.userId === user.id) ?? null);
    setLoading(false);
  }, [user, className]);

  useEffect(() => { load(); }, [load]);

  // Realtime updates for the class — debounced to avoid reload storms on rapid likes
  useEffect(() => {
    if (!user || !className) return;
    let t: ReturnType<typeof setTimeout> | null = null;
    const schedule = () => { if (t) clearTimeout(t); t = setTimeout(() => load(), 250); };
    const ch = supabase.channel(`student_cards:${className}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'student_cards', filter: `class_name=eq.${className}` }, schedule)
      // Likes have no class_name column; we filter client-side via the cards list, but at least debounce.
      .on('postgres_changes', { event: '*', schema: 'public', table: 'student_card_likes' }, schedule)
      .subscribe();
    return () => { if (t) clearTimeout(t); ch.unsubscribe(); };
  }, [user, className, load]);


  const createOrUpdate = useCallback(async (input: CreateCardInput): Promise<{ ok: boolean; error?: string }> => {
    if (!user) return { ok: false, error: 'Não autenticado' };

    // Upload photo
    const ext = (input.photoBlob.type.split('/')[1] ?? 'jpg').replace('jpeg', 'jpg');
    const path = `${user.id}/card-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('student-cards').upload(path, input.photoBlob, {
      contentType: input.photoBlob.type || 'image/jpeg',
      upsert: true,
    });
    if (upErr) return { ok: false, error: upErr.message };

    const { data: pub } = supabase.storage.from('student-cards').getPublicUrl(path);
    const photoUrl = pub.publicUrl;

    const row = {
      user_id: user.id,
      class_name: className,
      school: profile?.school ?? null,
      player_name: input.playerName,
      country: input.country,
      country_flag: input.countryFlag,
      club: input.club,
      position: input.position,
      jersey_number: input.jerseyNumber,
      foot: input.foot,
      jersey_color: input.jerseyColor,
      jersey_style: input.jerseyStyle,
      frame: input.frame,
      photo_url: photoUrl,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('student_cards').upsert(row, { onConflict: 'user_id' });
    if (error) return { ok: false, error: error.message };
    await load();
    return { ok: true };
  }, [user, className, profile, load]);

  const toggleReaction = useCallback(async (cardId: string, reaction: 'like' | 'fire' | 'star') => {
    if (!user) return;
    const card = cards.find(c => c.id === cardId);
    const has = card?.myReactions.has(reaction);
    if (has) {
      await supabase.from('student_card_likes').delete().eq('card_id', cardId).eq('user_id', user.id).eq('reaction', reaction);
    } else {
      await supabase.from('student_card_likes').insert({ card_id: cardId, user_id: user.id, reaction });
    }
    // Optimistic — realtime will also catch up
    setCards(prev => prev.map(c => {
      if (c.id !== cardId) return c;
      const newMine = new Set(c.myReactions);
      const delta = has ? -1 : 1;
      if (has) newMine.delete(reaction); else newMine.add(reaction);
      return { ...c, myReactions: newMine, likes: { ...c.likes, [reaction]: Math.max(0, c.likes[reaction] + delta) } };
    }));
  }, [user, cards]);

  return { cards, myCard, loading, createOrUpdate, toggleReaction, reload: load };
}
