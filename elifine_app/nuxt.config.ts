// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // https://github.com/nuxt/nuxt/issues/30461#issuecomment-2572616714
  experimental: { appManifest: false },

  vite: { // this seems to be explicitly needed when in a devcontainer in order for hot reloading to work
    server: {
      watch: {
        usePolling: true,
      },
    },
  },

  modules: ['@nuxt/ui'],
})
