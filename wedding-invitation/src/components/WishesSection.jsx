import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, ConfigProvider, theme } from "antd";
import { Heart, Send } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

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

  return (
    <section className="py-20 bg-stone-900 text-white relative overflow-hidden">
      {/* Background Hoa Văn */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <Heart
          size={400}
          className="absolute -right-20 -bottom-20 text-white"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Cột 1: Danh sách lời chúc chạy chữ */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-4xl md:text-5xl font-cursive text-amber-200 mb-2">
                Hộp Thư Lời Chúc
              </h2>
              <p className="text-stone-400 text-xs tracking-widest uppercase font-sans font-bold">
                Những lời yêu thương từ người thân & bạn bè
              </p>
            </motion.div>

            {/* Khối chứa lời chúc */}
            <div className="h-[350px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-stone-700">
              {wishes.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm shadow-md"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-amber-200 text-sm font-sans">
                      {item.full_name}
                    </span>
                    <Heart size={14} className="text-rose-400 fill-rose-400" />
                  </div>
                  <p className="text-stone-300 text-sm italic font-serif leading-relaxed">
                    "{item.wishes}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cột 2: Form gửi lời chúc được làm đẹp tinh tế */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[32px] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative"
          >
            <div className="text-center mb-8">
              <Heart className="mx-auto text-amber-200 mb-2" size={24} />
              <h3 className="text-xl font-bold uppercase tracking-widest text-amber-200 font-sans">
                Gửi Lời Chúc Mừng
              </h3>
              <p className="text-stone-400 text-xs mt-1">
                Hãy gửi những lời chúc tốt đẹp nhất đến với chúng tôi
              </p>
            </div>

            {/* Cấu hình theme riêng biệt cực sang trọng cho Form gửi lời chúc */}
            <ConfigProvider
              theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                  colorPrimary: "#b4975a",
                  borderRadius: 16,
                  controlHeight: 50,
                  colorBgContainer: "rgba(255, 255, 255, 0.03)",
                  colorBorder: "rgba(255, 255, 255, 0.12)",
                  colorTextPlaceholder: "rgba(255, 255, 255, 0.3)",
                },
                components: {
                  Input: {
                    activeBorderColor: "#b4975a",
                    hoverBorderColor: "#d97706",
                  },
                },
              }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
                className="space-y-4"
              >
                <Form.Item
                  name="name"
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
                    placeholder="Tên của bạn..."
                    className="font-sans border-white/10 hover:border-amber-200/50 focus:border-amber-200"
                  />
                </Form.Item>

                <Form.Item
                  name="wish"
                  label={
                    <span className="text-amber-100 text-xs uppercase tracking-widest font-sans font-bold">
                      Lời Chúc *
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập lời chúc!" },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Nhập lời chúc ngọt ngào tại đây..."
                    className="font-sans border-white/10 hover:border-amber-200/50 focus:border-amber-200 !py-3"
                  />
                </Form.Item>

                <Form.Item className="mb-0 pt-2">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    icon={<Send size={16} />}
                    className="w-full bg-gradient-to-r from-amber-300 via-wedding-gold to-amber-400 text-stone-900 border-none hover:brightness-110 font-bold tracking-widest uppercase h-14 rounded-2xl flex items-center justify-center gap-2 font-sans active:scale-98 transition-all shadow-[0_10px_20px_rgba(180,151,90,0.15)] cursor-pointer"
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
