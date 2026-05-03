import portrait from "@/assets/teacher-portrait.png";
import { Lightbulb, Code2, Users, Rocket, Heart, Coffee, Sparkles, Smile } from "lucide-react";
import { usePlatform } from "@/contexts/PlatformContext";

const culturaPillars = [
  { icon: Lightbulb, label: "Prática", color: "gradient-yellow", desc: "Aprender fazendo, com a mão na massa." },
  { icon: Code2, label: "Criatividade", color: "gradient-pink", desc: "Construir projetos próprios e originais." },
  { icon: Users, label: "Inclusão Digital", color: "gradient-blue", desc: "Tecnologia ao alcance de todos." },
  { icon: Rocket, label: "Autonomia", color: "gradient-green", desc: "Alunos que criam, não só consomem." },
];

const hospitalidadePillars = [
  { icon: Heart, label: "Acolhimento", color: "gradient-yellow", desc: "Receber cada pessoa com afeto." },
  { icon: Coffee, label: "Cuidado", color: "gradient-pink", desc: "Servir com atenção aos detalhes." },
  { icon: Smile, label: "Empatia", color: "gradient-blue", desc: "Enxergar o outro com gentileza." },
  { icon: Sparkles, label: "Excelência", color: "gradient-green", desc: "Encantar em cada experiência." },
];

export const About = () => {
  const { platform, platformId } = usePlatform();
  const isCultura = platformId === "cultura";
  const pillars = isCultura ? culturaPillars : hospitalidadePillars;

  return (
    <section id="about" className="container py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
        <div className="relative mx-auto max-w-sm">
          <div className="absolute inset-0 -z-10 rounded-[2rem] gradient-purple opacity-20 blur-2xl" />
          <div className="overflow-hidden rounded-[2rem] bg-card shadow-card">
            {isCultura ? (
              <img
                src={portrait}
                alt={`${platform.teacherName}, professora e desenvolvedora`}
                width={768}
                height={768}
                loading="lazy"
                className="h-auto w-full"
              />
            ) : (
              <div className="aspect-square w-full gradient-hero flex items-center justify-center">
                <Heart className="h-32 w-32 text-primary-foreground" fill="currentColor" />
              </div>
            )}
          </div>
          <div className="absolute -bottom-5 -right-5 rounded-2xl gradient-yellow px-4 py-3 shadow-yellow-glow rotate-3">
            <p className="font-display text-sm font-extrabold text-accent-foreground">{platform.brandTag}</p>
          </div>
        </div>

        <div className="space-y-6">
          <span className="inline-block rounded-full bg-accent/30 px-4 py-1.5 text-sm font-bold text-accent-foreground">
            Sobre a professora
          </span>
          <h2 className="font-display text-4xl font-extrabold md:text-5xl">
            Olá, eu sou a <span className="text-gradient">{platform.teacherName}</span>
          </h2>
          {isCultura ? (
            <>
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
            </>
          ) : (
            <>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Professora apaixonada por <strong className="text-foreground">Hospitalidade</strong>,
                acredito que ensinar a acolher é também ensinar a olhar com cuidado para
                o outro. Cada aula é uma oportunidade de mostrar que pequenos gestos
                fazem grandes diferenças.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Em sala de aula, levo uma abordagem <strong className="text-foreground">prática, afetuosa e criativa</strong>,
                incentivando alunos a desenvolverem empatia, atenção aos detalhes e
                autonomia no atendimento. Aprendemos servindo, escutando e
                transformando experiências.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Meu objetivo é <strong className="text-foreground">formar profissionais que acolhem</strong> —
                jovens capazes de receber, cuidar e encantar em qualquer ambiente,
                preparando-os para o mundo do trabalho com sensibilidade e excelência.
              </p>
            </>
          )}

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
