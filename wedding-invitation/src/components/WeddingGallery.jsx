import { Carousel, Image } from "antd";
import { motion } from "framer-motion";
import { SectionHeading } from "./Ornaments";

const BASE = import.meta.env.BASE_URL;

// Bộ ảnh album — masonry giữ đúng tỉ lệ gốc (phù hợp ảnh đứng, không ép cắt).
const galleryImages = [
  `${BASE}images/133A1281.JPG`,
  `${BASE}images/133A1217.JPG`,
  `${BASE}images/0429.JPG`,
  `${BASE}images/133A1254.JPG`,
  `${BASE}images/133A1318.JPG`,
  `${BASE}images/0434.JPG`,
  `${BASE}images/133A1331.JPG`,
  `${BASE}images/133A1334.JPG`,
  `${BASE}images/133A1352.JPG`,
];

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
            {galleryImages.map((img, idx) => (
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

        {/* Masonry cho Desktop — mỗi ảnh giữ nguyên tỉ lệ, không bị cắt */}
        <div className="hidden md:block">
          <Image.PreviewGroup>
            <div className="columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="mb-5 break-inside-avoid">
                  <motion.div
                    initial={{ opacity: 0, y: 24, clipPath: "inset(0 0 12% 0)" }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      clipPath: "inset(0 0 0% 0)",
                    }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      delay: Math.min(idx * 0.06, 0.35),
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group relative overflow-hidden rounded-2xl border-[6px] border-white shadow-lg hover:shadow-2xl transition-shadow duration-500 cursor-pointer"
                  >
                    <Image
                      src={img}
                      alt={`Ảnh cưới ${idx + 1}`}
                      loading="lazy"
                      rootClassName="!block !w-full"
                      className="!w-full !h-auto object-cover group-hover:scale-[1.04] transition-transform duration-700"
                    />
                    {/* Lớp phủ nhẹ khi hover */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                </div>
              ))}
            </div>
          </Image.PreviewGroup>
        </div>
      </div>
    </section>
  );
};

export default WeddingGallery;
