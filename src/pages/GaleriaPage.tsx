import { Gallery } from "@/components/portfolio/Gallery";
import { PlatformPlaceholder } from "@/components/portfolio/PlatformPlaceholder";
import { usePlatform } from "@/contexts/PlatformContext";

const GaleriaPage = () => {
  const { platformId } = usePlatform();
  if (platformId !== "cultura") return <PlatformPlaceholder title="📸 Galeria" />;
  return <Gallery />;
};

export default GaleriaPage;
