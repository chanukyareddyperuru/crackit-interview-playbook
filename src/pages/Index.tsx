import Navigation from "@/components/ui/navigation";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
    </div>
  );
};

export default Index;
