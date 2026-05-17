import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, RotateCcw } from "lucide-react";
import { localIncCount, localGetCount } from "@/lib/localProgress";

type Game = "binario" | "sequencia" | "memoria" | "termos";

const GAMES: { id: Game; emoji: string; title: string; desc: string; color: string }[] = [
  { id: "binario", emoji: "🔢", title: "Decifrador Binário", desc: "Converta números binários em decimais", color: "from-violet-500 to-cyan-400" },
  { id: "sequencia", emoji: "🧩", title: "Sequência Lógica", desc: "Adivinhe o próximo número da sequência", color: "from-pink-500 to-orange-500" },
  { id: "memoria", emoji: "🧠", title: "Memória do Robô", desc: "Repita a sequência de cores", color: "from-emerald-400 to-cyan-500" },
  { id: "termos", emoji: "💡", title: "Termos da Tech", desc: "Combine o termo com a definição", color: "from-amber-400 to-pink-500" },
];

export default function JogosPage() {
  const { user } = useAuth();
  const [active, setActive] = useState<Game | null>(null);

  const onWin = () => { if (user) localIncCount(user.id, "games_played"); };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#0a0a1a]">
      <div className="container py-10">
        <Link to="/aluno"><Button variant="ghost" className="mb-6 text-violet-200 hover:text-white"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button></Link>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-extrabold text-white md:text-4xl">🎮 Jogos</h1>
          <p className="text-violet-200/70">Aprenda jogando! Cada partida treina o cérebro digital.</p>
          {user && <div className="mt-2 text-sm text-cyan-300">Partidas jogadas: {localGetCount(user.id, "games_played")}</div>}
        </div>

        {!active ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GAMES.map((g) => (
              <Card key={g.id} onClick={() => setActive(g.id)} className="group cursor-pointer border-violet-500/20 bg-[#0f0f24]/80 p-6 backdrop-blur-xl transition-all hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(103,232,249,0.25)]">
                <div className={`mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${g.color} text-3xl shadow-lg group-hover:scale-110 transition-transform`}>{g.emoji}</div>
                <h3 className="font-display text-lg font-extrabold text-white">{g.title}</h3>
                <p className="text-sm text-violet-200/60">{g.desc}</p>
              </Card>
            ))}
          </div>
        ) : (
          <div>
            <Button variant="ghost" onClick={() => setActive(null)} className="mb-4 text-violet-200"><ArrowLeft className="mr-2 h-4 w-4" /> Ver todos os jogos</Button>
            {active === "binario" && <BinarioGame onWin={onWin} />}
            {active === "sequencia" && <SequenciaGame onWin={onWin} />}
            {active === "memoria" && <MemoriaGame onWin={onWin} />}
            {active === "termos" && <TermosGame onWin={onWin} />}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ Binário ============
function BinarioGame({ onWin }: { onWin: () => void }) {
  const [bin, setBin] = useState("");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState("");

  const newRound = () => {
    const n = Math.floor(Math.random() * 32);
    setBin(n.toString(2).padStart(5, "0"));
    setAnswer("");
    setMsg("");
  };
  useEffect(newRound, []);

  const check = () => {
    if (parseInt(bin, 2) === Number(answer)) {
      setScore(score + 1);
      setMsg("✅ Acertou!");
      onWin();
      setTimeout(newRound, 800);
    } else {
      setMsg(`❌ Errou! Era ${parseInt(bin, 2)}`);
    }
  };

  return (
    <Card className="mx-auto max-w-md border-violet-500/30 bg-[#0f0f24]/80 p-8 text-center backdrop-blur-xl">
      <div className="mb-2 text-sm text-violet-200/60">Pontos: {score}</div>
      <h2 className="font-display text-2xl font-extrabold text-white">Quanto é em decimal?</h2>
      <div className="my-6 font-mono text-5xl font-extrabold text-cyan-300">{bin}</div>
      <input value={answer} onChange={(e) => setAnswer(e.target.value)} type="number" className="w-full rounded-xl border border-violet-500/30 bg-[#1a1a3a] p-3 text-center text-2xl text-white outline-none focus:border-cyan-400" placeholder="?" />
      <Button onClick={check} disabled={!answer} className="mt-4 w-full bg-gradient-to-r from-violet-500 to-cyan-400">Conferir</Button>
      {msg && <div className="mt-3 font-bold text-white">{msg}</div>}
      <p className="mt-6 text-xs text-violet-200/50">Dica: cada posição vale 16, 8, 4, 2, 1 (da esquerda pra direita)</p>
    </Card>
  );
}

// ============ Sequência ============
function SequenciaGame({ onWin }: { onWin: () => void }) {
  const patterns = [
    { seq: [2, 4, 6, 8], next: 10, rule: "+2" },
    { seq: [1, 2, 4, 8], next: 16, rule: "×2" },
    { seq: [1, 3, 6, 10], next: 15, rule: "+2, +3, +4, +5" },
    { seq: [1, 1, 2, 3, 5], next: 8, rule: "Fibonacci" },
    { seq: [100, 90, 81, 73], next: 66, rule: "-10, -9, -8, -7" },
    { seq: [3, 6, 12, 24], next: 48, rule: "×2" },
  ];
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState("");
  const p = patterns[i % patterns.length];

  const check = () => {
    if (Number(answer) === p.next) {
      setScore(score + 1); setMsg(`✅ Boa! Regra: ${p.rule}`); onWin();
      setTimeout(() => { setI(i + 1); setAnswer(""); setMsg(""); }, 1200);
    } else setMsg(`❌ Era ${p.next} (${p.rule})`);
  };

  return (
    <Card className="mx-auto max-w-md border-violet-500/30 bg-[#0f0f24]/80 p-8 text-center backdrop-blur-xl">
      <div className="mb-2 text-sm text-violet-200/60">Pontos: {score}</div>
      <h2 className="font-display text-2xl font-extrabold text-white">Qual é o próximo?</h2>
      <div className="my-6 font-mono text-3xl font-extrabold text-cyan-300">{p.seq.join(" · ")} · ?</div>
      <input value={answer} onChange={(e) => setAnswer(e.target.value)} type="number" className="w-full rounded-xl border border-violet-500/30 bg-[#1a1a3a] p-3 text-center text-2xl text-white outline-none focus:border-cyan-400" />
      <Button onClick={check} disabled={!answer} className="mt-4 w-full bg-gradient-to-r from-pink-500 to-orange-500">Conferir</Button>
      {msg && <div className="mt-3 font-bold text-white">{msg}</div>}
    </Card>
  );
}

// ============ Memória ============
function MemoriaGame({ onWin }: { onWin: () => void }) {
  const colors = ["from-violet-500", "from-cyan-400", "from-pink-500", "from-amber-400"];
  const colorBg = ["bg-violet-500", "bg-cyan-400", "bg-pink-500", "bg-amber-400"];
  const [seq, setSeq] = useState<number[]>([]);
  const [user, setUser] = useState<number[]>([]);
  const [showing, setShowing] = useState<number | null>(null);
  const [phase, setPhase] = useState<"watch" | "input" | "lost">("watch");
  const [round, setRound] = useState(0);

  const start = () => {
    const first = Math.floor(Math.random() * 4);
    setSeq([first]); setUser([]); setRound(1); setPhase("watch");
  };

  useEffect(() => { start(); }, []);

  useEffect(() => {
    if (phase !== "watch" || seq.length === 0) return;
    let idx = 0;
    const id = setInterval(() => {
      setShowing(seq[idx]);
      setTimeout(() => setShowing(null), 400);
      idx++;
      if (idx >= seq.length) {
        clearInterval(id);
        setTimeout(() => setPhase("input"), 500);
      }
    }, 700);
    return () => clearInterval(id);
  }, [seq, phase]);

  const click = (c: number) => {
    if (phase !== "input") return;
    const nu = [...user, c];
    if (seq[nu.length - 1] !== c) { setPhase("lost"); return; }
    if (nu.length === seq.length) {
      onWin();
      setTimeout(() => {
        const next = [...seq, Math.floor(Math.random() * 4)];
        setSeq(next); setUser([]); setRound(round + 1); setPhase("watch");
      }, 600);
    } else setUser(nu);
  };

  return (
    <Card className="mx-auto max-w-md border-violet-500/30 bg-[#0f0f24]/80 p-8 text-center backdrop-blur-xl">
      <div className="mb-2 text-sm text-violet-200/60">Rodada {round}</div>
      <h2 className="font-display text-2xl font-extrabold text-white">{phase === "watch" ? "Observe..." : phase === "input" ? "Sua vez!" : "💥 Errou!"}</h2>
      <div className="my-6 grid grid-cols-2 gap-3">
        {colors.map((_, i) => (
          <button key={i} onClick={() => click(i)} className={`h-32 rounded-2xl transition-all ${colorBg[i]} ${showing === i ? "opacity-100 scale-105 shadow-[0_0_40px_currentColor]" : "opacity-60"} hover:opacity-90`} />
        ))}
      </div>
      {phase === "lost" && <Button onClick={start} className="w-full bg-gradient-to-r from-emerald-400 to-cyan-500"><RotateCcw className="mr-2 h-4 w-4" /> Tentar de novo</Button>}
    </Card>
  );
}

// ============ Termos ============
function TermosGame({ onWin }: { onWin: () => void }) {
  const pairs = useMemo(() => [
    { term: "HTML", def: "Estrutura da página" },
    { term: "CSS", def: "Estilo e cores" },
    { term: "JavaScript", def: "Faz a página reagir" },
    { term: "URL", def: "Endereço de um site" },
    { term: "Servidor", def: "Computador que entrega o site" },
    { term: "Bug", def: "Erro no programa" },
  ], []);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);

  const defs = useMemo(() => [...pairs].sort(() => Math.random() - 0.5), [pairs]);

  const tryMatch = (def: string) => {
    if (!selectedTerm) return;
    const correct = pairs.find((p) => p.term === selectedTerm)?.def === def;
    if (correct) {
      const m = new Set(matched); m.add(selectedTerm); setMatched(m);
      setSelectedTerm(null);
      if (m.size === pairs.length) onWin();
    } else {
      setWrong(def); setTimeout(() => setWrong(null), 400);
    }
  };

  return (
    <Card className="mx-auto max-w-3xl border-violet-500/30 bg-[#0f0f24]/80 p-8 backdrop-blur-xl">
      <h2 className="mb-2 text-center font-display text-2xl font-extrabold text-white">Combine termo com definição</h2>
      <div className="mb-4 text-center text-sm text-violet-200/60">{matched.size} / {pairs.length}</div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          {pairs.map((p) => (
            <button key={p.term} disabled={matched.has(p.term)} onClick={() => setSelectedTerm(p.term)}
              className={`w-full rounded-xl border p-3 text-left font-bold transition-all ${matched.has(p.term) ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 line-through" : selectedTerm === p.term ? "border-cyan-400 bg-cyan-400/20 text-cyan-200" : "border-violet-500/30 bg-[#1a1a3a] text-white hover:border-cyan-400"}`}>
              {p.term}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {defs.map((d) => (
            <button key={d.def} disabled={matched.has(d.term) || !selectedTerm} onClick={() => tryMatch(d.def)}
              className={`w-full rounded-xl border p-3 text-left transition-all ${matched.has(d.term) ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-300/60 line-through" : wrong === d.def ? "border-red-500 bg-red-500/20 text-white" : "border-violet-500/30 bg-[#1a1a3a] text-violet-100 hover:border-cyan-400"}`}>
              {d.def}
            </button>
          ))}
        </div>
      </div>
      {matched.size === pairs.length && <div className="mt-6 text-center text-2xl font-extrabold text-emerald-400">🎉 Tudo certo!</div>}
    </Card>
  );
}
