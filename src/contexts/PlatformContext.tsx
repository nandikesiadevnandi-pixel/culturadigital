import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type PlatformId = "cultura" | "hospitalidade";

export type PlatformConfig = {
  id: PlatformId;
  name: string;
  shortName: string;
  emoji: string;
  teacherName: string;
  teacherShort: string;
  brandTag: string;
  tagline: string;
  heroSubtitle: string;
  heroDescription: string;
  footerQuote: string;
  footerLocation: string;
  rankingSchoolsLabel: string;
  evaluationTitle: string;
  evaluationSubject: string;
};

export const PLATFORMS: Record<PlatformId, PlatformConfig> = {
  cultura: {
    id: "cultura",
    name: "Cultura Digital",
    shortName: "Cultura Digital",
    emoji: "💜",
    teacherName: "Késia Nandi",
    teacherShort: "prof Késia",
    brandTag: "NandiDev 💜",
    tagline: "Portfólio Docente · 2025",
    heroSubtitle: "Escolas Bertholdo · Ernesto · Dante Bertoluci — Canela",
    heroDescription:
      "Um registro vivo das aulas de Cultura Digital, onde cada encontro é uma nova descoberta com tecnologia e muita criatividade. Documentando o caminho de alunos que se tornam protagonistas digitais.",
    footerQuote:
      "Educar com tecnologia é abrir portas que nunca se fecham — é dar a cada aluno a chance de criar o próprio futuro digital.",
    footerLocation: "Escola Dante Bertoluci · Canela / RS",
    rankingSchoolsLabel: "Escolas atendidas pela prof Késia",
    evaluationTitle: "Avaliação – Cultura Digital",
    evaluationSubject: "Cultura Digital",
  },
  hospitalidade: {
    id: "hospitalidade",
    name: "Hospitalidade",
    shortName: "Hospitalidade",
    emoji: "🍊",
    teacherName: "Duda Rocha",
    teacherShort: "prof Duda",
    brandTag: "Duda Rocha 🍊",
    tagline: "Portfólio Docente · 2025",
    heroSubtitle: "Ensino de Hospitalidade com afeto e acolhimento",
    heroDescription:
      "Um registro vivo das aulas de Hospitalidade, onde cada encontro é uma nova descoberta sobre acolher, servir e encantar. Documentando o caminho de alunos que se tornam profissionais cheios de cuidado.",
    footerQuote:
      "Ensinar hospitalidade é aprender a acolher — é mostrar que cada gesto cuidadoso transforma a experiência de quem chega.",
    footerLocation: "Canela / RS",
    rankingSchoolsLabel: "Escolas atendidas pela prof Duda",
    evaluationTitle: "Avaliação – Hospitalidade",
    evaluationSubject: "Hospitalidade",
  },
};

const STORAGE_KEY = "active_platform";

type Ctx = {
  platform: PlatformConfig;
  platformId: PlatformId;
  setPlatform: (id: PlatformId) => void;
};

const PlatformContext = createContext<Ctx | null>(null);

export const PlatformProvider = ({ children }: { children: ReactNode }) => {
  const [platformId, setPlatformId] = useState<PlatformId>(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) as PlatformId | null;
    return saved && PLATFORMS[saved] ? saved : "cultura";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-platform", platformId);
    localStorage.setItem(STORAGE_KEY, platformId);
  }, [platformId]);

  return (
    <PlatformContext.Provider
      value={{ platform: PLATFORMS[platformId], platformId, setPlatform: setPlatformId }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform must be used inside PlatformProvider");
  return ctx;
};
