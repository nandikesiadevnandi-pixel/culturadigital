import { NavLink, Link } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Início", emoji: "🏠" },
  { to: "/sobre", label: "Sobre", emoji: "👩‍🏫" },
  { to: "/aulas", label: "Aulas", emoji: "📅" },
  { to: "/progresso", label: "Progresso", emoji: "📈" },
  { to: "/galeria", label: "Galeria", emoji: "📸" },
  { to: "/avaliacao", label: "Avaliação", emoji: "📝" },
  { to: "/ranking", label: "Ranking", emoji: "🏆" },
];

export const NavBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full gradient-purple text-primary-foreground shadow-glow">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-gradient">Cultura Digital</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-bold transition-smooth",
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

        <button
          className="rounded-full bg-card p-2 shadow-soft md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
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
