import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monogram } from "./Monogram";

/**
 * Màn chờ tải sang trọng: monogram + thanh sáng chạy, tự ẩn khi trang tải xong
 * (hoặc tối đa 3.2s để không kẹt).
 */
export default function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let t;
    const hide = () => {
      t = setTimeout(() => setShow(false), 600); // giữ tối thiểu cho mượt
    };
    if (document.readyState === "complete") {
      hide();
    } else {
      window.addEventListener("load", hide, { once: true });
    }
    const max = setTimeout(() => setShow(false), 3200); // chốt chặn
    return () => {
      clearTimeout(t);
      clearTimeout(max);
      window.removeEventListener("load", hide);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[11000] flex flex-col items-center justify-center bg-wedding-charcoal"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Monogram size={112} />
          </motion.div>
          <p className="mt-6 eyebrow !text-wedding-champagne">Huy &amp; Trinh</p>
          <div className="mt-5 h-px w-40 overflow-hidden bg-white/10">
            <motion.div
              className="h-full w-1/2 bg-gradient-to-r from-transparent via-wedding-gold to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "300%" }}
              transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
