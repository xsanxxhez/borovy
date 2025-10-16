// composables/useApi.ts
export const useApi = () => {
const authStore = useAuthStore()

const baseURL = 'https://borovy-backend4.vercel.app/api'

const apiFetch = $fetch.create({
baseURL,
credentials: 'include',
headers: {
'Content-Type': 'application/json',
},
onRequest({ options }) {
      // Добавляем токен авторизации если есть
      if (authStore.token) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${authStore.token}`
        }
      }
    },
    onResponseError({ response }) {
      // Обработка ошибок авторизации
      if (response.status === 401) {
        authStore.logout()
        navigateTo('/login')
      }
    }
  })

  return {
    apiFetch,
    baseURL
  }
}