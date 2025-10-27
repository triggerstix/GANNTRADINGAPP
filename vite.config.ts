import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Use import.meta.dirname for ES modules (Node.js 20.11+)
const __dirname = import.meta.dirname;

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "client"),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    port: 5173,
    strictPort: false,
  },
});
