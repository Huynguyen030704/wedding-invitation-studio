import { Heart } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Dải phân cách trang trí: hai đường vàng + trái tim ở giữa.
 * Dùng nhất quán giữa các section để tạo nhịp thị giác.
 */
export const OrnamentalDivider = ({ className = "", tone = "gold" }) => {
  const line =
    tone === "light"
      ? "bg-gradient-to-r from-transparent to-white/40"
      : "bg-gradient-to-r from-transparent to-wedding-gold/70";
  const heart = tone === "light" ? "text-amber-200/80" : "text-wedding-rose";

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.15 }}
      className={`flex items-center justify-center gap-4 ${className}`}
    >
      <motion.span
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`h-px w-12 md:w-20 origin-right ${line}`}
      />
      <motion.span
        variants={{
          hidden: { scale: 0, rotate: -30 },
          show: { scale: 1, rotate: 0 },
        }}
        transition={{ type: "spring", stiffness: 260, damping: 14 }}
      >
        <Heart size={16} className={`${heart} fill-current`} />
      </motion.span>
      <motion.span
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`h-px w-12 md:w-20 origin-left ${line} rotate-180`}
      />
    </motion.div>
  );
};

/**
 * Hiện chữ theo từng từ: blur-up + trượt lên, so le mượt (cinematic reveal).
 */
export const RevealWords = ({
  text,
  className = "",
  wordClassName = "",
  stagger = 0.09,
}) => {
  const words = String(text).split(" ");
  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: stagger, delayChildren: 0.05 }}
      className={`inline-flex flex-wrap justify-center gap-x-[0.28em] ${className}`}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          className={`inline-block ${wordClassName}`}
          variants={{
            hidden: { opacity: 0, y: "0.5em", filter: "blur(8px)" },
            show: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
};

/**
 * Tiêu đề section chuẩn: eyebrow (nhãn nhỏ) + tiêu đề + mô tả + divider.
 * @param {"cursive"|"serif"} variant - kiểu chữ tiêu đề chính.
 * @param {"dark"|"light"} tone - dùng trên nền sáng hay nền tối.
 */
export const SectionHeading = ({
  eyebrow,
  title,
  description,
  variant = "cursive",
  tone = "dark",
  className = "",
}) => {
  const titleColor =
    tone === "light"
      ? "text-amber-100"
      : variant === "cursive"
      ? "text-wedding-gold"
      : "text-wedding-ink";
  const descColor = tone === "light" ? "text-white/60" : "text-stone-500";
  const titleFont =
    variant === "cursive"
      ? "font-cursive text-4xl md:text-6xl leading-[1.15]"
      : "font-serif font-semibold text-3xl md:text-5xl tracking-wide";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`text-center ${className}`}
    >
      {eyebrow && (
        <p
          className={`eyebrow mb-4 ${
            tone === "light" ? "!text-wedding-champagne" : ""
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2 className={`${titleFont} ${titleColor}`}>
        {typeof title === "string" ? <RevealWords text={title} /> : title}
      </h2>
      {description && (
        <p
          className={`mt-4 mx-auto max-w-xl text-base md:text-lg italic font-serif leading-relaxed ${descColor}`}
        >
          {description}
        </p>
      )}
      <OrnamentalDivider
        className="mt-7"
        tone={tone === "light" ? "light" : "gold"}
      />
    </motion.div>
  );
};

export default SectionHeading;
