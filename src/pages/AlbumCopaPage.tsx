import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FIGURINHAS, Figurinha, Raridade, SELECOES, sortearPacote } from "@/data/figurinhas";
import { ArrowLeft, Package, BookOpen, Sparkles, Trophy } from "lucide-react";

type Coll = Record<number, number>; // id -> quantidade

const RARIDADE_STYLE: Record<Raridade, { ring: string; glow: string; label: string; chip: string }> = {
  comum:    { ring: "ring-slate-400/50",   glow: "shadow-[0_0_20px_rgba(148,163,184,0.4)]", label: "Comum",    chip: "bg-slate-500" },
  rara:     { ring: "ring-cyan-400/70",    glow: "shadow-[0_0_25px_rgba(34,211,238,0.55)]", label: "Rara",     chip: "bg-cyan-500" },
  epica:    { ring: "ring-fuchsia-400/80", glow: "shadow-[0_0_30px_rgba(232,121,249,0.6)]", label: "Épica",    chip: "bg-fuchsia-500" },
  lendaria: { ring: "ring-amber-400",      glow: "shadow-[0_0_40px_rgba(251,191,36,0.7)]",  label: "Lendária", chip: "bg-gradient-to-r from-amber-400 to-orange-500" },
};

export default function AlbumCopaPage() {
  const { profile } = useAuth();
  const storageKey = `cd:album-copa:${profile?.id ?? "anon"}`;

  const [coll, setColl] = useState<Coll>({});
  const [view, setView] = useState<"home" | "album">("home");
  const [pacote, setPacote] = useState<Figurinha[] | null>(null);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [filtroSel, setFiltroSel] = useState<string>("todas");

  useEffect(() => {
    try { setColl(JSON.parse(localStorage.getItem(storageKey) ?? "{}")); } catch {}
  }, [storageKey]);

  const persist = (next: Coll) => {
    setColl(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const totaisUnicos = Object.keys(coll).length;
  const totalFigs = FIGURINHAS.length;
  const repetidas = Object.values(coll).reduce((a, b) => a + Math.max(0, b - 1), 0);
  const progresso = Math.round((totaisUnicos / totalFigs) * 100);

  const abrirPacote = () => {
    const novas = sortearPacote(5);
    setPacote(novas);
    setRevealed(new Set());
    const next = { ...coll };
    novas.forEach(f => { next[f.id] = (next[f.id] ?? 0) + 1; });
    persist(next);
  };

  const figsFiltradas = useMemo(
    () => filtroSel === "todas" ? FIGURINHAS : FIGURINHAS.filter(f => f.selecao === filtroSel),
    [filtroSel]
  );

  const completas = useMemo(() => {
    return SELECOES.filter(sel => {
      const figs = FIGURINHAS.filter(f => f.selecao === sel);
      return figs.every(f => (coll[f.id] ?? 0) > 0);
    });
  }, [coll]);

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden bg-[#04122a]">
      {/* Fundo estádio */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0ea5e9_0%,transparent_50%),radial-gradient(ellipse_at_bottom,#16a34a_0%,transparent_55%)] opacity-30" />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 40px, rgba(255,255,255,0.6) 40px 41px), repeating-linear-gradient(90deg, transparent 0 40px, rgba(255,255,255,0.6) 40px 41px)",
        }}
      />

      <div className="relative container py-8">
        <Link to="/aluno" className="inline-flex items-center gap-2 text-cyan-300 hover:text-white text-sm mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar ao painel
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold mb-3">
            <Sparkles className="h-3 w-3" /> NOVIDADE
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.4)]">
            ⚽ Álbum Digital da Copa
          </h1>
          <p className="text-cyan-100/70 mt-2">Abra pacotes, colecione craques e complete as seleções!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 max-w-4xl mx-auto">
          <StatCard label="Figurinhas" value={`${totaisUnicos}/${totalFigs}`} color="from-cyan-500 to-blue-600" />
          <StatCard label="Repetidas" value={repetidas} color="from-fuchsia-500 to-pink-600" />
          <StatCard label="Seleções completas" value={`${completas.length}/${SELECOES.length}`} color="from-emerald-500 to-green-600" />
          <StatCard label="Progresso" value={`${progresso}%`} color="from-amber-400 to-orange-500" />
        </div>

        {/* Barra progresso */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 shadow-[0_0_20px_rgba(52,211,153,0.6)] transition-all"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <Button
            onClick={abrirPacote}
            className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-extrabold text-lg px-8 py-6 shadow-[0_0_30px_rgba(251,191,36,0.5)]"
          >
            <Package className="mr-2 h-5 w-5" /> Abrir Pacote (5 figurinhas)
          </Button>
          <Button
            onClick={() => setView(view === "album" ? "home" : "album")}
            variant="outline"
            className="border-cyan-400/50 text-cyan-200 hover:bg-cyan-500/10 hover:text-white text-lg px-8 py-6"
          >
            <BookOpen className="mr-2 h-5 w-5" /> {view === "album" ? "Fechar Álbum" : "Meu Álbum"}
          </Button>
        </div>

        {/* Modal Pacote */}
        {pacote && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setPacote(null)}>
            <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
              <h2 className="text-center text-2xl font-extrabold text-amber-300 mb-6">🎉 Pacote aberto! Toque para revelar</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {pacote.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setRevealed(r => new Set(r).add(i))}
                    className="aspect-[3/4] perspective-1000"
                  >
                    {revealed.has(i) ? (
                      <FigurinhaCard f={f} novidade={(coll[f.id] ?? 0) <= 1} />
                    ) : (
                      <div className="h-full w-full rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 ring-2 ring-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.6)] flex items-center justify-center text-5xl animate-pulse">
                        ⚽
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="text-center mt-6">
                <Button onClick={() => setPacote(null)} variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Álbum */}
        {view === "album" && (
          <div>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <FilterChip active={filtroSel === "todas"} onClick={() => setFiltroSel("todas")}>Todas</FilterChip>
              {SELECOES.map(s => (
                <FilterChip key={s} active={filtroSel === s} onClick={() => setFiltroSel(s)}>
                  {s} {completas.includes(s) && <Trophy className="inline h-3 w-3 ml-1 text-amber-300" />}
                </FilterChip>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {figsFiltradas.map(f => {
                const qtd = coll[f.id] ?? 0;
                const tem = qtd > 0;
                return (
                  <div key={f.id} className="aspect-[3/4] relative">
                    {tem ? (
                      <FigurinhaCard f={f} qtd={qtd} />
                    ) : (
                      <div className="h-full w-full rounded-2xl bg-white/5 border-2 border-dashed border-white/15 flex flex-col items-center justify-center text-white/30">
                        <span className="text-4xl">?</span>
                        <span className="text-xs mt-2 font-bold">#{String(f.id).padStart(3, "0")}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <Card className={`p-4 border-white/10 bg-gradient-to-br ${color} text-white`}>
      <div className="text-xs uppercase tracking-wide opacity-80">{label}</div>
      <div className="text-2xl font-extrabold">{value}</div>
    </Card>
  );
}

function FigurinhaCard({ f, qtd, novidade }: { f: Figurinha; qtd?: number; novidade?: boolean }) {
  const s = RARIDADE_STYLE[f.raridade];
  return (
    <div className={`h-full w-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ring-2 ${s.ring} ${s.glow} p-3 flex flex-col relative overflow-hidden`}>
      {novidade && (
        <span className="absolute top-1 right-1 text-[10px] font-extrabold bg-emerald-500 text-white px-2 py-0.5 rounded-full z-10">NOVA</span>
      )}
      {qtd && qtd > 1 && (
        <span className="absolute top-1 left-1 text-[10px] font-extrabold bg-fuchsia-500 text-white px-2 py-0.5 rounded-full z-10">x{qtd}</span>
      )}
      <div className="flex-1 flex items-center justify-center text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
        {f.emoji}
      </div>
      <div className="text-center">
        <div className="font-extrabold text-white text-sm leading-tight truncate">{f.nome}</div>
        <div className="text-[10px] text-white/60">{f.posicao} · {f.selecao}</div>
        <div className={`mt-1 inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full text-white ${s.chip}`}>
          {s.label}
        </div>
      </div>
      <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-white/10 blur-xl pointer-events-none" />
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
        active ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-[0_0_15px_rgba(251,191,36,0.5)]" : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
      }`}
    >
      {children}
    </button>
  );
}
