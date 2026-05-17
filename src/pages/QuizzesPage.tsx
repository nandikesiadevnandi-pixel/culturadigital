import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { localIncCount } from "@/lib/localProgress";

type Q = { q: string; opts: string[]; correct: number; tip?: string };

const QUIZZES: { id: string; emoji: string; title: string; color: string; questions: Q[] }[] = [
  {
    id: "internet",
    emoji: "🌐", title: "Internet & Web", color: "from-cyan-400 to-blue-500",
    questions: [
      { q: "O que significa WWW?", opts: ["World Wide Web", "Wireless Web Wonder", "Wired Wave World", "Web Worldwide Watch"], correct: 0 },
      { q: "O que faz um navegador?", opts: ["Tira fotos", "Mostra sites da internet", "Imprime documentos", "Carrega a bateria"], correct: 1 },
      { q: "URL é...", opts: ["Um vírus", "O endereço de um site", "Um app", "Uma senha"], correct: 1 },
      { q: "Wi-Fi serve para...", opts: ["Carregar o celular", "Tirar fotos", "Conectar à internet sem fio", "Aumentar o volume"], correct: 2 },
      { q: "Um servidor é...", opts: ["Um garçom", "Um computador que entrega páginas", "Um cabo", "Um app"], correct: 1 },
    ],
  },
  {
    id: "seguranca",
    emoji: "🔐", title: "Segurança Digital", color: "from-pink-500 to-rose-500",
    questions: [
      { q: "Qual é a senha mais segura?", opts: ["123456", "meunome", "Lua@2026!azul", "senha"], correct: 2 },
      { q: "Recebi um link estranho. Devo:", opts: ["Clicar logo", "Compartilhar com amigos", "Ignorar e apagar", "Responder pedindo mais"], correct: 2 },
      { q: "Verificação em 2 etapas serve para...", opts: ["Demorar mais para entrar", "Deixar a conta mais segura", "Gastar internet", "Trocar a senha"], correct: 1 },
      { q: "O que NÃO postar:", opts: ["Foto de paisagem", "Meu endereço e telefone", "Um desenho", "Um meme"], correct: 1 },
      { q: "Vírus de computador é:", opts: ["Um jogo", "Um programa ruim", "Um cabo", "Um e-mail"], correct: 1 },
    ],
  },
  {
    id: "logica",
    emoji: "🧩", title: "Lógica & Programação", color: "from-violet-500 to-cyan-400",
    questions: [
      { q: "Algoritmo é:", opts: ["Um robô", "Uma sequência de passos", "Um vírus", "Uma cor"], correct: 1 },
      { q: "Loop serve para:", opts: ["Apagar o pc", "Repetir uma ação", "Desligar wifi", "Mudar cor"], correct: 1 },
      { q: "If significa:", opts: ["Repetir", "SE (decisão)", "Apagar", "Salvar"], correct: 1 },
      { q: "2, 4, 6, 8, ?", opts: ["9", "10", "12", "11"], correct: 1 },
      { q: "HTML é...", opts: ["A roupa do site", "O esqueleto do site", "O cérebro", "A internet"], correct: 1 },
    ],
  },
  {
    id: "fakenews",
    emoji: "📰", title: "Fake News", color: "from-amber-400 to-orange-500",
    questions: [
      { q: "Fake news são:", opts: ["Notícias verdadeiras", "Notícias falsas", "Vídeos engraçados", "Jogos"], correct: 1 },
      { q: "Antes de compartilhar uma notícia:", opts: ["Compartilhar logo", "Checar a fonte", "Apagar o app", "Reclamar com a família"], correct: 1 },
      { q: "Sinal de fake:", opts: ["Tem fonte confiável", "Pede compartilhar URGENTE", "Tem autor e data", "Aparece em vários jornais"], correct: 1 },
      { q: "Checar a fonte é:", opts: ["Aumentar volume", "Ver de onde veio a notícia", "Apagar a notícia", "Tirar print"], correct: 1 },
    ],
  },
];

