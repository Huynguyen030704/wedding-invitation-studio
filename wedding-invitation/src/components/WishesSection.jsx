import { useState, useEffect } from "react";
import { Form, Input, Button, message, ConfigProvider, Skeleton, Empty } from "antd";
import { Heart, Send, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { darkFormTheme, goldButtonClass } from "../lib/formTheme";
import GoldenDust from "./GoldenDust";

const WishesSection = () => {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    if (!supabase) {
      setWishes(getMockWishes());
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("rsvps")
        .select("full_name, wishes, created_at")
        .not("wishes", "is", null)
        .order("created_at", { ascending: false });

      if (error) {
        console.warn(
          "⚠️ Cột 'wishes' chưa được tạo trong Supabase. Sử dụng mock wishes.",
        );
        setWishes(getMockWishes());
      } else {
        const validWishes = data.filter(
          (item) => item.wishes && item.wishes.trim() !== "",
        );
        if (validWishes.length === 0) {
          setWishes(getMockWishes());
        } else {
          setWishes(validWishes);
        }
      }
    } catch (e) {
      setWishes(getMockWishes());
    } finally {
      setLoading(false);
    }
  };

  const getMockWishes = () => [
    {
      full_name: "Gia đình Bác Hai",
      wishes: "Chúc hai cháu trăm năm hạnh phúc, đầu bạc răng long! ❤️",
    },
    {
      full_name: "Bạn Nhà Gái",
      wishes: "Mãi bên nhau bạn nhé! Chúc đám cưới rình rang nha!",
    },
    {
      full_name: "Bạn Nhà Trai",
      wishes: "Chúc mừng hạnh phúc hai em, một hành trình mới thật ngọt ngào.",
    },
    {
      full_name: "Bạn Gia Vy",
      wishes: "Tân hôn vui vẻ! Chúc tổ ấm mới luôn ngập tràn tiếng cười!",
    },
  ];

  const handleSubmit = async (values) => {
    setSubmitting(true);
    const { name, wish } = values;

    if (!supabase) {
      message.success("Gửi lời chúc thành công! (Chế độ offline)");
      setWishes((prev) => [{ full_name: name, wishes: wish }, ...prev]);
      form.resetFields();
      setSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from("rsvps").insert([
        {
          full_name: name,
          wishes: wish,
          guest_count: "0",
          guest_of: "groom",
          type: "Lễ Cưới",
        },
      ]);

      if (error) throw error;

      message.success("Cảm ơn lời chúc ngọt ngào của bạn! ❤️");
      setWishes((prev) => [{ full_name: name, wishes: wish }, ...prev]);
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error(
        "Gửi lời chúc thất bại. Có thể cột 'wishes' chưa được tạo trong Supabase.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fieldLabel = (text) => (
    <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-semibold text-wedding-champagne">
      {text}
    </span>
  );

  return (
    <section className="py-20 md:py-28 bg-wedding-charcoal text-white relative overflow-hidden">
      {/* Nền trang trí tự dựng */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(180,151,90,0.15),transparent_45%),radial-gradient(circle_at_10%_90%,rgba(201,138,134,0.14),transparent_45%)]" />
        <Heart size={400} className="absolute -right-24 -bottom-24 text-white/[0.03]" />
      </div>
      <GoldenDust count={14} />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Cột 1: Danh sách lời chúc */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <p className="eyebrow !text-wedding-champagne mb-3">Yêu thương gửi trao</p>
              <h2 className="text-4xl md:text-5xl font-cursive text-amber-200 mb-2">
                Hộp Thư Lời Chúc
              </h2>
              <p className="text-white/50 text-sm font-serif italic">
                Những lời yêu thương từ người thân &amp; bạn bè.
              </p>
            </motion.div>

            {/* Khối chứa lời chúc + hiệu ứng mờ dần ở cạnh */}
            <div className="relative">
              <div className="h-[360px] overflow-y-auto pr-3 space-y-4 scroll-elegant">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white/[0.04] border border-white/10 p-6 rounded-2xl"
                    >
                      <Skeleton
                        active
                        paragraph={{ rows: 2 }}
                        title={{ width: "40%" }}
                      />
                    </div>
                  ))
                ) : wishes.length === 0 ? (
                  <Empty
                    description={
                      <span className="text-white/50 font-sans text-sm">
                        Chưa có lời chúc nào. Hãy là người đầu tiên!
                      </span>
                    }
                    className="py-16"
                  />
                ) : (
                  wishes.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.05, 0.4) }}
                      className="relative bg-white/[0.05] border border-white/10 p-6 rounded-2xl backdrop-blur-sm shadow-md hover:border-amber-200/30 transition-colors"
                    >
                      <Quote
                        size={28}
                        className="absolute right-5 top-5 text-white/[0.06]"
                      />
                      <div className="flex items-center gap-2 mb-3">
                        <Heart size={13} className="text-wedding-rose fill-current" />
                        <span className="font-semibold text-amber-200 text-sm font-sans">
                          {item.full_name}
                        </span>
                      </div>
                      <p className="text-white/75 text-[15px] italic font-serif leading-relaxed">
                        &ldquo;{item.wishes}&rdquo;
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
              {/* Fade trên/dưới cho đẹp mép cuộn */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-wedding-charcoal to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-wedding-charcoal to-transparent" />
            </div>
          </div>

          {/* Cột 2: Form gửi lời chúc */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.04] border border-white/10 p-8 md:p-12 rounded-[28px] backdrop-blur-xl shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]"
          >
            <div className="text-center mb-8">
              <Heart className="mx-auto text-amber-200 mb-3" size={26} />
              <h3 className="text-lg font-bold uppercase tracking-[0.2em] text-amber-200 font-sans">
                Gửi Lời Chúc Mừng
              </h3>
              <p className="text-white/50 text-xs mt-2 font-sans">
                Hãy gửi những lời chúc tốt đẹp nhất đến với chúng tôi.
              </p>
            </div>

            <ConfigProvider theme={darkFormTheme}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
              >
                <Form.Item
                  name="name"
                  label={fieldLabel("Họ & Tên *")}
                  rules={[
                    { required: true, message: "Vui lòng nhập tên của bạn!" },
                  ]}
                >
                  <Input placeholder="Tên của bạn..." className="font-sans" />
                </Form.Item>

                <Form.Item
                  name="wish"
                  label={fieldLabel("Lời Chúc *")}
                  rules={[{ required: true, message: "Vui lòng nhập lời chúc!" }]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Nhập lời chúc ngọt ngào tại đây..."
                    className="font-sans !py-3"
                  />
                </Form.Item>

                <Form.Item className="mb-0 pt-2">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    icon={<Send size={16} />}
                    className={goldButtonClass}
                  >
                    Gửi Lời Chúc
                  </Button>
                </Form.Item>
              </Form>
            </ConfigProvider>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WishesSection;
