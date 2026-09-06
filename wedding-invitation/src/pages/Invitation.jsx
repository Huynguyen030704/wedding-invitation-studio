import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  Heart,
  Send,
  Volume2,
  VolumeX,
  Calendar,
  CalendarPlus,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { Form, Input, Select, Button, ConfigProvider, Radio } from "antd";
import confetti from "canvas-confetti";
import Swal from "sweetalert2";
import { supabase } from "../lib/supabaseClient";
import { darkFormTheme, goldButtonClass } from "../lib/formTheme";
import { downloadICS } from "../lib/calendar";
import FloatingPetals from "../components/FloatingPetals";
import WeddingGallery from "../components/WeddingGallery";
import WishesSection from "../components/WishesSection";
import GiftSection from "../components/GiftSection";
import ScrollProgress from "../components/ScrollProgress";
import GoldenDust from "../components/GoldenDust";
import { Monogram } from "../components/Monogram";
import { CornerFlourish } from "../components/Flourish";
import {
  SectionHeading,
  OrnamentalDivider,
  RevealWords,
} from "../components/Ornaments";

const pad2 = (n) => String(n).padStart(2, "0");

// Bảng màu confetti hợp tông vàng/hồng sang trọng (thay confetti cầu vồng)
const CONFETTI_COLORS = ["#b4975a", "#e7d6b4", "#c9ad78", "#c98a86", "#e3c4bd", "#ffffff"];

