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
      apiBase: 'https://borovy-backend4.vercel.app/api'
    }
  },
  modules: [
    '@pinia/nuxt'
  ],
  imports: {
    dirs: ['composables', 'stores']
  },
  nitro: {
    preset: 'node-server'
  },
  app: {
    head: {
      title: 'Borovy - Вахтовая платформа',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Профессиональная экосистема для вахтовиков' }
      ]
    }
  }
})