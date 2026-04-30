import { useEffect, useState } from "react";
import { Lock, Trash2, Save, RefreshCw, Trophy, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { quizQuestions, MAX_TOTAL_SCORE, MAX_MANUAL_POINTS_PER_OPEN } from "@/data/quiz";

type Submission = {
  id: string;
  student_name: string;
  class_number: string;
  auto_score: number;
  manual_score: number;
  total_score: number;
  created_at: string;
};
type Answer = {
  id: string;
  submission_id: string;
  question_number: number;
  question_type: string;
  answer_text: string;
  is_correct: boolean | null;
  manual_points: number;
};

const PASS_KEY = "cd_admin_pass";

export default function AdminAvaliacaoPage() {
  const [password, setPassword] = useState(sessionStorage.getItem(PASS_KEY) || "");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, number>>({});
  const [aiFeedback, setAiFeedback] = useState<Record<string, Record<number, string>>>({});
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  const call = async (action: string, payload?: any) => {
    const { data, error } = await supabase.functions.invoke("admin-quiz", {
      body: { password, action, payload },
    });
    if (error) throw error;
    if ((data as any)?.error) throw new Error((data as any).error);
    return data;
  };

  const load = async () => {
    setLoading(true);
    try {
      const data: any = await call("list");
      setSubmissions(data.submissions || []);
      setAnswers(data.answers || []);
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await call("verify");
      sessionStorage.setItem(PASS_KEY, password);
      setAuthed(true);
      await load();
    } catch (e: any) {
      toast({ title: "Senha incorreta", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem(PASS_KEY)) {
      (async () => {
        try {
          await call("verify");
          setAuthed(true);
          await load();
        } catch {
          sessionStorage.removeItem(PASS_KEY);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveGrades = async (submissionId: string) => {
    const subAnswers = answers.filter((a) => a.submission_id === submissionId && a.question_type !== "multiple_choice");
    const grades = subAnswers.map((a) => ({
      answer_id: a.id,
      manual_points: edits[a.id] ?? a.manual_points,
    }));
    try {
      const data: any = await call("grade", { submission_id: submissionId, grades });
      toast({ title: "Notas salvas! ✨", description: `Total: ${data.total} / ${MAX_TOTAL_SCORE}` });
      await load();
    } catch (e: any) {
      toast({ title: "Erro ao salvar", description: e.message, variant: "destructive" });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir esta resposta?")) return;
    try {
      await call("delete", { submission_id: id });
      await load();
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
  };

  const aiGrade = async (submissionId: string) => {
    setAiLoading(submissionId);
    try {
      const data: any = await call("ai_grade", { submission_id: submissionId });
      const fb: Record<number, string> = {};
      const newEdits: Record<string, number> = { ...edits };
      const subAnswers = answers.filter((a) => a.submission_id === submissionId);
      (data.grades || []).forEach((g: any) => {
        fb[g.question_number] = g.feedback;
        const ans = subAnswers.find((a) => a.question_number === g.question_number);
        if (ans) newEdits[ans.id] = g.points;
      });
      setAiFeedback((prev) => ({ ...prev, [submissionId]: fb }));
      setEdits(newEdits);
      toast({ title: "IA avaliou! ✨", description: `Sugestão: ${data.manual} pts nas abertas. Confira e salve.` });
      await load();
    } catch (e: any) {
      toast({ title: "Erro da IA", description: e.message, variant: "destructive" });
    } finally {
      setAiLoading(null);
    }
  };

  if (!authed) {
    return (
      <div className="container max-w-md py-16">
        <form onSubmit={handleLogin} className="rounded-3xl border-2 border-primary/20 bg-card p-8 shadow-soft">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full gradient-purple text-primary-foreground shadow-glow">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="font-display text-2xl font-extrabold text-gradient">Painel da Professora</h1>
            <p className="mt-1 text-sm text-muted-foreground">Digite a senha para acessar</p>
          </div>
          <Label htmlFor="pass">Senha</Label>
          <Input id="pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" className="mt-4 w-full" disabled={loading}>
            {loading ? "Verificando..." : "Entrar"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gradient">📋 Correção das Avaliações</h1>
          <p className="text-sm text-muted-foreground">
            {submissions.length} resposta(s). Cada questão aberta vale 0–{MAX_MANUAL_POINTS_PER_OPEN} pontos.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className="mr-1 h-4 w-4" /> Atualizar
        </Button>
      </header>

      <div className="space-y-3">
        {submissions.map((s) => {
          const isOpen = openId === s.id;
          const subAnswers = answers
            .filter((a) => a.submission_id === s.id)
            .sort((a, b) => a.question_number - b.question_number);
          return (
            <div key={s.id} className="overflow-hidden rounded-2xl border bg-card shadow-soft">
              <button
                onClick={() => setOpenId(isOpen ? null : s.id)}
                className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-muted/30"
              >
                <div>
                  <div className="font-display text-lg font-bold">{s.student_name}</div>
                  <div className="text-sm text-muted-foreground">
                    Turma {s.class_number} · {new Date(s.created_at).toLocaleString("pt-BR")}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Total</div>
                    <div className="font-display text-xl font-extrabold text-primary">
                      {s.total_score}/{MAX_TOTAL_SCORE}
                    </div>
                  </div>
                  <Trophy className="h-5 w-5 text-muted-foreground" />
                </div>
              </button>

              {isOpen && (
                <div className="border-t bg-muted/20 p-4">
                  <div className="space-y-4">
                    {subAnswers.map((a) => {
                      const q = quizQuestions.find((q) => q.number === a.question_number);
                      return (
                        <div key={a.id} className="rounded-xl border bg-card p-4">
                          <p className="text-sm font-semibold">
                            {a.question_number}. {q?.prompt}
                          </p>
                          {a.question_type === "multiple_choice" ? (
                            <div className="mt-2 flex items-center gap-2 text-sm">
                              <span>Resposta: <strong>{a.answer_text}</strong></span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                                  a.is_correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}
                              >
                                {a.is_correct ? "✓ Correta" : "✗ Errada"}
                              </span>
                            </div>
                          ) : (
                            <>
                              <p className="mt-2 whitespace-pre-wrap rounded-lg bg-muted/40 p-3 text-sm">
                                {a.answer_text}
                              </p>
                              {aiFeedback[s.id]?.[a.question_number] && (
                                <p className="mt-2 flex items-start gap-2 rounded-lg bg-primary/5 p-3 text-xs italic text-primary">
                                  <Sparkles className="mt-0.5 h-3 w-3 shrink-0" />
                                  <span>{aiFeedback[s.id][a.question_number]}</span>
                                </p>
                              )}
                              <div className="mt-3 flex items-center gap-2">
                                <Label className="text-xs">Nota (0-{MAX_MANUAL_POINTS_PER_OPEN}):</Label>
                                {[0, 1, 2].map((n) => {
                                  const current = edits[a.id] ?? a.manual_points;
                                  return (
                                    <button
                                      key={n}
                                      type="button"
                                      onClick={() => setEdits((e) => ({ ...e, [a.id]: n }))}
                                      className={`h-9 w-9 rounded-full text-sm font-bold transition-smooth ${
                                        current === n
                                          ? "gradient-purple text-primary-foreground shadow-soft"
                                          : "bg-muted hover:bg-muted/70"
                                      }`}
                                    >
                                      {n}
                                    </button>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => remove(s.id)}>
                      <Trash2 className="mr-1 h-4 w-4" /> Excluir
                    </Button>
                    <Button size="sm" onClick={() => saveGrades(s.id)}>
                      <Save className="mr-1 h-4 w-4" /> Salvar notas
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {submissions.length === 0 && !loading && (
          <p className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">
            Nenhuma resposta ainda.
          </p>
        )}
      </div>
    </div>
  );
}
