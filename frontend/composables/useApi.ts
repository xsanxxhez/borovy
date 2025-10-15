// composables/useApi.ts
export const useApi = () => {
const authStore = useAuthStore()

return $fetch.create({
    baseURL: 'https://borovy-backend4.vercel.app/api',
    headers: {
      'Content-Type': 'application/json',
    },
    onRequest({ options }) {
      if (authStore.token) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${authStore.token}`
        }
      }
    },
    onResponseError({ error }) {
      console.error('API Error:', error)
    }
  })
}