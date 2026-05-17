import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { LESSONS, CHALLENGES, Challenge } from "@/data/codeLessons";
import { Play, Save, Trash2, Star, Sparkles, BookOpen, Code2, Trophy, Rocket, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

type Project = {
  id: string;
  title: string;
  html: string;
  css: string;
  js: string;
  updated_at: string;
};

const DEFAULT_HTML = `<h1>👋 Olá mundo!</h1>\n<p>Meu primeiro site 💜</p>\n<button onclick="alert('Funcionou!')">Clica em mim</button>`;
const DEFAULT_CSS = `body {\n  font-family: system-ui;\n  background: #f06d06;\n  color: white;\n  text-align: center;\n  padding: 40px;\n}\nh1 { font-size: 60px; }\nbutton { padding: 12px 24px; border-radius: 12px; border: 0; cursor: pointer; }`;
const DEFAULT_JS = `// 🧠 JavaScript é o cérebro!\nconsole.log("Pronta pra codar!");`;

function buildSrcDoc(html: string, css: string, js: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}<script>try{${js}}catch(e){document.body.insertAdjacentHTML('beforeend','<pre style=\\"color:red;background:#fee;padding:8px\\">'+e.message+'</pre>')}<\/script></body></html>`;
}

export default function CodarHubPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [tab, setTab] = useState("aulas");

  // playground state
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [title, setTitle] = useState("Meu primeiro site");
  const [srcDoc, setSrcDoc] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  // challenge state
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);

  const run = () => setSrcDoc(buildSrcDoc(html, css, js));
  useEffect(() => {
    const t = setTimeout(run, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, css, js]);

  const loadAll = async () => {
    if (!user) return;
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from("code_projects").select("*").order("updated_at", { ascending: false }),
      supabase.from("code_challenge_progress").select("challenge_id"),
    ]);
    setProjects((p ?? []) as Project[]);
    setCompletedIds(new Set((c ?? []).map((x: any) => x.challenge_id)));
  };
  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const saveProject = async () => {
    if (!user) return;
    if (currentProjectId) {
      const { error } = await supabase
        .from("code_projects")
        .update({ title, html, css, js })
        .eq("id", currentProjectId);
      if (error) return toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      toast({ title: "Salvo! 💾", description: title });
    } else {
      const { data, error } = await supabase
        .from("code_projects")
        .insert({ user_id: user.id, title, html, css, js })
        .select()
        .single();
      if (error) return toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      setCurrentProjectId(data.id);
      toast({ title: "Site criado! 🚀", description: title });
    }
    loadAll();
  };

  const newProject = () => {
    setCurrentProjectId(null);
    setTitle("Meu novo site");
    setHtml(DEFAULT_HTML);
    setCss(DEFAULT_CSS);
    setJs(DEFAULT_JS);
    setTab("playground");
  };

  const openProject = (p: Project) => {
    setCurrentProjectId(p.id);
    setTitle(p.title);
    setHtml(p.html);
    setCss(p.css);
    setJs(p.js);
    setTab("playground");
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Apagar este site?")) return;
    await supabase.from("code_projects").delete().eq("id", id);
    if (currentProjectId === id) newProject();
    loadAll();
  };

  const startChallenge = (c: Challenge) => {
    setActiveChallenge(c);
    setCurrentProjectId(null);
    setTitle(`Desafio: ${c.title}`);
    setHtml(c.starter.html);
    setCss(c.starter.css);
    setJs(c.starter.js);
    setTab("playground");
  };

  const submitChallenge = async () => {
    if (!activeChallenge || !user) return;
    const results = activeChallenge.checks.map((c) => ({ d: c.description, ok: c.test({ html, css, js }) }));
    const passed = results.every((r) => r.ok);
    if (!passed) {
      toast({
        title: "Quase lá! 💪",
        description: results.filter((r) => !r.ok).map((r) => "✗ " + r.d).join(" · "),
        variant: "destructive",
      });
      return;
    }
    if (completedIds.has(activeChallenge.id)) {
      toast({ title: "Já tinhas conquistado este! ⭐", description: "Bora pro próximo?" });
      return;
    }
    const { error } = await supabase.from("code_challenge_progress").insert({
      user_id: user.id,
      challenge_id: activeChallenge.id,
      stars: 3,
    });
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    // XP via xp_events
    await supabase.from("xp_events").insert({
      user_id: user.id,
      amount: activeChallenge.xp,
      source: "code_challenge",
      source_id: activeChallenge.id,
      reason: `Desafio: ${activeChallenge.title}`,
    });
    toast({ title: `🎉 +${activeChallenge.xp} XP!`, description: "Conquista desbloqueada!" });
    await refreshProfile();
    loadAll();
  };

  const totalChallenges = CHALLENGES.length;
  const doneCount = completedIds.size;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#1a0a2a]">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <Link to="/aluno" className="inline-flex items-center gap-1 text-xs text-violet-300/70 hover:text-white mb-2">
              <ArrowLeft className="h-3 w-3" /> Voltar
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white">
              💻 Aprendendo a Codar
            </h1>
            <p className="text-violet-200/70 text-sm">
              Olá {profile?.full_name?.split(" ")[0] ?? "dev"}! Aqui tu crias teus próprios sites 🚀
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="border-cyan-400/40 text-cyan-200 bg-cyan-500/10">
              <Trophy className="mr-1 h-3 w-3" /> {doneCount}/{totalChallenges} desafios
            </Badge>
            <Badge variant="outline" className="border-violet-400/40 text-violet-200 bg-violet-500/10">
              <Sparkles className="mr-1 h-3 w-3" /> {profile?.total_xp ?? 0} XP
            </Badge>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-[#0f0f24] border border-violet-500/20">
            <TabsTrigger value="aulas"><BookOpen className="mr-1 h-4 w-4" /> Aulas</TabsTrigger>
            <TabsTrigger value="playground"><Code2 className="mr-1 h-4 w-4" /> Playground</TabsTrigger>
            <TabsTrigger value="desafios"><Trophy className="mr-1 h-4 w-4" /> Desafios</TabsTrigger>
            <TabsTrigger value="sites"><Rocket className="mr-1 h-4 w-4" /> Meus sites</TabsTrigger>
          </TabsList>

          {/* AULAS */}
          <TabsContent value="aulas" className="mt-6">
            <div className="grid gap-4 md:grid-cols-3">
              {LESSONS.map((l) => (
                <Card key={l.id} className="border-violet-500/20 bg-[#0f0f24]/80 p-6 backdrop-blur">
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${l.color} text-3xl shadow-lg mb-3`}>
                    {l.emoji}
                  </div>
                  <h3 className="font-display text-xl font-extrabold text-white">{l.title}</h3>
                  <p className="text-xs text-violet-200/60 mb-3">{l.subtitle}</p>
                  <p className="text-sm text-violet-100/90 mb-4">{l.metaphor}</p>
                  <div className="space-y-3">
                    {l.blocks.map((b, i) => {
                      if (b.kind === "p") return <p key={i} className="text-sm text-violet-100/80">{b.text}</p>;
                      if (b.kind === "code")
                        return (
                          <pre key={i} className="rounded-lg bg-black/60 p-3 text-xs text-cyan-300 overflow-x-auto border border-violet-500/20">
                            <code>{b.text}</code>
                          </pre>
                        );
                      if (b.kind === "tip")
                        return (
                          <div key={i} className="rounded-lg bg-cyan-500/10 border border-cyan-400/30 p-2 text-xs text-cyan-100">
                            💡 {b.text}
                          </div>
                        );
                      return (
                        <div key={i} className="rounded-lg bg-pink-500/10 border border-pink-400/30 p-2 text-xs text-pink-100">
                          🧪 Tenta: {b.text}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button onClick={() => setTab("playground")} size="lg" className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white">
                <Play className="mr-2 h-4 w-4" /> Bora codar no Playground!
              </Button>
            </div>
          </TabsContent>

          {/* PLAYGROUND */}
          <TabsContent value="playground" className="mt-6">
            <Card className="border-violet-500/20 bg-[#0f0f24]/80 p-4 mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="max-w-xs bg-black/40 border-violet-500/30 text-white"
                  placeholder="Nome do site"
                />
                <Button onClick={run} variant="outline" className="border-cyan-400/40 text-cyan-100">
                  <Play className="mr-1 h-4 w-4" /> Rodar
                </Button>
                <Button onClick={saveProject} className="bg-gradient-to-r from-violet-500 to-cyan-400">
                  <Save className="mr-1 h-4 w-4" /> {currentProjectId ? "Salvar" : "Criar site"}
                </Button>
                <Button onClick={newProject} variant="ghost" className="text-violet-200">Novo</Button>
                {activeChallenge && (
                  <div className="ml-auto flex items-center gap-2">
                    <Badge className="bg-pink-500/20 text-pink-100 border border-pink-400/40">
                      🎯 {activeChallenge.title} (+{activeChallenge.xp} XP)
                    </Badge>
                    <Button onClick={submitChallenge} className="bg-gradient-to-r from-pink-500 to-orange-400">
                      Enviar desafio ✨
                    </Button>
                  </div>
                )}
              </div>
              {activeChallenge && (
                <p className="mt-3 text-sm text-pink-100/90">{activeChallenge.brief}</p>
              )}
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <EditorBox label="HTML 🦴" color="text-orange-300" value={html} onChange={setHtml} />
                <EditorBox label="CSS 👕" color="text-cyan-300" value={css} onChange={setCss} />
                <EditorBox label="JS 🧠" color="text-yellow-300" value={js} onChange={setJs} />
              </div>
              <Card className="border-violet-500/20 bg-white overflow-hidden h-[600px]">
                <div className="px-3 py-2 bg-[#0f0f24] text-xs text-violet-200 border-b border-violet-500/20 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  <span className="ml-2 font-mono">preview · {title}</span>
                </div>
                <iframe title="preview" srcDoc={srcDoc} sandbox="allow-scripts" className="w-full h-full bg-white" />
              </Card>
            </div>
          </TabsContent>

          {/* DESAFIOS */}
          <TabsContent value="desafios" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CHALLENGES.map((c) => {
                const done = completedIds.has(c.id);
                return (
                  <Card
                    key={c.id}
                    className={`border-violet-500/20 bg-[#0f0f24]/80 p-5 backdrop-blur transition-all ${
                      done ? "ring-2 ring-emerald-400/50" : "hover:border-cyan-400/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-3xl">{c.emoji}</div>
                      {done ? (
                        <div className="flex gap-0.5">
                          {[1, 2, 3].map((s) => <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                        </div>
                      ) : (
                        <Badge variant="outline" className="border-violet-400/40 text-violet-200">+{c.xp} XP</Badge>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-extrabold text-white">{c.title}</h3>
                    <p className="text-sm text-violet-200/70 mt-1 mb-4 min-h-[40px]">{c.brief}</p>
                    <Button
                      onClick={() => startChallenge(c)}
                      className={done
                        ? "w-full bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30"
                        : "w-full bg-gradient-to-r from-pink-500 to-orange-400"}
                    >
                      {done ? "✅ Refazer" : "Começar desafio"}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* MEUS SITES */}
          <TabsContent value="sites" className="mt-6">
            <div className="mb-4">
              <Button onClick={newProject} className="bg-gradient-to-r from-violet-500 to-cyan-400">
                + Criar novo site
              </Button>
            </div>
            {projects.length === 0 ? (
              <Card className="border-violet-500/20 bg-[#0f0f24]/80 p-10 text-center text-violet-200/70">
                Ainda não tens sites salvos. Vai no Playground e cria o teu primeiro! 💜
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => (
                  <Card key={p.id} className="border-violet-500/20 bg-[#0f0f24]/80 overflow-hidden">
                    <iframe
                      title={p.title}
                      srcDoc={buildSrcDoc(p.html, p.css, p.js)}
                      sandbox="allow-scripts"
                      className="w-full h-40 bg-white pointer-events-none"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-white truncate">{p.title}</h3>
                      <p className="text-xs text-violet-200/50 mb-3">
                        {new Date(p.updated_at).toLocaleDateString("pt-BR")}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => openProject(p)} className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-400">
                          Abrir
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteProject(p.id)} className="text-pink-300 hover:text-pink-100">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EditorBox({
  label,
  color,
  value,
  onChange,
}: {
  label: string;
  color: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Card className="border-violet-500/20 bg-[#0f0f24]/80 overflow-hidden">
      <div className={`px-3 py-2 bg-black/40 border-b border-violet-500/20 text-xs font-bold ${color}`}>
        {label}
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="font-mono text-xs bg-[#0a0a1a] text-violet-100 border-0 rounded-none min-h-[170px] resize-y focus-visible:ring-0"
      />
    </Card>
  );
}
