import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Trash2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

type Msg = {
  id: string;
  user_id: string;
  author_name: string;
  class_name: string;
  body: string;
  created_at: string;
};

export default function ChatTurmaPage() {
  const { profile, isAdmin } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatEnabled, setChatEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const turma = profile?.class_name ?? "";

  useEffect(() => {
    if (!turma) return;
    supabase
      .from("class_settings")
      .select("chat_enabled")
      .eq("class_name", turma)
      .maybeSingle()
      .then(({ data }) => setChatEnabled(data?.chat_enabled ?? true));
  }, [turma]);

  useEffect(() => {
    if (!turma) return;
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("class_name", turma)
        .order("created_at", { ascending: true })
        .limit(200);
      if (active) {
        setMessages((data ?? []) as Msg[]);
        setLoading(false);
      }
    })();

    const channel = supabase
      .channel(`chat-${turma}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `class_name=eq.${turma}` },
        (payload) => setMessages((m) => [...m, payload.new as Msg])
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "chat_messages", filter: `class_name=eq.${turma}` },
        (payload) => setMessages((m) => m.filter((x) => x.id !== (payload.old as any).id))
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [turma]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatEnabled && !isAdmin) {
      toast.error("Chat desligado pela professora.");
      return;
    }
    const body = text.trim();
    if (!body || !profile) return;
    setText("");
    const { error } = await supabase.from("chat_messages").insert({
      user_id: profile.user_id,
      author_name: profile.full_name,
      school: profile.school,
      class_name: turma,
      body,
    });
    if (error) toast.error(error.message);
  };

  const removeMsg = async (id: string) => {
    const { error } = await supabase.from("chat_messages").delete().eq("id", id);
    if (error) toast.error(error.message);
  };

  if (!profile) return null;
  if (!turma) {
    return (
      <div className="container py-20 text-center text-violet-200">
        Você precisa estar associado a uma turma para usar o chat.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#0a0a1a] py-6">
      <div className="container max-w-3xl">
        <Link to="/aluno" className="inline-flex items-center gap-2 text-violet-200 hover:text-white text-sm mb-3">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <Card className="border-violet-500/20 bg-[#0f0f24]/80 backdrop-blur flex flex-col h-[75vh]">
          <div className="p-4 border-b border-violet-500/20 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-cyan-300" />
            <div>
              <h1 className="text-white font-bold">Chat da turma {turma}</h1>
              <p className="text-xs text-violet-200/60">{profile.school} · só sua turma vê esse chat</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading ? (
              <p className="text-violet-200/60 text-sm">Carregando...</p>
            ) : messages.length === 0 ? (
              <p className="text-violet-200/60 text-sm text-center mt-10">
                Nenhuma mensagem ainda. Manda um oi! 👋
              </p>
            ) : (
              messages.map((m) => {
                const mine = m.user_id === profile.user_id;
                const canDelete = mine || isAdmin;
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`group max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                        mine
                          ? "bg-gradient-to-br from-violet-500 to-cyan-500 text-white"
                          : "bg-[#1a1a3a] text-violet-100 border border-violet-500/20"
                      }`}
                    >
                      {!mine && (
                        <p className="text-[10px] font-bold text-cyan-300 mb-0.5">{m.author_name}</p>
                      )}
                      <p className="whitespace-pre-wrap break-words">{m.body}</p>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <span className="text-[10px] opacity-60">
                          {new Date(m.created_at).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {canDelete && (
                          <button
                            onClick={() => removeMsg(m.id)}
                            className="opacity-0 group-hover:opacity-100 transition"
                            title="Apagar"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={send} className="p-3 border-t border-violet-500/20 flex gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Mensagem para ${turma}...`}
              className="border-violet-500/30 bg-[#0a0a1a] text-white"
              maxLength={500}
            />
            <Button type="submit" className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
