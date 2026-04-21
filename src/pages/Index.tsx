import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Timeline } from "@/components/portfolio/Timeline";
import { Progress } from "@/components/portfolio/Progress";
import { Gallery } from "@/components/portfolio/Gallery";
import { Footer } from "@/components/portfolio/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background font-sans antialiased">
      <Hero />
      <About />
      <Timeline />
      <Progress />
      <Gallery />
      <Footer />
    </main>
  );
};

export default Index;
