import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trophy, Code2, Star, Calendar } from "lucide-react";
import { MEDALHAS } from "@/data/medalhas";

type ProfileFull = {
  user_id: string;
  full_name: string;
  school: string | null;
  class_name: string | null;
  grade_year: number | null;
  total_xp: number;
  level: number;
  avatar_3d_url: string | null;
};

type XpEvent = { id: string; amount: number; source: string; reason: string | null; created_at: string };
type ChallengeProgress = { challenge_id: string; stars: number; completed_at: string };
type CodeProject = { id: string; title: string; html: string; css: string; js: string; updated_at: string };

export default function AdminStudentDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<ProfileFull | null>(null);
  const [xp, setXp] = useState<XpEvent[]>([]);
  const [challenges, setChallenges] = useState<ChallengeProgress[]>([]);
  const [projects, setProjects] = useState<CodeProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [openProject, setOpenProject] = useState<CodeProject | null>(null);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const [{ data: p }, { data: x }, { data: c }, { data: pr }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("xp_events").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(100),
        supabase.from("code_challenge_progress").select("*").eq("user_id", userId),
        supabase.from("code_projects").select("*").eq("user_id", userId).order("updated_at", { ascending: false }),
      ]);
      setProfile(p as ProfileFull);
      setXp((x ?? []) as XpEvent[]);
      setChallenges((c ?? []) as ChallengeProgress[]);
      setProjects((pr ?? []) as CodeProject[]);
      setLoading(false);
    })();
  }, [userId]);

  if (loading) return <div className="container py-20 text-center text-violet-200">Carregando...</div>;
  if (!profile) return <div className="container py-20 text-center text-red-300">Aluno não encontrado.</div>;

  const portrait = profile.avatar_3d_url
    ? `${profile.avatar_3d_url.replace(".glb", "")}.png?expression=happy&pose=power-stance&size=256`
    : null;

  const totalStars = challenges.reduce((a, b) => a + b.stars, 0);
  const conquistadas = MEDALHAS.filter((m) => profile.total_xp >= m.xpNecessario);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#0a0a1a] py-8">
      <div className="container max-w-5xl">
        <Link to="/admin/alunos" className="inline-flex items-center gap-2 text-violet-200 hover:text-white text-sm mb-4">
          <ArrowLeft className="h-4 w-4" /> Voltar aos alunos
        </Link>

        {/* Header */}
        <Card className="border-violet-500/20 bg-[#0f0f24]/80 p-5 backdrop-blur mb-4 flex flex-wrap items-center gap-4">
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 overflow-hidden flex items-center justify-center text-3xl">
            {portrait ? <img src={portrait} alt="" className="h-full w-full object-contain" /> : profile.full_name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl font-extrabold text-white">{profile.full_name}</h1>
            <p className="text-violet-200/70 text-sm">
              {profile.class_name} · {profile.school} · {profile.grade_year}º ano
            </p>
            <div className="mt-2 flex gap-2 flex-wrap text-xs">
              <span className="px-2 py-1 rounded-full bg-violet-500/20 text-violet-100">Nível {profile.level}</span>
              <span className="px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-100">{profile.total_xp} XP</span>
              <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-100">⭐ {totalStars} estrelas</span>
              <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-100">🏅 {conquistadas.length} medalhas</span>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Medalhas */}
          <Card className="border-violet-500/20 bg-[#0f0f24]/80 p-5 backdrop-blur">
            <h2 className="text-white font-bold mb-3 flex items-center gap-2"><Trophy className="h-4 w-4 text-amber-300" /> Medalhas</h2>
            <div className="grid grid-cols-3 gap-2">
              {MEDALHAS.map((m) => {
                const got = profile.total_xp >= m.xpNecessario;
                return (
                  <div
                    key={m.id}
                    className={`p-2 rounded-xl border text-center ${
                      got ? "border-amber-500/40 bg-amber-500/10" : "border-violet-500/20 bg-[#0a0a1a] opacity-50"
                    }`}
                  >
                    <div className="text-2xl">{m.emoji}</div>
                    <p className="text-[10px] text-violet-100 font-bold">{m.nome}</p>
                    <p className="text-[9px] text-violet-200/50">{m.xpNecessario} XP</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Desafios de código */}
          <Card className="border-violet-500/20 bg-[#0f0f24]/80 p-5 backdrop-blur">
            <h2 className="text-white font-bold mb-3 flex items-center gap-2"><Star className="h-4 w-4 text-cyan-300" /> Desafios concluídos</h2>
            {challenges.length === 0 ? (
              <p className="text-violet-200/60 text-sm">Nenhum desafio ainda.</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {challenges.map((c) => (
                  <li key={c.challenge_id} className="flex justify-between text-violet-100">
                    <span>{c.challenge_id}</span>
                    <span className="text-amber-300">{"★".repeat(c.stars)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Projetos de código */}
          <Card className="border-violet-500/20 bg-[#0f0f24]/80 p-5 backdrop-blur lg:col-span-2">
            <h2 className="text-white font-bold mb-3 flex items-center gap-2"><Code2 className="h-4 w-4 text-violet-300" /> Sites criados</h2>
            {projects.length === 0 ? (
              <p className="text-violet-200/60 text-sm">Nenhum projeto ainda.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-2">
                {projects.map((pr) => (
                  <button
                    key={pr.id}
                    onClick={() => setOpenProject(pr)}
                    className="text-left p-3 rounded-xl border border-violet-500/20 bg-[#0a0a1a] hover:border-cyan-400/50 transition"
                  >
                    <p className="text-white font-bold text-sm">{pr.title}</p>
                    <p className="text-xs text-violet-200/50">{new Date(pr.updated_at).toLocaleString("pt-BR")}</p>
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Histórico de XP */}
          <Card className="border-violet-500/20 bg-[#0f0f24]/80 p-5 backdrop-blur lg:col-span-2">
            <h2 className="text-white font-bold mb-3 flex items-center gap-2"><Calendar className="h-4 w-4 text-emerald-300" /> Histórico de evolução</h2>
            {xp.length === 0 ? (
              <p className="text-violet-200/60 text-sm">Sem eventos ainda.</p>
            ) : (
              <ul className="space-y-1 text-sm max-h-72 overflow-y-auto">
                {xp.map((e) => (
                  <li key={e.id} className="flex justify-between gap-2 text-violet-100 border-b border-violet-500/10 pb-1">
                    <span className="truncate">
                      <span className="text-cyan-300 font-bold">+{e.amount} XP</span> · {e.source}
                      {e.reason ? ` — ${e.reason}` : ""}
                    </span>
                    <span className="text-violet-200/50 text-xs whitespace-nowrap">
                      {new Date(e.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {openProject && (
          <div className="fixed inset-0 z-50 bg-black/80 p-4 flex items-center justify-center" onClick={() => setOpenProject(null)}>
            <div className="bg-[#0f0f24] rounded-2xl border border-violet-500/30 w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="p-3 border-b border-violet-500/20 flex justify-between items-center">
                <p className="text-white font-bold">{openProject.title}</p>
                <button onClick={() => setOpenProject(null)} className="text-violet-200 hover:text-white">Fechar</button>
              </div>
              <iframe
                title="preview"
                className="flex-1 bg-white"
                srcDoc={`<!doctype html><html><head><style>${openProject.css}</style></head><body>${openProject.html}<script>${openProject.js}<\/script></body></html>`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
