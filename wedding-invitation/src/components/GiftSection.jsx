import { useState } from "react";
import { Segmented, message, ConfigProvider } from "antd";
import { Copy, Gift, QrCode } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeading } from "./Ornaments";

/**
 * ⚠️ THAY THÔNG TIN NGÂN HÀNG THẬT Ở ĐÂY.
 * bankBin: mã ngân hàng theo VietQR (VD: Vietcombank 970436, Techcombank 970407,
 * MB 970422, ACB 970416, BIDV 970418, VietinBank 970415, Agribank 970405...).
 */
const giftAccounts = {
  groom: {
    label: "Nhà Trai",
    bankName: "Vietcombank",
    bankBin: "970436",
    account: "1042071300",
    holder: "NGUYEN NHUT HUY",
  },
  bride: {
    label: "Nhà Gái",
    bankName: "Vietcombank",
    bankBin: "970436",
    account: "0000000000",
    holder: "PHAM MAI TRINH",
  },
};

const qrUrl = ({ bankBin, account, holder }) =>
  `https://img.vietqr.io/image/${bankBin}-${account}-compact2.png?accountName=${encodeURIComponent(
    holder,
  )}`;

const GiftSection = () => {
  const [side, setSide] = useState("groom");
  const acc = giftAccounts[side];

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(acc.account);
      message.success("Đã sao chép số tài khoản!");
    } catch {
      message.info(`Số tài khoản: ${acc.account}`);
    }
  };

  return (
    <section className="py-20 md:py-28 px-4 bg-wedding-ivory">
      <div className="max-w-2xl mx-auto">
        <SectionHeading
          eyebrow="Chung vui"
          title="Hộp Mừng Cưới"
          description="Sự hiện diện của Quý vị đã là món quà quý giá. Nếu muốn gửi thêm lời chúc bằng một món quà nhỏ, xin chân thành cảm ơn."
          variant="serif"
          className="mb-10"
        />

        <div className="flex justify-center mb-8">
          <ConfigProvider
            theme={{
              token: { colorPrimary: "#b4975a", borderRadius: 999 },
              components: {
                Segmented: {
                  itemSelectedBg: "#b4975a",
                  itemSelectedColor: "#fff",
                  trackBg: "#f1ece2",
                },
              },
            }}
          >
            <Segmented
              size="large"
              value={side}
              onChange={setSide}
              options={[
                { label: giftAccounts.groom.label, value: "groom" },
                { label: giftAccounts.bride.label, value: "bride" },
              ]}
            />
          </ConfigProvider>
        </div>

        <motion.div
          key={side}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-amber-100 bg-white/80 p-6 md:p-10 shadow-[0_24px_60px_-40px_rgba(180,151,90,0.6)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 items-center">
            {/* QR */}
            <div className="mx-auto">
              <div className="rounded-2xl border border-amber-100 bg-white p-3 shadow-sm">
                <img
                  src={qrUrl(acc)}
                  alt={`Mã QR chuyển khoản ${acc.label}`}
                  loading="lazy"
                  className="w-44 h-44 md:w-52 md:h-52 object-contain"
                />
              </div>
              <p className="mt-3 text-center text-[11px] text-stone-400 font-sans flex items-center justify-center gap-1.5">
                <QrCode size={13} /> Quét mã để chuyển khoản
              </p>
            </div>

            {/* Thông tin */}
            <div className="text-center sm:text-left space-y-4">
              <div className="inline-flex items-center gap-2 text-wedding-gold">
                <Gift size={20} />
                <span className="eyebrow">{acc.label}</span>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-stone-400 font-sans">
                  Ngân hàng
                </p>
                <p className="text-lg font-serif font-semibold text-wedding-ink">
                  {acc.bankName}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-stone-400 font-sans">
                  Chủ tài khoản
                </p>
                <p className="text-lg font-serif font-semibold text-wedding-ink">
                  {acc.holder}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-stone-400 font-sans">
                  Số tài khoản
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-1">
                  <span className="text-xl font-sans font-bold text-wedding-ink tabular-nums tracking-wide">
                    {acc.account}
                  </span>
                  <button
                    onClick={copyAccount}
                    className="btn-shimmer inline-flex items-center gap-1.5 rounded-full bg-wedding-gold/10 text-wedding-gold border border-wedding-gold/30 px-3 py-1.5 text-xs font-sans font-semibold hover:bg-wedding-gold hover:text-white transition-all cursor-pointer"
                  >
                    <Copy size={13} /> Sao chép
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GiftSection;
