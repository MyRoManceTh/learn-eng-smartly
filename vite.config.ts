import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "pwa-icon-512.png"],
      workbox: {
        navigateFallbackDenylist: [/^\/~oauth/],
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,svg,woff2}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: "English Experience Points",
        short_name: "EngXP",
        description: "เก็บ XP ภาษาอังกฤษทุกวัน ผ่านเรื่องสั้น คำศัพท์ และมินิเกมสนุกๆ",
        theme_color: "#c27a33",
        background_color: "#f5f0e8",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "pwa-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes("node_modules/react-dom")) return "vendor-react";
          if (id.includes("node_modules/react-router")) return "vendor-react";
          if (id.includes("node_modules/react/")) return "vendor-react";
          if (id.includes("node_modules/@tanstack/react-query")) return "vendor-query";
          if (id.includes("node_modules/@radix-ui")) return "vendor-radix";
          if (id.includes("node_modules/recharts") || id.includes("node_modules/d3-")) return "vendor-recharts";
          if (id.includes("node_modules/@supabase")) return "vendor-supabase";
          if (id.includes("node_modules/pixi")) return "vendor-pixi";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
