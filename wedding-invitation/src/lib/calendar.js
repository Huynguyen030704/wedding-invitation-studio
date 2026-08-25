/**
 * Tạo & tải file .ics để khách lưu sự kiện vào lịch (Google/Apple/Outlook).
 * Dùng giờ địa phương Asia/Ho_Chi_Minh, mặc định lễ kéo dài 3 giờ.
 */
const fmt = (date) => {
  const p = (n) => String(n).padStart(2, "0");
  return (
    date.getFullYear() +
    p(date.getMonth() + 1) +
    p(date.getDate()) +
    "T" +
    p(date.getHours()) +
    p(date.getMinutes()) +
    "00"
  );
};

export const downloadICS = ({ title, start, address, description = "" }) => {
  const startDate = new Date(start);
  const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

  const esc = (s) =>
    String(s).replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Huy & Trinh Wedding//VI",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${fmt(startDate)}-huytrinh@wedding`,
    `DTSTART;TZID=Asia/Ho_Chi_Minh:${fmt(startDate)}`,
    `DTEND;TZID=Asia/Ho_Chi_Minh:${fmt(endDate)}`,
    `SUMMARY:${esc(title)}`,
    `LOCATION:${esc(address)}`,
    `DESCRIPTION:${esc(description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lines.join("\r\n")], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "le-cuoi-huy-trinh.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
