import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import {
  SITE_OG_IMAGE_URL,
  SITE_STRUCTURED_DATA,
  SITE_URL,
} from "./seo.config.mjs";

const structuredData = JSON.stringify(SITE_STRUCTURED_DATA).replaceAll("<", "\\u003c");

export default defineConfig({
  root: "static",
  base: "/iceinn/",
  publicDir: "../public",
  plugins: [
    {
      name: "inject-seo-constants",
      transformIndexHtml(html) {
        return html
          .replaceAll("__SITE_URL__", SITE_URL)
          .replaceAll("__SITE_OG_IMAGE_URL__", SITE_OG_IMAGE_URL)
          .replace("__SITE_STRUCTURED_DATA__", structuredData);
      },
    },
    react(),
  ],
  build: {
    outDir: "../dist-pages",
    emptyOutDir: true,
  },
});
