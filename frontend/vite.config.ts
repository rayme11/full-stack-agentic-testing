import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      // Proxy /api calls to the backend during development
      // WHY: This avoids CORS issues in dev by making the browser think
      // all requests come from the same origin (localhost:5173).
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
