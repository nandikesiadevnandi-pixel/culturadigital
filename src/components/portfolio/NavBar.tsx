import { NavLink, Link } from "react-router-dom";
import { Sparkles, Menu, X, ChevronDown, User, LogIn } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePlatform, PLATFORMS, PlatformId } from "@/contexts/PlatformContext";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { to: "/", label: "Início", emoji: "🏠" },
  { to: "/sobre", label: "Sobre", emoji: "👩‍🏫" },
  { to: "/aulas", label: "Aulas", emoji: "📅" },
  { to: "/progresso", label: "Progresso", emoji: "📈" },
  { to: "/galeria", label: "Galeria", emoji: "📸" },
  { to: "/avaliacao", label: "Avaliação", emoji: "📝" },
  { to: "/ranking", label: "Ranking", emoji: "🏆" },
];

const PlatformSwitcher = () => {
  const { platform, platformId, setPlatform } = usePlatform();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs font-bold shadow-soft transition-smooth hover:shadow-card"
        aria-label="Trocar plataforma"
      >
        <span>{platform.emoji}</span>
        <span className="hidden sm:inline">{platform.shortName}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <button
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border bg-card shadow-card">
            {(Object.keys(PLATFORMS) as PlatformId[]).map((id) => {
              const p = PLATFORMS[id];
              const active = id === platformId;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setPlatform(id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted",
                    active && "bg-muted"
                  )}
                >
                  <span className="text-xl">{p.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold">{p.shortName}</div>
                    <div className="truncate text-xs text-muted-foreground">{p.teacherName}</div>
                  </div>
                  {active && <span className="text-xs font-bold text-primary">●</span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

const AuthButton = () => {
  const { user, isAdmin } = useAuth();
  if (!user) {
    return (
      <Link
        to="/entrar"
        className="hidden sm:flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-3 py-1.5 text-xs font-extrabold text-white shadow-[0_0_15px_rgba(167,139,250,0.4)] transition-transform hover:scale-105"
      >
        <LogIn className="h-3 w-3" />
        Entrar
      </Link>
    );
  }
  return (
    <Link
      to={isAdmin ? "/admin" : "/aluno"}
      className="hidden sm:flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-bold shadow-soft hover:shadow-card"
    >
      <User className="h-3 w-3" />
      {isAdmin ? "ADM" : "Meu painel"}
    </Link>
  );
};

export const NavBar = () => {
  const [open, setOpen] = useState(false);
  const { platform } = usePlatform();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex items-center justify-between gap-3 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full gradient-purple text-primary-foreground shadow-glow">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-gradient">{platform.shortName}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3 py-2 text-sm font-bold transition-smooth",
                  isActive
                    ? "gradient-purple text-primary-foreground shadow-soft"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground",
                )
              }
            >
              <span className="mr-1">{l.emoji}</span>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <AuthButton />
          <PlatformSwitcher />
          <button
            className="rounded-full bg-card p-2 shadow-soft md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/50 bg-background md:hidden">
          <div className="container flex flex-col gap-1 py-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-2xl px-4 py-3 text-sm font-bold transition-smooth",
                    isActive
                      ? "gradient-purple text-primary-foreground"
                      : "text-foreground/70 hover:bg-muted",
                  )
                }
              >
                <span className="mr-2">{l.emoji}</span>
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
