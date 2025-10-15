export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  typescript: {
    typeCheck: false,
    shim: false,
    strict: false
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL || 'https://borovy-backend4.vercel.app/api'
    }
  },
  modules: [
    '@pinia/nuxt'
  ],
  imports: {
    dirs: ['./stores']
  },
  app: {
    head: {
      title: 'Borovy App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})