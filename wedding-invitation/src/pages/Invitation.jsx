import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Send, Volume2, VolumeX, Calendar, MapPin } from "lucide-react";
import {
  Form,
  Input,
  Select,
  Button,
  ConfigProvider,
  theme,
  Radio,
} from "antd";
import confetti from "canvas-confetti";
import Swal from "sweetalert2";
import { supabase } from "../lib/supabaseClient";
import FloatingPetals from "../components/FloatingPetals";
import WeddingGallery from "../components/WeddingGallery";
import WishesSection from "../components/WishesSection";

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

  const isName = { trai: "Huy", gai: "Trinh" };
  const isFullName = { trai: "Nhựt Huy", gai: "Mai Trinh" };

  // Cấu hình động dựa trên prop `type`
  const isGroom = type === "groom";
  const config = {
    ceremonyName: isGroom ? "Lễ Tân Hôn" : "Lễ Vu Quy",
    targetDate: isGroom ? "2026-09-30T11:00:00" : "2026-09-29T09:00:00",
    bannerDate: isGroom ? "30 . 09 . 2026" : "29 . 09 . 2026",
    locationName: isGroom ? "Tư Gia Nhà Trai" : "Tư Gia Nhà Gái",
    locationAddress: isGroom
      ? "29, Ấp Bồ Đề, Xã Gia Thuận, Tỉnh Đồng Tháp"
      : "Cầu số 6, Ấp Xóm Mới, Xã Gia Thuận, Tỉnh Đồng Tháp",
    locationCalendar: isGroom
      ? "11:00 Trưa - 30 Tháng 09, 2026"
      : "09:00 Sáng - 29 Tháng 09, 2026",
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

      confetti({ particleCount: 150, spread: 80, origin: { y: 0.7 } });

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
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
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

            {/* Content ở giữa */}
            <motion.div
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-10 flex items-center justify-center"
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
                    className="bg-white text-stone-900 px-10 py-4 rounded-full font-sans tracking-[0.2em] text-xs hover:bg-amber-100 transition-all shadow-xl font-bold cursor-pointer"
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
              className="w-full h-full object-cover object-center animate-slow-zoom"
              alt="Hero"
            />
            <div className="absolute inset-0 bg-black/45" />
          </div>

          <div className="relative z-10 text-center text-white px-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="uppercase text-[10px] md:text-sm tracking-[0.3em] mb-4 font-sans font-bold text-amber-200"
            >
              {config.ceremonyName}
            </motion.p>
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl md:text-9xl font-cursive text-amber-100 mb-6 leading-tight"
            >
              {isName.trai} & {isName.gai}
            </motion.h1>
            <div className="text-lg md:text-2xl font-light italic border-y border-white/30 py-3 inline-block px-6 font-sans">
              {config.bannerDate}
            </div>
          </div>

          {isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={toggleMusic}
              className="fixed bottom-6 right-6 z-50 bg-white/80 backdrop-blur-md p-4 rounded-full shadow-2xl border border-amber-200 text-wedding-gold hover:bg-white transition-all group cursor-pointer"
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

        {/* Bộ đếm ngược thời gian */}
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
                <div className="text-2xl md:text-5xl font-bold text-wedding-gold font-sans">
                  {item.value}
                </div>
                <div className="text-[9px] md:text-xs uppercase tracking-widest text-stone-400 font-sans">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Thông tin Địa điểm & Thời gian làm lễ của từng bên */}
        <section className="py-16 md:py-24 px-4 max-w-4xl mx-auto">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            viewport={{ once: true }}
            className="card-border text-center rounded-3xl"
          >
            <Heart
              className="mx-auto text-rose-500 mb-6"
              fill="currentColor"
              size={28}
            />
            <h2 className="text-3xl md:text-4xl text-stone-700 mb-2 uppercase tracking-widest font-sans font-bold">
              Trân Trọng Kính Mời
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-stone-500 italic mb-8">
              Sự hiện diện của Quý vị là niềm vinh dự và hạnh phúc lớn cho gia
              đình chúng tôi
            </p>

            {/* Hiển thị thông tin địa điểm và lịch chi tiết của bên tương ứng */}
            <div className="bg-white/40 p-8 md:p-12 rounded-2xl border border-amber-100 space-y-6 text-center">
              <Calendar className="mx-auto text-wedding-gold" size={32} />
              <p className="font-bold text-base tracking-widest text-stone-700 font-sans">
                THỜI GIAN LÀM LỄ
              </p>
              <p className="text-2xl text-stone-800 font-bold">
                {config.locationCalendar}
              </p>
              <p className="text-sm text-stone-500 font-sans italic">
                {config.locationCalendarLunar}
              </p>

              <div className="pt-6 border-t border-stone-100 space-y-2">
                <MapPin className="mx-auto text-rose-500 mb-2" size={32} />
                <p className="font-bold text-base tracking-widest text-stone-700 font-sans">
                  ĐỊA ĐIỂM TỔ CHỨC
                </p>
                <p className="text-xl text-stone-800 font-bold">
                  {config.locationName}
                </p>
                <p className="text-sm text-stone-500 font-sans mt-1 max-w-md mx-auto leading-relaxed">
                  {config.locationAddress}
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Thông tin đại diện hai bên */}
        <section className="bg-stone-50 py-16 px-4 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <h3 className="text-xl md:text-2xl font-sans text-stone-700 uppercase tracking-widest border-b border-amber-200 pb-4 inline-block font-bold">
                  Đại Diện Nhà Trai
                </h3>
                <div className="pt-4 space-y-2 font-serif">
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
                <h3 className="text-xl md:text-2xl font-sans text-stone-700 uppercase tracking-widest border-b border-amber-200 pb-4 inline-block font-bold">
                  Đại Diện Nhà Gái
                </h3>
                <div className="pt-4 space-y-2 font-serif">
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
                className="mx-4 text-rose-300 animate-pulse"
                fill="currentColor"
                size={20}
              />
              <div className="h-px bg-amber-200 w-full max-w-[200px] self-center"></div>
            </div>
          </div>
        </section>

        {/* Thư viện ảnh cưới (WeddingGallery Component) */}
        <WeddingGallery />

        {/* Form Xác nhận tham dự (RSVP Form được làm đẹp tinh tế và sang trọng) */}
        <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <img
              src="https://png.pngtree.com/thumb_back/fh260/background/20240929/pngtree-pink-roses-and-purple-flowers-on-a-beige-background-floral-for-image_16278432.jpg"
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div className="max-w-2xl mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-cursive text-amber-200 mb-4">
                Xác Nhận Tham Dự
              </h2>
              <p className="text-stone-400 tracking-widest uppercase text-xs font-sans">
                Sự phản hồi sớm từ Quý khách sẽ giúp chúng tôi đón tiếp chu đáo
                nhất
              </p>
            </div>

            {/* Sử dụng ConfigProvider để tùy chỉnh giao diện Form Ant Design cực đẹp và sang trọng */}
            <div className="bg-white/5 p-8 md:p-12 rounded-[32px] border border-white/10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <ConfigProvider
                theme={{
                  algorithm: theme.darkAlgorithm,
                  token: {
                    colorPrimary: "#b4975a", // màu vàng gold làm chủ đạo
                    borderRadius: 16, // Bo góc mềm mại hơn
                    controlHeight: 50, // Nâng độ cao input cho dễ thao tác, thanh thoát hơn
                    colorBgContainer: "rgba(255, 255, 255, 0.03)", // Nền input trong suốt tối giản
                    colorBorder: "rgba(255, 255, 255, 0.12)", // Viền mỏng mờ
                    colorTextPlaceholder: "rgba(255, 255, 255, 0.3)",
                    colorBgElevated: "#1c1917", // Nền dropdown menu cùng tông màu tối
                  },
                  components: {
                    Form: {
                      itemMarginBottom: 28, // Tăng khoảng cách margin-bottom giữa các trường
                      verticalLabelPadding: "0 0 10px 0", // Tăng khoảng cách từ nhãn đến ô nhập liệu
                    },
                    Input: {
                      activeBorderColor: "#b4975a",
                      hoverBorderColor: "#d97706",
                    },
                    Select: {
                      optionSelectedBg: "rgba(180, 151, 90, 0.2)",
                      activeBorderColor: "#b4975a",
                      hoverBorderColor: "#d97706",
                    },
                    Radio: {
                      buttonBg: "rgba(255, 255, 255, 0.02)",
                      buttonCheckedBg: "#b4975a",
                      buttonSolidCheckedBg: "#b4975a",
                      colorPrimary: "#b4975a",
                      colorText: "#d6d3d1",
                    },
                  },
                }}
              >
                <Form
                  layout="vertical"
                  onFinish={handleRSVP}
                  requiredMark={false}
                  className="space-y-4"
                >
                  <Form.Item
                    name="fullName"
                    label={
                      <span className="text-amber-100 text-xs uppercase tracking-widest font-sans font-bold">
                        Họ & Tên *
                      </span>
                    }
                    rules={[
                      { required: true, message: "Vui lòng nhập tên của bạn!" },
                    ]}
                  >
                    <Input
                      placeholder="Nhập tên của bạn..."
                      className="font-sans border-white/10 hover:border-amber-200/50 focus:border-amber-200"
                    />
                  </Form.Item>

                  <Form.Item
                    name="attendance"
                    label={
                      <span className="text-amber-100 text-xs uppercase tracking-widest font-sans font-bold">
                        Bạn sẽ tham dự chứ? *
                      </span>
                    }
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
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 pb-2">
                          <Form.Item
                            name="guestCount"
                            label={
                              <span className="text-amber-100 text-xs uppercase tracking-widest font-sans font-bold">
                                Số lượng khách *
                              </span>
                            }
                            initialValue="1"
                            rules={[{ required: true }]}
                          >
                            <Select
                              className="font-sans border-white/10 hover:border-amber-200/50"
                              options={[
                                { value: "1", label: "1 người" },
                                { value: "2", label: "2 người" },
                                { value: "3", label: "3 người" },
                                { value: "family", label: "Cả gia đình" },
                              ]}
                            />
                          </Form.Item>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Form.Item
                    name="wishes"
                    label={
                      <span className="text-amber-100 text-xs uppercase tracking-widest font-sans font-bold">
                        Lời chúc gửi đến cặp đôi
                      </span>
                    }
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Gửi lời chúc mừng đến cô dâu chú rể..."
                      className="font-sans border-white/10 hover:border-amber-200/50 focus:border-amber-200 !py-3"
                    />
                  </Form.Item>

                  <Form.Item className="mb-0 pt-2">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isSubmitting}
                      icon={<Send size={18} />}
                      className="w-full bg-gradient-to-r from-amber-300 via-wedding-gold to-amber-400 text-stone-900 border-none hover:brightness-110 font-bold tracking-widest uppercase h-14 rounded-2xl flex items-center justify-center gap-2 font-sans active:scale-98 transition-all shadow-[0_10px_20px_rgba(180,151,90,0.15)] cursor-pointer"
                    >
                      {isSubmitting ? "Đang gửi..." : "Gửi Xác Nhận"}
                    </Button>
                  </Form.Item>
                </Form>
              </ConfigProvider>
            </div>
          </div>
        </section>

        {/* Hộp Thư Lời Chúc (WishesSection Component) */}
        <WishesSection />

        {/* Bản đồ chỉ đường phù hợp cho từng nhà */}
        <section className="py-20 px-4 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto space-y-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl md:text-3xl uppercase tracking-[0.2em] text-stone-700 mb-2 font-sans font-bold">
                Đường Đến Lễ Cưới
              </h3>
              <p className="text-stone-500 italic mb-8">
                Rất hân hạnh được đón tiếp Quý khách tại {config.locationName}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative w-full aspect-video md:aspect-21/9 rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
            >
              <iframe
                src={config.mapEmbedUrl}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>

            <div className="pt-6">
              <a
                href={config.mapDirectionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-full font-sans tracking-widest text-sm hover:bg-stone-800 transition-all shadow-lg active:scale-95 font-bold"
              >
                <MapPin size={18} className="text-rose-400" />
                CHỈ ĐƯỜNG TRÊN GOOGLE MAPS
              </a>
            </div>
          </div>
        </section>

        {/* Lời cảm ơn & Footer */}
        <section className="relative py-24 px-6 text-center bg-white overflow-hidden border-t border-stone-50">
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
              <p className="text-lg md:text-xl text-stone-600 leading-relaxed italic font-serif">
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
                viewport={{ once: true }}
                className="inline-block border border-amber-100 p-8"
              >
                <p className="text-stone-400 text-[10px] tracking-[0.5em] uppercase mb-2 font-sans">
                  Hành trình hạnh phúc bắt đầu từ đây
                </p>
                <p className="font-cursive text-3xl text-stone-800">
                  Huy & Trinh
                </p>
              </motion.div>
            </div>
          </motion.div>

          <footer className="mt-20 pt-8 border-t border-stone-50 text-[10px] text-stone-400 tracking-widest uppercase font-sans">
            © 2026 Huy & Trinh Wedding Invitation • Made with Love
          </footer>
        </section>
      </div>
    </div>
  );
};

export default Invitation;
