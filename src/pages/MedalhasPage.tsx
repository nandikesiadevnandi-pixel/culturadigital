import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MEDALS, isMedalEarned, MedalStats } from "@/data/medalhas";
import { localGetCount, localGetSet } from "@/lib/localProgress";

export default function MedalhasPage() {
  const { profile, user } = useAuth();
  const [challenges, setChallenges] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase.from("code_challenge_progress").select("*", { count: "exact", head: true }).eq("user_id", user.id)
      .then(({ count }) => setChallenges(count ?? 0));
  }, [user]);

  if (!profile || !user) return <div className="container py-20 text-center text-muted-foreground">Carregando...</div>;

  const stats: MedalStats = {
    xp: profile.total_xp,
    level: profile.level,
    challengesCompleted: challenges,
    gamesPlayed: localGetCount(user.id, "games_played"),
    quizzesTaken: localGetCount(user.id, "quizzes_taken"),
    lessonsRead: localGetSet(user.id, "lessons_read").size,
  };

  const earned = MEDALS.filter((m) => isMedalEarned(m, stats));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#0a0a1a]">
      <div className="container py-10">
        <Link to="/aluno"><Button variant="ghost" className="mb-6 text-violet-200 hover:text-white"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button></Link>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-extrabold text-white md:text-4xl">🏅 Medalhas</h1>
          <p className="text-violet-200/70">{earned.length} de {MEDALS.length} conquistadas</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {MEDALS.map((m) => {
            const got = isMedalEarned(m, stats);
            return (
              <Card key={m.id} className={`relative p-5 text-center backdrop-blur-xl transition-all ${got ? "border-amber-400/50 bg-[#0f0f24]/80 shadow-[0_0_30px_rgba(251,191,36,0.25)]" : "border-violet-500/10 bg-[#0a0a1a]/60 opacity-60"}`}>
                {!got && <Lock className="absolute right-2 top-2 h-4 w-4 text-violet-200/40" />}
                <div className={`mx-auto mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full text-4xl ${got ? `bg-gradient-to-br ${m.color} shadow-lg` : "bg-violet-950/50 grayscale"}`}>{m.emoji}</div>
                <h3 className={`font-display text-sm font-extrabold ${got ? "text-white" : "text-violet-200/50"}`}>{m.title}</h3>
                <p className="mt-1 text-xs text-violet-200/60">{m.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
