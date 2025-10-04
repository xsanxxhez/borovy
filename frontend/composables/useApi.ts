// composables/useApi.ts
export const useApi = () => {
const authStore = useAuthStore()

return $fetch.create({
    baseURL: 'http://localhost:3001/api',
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