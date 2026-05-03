import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Trophy, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { MAX_TOTAL_SCORE } from "@/data/quiz";

type Skill = {
  label: string;
  from: string;
  to: string;
  value: number; // 0-100
  color: string;
  emoji: string;
};

const skills: Skill[] = [
  { label: "Uso do Chromebook",      from: "Nunca usaram", to: "Autonomia básica", value: 100, color: "gradient-purple", emoji: "💻" },
  { label: "Conta Google e e-mail",  from: "Sem conta",    to: "Trocando e-mails", value: 90, color: "gradient-blue",   emoji: "📧" },
  { label: "Lógica de programação",  from: "Conceito novo", to: "Animações no Scratch", value: 85, color: "gradient-yellow", emoji: "🧩" },
  { label: "Confiança digital",      from: "Insegurança",   to: "Protagonismo",    value: 85, color: "gradient-green",  emoji: "🚀" },
  { label: "Trabalho colaborativo",  from: "Individual",   to: "Compartilham projetos", value: 90, color: "gradient-pink", emoji: "🤝" },
];

const Bar = ({ skill }: { skill: Skill }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="rounded-2xl bg-card p-5 shadow-soft transition-smooth hover:shadow-card">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{skill.emoji}</span>
          <h3 className="font-display font-extrabold">{skill.label}</h3>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-sm font-extrabold text-foreground">
          {skill.value}%
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all duration-[1400ms] ease-out", skill.color)}
          style={{ width: visible ? `${skill.value}%` : "0%" }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs font-bold text-muted-foreground">
        <span>{skill.from}</span>
        <span>→ {skill.to}</span>
      </div>
    </div>
  );
};

export const Progress = () => {
  const [stats, setStats] = useState<{ count: number; avg: number; top: number } | null>(null);
  const [top5, setTop5] = useState<{ name: string; score: number; cls: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("submissions")
        .select("student_name, class_number, total_score")
        .order("total_score", { ascending: false });
      if (!data || data.length === 0) {
        setStats({ count: 0, avg: 0, top: 0 });
        setTop5([]);
        return;
      }
      const scores = data.map((d: any) => d.total_score as number);
      const sum = scores.reduce((a, b) => a + b, 0);
      setStats({
        count: scores.length,
        avg: sum / scores.length,
        top: Math.max(...scores),
      });
      setTop5(
        data.slice(0, 5).map((d: any) => ({
          name: d.student_name,
          score: d.total_score,
          cls: d.class_number,
        }))
      );
    };
    load();

    const channel = supabase
      .channel("progress-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "submissions" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const avgPct = stats && stats.count > 0 ? Math.round((stats.avg / MAX_TOTAL_SCORE) * 100) : 0;

  return (
    <section id="progress" className="bg-muted/40 py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-success/15 px-4 py-1.5 text-sm font-bold text-success">
            Progresso dos alunos
          </span>
          <h2 className="mt-4 font-display text-4xl font-extrabold md:text-5xl">
            De curiosos a <span className="text-gradient">criadores digitais</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Indicadores qualitativos da evolução da turma desde a primeira aula.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:gap-5">
          {skills.map((s) => (
            <Bar key={s.label} skill={s} />
          ))}
        </div>

        {/* Resultado real das avaliações */}
        <div className="mt-10 overflow-hidden rounded-3xl border bg-card p-6 shadow-soft md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-purple text-2xl shadow-soft">
                <BarChart3 className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  Conhecimento da matéria
                </span>
                <h3 className="mt-2 font-display text-2xl font-extrabold md:text-3xl">
                  Resultado das avaliações
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Dados reais coletados na avaliação de Cultura Digital.
                </p>
                <p className="mt-1 text-xs font-bold text-muted-foreground">
                  📅 Avaliação aplicada em 30/04/2026
                </p>
              </div>
            </div>
            <Link
              to="/ranking"
              className="inline-flex items-center justify-center gap-2 rounded-full gradient-purple px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft transition-smooth hover:-translate-y-0.5"
            >
              Ver ranking completo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {stats && stats.count > 0 ? (
            <>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-muted/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Alunos avaliados
                  </p>
                  <p className="mt-1 font-display text-3xl font-extrabold text-foreground">
                    {stats.count}
                  </p>
                </div>
                <div className="rounded-2xl bg-muted/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Média da turma
                  </p>
                  <p className="mt-1 font-display text-3xl font-extrabold text-primary">
                    {stats.avg.toFixed(1)}
                    <span className="text-base font-bold text-muted-foreground"> / {MAX_TOTAL_SCORE}</span>
                  </p>
                </div>
                <div className="rounded-2xl bg-muted/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Maior nota
                  </p>
                  <p className="mt-1 flex items-center gap-2 font-display text-3xl font-extrabold text-foreground">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    {stats.top}/{MAX_TOTAL_SCORE}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm font-bold">
                  <span>Aproveitamento médio</span>
                  <span className="text-primary">{avgPct}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full gradient-purple transition-all duration-[1400ms] ease-out"
                    style={{ width: `${avgPct}%` }}
                  />
                </div>
              </div>

              {top5.length > 0 && (
                <div className="mt-8">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-2xl">🍫</span>
                    <h4 className="font-display text-lg font-extrabold">
                      Gratificação — Top 5 da prof Késia
                    </h4>
                  </div>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {top5.map((s, i) => (
                      <li
                        key={`${s.name}-${i}`}
                        className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/40 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full gradient-purple text-sm font-extrabold text-primary-foreground shadow-soft">
                            {i + 1}º
                          </span>
                          <div>
                            <p className="font-bold leading-tight">{s.name}</p>
                            <p className="text-xs text-muted-foreground">Turma {s.cls}</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-extrabold text-yellow-700 dark:text-yellow-400">
                          🍫 Gratificação
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Os resultados aparecerão aqui assim que os alunos enviarem a avaliação.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
