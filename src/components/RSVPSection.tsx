import { useEffect, useRef, useState } from 'react';
import { Phone, MessageCircle, Heart } from 'lucide-react';
import Divider from './Divider';

const RSVPSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-4 bg-pattern">
      <div className="max-w-4xl mx-auto text-center">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="font-body text-muted-foreground tracking-[0.2em] uppercase mb-2">Liên hệ</p>
          <h2 className="font-display text-4xl md:text-5xl text-gradient-gold">Xác Nhận Tham Dự</h2>
        </div>

        <Divider />

        <p className={`font-body text-lg text-muted-foreground mb-12 max-w-2xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Sự hiện diện của quý khách là niềm vinh hạnh lớn lao của gia đình chúng tôi. 
          Vui lòng xác nhận tham dự để chúng tôi có thể chuẩn bị chu đáo nhất.
        </p>

        <div className={`grid md:grid-cols-2 gap-6 mb-12 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Groom's family contact */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gold/20 shadow-xl">
            <h3 className="font-display text-2xl text-gold mb-4">Nhà Trai</h3>
            <div className="space-y-3">
              <p className="font-body text-foreground font-semibold">Ông Nguyễn Văn A</p>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-rose" />
                <span className="font-body">0123 456 789</span>
              </div>
            </div>
          </div>

          {/* Bride's family contact */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gold/20 shadow-xl">
            <h3 className="font-display text-2xl text-gold mb-4">Nhà Gái</h3>
            <div className="space-y-3">
              <p className="font-body text-foreground font-semibold">Ông Trần Văn B</p>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-rose" />
                <span className="font-body">0987 654 321</span>
              </div>
            </div>
          </div>
        </div>

        {/* RSVP Button */}
        <div className={`transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a
            href="tel:0123456789"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose to-rose/80 text-primary-foreground rounded-full font-body text-lg tracking-wider hover:shadow-lg hover:shadow-rose/30 transition-all duration-300 hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            Xác Nhận Tham Dự
          </a>
        </div>
      </div>
    </section>
  );
};

export default RSVPSection;
