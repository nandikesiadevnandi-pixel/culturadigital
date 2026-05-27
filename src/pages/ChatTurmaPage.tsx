import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Trash2, MessageCircle, ShieldAlert, Reply, Smile } from "lucide-react";
import { toast } from "sonner";
import { moderateText, logFlag } from "@/lib/moderation";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
type Msg = {
  id: string;
  user_id: string;
  author_name: string;
  class_name: string;
  body: string;
  created_at: string;
  reply_to_id?: string | null;
  reply_to_name?: string | null;
  reply_to_body?: string | null;
  profile_photo_url?: string | null;
};

type Reaction = { id: string; message_id: string; user_id: string; emoji: string };
type ReactionMap = Record<string, Record<string, string[]>>; // msgId → emoji → userId[]

// ─── Helpers ─────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ['#D43B2A','#1E9B5F','#00B4D8','#6B21A8','#E57200','#DB2777','#FBBA16','#0E3A7A'];
function avatarColor(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

const EMOJIS = ['❤️','😂','😮','😢','👏','🔥','⚽','💪'];

function Avatar({ name, photo, userId, size = 8 }: { name: string; photo?: string | null; userId: string; size?: number }) {
  const [photoErr, setPhotoErr] = useState(false);
  const color = avatarColor(userId);
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div
      className="rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden text-white font-black shadow-md"
      style={{ background: color, width: size * 4, height: size * 4 }}
    >
      {photo && !photoErr
        ? <img src={photo} alt={name} className="h-full w-full object-cover" onError={() => setPhotoErr(true)} />
        : <span className={size <= 6 ? 'chat-avatar-sm' : 'chat-avatar-md'}>{initials}</span>
      }
    </div>
  );
}

