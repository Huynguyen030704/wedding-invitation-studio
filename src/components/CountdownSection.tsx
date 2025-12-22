import { useEffect, useRef, useState } from 'react';
import CountdownTimer from './CountdownTimer';
import Divider from './Divider';

const CountdownSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Wedding date: February 20, 2025
  const weddingDate = new Date('2025-02-20T09:00:00');

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
          <p className="font-body text-muted-foreground tracking-[0.2em] uppercase mb-2">Đếm ngược</p>
          <h2 className="font-display text-4xl md:text-5xl text-gradient-gold">Đến Ngày Trọng Đại</h2>
        </div>

        <Divider />

        <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <CountdownTimer targetDate={weddingDate} />
        </div>

        <p className={`font-body text-lg text-muted-foreground mt-12 italic transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          "Hôn nhân không phải là kết thúc của cuộc hành trình, mà là bắt đầu của một chương mới đầy yêu thương."
        </p>
      </div>
    </section>
  );
};

export default CountdownSection;
