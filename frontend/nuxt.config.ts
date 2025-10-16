export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: 'https://borovy-backend4.vercel.app/api'
    }
  },
  modules: [
    '@pinia/nuxt'
  ],
  imports: {
    dirs: ['composables']
  }
})