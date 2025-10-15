export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL || 'https://borovy.vercel.app/api'
    }
  }
})