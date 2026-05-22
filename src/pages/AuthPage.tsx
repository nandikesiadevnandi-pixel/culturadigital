import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { schools } from "@/data/schools";
import { studentLoginEmail } from "@/lib/studentEmail";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const isTeacher = false;
  const [fullName, setFullName] = useState("");
  const [school, setSchool] = useState("");
  const [className, setClassName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const goHome = () => navigate("/", { replace: true });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) return;
      setTimeout(goHome, 0);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) goHome();
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalEmail = isTeacher ? email.trim() : studentLoginEmail(fullName, className, school);
    if (!isTeacher && (!fullName.trim() || !className.trim() || !school.trim())) {
      toast.error("Preencha nome, turma e escola");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: finalEmail, password });
    setLoading(false);
    if (error) toast.error("Dados incorretos. Confira nome, turma, escola e senha.");
    else toast.success("Bem-vindx de volta! 🚀");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#0a0a1a] py-12">
      <div className="container max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_30px_rgba(167,139,250,0.5)]">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-white">Entrar</h1>
          <p className="mt-2 text-sm text-violet-200/70">Cultura Digital Educacional</p>
        </div>

        <form onSubmit={signIn} className="space-y-4 rounded-3xl border border-violet-500/20 bg-[#0f0f24]/80 p-6 backdrop-blur-xl shadow-[0_0_60px_rgba(99,102,241,0.15)]">
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

          {!isTeacher ? (
            <>
              <div>
                <Label className="text-violet-200">Nome completo</Label>
                <Input
                  className="mt-1 border-violet-500/30 bg-[#0a0a1a] text-white"
                  placeholder="Ex: Maria da Silva"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-violet-200">Turma</Label>
                <Input
                  className="mt-1 border-violet-500/30 bg-[#0a0a1a] text-white"
                  placeholder="Ex: 7A, 142"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-violet-200">Escola</Label>
                <Select value={school} onValueChange={setSchool}>
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
          ) : (
            <div>
              <Label className="text-violet-200">Email</Label>
              <Input
                type="email"
                className="mt-1 border-violet-500/30 bg-[#0a0a1a] text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <Label className="text-violet-200">Senha</Label>
            <Input
              type="password"
              className="mt-1 border-violet-500/30 bg-[#0a0a1a] text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-500 to-cyan-400 text-white font-bold shadow-[0_0_20px_rgba(167,139,250,0.4)] hover:opacity-90"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <p className="text-center text-xs text-violet-200/60">
            Ainda não tem conta?{" "}
            <Link to="/cadastro" className="text-cyan-300 font-bold hover:underline">
              Criar conta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
