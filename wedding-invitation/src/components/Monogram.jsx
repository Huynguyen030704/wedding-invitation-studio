/**
 * Monogram "H&T" — dấu nhận diện dùng ở preloader, bìa, footer.
 * Vòng vàng kép + hai chữ cái cursive, & màu hồng blush ở giữa.
 */
export const Monogram = ({ size = 96, className = "", tone = "gold" }) => {
  const ring = tone === "light" ? "border-white/70" : "border-wedding-gold/70";
  const ringInner =
    tone === "light" ? "border-white/30" : "border-wedding-gold/30";
  const letters = tone === "light" ? "text-white" : "text-wedding-gold";

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-label="Huy và Trinh"
    >
      <span className={`absolute inset-0 rounded-full border ${ring}`} />
      <span className={`absolute inset-[6px] rounded-full border ${ringInner}`} />
      <span
        className={`font-cursive leading-none flex items-baseline ${letters}`}
        style={{ fontSize: size * 0.4 }}
      >
        H
        <span
          className="text-wedding-rose mx-[0.02em]"
          style={{ fontSize: size * 0.28 }}
        >
          &
        </span>
        T
      </span>
    </div>
  );
};

export default Monogram;
