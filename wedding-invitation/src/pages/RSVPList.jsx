import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Users, Search, ClipboardList, Heart } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const RSVPList = () => {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRSVPs();

    // Lắng nghe thay đổi real-time
    const subscription = supabase
      .channel("rsvps_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rsvps" },
        () => {
          fetchRSVPs();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchRSVPs = async () => {
    try {
      const { data, error } = await supabase
        .from("rsvps")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRsvps(data || []);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRSVPs = rsvps.filter((rsvp) =>
    rsvp.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalGuests = rsvps.reduce((acc, curr) => {
    if (curr.guest_count === "family") return acc + 4;
    return acc + parseInt(curr.guest_count || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-wedding-cream font-serif p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-stone-500 hover:text-wedding-gold transition-colors mb-4 text-sm uppercase tracking-widest font-sans"
            >
              <Home size={16} /> Trang Chủ
            </Link>
            <h1 className="text-4xl md:text-5xl font-cursive text-stone-800">
              Danh Sách Khách Mời
            </h1>
          </div>

          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-xl text-wedding-gold">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-widest font-sans">
                  Tổng khách dự kiến
                </p>
                <p className="text-2xl font-bold text-stone-800">
                  ~{totalGuests}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-amber-100 overflow-hidden"
        >
          <div className="p-4 md:p-6 border-b border-stone-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-50/50">
            <div className="flex items-center gap-2 text-stone-700 font-bold uppercase tracking-widest text-sm font-sans">
              <ClipboardList size={18} className="text-wedding-gold" />
              Xác Nhận Gần Đây
            </div>
            <div className="relative w-full md:w-auto">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-full text-sm outline-none focus:border-wedding-gold transition-all w-full md:w-64 font-sans"
              />
            </div>
          </div>

          {/* Table for Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 text-stone-400 text-[10px] uppercase tracking-[0.2em] font-sans">
                  <th className="px-8 py-4">Tên Khách Mời</th>
                  <th className="px-8 py-4 text-center">Số Lượng</th>
                  <th className="px-8 py-4">Khách Của Nhà</th>
                  <th className="px-8 py-4">Loại Tiệc</th>
                  <th className="px-8 py-4">Thời Gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredRSVPs.map((rsvp) => (
                  <tr
                    key={rsvp.id}
                    className="hover:bg-amber-50/30 transition-colors group"
                  >
                    <td className="px-8 py-6 font-bold text-stone-800">
                      {rsvp.full_name}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-sans font-bold ${
                          rsvp.guest_count === "family"
                            ? "bg-rose-100 text-rose-600"
                            : "bg-wedding-cream text-wedding-gold shadow-sm"
                        }`}
                      >
                        {rsvp.guest_count === "family"
                          ? "Gia Đình"
                          : rsvp.guest_count + " Người"}
                      </span>
                    </td>
                    <td className="px-8 py-6 uppercase tracking-widest text-xs font-sans">
                      <span
                        className={
                          rsvp.guest_of === "groom"
                            ? "text-wedding-gold"
                            : "text-rose-400"
                        }
                      >
                        {rsvp.guest_of === "groom" ? "Nhà Trai" : "Nhà Gái"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm italic font-sans">
                      <span
                        className={
                          rsvp.type === "Đính Hôn"
                            ? "text-indigo-500"
                            : "text-purple-500"
                        }
                      >
                        {rsvp.type}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-stone-400 text-sm italic font-sans">
                      {new Date(rsvp.created_at).toLocaleString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for Mobile */}
          <div className="md:hidden divide-y divide-stone-50">
            {filteredRSVPs.map((rsvp) => (
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
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      rsvp.guest_of === "groom"
                        ? "bg-wedding-gold"
                        : "bg-rose-400"
                    }`}
                  ></div>
                  <span
                    className={`uppercase tracking-widest text-[10px] font-sans font-bold ${
                      rsvp.guest_of === "groom"
                        ? "text-wedding-gold"
                        : "text-rose-400"
                    }`}
                  >
                    Khách {rsvp.guest_of === "groom" ? "Nhà Trai" : "Nhà Gái"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-stone-50/30 text-center">
            <p className="text-stone-400 text-xs italic font-sans flex items-center justify-center gap-2">
              <Heart size={12} className="text-rose-300" /> Dữ liệu được cập
              nhật tự động
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RSVPList;
