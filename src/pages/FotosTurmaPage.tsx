import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FotosTurmaPage() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/aluno/feed", { replace: true }); }, [navigate]);
  return null;
}
