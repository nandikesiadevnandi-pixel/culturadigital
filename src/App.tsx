import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/portfolio/Layout";
import { PlatformProvider } from "@/contexts/PlatformContext";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Home from "./pages/Home.tsx";
import SobrePage from "./pages/SobrePage.tsx";
import AulasPage from "./pages/AulasPage.tsx";
import ProgressoPage from "./pages/ProgressoPage.tsx";
import GaleriaPage from "./pages/GaleriaPage.tsx";
import AvaliacaoPage from "./pages/AvaliacaoPage.tsx";
import RankingPage from "./pages/RankingPage.tsx";
import AdminAvaliacaoPage from "./pages/AdminAvaliacaoPage.tsx";
import FolhaRegistroPage from "./pages/FolhaRegistroPage.tsx";
import RelatoriosArchivePage from "./pages/RelatoriosArchivePage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import CadastroPage from "./pages/CadastroPage.tsx";
import AlunoDashboardPage from "./pages/AlunoDashboardPage.tsx";
import CodarHubPage from "./pages/CodarHubPage.tsx";
import TrilhaPage from "./pages/TrilhaPage.tsx";
import JogosPage from "./pages/JogosPage.tsx";
import QuizzesPage from "./pages/QuizzesPage.tsx";
import EvolucaoPage from "./pages/EvolucaoPage.tsx";
import MedalhasPage from "./pages/MedalhasPage.tsx";
import AdminStudentsPage from "./pages/AdminStudentsPage.tsx";
import AdminStudentDetailPage from "./pages/AdminStudentDetailPage.tsx";
import AdminClassSettingsPage from "./pages/AdminClassSettingsPage.tsx";
import EditProfilePage from "./pages/EditProfilePage.tsx";
import ChatTurmaPage from "./pages/ChatTurmaPage.tsx";
import FotosTurmaPage from "./pages/FotosTurmaPage.tsx";
import FeedPage from "./pages/FeedPage.tsx";
import AlbumCopaPage from "./pages/AlbumCopaPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PlatformProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/sobre" element={<SobrePage />} />
                <Route path="/aulas" element={<AulasPage />} />
                <Route path="/progresso" element={<ProgressoPage />} />
                <Route path="/galeria" element={<GaleriaPage />} />
                <Route path="/avaliacao" element={<AvaliacaoPage />} />
                <Route path="/ranking" element={<RankingPage />} />

                {/* Auth */}
                <Route path="/entrar" element={<AuthPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/cadastro" element={<CadastroPage />} />

                {/* Aluno */}
                <Route
                  path="/aluno"
                  element={
                    <ProtectedRoute>
                      <AlunoDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/aluno/codar" element={<ProtectedRoute><CodarHubPage /></ProtectedRoute>} />
                <Route path="/aluno/trilha" element={<ProtectedRoute><TrilhaPage /></ProtectedRoute>} />
                <Route path="/aluno/jogos" element={<ProtectedRoute><JogosPage /></ProtectedRoute>} />
                <Route path="/aluno/quizzes" element={<ProtectedRoute><QuizzesPage /></ProtectedRoute>} />
                <Route path="/aluno/evolucao" element={<ProtectedRoute><EvolucaoPage /></ProtectedRoute>} />
                <Route path="/aluno/medalhas" element={<ProtectedRoute><MedalhasPage /></ProtectedRoute>} />
                <Route path="/aluno/perfil" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
                <Route path="/aluno/chat" element={<ProtectedRoute><ChatTurmaPage /></ProtectedRoute>} />
                <Route path="/aluno/fotos" element={<ProtectedRoute><FotosTurmaPage /></ProtectedRoute>} />
                <Route path="/aluno/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
                <Route path="/aluno/album-copa" element={<ProtectedRoute><AlbumCopaPage /></ProtectedRoute>} />

                {/* Admin */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminAvaliacaoPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/alunos"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminStudentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/alunos/:userId"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminStudentDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/turmas"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminClassSettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/relatorios"
                  element={
                    <ProtectedRoute requireAdmin>
                      <RelatoriosArchivePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/relatorios/:periodKey"
                  element={
                    <ProtectedRoute requireAdmin>
                      <FolhaRegistroPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/folha-registro"
                  element={
                    <ProtectedRoute requireAdmin>
                      <FolhaRegistroPage />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </PlatformProvider>
  </QueryClientProvider>
);

export default App;
