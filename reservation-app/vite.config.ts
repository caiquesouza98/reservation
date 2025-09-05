import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    }
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    manifest: true
  },
});
