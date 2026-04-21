import { weeks } from "@/data/weeks";
import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

const gradByColor: Record<string, string> = {
  purple: "gradient-purple",
  blue: "gradient-blue",
  yellow: "gradient-yellow",
  green: "gradient-green",
  pink: "gradient-pink",
};

export const Gallery = () => {
  return (
    <section id="gallery" className="container py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-block rounded-full bg-pink/15 px-4 py-1.5 text-sm font-bold text-pink">
          Galeria de evidências
        </span>
        <h2 className="mt-4 font-display text-4xl font-extrabold md:text-5xl">
          O trabalho dos <span className="text-gradient">alunos em imagens</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Espaço reservado para fotos e capturas de tela dos projetos, organizados por semana.
        </p>
      </div>

      <div className="mt-12 space-y-10">
        {weeks.map((w) => (
          <div key={w.number}>
            <div className="mb-4 flex items-center gap-3">
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-soft", gradByColor[w.color])}>
                {w.emoji}
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
                  Semana {w.number}
                </p>
                <h3 className="font-display text-xl font-extrabold">{w.title}</h3>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/40 transition-smooth hover:border-primary hover:bg-muted"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground transition-smooth group-hover:text-primary">
                    <ImagePlus className="h-8 w-8" />
                    <span className="text-sm font-bold">Foto {i + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
