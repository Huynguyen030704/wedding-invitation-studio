import { memo, useMemo } from "react";

/**
 * Lớp bụi vàng lấp lánh (bokeh) trôi lên — tạo chiều sâu, mộng mơ sang trọng.
 * Đặt bên trong section `relative overflow-hidden` (đặc biệt trên nền tối).
 */
const GoldenDust = memo(({ count = 16 }) => {
  const dots = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        size: 3 + Math.random() * 5,
        delay: Math.random() * 9,
        duration: 7 + Math.random() * 7,
      })),
    [count],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {dots.map((d, i) => (
        <span
          key={i}
          className="gold-dust absolute rounded-full"
          style={{
            left: `${d.left}%`,
            bottom: "-12px",
            width: `${d.size}px`,
            height: `${d.size}px`,
            background:
              "radial-gradient(circle, rgba(231,214,180,0.95) 0%, rgba(180,151,90,0.55) 42%, transparent 72%)",
            boxShadow: "0 0 7px rgba(231,214,180,0.6)",
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
});

export default GoldenDust;
