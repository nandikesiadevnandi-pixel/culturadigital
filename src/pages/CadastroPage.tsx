import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { schools } from "@/data/schools";
import { studentLoginEmail } from "@/lib/studentEmail";
import { genStudentPassword } from "@/lib/passwordGen";
import { toast } from "sonner";
import { Sparkles, Copy, Printer, Eye, EyeOff } from "lucide-react";

const ADMIN_EMAIL = "nandikesiadevnandi@gmail.com";

const studentSchema = z.object({
  full_name: z.string().trim().min(2, "Diga seu nome completo").max(80),
  school: z.string().trim().min(2, "Diga sua escola"),
  class_name: z.string().trim().min(1, "Diga sua turma").max(20),
  grade_year: z.number().int().min(4).max(8),
});

const teacherSchema = z.object({
  full_name: z.string().trim().min(2).max(80),
  email: z.string().trim().email("Email inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});

type CredsCard = { login: string; password: string; name: string; school: string; class_name: string };

export default function CadastroPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [creds, setCreds] = useState<CredsCard | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    school: "",
    class_name: "",
    grade_year: 6 as number,
    email: "",
    password: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/aluno", { replace: true });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let email: string;
    let password: string;
    let metadata: Record<string, string>;

    if (isTeacher) {
      const parsed = teacherSchema.safeParse(form);
      if (!parsed.success) return toast.error(parsed.error.issues[0].message);
      email = parsed.data.email;
      password = parsed.data.password;
      metadata = { full_name: parsed.data.full_name, school: "Todas as escolas", class_name: "", grade_year: "" };
    } else {
      const parsed = studentSchema.safeParse(form);
      if (!parsed.success) return toast.error(parsed.error.issues[0].message);
      email = studentLoginEmail(parsed.data.full_name, parsed.data.class_name, parsed.data.school);
      password = genStudentPassword();
      metadata = {
        full_name: parsed.data.full_name,
        school: parsed.data.school,
        class_name: parsed.data.class_name,
        grade_year: String(parsed.data.grade_year),
        plain_password: password, // saved to student_credentials via trigger
      };
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/aluno`, data: metadata },
    });
    setLoading(false);

    if (error) {
      return toast.error(
        error.message.includes("already registered")
          ? "Já existe uma conta com esses dados. Tente entrar."
          : error.message,
      );
    }

    if (isTeacher) {
      toast.success(`Bem-vinda, ${form.full_name.split(" ")[0]}! 🚀`);
      navigate(form.email === ADMIN_EMAIL ? "/admin" : "/aluno", { replace: true });
    } else {
      // Mostra cartão com credenciais antes de entrar
      setCreds({
        login: email,
        password,
        name: form.full_name,
        school: form.school,
        class_name: form.class_name,
      });
    }
  };

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const copyAll = () => {
    if (!creds) return;
    const text = `Nome: ${creds.name}\nTurma: ${creds.class_name}\nEscola: ${creds.school}\nLogin: ${creds.login}\nSenha: ${creds.password}`;
    navigator.clipboard.writeText(text);
    toast.success("Copiado! Cole no caderno ou no WhatsApp.");
  };

  const printCard = () => window.print();

  if (creds) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#0a0a1a] py-12">
        <div className="container max-w-lg">
          <div className="rounded-3xl border-2 border-cyan-400/40 bg-[#0f0f24]/90 p-6 shadow-[0_0_60px_rgba(34,211,238,0.25)] print:bg-white print:text-black">
            <div className="text-center mb-4">
              <span className="text-5xl">🎉</span>
              <h1 className="font-display text-2xl font-extrabold text-white mt-2 print:text-black">Conta criada!</h1>
              <p className="text-violet-200/80 text-sm print:text-black">Anote ou imprima — você vai precisar dessa senha pra entrar de novo.</p>
            </div>

            <div className="rounded-2xl border border-violet-500/30 bg-[#0a0a1a] p-4 space-y-2 print:bg-white print:border-black">
              <Row k="Nome" v={creds.name} />
              <Row k="Turma" v={creds.class_name} />
              <Row k="Escola" v={creds.school} />
              <Row k="Login" v={creds.login} mono />
              <Row k="Senha" v={creds.password} mono highlight />
            </div>

            <p className="text-xs text-violet-200/60 mt-3 print:text-black">
              ⚠️ A professora também guarda essa senha — se esquecer, ela consegue te passar de novo.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 print:hidden">
              <Button onClick={copyAll} variant="outline" className="border-violet-500/40 text-violet-100">
                <Copy className="h-4 w-4 mr-1" /> Copiar
              </Button>
              <Button onClick={printCard} variant="outline" className="border-violet-500/40 text-violet-100">
                <Printer className="h-4 w-4 mr-1" /> Imprimir
              </Button>
            </div>

            <Button
              onClick={() => navigate("/aluno", { replace: true })}
              className="mt-3 w-full bg-gradient-to-r from-violet-500 to-cyan-400 text-white font-bold print:hidden"
            >
              Entrar na plataforma 🚀
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#0a0a1a] py-12">
      <div className="container max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_30px_rgba(167,139,250,0.5)]">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-white">Crie sua conta</h1>
          <p className="mt-2 text-sm text-violet-200/70">
            Bem-vindx à <span className="text-cyan-300 font-bold">Cultura Digital Educacional</span>
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-violet-500/20 bg-[#0f0f24]/80 p-6 backdrop-blur-xl shadow-[0_0_60px_rgba(99,102,241,0.15)]">
          <div>
            <Label className="text-violet-200">Seu nome completo</Label>
            <Input
              className="mt-1 border-violet-500/30 bg-[#0a0a1a] text-white placeholder:text-violet-300/30"
              placeholder="Ex: Maria da Silva"
              value={form.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              required
              maxLength={80}
            />
          </div>

          {!isTeacher && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-violet-200">Ano</Label>
                  <Select value={String(form.grade_year)} onValueChange={(v) => set("grade_year", Number(v))}>
                    <SelectTrigger className="mt-1 border-violet-500/30 bg-[#0a0a1a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[4, 5, 6, 7, 8].map((y) => (
                        <SelectItem key={y} value={String(y)}>{y}º ano</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-violet-200">Turma</Label>
                  <Input
                    className="mt-1 border-violet-500/30 bg-[#0a0a1a] text-white placeholder:text-violet-300/30"
                    placeholder="Ex: 7A, 142"
                    value={form.class_name}
                    onChange={(e) => set("class_name", e.target.value)}
                    maxLength={20}
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-violet-200">Sua escola</Label>
                <Select value={form.school} onValueChange={(v) => set("school", v)}>
                  <SelectTrigger className="mt-1 border-violet-500/30 bg-[#0a0a1a] text-white">
                    <SelectValue placeholder="Escolha..." />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((s) => (
                      <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                    ))}
                    <SelectItem value="Outra">Outra escola</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-xs text-violet-200/60 rounded-lg bg-cyan-500/10 border border-cyan-500/30 p-2">
                ✨ A senha é gerada automaticamente. Mostramos pra você anotar.
              </p>
            </>
          )}

          {isTeacher && (
            <>
              <div>
                <Label className="text-violet-200">Email</Label>
                <Input
                  type="email"
                  className="mt-1 border-violet-500/30 bg-[#0a0a1a] text-white placeholder:text-violet-300/30"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  required
                  maxLength={255}
                />
              </div>
              <div>
                <Label className="text-violet-200">Senha</Label>
                <div className="relative mt-1">
                  <Input
                    type={showPass ? "text" : "password"}
                    className="border-violet-500/30 bg-[#0a0a1a] text-white placeholder:text-violet-300/30 pr-10"
                    placeholder="Mínimo 6 caracteres"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    required
                    minLength={6}
                    maxLength={72}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-300/60 hover:text-violet-200"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-500 to-cyan-400 text-white font-bold shadow-[0_0_20px_rgba(167,139,250,0.4)] hover:opacity-90"
          >
            {loading ? "Criando..." : "Criar conta e entrar 🚀"}
          </Button>

          <p className="text-center text-xs text-violet-200/60">
            Já tem conta?{" "}
            <Link to="/entrar" className="text-cyan-300 font-bold hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Row({ k, v, mono, highlight }: { k: string; v: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs text-violet-200/70 print:text-black">{k}</span>
      <span
        className={[
          "text-right break-all",
          mono ? "font-mono text-sm" : "text-sm",
          highlight ? "text-cyan-300 font-bold text-base print:text-black" : "text-white print:text-black",
        ].join(" ")}
      >
        {v}
      </span>
    </div>
  );
}
