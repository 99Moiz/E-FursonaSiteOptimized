import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import { imageCacheControlPlugin } from "./vite-plugin-image-cache";

export default defineConfig({
  plugins: [
    react(),
    imageCacheControlPlugin(),
    // Service worker: after the first visit, JS/CSS/fonts/images are served
    // from the cache instantly and only re-fetched in the background when
    // they change — this is what makes the *second* (and every later) load
    // fast, not just the first one.
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["logo.jpg", "placeholder.svg"],
      manifest: false,
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,woff,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-stylesheets" },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: { maxEntries: 12, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
              // Cross-origin images (wsrv.nl-proxied uploads) come back as
              // opaque (status 0) responses since that origin doesn't send
              // CORS headers. Workbox's cacheableResponse plugin only
              // caches status 200 by default, silently skipping opaque
              // responses — which was most of the images this rule exists
              // for. Explicitly allowing status 0 fixes that.
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Video is intentionally NOT in globPatterns above (it's ~1.6MB
            // and only the welcome video), so it never blocks the initial
            // service-worker install. It's cached on-demand instead, the
            // first time someone actually presses play.
            urlPattern: ({ request }) => request.destination === "video",
            handler: "CacheFirst",
            options: {
              cacheName: "video",
              expiration: { maxEntries: 4, maxAgeSeconds: 60 * 60 * 24 * 30 },
              rangeRequests: true,
            },
          },
        ],
      },
    }),
  ],
  server: {
    host: "::",
    port: 8081,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssMinify: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        // Split vendor code into its own long-lived chunk — it changes far
        // less often than app code, so repeat visits can serve it straight
        // from the browser's HTTP cache after the very first load.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("framer-motion")) return "vendor-motion";
          if (id.includes("@radix-ui") || id.includes("vaul") || id.includes("cmdk")) return "vendor-ui";
          if (id.includes("recharts") || id.includes("embla-carousel")) return "vendor-media";
          // React itself is left to Rollup's default handling (bundled with
          // the entry chunk) to avoid a circular chunk between it and other
          // vendor code that imports it.
        },
      },
    },
  },
});
