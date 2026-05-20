import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PALETTES, paletteById } from "@/lib/themePalettes";
import { toast } from "sonner";
import { ArrowLeft, Sparkles } from "lucide-react";

// Ready Player Me embed — subdomínio "demo" é público e funciona pra criação
const RPM_URL = "https://demo.readyplayer.me/avatar?frameApi&clearCache&bodyType=halfbody";

export default function EditProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [palette, setPalette] = useState<string>((profile as any)?.theme_palette ?? "violet");
  const [avatarUrl, setAvatarUrl] = useState<string>((profile as any)?.avatar_3d_url ?? "");
  const [showRPM, setShowRPM] = useState(false);
  const [saving, setSaving] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
    setPalette((profile as any)?.theme_palette ?? "violet");
    setAvatarUrl((profile as any)?.avatar_3d_url ?? "");
  }, [profile]);

  // Recebe avatar do iframe do Ready Player Me
  useEffect(() => {
    const subscribe = () => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ target: "readyplayerme", type: "subscribe", eventName: "v1.**" }),
        "*"
      );
    };
    const onMsg = (e: MessageEvent) => {
      try {
        const json = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (json?.source !== "readyplayerme" && !json?.eventName?.startsWith?.("v1.")) return;
        if (json?.eventName === "v1.frame.ready") subscribe();
        if (json?.eventName === "v1.avatar.exported") {
          const url = json.data?.url as string;
          if (url) {
            setAvatarUrl(url);
            setShowRPM(false);
            toast.success("Avatar 3D pronto! Lembre de salvar.");
          }
        }
      } catch {}
    };
    window.addEventListener("message", onMsg);
    // fallback: tenta inscrever após o iframe carregar
    const t = setTimeout(subscribe, 4000);
    return () => {
      window.removeEventListener("message", onMsg);
      clearTimeout(t);
    };
  }, [showRPM]);

  const save = async () => {
    if (!profile) return;
    if (!fullName.trim()) {
      toast.error("Nome não pode ficar vazio");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        theme_palette: palette,
        avatar_3d_url: avatarUrl || null,
      })
      .eq("user_id", profile.user_id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Perfil salvo!");
      await refreshProfile();
      navigate("/aluno");
    }
  };

  const p = paletteById(palette);

  // Retrato do avatar (PNG do RPM)
  const portrait = avatarUrl
    ? `${avatarUrl.replace(".glb", "")}.png?expression=happy&pose=power-stance&size=256`
    : null;

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
          {/* Avatar */}
          <Card className="border-violet-500/20 bg-[#0f0f24]/80 p-5 backdrop-blur">
            <h2 className="text-white font-bold mb-3">Meu avatar 3D</h2>
            <div className="flex flex-col items-center gap-3">
              <div className={`h-48 w-48 rounded-2xl bg-gradient-to-br ${p.from} ${p.via} ${p.to} flex items-center justify-center overflow-hidden shadow-xl`}>
                {portrait ? (
                  <img src={portrait} alt="meu avatar" className="h-full w-full object-contain" />
                ) : (
                  <span className="text-5xl">🧑‍🚀</span>
                )}
              </div>
              <Button
                onClick={() => setShowRPM(true)}
                className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
              >
                {avatarUrl ? "Mudar avatar" : "Criar meu avatar 3D"}
              </Button>
              <p className="text-xs text-violet-200/60 text-center">
                Personalize cabelo, olhos, roupa e mais. Funciona dentro do site (Ready Player Me).
              </p>
            </div>
          </Card>

          {/* Nome + Paleta */}
          <Card className="border-violet-500/20 bg-[#0f0f24]/80 p-5 backdrop-blur">
            <div className="space-y-4">
              <div>
                <Label className="text-violet-200">Como quero ser chamado</Label>
                <Input
                  className="mt-1 border-violet-500/30 bg-[#0a0a1a] text-white"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-violet-200 mb-2 block">Paleta da plataforma</Label>
                <div className="grid grid-cols-3 gap-2">
                  {PALETTES.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPalette(opt.id)}
                      className={`rounded-xl p-2 border-2 transition ${
                        palette === opt.id ? "border-white" : "border-transparent"
                      }`}
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
                {saving ? "Salvando..." : "Salvar perfil"}
              </Button>
            </div>
          </Card>
        </div>

        {showRPM && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center">
            <div className="bg-[#0f0f24] rounded-2xl border border-violet-500/30 w-full max-w-3xl h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-3 border-b border-violet-500/20">
                <p className="text-white font-bold">Crie seu avatar 3D</p>
                <Button variant="ghost" size="sm" onClick={() => setShowRPM(false)} className="text-violet-200">
                  Fechar
                </Button>
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
