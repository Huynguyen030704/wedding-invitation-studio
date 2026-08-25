import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  Search,
  ClipboardList,
  Heart,
  MessageSquareHeart,
  CheckCircle2,
} from "lucide-react";
import { Table, Input, Tag, ConfigProvider } from "antd";
import { supabase } from "../lib/supabaseClient";

const RSVPList = () => {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRSVPs();

    // Lắng nghe thay đổi real-time từ Supabase
    let subscription = null;
    if (supabase) {
      subscription = supabase
        .channel("rsvps_changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "rsvps" },
          () => {
            fetchRSVPs();
          }
        )
        .subscribe();
    }

    return () => {
      if (supabase && subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);

  const fetchRSVPs = async () => {
    if (!supabase) {
      setRsvps(getMockRSVPs());
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("rsvps")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRsvps(data || []);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      setRsvps(getMockRSVPs());
    } finally {
      setLoading(false);
    }
  };

  const getMockRSVPs = () => [
    { id: 1, full_name: "Nguyễn Văn A", guest_count: "2", guest_of: "groom", type: "Lễ Cưới", wishes: "Chúc hai bạn trăm năm hạnh phúc!", created_at: new Date().toISOString() },
    { id: 2, full_name: "Trần Thị B", guest_count: "family", guest_of: "bride", type: "Lễ Cưới", wishes: "Chúc mừng hạnh phúc gia đình mới!", created_at: new Date().toISOString() },
    { id: 3, full_name: "Lê Văn C", guest_count: "1", guest_of: "groom", type: "Đính Hôn", wishes: "", created_at: new Date().toISOString() },
  ];

  const filteredRSVPs = rsvps.filter((rsvp) =>
    rsvp.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalGuests = rsvps.reduce((acc, curr) => {
    // Khách gửi riêng lời chúc (guest_count = 0) không được tính vào tổng khách dự tiệc
    if (curr.guest_count === "0") return acc;
    if (curr.guest_count === "family") return acc + 4;
    return acc + parseInt(curr.guest_count || 0);
  }, 0);

  // Số lượt xác nhận sẽ tham dự (không tính người chỉ gửi lời chúc)
  const totalConfirmed = rsvps.filter((r) => r.guest_count !== "0").length;
  // Số lời chúc đã nhận
  const totalWishes = rsvps.filter((r) => r.wishes && r.wishes.trim()).length;

  const stats = [
    {
      icon: Users,
      label: "Tổng khách dự tiệc",
      value: `~${totalGuests}`,
      accent: "bg-amber-100 text-wedding-gold",
    },
    {
      icon: CheckCircle2,
      label: "Lượt xác nhận",
      value: totalConfirmed,
      accent: "bg-emerald-50 text-emerald-500",
    },
    {
      icon: MessageSquareHeart,
      label: "Lời chúc",
      value: totalWishes,
      accent: "bg-rose-50 text-rose-400",
    },
  ];

  // Định nghĩa các cột cho Ant Design Table
  const columns = [
    {
      title: <span className="font-sans font-bold text-xs">TÊN KHÁCH MỜI</span>,
      dataIndex: "full_name",
      key: "full_name",
      render: (text) => <span className="font-sans font-bold text-stone-800">{text}</span>,
    },
    {
      title: <span className="font-sans font-bold text-xs">SỐ LƯỢNG</span>,
      dataIndex: "guest_count",
      key: "guest_count",
      align: "center",
      render: (count) => {
        if (count === "0") {
          return <Tag color="default" className="font-sans">Chỉ gửi lời chúc</Tag>;
        }
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-sans font-bold ${
              count === "family"
                ? "bg-rose-100 text-rose-600"
                : "bg-wedding-cream text-wedding-gold border border-amber-200/50 shadow-sm"
            }`}
          >
            {count === "family" ? "Gia Đình" : `${count} Người`}
          </span>
        );
      },
    },
    {
      title: <span className="font-sans font-bold text-xs">KHÁCH CỦA NHÀ</span>,
      dataIndex: "guest_of",
      key: "guest_of",
      filters: [
        { text: "Nhà Trai", value: "groom" },
        { text: "Nhà Gái", value: "bride" },
      ],
      onFilter: (value, record) => record.guest_of === value,
      render: (role) => (
        <span
          className={`uppercase tracking-widest text-xs font-sans font-bold ${
            role === "groom" ? "text-wedding-gold" : "text-rose-400"
          }`}
        >
          {role === "groom" ? "Nhà Trai" : "Nhà Gái"}
        </span>
      ),
    },
    {
      title: <span className="font-sans font-bold text-xs">LOẠI TIỆC</span>,
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Lễ Cưới", value: "Lễ Cưới" },
        { text: "Đính Hôn", value: "Đính Hôn" },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type) => (
        <Tag color={type === "Lễ Cưới" ? "purple" : "blue"} className="font-sans">
          {type}
        </Tag>
      ),
    },
    {
      title: <span className="font-sans font-bold text-xs">LỜI CHÚC</span>,
      dataIndex: "wishes",
      key: "wishes",
      render: (wish) => (
        <span className="text-stone-500 italic text-sm font-serif max-w-xs block truncate" title={wish}>
          {wish || "—"}
        </span>
      ),
    },
    {
      title: <span className="font-sans font-bold text-xs">THỜI GIAN XÁC NHẬN</span>,
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (
        <span className="text-stone-400 text-xs italic font-sans">
          {new Date(date).toLocaleString("vi-VN")}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-wedding-cream font-serif p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-stone-500 hover:text-wedding-gold transition-colors mb-4 text-xs uppercase tracking-[0.2em] font-sans font-semibold"
          >
            <Home size={16} /> Quay về thiệp cưới
          </Link>
          <p className="eyebrow mb-2">Bảng điều khiển</p>
          <h1 className="text-4xl md:text-5xl font-cursive text-wedding-ink">
            Danh Sách Khách Mời
          </h1>
        </div>

        {/* Thẻ thống kê (Bento) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white p-5 rounded-2xl shadow-[0_18px_40px_-30px_rgba(180,151,90,0.6)] border border-stone-100 flex items-center gap-4"
              >
                <div className={`p-3 rounded-xl ${s.accent}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 uppercase tracking-[0.15em] font-sans font-semibold">
                    {s.label}
                  </p>
                  <p className="text-2xl font-bold text-wedding-ink font-sans tabular-nums">
                    {s.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dashboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-amber-100 overflow-hidden"
        >
          <div className="p-4 md:p-6 border-b border-stone-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-50/50">
            <div className="flex items-center gap-2 text-stone-700 font-bold uppercase tracking-widest text-xs font-sans">
              <ClipboardList size={18} className="text-wedding-gold" />
              Bảng Thống Kê Phản Hồi
            </div>
            <div className="relative w-full md:w-auto">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                size={16}
              />
              <Input
                type="text"
                placeholder="Tìm kiếm khách mời..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-full text-sm outline-none focus:border-wedding-gold focus:shadow-none transition-all w-full md:w-64 font-sans h-10"
              />
            </div>
          </div>

          {/* Ant Design Table dành cho Desktop */}
          <div className="hidden md:block">
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#b4975a",
                  borderRadius: 10,
                  fontFamily:
                    '"Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif',
                },
                components: {
                  Table: {
                    headerBg: "#faf7f0",
                    headerColor: "#6b6257",
                    rowHoverBg: "#fdfbf7",
                    borderColor: "#f1ece2",
                  },
                },
              }}
            >
              <Table
                dataSource={filteredRSVPs}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  className: "px-6 font-sans",
                }}
                className="wedding-table"
              />
            </ConfigProvider>
          </div>

          {/* Thiết kế Cards dành cho Mobile */}
          <div className="md:hidden divide-y divide-stone-50">
            {loading ? (
              <div className="p-10 text-center text-stone-400 font-sans">Đang tải dữ liệu...</div>
            ) : filteredRSVPs.length === 0 ? (
              <div className="p-10 text-center text-stone-400 font-sans">Không tìm thấy kết quả nào</div>
            ) : (
              filteredRSVPs.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="p-6 space-y-4 active:bg-amber-50/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-stone-800 text-lg">
                        {rsvp.full_name}
                      </h3>
                      <p className="text-stone-400 text-xs italic font-sans mt-1">
                        {new Date(rsvp.created_at).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    {rsvp.guest_count === "0" ? (
                      <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-[10px] font-sans font-bold">
                        Chỉ gửi lời chúc
                      </span>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-sans font-bold ${
                          rsvp.guest_count === "family"
                            ? "bg-rose-100 text-rose-600"
                            : "bg-wedding-cream text-wedding-gold shadow-sm"
                        }`}
                      >
                        {rsvp.guest_count === "family"
                          ? "Gia Đình"
                          : rsvp.guest_count + " Người"}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs font-sans">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          rsvp.guest_of === "groom"
                            ? "bg-wedding-gold"
                            : "bg-rose-400"
                        }`}
                      ></div>
                      <span
                        className={`uppercase tracking-widest text-[10px] font-bold ${
                          rsvp.guest_of === "groom"
                            ? "text-wedding-gold"
                            : "text-rose-400"
                        }`}
                      >
                        Khách {rsvp.guest_of === "groom" ? "Nhà Trai" : "Nhà Gái"}
                      </span>
                    </div>

                    <Tag color={rsvp.type === "Lễ Cưới" ? "purple" : "blue"}>
                      {rsvp.type}
                    </Tag>
                  </div>

                  {rsvp.wishes && (
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                      <p className="text-stone-600 italic text-sm font-serif">
                        "{rsvp.wishes}"
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-stone-50/30 text-center">
            <p className="text-stone-400 text-xs italic font-sans flex items-center justify-center gap-2">
              <Heart size={12} className="text-rose-300" /> Hệ thống tự động đồng bộ thời gian thực
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RSVPList;
