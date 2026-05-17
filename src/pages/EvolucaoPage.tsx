import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, Zap, Code2, Gamepad2, BookOpen, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { localGetCount, localGetSet } from "@/lib/localProgress";

const LEVEL_NAMES = ["Iniciante", "Aprendiz", "Codificador", "Hacker", "Mestre Digital"];

export default function EvolucaoPage() {
  const { profile, user } = useAuth();
  const [challengesDone, setChallengesDone] = useState(0);
  const [xpEvents, setXpEvents] = useState<{ created_at: string; amount: number; reason: string | null }[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ count }, { data: ev }] = await Promise.all([
        supabase.from("code_challenge_progress").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("xp_events").select("created_at, amount, reason").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
      ]);
      setChallengesDone(count ?? 0);
      setXpEvents(ev ?? []);
    })();
  }, [user]);

  if (!profile || !user) return <div className="container py-20 text-center text-muted-foreground">Carregando...</div>;

  const xp = profile.total_xp;
  const xpProx = profile.level * 100;
  const xpAnt = (profile.level - 1) * 100;
  const prog = Math.min(100, ((xp - xpAnt) / (xpProx - xpAnt)) * 100);
  const levelName = LEVEL_NAMES[Math.min(profile.level - 1, LEVEL_NAMES.length - 1)];

  const lessonsRead = localGetSet(user.id, "lessons_read").size;
  const games = localGetCount(user.id, "games_played");
  const quizzes = localGetCount(user.id, "quizzes_taken");

  const stats = [
    { icon: Zap, label: "XP Total", value: xp, color: "from-violet-500 to-cyan-400" },
    { icon: TrendingUp, label: "Nível", value: `${profile.level} · ${levelName}`, color: "from-pink-500 to-orange-500" },
    { icon: Code2, label: "Desafios", value: challengesDone, color: "from-amber-400 to-pink-500" },
    { icon: BookOpen, label: "Aulas lidas", value: lessonsRead, color: "from-emerald-400 to-cyan-500" },
    { icon: Gamepad2, label: "Jogos", value: games, color: "from-cyan-400 to-blue-500" },
    { icon: Trophy, label: "Quizzes", value: quizzes, color: "from-fuchsia-500 to-violet-500" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#0a0a1a]">
      <div className="container py-10">
        <Link to="/aluno"><Button variant="ghost" className="mb-6 text-violet-200 hover:text-white"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button></Link>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-extrabold text-white md:text-4xl">📈 Minha Evolução</h1>
          <p className="text-violet-200/70">Acompanhe seu progresso no mundo digital</p>
        </div>

        <Card className="mb-8 border-violet-500/30 bg-[#0f0f24]/80 p-6 backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between text-sm text-violet-200/70">
            <span>Nível {profile.level} · {levelName}</span>
            <span className="font-mono text-cyan-300">{xp} XP</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-violet-950">
            <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_15px_rgba(103,232,249,0.7)] transition-all" style={{ width: `${prog}%` }} />
          </div>
          <p className="mt-2 text-xs text-violet-200/50">{xpProx - xp} XP até o nível {profile.level + 1}</p>
        </Card>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.label} className="border-violet-500/20 bg-[#0f0f24]/80 p-5 backdrop-blur-xl">
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color}`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-extrabold text-white">{s.value}</div>
              <div className="text-xs text-violet-200/60">{s.label}</div>
            </Card>
          ))}
        </div>

        <Card className="border-violet-500/20 bg-[#0f0f24]/80 p-6 backdrop-blur-xl">
          <h2 className="mb-4 font-display text-lg font-extrabold text-white">Últimos ganhos de XP</h2>
          {xpEvents.length === 0 ? (
            <p className="text-sm text-violet-200/60">Ainda não há XP registrado. Comece pelos desafios em "Aprendendo a Codar"!</p>
          ) : (
            <ul className="space-y-2">
              {xpEvents.map((e, i) => (
                <li key={i} className="flex items-center justify-between border-b border-violet-500/10 pb-2 last:border-0">
                  <span className="text-sm text-violet-100">{e.reason ?? "Atividade"}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-violet-200/40">{new Date(e.created_at).toLocaleDateString("pt-BR")}</span>
                    <span className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-2 py-0.5 text-xs font-bold text-white">+{e.amount} XP</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
