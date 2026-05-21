import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Heart, MessageSquare, Send, Trash2, ImagePlus, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { moderateText, logFlag } from "@/lib/moderation";

type Post = {
  id: string;
  user_id: string;
  author_name: string;
  class_name: string;
  image_path: string | null;
  caption: string;
  created_at: string;
};

type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  body: string;
  created_at: string;
};

const publicUrl = (path: string | null) =>
  path ? supabase.storage.from("social-posts").getPublicUrl(path).data.publicUrl : null;

export default function FeedPage() {
  const { profile, isAdmin } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [likes, setLikes] = useState<Record<string, { count: number; mine: boolean }>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [posting, setPosting] = useState(false);
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const turma = profile?.class_name ?? "";

  const loadAll = async () => {
    const { data: postsData } = await supabase
      .from("social_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    const list = (postsData ?? []) as Post[];
    setPosts(list);
    if (list.length === 0) return;

    const ids = list.map((p) => p.id);
    const [{ data: likesData }, { data: commentsData }] = await Promise.all([
      supabase.from("social_likes").select("post_id,user_id").in("post_id", ids),
      supabase.from("social_comments").select("*").in("post_id", ids).order("created_at"),
    ]);

    const likeMap: Record<string, { count: number; mine: boolean }> = {};
    (likesData ?? []).forEach((l: any) => {
      const cur = likeMap[l.post_id] ?? { count: 0, mine: false };
      cur.count++;
      if (l.user_id === profile?.user_id) cur.mine = true;
      likeMap[l.post_id] = cur;
    });
    setLikes(likeMap);

    const cmap: Record<string, Comment[]> = {};
    (commentsData ?? []).forEach((c: any) => {
      (cmap[c.post_id] ??= []).push(c);
    });
    setComments(cmap);
  };

  useEffect(() => {
    if (!profile) return;
    loadAll();
    const ch = supabase
      .channel("feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "social_posts" }, loadAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "social_likes" }, loadAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "social_comments" }, loadAll)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.user_id]);

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !turma) return;
    if (!caption.trim() && !file) {
      toast.error("Escreva uma legenda ou escolha uma foto.");
      return;
    }
    setPosting(true);
    try {
      if (caption.trim()) {
        const mod = await moderateText(caption.trim(), "post_feed");
        if (!mod.allowed) {
          await logFlag({
            user_id: profile.user_id,
            author_name: profile.full_name,
            class_name: turma,
            context: "post_feed",
            original_text: caption,
            reason: mod.reason,
            severity: mod.severity,
          });
          toast.error(`🛡️ Bloqueado pela IA: ${mod.reason || "conteúdo inadequado"}`, {
            description: mod.suggestion ? `Sugestão: ${mod.suggestion}` : undefined,
          });
          setPosting(false);
          return;
        }
      }

      let imagePath: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${profile.user_id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("social-posts").upload(path, file, {
          upsert: false,
          contentType: file.type,
        });
        if (upErr) throw upErr;
        imagePath = path;
      }

      const { error } = await supabase.from("social_posts").insert({
        user_id: profile.user_id,
        author_name: profile.full_name,
        school: profile.school,
        class_name: turma,
        image_path: imagePath,
        caption: caption.trim(),
      });
      if (error) throw error;
      setCaption("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      toast.success("Publicado! 🎉");
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao publicar");
    } finally {
      setPosting(false);
    }
  };

  const toggleLike = async (postId: string) => {
    if (!profile) return;
    const mine = likes[postId]?.mine;
    if (mine) {
      await supabase.from("social_likes").delete().eq("post_id", postId).eq("user_id", profile.user_id);
    } else {
      await supabase.from("social_likes").insert({ post_id: postId, user_id: profile.user_id });
    }
  };

  const sendComment = async (postId: string) => {
    if (!profile) return;
    const body = (commentDraft[postId] ?? "").trim();
    if (!body) return;
    const mod = await moderateText(body, "comment_feed");
    if (!mod.allowed) {
      await logFlag({
        user_id: profile.user_id,
        author_name: profile.full_name,
        class_name: turma,
        context: "comment_feed",
        original_text: body,
        reason: mod.reason,
        severity: mod.severity,
      });
      toast.error(`🛡️ Bloqueado: ${mod.reason || "linguagem inadequada"}`);
      return;
    }
    const { error } = await supabase.from("social_comments").insert({
      post_id: postId,
      user_id: profile.user_id,
      author_name: profile.full_name,
      body,
    });
    if (error) toast.error(error.message);
    else setCommentDraft((d) => ({ ...d, [postId]: "" }));
  };

  const deletePost = async (id: string) => {
    if (!confirm("Apagar este post?")) return;
    await supabase.from("social_posts").delete().eq("id", id);
  };

  const deleteComment = async (id: string) => {
    await supabase.from("social_comments").delete().eq("id", id);
  };

  if (!profile) return null;
  if (!turma) {
    return (
      <div className="container py-20 text-center text-violet-200">
        Você precisa estar associado a uma turma para usar o feed.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#0a0a1a] py-6">
      <div className="container max-w-2xl">
        <Link to="/aluno" className="inline-flex items-center gap-2 text-violet-200 hover:text-white text-sm mb-3">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <Card className="border-violet-500/20 bg-[#0f0f24]/80 backdrop-blur p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-white font-bold text-lg">Feed da turma {turma}</h1>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">
              <ShieldAlert className="h-3 w-3" /> IA anti-bullying ativa
            </span>
          </div>
          <form onSubmit={createPost} className="space-y-2">
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="O que você quer compartilhar com a turma?"
              maxLength={500}
              className="border-violet-500/30 bg-[#0a0a1a] text-white"
            />
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-2 cursor-pointer text-violet-200 text-sm hover:text-white">
                <ImagePlus className="h-4 w-4" />
                <span>{file ? file.name : "Adicionar foto"}</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <Button
                type="submit"
                disabled={posting}
                className="ml-auto bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
              >
                {posting ? "Publicando..." : "Publicar"}
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          {posts.length === 0 && (
            <p className="text-violet-200/60 text-center py-10">
              Ainda não tem posts. Seja o primeiro! ✨
            </p>
          )}
          {posts.map((p) => {
            const url = publicUrl(p.image_path);
            const l = likes[p.id] ?? { count: 0, mine: false };
            const cs = comments[p.id] ?? [];
            const canDelete = p.user_id === profile.user_id || isAdmin;
            return (
              <Card key={p.id} className="border-violet-500/20 bg-[#0f0f24]/80 backdrop-blur overflow-hidden">
                <div className="flex items-center justify-between p-3">
                  <div>
                    <p className="text-white text-sm font-bold">{p.author_name}</p>
                    <p className="text-[10px] text-violet-200/60">
                      {new Date(p.created_at).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  {canDelete && (
                    <button
                      onClick={() => deletePost(p.id)}
                      className="text-violet-300/60 hover:text-red-400"
                      title="Apagar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {url && (
                  <img src={url} alt="" className="w-full max-h-[500px] object-cover bg-black" />
                )}
                <div className="p-3 space-y-2">
                  {p.caption && (
                    <p className="text-violet-100 text-sm whitespace-pre-wrap">{p.caption}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    <button
                      onClick={() => toggleLike(p.id)}
                      className={`inline-flex items-center gap-1 ${
                        l.mine ? "text-pink-400" : "text-violet-200/70 hover:text-pink-400"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${l.mine ? "fill-pink-400" : ""}`} />
                      {l.count}
                    </button>
                    <button
                      onClick={() =>
                        setOpenComments((o) => ({ ...o, [p.id]: !o[p.id] }))
                      }
                      className="inline-flex items-center gap-1 text-violet-200/70 hover:text-cyan-300"
                    >
                      <MessageSquare className="h-4 w-4" />
                      {cs.length}
                    </button>
                  </div>

                  {openComments[p.id] && (
                    <div className="pt-2 border-t border-violet-500/20 space-y-2">
                      {cs.map((c) => (
                        <div key={c.id} className="flex items-start gap-2 text-sm group">
                          <span className="font-bold text-cyan-300">{c.author_name}:</span>
                          <span className="text-violet-100 flex-1 break-words">{c.body}</span>
                          {(c.user_id === profile.user_id || isAdmin) && (
                            <button
                              onClick={() => deleteComment(c.id)}
                              className="opacity-0 group-hover:opacity-100 text-violet-300/60 hover:text-red-400"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          value={commentDraft[p.id] ?? ""}
                          onChange={(e) =>
                            setCommentDraft((d) => ({ ...d, [p.id]: e.target.value }))
                          }
                          placeholder="Comentar com respeito..."
                          maxLength={300}
                          className="border-violet-500/30 bg-[#0a0a1a] text-white text-sm h-9"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              sendComment(p.id);
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={() => sendComment(p.id)}
                          className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
