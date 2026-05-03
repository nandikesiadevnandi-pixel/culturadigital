import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/portfolio/Layout";
import { PlatformProvider } from "@/contexts/PlatformContext";
import Home from "./pages/Home.tsx";
import SobrePage from "./pages/SobrePage.tsx";
import AulasPage from "./pages/AulasPage.tsx";
import ProgressoPage from "./pages/ProgressoPage.tsx";
import GaleriaPage from "./pages/GaleriaPage.tsx";
import AvaliacaoPage from "./pages/AvaliacaoPage.tsx";
import RankingPage from "./pages/RankingPage.tsx";
import AdminAvaliacaoPage from "./pages/AdminAvaliacaoPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PlatformProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<SobrePage />} />
              <Route path="/aulas" element={<AulasPage />} />
              <Route path="/progresso" element={<ProgressoPage />} />
              <Route path="/galeria" element={<GaleriaPage />} />
              <Route path="/avaliacao" element={<AvaliacaoPage />} />
              <Route path="/ranking" element={<RankingPage />} />
              <Route path="/admin" element={<AdminAvaliacaoPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </PlatformProvider>
  </QueryClientProvider>
);

export default App;
