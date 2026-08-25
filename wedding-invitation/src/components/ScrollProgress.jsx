import { motion, useScroll, useSpring } from "framer-motion";

/** Thanh tiến trình cuộn mảnh màu vàng ở đỉnh trang. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 inset-x-0 h-[3px] origin-left z-[9000] bg-gradient-to-r from-wedding-champagne via-wedding-gold to-wedding-rose"
    />
  );
}
