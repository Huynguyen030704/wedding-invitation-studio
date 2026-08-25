import { theme } from "antd";

/**
 * Theme dùng chung cho các Form trên nền tối (RSVP + Lời chúc).
 * Gom về một chỗ để đồng nhất và tránh lặp cấu hình.
 */
export const darkFormTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#b4975a",
    borderRadius: 14,
    controlHeight: 50,
    colorBgContainer: "rgba(255, 255, 255, 0.03)",
    colorBorder: "rgba(255, 255, 255, 0.14)",
    colorTextPlaceholder: "rgba(255, 255, 255, 0.32)",
    colorBgElevated: "#1c1917",
    fontFamily: '"Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif',
  },
  components: {
    Form: {
      itemMarginBottom: 26,
      verticalLabelPadding: "0 0 10px 0",
    },
    Input: {
      activeBorderColor: "#b4975a",
      hoverBorderColor: "#c9ad78",
    },
    Select: {
      optionSelectedBg: "rgba(180, 151, 90, 0.2)",
      activeBorderColor: "#b4975a",
      hoverBorderColor: "#c9ad78",
    },
    Radio: {
      buttonBg: "rgba(255, 255, 255, 0.02)",
      buttonCheckedBg: "#b4975a",
      buttonSolidCheckedBg: "#b4975a",
      colorPrimary: "#b4975a",
      colorText: "#d6d3d1",
    },
  },
};

/** Class dùng chung cho nút submit vàng gradient. */
export const goldButtonClass =
  "btn-shimmer w-full !h-14 border-none rounded-2xl font-sans font-bold tracking-widest uppercase " +
  "text-stone-900 bg-gradient-to-r from-wedding-champagne via-wedding-gold to-wedding-gold-soft " +
  "hover:brightness-110 active:scale-[0.98] transition-all " +
  "flex items-center justify-center gap-2 shadow-[0_12px_28px_-8px_rgba(180,151,90,0.55)] cursor-pointer";
