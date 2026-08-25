/**
 * Nhành lá trang trí góc (SVG line-art). Màu theo `currentColor`.
 * Dùng ở góc các thẻ trang trọng để tạo cảm giác thiệp in cao cấp.
 */
export const CornerFlourish = ({ className = "", size = 72 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
      {/* thân cong */}
      <path d="M6 74 C 26 62, 44 44, 56 14" strokeOpacity="0.9" />
      {/* các lá */}
      <path
        d="M18 60 C 9 57, 6 48, 12 43 C 20 47, 23 55, 18 60 Z"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <path
        d="M31 45 C 22 43, 18 34, 24 28 C 33 33, 36 41, 31 45 Z"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <path
        d="M44 28 C 37 24, 35 16, 41 11 C 49 16, 50 24, 44 28 Z"
        fill="currentColor"
        fillOpacity="0.14"
      />
      {/* nụ tròn đầu nhành */}
      <circle cx="57" cy="11" r="2.4" fill="currentColor" fillOpacity="0.5" />
    </g>
  </svg>
);

export default CornerFlourish;
