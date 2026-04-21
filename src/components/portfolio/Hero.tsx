import heroImg from "@/assets/teacher-hero.png";
import { Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <header className="relative overflow-hidden gradient-soft">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full gradient-purple opacity-30 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute top-40 -right-24 h-96 w-96 rounded-full gradient-yellow opacity-30 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full gradient-blue opacity-20 blur-3xl animate-blob" style={{ animationDelay: "6s" }} />

      <div className="container relative grid gap-10 py-16 md:py-24 lg:grid-cols-2 lg:items-center lg:py-28">
        <div className="space-y-6 animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-bold text-primary shadow-soft">
            <Sparkles className="h-4 w-4" />
            Portfólio Docente · 2025
          </span>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] md:text-6xl lg:text-7xl">
            <span className="text-gradient">Cultura Digital</span>
            <br />
            <span className="text-foreground">em Ação</span>
          </h1>
          <p className="text-xl font-semibold text-foreground/80 md:text-2xl">
            Escola Dande Bertoluci · Canela
          </p>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Um registro vivo das aulas de Cultura Digital, onde cada sexta-feira
            é uma nova descoberta com tecnologia e muita criatividade.
            Documentando o caminho de alunos que se tornam protagonistas digitais.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#timeline"
              className="rounded-full gradient-purple px-6 py-3 font-bold text-primary-foreground shadow-glow transition-smooth hover:scale-105 hover:shadow-card"
            >
              Ver as aulas
            </a>
            <a
              href="#about"
              className="rounded-full bg-card px-6 py-3 font-bold text-foreground shadow-soft transition-smooth hover:scale-105"
            >
              Sobre a professora
            </a>
          </div>
        </div>

        <div className="relative animate-scale-in">
          <div className="absolute inset-0 -z-10 mx-auto h-[90%] w-[90%] rounded-[40%] gradient-hero opacity-20 blur-2xl" />
          <div className="relative mx-auto max-w-md animate-float">
            <img
              src={heroImg}
              alt="Professora de Cultura Digital com Chromebook"
              width={1024}
              height={1024}
              className="h-auto w-full drop-shadow-2xl"
            />
          </div>
          {/* Floating badges */}
          <div className="absolute left-2 top-10 hidden rounded-2xl bg-card px-4 py-3 shadow-card md:block animate-float" style={{ animationDelay: "1s" }}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐱</span>
              <div>
                <p className="text-xs font-bold text-muted-foreground">Scratch</p>
                <p className="text-sm font-extrabold">Programando!</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-2 right-0 hidden rounded-2xl bg-card px-4 py-3 shadow-card md:block animate-float" style={{ animationDelay: "2s" }}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              <div>
                <p className="text-xs font-bold text-muted-foreground">Inclusão</p>
                <p className="text-sm font-extrabold">Digital real</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