function buildReactionMap(rows: Reaction[]): ReactionMap {
  const map: ReactionMap = {};
  for (const r of rows) {
    if (!map[r.message_id]) map[r.message_id] = {};
    if (!map[r.message_id][r.emoji]) map[r.message_id][r.emoji] = [];
    if (!map[r.message_id][r.emoji].includes(r.user_id)) {
      map[r.message_id][r.emoji].push(r.user_id);
    }
  }
  return map;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ChatTurmaPage() {
  const { profile, isAdmin } = useAuth();
  const [messages, setMessages]     = useState<Msg[]>([]);
  const [reactions, setReactions]   = useState<ReactionMap>({});
  const [text, setText]             = useState("");
  const [replyTo, setReplyTo]       = useState<Msg | null>(null);
  const [emojiMsg, setEmojiMsg]     = useState<string | null>(null);
  const [loading, setLoading]       = useState(true);
  const [chatEnabled, setChatEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  const turma = profile?.class_name ?? "";

  useEffect(() => {
    if (!turma) return;
    supabase.from("class_settings").select("chat_enabled").eq("class_name", turma).maybeSingle()
      .then(({ data }) => setChatEnabled(data?.chat_enabled ?? true));
  }, [turma]);

  // ── Load messages + reactions ──
  const loadAll = useCallback(async () => {
    if (!turma) return;
    const [{ data: msgs }, { data: reacts }] = await Promise.all([
      supabase.from("chat_messages").select("*").eq("class_name", turma)
        .order("created_at", { ascending: true }).limit(300),
      supabase.from("chat_reactions").select("*").eq("class_name", turma),
    ]);
    setMessages((msgs ?? []) as Msg[]);
    setReactions(buildReactionMap((reacts ?? []) as Reaction[]));
    setLoading(false);
  }, [turma]);

  useEffect(() => {
    loadAll();
    if (!turma) return;
    const ch = supabase.channel(`chat-${turma}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `class_name=eq.${turma}` },
        (p) => setMessages(m => [...m, p.new as Msg]))
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "chat_messages", filter: `class_name=eq.${turma}` },
        (p) => setMessages(m => m.filter(x => x.id !== (p.old as any).id)))
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_reactions", filter: `class_name=eq.${turma}` },
        (p) => {
          const r = p.new as Reaction;
          setReactions(prev => {
            const next = { ...prev };
            if (!next[r.message_id]) next[r.message_id] = {};
            if (!next[r.message_id][r.emoji]) next[r.message_id][r.emoji] = [];
            if (!next[r.message_id][r.emoji].includes(r.user_id)) next[r.message_id][r.emoji] = [...next[r.message_id][r.emoji], r.user_id];
            return next;
          });
        })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "chat_reactions", filter: `class_name=eq.${turma}` },
        (p) => {
          const r = p.old as Reaction;
          setReactions(prev => {
            const next = { ...prev };
            if (next[r.message_id]?.[r.emoji]) {
              next[r.message_id][r.emoji] = next[r.message_id][r.emoji].filter(u => u !== r.user_id);
              if (next[r.message_id][r.emoji].length === 0) delete next[r.message_id][r.emoji];
            }
            return next;
          });
        })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [turma, loadAll]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // ── Send message ──
  const send = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatEnabled && !isAdmin) { toast.error("Chat desligado pela professora."); return; }
    const body = text.trim();
    if (!body || !profile) return;
    const mod = await moderateText(body, "chat_turma");
    if (!mod.allowed) {
      await logFlag({ user_id: profile.user_id, author_name: profile.full_name, class_name: turma, context: "chat_turma", original_text: body, reason: mod.reason, severity: mod.severity });
      toast.error(`🛡️ Bloqueado: ${mod.reason || "linguagem inadequada"}`);
      return;
    }
    setText("");
    const { error } = await supabase.from("chat_messages").insert({
      user_id: profile.user_id,
      author_name: profile.full_name,
      school: profile.school,
      class_name: turma,
      body,
      reply_to_id:   replyTo?.id ?? null,
      reply_to_name: replyTo?.author_name ?? null,
      reply_to_body: replyTo?.body ? replyTo.body.slice(0, 80) : null,
      profile_photo_url: (profile as any).avatar_photo_url ?? null,
    });
    if (error) toast.error(error.message);
    setReplyTo(null);
  };

  // ── Reactions ──
  const toggleReaction = async (messageId: string, emoji: string) => {
    if (!profile) return;
    const mine = reactions[messageId]?.[emoji]?.includes(profile.user_id);
    if (mine) {
      await supabase.from("chat_reactions").delete()
        .eq("message_id", messageId).eq("user_id", profile.user_id).eq("emoji", emoji);
    } else {
      await supabase.from("chat_reactions").insert({
        message_id: messageId, user_id: profile.user_id,
        author_name: profile.full_name, class_name: turma, emoji,
      });
    }
    setEmojiMsg(null);
  };

  const removeMsg = async (id: string) => {
    await supabase.from("chat_messages").delete().eq("id", id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // ── Close emoji picker when clicking outside ──
  useEffect(() => {
    const close = () => setEmojiMsg(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  if (!profile) return null;
  if (!turma) return (
    <div className="container py-20 text-center text-violet-200">Você precisa estar em uma turma para usar o chat.</div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#0a0a1a] py-6">
      <div className="container max-w-3xl">
        <Link to="/aluno" className="inline-flex items-center gap-2 text-violet-200 hover:text-white text-sm mb-3">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <div className="border border-violet-500/20 bg-[#0f0f24]/90 rounded-2xl backdrop-blur flex flex-col h-[82vh] overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-violet-500/20 flex items-center gap-3">
            <Avatar name={turma} userId={turma} size={9} />
            <div className="flex-1">
              <h1 className="text-white font-bold text-sm">Chat da turma {turma}</h1>
              <p className="text-[10px] text-violet-200/60">{profile.school} · só sua turma vê</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">
              <ShieldAlert className="h-3 w-3" /> IA anti-bullying
            </span>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <p className="text-violet-200/50 text-sm text-center mt-10">Carregando...</p>
            ) : messages.length === 0 ? (
              <div className="text-center mt-16 text-violet-200/50">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Nenhuma mensagem ainda. Manda um oi! 👋</p>
              </div>
            ) : messages.map(m => {
              const mine = m.user_id === profile.user_id;
              const msgReactions = reactions[m.id] ?? {};
              const hasReactions = Object.keys(msgReactions).length > 0;

              return (
                <div key={m.id} className={cn("flex gap-2 group/msg", mine ? "flex-row-reverse" : "flex-row")}>
                  {/* Avatar (other users only) */}
                  {!mine && (
                    <div className="flex-shrink-0 mt-auto mb-1">
                      <Avatar name={m.author_name} photo={m.profile_photo_url} userId={m.user_id} size={8} />
                    </div>
                  )}

                  <div className={cn("flex flex-col max-w-[72%]", mine ? "items-end" : "items-start")}>
                    {/* Author name */}
                    {!mine && (
                      <p className="text-[10px] font-bold mb-0.5 px-1" style={{ color: avatarColor(m.user_id) }}>
                        {m.author_name.split(" ")[0]}
                      </p>
                    )}

                    {/* Bubble row (with hover actions beside it) */}
                    <div className={cn("flex items-center gap-1", mine ? "flex-row-reverse" : "flex-row")}>
                      {/* Bubble */}
                      <div className="relative">
                        <div className={cn(
                          "relative rounded-2xl px-3 py-2 text-sm",
                          mine
                            ? "bg-gradient-to-br from-violet-600 to-cyan-600 text-white rounded-br-none"
                            : "bg-[#1a1a3a] text-white border border-violet-500/20 rounded-bl-none",
                        )}>
                          {/* Reply quote */}
                          {m.reply_to_body && (
                            <div className="mb-2 rounded-lg border-l-2 border-cyan-400 bg-white/10 pl-2 pr-1 py-1">
                              <p className="text-[10px] font-bold text-cyan-400">{m.reply_to_name}</p>
                              <p className="text-[10px] text-white/70 line-clamp-2">{m.reply_to_body}</p>
                            </div>
                          )}

                          <p className="whitespace-pre-wrap break-words leading-relaxed">{m.body}</p>
                          <p className="text-[10px] opacity-50 mt-1 text-right">
                            {new Date(m.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>

                        {/* Emoji picker floating */}
                        {emojiMsg === m.id && (
                          <div
                            className={cn(
                              "absolute bottom-full mb-1 z-30 flex gap-0.5 rounded-full bg-[#0f0f24] border border-violet-500/40 px-2 py-1 shadow-2xl",
                              mine ? "right-0" : "left-0",
                            )}
                            onClick={e => e.stopPropagation()}
                          >
                            {EMOJIS.map(emoji => {
                              const iMine = reactions[m.id]?.[emoji]?.includes(profile.user_id);
                              return (
                                <button
                                  type="button"
                                  key={emoji}
                                  onClick={() => toggleReaction(m.id, emoji)}
                                  className={cn("text-base rounded-full p-0.5 hover:scale-125 transition-transform", iMine && "bg-violet-500/30")}
                                >
                                  {emoji}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Hover action buttons */}
                      <div className={cn(
                        "flex gap-0.5 opacity-0 group-hover/msg:opacity-100 transition-opacity",
                        mine ? "flex-row-reverse" : "flex-row",
                      )}>
                        <button
                          type="button"
                          title="Reagir"
                          className="h-7 w-7 rounded-full bg-[#1a1a3a] border border-violet-500/30 flex items-center justify-center hover:bg-violet-500/30 text-sm"
                          onClick={e => { e.stopPropagation(); setEmojiMsg(prev => prev === m.id ? null : m.id); }}
                        >
                          <Smile className="h-3.5 w-3.5 text-violet-300" />
                        </button>
                        <button
                          type="button"
                          title="Responder"
                          className="h-7 w-7 rounded-full bg-[#1a1a3a] border border-violet-500/30 flex items-center justify-center hover:bg-violet-500/30"
                          onClick={() => { setReplyTo(m); inputRef.current?.focus(); }}
                        >
                          <Reply className="h-3.5 w-3.5 text-violet-300" />
                        </button>
                        {(mine || isAdmin) && (
                          <button
                            type="button"
                            title="Apagar"
                            className="h-7 w-7 rounded-full bg-[#1a1a3a] border border-violet-500/30 flex items-center justify-center hover:bg-red-500/30"
                            onClick={() => removeMsg(m.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Reactions pills */}
                    {hasReactions && (
                      <div className={cn("flex flex-wrap gap-1 mt-1 px-1", mine && "justify-end")}>
                        {Object.entries(msgReactions)
                          .filter(([, users]) => users.length > 0)
                          .map(([emoji, users]) => {
                            const iMine = users.includes(profile.user_id);
                            return (
                              <button
                                type="button"
                                key={emoji}
                                onClick={() => toggleReaction(m.id, emoji)}
                                className={cn(
                                  "inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-xs transition-all hover:scale-105",
                                  iMine
                                    ? "bg-violet-500/30 border-violet-400/50 text-white"
                                    : "bg-[#1a1a3a] border-violet-500/20 text-white/70 hover:bg-violet-500/15",
                                )}
                              >
                                {emoji} <span className="font-bold">{users.length}</span>
                              </button>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input area */}
          <div className="border-t border-violet-500/20 bg-[#0a0a1a]/60">
            {/* Reply preview */}
            {replyTo && (
              <div className="flex items-center gap-2 px-4 py-2 bg-violet-500/10 border-b border-violet-500/20">
                <Reply className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-cyan-400">{replyTo.author_name.split(" ")[0]}</p>
                  <p className="text-[10px] text-white/60 truncate">{replyTo.body}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="text-violet-300/60 hover:text-white text-xs px-1"
                  title="Cancelar resposta"
                >
                  ✕
                </button>
              </div>
            )}

            <form onSubmit={send} className="flex items-end gap-2 p-3">
              <Avatar name={profile.full_name} photo={(profile as any).avatar_photo_url} userId={profile.user_id} size={8} />
              <textarea
                ref={inputRef}
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={replyTo ? `Respondendo a ${replyTo.author_name.split(" ")[0]}...` : `Mensagem para ${turma}...`}
                rows={1}
                maxLength={500}
                className="chat-textarea flex-1 resize-none rounded-2xl bg-[#1a1a3a] border border-violet-500/30 px-3 py-2 text-sm text-white placeholder:text-violet-200/40 focus:outline-none focus:border-cyan-400/60 max-h-32 overflow-y-auto"
              />
              <Button
                type="submit"
                disabled={!text.trim()}
                className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white rounded-2xl h-10 w-10 p-0 flex items-center justify-center flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
