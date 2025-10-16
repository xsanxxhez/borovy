export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },

  // Добавьте это для продакшена
  nitro: {
    preset: 'node-server',
    serveStatic: true
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

  app: {
    head: {
      title: 'Borovy - Вахтовая платформа',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})