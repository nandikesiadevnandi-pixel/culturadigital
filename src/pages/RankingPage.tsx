import { useEffect, useMemo, useState } from "react";
import { Trophy, Medal, Award, Sparkles, School as SchoolIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MAX_TOTAL_SCORE, MAX_AUTO_SCORE } from "@/data/quiz";
import { schools, getSchoolName } from "@/data/schools";

type Submission = {
  id: string;
  student_name: string;
  class_number: string;
  auto_score: number;
  manual_score: number;
  total_score: number;
  created_at: string;
};

export default function RankingPage() {
  const [subs, setSubs] = useState<Submission[]>([]);
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterSchool, setFilterSchool] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("submissions")
        .select("*")
        .order("total_score", { ascending: false });
      setSubs((data as Submission[]) || []);
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel("ranking-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "submissions" }, () => load())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter by school first
  const schoolSubs = useMemo(() => {
    if (filterSchool === "all") return subs;
    const school = schools.find((s) => s.id === filterSchool);
    if (!school) return subs;
    return subs.filter((s) => school.classes.includes(s.class_number));
  }, [subs, filterSchool]);

  const classes = useMemo(() => {
    const set = new Set(schoolSubs.map((s) => s.class_number));
    return Array.from(set).sort();
  }, [schoolSubs]);

  const filtered = useMemo(() => {
    const list = filterClass === "all" ? schoolSubs : schoolSubs.filter((s) => s.class_number === filterClass);
    return [...list].sort((a, b) => b.total_score - a.total_score || a.created_at.localeCompare(b.created_at));
  }, [schoolSubs, filterClass]);

  // Group submissions by class, each list sorted by score
  const byClass = useMemo(() => {
    const map = new Map<string, Submission[]>();
    schoolSubs.forEach((s) => {
      const arr = map.get(s.class_number) || [];
      arr.push(s);
      map.set(s.class_number, arr);
    });
    return Array.from(map.entries())
      .map(([cls, list]) => ({
        cls,
        list: [...list].sort(
          (a, b) => b.total_score - a.total_score || a.created_at.localeCompare(b.created_at)
        ),
      }))
      .sort((a, b) => a.cls.localeCompare(b.cls));
  }, [schoolSubs]);

  const classStats = useMemo(() => {
    const map = new Map<string, { count: number; sum: number }>();
    schoolSubs.forEach((s) => {
      const cur = map.get(s.class_number) || { count: 0, sum: 0 };
      cur.count++;
      cur.sum += s.total_score;
      map.set(s.class_number, cur);
    });
    return Array.from(map.entries())
      .map(([cls, v]) => ({ cls, count: v.count, avg: v.sum / v.count }))
      .sort((a, b) => b.avg - a.avg);
  }, [schoolSubs]);

  // Group by school for the "all" view
  const bySchool = useMemo(() => {
    return schools
      .map((school) => ({
        school,
        classes: byClass.filter((c) => school.classes.includes(c.cls)),
      }))
      .filter((g) => g.classes.length > 0);
  }, [byClass]);

  const orphanClasses = useMemo(
    () => byClass.filter((c) => !schools.some((s) => s.classes.includes(c.cls))),
    [byClass]
  );

  const medal = (i: number) => {
    if (i === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (i === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (i === 2) return <Award className="h-5 w-5 text-amber-700" />;
    return <span className="text-sm font-bold text-muted-foreground">#{i + 1}</span>;
  };

  const renderTable = (list: Submission[]) => (
    <table className="w-full">
      <thead className="bg-muted/40">
        <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
          <th className="px-4 py-3 w-12">#</th>
          <th className="px-4 py-3">Aluno</th>
          {filterClass === "all" && <th className="px-4 py-3">Turma</th>}
          <th className="px-4 py-3 text-center">Múltipla</th>
          <th className="px-4 py-3 text-center">Abertas</th>
          <th className="px-4 py-3 text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        {list.map((s, i) => (
          <tr
            key={s.id}
            className={`border-t transition-colors hover:bg-muted/30 ${
              i < 3 ? "bg-primary/5" : ""
            }`}
          >
            <td className="px-4 py-3">{medal(i)}</td>
            <td className="px-4 py-3 font-semibold">{s.student_name}</td>
            {filterClass === "all" && (
              <td className="px-4 py-3 text-muted-foreground">{s.class_number}</td>
            )}
            <td className="px-4 py-3 text-center">
              {s.auto_score}/{MAX_AUTO_SCORE}
            </td>
            <td className="px-4 py-3 text-center">{s.manual_score}</td>
            <td className="px-4 py-3 text-right font-display text-lg font-extrabold text-primary">
              {s.total_score}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="container max-w-5xl py-10">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
          <Sparkles className="h-4 w-4" /> Ao vivo
        </div>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-gradient">🏆 Ranking de Acertos</h1>
        <p className="mt-2 text-muted-foreground">
          Cada turma tem seu próprio ranking. Pontuação máxima: {MAX_TOTAL_SCORE} pts.
        </p>
      </header>

      {classStats.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-xl font-bold">📊 Média por turma</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {classStats.map((c, i) => (
              <div key={c.cls} className="rounded-2xl border bg-card p-4 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-bold">Turma {c.cls}</span>
                  {i === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{c.count} resposta(s)</p>
                <p className="mt-2 text-2xl font-extrabold text-primary">
                  {c.avg.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">/ {MAX_TOTAL_SCORE}</span>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilterClass("all")}
          className={`rounded-full px-4 py-1.5 text-sm font-bold transition-smooth ${
            filterClass === "all" ? "gradient-purple text-primary-foreground" : "bg-muted text-foreground/70 hover:bg-muted/70"
          }`}
        >
          Todas as turmas
        </button>
        {classes.map((c) => (
          <button
            key={c}
            onClick={() => setFilterClass(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition-smooth ${
              filterClass === c ? "gradient-purple text-primary-foreground" : "bg-muted text-foreground/70 hover:bg-muted/70"
            }`}
          >
            Turma {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-card p-8 text-center text-muted-foreground shadow-soft">
          Carregando...
        </div>
      ) : subs.length === 0 ? (
        <div className="rounded-2xl border bg-card p-8 text-center text-muted-foreground shadow-soft">
          Nenhuma resposta ainda. Compartilhe o link! 💜
        </div>
      ) : filterClass === "all" ? (
        <div className="space-y-8">
          {byClass.map(({ cls, list }) => (
            <section key={cls}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-2xl font-extrabold text-gradient">
                  🎒 Turma {cls}
                </h2>
                <span className="text-sm font-semibold text-muted-foreground">
                  {list.length} aluno(s)
                </span>
              </div>
              <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
                {renderTable(list)}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Nenhuma resposta nessa turma ainda.</div>
          ) : (
            renderTable(filtered)
          )}
        </div>
      )}
    </div>
  );
}
