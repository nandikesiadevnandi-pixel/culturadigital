import { Timeline } from "@/components/portfolio/Timeline";
import { PlatformPlaceholder } from "@/components/portfolio/PlatformPlaceholder";
import { usePlatform } from "@/contexts/PlatformContext";

const AulasPage = () => {
  const { platformId } = usePlatform();
  if (platformId !== "cultura") return <PlatformPlaceholder title="📅 Aulas" />;
  return <Timeline />;
};

export default AulasPage;
