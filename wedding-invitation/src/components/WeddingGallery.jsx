import { Carousel, Image } from "antd";
import { motion } from "framer-motion";
import { SectionHeading } from "./Ornaments";

const BASE = import.meta.env.BASE_URL;

// Ảnh cho lưới bento (desktop) — nhiều khoảnh khắc hơn, bố cục editorial.
const galleryImages = [
  { src: `${BASE}images/133A1281.JPG`, span: "md:col-span-2 md:row-span-2" },
  { src: `${BASE}images/0434.JPG`, span: "md:col-span-1 md:row-span-1" },
  { src: `${BASE}images/133A1217.JPG`, span: "md:col-span-1 md:row-span-1" },
  { src: `${BASE}images/133A1254.JPG`, span: "md:col-span-2 md:row-span-1" },
  { src: `${BASE}images/0429.JPG`, span: "md:col-span-1 md:row-span-1" },
  { src: `${BASE}images/133A1331.JPG`, span: "md:col-span-1 md:row-span-1" },
  { src: `${BASE}images/133A1318.JPG`, span: "md:col-span-2 md:row-span-1" },
];

// Ảnh cho carousel (mobile).
const carouselImages = galleryImages.map((g) => g.src);

const WeddingGallery = () => {
  return (
    <section className="py-20 md:py-28 bg-wedding-cream relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeading
          eyebrow="Khoảnh khắc"
          title="Album Ảnh Cưới"
          description="Những khoảnh khắc hạnh phúc trên hành trình của chúng tôi."
          className="mb-14"
        />

        {/* Carousel cho Mobile */}
        <div className="block md:hidden">
          <Carousel autoplay effect="fade" dotsClassName="wedding-carousel-dots">
            {carouselImages.map((img, idx) => (
              <div key={idx} className="outline-none">
                <div className="aspect-[3/4] overflow-hidden rounded-2xl border-4 border-white shadow-lg">
                  <Image
                    src={img}
                    alt={`Ảnh cưới ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    preview={{
                      cover: (
                        <div className="text-xs font-sans">Chạm để phóng to</div>
                      ),
                    }}
                  />
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Lưới Bento cho Desktop */}
        <div className="hidden md:block">
          <Image.PreviewGroup>
            <div className="grid grid-cols-4 auto-rows-[210px] gap-4">
              {galleryImages.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                  whileInView={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    delay: Math.min(idx * 0.08, 0.4),
                    duration: 0.85,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`${img.span} group relative overflow-hidden rounded-2xl border-[6px] border-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer`}
                >
                  <Image
                    src={img.src}
                    alt={`Ảnh cưới ${idx + 1}`}
                    loading="lazy"
                    rootClassName="!block !w-full !h-full"
                    className="!w-full !h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Lớp phủ nhẹ khi hover */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              ))}
            </div>
          </Image.PreviewGroup>
        </div>
      </div>
    </section>
  );
};

export default WeddingGallery;
