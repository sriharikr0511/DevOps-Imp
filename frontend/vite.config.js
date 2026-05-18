import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/tasks": "http://backend:5000",
      "/health": "http://backend:5000",
    },
  },
});
