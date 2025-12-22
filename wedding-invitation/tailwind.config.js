/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Kiểm tra kỹ dòng này
  ],
  theme: {
    extend: {
      fontFamily: {
        cursive: ['"Great Vibes"', "cursive"],
        serif: ['"Playfair Display"', "serif"],
      },
      colors: {
        "wedding-gold": "#B4975A",
      },
    },
  },
  plugins: [],
};
