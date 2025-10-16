export const useApi = () => {
const authStore = useAuthStore()

// Явно указываем правильный URL
const baseURL = 'https://borovy-backend.onrender.com/api'
console.log('🚀 API Base URL initialized:', baseURL)

  const apiFetch = $fetch.create({
    baseURL,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    onRequest({ options }) {
      console.log('📤 API Request:', {
        method: options.method,
        url: options.url,
        fullUrl: baseURL + options.url
      })

      // Добавляем токен авторизации если есть
      if (authStore.token) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${authStore.token}`
        }
        console.log('🔐 Added auth token')
      }
    },
    onResponse({ response }) {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.url
      })
    },
    onResponseError({ response }) {
      console.error('❌ API Error:', {
        status: response.status,
        url: response.url,
        statusText: response.statusText
      })

      // Обработка ошибок авторизации
      if (response.status === 401) {
        console.log('🔒 Unauthorized, logging out...')
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