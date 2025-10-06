[file name]: default.vue
[file content begin]
<template>
  <div>
    <!-- Десктопная навигация -->
    <nav v-if="authStore.isAuthenticated && !isMobile" class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <nuxt-link to="/">
            <h2>BOROVY</h2>
          </nuxt-link>
        </div>

        <div class="nav-links">
          <!-- Навигация для Админа -->
          <template v-if="authStore.isAdmin">
            <nuxt-link to="/admin" class="nav-link">Панель управления</nuxt-link>
          </template>

          <!-- Навигация для Слона -->
          <template v-else-if="authStore.isSlon">
            <nuxt-link to="/slon" class="nav-link">Дашборд</nuxt-link>
          </template>

          <!-- Навигация для Борова -->
          <template v-else-if="authStore.isBorov">
            <nuxt-link to="/borov" class="nav-link">Главная</nuxt-link>
            <nuxt-link to="/borov/history" class="nav-link">История</nuxt-link>
            <nuxt-link to="/borov/profile" class="nav-link">Профиль</nuxt-link>
          </template>
        </div>

        <div class="nav-user">
          <span class="user-greeting">{{ getUserGreeting() }}</span>
          <button @click="handleLogout" class="btn-logout">
            Выйти
          </button>
        </div>
      </div>
    </nav>

    <!-- Мобильная навигация -->
    <div v-if="authStore.isAuthenticated && isMobile" class="mobile-nav">
      <div class="mobile-nav-header">
        <div class="nav-brand">
          <h2>BOROVY</h2>
        </div>
        <button @click="toggleMobileMenu" class="menu-toggle">
          ☰
        </button>
      </div>

      <!-- Боковое меню -->
      <div v-if="mobileMenuOpen" class="mobile-sidebar">
        <div class="sidebar-overlay" @click="toggleMobileMenu"></div>
        <div class="sidebar-content">
          <div class="sidebar-header">
            <h3>{{ getUserGreeting() }}</h3>
            <button @click="toggleMobileMenu" class="close-btn">✕</button>
          </div>

          <div class="sidebar-links">
            <!-- Навигация для Админа -->
            <template v-if="authStore.isAdmin">
              <nuxt-link to="/admin" class="sidebar-link" @click="toggleMobileMenu">
                <span class="link-icon">👑</span>
                Панель управления
              </nuxt-link>
            </template>

            <!-- Навигация для Слона -->
            <template v-else-if="authStore.isSlon">
              <nuxt-link to="/slon" class="sidebar-link" @click="toggleMobileMenu">
                <span class="link-icon">🐘</span>
                Дашборд
              </nuxt-link>
            </template>

            <!-- Навигация для Борова -->
            <template v-else-if="authStore.isBorov">
              <nuxt-link to="/borov" class="sidebar-link" @click="toggleMobileMenu">
                <span class="link-icon">🏠</span>
                Главная
              </nuxt-link>
              <nuxt-link to="/borov/history" class="sidebar-link" @click="toggleMobileMenu">
                <span class="link-icon">📊</span>
                История работ
              </nuxt-link>
              <nuxt-link to="/borov/profile" class="sidebar-link" @click="toggleMobileMenu">
                <span class="link-icon">👤</span>
                Профиль
              </nuxt-link>
            </template>
          </div>

          <div class="sidebar-footer">
            <button @click="handleLogout" class="btn-logout-full">
              Выйти из системы
            </button>
          </div>
        </div>
      </div>

      <!-- Нижний бар ТОЛЬКО для БОРОВА -->
      <div v-if="authStore.isBorov" class="mobile-bottom-bar">
        <nuxt-link to="/borov" class="bottom-bar-item">
          <span class="item-icon">🏠</span>
          <span class="item-label">Главная</span>
        </nuxt-link>
        <nuxt-link to="/borov/history" class="bottom-bar-item">
          <span class="item-icon">📊</span>
          <span class="item-label">История</span>
        </nuxt-link>
        <nuxt-link to="/borov/profile" class="bottom-bar-item">
          <span class="item-icon">👤</span>
          <span class="item-label">Профиль</span>
        </nuxt-link>
      </div>
    </div>

    <!-- Основной контент -->
    <main :class="{
      'mobile-layout': isMobile && authStore.isBorov,
      'admin-mobile-layout': isMobile && authStore.isAdmin,
      'slon-mobile-layout': isMobile && authStore.isSlon
    }">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

