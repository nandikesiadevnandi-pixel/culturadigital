import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PALETTES, paletteById } from "@/lib/themePalettes";
import { toast } from "sonner";
import { ArrowLeft, Camera, Upload, X, Sparkles } from "lucide-react";

const RPM_URL = "https://readyplayer.me/avatar?frameApi&bodyType=halfbody";
const BUCKET  = "avatars";

type PhotoMode = "none" | "webcam" | "upload";

export default function EditProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [fullName,   setFullName]   = useState(profile?.full_name ?? "");
  const [palette,    setPalette]    = useState<string>((profile as any)?.theme_palette ?? "violet");
  const [avatarUrl,  setAvatarUrl]  = useState<string>((profile as any)?.avatar_3d_url ?? "");
  const [photoUrl,   setPhotoUrl]   = useState<string>((profile as any)?.avatar_photo_url ?? "");
  const [showRPM,    setShowRPM]    = useState(false);
  const [photoMode,  setPhotoMode]  = useState<PhotoMode>("none");
  const [stream,     setStream]     = useState<MediaStream | null>(null);
  const [filter,     setFilter]     = useState("none");
  const [uploading,  setUploading]  = useState(false);
  const [saving,     setSaving]     = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef   = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.style.filter = filter;
  }, [filter]);

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
    setPalette((profile as any)?.theme_palette ?? "violet");
    setAvatarUrl((profile as any)?.avatar_3d_url ?? "");
    setPhotoUrl((profile as any)?.avatar_photo_url ?? "");
  }, [profile]);

  // ── Ready Player Me ──
  useEffect(() => {
    const sub = () => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ target: "readyplayerme", type: "subscribe", eventName: "v1.**" }), "*"
      );
    };
    const onMsg = (e: MessageEvent) => {
      try {
        const json = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (json?.eventName === "v1.frame.ready") sub();
        if (json?.eventName === "v1.avatar.exported") {
          const url = json.data?.url as string;
          if (url) { setAvatarUrl(url); setShowRPM(false); toast.success("Avatar 3D criado! Salve o perfil."); }
        }
      } catch {}
    };
    window.addEventListener("message", onMsg);
    const t = setTimeout(sub, 4000);
    return () => { window.removeEventListener("message", onMsg); clearTimeout(t); };
  }, [showRPM]);

  // ── Webcam ──
  const openWebcam = async () => {
    setPhotoMode("webcam");
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      setStream(s);
      if (videoRef.current) { videoRef.current.srcObject = s; await videoRef.current.play(); }
    } catch {
      toast.error("Não consegui acessar a webcam. Permita o acesso no navegador.");
      setPhotoMode("none");
    }
  };

  const closeWebcam = () => {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
    setPhotoMode("none");
    setFilter("none");
  };

  const captureWebcam = async () => {
    if (!videoRef.current || !canvasRef.current || !profile) return;
    const v = videoRef.current, c = canvasRef.current;
    c.width = v.videoWidth; c.height = v.videoHeight;
    const ctx = c.getContext("2d")!;
    ctx.filter = filter;
    ctx.drawImage(v, 0, 0);
    ctx.filter = "none";
    setUploading(true);
    const blob: Blob = await new Promise(res => c.toBlob(b => res(b!), "image/jpeg", 0.9)!);
    await uploadBlob(blob, "jpg");
    closeWebcam();
  };

  // ── File upload ──
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !profile) return;
    if (!f.type.startsWith("image/")) { toast.error("Apenas imagens são permitidas."); return; }
    setUploading(true);
    await uploadBlob(f, f.name.split(".").pop() ?? "jpg");
    if (fileRef.current) fileRef.current.value = "";
  };

  const uploadBlob = async (blob: Blob | File, ext: string) => {
    if (!profile) return;
    const path = `${profile.user_id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg", upsert: true });
    setUploading(false);
    if (error) { toast.error(error.message); return; }
    const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    setPhotoUrl(url);
    toast.success("Foto carregada! Salve o perfil.");
  };

  // ── Save ──
  const save = async () => {
    if (!profile) return;
    if (!fullName.trim()) { toast.error("Nome não pode ficar vazio"); return; }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: fullName.trim(),
      theme_palette: palette,
      avatar_3d_url: avatarUrl || null,
      avatar_photo_url: photoUrl || null,
    }).eq("user_id", profile.user_id);
    setSaving(false);
    if (error) { toast.error(error.message); }
    else { toast.success("Perfil salvo!"); await refreshProfile(); navigate("/aluno"); }
  };

  const p = paletteById(palette);
  const portrait3d = avatarUrl
    ? `${avatarUrl.replace(".glb", "")}.png?expression=happy&pose=power-stance&size=256`
    : null;

  const currentAvatar = photoUrl || portrait3d;

  const FILTERS = [
    { id: "none",                               name: "Normal" },
    { id: "grayscale(1)",                       name: "P&B" },
    { id: "sepia(1)",                           name: "Sépia" },
    { id: "saturate(2)",                        name: "Pop" },
    { id: "contrast(1.4) brightness(1.1)",      name: "Drama" },
    { id: "hue-rotate(180deg)",                 name: "Neon" },
    { id: "brightness(1.2) contrast(0.9)",      name: "Soft" },
    { id: "saturate(0.8) brightness(0.95)",     name: "Vintage" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#0a0a1a] py-8">
      <div className="container max-w-3xl">
        <Link to="/aluno" className="inline-flex items-center gap-2 text-violet-200 hover:text-white text-sm mb-4">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <h1 className="font-display text-3xl font-extrabold text-white mb-6 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-cyan-300" /> Editar meu perfil
        </h1>

        <div className="grid md:grid-cols-2 gap-4">

          {/* ── Foto de perfil ── */}
          <div className="border border-violet-500/20 bg-[#0f0f24]/80 rounded-2xl p-5 backdrop-blur">
            <h2 className="text-white font-bold mb-4">📸 Foto de perfil</h2>

            {/* Preview */}
            <div className={`mx-auto h-36 w-36 rounded-full bg-gradient-to-br ${p.from} ${p.via} ${p.to} flex items-center justify-center overflow-hidden shadow-xl mb-4`}>
              {currentAvatar
                ? <img src={currentAvatar} alt="avatar" className="h-full w-full object-cover" />
                : <span className="text-5xl">🧑‍🚀</span>
              }
            </div>

            <p className="text-xs text-violet-200/60 text-center mb-4">
              Tire uma foto pela webcam ou envie do computador
            </p>

            {/* Action buttons */}
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                onClick={openWebcam}
                className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white w-full"
              >
                <Camera className="mr-2 h-4 w-4" /> Tirar foto pela webcam
              </Button>

              <label className="w-full cursor-pointer">
                <div className="flex items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-200 hover:text-white hover:bg-violet-500/20 transition py-2 px-4 text-sm font-medium">
                  <Upload className="h-4 w-4" />
                  {uploading ? "Enviando..." : "Enviar foto do computador"}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={onFileChange}
                />
              </label>

              {photoUrl && (
                <button
                  type="button"
                  onClick={() => setPhotoUrl("")}
                  className="text-xs text-red-400/70 hover:text-red-400 text-center"
                >
                  Remover foto
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="my-4 flex items-center gap-2">
              <div className="flex-1 h-px bg-violet-500/20" />
              <span className="text-xs text-violet-200/50">ou</span>
              <div className="flex-1 h-px bg-violet-500/20" />
            </div>

            <Button
              type="button"
              onClick={() => setShowRPM(true)}
              variant="ghost"
              className="w-full text-violet-200 hover:text-white border border-violet-500/20 hover:bg-violet-500/10"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {avatarUrl ? "Mudar avatar 3D" : "Criar avatar 3D (Ready Player Me)"}
            </Button>
          </div>

          {/* ── Nome + Paleta ── */}
          <div className="border border-violet-500/20 bg-[#0f0f24]/80 rounded-2xl p-5 backdrop-blur">
            <div className="space-y-4">
              <div>
                <Label className="text-violet-200">Como quero ser chamado</Label>
                <Input
                  className="mt-1 border-violet-500/30 bg-[#0a0a1a] text-white"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  maxLength={60}
                />
              </div>

              <div>
                <Label className="text-violet-200 mb-2 block">Paleta da plataforma</Label>
                <div className="grid grid-cols-3 gap-2">
                  {PALETTES.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPalette(opt.id)}
                      className={`rounded-xl p-2 border-2 transition ${palette === opt.id ? "border-white" : "border-transparent"}`}
                    >
                      <div className={`h-12 rounded-lg bg-gradient-to-br ${opt.from} ${opt.via} ${opt.to}`} />
                      <p className="text-xs text-white mt-1">{opt.emoji} {opt.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={save}
                disabled={saving}
                className="w-full bg-gradient-to-r from-violet-500 to-cyan-400 text-white font-bold"
              >
                {saving ? "Salvando..." : "💾 Salvar perfil"}
              </Button>
            </div>
          </div>
        </div>

        {/* ── Webcam Modal ── */}
        {photoMode === "webcam" && (
          <div className="fixed inset-0 z-50 bg-black/90 p-4 flex items-center justify-center">
            <div className="bg-[#0f0f24] rounded-2xl border border-violet-500/30 w-full max-w-md overflow-hidden">
              <div className="flex items-center justify-between p-3 border-b border-violet-500/20">
                <p className="text-white font-bold">📸 Tirar foto de perfil</p>
                <Button variant="ghost" size="sm" onClick={closeWebcam} className="text-violet-200">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 space-y-3">
                <div className="relative overflow-hidden rounded-xl aspect-square bg-black">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                  {/* Circle guide overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 rounded-full border-2 border-white/40" />
                  </div>
                </div>
                <canvas ref={canvasRef} className="hidden" />

                {/* Filters */}
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {FILTERS.map(f => (
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
                  onClick={captureWebcam}
                  disabled={uploading || !stream}
                  className="w-full bg-gradient-to-r from-violet-500 to-cyan-400 text-white font-bold"
                >
                  {uploading ? "Salvando..." : "📸 Usar esta foto"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── Ready Player Me Modal ── */}
        {showRPM && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center">
            <div className="bg-[#0f0f24] rounded-2xl border border-violet-500/30 w-full max-w-3xl h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-3 border-b border-violet-500/20">
                <p className="text-white font-bold">Crie seu avatar 3D</p>
                <Button variant="ghost" size="sm" onClick={() => setShowRPM(false)} className="text-violet-200">Fechar</Button>
              </div>
              <iframe
                ref={iframeRef}
                src={RPM_URL}
                allow="camera *; microphone *; clipboard-write"
                className="flex-1 w-full"
                title="Ready Player Me"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
