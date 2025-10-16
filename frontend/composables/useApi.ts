export const useApi = () => {
const authStore = useAuthStore()

// Прямой URL к вашему бэкенду на Vercel
const baseURL = 'https://borovy-backend4.vercel.app/api'

const apiFetch = async (url: string, options: any = {}) => {
const headers = {
'Content-Type': 'application/json',
...options.headers,
}

// Добавляем токен авторизации если есть
if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }

    try {
      const response = await $fetch(url, {
        baseURL,
        ...options,
        headers,
        credentials: 'include'
      })
      return response
    } catch (error: any) {
      console.error('API Error:', error)

      // Обработка ошибок авторизации
      if (error?.status === 401) {
        authStore.logout()
        navigateTo('/login')
      }
      throw error
    }
  }

  return {
    apiFetch,
    baseURL
  }
}