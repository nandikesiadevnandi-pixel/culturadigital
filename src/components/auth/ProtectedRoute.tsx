import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

type Props = {
  children: ReactNode;
  requireAdmin?: boolean;
};

export const ProtectedRoute = ({ children, requireAdmin }: Props) => {
  const { user, isAdmin, profile, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container py-20 text-center text-muted-foreground">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/entrar" state={{ from: location }} replace />;
  }

  if (profile?.is_blocked && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#0a0a1a] flex items-center justify-center p-6">
        <div className="max-w-md rounded-3xl border border-red-500/30 bg-[#0f0f24]/80 p-6 text-center">
          <p className="text-5xl mb-3">🚫</p>
          <h1 className="font-display text-2xl font-extrabold text-white mb-2">Conta bloqueada</h1>
          <p className="text-violet-200/80 text-sm mb-4">
            Sua professora bloqueou seu acesso temporariamente. Fale com ela em sala para liberar.
          </p>
          <Button onClick={signOut} className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white">
            Sair
          </Button>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/aluno" replace />;
  }

  return <>{children}</>;
};