const isMobile = ref(false)
const mobileMenuOpen = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const getUserGreeting = () => {
  const role = authStore.userRole
  const name = authStore.user?.display_name || ''

  const greetings: any = {
    admin: `Админ ${name}`,
    slon: `Слон ${name}`,
    borov: `Боров ${name}`
  }

  return greetings[role] || name
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
/* Десктопная навигация */
.navbar {
  background: #1a1a1a;
  border-bottom: 3px solid #d4af37;
  padding: 0;
  margin-bottom: 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.nav-brand h2 {
  margin: 0;
  color: #d4af37;
  font-weight: 800;
  font-size: 1.8rem;
  letter-spacing: 2px;
}

.nav-brand a {
  text-decoration: none;
  color: inherit;
}

.nav-links {
  display: flex;
  gap: 0;
}

.nav-link {
  text-decoration: none;
  color: #e0e0e0;
  font-weight: 600;
  padding: 25px 30px;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
}

.nav-link:hover {
  background: #2a2a2a;
  color: #d4af37;
  border-bottom-color: #d4af37;
}

.nav-link.router-link-active {
  background: #2a2a2a;
  color: #d4af37;
  border-bottom-color: #d4af37;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-greeting {
  color: #e0e0e0;
  font-weight: 500;
}

.btn-logout {
  background: transparent;
  border: 2px solid #d4af37;
  color: #d4af37;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

.btn-logout:hover {
  background: #d4af37;
  color: #1a1a1a;
}

/* Мобильная навигация */
.mobile-nav {
  background: #1a1a1a;
  border-bottom: 3px solid #d4af37;
}

.mobile-nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  height: 70px;
}

.menu-toggle {
  background: none;
  border: none;
  color: #d4af37;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 10px;
}

/* Боковое меню */
.mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.sidebar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
}

.sidebar-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  background: #1a1a1a;
  border-left: 3px solid #d4af37;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 20px;
  border-bottom: 1px solid #333;
}

.sidebar-header h3 {
  margin: 0;
  color: #d4af37;
  font-size: 1.1rem;
}

.close-btn {
  background: none;
  border: none;
  color: #e0e0e0;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
}

.sidebar-links {
  flex: 1;
  padding: 20px 0;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px 25px;
  color: #e0e0e0;
  text-decoration: none;
  border-bottom: 1px solid #2a2a2a;
  transition: all 0.3s ease;
  font-weight: 500;
}

.sidebar-link:hover {
  background: #2a2a2a;
  color: #d4af37;
}

.sidebar-link.router-link-active {
  background: #2a2a2a;
  color: #d4af37;
  border-right: 3px solid #d4af37;
}

.link-icon {
  font-size: 1.2rem;
  width: 25px;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #333;
}

.btn-logout-full {
  width: 100%;
  background: transparent;
  border: 2px solid #d4af37;
  color: #d4af37;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-logout-full:hover {
  background: #d4af37;
  color: #1a1a1a;
}

/* Нижний бар ТОЛЬКО для Борова */
.mobile-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #1a1a1a;
  border-top: 2px solid #d4af37;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  z-index: 999;
}

.bottom-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #e0e0e0;
  padding: 8px 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  flex: 1;
  max-width: 100px;
}

.bottom-bar-item:hover {
  background: #2a2a2a;
  color: #d4af37;
}

.bottom-bar-item.router-link-active {
  color: #d4af37;
  background: #2a2a2a;
}

.item-icon {
  font-size: 1.2rem;
  margin-bottom: 4px;
}

.item-label {
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Основной контент */
main {
  min-height: calc(100vh - 70px);
  background: #0f0f0f;
}

/* Мобильные отступы для разных ролей */
main.mobile-layout {
  min-height: calc(100vh - 140px); /* Учитываем верхнюю и нижнюю панели */
  padding-bottom: 70px; /* Место для нижнего бара Борова */
}

main.admin-mobile-layout {
  min-height: calc(100vh - 70px); /* Только верхняя панель */
}

main.slon-mobile-layout {
  min-height: calc(100vh - 70px); /* Только верхняя панель */
}

/* Адаптивность */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 15px;
  }

  .nav-link {
    padding: 20px 15px;
    font-size: 0.8rem;
  }
}
</style>
[file content end]