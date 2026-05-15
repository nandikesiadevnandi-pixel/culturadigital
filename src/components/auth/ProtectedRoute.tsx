import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  children: ReactNode;
  requireAdmin?: boolean;
};

export const ProtectedRoute = ({ children, requireAdmin }: Props) => {
  const { user, isAdmin, loading } = useAuth();
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

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/aluno" replace />;
  }

  return <>{children}</>;
};
