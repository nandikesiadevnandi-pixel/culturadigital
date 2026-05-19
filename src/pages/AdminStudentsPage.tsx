import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, KeyRound, Copy, Users, Search } from "lucide-react";

type Student = {
  user_id: string;
  full_name: string;
  school: string | null;
  class_name: string | null;
  login_email: string;
  roles: string[];
};

export default function AdminStudentsPage() {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [filter, setFilter] = useState("");
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-students", {
        body: { action: "list" },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setStudents((data as any).students || []);
    } catch (e: any) {
      toast.error(e.message || "Erro ao carregar alunos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const copy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    toast.success("Copiado!");
  };

  const resetPassword = async (user_id: string) => {
    if (!newPassword || newPassword.length < 4) {
      toast.error("Senha precisa ter pelo menos 4 caracteres");
      return;
    }
    try {
      const { data, error } = await supabase.functions.invoke("admin-students", {
        body: { action: "reset_password", payload: { user_id, new_password: newPassword } },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast.success("Senha redefinida! Avise o aluno.");
      setResettingId(null);
      setNewPassword("");
    } catch (e: any) {
      toast.error(e.message || "Erro ao redefinir senha");
    }
  };

  const filtered = students.filter((s) => {
    const q = filter.toLowerCase().trim();
    if (!q) return true;
    return (
      s.full_name.toLowerCase().includes(q) ||
      (s.school || "").toLowerCase().includes(q) ||
      (s.class_name || "").toLowerCase().includes(q) ||
      s.login_email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#0a0a1a] py-8">
      <div className="container max-w-5xl">
        <Link to="/admin" className="inline-flex items-center gap-2 text-violet-200 hover:text-white text-sm mb-4">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <div className="mb-6 flex items-center gap-3">
          <Users className="h-7 w-7 text-cyan-400" />
          <div>
            <h1 className="font-display text-3xl font-extrabold text-white">Alunos cadastrados</h1>
            <p className="text-sm text-violet-200/70">
              Veja o login de cada aluno e redefina a senha caso esqueçam.
            </p>
          </div>
        </div>

        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-300" />
          <Input
            placeholder="Buscar por nome, turma, escola..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9 border-violet-500/30 bg-[#0f0f24] text-white"
          />
        </div>

        {loading ? (
          <p className="text-center text-violet-200">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-violet-200/70">Nenhum aluno encontrado.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((s) => {
              const isTeacher = s.roles.includes("admin");
              return (
                <div
                  key={s.user_id}
                  className="rounded-2xl border border-violet-500/20 bg-[#0f0f24]/80 p-4 backdrop-blur"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link to={`/admin/alunos/${s.user_id}`} className="font-bold text-white hover:text-cyan-300 underline-offset-2 hover:underline">
                          {s.full_name}
                        </Link>
                        {isTeacher && (
                          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-200">
                            admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-violet-200/70 mt-0.5">
                        {s.class_name || "—"} · {s.school || "—"}
                      </p>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <code className="text-xs text-cyan-300 break-all">{s.login_email}</code>
                        <button
                          onClick={() => copy(s.login_email)}
                          className="text-violet-300 hover:text-white"
                          title="Copiar"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <Link to={`/admin/alunos/${s.user_id}`} className="text-xs text-cyan-300 hover:underline ml-2">
                          ver evolução →
                        </Link>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-violet-500/40 text-violet-100 hover:bg-violet-500/20"
                      onClick={() => {
                        setResettingId(resettingId === s.user_id ? null : s.user_id);
                        setNewPassword("");
                      }}
                    >
                      <KeyRound className="h-4 w-4 mr-1" />
                      Redefinir senha
                    </Button>
                  </div>

                  {resettingId === s.user_id && (
                    <div className="mt-3 rounded-xl border border-cyan-500/30 bg-[#0a0a1a] p-3">
                      <Label className="text-violet-200 text-xs">Nova senha para {s.full_name}</Label>
                      <div className="mt-1 flex gap-2">
                        <Input
                          type="text"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Ex: aluno123"
                          className="border-violet-500/30 bg-[#0f0f24] text-white"
                        />
                        <Button
                          onClick={() => resetPassword(s.user_id)}
                          className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
                        >
                          Salvar
                        </Button>
                      </div>
                      <p className="mt-2 text-xs text-violet-200/60">
                        Anote e passe ao aluno. Mínimo 4 caracteres.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
