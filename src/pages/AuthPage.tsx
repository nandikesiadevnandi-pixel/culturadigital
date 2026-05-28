import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { schools } from "@/data/schools";
import { studentLoginEmail } from "@/lib/studentEmail";
import { genStudentPassword } from "@/lib/passwordGen";
import { toast } from "sonner";
import { Sparkles, KeyRound, Eye, EyeOff, Copy, Check } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isTeacher, setIsTeacher] = useState(false);
  const [fullName, setFullName] = useState("");
  const [school, setSchool] = useState("");
  const [className, setClassName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password reset state
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetName, setResetName] = useState("");
  const [resetClass, setResetClass] = useState("");
  const [resetSchool, setResetSchool] = useState("");
  const [generatedPass, setGeneratedPass] = useState("");
  const [copied, setCopied] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

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
    if (error) {
      toast.error("Dados incorretos. Confira nome, turma, escola e senha.");
      setShowReset(true);
    } else {
      toast.success("Bem-vindx de volta! 🚀");
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);

    if (isTeacher) {
      if (!resetEmail.trim()) { toast.error("Informe seu email"); setResetLoading(false); return; }
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/nova-senha`,
      });
      setResetLoading(false);
      if (error) toast.error(error.message);
      else toast.success("Email de redefinição enviado! Verifique sua caixa de entrada.");
    } else {
      if (!resetName.trim() || !resetClass.trim() || !resetSchool.trim()) {
        toast.error("Preencha nome, turma e escola para gerar nova senha");
        setResetLoading(false);
        return;
      }
      const newPass = genStudentPassword();
      const { error } = await supabase.functions.invoke('reset-student-password', {
        body: { name: resetName.trim(), class_name: resetClass.trim(), school: resetSchool.trim(), new_password: newPass },
      });
      setResetLoading(false);
      if (error) {
        const msg = (error as { message?: string })?.message ?? '';
        toast.error(msg.includes('não encontrada') ? msg : 'Conta não encontrada. Confira nome, turma e escola.');
        return;
      }
      setGeneratedPass(newPass);
    }
  };

  const copyPass = () => {
    navigator.clipboard.writeText(generatedPass).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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

        {!showReset ? (
          <form onSubmit={signIn} className="space-y-4 rounded-3xl border border-violet-500/20 bg-[#0f0f24]/80 p-6 backdrop-blur-xl shadow-[0_0_60px_rgba(99,102,241,0.15)]">
            <div className="flex gap-2 rounded-xl bg-[#0a0a1a] p-1 border border-violet-500/20">
              <button
                type="button"
                onClick={() => setIsTeacher(false)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition ${!isTeacher ? "bg-gradient-to-r from-violet-500 to-cyan-400 text-white" : "text-violet-200/70"}`}
              >
                Aluno
              </button>
              <button
                type="button"
                onClick={() => setIsTeacher(true)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition ${isTeacher ? "bg-gradient-to-r from-violet-500 to-cyan-400 text-white" : "text-violet-200/70"}`}
              >
                Professora / ADM
              </button>
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
              <div className="relative mt-1">
                <Input
                  type={showPass ? "text" : "password"}
                  className="border-violet-500/30 bg-[#0a0a1a] text-white pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-500 to-cyan-400 text-white font-bold shadow-[0_0_20px_rgba(167,139,250,0.4)] hover:opacity-90"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="flex items-center justify-between text-xs">
              <p className="text-violet-200/60">
                Ainda não tem conta?{" "}
                <Link to="/cadastro" className="text-cyan-300 font-bold hover:underline">
                  Criar conta
                </Link>
              </p>
              <button
                type="button"
                onClick={() => setShowReset(true)}
                className="text-violet-300/60 hover:text-violet-200 flex items-center gap-1"
              >
                <KeyRound className="h-3 w-3" /> Esqueci a senha
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-3xl border border-violet-500/20 bg-[#0f0f24]/80 p-6 backdrop-blur-xl shadow-[0_0_60px_rgba(99,102,241,0.15)]">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                <KeyRound className="h-5 w-5 text-violet-300" />
              </div>
              <div>
                <h2 className="font-bold text-white">Redefinir senha</h2>
                <p className="text-xs text-violet-200/60">
                  {isTeacher ? "Enviaremos um link para seu email" : "Gere uma nova senha para entrar na plataforma"}
                </p>
              </div>
            </div>

            {/* Teacher/Student toggle */}
            <div className="flex gap-2 rounded-xl bg-[#0a0a1a] p-1 border border-violet-500/20 mb-4">
              <button type="button" onClick={() => setIsTeacher(false)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition ${!isTeacher ? "bg-gradient-to-r from-violet-500 to-cyan-400 text-white" : "text-violet-200/70"}`}>
                Aluno
              </button>
              <button type="button" onClick={() => setIsTeacher(true)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition ${isTeacher ? "bg-gradient-to-r from-violet-500 to-cyan-400 text-white" : "text-violet-200/70"}`}>
                Professora / ADM
              </button>
            </div>

            {generatedPass ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#1E9B5F]/40 bg-[#1E9B5F]/10 p-4 text-center">
                  <p className="text-xs text-[#1E9B5F] font-bold mb-1">✅ Senha atualizada!</p>
                  <p className="text-sm text-white/70 mb-2">Sua nova senha é:</p>
                  <p className="font-black text-2xl text-white tracking-widest font-mono mb-3">{generatedPass}</p>
                  <button
                    type="button"
                    onClick={copyPass}
                    className="flex items-center gap-2 mx-auto rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold px-4 py-2 hover:bg-white/20 transition"
                  >
                    {copied ? <Check className="h-4 w-4 text-[#1E9B5F]" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copiado!" : "Copiar senha"}
                  </button>
                </div>
                <p className="text-xs text-white/50 text-center">Anote essa senha para não esquecer de novo.</p>
                <Button
                  type="button"
                  onClick={async () => {
                    const { studentLoginEmail: sle } = await import("@/lib/studentEmail");
                    const loginEmail = sle(resetName, resetClass, resetSchool);
                    setLoading(true);
                    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: generatedPass });
                    setLoading(false);
                    if (error) toast.error("Erro ao entrar. Tente de novo.");
                    else { setShowReset(false); setGeneratedPass(""); }
                  }}
                  className="w-full bg-gradient-to-r from-violet-500 to-cyan-400 text-white font-bold"
                  disabled={loading}
                >
                  {loading ? "Entrando..." : "Entrar agora 🚀"}
                </Button>
                <button
                  type="button"
                  onClick={() => setGeneratedPass("")}
                  className="w-full text-xs text-violet-300/50 hover:text-violet-200 text-center py-1"
                >
                  Gerar outra senha
                </button>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
                {isTeacher ? (
                  <div>
                    <Label className="text-violet-200">Email cadastrado</Label>
                    <Input
                      type="email"
                      className="mt-1 border-violet-500/30 bg-[#0a0a1a] text-white"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <Label className="text-violet-200">Nome completo</Label>
                      <Input
                        className="mt-1 border-violet-500/30 bg-[#0a0a1a] text-white"
                        value={resetName}
                        onChange={e => setResetName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-violet-200">Turma</Label>
                      <Input
                        className="mt-1 border-violet-500/30 bg-[#0a0a1a] text-white"
                        value={resetClass}
                        onChange={e => setResetClass(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-violet-200">Escola</Label>
                      <Select value={resetSchool} onValueChange={setResetSchool}>
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

                <Button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-gradient-to-r from-violet-500 to-cyan-400 text-white font-bold"
                >
                  {resetLoading ? "Aguarde..." : isTeacher ? "Enviar link de redefinição" : "Gerar nova senha"}
                </Button>

                <button
                  type="button"
                  onClick={() => setShowReset(false)}
                  className="w-full text-xs text-violet-300/50 hover:text-violet-200 text-center py-1"
                >
                  ← Voltar ao login
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
