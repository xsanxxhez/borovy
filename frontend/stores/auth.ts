import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<any | null>(null)
  const isAuthenticated = ref(false)

  function setAuth(newToken: string, newUser: any) {
    token.value = newToken
    user.value = newUser
    isAuthenticated.value = true
    
    // Сохраняем в localStorage для сохранения сессии
    if (process.client) {
      localStorage.setItem('borovy_token', newToken)
      localStorage.setItem('borovy_user', JSON.stringify(newUser))
    }
  }

  function logout() {
    token.value = null
    user.value = null
    isAuthenticated.value = false
    
    if (process.client) {
      localStorage.removeItem('borovy_token')
      localStorage.removeItem('borovy_user')
    }
  }

  function initializeAuth() {
    if (process.client) {
      try {
        const savedToken = localStorage.getItem('borovy_token')
        const savedUser = localStorage.getItem('borovy_user')
        
        if (savedToken && savedUser) {
          // Безопасный парсинг JSON
          const userData = JSON.parse(savedUser)
          token.value = savedToken
          user.value = userData
          isAuthenticated.value = true
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        // Если ошибка парсинга - очищаем некорректные данные
        localStorage.removeItem('borovy_token')
        localStorage.removeItem('borovy_user')
      }
    }
  }

  const isAdmin = computed(() => user.value?.role === 'admin')
  const isSlon = computed(() => user.value?.role === 'slon')
  const isBorov = computed(() => user.value?.role === 'borov')
  const userRole = computed(() => user.value?.role)

  return {
    token: readonly(token),
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isAdmin,
    isSlon,
    isBorov,
    userRole,
    setAuth,
    logout,
    initializeAuth
  }
})
