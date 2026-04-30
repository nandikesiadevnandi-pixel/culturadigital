import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Send, Sparkles, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { quizQuestions, MAX_AUTO_SCORE, MAX_TOTAL_SCORE } from "@/data/quiz";

export default function AvaliacaoPage() {
  const [name, setName] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ auto: number } | null>(null);

  const setAns = (n: number, v: string) => setAnswers((a) => ({ ...a, [n]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanClass = classNumber.trim();
    if (cleanName.length < 3) return toast({ title: "Coloque seu nome completo 📝", variant: "destructive" });
    if (!cleanClass) return toast({ title: "Informe o número da sua turma 🎒", variant: "destructive" });

    for (const q of quizQuestions) {
      const a = (answers[q.number] || "").trim();
      if (!a) return toast({ title: `Responda a questão ${q.number} 🙂`, variant: "destructive" });
      if (a.length > 2000) return toast({ title: `Resposta da questão ${q.number} muito longa`, variant: "destructive" });
    }
    if (cleanName.length > 120 || cleanClass.length > 20)
      return toast({ title: "Nome ou turma muito longos", variant: "destructive" });

    setSubmitting(true);
    try {
      // Check duplicate
      const { data: existing } = await supabase
        .from("submissions")
        .select("id")
        .ilike("student_name", cleanName)
        .eq("class_number", cleanClass)
        .maybeSingle();

      if (existing) {
        toast({ title: "Você já respondeu esta avaliação 💜", description: "Cada aluno pode responder apenas uma vez." });
        setSubmitting(false);
        return;
      }

      // auto-score
      let auto = 0;
      const answerRows = quizQuestions.map((q) => {
        const text = answers[q.number].trim();
        if (q.type === "multiple_choice") {
          const ok = q.acceptAll ? true : text.toUpperCase() === q.correct;
          if (ok) auto += 1;
          return {
            question_number: q.number,
            question_type: "multiple_choice" as const,
            answer_text: text.toUpperCase(),
            is_correct: ok,
            manual_points: 0,
          };
        }
        return {
          question_number: q.number,
          question_type: q.type,
          answer_text: text,
          is_correct: null,
          manual_points: 0,
        };
      });

      const { data: sub, error: subErr } = await supabase
        .from("submissions")
        .insert({
          student_name: cleanName,
          class_number: cleanClass,
          auto_score: auto,
          manual_score: 0,
          total_score: auto,
        })
        .select("id")
        .single();
      if (subErr) throw subErr;

      const { error: ansErr } = await supabase
        .from("answers")
        .insert(answerRows.map((r) => ({ ...r, submission_id: sub.id })));
      if (ansErr) throw ansErr;

      setDone({ auto });
    } catch (err: any) {
      toast({ title: "Erro ao enviar", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="container max-w-2xl py-16">
        <div className="rounded-3xl border-2 border-primary/20 bg-card p-8 text-center shadow-soft">
          <div className="mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full gradient-purple text-primary-foreground shadow-glow">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-gradient">Resposta enviada! 🎉</h1>
          <p className="mt-3 text-muted-foreground">
            Você acertou <strong>{done.auto}</strong> de <strong>{MAX_AUTO_SCORE}</strong> nas múltipla escolha. As questões abertas serão corrigidas pela professora.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild variant="outline">
              <Link to="/">🏠 Início</Link>
            </Button>
            <Button asChild>
              <Link to="/ranking">
                <Trophy className="mr-1 h-4 w-4" /> Ver ranking
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-10">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
          <Sparkles className="h-4 w-4" /> Simulado
        </div>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-gradient">📝 Avaliação – Cultura Digital</h1>
        <p className="mt-1 text-sm font-semibold text-primary">📅 30/04/2026</p>
        <p className="mt-2 text-muted-foreground">
          Pontuação máxima possível: <strong>{MAX_TOTAL_SCORE} pontos</strong>. Capriche! 💜
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="mb-4 font-display text-xl font-bold">👤 Seus dados</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Nome completo *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} required />
            </div>
            <div>
              <Label htmlFor="class">Turma *</Label>
              <Input
                id="class"
                value={classNumber}
                onChange={(e) => setClassNumber(e.target.value)}
                maxLength={20}
                placeholder="Ex: 6A, 701, 802..."
                required
              />
            </div>
          </div>
        </div>

        {quizQuestions.map((q) => (
          <div key={q.number} className="rounded-2xl border bg-card p-6 shadow-soft">
            <div className="mb-3 flex items-start gap-3">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-purple text-sm font-bold text-primary-foreground">
                {q.number}
              </span>
              <p className="font-semibold">{q.prompt}</p>
            </div>

            {q.type === "multiple_choice" ? (
              <div className="space-y-2 pl-11">
                {q.options.map((opt) => (
                  <label
                    key={opt.key}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-smooth ${
                      answers[q.number] === opt.key
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.number}`}
                      value={opt.key}
                      checked={answers[q.number] === opt.key}
                      onChange={() => setAns(q.number, opt.key)}
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="font-bold text-primary">{opt.key})</span>
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="pl-11">
                <Textarea
                  rows={q.type === "reflective" ? 5 : 3}
                  value={answers[q.number] || ""}
                  onChange={(e) => setAns(q.number, e.target.value)}
                  maxLength={2000}
                  placeholder="Digite sua resposta aqui..."
                />
              </div>
            )}
          </div>
        ))}

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          <Send className="mr-2 h-5 w-5" />
          {submitting ? "Enviando..." : "Enviar avaliação"}
        </Button>
      </form>
    </div>
  );
}
