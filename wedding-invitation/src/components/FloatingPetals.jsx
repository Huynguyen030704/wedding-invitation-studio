import React, { memo } from "react";

// Bọc memo ở đây
const FloatingPetals = memo(() => {
  const petals = Array.from({ length: 30 });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[9999]">
      {petals.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = 7 + Math.random() * 8;
        const size = 10 + Math.random() * 15;

        return (
          <div
            key={i}
            className="absolute top-[-5%] animate-petal-fall"
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          >
            <div
              className="animate-petal-sway bg-rose-200/60 rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: "100% 0% 100% 100% / 100% 0% 100% 100%",
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
});

export default FloatingPetals;
