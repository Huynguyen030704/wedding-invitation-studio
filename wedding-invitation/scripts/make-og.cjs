// Tạo ảnh OG (social preview) 1200x630 từ ảnh cưới: crop ngang + phủ tối + chữ.
// Sinh 3 ảnh: chung (Lễ Thành Hôn) + Nhà Gái (Lễ Vu Quy) + Nhà Trai (Lễ Tân Hôn).
const sharp = require("sharp");
const path = require("path");

const dir = path.join(__dirname, "..", "public", "images");
const src = path.join(dir, "133A1281.JPG");
const W = 1200;
const H = 630;

const VARIANTS = [
  { file: "og-cover.jpg", eyebrow: "LỄ THÀNH HÔN", date: "29 &amp; 30 . 09 . 2026" },
  { file: "og-vu-quy.jpg", eyebrow: "LỄ VU QUY", date: "29 . 09 . 2026" },
  { file: "og-tan-hon.jpg", eyebrow: "LỄ TÂN HÔN", date: "30 . 09 . 2026" },
];

const svg = ({ eyebrow, date }) =>
  Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0.35"/>
      <stop offset="50%" stop-color="#000" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.78"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <text x="${W / 2}" y="${H - 168}" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-size="30"
        letter-spacing="10" fill="#e7d6b4">${eyebrow}</text>
  <text x="${W / 2}" y="${H - 96}" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-style="italic"
        font-weight="700" font-size="78" fill="#f5ecd6">Huy &amp; Trinh</text>
  <text x="${W / 2}" y="${H - 48}" text-anchor="middle"
        font-family="Georgia, serif" font-size="25" letter-spacing="6"
        fill="#ffffff">${date}</text>
</svg>`);

(async () => {
  for (const v of VARIANTS) {
    const info = await sharp(src)
      .resize(W, H, { fit: "cover", position: "attention" })
      .composite([{ input: svg(v) }])
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(dir, v.file));
    console.log(`✅ ${v.file}`, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
  }
})().catch((e) => {
  console.error("❌ Lỗi:", e.message);
  process.exit(1);
});
