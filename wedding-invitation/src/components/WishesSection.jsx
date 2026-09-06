import { useState, useEffect } from "react";
import { Skeleton } from "antd";
import { Heart, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import GoldenDust from "./GoldenDust";
import { SectionHeading } from "./Ornaments";

// Lời chúc mẫu — luôn chèn thêm phía sau lời chúc thật để "bức tường" không bị trống.
const MOCK_WISHES = [
  {
    full_name: "Gia đình Bác Hai",
    wishes: "Chúc hai cháu trăm năm hạnh phúc, đầu bạc răng long! ❤️",
  },
  {
    full_name: "Bạn Nhà Gái",
    wishes:
      "Mãi bên nhau bạn nhé! Chúc đám cưới rình rang, hạnh phúc viên mãn!",
  },
  {
    full_name: "Bạn Nhà Trai",
    wishes: "Chúc mừng hạnh phúc hai em, một hành trình mới thật ngọt ngào.",
  },
  {
    full_name: "Bạn Gia Vy",
    wishes: "Tân hôn vui vẻ! Chúc tổ ấm mới luôn ngập tràn tiếng cười!",
  },
  {
    full_name: "Cô Dì Chú Bác",
    wishes:
      "Chúc hai con sớm sinh quý tử, thuận hòa, yêu thương nhau trọn đời.",
  },
  {
    full_name: "Nhóm bạn thân",
    wishes: "Cưới vui nha hai đứa! Chúc mãi mặn nồng như thuở ban đầu 🥂",
  },
];

const getInitial = (name) => {
  const c = (name || "").trim().charAt(0);
  return c ? c.toUpperCase() : "♥";
};

const WishesSection = () => {
  const [realWishes, setRealWishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishes();

    // Realtime: có lời chúc mới (từ form RSVP) là tự cập nhật danh sách
    let subscription = null;
    if (supabase) {
      subscription = supabase
        .channel("wishes_realtime")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "rsvps" },
          () => fetchWishes(),
        )
        .subscribe();
    }

    return () => {
      if (supabase && subscription) supabase.removeChannel(subscription);
    };
  }, []);

  const fetchWishes = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("rsvps")
        .select("full_name, wishes, created_at")
        .not("wishes", "is", null)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setRealWishes(data.filter((i) => i.wishes && i.wishes.trim() !== ""));
      }
    } catch (e) {
      // giữ danh sách rỗng, sẽ dùng mock
    } finally {
      setLoading(false);
    }
  };

  // Lời chúc thật lên trước, mock chèn thêm cho đầy
  const wishes = [...realWishes, ...MOCK_WISHES];

  return (
    <section className="py-20 md:py-28 bg-wedding-charcoal text-white relative overflow-hidden">
      {/* Nền trang trí */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(180,151,90,0.15),transparent_45%),radial-gradient(circle_at_10%_90%,rgba(201,138,134,0.14),transparent_45%)]" />
        <Heart
          size={400}
          className="absolute -right-24 -bottom-24 text-white/[0.03]"
        />
      </div>
      <GoldenDust count={14} />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <SectionHeading
          eyebrow="Yêu thương gửi trao"
          title="Hộp Thư Lời Chúc"
          description="Những lời chúc ngọt ngào từ người thân & bạn bè gửi đến cô dâu chú rể."
          tone="light"
          className="mb-12"
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.04] border border-white/10 p-6 rounded-2xl"
              >
                <Skeleton
                  active
                  paragraph={{ rows: 2 }}
                  title={{ width: "45%" }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="max-h-[560px] overflow-y-auto pt-2 pb-2 pr-2 scroll-elegant grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {wishes.map((item, idx) => (
                <motion.div
                  key={item.created_at || `${item.full_name}-${idx}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(idx * 0.04, 0.35),
                  }}
                  className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.015] p-6 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.6)] hover:border-wedding-gold/40 transition-colors"
                >
                  <Quote
                    size={30}
                    className="absolute right-4 top-4 text-white/[0.07]"
                  />
                  <div className="flex items-center gap-3 mb-4">
                    {/* Avatar chữ cái đầu */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-wedding-champagne to-wedding-gold font-sans font-bold text-lg text-wedding-charcoal shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]">
                      {getInitial(item.full_name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-amber-100 font-sans text-sm truncate">
                        {item.full_name}
                      </p>
                      <p className="text-white/40 text-[11px] font-sans flex items-center gap-1.5 mt-0.5">
                        <Heart
                          size={10}
                          className="fill-current text-wedding-rose"
                        />
                        Đã gửi lời chúc
                      </p>
                    </div>
                  </div>
                  <p className="text-white/80 text-[15px] italic font-serif leading-relaxed">
                    &ldquo;{item.wishes}&rdquo;
                  </p>
                </motion.div>
              ))}
            </div>
            {/* Fade mép trên/dưới khi cuộn */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-wedding-charcoal to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-wedding-charcoal to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
};

export default WishesSection;
