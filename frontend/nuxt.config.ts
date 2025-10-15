export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL || 'https://borovy-backend3.vercel.app/api'
    }
  }
})