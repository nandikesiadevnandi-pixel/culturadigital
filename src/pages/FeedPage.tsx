import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Heart, MessageSquare, Send, Trash2, ImagePlus, Camera, X, ShieldAlert } from "lucide-react";
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

const FILTERS = [
  { id: "none",                               name: "Normal" },
  { id: "grayscale(1)",                       name: "P&B" },
  { id: "sepia(1)",                           name: "Sépia" },
  { id: "saturate(2)",                        name: "Pop" },
  { id: "contrast(1.4) brightness(1.1)",      name: "Drama" },
  { id: "hue-rotate(180deg)",                 name: "Neon" },
  { id: "brightness(1.2) contrast(0.9)",      name: "Soft" },
  { id: "blur(2px) brightness(1.1)",          name: "Sonho" },
];

const publicUrl = (path: string | null) =>
  path ? supabase.storage.from("social-posts").getPublicUrl(path).data.publicUrl : null;

export default function FeedPage() {
  const { profile, isAdmin } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [likes, setLikes] = useState<Record<string, { count: number; mine: boolean }>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [caption, setCaption] = useState("");
  const [imageSource, setImageSource] = useState<File | Blob | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});

  // Webcam
  const [camOpen, setCamOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [filter, setFilter] = useState("none");
  const [capturing, setCapturing] = useState(false);

  const fileRef   = useRef<HTMLInputElement>(null);
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.style.filter = filter;
  }, [filter]);

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
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.user_id]);

  // Conecta a stream ao <video> assim que ambos estiverem prontos
  useEffect(() => {
    if (!stream || !videoRef.current) return;
    const video = videoRef.current;
    video.srcObject = stream;

    const onReady = async () => {
      try { await video.play(); } catch { /* ignorar erro de autoplay em contextos bloqueados */ }
    };

    if (video.readyState >= 1) {
      onReady();
    } else {
      video.addEventListener("loadedmetadata", onReady, { once: true });
    }

    return () => {
      video.removeEventListener("loadedmetadata", onReady);
    };
  }, [stream, camOpen]);

  // ── Webcam ──
  const openCam = async () => {
    setCamOpen(true);
    setFilter("none");
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      setStream(s);
      // A stream será conectada ao <video> pelo useEffect acima
    } catch {
      toast.error("Não consegui acessar a webcam. Permita o acesso no navegador.");
      setCamOpen(false);
    }
  };

  const closeCam = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCamOpen(false);
  };

  const captureCam = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current, c = canvasRef.current;

    // Garantir que o vídeo tem dados reais (evita frame preto)
    if (v.readyState < 2 || v.videoWidth === 0) {
      toast.error("Câmera ainda carregando, aguarde um instante.");
      return;
    }

    c.width = v.videoWidth; c.height = v.videoHeight;
    const ctx = c.getContext("2d")!;
    ctx.filter = filter;
    ctx.drawImage(v, 0, 0);
    ctx.filter = "none";
    setCapturing(true);
    const blob: Blob = await new Promise((res) => c.toBlob((b) => res(b!), "image/jpeg", 0.85)!);
    setCapturing(false);
    setImageSource(blob);
    setImagePreview(URL.createObjectURL(blob));
    closeCam();
    toast.success("Foto capturada! Adicione uma legenda e publique.");
  };

  const clearImage = () => {
    setImageSource(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── Post ──
  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !turma) return;
    if (!caption.trim() && !imageSource) {
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
      if (imageSource) {
        const isFile = imageSource instanceof File;
        const ext = isFile ? (imageSource.name.split(".").pop() || "jpg") : "jpg";
        const contentType = isFile ? imageSource.type : "image/jpeg";
        const path = `${profile.user_id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("social-posts").upload(path, imageSource, {
          upsert: false,
          contentType,
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
      clearImage();
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

            {/* Image preview */}
            {imagePreview && (
              <div className="relative inline-block">
                <img src={imagePreview} alt="preview" className="max-h-40 rounded-xl object-cover" />
                <button
                  type="button"
                  onClick={clearImage}
                  title="Remover foto"
                  aria-label="Remover foto"
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              {/* File picker */}
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-violet-200 text-sm hover:text-white">
                <ImagePlus className="h-4 w-4" />
                <span>Enviar foto</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setImageSource(f);
                    setImagePreview(f ? URL.createObjectURL(f) : null);
                  }}
                />
              </label>

              {/* Webcam */}
              <button
                type="button"
                onClick={openCam}
                className="inline-flex items-center gap-1.5 text-violet-200 text-sm hover:text-white"
              >
                <Camera className="h-4 w-4" />
                <span>Tirar foto</span>
              </button>

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
                      type="button"
                      onClick={() => deletePost(p.id)}
                      className="text-violet-300/60 hover:text-red-400"
                      title="Apagar post"
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
                      type="button"
                      onClick={() => toggleLike(p.id)}
                      className={`inline-flex items-center gap-1 ${
                        l.mine ? "text-pink-400" : "text-violet-200/70 hover:text-pink-400"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${l.mine ? "fill-pink-400" : ""}`} />
                      {l.count}
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenComments((o) => ({ ...o, [p.id]: !o[p.id] }))}
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
                              type="button"
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
                          onChange={(e) => setCommentDraft((d) => ({ ...d, [p.id]: e.target.value }))}
                          placeholder="Comentar com respeito..."
                          maxLength={300}
                          className="border-violet-500/30 bg-[#0a0a1a] text-white text-sm h-9"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") { e.preventDefault(); sendComment(p.id); }
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

      {/* ── Webcam Modal ── */}
      {camOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 p-4 flex items-center justify-center">
          <div className="bg-[#0f0f24] rounded-2xl border border-violet-500/30 w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-violet-500/20">
              <p className="text-white font-bold">📸 Tirar foto para o feed</p>
              <Button variant="ghost" size="sm" onClick={closeCam} className="text-violet-200">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-3">
              <div className="relative overflow-hidden rounded-xl aspect-video bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
              </div>
              <canvas ref={canvasRef} className="hidden" />

              {/* Filters */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap border flex-shrink-0 transition ${
                      filter === f.id
                        ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                        : "border-violet-500/30 text-violet-200 hover:border-violet-400/50"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>

              <Button
                type="button"
                onClick={captureCam}
                disabled={capturing || !stream}
                className="w-full bg-gradient-to-r from-violet-500 to-cyan-400 text-white font-bold"
              >
                {capturing ? "Capturando..." : "📸 Usar esta foto"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
