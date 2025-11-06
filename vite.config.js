import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/rawg": {
        target: "https://api.rawg.io/api",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/rawg/, ""),
      },
    },
  },
});
