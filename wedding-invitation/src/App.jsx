import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MapPin, Calendar, MailOpen, Clock, Send } from "lucide-react";
import confetti from "canvas-confetti";
import FloatingPetals from "./components/FloatingPetals.jsx"; // Import component hoa rơi

const App = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });
  const [isOpen, setIsOpen] = useState(false); // State kiểm tra đã mở thiệp chưa
  const isName = { trai: "Huy", gai: "Trinh" };
  const isFullName = { trai: "Nhựt Huy", gai: "Mai Trinh" };
  // const isFullName = { trai: "Nhựt Huy", gai: "Mai Trinh" };
  // const isName = { trai: "A", gai: "B" };
  // const isFullName = { trai: "Nhựt A", gai: "Mai B" };

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

  const handleRSVP = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
    alert("Cảm ơn bạn đã xác nhận! ❤️");
  };

  const handleOpenInvitation = () => {
    setIsOpen(true);
    // Bắn pháo hoa khi mở thiệp
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="bg-wedding-cream min-h-screen font-serif overflow-x-hidden relative">
      {/* HIỆU ỨNG MỞ THIỆP (OVERLAY) */}
      {/* HIỆU ỨNG MỞ CỬA */}
      <AnimatePresence>
        {!isOpen && (
          <div className="fixed inset-0 z-[10000] flex overflow-hidden">
            {/* Cánh cửa bên trái */}
            <motion.div
              initial={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="relative w-1/2 h-full bg-stone-900 border-r border-amber-200/30 flex items-center justify-end"
            >
              {/* Ảnh nền mờ cho cánh cửa trái */}
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
              {/* Ảnh nền mờ cho cánh cửa phải */}
              <div className="absolute inset-0 opacity-20">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80"
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            </motion.div>

            {/* Nội dung ở giữa cửa (Nút bấm) */}
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
      {/* NỘI DUNG CHÍNH (Chỉ hiển thị hoặc chạy mượt khi isOpen = true) */}
      <div className={`${!isOpen ? "h-screen overflow-hidden" : ""}`}>
        <FloatingPetals />
        {/* HERO SECTION - Tối ưu text cho màn hình nhỏ */}
        <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80"
              className="w-full h-full object-cover object-center md:object-center animate-slow-zoom"
              // Bạn có thể thử thay 'object-center' bằng 'object-[top]' hoặc 'object-[70%]'
              // để đẩy khung hình lên xuống/trái phải cho đến khi thấy cả 2 người.
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
        </section>

        {/* COUNTDOWN - Mobile: Chia 2 cột để không bị quá bé */}
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

        {/* INVITATION - Mobile: Padding nhỏ lại, text size vừa phải */}
        <section className="py-16 md:py-32 px-4 max-w-4xl mx-auto">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            className="card-border text-center !p-6 md:!p-16"
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

            {/* Grid: 1 cột trên Mobile, 2 cột trên Desktop */}
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

        {/* SECTION: NHÀ TRAI & NHÀ GÁI */}
        <section className="bg-stone-50 py-16 px-4 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
              {/* NHÀ TRAI */}
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

              {/* NHÀ GÁI */}
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

            {/* Biểu tượng kết nối giữa 2 nhà */}
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

        {/* SECTION: BẢN ĐỒ ĐỊA ĐIỂM */}
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

            {/* Container cho Google Maps */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d604.6789069868821!2d106.73997165538385!3d10.41818252533751!3m2!1i1024!2i768!4f13.1!5e1!3m2!1svi!2sus!4v1766384205341!5m2!1svi!2sus"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>

            {/* Nút bấm mở app Maps trên điện thoại */}
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
        {/* SECTION: LỜI CẢM ƠN & KẾT THÚC */}
        <section className="relative py-24 px-6 text-center bg-white overflow-hidden">
          {/* Họa tiết trang trí nhẹ ở nền */}
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

          {/* Chân trang cuối cùng */}
          <footer className="mt-20 pt-8 border-t border-stone-50 text-[10px] text-stone-400 tracking-widest uppercase">
            © 2025 Huy & Trinh Wedding Invitation • Made with Love
          </footer>
        </section>
      </div>
    </div>
  );
};

export default App;
