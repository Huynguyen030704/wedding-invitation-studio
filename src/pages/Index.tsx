import FallingPetals from '@/components/FallingPetals';
import FloatingHearts from '@/components/FloatingHearts';
import HeroSection from '@/components/HeroSection';
import CountdownSection from '@/components/CountdownSection';
import EventSection from '@/components/EventSection';
import GallerySection from '@/components/GallerySection';
import RSVPSection from '@/components/RSVPSection';
import FooterSection from '@/components/FooterSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Decorative elements */}
      <FallingPetals />
      <FloatingHearts />

      {/* Main content */}
      <main>
        <HeroSection />
        <CountdownSection />
        <EventSection />
        <GallerySection />
        <RSVPSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default Index;
