import { Heart } from "lucide-react";
import { usePlatform } from "@/contexts/PlatformContext";

export const Footer = () => {
  const { platform } = usePlatform();
  return (
    <footer className="relative overflow-hidden gradient-hero text-primary-foreground">
      <div className="pointer-events-none absolute -top-32 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

      <div className="container relative py-20 text-center md:py-24">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur">
          <Heart className="h-7 w-7" fill="currentColor" />
        </div>
        <p className="mx-auto mt-6 max-w-3xl font-display text-3xl font-extrabold leading-tight md:text-4xl lg:text-5xl">
          “{platform.footerQuote}”
        </p>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground/80">
          {platform.teacherName} · {platform.name} em Ação
        </p>

        <div className="mt-12 flex flex-col items-center gap-2 text-sm text-primary-foreground/80">
          <p className="font-bold">{platform.footerLocation}</p>
          <p>© {new Date().getFullYear()} · Portfólio docente · {platform.brandTag}</p>
        </div>
      </div>
    </footer>
  );
};
