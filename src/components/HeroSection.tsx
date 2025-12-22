import { useEffect, useState } from 'react';
import Divider from './Divider';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative px-4 py-16 bg-pattern">
      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-20 h-20 border-t-2 border-l-2 border-gold/40 rounded-tl-lg" />
      <div className="absolute top-8 right-8 w-20 h-20 border-t-2 border-r-2 border-gold/40 rounded-tr-lg" />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-b-2 border-l-2 border-gold/40 rounded-bl-lg" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-b-2 border-r-2 border-gold/40 rounded-br-lg" />

      <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Save the date */}
        <p className="text-muted-foreground font-body text-lg md:text-xl tracking-[0.3em] uppercase mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          Save The Date
        </p>

        {/* Couple names */}
        <div className="mb-8">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-gradient-gold opacity-0 animate-fade-in-scale" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            Minh Anh
          </h1>
          <div className="flex items-center justify-center gap-4 my-4 opacity-0 animate-fade-in-scale" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <div className="h-px w-12 bg-gold/50" />
            <span className="font-display text-3xl md:text-4xl text-gold">&</span>
            <div className="h-px w-12 bg-gold/50" />
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-gradient-gold opacity-0 animate-fade-in-scale" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            Hoàng Nam
          </h1>
        </div>

        <Divider />

        {/* Wedding date */}
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
          <p className="font-body text-lg md:text-xl text-muted-foreground tracking-wider">
            Trân trọng kính mời quý khách
          </p>
          <p className="font-body text-xl md:text-2xl text-foreground mt-2 tracking-wider">
            Tham dự lễ cưới của chúng tôi
          </p>
          
          <div className="mt-8 p-6 md:p-8 bg-card/50 backdrop-blur-sm rounded-2xl border border-gold/20 inline-block shadow-xl">
            <p className="font-display text-4xl md:text-5xl text-gold mb-2">20.02.2025</p>
            <p className="font-body text-lg text-muted-foreground tracking-widest uppercase">
              Thứ Năm
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-sm tracking-wider">Kéo xuống để xem thêm</span>
            <div className="w-6 h-10 border-2 border-gold/40 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-gold/60 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
