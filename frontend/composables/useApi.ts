export const useApi = () => {
const authStore = useAuthStore()

const baseURL = 'https://borovy-backend4.vercel.app/api'

const apiFetch = (url: string, options: any = {}) => {
const headers = {
'Content-Type': 'application/json',
...options.headers,
}

// Добавляем токен авторизации если есть
if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }

    return $fetch(url, {
      baseURL,
      ...options,
      headers,
      credentials: 'include',
      onResponseError({ error }) {
        console.error('API Error:', error)

        // Обработка ошибок авторизации
        if (error.status === 401) {
          authStore.logout()
          navigateTo('/login')
        }
      }
    })
  }

  // Для загрузки файлов
  const uploadFile = async (file: File, endpoint: string = '/upload/avatar') => {
    const formData = new FormData()
    formData.append('file', file)

    const headers: any = {}
    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }

    return $fetch(endpoint, {
      baseURL,
      method: 'POST',
      body: formData,
      headers
    })
  }

  return {
    apiFetch,
    uploadFile,
    baseURL
  }
}