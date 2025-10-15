export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Публичные маршруты, доступные без авторизации
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/borov/specialties',
    '/borov/specialties/[id]'
  ]

  // Проверяем, является ли текущий маршрут публичным
  const isPublicRoute = publicRoutes.some(route => {
    if (route.includes('[id]')) {
      return to.path.startsWith('/borov/specialties/')
    }
    return to.path === route
  })

  // Если маршрут публичный - разрешаем доступ
  if (isPublicRoute) {
    return
  }

  // Если пользователь не авторизован и пытается получить доступ к защищенному маршруту
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})