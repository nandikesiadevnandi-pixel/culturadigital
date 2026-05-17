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
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

const ADMIN_EMAIL = "nandikesiadevnandi@gmail.com";

const studentSchema = z.object({
  full_name: z.string().trim().min(2, "Diga seu nome completo").max(80),
  school: z.string().trim().min(2, "Diga sua escola"),
  class_name: z.string().trim().min(1, "Diga sua turma").max(20),
  grade_year: z.number().int().min(4).max(8),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});

const teacherSchema = z.object({
  full_name: z.string().trim().min(2).max(80),
  email: z.string().trim().email("Email inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});

export default function CadastroPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
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
    let metadata: Record<string, string>;

    if (isTeacher) {
      const parsed = teacherSchema.safeParse(form);
      if (!parsed.success) {
        toast.error(parsed.error.issues[0].message);
        return;
      }
      email = parsed.data.email;
      metadata = {
        full_name: parsed.data.full_name,
        school: "Todas as escolas",
        class_name: "",
        grade_year: "",
      };
    } else {
      const parsed = studentSchema.safeParse(form);
      if (!parsed.success) {
        toast.error(parsed.error.issues[0].message);
        return;
      }
      email = studentLoginEmail(parsed.data.full_name, parsed.data.class_name, parsed.data.school);
      metadata = {
        full_name: parsed.data.full_name,
        school: parsed.data.school,
        class_name: parsed.data.class_name,
        grade_year: String(parsed.data.grade_year),
      };
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/aluno`,
        data: metadata,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(
        error.message.includes("already registered")
          ? "Já existe uma conta com esses dados. Tente entrar."
          : error.message,
      );
      return;
    }
    toast.success(`Bem-vindx, ${form.full_name.split(" ")[0]}! 🚀`);
    navigate(isTeacher || form.email === ADMIN_EMAIL ? "/admin" : "/aluno", { replace: true });
  };

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

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

          <div className="flex items-center gap-2 rounded-xl border border-violet-500/20 bg-[#0a0a1a] px-3 py-2">
            <input
              id="is_teacher"
              type="checkbox"
              checked={isTeacher}
              onChange={(e) => setIsTeacher(e.target.checked)}
              className="h-4 w-4 accent-cyan-400"
            />
            <Label htmlFor="is_teacher" className="cursor-pointer text-violet-100">
              Sou professora (entro com email)
            </Label>
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
            </>
          )}

          {isTeacher && (
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
          )}

          <div>
            <Label className="text-violet-200">Senha</Label>
            <Input
              type="password"
              className="mt-1 border-violet-500/30 bg-[#0a0a1a] text-white placeholder:text-violet-300/30"
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              required
              minLength={6}
              maxLength={72}
            />
          </div>

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
