// composables/useApi.ts
export const useApi = () => {
const authStore = useAuthStore()

return $fetch.create({
    baseURL: 'http://localhost:3001/api', // Правильный порт бэкенда
    headers: {
      'Content-Type': 'application/json',
    },
    onRequest({ options }) {
      // Добавляем токен авторизации ко всем запросам
      if (authStore.token) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${authStore.token}`
        }
      }
    }
  })
}