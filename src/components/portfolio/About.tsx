import portrait from "@/assets/teacher-portrait.png";
import { Lightbulb, Code2, Users, Rocket } from "lucide-react";

const pillars = [
  { icon: Lightbulb, label: "Prática", color: "gradient-yellow", desc: "Aprender fazendo, com a mão na massa." },
  { icon: Code2, label: "Criatividade", color: "gradient-pink", desc: "Construir projetos próprios e originais." },
  { icon: Users, label: "Inclusão Digital", color: "gradient-blue", desc: "Tecnologia ao alcance de todos." },
  { icon: Rocket, label: "Autonomia", color: "gradient-green", desc: "Alunos que criam, não só consomem." },
];

export const About = () => {
  return (
    <section id="about" className="container py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
        <div className="relative mx-auto max-w-sm">
          <div className="absolute inset-0 -z-10 rounded-[2rem] gradient-purple opacity-20 blur-2xl" />
          <div className="overflow-hidden rounded-[2rem] bg-card shadow-card">
            <img
              src={portrait}
              alt="Késia Nandi, professora e desenvolvedora"
              width={768}
              height={768}
              loading="lazy"
              className="h-auto w-full"
            />
          </div>
          <div className="absolute -bottom-5 -right-5 rounded-2xl gradient-yellow px-4 py-3 shadow-yellow-glow rotate-3">
            <p className="font-display text-sm font-extrabold text-accent-foreground">NandiDev 💜</p>
          </div>
        </div>

        <div className="space-y-6">
          <span className="inline-block rounded-full bg-accent/30 px-4 py-1.5 text-sm font-bold text-accent-foreground">
            Sobre a professora
          </span>
          <h2 className="font-display text-4xl font-extrabold md:text-5xl">
            Olá, eu sou a <span className="text-gradient">Késia Nandi</span>
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Desenvolvedora, professora e fundadora da <strong className="text-foreground">NandiDev</strong>,
            atuando na interseção entre tecnologia, educação e inovação. Crio
            soluções digitais que usam automação e inteligência artificial para
            resolver problemas reais.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Em sala de aula, levo uma abordagem <strong className="text-foreground">prática, acessível e criativa</strong>,
            incentivando alunos a desenvolverem autonomia no uso da tecnologia. Meu
            ensino é baseado na experimentação, no aprendizado ativo e na
            construção de projetos com Chromebooks e plataformas de programação visual.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Meu objetivo é <strong className="text-foreground">democratizar o acesso à tecnologia</strong> e
            formar alunos capazes de compreender, utilizar e criar com ferramentas
            digitais — preparando-os para o futuro digital.
          </p>

          <div className="grid gap-4 pt-4 sm:grid-cols-2">
            {pillars.map((p) => (
              <div
                key={p.label}
                className="group flex items-start gap-3 rounded-2xl bg-card p-4 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-card"
              >
                <div className={`${p.color} flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-primary-foreground shadow-soft`}>
                  <p.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-display font-extrabold">{p.label}</p>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
