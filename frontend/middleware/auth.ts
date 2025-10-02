export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // Если пользователь не авторизован - редирект на логин
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
