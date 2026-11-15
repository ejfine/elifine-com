// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
export default defineNuxtConfig({
  compatibilityDate: "2026-06-30",
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: process.env.NODE_ENV !== "test" },
  telemetry: process.env.NODE_ENV !== "test",
  // biome-ignore format: the conditional modules added in by the template make it complicated to format consistently...at least with only 3 'always included' modules
  modules: [
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/content",
    "@vueuse/nuxt",
    "nuxt-og-image",
    "motion-v/nuxt",
    ["@nuxt/eslint", { devOnly: true }],
    ["@nuxt/test-utils/module", { devOnly: true }],
  ],
  css: ["~/assets/css/main.css"],
  content: {
    experimental: {
      sqliteConnector: "native", // Node 22.5+ ships node:sqlite, so better-sqlite3 (and its native build) isn't needed
    },
  },
  ogImage: {
    zeroRuntime: true, // images are rendered at generate time; the site is static so there is no server to render them on request
  },
  prerender: {
    routes: ["/"],
    crawlLinks: true,
  },
  experimental: { appManifest: false }, // https://github.com/nuxt/nuxt/issues/30461#issuecomment-2572616714
  nitro: {
    esbuild: {
      options: {
        target: "es2024", // no specific reason for pinning to this version, but the default for nitro was 2019, so using something a bit more modern
      },
    },
    prerender: {
      concurrency: 1, // lower the concurrency to not be such a memory hog
      interval: 200, // ms pause between batches – lets the Garbage Collector catch up
    },
  },
  vite: {
    server: {
      watch: {
        usePolling: true, // this seems to be explicitly needed when in a devcontainer in order for hot reloading to work
      },
    },
  },
});
