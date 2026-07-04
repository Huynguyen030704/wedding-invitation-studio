import React from "react";
import { Carousel, Image } from "antd";
import { motion } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=1200",
];

const WeddingGallery = () => {
  return (
    <section className="py-20 bg-wedding-cream/50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-cursive text-wedding-gold mb-4">
            Album Ảnh Cưới
          </h2>
          <p className="text-stone-500 tracking-widest uppercase text-xs font-sans">
            Khoảnh khắc hạnh phúc của chúng tôi
          </p>
        </motion.div>

        {/* Carousel cho Mobile */}
        <div className="block md:hidden animate-fade-in">
          <Carousel autoplay effect="fade" dotsClassName="wedding-carousel-dots">
            {images.map((img, idx) => (
              <div key={idx} className="outline-none">
                <div className="aspect-[3/4] overflow-hidden rounded-2xl border-4 border-white shadow-lg">
                  <Image
                    src={img}
                    alt={`Wedding Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                    preview={{ mask: <div className="text-xs font-sans">Chạm để phóng to</div> }}
                  />
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Grid & Image Preview Group cho Desktop */}
        <div className="hidden md:block">
          <Image.PreviewGroup>
            <div className="grid grid-cols-3 gap-6">
              {images.map((img, idx) => {
                let colSpan = "col-span-1";
                let aspect = "aspect-[3/4]";
                if (idx === 0 || idx === 5) {
                  colSpan = "col-span-2";
                  aspect = "aspect-[16/10]";
                }
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className={`${colSpan} ${aspect} overflow-hidden rounded-3xl border-8 border-white shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer`}
                  >
                    <Image
                      src={img}
                      alt={`Wedding Photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                    />
                  </motion.div>
                );
              })}
            </div>
          </Image.PreviewGroup>
        </div>
      </div>
    </section>
  );
};

export default WeddingGallery;
