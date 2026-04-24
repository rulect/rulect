import { defineConfig } from "vite";
import path from "node:path";
import rulect from "@rulect/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [rulect()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
