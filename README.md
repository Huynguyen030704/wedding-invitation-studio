<div align="center">

# 💌 Wedding Invitation Studio

### Thiệp cưới điện tử cao cấp — kèm hệ thống quản lý xác nhận tham dự (RSVP) thời gian thực

_Một lời mời trang trọng, tinh tế và giàu cảm xúc cho ngày trọng đại của **Huy & Trinh**._

<br/>

[![Xem trực tiếp](https://img.shields.io/badge/🌐_Xem_trực_tiếp-B4975A?style=for-the-badge)](https://huynguyen030704.github.io/wedding-invitation-studio/)

<br/>

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Rolldown-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant_Design-6-0170FE?style=flat-square&logo=antdesign&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat-square&logo=framer&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-222?style=flat-square&logo=github&logoColor=white)

</div>

---

## 📖 Giới thiệu

**Wedding Invitation Studio** là một website thiệp cưới đơn trang (SPA) được thiết kế theo phong cách **_Luxury Editorial_** — sang trọng, thanh lịch và nhất quán. Trang không chỉ để "xem", mà còn:

- Cho khách mời **xác nhận tham dự** và **gửi lời chúc** ngay trên thiệp.
- Cung cấp một **bảng điều khiển riêng** để chủ nhân theo dõi danh sách khách mời **theo thời gian thực**.
- Tách riêng hai đường link cho **Nhà Trai** (Lễ Tân Hôn) và **Nhà Gái** (Lễ Vu Quy).

---

## ✨ Tính năng nổi bật

<table>
<tr>
<td width="33%" valign="top">

#### 🎀 Trải nghiệm khách mời
- Hiệu ứng **mở thiệp** như kéo rèm
- **Đếm ngược** đến ngày trọng đại
- **Album ảnh** dạng masonry
- **Nhạc nền** bật/tắt tuỳ ý
- **Bản đồ** & nút "Lưu vào lịch" (.ics)
- Hộp **mừng cưới** QR (tuỳ chọn)

</td>
<td width="33%" valign="top">

#### 💎 Hiệu ứng cao cấp
- Chữ **ánh kim** (gilded shimmer)
- **Bụi vàng** bokeh & vignette
- **Parallax** ảnh hero khi cuộn
- Tiêu đề hiện **từng chữ**
- **Preloader** + monogram H&T
- Tôn trọng `prefers-reduced-motion`

</td>
<td width="33%" valign="top">

#### 📊 Quản trị RSVP
- Đồng bộ **thời gian thực** (Supabase Realtime)
- **Thống kê** khách dự tiệc / lời chúc
- **Tìm kiếm & lọc** khách mời
- Phân biệt **Nhà Trai / Nhà Gái**
- Giao diện **responsive** (bảng ⇄ thẻ)

</td>
</tr>
</table>

---

## 🛠️ Công nghệ sử dụng

| Nhóm | Công nghệ |
|------|-----------|
| **Framework / Build** | React 19, Vite (rolldown-vite) |
| **Giao diện** | Ant Design 6, Tailwind CSS 4 |
| **Hiệu ứng** | Framer Motion, canvas-confetti |
| **Icon** | Lucide React |
| **Cơ sở dữ liệu** | Supabase (PostgreSQL + Realtime) |
| **Thông báo** | SweetAlert2 |
| **Xử lý ảnh (build)** | Sharp |
| **Triển khai** | GitHub Pages + GitHub Actions |

---

## 📁 Cấu trúc dự án

```text
wedding-invitation-studio/
├─ .github/workflows/
│  ├─ deploy.yml                  # Build & deploy GitHub Pages khi push nhánh main
│  └─ keep-supabase-alive.yml     # Cron ping giữ Supabase không bị tạm dừng
└─ wedding-invitation/            # Ứng dụng React (Vite) — thư mục gốc để chạy lệnh
   ├─ public/
   │  ├─ images/                  # Ảnh cưới
   │  ├─ music/                   # Nhạc nền
   │  └─ favicon.svg              # Monogram "H&T"
   └─ src/
      ├─ pages/
      │  ├─ Invitation.jsx        # ⭐ Trang thiệp chính (cấu hình cô dâu/chú rể ở đây)
      │  └─ RSVPList.jsx          # Dashboard quản lý RSVP (realtime)
      ├─ components/
      │  ├─ Ornaments.jsx         # SectionHeading, OrnamentalDivider, RevealWords
      │  ├─ Monogram.jsx / Preloader.jsx / ScrollProgress.jsx / GoldenDust.jsx / Flourish.jsx
      │  ├─ WeddingGallery.jsx / WishesSection.jsx / GiftSection.jsx / FloatingPetals.jsx
      ├─ lib/
      │  ├─ supabaseClient.js     # Khởi tạo Supabase
      │  ├─ formTheme.js          # Theme antd dùng chung cho form
      │  └─ calendar.js           # Sinh file .ics "Lưu vào lịch"
      ├─ App.jsx / main.jsx / index.css
```

---

## 🚀 Bắt đầu

> **Yêu cầu:** Node.js ≥ 20 và [pnpm](https://pnpm.io/).

```bash
# 1. Clone dự án
git clone https://github.com/Huynguyen030704/wedding-invitation-studio.git

# 2. Vào thư mục ứng dụng
cd wedding-invitation-studio/wedding-invitation

# 3. Cài đặt phụ thuộc
pnpm install

# 4. Chạy môi trường phát triển
pnpm dev
```

Mở trình duyệt tại địa chỉ Vite in ra (mặc định `http://localhost:5173/wedding-invitation-studio/`).

---

## 🔑 Biến môi trường

Tạo file `.env` trong thư mục `wedding-invitation/`:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

> Nếu để trống, ứng dụng vẫn chạy ở **chế độ offline** (dùng dữ liệu mẫu) mà không lỗi.

---

## 🗄️ Cấu hình Supabase

Tạo dự án tại [supabase.com](https://supabase.com), mở **SQL Editor** và chạy:

```sql
-- Bảng lưu xác nhận tham dự & lời chúc
create table rsvps (
  id          bigint generated by default as identity primary key,
  full_name   text not null,
  guest_count text not null,           -- "1" | "2" | "3" | "family" | "0" (chỉ gửi lời chúc)
  guest_of    text not null,           -- "groom" (Nhà Trai) | "bride" (Nhà Gái)
  wishes      text,                    -- Lời chúc (có thể trống)
  type        text,                    -- "Vu Quy" | "Tân Hôn" | "Lễ Cưới"
  created_at  timestamptz default now()
);

-- Bật Row Level Security + policy cho phép công khai
alter table rsvps enable row level security;
create policy "Allow public insert" on rsvps for insert with check (true);
create policy "Allow public select" on rsvps for select using (true);
```

> **Quan trọng:** Bật **Realtime** cho bảng `rsvps` (Table Editor → biểu tượng realtime) để bảng quản lý cập nhật tức thời.

---

## 🌐 Định tuyến

Ứng dụng dùng `HashRouter`, các đường dẫn có dạng `.../#/<route>`:

| Đường dẫn | Trang | Dành cho |
|-----------|-------|----------|
| `/#/vu-quy` | Lễ Vu Quy | Khách **Nhà Gái** |
| `/#/tan-hon` | Lễ Tân Hôn | Khách **Nhà Trai** |
| `/#/rsvp-list` | Bảng quản lý RSVP | Chủ nhân (nội bộ) |
| `/` | — | Tự chuyển hướng về `/#/vu-quy` |

---

## ☁️ Triển khai (GitHub Pages)

Dự án đã cấu hình sẵn CI/CD:

1. Vào **Settings → Secrets and variables → Actions**, thêm 2 secret:
   `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`.
2. Vào **Settings → Pages**, đặt **Source = GitHub Actions**.
3. **Push lên nhánh `main`** → workflow [`deploy.yml`](.github/workflows/deploy.yml) tự build và phát hành.

### 🔄 Giữ Supabase luôn "sống"

Gói Supabase miễn phí sẽ **tạm dừng dự án sau 7 ngày không hoạt động**. Workflow [`keep-supabase-alive.yml`](.github/workflows/keep-supabase-alive.yml) chạy **cron mỗi 3 ngày**, ping nhẹ tới Supabase để reset đồng hồ này — dự án không bao giờ bị pause. Có thể bấm **Run workflow** để chạy thử bất cứ lúc nào.

---

## 🎁 Tuỳ biến nhanh

| Muốn đổi | Sửa ở |
|----------|-------|
| Tên, ngày, giờ, địa chỉ, bản đồ, đại diện gia đình | `src/pages/Invitation.jsx` — object `config`, `isName`, `isFullName` |
| Số tài khoản mừng cưới + hiện Hộp Mừng Cưới | `src/components/GiftSection.jsx` (`giftAccounts`) rồi bỏ comment `<GiftSection />` trong `Invitation.jsx` |
| Ảnh album | `src/components/WeddingGallery.jsx` (`galleryImages`) + thả ảnh vào `public/images/` |
| Nhạc nền | Thay file trong `public/music/` |
| Màu / font chủ đạo | `src/index.css` (`@theme` — token màu & font) |

---

## 📜 Lệnh có sẵn

| Lệnh | Chức năng |
|------|-----------|
| `pnpm dev` | Chạy môi trường phát triển (HMR) |
| `pnpm build` | Build bản production vào `dist/` |
| `pnpm preview` | Xem thử bản production đã build |
| `pnpm lint` | Kiểm tra ESLint |

---

<div align="center">

**Made with ❤️ for Huy & Trinh**

_29.09.2026 (Nhà Gái) · 30.09.2026 (Nhà Trai)_

</div>
