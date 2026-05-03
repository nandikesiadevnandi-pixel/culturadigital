import { Progress } from "@/components/portfolio/Progress";
import { PlatformPlaceholder } from "@/components/portfolio/PlatformPlaceholder";
import { usePlatform } from "@/contexts/PlatformContext";

const ProgressoPage = () => {
  const { platformId } = usePlatform();
  if (platformId !== "cultura") return <PlatformPlaceholder title="📈 Progresso" />;
  return <Progress />;
};

export default ProgressoPage;
