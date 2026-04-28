import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import rulect from "@rulect/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), rulect()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
