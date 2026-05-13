import { useState } from "react";
import { weeks, type Week } from "@/data/weeks";
import { ChevronDown, Target, BookOpen, Activity, TrendingUp, AlertCircle, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const colorMap: Record<Week["color"], { grad: string; ring: string; chip: string }> = {
  purple: { grad: "gradient-purple", ring: "ring-primary/30", chip: "bg-primary/10 text-primary" },
  blue:   { grad: "gradient-blue",   ring: "ring-secondary/30", chip: "bg-secondary/10 text-secondary" },
  yellow: { grad: "gradient-yellow", ring: "ring-accent/40",    chip: "bg-accent/20 text-accent-foreground" },
  green:  { grad: "gradient-green",  ring: "ring-success/30",   chip: "bg-success/10 text-success" },
  pink:   { grad: "gradient-pink",   ring: "ring-pink/30",      chip: "bg-pink/10 text-pink" },
};

const sections = [
  { key: "objective",    label: "Objetivo de aprendizagem", icon: Target,      field: "objective" as const },
  { key: "taught",       label: "O que foi ensinado",       icon: BookOpen,    field: "taught" as const },
  { key: "activities",   label: "Atividades dos alunos",    icon: Activity,    field: "activities" as const },
  { key: "results",      label: "Resultados e observações", icon: TrendingUp,  field: "results" as const },
  { key: "difficulties", label: "Dificuldades enfrentadas", icon: AlertCircle, field: "difficulties" as const },
  { key: "reflection",   label: "Reflexão da professora",   icon: Heart,       field: "reflection" as const },
];

const WeekCard = ({ week, index }: { week: Week; index: number }) => {
  const [open, setOpen] = useState(index === 0);
  const c = colorMap[week.color];

  return (
    <div className="relative pl-8 md:pl-0">
      {/* Timeline dot (mobile) */}
      <div className={cn("absolute left-0 top-8 h-5 w-5 rounded-full ring-4 ring-background md:hidden", c.grad)} />

      <article
        className={cn(
          "group rounded-3xl bg-card shadow-card transition-smooth ring-1 ring-border hover:-translate-y-1",
          open && `ring-2 ${c.ring}`
        )}
      >
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center gap-4 rounded-3xl p-5 text-left md:p-6"
          aria-expanded={open}
        >
          <div className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-soft md:h-20 md:w-20 md:text-4xl", c.grad)}>
            <span>{week.emoji}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-extrabold", c.chip)}>
                {week.date}
              </span>
            </div>
            <h3 className="mt-1 font-display text-xl font-extrabold leading-tight md:text-2xl">
              {week.title}
            </h3>
          </div>
          <ChevronDown
            className={cn(
              "h-6 w-6 shrink-0 text-muted-foreground transition-transform duration-300",
              open && "rotate-180 text-foreground"
            )}
          />
        </button>

        {open && (
          <div className="grid gap-4 border-t border-border p-5 md:grid-cols-2 md:p-6 animate-fade-in">
            {sections.map((s) => {
              const value = week[s.field];
              return (
                <div key={s.key} className="rounded-2xl bg-muted/50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-primary-foreground", c.grad)}>
                      <s.icon className="h-4 w-4" />
                    </div>
                    <h4 className="font-display text-sm font-extrabold uppercase tracking-wide">
                      {s.label}
                    </h4>
                  </div>
                  {Array.isArray(value) ? (
                    <ul className="space-y-1.5 pl-1 text-sm leading-relaxed text-muted-foreground">
                      {value.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm leading-relaxed text-muted-foreground">{value}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </article>
    </div>
  );
};

export const Timeline = () => {
  return (
    <section id="timeline" className="relative py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-secondary/15 px-4 py-1.5 text-sm font-bold text-secondary">
            Linha do tempo
          </span>
          <h2 className="mt-4 font-display text-4xl font-extrabold md:text-5xl">
            Toda segunda, terça e sexta-feira, <span className="text-gradient">uma nova descoberta</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Clique em cada aula para ver objetivos, atividades, resultados e reflexões.
          </p>
        </div>

        <div className="relative mt-14">
          {/* Vertical line (mobile) */}
          <div className="absolute left-2 top-0 h-full w-0.5 bg-gradient-to-b from-primary via-secondary to-accent md:hidden" />

          <div className="space-y-6">
            {weeks.map((w, i) => (
              <WeekCard key={w.number} week={w} index={i} />
            ))}
          </div>

          <div className="mt-8 rounded-3xl border-2 border-dashed border-border p-8 text-center">
            <p className="font-display text-lg font-bold text-muted-foreground">
              ✨ Mais aulas em breve — esse portfólio cresce toda segunda, terça e sexta-feira.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