export default function QuizzesPage() {
  const { user } = useAuth();
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = QUIZZES.find((q) => q.id === activeId);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#0a0a1a]">
      <div className="container py-10">
        <Link to="/aluno"><Button variant="ghost" className="mb-6 text-violet-200 hover:text-white"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button></Link>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-extrabold text-white md:text-4xl">🏆 Quizzes</h1>
          <p className="text-violet-200/70">Teste o que você sabe sobre o mundo digital!</p>
        </div>

        {!active ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUIZZES.map((q) => (
              <Card key={q.id} onClick={() => setActiveId(q.id)} className="group cursor-pointer border-violet-500/20 bg-[#0f0f24]/80 p-6 backdrop-blur-xl transition-all hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(103,232,249,0.25)]">
                <div className={`mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${q.color} text-3xl shadow-lg group-hover:scale-110 transition-transform`}>{q.emoji}</div>
                <h3 className="font-display text-lg font-extrabold text-white">{q.title}</h3>
                <p className="text-sm text-violet-200/60">{q.questions.length} perguntas</p>
              </Card>
            ))}
          </div>
        ) : (
          <QuizRunner quiz={active} onFinish={() => { if (user) localIncCount(user.id, "quizzes_taken"); }} onExit={() => setActiveId(null)} />
        )}
      </div>
    </div>
  );
}

function QuizRunner({ quiz, onFinish, onExit }: { quiz: typeof QUIZZES[number]; onFinish: () => void; onExit: () => void }) {
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = quiz.questions[i];

  const next = () => {
    if (selected === q.correct) setScore(score + 1);
    if (i + 1 >= quiz.questions.length) { setDone(true); onFinish(); }
    else { setI(i + 1); setSelected(null); }
  };

  if (done) {
    const pct = Math.round((score / quiz.questions.length) * 100);
    return (
      <Card className="mx-auto max-w-md border-violet-500/30 bg-[#0f0f24]/80 p-8 text-center backdrop-blur-xl">
        <Trophy className="mx-auto mb-4 h-16 w-16 text-amber-400" />
        <h2 className="font-display text-3xl font-extrabold text-white">{pct}%</h2>
        <p className="mt-2 text-violet-200">Você acertou {score} de {quiz.questions.length}</p>
        <div className="mt-6 flex gap-3">
          <Button onClick={onExit} className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-400">Outros quizzes</Button>
          <Button variant="ghost" onClick={() => { setI(0); setScore(0); setSelected(null); setDone(false); }} className="text-violet-200">Refazer</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-xl border-violet-500/30 bg-[#0f0f24]/80 p-8 backdrop-blur-xl">
      <Button variant="ghost" size="sm" onClick={onExit} className="mb-2 text-violet-200">← Sair</Button>
      <div className="mb-4 flex items-center justify-between text-sm text-violet-200/60">
        <span>{quiz.emoji} {quiz.title}</span>
        <span>Pergunta {i + 1} / {quiz.questions.length}</span>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-violet-950">
        <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all" style={{ width: `${((i + 1) / quiz.questions.length) * 100}%` }} />
      </div>
      <h2 className="mb-6 font-display text-xl font-extrabold text-white">{q.q}</h2>
      <div className="space-y-2">
        {q.opts.map((opt, idx) => {
          const isSel = selected === idx;
          const show = selected !== null;
          const isRight = idx === q.correct;
          return (
            <button key={idx} disabled={show} onClick={() => setSelected(idx)}
              className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${show ? (isRight ? "border-emerald-400 bg-emerald-500/20 text-white" : isSel ? "border-red-500 bg-red-500/20 text-white" : "border-violet-500/20 bg-[#1a1a3a] text-violet-200/60") : "border-violet-500/30 bg-[#1a1a3a] text-white hover:border-cyan-400"}`}>
              <span>{opt}</span>
              {show && isRight && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
              {show && isSel && !isRight && <XCircle className="h-5 w-5 text-red-400" />}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <Button onClick={next} className="mt-6 w-full bg-gradient-to-r from-violet-500 to-cyan-400">
          {i + 1 >= quiz.questions.length ? "Ver resultado" : "Próxima"}
        </Button>
      )}
    </Card>
  );
}