const Invitation = ({ type = "bride" }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [willAttend, setWillAttend] = useState(true);
  const [audio] = useState(
    new Audio(`${import.meta.env.BASE_URL}music/beautiful-in-white.mp3`),
  );

  // Parallax nhẹ cho ảnh hero khi cuộn (tự tắt nếu người dùng chọn giảm chuyển động)
  const prefersReduced = useReducedMotion();
  const { scrollY } = useScroll();
  const heroImgY = useTransform(scrollY, [0, 600], [0, prefersReduced ? 0 : 60]);

  const isName = { trai: "Huy", gai: "Trinh" };
  const isFullName = { trai: "Nhựt Huy", gai: "Mai Trinh" };

  // Cấu hình động dựa trên prop `type`
  const isGroom = type === "groom";
  const config = {
    ceremonyName: isGroom ? "Lễ Tân Hôn" : "Lễ Vu Quy",
    targetDate: isGroom ? "2026-09-30T09:00:00" : "2026-09-29T16:00:00", // Nhà Trai 09:00 Nhà Gái 15:00
    bannerDate: isGroom ? "30 . 09 . 2026" : "29 . 09 . 2026",
    locationName: isGroom ? "Tư Gia Nhà Trai" : "Tư Gia Nhà Gái",
    locationAddress: isGroom
      ? "29, Ấp Bồ Đề, Xã Gia Thuận, Tỉnh Đồng Tháp"
      : "Cầu số 6, Ấp Xóm Mới, Xã Gia Thuận, Tỉnh Đồng Tháp",
    locationCalendar: isGroom
      ? "09:00 Sáng - 30 Tháng 09, 2026"
      : "15:00 Chiều - 29 Tháng 09, 2026",
    locationCalendarLunar: isGroom
      ? "(Mùng 20 tháng 08 Âm Lịch)"
      : "(Mùng 19 tháng 08 Âm Lịch)",
    mapEmbedUrl: isGroom
      ? "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d864.4943336694021!2d106.7398977419123!3d10.380332596104411!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTDCsDIyJzQ5LjQiTiAxMDbCsDQ0JzI1LjEiRQ!5e1!3m2!1svi!2s!4v1783131948263!5m2!1svi!2s"
      : "https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d604.6789069868821!2d106.73997165538385!3d10.41818252533751!3m2!1i1024!2i768!4f13.1!5e1!3m2!1svi!2sus!4v1766384205341!5m2!1svi!2sus",
    mapDirectionUrl: isGroom
      ? "https://www.google.com/maps/search/?api=1&query=10.3803326,106.7398977"
      : "https://maps.app.goo.gl/eqYWnAsxxBhA3Bu78",
    guestOf: isGroom ? "groom" : "bride",
    dbType: isGroom ? "Tân Hôn" : "Vu Quy",
  };

  useEffect(() => {
    const target = new Date(config.targetDate);
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
  }, [config.targetDate]);

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

  const handleRSVP = async (values) => {
    setIsSubmitting(true);
    try {
      const payload = {
        full_name: values.fullName,
        guest_count: willAttend ? values.guestCount : "0",
        guest_of: config.guestOf, // Tự động điền theo link nhà trai/gái
        wishes: values.wishes || "",
        type: config.dbType, // Lưu loại tiệc là "Vu Quy" hoặc "Tân Hôn"
      };

      let error = null;
      if (supabase) {
        const { error: dbError } = await supabase
          .from("rsvps")
          .insert([payload]);
        error = dbError;
      }

      if (error) throw error;

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.7 },
        colors: CONFETTI_COLORS,
      });

      Swal.fire({
        title: "Xác nhận thành công!",
        text: "Cảm ơn bạn đã xác nhận tham dự lễ cưới của chúng tôi. Hẹn gặp bạn tại buổi lễ! ❤️",
        icon: "success",
        confirmButtonColor: "#B4975A",
        background: "#fdfbf7",
        customClass: {
          title: "font-cursive text-3xl",
          container: "font-serif",
        },
      });
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
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: CONFETTI_COLORS,
    });
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  };

  const handleAddToCalendar = () => {
    downloadICS({
      title: `${config.ceremonyName} · Huy & Trinh`,
      start: config.targetDate,
      address: `${config.locationName}, ${config.locationAddress}`,
      description: `${config.locationCalendar} ${config.locationCalendarLunar}`,
    });
  };

  const fieldLabel = (text) => (
    <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-semibold text-wedding-champagne">
      {text}
    </span>
  );

  return (
    <div className="bg-wedding-cream min-h-screen font-serif overflow-x-hidden relative">
      {isOpen && <ScrollProgress />}
      {/* HIỆU ỨNG MỞ THIỆP (OVERLAY) */}
      <AnimatePresence>
        {!isOpen && (
          <div className="fixed inset-0 z-[10000] overflow-hidden">
            {/* Lớp ảnh nền LIỀN MẠCH — không bao giờ bị tách/cắt */}
            <div className="absolute inset-0 z-0">
              <img
                src={`${import.meta.env.BASE_URL}images/133A1281.JPG`}
                className="w-full h-full object-cover object-center"
                alt=""
                fetchPriority="high"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/55" />
            </div>

            {/* Hai "rèm" mờ phủ lên ảnh, trượt sang 2 bên khi mở thiệp.
                Ảnh dưới liền mạch nên khi mở chỉ sáng dần từ giữa ra,
                không cắt vào mặt cô dâu/chú rể. */}
            <motion.div
              initial={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-y-0 left-0 w-1/2 z-10 bg-black/45 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-y-0 right-0 w-1/2 z-10 bg-black/45 backdrop-blur-[2px]"
            />

            {/* Content ở giữa */}
            <motion.div
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-20 flex items-center justify-center px-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="relative text-center bg-white/[0.07] backdrop-blur-md px-10 py-12 md:px-16 md:py-14 rounded-[2.5rem] border border-white/15 shadow-2xl"
              >
                {/* Khung góc trang trí */}
                <span className="pointer-events-none absolute left-5 top-5 h-8 w-8 border-l border-t border-amber-200/40" />
                <span className="pointer-events-none absolute right-5 top-5 h-8 w-8 border-r border-t border-amber-200/40" />
                <span className="pointer-events-none absolute left-5 bottom-5 h-8 w-8 border-l border-b border-amber-200/40" />
                <span className="pointer-events-none absolute right-5 bottom-5 h-8 w-8 border-r border-b border-amber-200/40" />

                <p className="eyebrow !text-wedding-champagne mb-5">
                  Thân mời bạn đến
                </p>
                <motion.div
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Heart
                    className="mx-auto text-wedding-rose mb-4"
                    fill="currentColor"
                    size={38}
                  />
                </motion.div>
                <h2 className="font-cursive mb-2 flex flex-col items-center leading-[0.95]">
                  <span className="text-5xl md:text-6xl text-gilded">
                    {isName.trai}
                  </span>
                  <span className="text-wedding-gold text-3xl md:text-4xl my-1">
                    &
                  </span>
                  <span className="text-5xl md:text-6xl text-gilded">
                    {isName.gai}
                  </span>
                </h2>
                <p className="font-serif italic text-white/60 mb-8">
                  {config.ceremonyName} · {config.bannerDate}
                </p>
                <motion.div
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <button
                    onClick={handleOpenInvitation}
                    className="btn-shimmer group inline-flex items-center gap-2 bg-white text-stone-900 px-9 md:px-11 py-4 rounded-full font-sans tracking-[0.2em] text-xs font-bold uppercase hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200 transition-all shadow-xl cursor-pointer"
                  >
                    <Heart
                      size={14}
                      className="text-wedding-rose fill-current"
                    />
                    Chạm để mở thiệp
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className={`${!isOpen ? "h-screen overflow-hidden" : ""}`}>
        <FloatingPetals />

        {/* ===== HERO ===== */}
        <section className="relative h-dvh flex items-center justify-center overflow-hidden">
          <motion.div
            style={{ y: heroImgY }}
            className="absolute -top-[8%] inset-x-0 h-[116%] z-0 will-change-transform"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/133A1281.JPG`}
              className="w-full h-full object-cover object-center animate-slow-zoom"
              alt="Ảnh cưới Huy và Trinh"
              fetchPriority="high"
              decoding="async"
            />
          </motion.div>
          {/* Lớp phủ chuyển sắc tinh tế thay cho nền đen phẳng */}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/55 via-black/25 to-black/60" />
          {/* Vignette điện ảnh */}
          <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(0,0,0,0.45)_100%)]" />
          {/* Bụi vàng lấp lánh */}
          <GoldenDust count={18} />

          <div className="relative z-10 text-center text-white px-6">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="eyebrow !text-wedding-champagne mb-5"
            >
              {config.ceremonyName}
            </motion.p>
            <h1 className="text-6xl md:text-9xl font-cursive mb-6 leading-[1.05] drop-shadow-[0_2px_20px_rgba(0,0,0,0.55)]">
              <RevealWords
                text={`${isName.trai} & ${isName.gai}`}
                wordClassName="text-gilded"
                stagger={0.16}
              />
            </h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-flex items-center gap-4 border-y border-white/30 py-3 px-6"
            >
              <span className="h-px w-6 bg-amber-200/60" />
              <span className="text-lg md:text-2xl font-serif italic tracking-wide">
                {config.bannerDate}
              </span>
              <span className="h-px w-6 bg-amber-200/60" />
            </motion.div>
          </div>

          {/* Gợi ý cuộn xuống */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/70 animate-scroll-hint">
            <ChevronDown size={26} aria-hidden="true" />
          </div>

          {isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={toggleMusic}
              aria-label={isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền"}
              className="fixed bottom-6 right-6 z-50 bg-white/85 backdrop-blur-md p-4 rounded-full shadow-2xl border border-amber-200 text-wedding-gold hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wedding-gold transition-all cursor-pointer"
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

        {/* ===== ĐẾM NGƯỢC ===== */}
        <section className="py-12 md:py-16 bg-white relative z-20 border-b border-stone-100">
          <div className="max-w-3xl mx-auto px-4">
            <p className="eyebrow text-center mb-8">
              Đếm ngược đến ngày trọng đại
            </p>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.2 }}
              transition={{ staggerChildren: 0.12 }}
              className="grid grid-cols-4 gap-3 md:gap-5"
            >
              {[
                { label: "Ngày", value: timeLeft.days },
                { label: "Giờ", value: timeLeft.hours },
                { label: "Phút", value: timeLeft.mins },
                { label: "Giây", value: timeLeft.secs },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className="hover-lift rounded-2xl border border-amber-100 bg-wedding-cream/60 py-4 md:py-6 text-center shadow-[0_10px_30px_-20px_rgba(180,151,90,0.6)]"
                >
                  <div className="text-3xl md:text-5xl font-bold text-wedding-gold font-sans tabular-nums leading-none">
                    {pad2(item.value)}
                  </div>
                  <div className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.2em] text-stone-500 font-sans font-semibold">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ===== TRÂN TRỌNG KÍNH MỜI + ĐỊA ĐIỂM ===== */}
        <section className="py-20 md:py-28 px-4 max-w-4xl mx-auto">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="card-border rounded-[2rem] text-center overflow-hidden"
          >
            {/* Hoa văn góc */}
            <CornerFlourish className="absolute left-3 top-3 text-wedding-gold/70" />
            <CornerFlourish className="absolute right-3 bottom-3 rotate-180 text-wedding-gold/70" />

            <SectionHeading
              eyebrow="Trân trọng kính mời"
              title="Đến chung vui cùng chúng tôi"
              description="Sự hiện diện của Quý vị là niềm vinh dự và hạnh phúc lớn cho gia đình chúng tôi."
              variant="serif"
            />

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 text-left">
              {/* Thời gian */}
              <div className="hover-lift rounded-2xl border border-amber-100 bg-white/70 p-6 md:p-8 text-center">
                <Calendar
                  className="mx-auto text-wedding-gold mb-4"
                  size={30}
                />
                <p className="eyebrow mb-3">Thời gian làm lễ</p>
                <p className="text-xl md:text-2xl text-wedding-ink font-serif font-semibold leading-snug">
                  {config.locationCalendar.split(" - ").map((part, i) => (
                    <span key={i} className="block">
                      {part}
                    </span>
                  ))}
                </p>
                <p className="mt-2 text-sm text-stone-500 font-sans italic">
                  {config.locationCalendarLunar}
                </p>
              </div>

              {/* Địa điểm */}
              <div className="hover-lift rounded-2xl border border-amber-100 bg-white/70 p-6 md:p-8 text-center">
                <MapPin className="mx-auto text-wedding-rose mb-4" size={30} />
                <p className="eyebrow mb-3">Địa điểm tổ chức</p>
                <p className="text-xl md:text-2xl text-wedding-ink font-serif font-semibold">
                  {config.locationName}
                </p>
                <p className="mt-2 text-sm text-stone-500 font-sans max-w-xs mx-auto leading-relaxed">
                  {config.locationAddress}
                </p>
              </div>
            </div>

            {/* Lưu sự kiện vào lịch */}
            <div className="mt-8">
              <button
                onClick={handleAddToCalendar}
                className="btn-shimmer inline-flex items-center gap-2 rounded-full border border-wedding-gold/40 bg-wedding-gold/10 text-wedding-gold px-7 py-3 font-sans text-sm font-semibold tracking-wide hover:bg-wedding-gold hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wedding-gold transition-all active:scale-95 cursor-pointer"
              >
                <CalendarPlus size={18} />
                Lưu vào lịch
              </button>
            </div>
          </motion.div>
        </section>

        {/* ===== ĐẠI DIỆN HAI BÊN ===== */}
        <section className="bg-wedding-ivory py-20 md:py-28 px-4">
          <div className="max-w-5xl mx-auto">
            <SectionHeading
              eyebrow="Gia đình hai bên"
              title="Song hỷ"
              className="mb-14"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              {[
                {
                  side: "Nhà Trai",
                  father: "NGUYỄN THANH PHONG",
                  mother: "TRƯƠNG THỊ NGỌC PHƯƠNG",
                  role: "Chú rể",
                  name: isFullName.trai,
                  x: -50,
                },
                {
                  side: "Nhà Gái",
                  father: "PHẠM VĂN TIẾN",
                  mother: "ĐỖ THỊ TUYẾT MAI",
                  role: "Cô dâu",
                  name: isFullName.gai,
                  x: 50,
                },
              ].map((f) => (
                <motion.div
                  key={f.side}
                  initial={{ opacity: 0, x: f.x }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                  className="hover-lift text-center rounded-3xl border border-amber-100 bg-white/70 px-6 py-10 md:px-10 shadow-[0_20px_60px_-40px_rgba(180,151,90,0.5)]"
                >
                  <h3 className="eyebrow !text-sm border-b border-amber-200/70 pb-4 inline-block">
                    Đại diện {f.side}
                  </h3>
                  <div className="pt-6 space-y-1.5">
                    <p className="text-lg font-serif font-semibold text-wedding-ink">
                      Ông: {f.father}
                    </p>
                    <p className="text-lg font-serif font-semibold text-wedding-ink">
                      Bà: {f.mother}
                    </p>
                    <p className="text-stone-500 italic text-sm font-sans">
                      (Thân phụ &amp; Thân mẫu)
                    </p>
                  </div>
                  <div className="pt-7">
                    <p className="eyebrow mb-1">{f.role}</p>
                    <p className="font-cursive text-4xl md:text-5xl text-wedding-gold">
                      {f.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <OrnamentalDivider className="mt-14" />
          </div>
        </section>

        {/* ===== ALBUM ẢNH CƯỚI ===== */}
        <WeddingGallery />

        {/* ===== XÁC NHẬN THAM DỰ (RSVP) ===== */}
        <section className="py-20 md:py-28 bg-wedding-charcoal text-white relative overflow-hidden">
          {/* Nền gradient + đốm sáng tự dựng (thay ảnh hotlink bên ngoài) */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(180,151,90,0.18),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(201,138,134,0.16),transparent_45%)]" />
          </div>
          <GoldenDust count={14} />
          <div className="max-w-2xl mx-auto px-4 relative z-10">
            <SectionHeading
              eyebrow="Phúc đáp"
              title="Xác Nhận Tham Dự"
              description="Sự phản hồi sớm từ Quý khách sẽ giúp chúng tôi đón tiếp chu đáo nhất."
              tone="light"
              className="mb-12"
            />

            <div className="bg-white/[0.04] p-7 md:p-12 rounded-[28px] border border-white/10 backdrop-blur-xl shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
              <ConfigProvider theme={darkFormTheme}>
                <Form
                  layout="vertical"
                  onFinish={handleRSVP}
                  requiredMark={false}
                >
                  <Form.Item
                    name="fullName"
                    label={fieldLabel("Họ & Tên *")}
                    rules={[
                      { required: true, message: "Vui lòng nhập tên của bạn!" },
                    ]}
                  >
                    <Input
                      placeholder="Nhập tên của bạn..."
                      className="font-sans"
                    />
                  </Form.Item>

                  <Form.Item
                    name="attendance"
                    label={fieldLabel("Bạn sẽ tham dự chứ? *")}
                    initialValue="yes"
                  >
                    <Radio.Group
                      onChange={(e) => setWillAttend(e.target.value === "yes")}
                      style={{ display: "flex", width: "100%", gap: "12px" }}
                      optionType="button"
                      buttonStyle="solid"
                    >
                      <Radio.Button
                        value="yes"
                        style={{
                          flex: 1,
                          textAlign: "center",
                          height: "48px",
                          lineHeight: "46px",
                        }}
                        className="font-sans cursor-pointer"
                      >
                        Có, tôi sẽ đến
                      </Radio.Button>
                      <Radio.Button
                        value="no"
                        style={{
                          flex: 1,
                          textAlign: "center",
                          height: "48px",
                          lineHeight: "46px",
                        }}
                        className="font-sans cursor-pointer"
                      >
                        Rất tiếc, tôi bận
                      </Radio.Button>
                    </Radio.Group>
                  </Form.Item>

                  <AnimatePresence initial={false}>
                    {willAttend && (
                      <motion.div
                        key="rsvp-fields"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <Form.Item
                          name="guestCount"
                          label={fieldLabel("Số lượng khách *")}
                          initialValue="1"
                          rules={[{ required: true }]}
                        >
                          <Select
                            className="font-sans"
                            options={[
                              { value: "1", label: "1 người" },
                              { value: "2", label: "2 người" },
                              { value: "3", label: "3 người" },
                              { value: "family", label: "Cả gia đình" },
                            ]}
                          />
                        </Form.Item>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Form.Item
                    name="wishes"
                    label={fieldLabel("Lời chúc gửi đến cặp đôi")}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Gửi lời chúc mừng đến cô dâu chú rể..."
                      className="font-sans !py-3"
                    />
                  </Form.Item>

                  <Form.Item className="mb-0 pt-2">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isSubmitting}
                      icon={<Send size={18} />}
                      className={goldButtonClass}
                    >
                      {isSubmitting ? "Đang gửi..." : "Gửi Xác Nhận"}
                    </Button>
                  </Form.Item>
                </Form>
              </ConfigProvider>
            </div>
          </div>
        </section>

        {/* ===== HỘP THƯ LỜI CHÚC ===== */}
        <WishesSection />

        {/* ===== HỘP MỪNG CƯỚI ===== */}
        {/* Tự mở đúng tab (Nhà Trai/Nhà Gái) theo link đang xem */}
        <GiftSection type={type} />

        {/* ===== BẢN ĐỒ CHỈ ĐƯỜNG ===== */}
        <section className="py-20 md:py-28 px-4 bg-white">
          <div className="max-w-4xl mx-auto space-y-10 text-center">
            <SectionHeading
              eyebrow="Chỉ đường"
              title="Đường Đến Lễ Cưới"
              description={`Rất hân hạnh được đón tiếp Quý khách tại ${config.locationName}.`}
              variant="serif"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="relative w-full aspect-video md:aspect-21/9 rounded-2xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-amber-100"
            >
              <iframe
                title="Bản đồ đến địa điểm tổ chức"
                src={config.mapEmbedUrl}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>

            <div>
              <a
                href={config.mapDirectionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shimmer inline-flex items-center gap-2 bg-wedding-charcoal text-white px-8 py-4 rounded-full font-sans tracking-widest text-sm hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wedding-gold transition-all shadow-lg active:scale-95 font-bold"
              >
                <MapPin size={18} className="text-wedding-rose" />
                CHỈ ĐƯỜNG TRÊN GOOGLE MAPS
              </a>
            </div>
          </div>
        </section>

        {/* ===== LỜI CẢM ƠN & FOOTER ===== */}
        <section className="relative py-20 md:py-28 px-6 text-center bg-wedding-ivory overflow-hidden border-t border-amber-100/60">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-[0.04] pointer-events-none">
            <Heart size={300} className="text-wedding-gold" aria-hidden="true" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: false, amount: 0.2 }}
            className="relative z-10 max-w-2xl mx-auto"
          >
            <OrnamentalDivider className="mb-8" />
            <p className="eyebrow mb-4">Lời cảm ơn</p>
            <h2 className="text-4xl md:text-6xl font-cursive text-gilded mb-8">
              Thank You
            </h2>

            <p className="text-lg md:text-xl text-stone-600 leading-relaxed italic font-serif">
              &ldquo;Sự hiện diện và những lời chúc tốt đẹp của Quý vị là món
              quà ý nghĩa nhất dành cho chúng tôi trong ngày trọng đại
              này.&rdquo;
            </p>
            <p className="mt-6 text-stone-500 font-sans tracking-[0.2em] uppercase text-xs">
              Trân trọng cảm ơn và rất hân hạnh được đón tiếp!
            </p>

            <div className="pt-12">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5 }}
                className="inline-flex flex-col items-center border border-amber-200/70 rounded-2xl px-10 py-8 bg-white/50"
              >
                <Monogram size={72} className="mb-4" />
                <p className="text-stone-400 text-[10px] tracking-[0.4em] uppercase mb-3 font-sans">
                  Hành trình hạnh phúc bắt đầu từ đây
                </p>
                <p className="font-cursive text-4xl text-wedding-ink">
                  {isName.trai} &amp; {isName.gai}
                </p>
              </motion.div>
            </div>
          </motion.div>

          <footer className="relative z-10 mt-16 pt-8 border-t border-amber-100/60 text-[10px] text-stone-400 tracking-widest uppercase font-sans">
            © 2026 Huy &amp; Trinh Wedding Invitation • Made with Love
          </footer>
        </section>
      </div>
    </div>
  );
};

export default Invitation;
