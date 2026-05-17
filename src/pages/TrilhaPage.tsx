import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, CheckCircle2, Sparkles } from "lucide-react";
import { getTrailForGrade, TrailLesson } from "@/data/trilha";
import { localAddToSet, localGetSet } from "@/lib/localProgress";

export default function TrilhaPage() {
  const { profile, user } = useAuth();
  const modules = useMemo(() => getTrailForGrade(profile?.grade_year), [profile?.grade_year]);
  const [read, setRead] = useState<Set<string>>(() => user ? localGetSet(user.id, "lessons_read") : new Set());
  const [open, setOpen] = useState<TrailLesson | null>(null);

  const markRead = (id: string) => {
    if (!user) return;
    localAddToSet(user.id, "lessons_read", id);
    setRead(new Set([...read, id]));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#0a0a1a]">
      <div className="container py-10">
        <Link to="/aluno"><Button variant="ghost" className="mb-6 text-violet-200 hover:text-white"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button></Link>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-extrabold text-white md:text-4xl">📚 Minha Trilha</h1>
          <p className="text-violet-200/70">Aulas de Cultura Digital para o {profile?.grade_year ?? 6}º ano</p>
          <div className="mt-2 text-sm text-cyan-300">
            {read.size} / {modules.reduce((a, m) => a + m.lessons.length, 0)} aulas lidas
          </div>
        </div>

        <div className="space-y-8">
          {modules.map((m) => (
            <div key={m.id}>
              <div className="mb-4">
                <h2 className={`font-display text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${m.color}`}>{m.title}</h2>
                <p className="text-sm text-violet-200/60">{m.description}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {m.lessons.map((l) => {
                  const done = read.has(l.id);
                  return (
                    <Card key={l.id} onClick={() => setOpen(l)} className="group relative cursor-pointer border-violet-500/20 bg-[#0f0f24]/80 p-5 backdrop-blur-xl transition-all hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(103,232,249,0.25)]">
                      {done && <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-emerald-400" />}
                      <div className="mb-2 text-3xl">{l.emoji}</div>
                      <h3 className="font-display text-lg font-extrabold text-white">{l.title}</h3>
                      <p className="mt-1 text-sm text-violet-200/60">{l.summary}</p>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur" onClick={() => setOpen(null)}>
            <Card className="max-h-[85vh] w-full max-w-2xl overflow-y-auto border-violet-500/30 bg-[#0f0f24] p-8" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 text-5xl">{open.emoji}</div>
              <h2 className="font-display text-2xl font-extrabold text-white">{open.title}</h2>
              <p className="mt-1 text-violet-200/70">{open.summary}</p>

              <div className="mt-6 space-y-5">
                {open.content.map((b, i) => (
                  <div key={i}>
                    <h3 className="font-display text-lg font-bold text-cyan-300">{b.heading}</h3>
                    <p className="mt-1 leading-relaxed text-violet-100/90">{b.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-violet-500/30 bg-violet-500/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-violet-200"><Sparkles className="h-4 w-4" /> Pra lembrar</div>
                <ul className="space-y-1 text-sm text-violet-100/90">
                  {open.keyPoints.map((p, i) => <li key={i}>• {p}</li>)}
                </ul>
              </div>

              <div className="mt-6 flex gap-3">
                <Button onClick={() => { markRead(open.id); setOpen(null); }} className="bg-gradient-to-r from-violet-500 to-cyan-400">
                  <BookOpen className="mr-2 h-4 w-4" /> Marcar como lida
                </Button>
                <Button variant="ghost" onClick={() => setOpen(null)} className="text-violet-200">Fechar</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
