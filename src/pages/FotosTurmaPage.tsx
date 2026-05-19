import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Camera, Trash2, X } from "lucide-react";
import { toast } from "sonner";

type Photo = {
  id: string;
  user_id: string;
  author_name: string;
  class_name: string;
  storage_path: string;
  caption: string | null;
  created_at: string;
  url?: string;
};

const BUCKET = "class-photos";

export default function FotosTurmaPage() {
  const { profile, isAdmin } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [camOpen, setCamOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const turma = profile?.class_name ?? "";

  const load = async () => {
    if (!turma) return;
    setLoading(true);
    const { data } = await supabase
      .from("class_photos")
      .select("*")
      .eq("class_name", turma)
      .order("created_at", { ascending: false })
      .limit(60);
    const withUrls = (data ?? []).map((p: any) => ({
      ...p,
      url: supabase.storage.from(BUCKET).getPublicUrl(p.storage_path).data.publicUrl,
    }));
    setPhotos(withUrls);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turma]);

  const openCam = async () => {
    setCamOpen(true);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
    } catch (e: any) {
      toast.error("Não consegui acessar a webcam. Permita o acesso na barra do navegador.");
      setCamOpen(false);
    }
  };

  const closeCam = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCamOpen(false);
    setCaption("");
  };

  const capture = async () => {
    if (!videoRef.current || !canvasRef.current || !profile) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d")!.drawImage(v, 0, 0);
    setUploading(true);
    const blob: Blob = await new Promise((res) =>
      c.toBlob((b) => res(b!), "image/jpeg", 0.85)!
    );
    const path = `${profile.user_id}/${Date.now()}.jpg`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, blob, {
      contentType: "image/jpeg",
    });
    if (upErr) {
      toast.error(upErr.message);
      setUploading(false);
      return;
    }
    const { error: insErr } = await supabase.from("class_photos").insert({
      user_id: profile.user_id,
      author_name: profile.full_name,
      school: profile.school,
      class_name: turma,
      storage_path: path,
      caption: caption.trim() || null,
    });
    setUploading(false);
    if (insErr) {
      toast.error(insErr.message);
    } else {
      toast.success("Foto registrada!");
      closeCam();
      load();
    }
  };

  const removePhoto = async (p: Photo) => {
    if (!confirm("Apagar essa foto?")) return;
    await supabase.storage.from(BUCKET).remove([p.storage_path]);
    await supabase.from("class_photos").delete().eq("id", p.id);
    load();
  };

  if (!profile) return null;
  if (!turma) {
    return (
      <div className="container py-20 text-center text-violet-200">
        Sem turma associada — não dá pra ter galeria.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#0a0a1a] py-6">
      <div className="container max-w-5xl">
        <Link to="/aluno" className="inline-flex items-center gap-2 text-violet-200 hover:text-white text-sm mb-3">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-white">📸 Fotos da turma {turma}</h1>
            <p className="text-xs text-violet-200/60">Momentos das nossas aulas</p>
          </div>
          <Button onClick={openCam} className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white">
            <Camera className="h-4 w-4 mr-1" /> Tirar foto
          </Button>
        </div>

        {loading ? (
          <p className="text-violet-200/70 text-center">Carregando...</p>
        ) : photos.length === 0 ? (
          <p className="text-violet-200/60 text-center py-12">Nenhuma foto ainda. Seja o primeiro! 📷</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((p) => {
              const canDelete = p.user_id === profile.user_id || isAdmin;
              return (
                <Card key={p.id} className="border-violet-500/20 bg-[#0f0f24]/80 overflow-hidden group">
                  <div className="aspect-square relative">
                    <img src={p.url} alt={p.caption || ""} className="w-full h-full object-cover" />
                    {canDelete && (
                      <button
                        onClick={() => removePhoto(p)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-black/60 rounded-full p-1.5 text-white transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-violet-100 truncate">{p.caption || "—"}</p>
                    <p className="text-[10px] text-violet-200/50">por {p.author_name}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {camOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 p-4 flex items-center justify-center">
            <div className="bg-[#0f0f24] rounded-2xl border border-violet-500/30 w-full max-w-xl overflow-hidden">
              <div className="flex items-center justify-between p-3 border-b border-violet-500/20">
                <p className="text-white font-bold">Webcam</p>
                <Button variant="ghost" size="sm" onClick={closeCam} className="text-violet-200">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-3 space-y-3">
                <video ref={videoRef} className="w-full rounded-lg bg-black aspect-video" muted playsInline />
                <canvas ref={canvasRef} className="hidden" />
                <Input
                  placeholder="Legenda (opcional)"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="border-violet-500/30 bg-[#0a0a1a] text-white"
                  maxLength={120}
                />
                <Button
                  onClick={capture}
                  disabled={uploading || !stream}
                  className="w-full bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
                >
                  {uploading ? "Enviando..." : "📸 Capturar e salvar"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
