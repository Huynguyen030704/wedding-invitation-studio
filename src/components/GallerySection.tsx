import { useEffect, useRef, useState } from 'react';
import Divider from './Divider';

const GallerySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const images = [
    { id: 1, span: 'md:col-span-2 md:row-span-2' },
    { id: 2, span: '' },
    { id: 3, span: '' },
    { id: 4, span: '' },
    { id: 5, span: '' },
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-4 bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="font-body text-muted-foreground tracking-[0.2em] uppercase mb-2">Kỷ niệm</p>
          <h2 className="font-display text-4xl md:text-5xl text-gradient-gold">Hành Trình Yêu Thương</h2>
        </div>

        <Divider />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-12">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`${image.span} relative overflow-hidden rounded-xl group cursor-pointer transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="aspect-square bg-gradient-to-br from-rose-light to-gold-light flex items-center justify-center">
                <div className="text-center p-4">
                  <svg 
                    className="w-12 h-12 mx-auto text-gold/50 group-hover:text-gold transition-colors duration-300"
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <p className="mt-2 text-sm text-muted-foreground font-body">Ảnh {image.id}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        <p className="text-center font-body text-muted-foreground mt-8 italic">
          Thêm ảnh của bạn vào đây để tạo bộ sưu tập kỷ niệm
        </p>
      </div>
    </section>
  );
};

export default GallerySection;
