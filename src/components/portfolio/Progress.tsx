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
  { label: "Uso do Chromebook",      from: "Nunca usaram", to: "Autonomia básica", value: 85, color: "gradient-purple", emoji: "💻" },
  { label: "Conta Google e e-mail",  from: "Sem conta",    to: "Trocando e-mails", value: 75, color: "gradient-blue",   emoji: "📧" },
  { label: "Lógica de programação",  from: "Conceito novo", to: "Animações no Scratch", value: 60, color: "gradient-yellow", emoji: "🧩" },
  { label: "Confiança digital",      from: "Insegurança",   to: "Protagonismo",    value: 70, color: "gradient-green",  emoji: "🚀" },
  { label: "Trabalho colaborativo",  from: "Individual",   to: "Compartilham projetos", value: 65, color: "gradient-pink", emoji: "🤝" },
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
      </div>
    </section>
  );
};
