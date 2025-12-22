import { useEffect, useRef, useState } from 'react';
import { MapPin, Clock, Calendar } from 'lucide-react';
import Divider from './Divider';

interface EventCardProps {
  title: string;
  time: string;
  date: string;
  venue: string;
  address: string;
  delay: number;
  isVisible: boolean;
}

const EventCard = ({ title, time, date, venue, address, delay, isVisible }: EventCardProps) => (
  <div 
    className={`bg-card/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gold/20 shadow-xl transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    <h3 className="font-display text-3xl md:text-4xl text-gold mb-6">{title}</h3>
    
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-foreground">
        <Calendar className="w-5 h-5 text-rose" />
        <span className="font-body text-lg">{date}</span>
      </div>
      
      <div className="flex items-center gap-3 text-foreground">
        <Clock className="w-5 h-5 text-rose" />
        <span className="font-body text-lg">{time}</span>
      </div>
      
      <div className="flex items-start gap-3 text-foreground">
        <MapPin className="w-5 h-5 text-rose flex-shrink-0 mt-1" />
        <div>
          <p className="font-body text-lg font-semibold">{venue}</p>
          <p className="font-body text-muted-foreground">{address}</p>
        </div>
      </div>
    </div>
  </div>
);

const EventSection = () => {
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
    <section ref={sectionRef} className="py-16 md:py-24 px-4 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="font-body text-muted-foreground tracking-[0.2em] uppercase mb-2">Thông tin</p>
          <h2 className="font-display text-4xl md:text-5xl text-gradient-gold">Lễ Cưới</h2>
        </div>

        <Divider />

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-12">
          <EventCard
            title="Lễ Vu Quy"
            date="20 Tháng 02, 2025"
            time="09:00 Sáng"
            venue="Tư Gia Nhà Gái"
            address="123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
            delay={200}
            isVisible={isVisible}
          />
          
          <EventCard
            title="Lễ Thành Hôn"
            date="20 Tháng 02, 2025"
            time="11:30 Trưa"
            venue="Nhà Hàng Diamond Palace"
            address="456 Đường Lê Lợi, Quận 3, TP. Hồ Chí Minh"
            delay={400}
            isVisible={isVisible}
          />
        </div>
      </div>
    </section>
  );
};

export default EventSection;
