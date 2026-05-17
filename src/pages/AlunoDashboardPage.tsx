import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Gamepad2, Trophy, TrendingUp, Award, LogOut } from "lucide-react";

const LEVEL_NAMES = ["Iniciante", "Aprendiz", "Codificador", "Hacker", "Mestre Digital"];

export default function AlunoDashboardPage() {
  const { profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) navigate("/admin", { replace: true });
  }, [isAdmin, navigate]);

  if (!profile) {
    return <div className="container py-20 text-center text-muted-foreground">Carregando perfil...</div>;
  }

  const xpAtual = profile.total_xp;
  const xpProxNivel = profile.level * 100;
  const xpAnterior = (profile.level - 1) * 100;
  const progresso = Math.min(100, ((xpAtual - xpAnterior) / (xpProxNivel - xpAnterior)) * 100);
  const levelName = LEVEL_NAMES[Math.min(profile.level - 1, LEVEL_NAMES.length - 1)];

  const tiles = [
    { to: "/aluno/trilha", icon: BookOpen, title: "Minha trilha", desc: `Aulas do ${profile.grade_year}º ano`, color: "from-violet-500 to-purple-600" },
    { to: "/aluno/jogos", icon: Gamepad2, title: "Jogos", desc: "Desafios e mini-games", color: "from-cyan-400 to-blue-500" },
    { to: "/avaliacao", icon: Trophy, title: "Quizzes", desc: "Mostre o que sabe", color: "from-pink-500 to-rose-500" },
    { to: "/aluno/evolucao", icon: TrendingUp, title: "Minha evolução", desc: "Veja seu progresso", color: "from-emerald-400 to-cyan-500" },
    { to: "/aluno/medalhas", icon: Award, title: "Medalhas", desc: "Suas conquistas", color: "from-amber-400 to-orange-500" },
    { to: "/galeria", icon: BookOpen, title: "Galeria", desc: "Fotos das aulas", color: "from-fuchsia-500 to-violet-500" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#0a0a1a]">
      <div className="container py-10">
        {/* Header do perfil */}
        <Card className="mb-8 border-violet-500/20 bg-[#0f0f24]/80 p-6 backdrop-blur-xl shadow-[0_0_60px_rgba(99,102,241,0.15)]">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-3xl font-extrabold text-white shadow-[0_0_30px_rgba(167,139,250,0.5)]">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-2xl font-extrabold text-white md:text-3xl">
                Olá, {profile.full_name.split(" ")[0]} 👋
              </h1>
              <p className="text-sm text-violet-200/70">
                {profile.grade_year}º ano · Turma {profile.class_name} · {profile.school}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-3 py-1 text-xs font-extrabold text-white shadow-[0_0_15px_rgba(167,139,250,0.4)]">
                  Nível {profile.level} · {levelName}
                </div>
                <span className="font-mono text-xs text-cyan-300">{xpAtual} XP</span>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-violet-950">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_10px_rgba(103,232,249,0.7)] transition-all"
                  style={{ width: `${progresso}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-violet-200/50">
                {xpProxNivel - xpAtual} XP até o nível {profile.level + 1}
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-violet-200/70 hover:text-white hover:bg-violet-500/20"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>
        </Card>

        {/* Grid de atalhos */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t) => (
            <Link key={t.to} to={t.to}>
              <Card className="group h-full cursor-pointer border-violet-500/20 bg-[#0f0f24]/80 p-6 backdrop-blur-xl transition-all hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(103,232,249,0.25)]">
                <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${t.color} shadow-lg group-hover:scale-110 transition-transform`}>
                  <t.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display text-lg font-extrabold text-white">{t.title}</h3>
                <p className="text-sm text-violet-200/60">{t.desc}</p>
              </Card>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-violet-200/40">
          🚧 Mais conteúdos chegando: aulas, jogos, ranking da turma...
        </p>
      </div>
    </div>
  );
}
