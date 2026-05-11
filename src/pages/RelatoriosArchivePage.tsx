import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Check, Plus, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MESES_CURTO, formatPeriodKey } from "@/data/relatorio";
import { toast } from "sonner";

export default function RelatoriosArchivePage() {
  const navigate = useNavigate();
  const [year, setYear] = useState(new Date().getFullYear());
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/auth", { replace: true });
      else setUserEmail(session.user.email ?? null);
    });
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      if (!data.session) {
        navigate("/auth", { replace: true });
        return;
      }
      setUserEmail(data.session.user.email ?? null);
      await loadKeys();
      setLoading(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const loadKeys = async () => {
    const { data, error } = await supabase
      .from("monthly_reports")
      .select("period_key");
    if (error) {
      toast.error("Erro ao carregar relatórios");
      return;
    }
    setSavedKeys(new Set((data ?? []).map((r) => r.period_key)));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  if (loading) {
    return <div className="container py-20 text-center text-muted-foreground">Carregando…</div>;
  }

  return (
    <div className="container max-w-5xl py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Arquivo de Relatórios</h1>
          <p className="text-sm text-muted-foreground">
            Acessada como <span className="font-medium">{userEmail}</span>
          </p>
        </div>
        <Button variant="outline" onClick={signOut} className="gap-2">
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </div>

      <div className="flex items-center justify-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => setYear((y) => y - 1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="font-display text-4xl font-extrabold tabular-nums">{year}</div>
        <Button variant="ghost" size="icon" onClick={() => setYear((y) => y + 1)}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {MESES_CURTO.map((mes, i) => {
          const key = formatPeriodKey(year, i + 1);
          const exists = savedKeys.has(key);
          return (
            <Link
              key={key}
              to={`/admin/relatorios/${key}`}
              className={`group relative rounded-xl border-2 p-6 text-center transition-all hover:shadow-elegant ${
                exists
                  ? "border-primary bg-primary/5 hover:bg-primary/10"
                  : "border-dashed border-border bg-muted/30 hover:bg-muted/50"
              }`}
            >
              {exists && (
                <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}
              <div className="font-display text-xl font-extrabold mb-1">{mes}</div>
              <div className="text-xs text-muted-foreground">{year}</div>
              <div className="mt-3 text-xs font-medium">
                {exists ? (
                  <span className="text-primary">Abrir relatório</span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Plus className="h-3 w-3" /> Criar
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
