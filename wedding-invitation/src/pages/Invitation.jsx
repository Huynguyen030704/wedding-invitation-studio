import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Send, Volume2, VolumeX, Calendar, MapPin } from "lucide-react";
import confetti from "canvas-confetti";
import Swal from "sweetalert2";
import { supabase } from "../lib/supabaseClient";
import FloatingPetals from "../components/FloatingPetals";

const Invitation = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audio] = useState(
    new Audio(`${import.meta.env.BASE_URL}music/beautiful-in-white.mp3`),
  );

  const isName = { trai: "Huy", gai: "Trinh" };
  const isFullName = { trai: "Nhựt Huy", gai: "Mai Trinh" };

  useEffect(() => {
    const target = new Date("2026-03-22T09:00:00");
    const interval = setInterval(() => {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) return clearInterval(interval);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    audio.loop = true;
    return () => {
      audio.pause();
    };
  }, [audio]);

  const toggleMusic = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((e) => console.log("Auto-play blocked or error:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleRSVP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const { error } = await supabase.from("rsvps").insert([
        {
          full_name: data.fullName,
          guest_count: data.guestCount,
          guest_of: data.guestOf,
          type: "Đính Hôn",
        },
      ]);

      if (error) throw error;

      confetti({ particleCount: 150, spread: 80, origin: { y: 0.7 } });

      Swal.fire({
        title: "Xác nhận thành công!",
        text: "Cảm ơn bạn đã xác nhận tham dự. Hẹn gặp bạn tại buổi lễ! ❤️",
        icon: "success",
        confirmButtonColor: "#B4975A",
        background: "#fdfbf7",
        customClass: {
          title: "font-cursive text-3xl",
          container: "font-serif",
        },
      });
      e.target.reset();
    } catch (error) {
      console.error("Error saving RSVP:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể gửi xác nhận lúc này. Vui lòng thử lại sau.",
        icon: "error",
        confirmButtonColor: "#B4975A",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenInvitation = () => {
    setIsOpen(true);
    // Bắn pháo hoa khi mở thiệp
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    // Tự động bật nhạc khi mở thiệp (nếu trình duyệt cho phép)
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  };

  return (
    <div className="bg-wedding-cream min-h-screen font-serif overflow-x-hidden relative">
      {/* HIỆU ỨNG MỞ THIỆP (OVERLAY) */}
      <AnimatePresence>
        {!isOpen && (
          <div className="fixed inset-0 z-10000 flex overflow-hidden">
            {/* Cánh cửa bên trái */}
            <motion.div
              initial={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="relative w-1/2 h-full bg-stone-900 border-r border-amber-200/30 flex items-center justify-end"
            >
              <div className="absolute inset-0 opacity-20">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80"
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            </motion.div>

            {/* Cánh cửa bên phải */}
            <motion.div
              initial={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="relative w-1/2 h-full bg-stone-900 border-l border-amber-200/30 flex items-center justify-start"
            >
              <div className="absolute inset-0 opacity-20">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80"
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            </motion.div>

            {/* Content in the middle */}
            <motion.div
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-10 flex flex-center items-center justify-center"
            >
              <div className="text-center bg-white/10 backdrop-blur-md p-10 rounded-full border border-white/20 shadow-2xl">
                <motion.div
                  animate={{ scale: [1.5, 1.1, 1.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Heart
                    className="mx-auto text-rose-500 mb-4"
                    fill="currentColor"
                    size={48}
                  />
                </motion.div>
                <h2 className="font-cursive text-5xl text-amber-200 mb-4">
                  {isName.trai} & {isName.gai}
                </h2>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <button
                    onClick={handleOpenInvitation}
                    className="bg-white text-stone-900 px-10 py-4 rounded-full font-sans tracking-[0.2em] text-xs hover:bg-amber-100 transition-all shadow-xl"
                  >
                    CHẠM ĐỂ MỞ THIỆP
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className={`${!isOpen ? "h-screen overflow-hidden" : ""}`}>
        <FloatingPetals />

        <section className="relative h-dvh flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80"
              className="w-full h-full object-cover object-center md:object-center animate-slow-zoom"
              alt="Hero"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 text-center text-white px-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="uppercase text-[10px] md:text-sm tracking-[0.3em] mb-4"
            >
              Lễ Đính Hôn
            </motion.p>
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl md:text-9xl font-cursive text-amber-200 mb-6 leading-tight"
            >
              {isName.trai} & {isName.gai}
            </motion.h1>
            <div className="text-lg md:text-2xl font-light italic border-y border-white/30 py-3 inline-block px-6">
              22 . 03 . 2026
            </div>
          </div>

          {isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={toggleMusic}
              className="fixed bottom-6 right-6 z-50 bg-white/80 backdrop-blur-md p-4 rounded-full shadow-2xl border border-amber-200 text-wedding-gold hover:bg-white transition-all group"
            >
              {isPlaying ? (
                <div className="relative">
                  <Volume2 size={24} />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                </div>
              ) : (
                <VolumeX size={24} />
              )}
            </motion.button>
          )}
        </section>

        <section className="py-10 bg-white shadow-sm relative z-20">
          <div className="max-w-xl mx-auto grid grid-cols-4 gap-2 px-4">
            {[
              { label: "Ngày", value: timeLeft.days },
              { label: "Giờ", value: timeLeft.hours },
              { label: "Phút", value: timeLeft.mins },
              { label: "Giây", value: timeLeft.secs },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center border-r last:border-0 border-stone-100"
              >
                <div className="text-2xl md:text-5xl font-bold text-wedding-gold">
                  {item.value}
                </div>
                <div className="text-[9px] md:text-xs uppercase tracking-widest text-stone-400">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 md:py-32 px-4 max-w-4xl mx-auto">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            className="card-border text-center p-6! md:p-16!"
          >
            <Heart
              className="mx-auto text-rose-500 mb-6"
              fill="currentColor"
              size={28}
            />
            <h2 className="text-3xl md:text-5xl text-stone-700 mb-6 uppercase tracking-tight">
              Trân Trọng Kính Mời
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-stone-600 italic mb-10">
              Sự hiện diện của Quý vị là niềm vinh dự cho gia đình chúng tôi
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-stone-700 pt-6 border-t border-stone-100">
              <div className="space-y-2">
                <Calendar
                  className="mx-auto text-wedding-gold mb-2"
                  size={24}
                />
                <p className="font-bold text-sm tracking-widest">THỜI GIAN</p>
                <p className="text-lg">09:00 Sáng</p>
                <p className="text-xs text-stone-500 font-sans italic">
                  22 Tháng 03, 2026
                </p>
                <p className="text-xs text-stone-500 font-sans italic">
                  (Mùng 04 tháng 02 Âm Lịch)
                </p>
              </div>
              <div className="space-y-2">
                <MapPin className="mx-auto text-rose-500 mb-2" size={24} />
                <p className="font-bold text-sm tracking-widest">ĐỊA ĐIỂM</p>
                <p className="text-lg">Tư Gia Nhà Gái</p>
                <p className="text-xs text-stone-400 px-4">
                  Cầu số 6, Ấp Xóm Mới, Gia Thuận, Đồng Tháp
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl text-center font-cursive text-wedding-gold mb-16">
              Chương Trình Lễ
            </h2>

            <div className="relative border-l-2 border-amber-100 ml-4 md:ml-auto md:mr-auto space-y-12 pb-12">
              {[
                {
                  time: "08:30",
                  event: "Đón Khách",
                  desc: "Chào đón quý quan khách và gia đình nội ngoại.",
                },
                {
                  time: "09:00",
                  event: "Lễ Đính Hôn",
                  desc: "Nghi thức trao nhẫn và thắp hương tổ tiên.",
                },
                {
                  time: "10:30",
                  event: "Tiệc Mừng",
                  desc: "Dùng tiệc trà và chia sẻ niềm vui cùng gia đình.",
                },
                {
                  time: "12:00",
                  event: "Kết Thúc",
                  desc: "Cảm ơn và tiễn khách.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="relative pl-8"
                >
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-wedding-gold border-4 border-white"></div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-50">
                    <span className="text-xl font-bold text-wedding-gold">
                      {item.time}
                    </span>
                    <h4 className="text-lg font-bold text-stone-800 uppercase mt-1">
                      {item.event}
                    </h4>
                    <p className="text-stone-500 text-sm mt-2 italic">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-stone-50 py-16 px-4 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <h3 className="text-2xl md:text-3xl font-serif text-stone-700 uppercase tracking-widest border-b border-amber-200 pb-4 inline-block">
                  Đại Diện Nhà Trai
                </h3>
                <div className="pt-4 space-y-2">
                  <p className="text-lg font-bold text-stone-800">
                    Ông: NGUYỄN THANH PHONG
                  </p>
                  <p className="text-lg font-bold text-stone-800">
                    Bà: TRƯƠNG THỊ NGỌC PHƯƠNG
                  </p>
                  <p className="text-stone-500 italic text-sm">
                    (Thân phụ & Thân mẫu)
                  </p>
                </div>
                <div className="pt-6">
                  <p className="font-cursive text-4xl text-wedding-gold">
                    Chú rể: {isFullName.trai}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <h3 className="text-2xl md:text-3xl font-serif text-stone-700 uppercase tracking-widest border-b border-amber-200 pb-4 inline-block">
                  Đại Diện Nhà Gái
                </h3>
                <div className="pt-4 space-y-2">
                  <p className="text-lg font-bold text-stone-800">
                    Ông: PHẠM VĂN TIẾN
                  </p>
                  <p className="text-lg font-bold text-stone-800">
                    Bà: ĐỖ THỊ TUYẾT MAI
                  </p>
                  <p className="text-stone-500 italic text-sm">
                    (Thân phụ & Thân mẫu)
                  </p>
                </div>
                <div className="pt-6">
                  <p className="font-cursive text-4xl text-wedding-gold">
                    Cô dâu: {isFullName.gai}
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="flex justify-center mt-12">
              <div className="h-px bg-amber-200 w-full max-w-[200px] self-center"></div>
              <Heart
                className="mx-4 text-rose-300"
                fill="currentColor"
                size={20}
              />
              <div className="h-px bg-amber-200 w-full max-w-[200px] self-center"></div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-stone-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://png.pngtree.com/thumb_back/fh260/background/20240929/pngtree-pink-roses-and-purple-flowers-on-a-beige-background-floral-for-image_16278432.jpg"
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div className="max-w-2xl mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-cursive text-amber-200 mb-4">
                Xác Nhận Tham Dự
              </h2>
              <p className="text-stone-400 tracking-widest uppercase text-xs">
                Phản hồi của bạn rất quan trọng đối với chúng tôi
              </p>
            </div>

            <form onSubmit={handleRSVP} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-amber-200/60 mb-2">
                    Họ & Tên *
                  </label>
                  <input
                    required
                    name="fullName"
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-4 focus:border-amber-200 outline-none transition-all"
                    placeholder="Tên của bạn..."
                  />
                </div>
                {/* <div>
                  <label className="block text-xs uppercase tracking-widest text-amber-200/60 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-4 focus:border-amber-200 outline-none transition-all"
                    placeholder="090..."
                  />
                </div> */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-amber-200/60 mb-2">
                    Số lượng khách *
                  </label>
                  <select
                    name="guestCount"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-4 focus:border-amber-200 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="1" className="bg-stone-900">
                      1 người
                    </option>
                    <option value="2" className="bg-stone-900">
                      2 người
                    </option>
                    <option value="3" className="bg-stone-900">
                      3 người
                    </option>
                    <option value="family" className="bg-stone-900">
                      Đi cả gia đình
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-amber-200/60 mb-2">
                    Bạn là khách của...
                  </label>
                  <select
                    name="guestOf"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-4 focus:border-amber-200 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="groom" className="bg-stone-900">
                      Nhà Trai
                    </option>
                    <option value="bride" className="bg-stone-900">
                      Nhà Gái
                    </option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-amber-200 text-stone-900 py-4 rounded-xl font-bold tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white"
                }`}
              >
                {isSubmitting ? "ĐANG GỬI..." : "GỬI XÁC NHẬN"}{" "}
                <Send size={18} />
              </button>
            </form>
          </div>
        </section>

        <section className="py-20 px-4 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto space-y-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl md:text-3xl uppercase tracking-[0.2em] text-stone-700 mb-2">
                Đường Đến Lễ Đính Hôn
              </h3>
              <p className="text-stone-500 italic mb-8">
                Rất hân hạnh được đón tiếp Quý khách tại tư gia
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative w-full aspect-video md:aspect-21/9 rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d604.6789069868821!2d106.73997165538385!3d10.41818252533751!3m2!1i1024!2i768!4f13.1!5e1!3m2!1svi!2sus!4v1766384205341!5m2!1svi!2sus"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>

            <div className="pt-6">
              <a
                href="https://maps.app.goo.gl/eqYWnAsxxBhA3Bu78"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-full font-sans tracking-widest text-sm hover:bg-stone-800 transition-all shadow-lg active:scale-95"
              >
                <MapPin size={18} className="text-rose-400" />
                CHỈ ĐƯỜNG TRÊN GOOGLE MAPS
              </a>
            </div>
          </div>
        </section>

        <section className="relative py-24 px-6 text-center bg-white overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none">
            <Heart size={300} className="text-stone-300" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-2xl mx-auto space-y-8"
          >
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className="h-px w-12 bg-amber-200"></div>
              <Heart
                className="text-rose-400 fill-rose-400 animate-pulse"
                size={24}
              />
              <div className="h-px w-12 bg-amber-200"></div>
            </div>

            <h2 className="text-4xl md:text-5xl font-cursive text-wedding-gold">
              Lời Cảm Ơn
            </h2>

            <div className="space-y-6">
              <p className="text-lg md:text-xl text-stone-600 leading-relaxed italic">
                "Sự hiện diện và những lời chúc tốt đẹp của Quý vị <br />
                là món quà ý nghĩa nhất dành cho chúng tôi trong ngày trọng đại
                này."
              </p>

              <p className="text-stone-500 font-serif tracking-[0.2em] uppercase text-sm">
                Trân trọng cảm ơn và rất hân hạnh được đón tiếp!
              </p>
            </div>

            <div className="pt-12">
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                className="inline-block border border-amber-100 p-8"
              >
                <p className="text-stone-400 text-[10px] tracking-[0.5em] uppercase mb-2">
                  Hành trình hạnh phúc bắt đầu từ đây
                </p>
                <p className="font-cursive text-3xl text-stone-800">
                  Huy & Trinh
                </p>
              </motion.div>
            </div>
          </motion.div>

          <footer className="mt-20 pt-8 border-t border-stone-50 text-[10px] text-stone-400 tracking-widest uppercase">
            © 2026 Huy & Trinh Wedding Invitation • Made with Love
          </footer>
        </section>
      </div>
    </div>
  );
};

export default Invitation;
