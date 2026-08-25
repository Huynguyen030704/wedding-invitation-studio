import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/wedding-invitation-studio/",
  server: { host: true, port: Number(process.env.PORT) || 5173 },
  plugins: [react()],
});
