<template>
  <div>
    <!-- Десктопная навигация -->
    <nav v-if="authStore.isAuthenticated && !isMobile" class="navbar">
      <div class="nav-glow"></div>
      <div class="nav-container">
        <div class="nav-brand">
          <nuxt-link to="/borov" class="brand-link">
            <div class="brand-glow"></div>
            <h2>BOROVY</h2>
            <div class="brand-orbital">
              <div class="orbit"></div>
              <div class="core"></div>
            </div>
          </nuxt-link>
        </div>

        <div class="nav-links">
          <!-- Навигация для Админа -->
          <template v-if="authStore.isAdmin">
            <nuxt-link to="/admin" class="nav-link">
              <span class="link-glow"></span>
              <span class="link-icon">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </span>
              Панель управления
            </nuxt-link>
          </template>

          <!-- Навигация для Слона -->
          <template v-else-if="authStore.isSlon">
            <nuxt-link to="/slon" class="nav-link">
              <span class="link-glow"></span>
              <span class="link-icon">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </span>
              Дашборд
            </nuxt-link>
          </template>

          <!-- Навигация для Борова -->
          <template v-else-if="authStore.isBorov">
            <nuxt-link to="/borov" class="nav-link">
              <span class="link-glow"></span>
              <span class="link-icon">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
              </span>
              Главная
            </nuxt-link>

            <nuxt-link to="/borov/specialties" class="nav-link">
              <span class="link-glow"></span>
              <span class="link-icon">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </span>
              Работа
            </nuxt-link>
            <nuxt-link to="/borov/history" class="nav-link">
              <span class="link-glow"></span>
              <span class="link-icon">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                </svg>
              </span>
              История
            </nuxt-link>
            <nuxt-link to="/borov/profile" class="nav-link">
              <span class="link-glow"></span>
              <span class="link-icon">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </span>
              Профиль
            </nuxt-link>
          </template>
        </div>

        <div class="nav-user">
          <div class="user-avatar">
            <div class="avatar-glow"></div>
            {{ getUserInitials() }}
          </div>
          <span class="user-greeting">{{ getUserGreeting() }}</span>
          <button @click="handleLogout" class="btn-logout">
            <span class="btn-glow"></span>
            <span class="btn-text">Выйти</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Мобильная навигация -->
    <div v-if="authStore.isAuthenticated && isMobile" class="mobile-nav">
      <div class="nav-glow"></div>
      <div class="mobile-nav-header">
        <div class="nav-brand">
          <nuxt-link to="/borov" class="brand-link">
            <h2>BOROVY</h2>
            <div class="brand-pulse"></div>
          </nuxt-link>
        </div>
        <button @click="toggleMobileMenu" class="menu-toggle">
          <span class="menu-icon" :class="{ active: mobileMenuOpen }">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </span>
        </button>
      </div>

      <!-- Боковое меню -->
      <div v-if="mobileMenuOpen" class="mobile-sidebar">
        <div class="sidebar-overlay" @click="toggleMobileMenu"></div>
        <div class="sidebar-content">
          <div class="sidebar-glow"></div>
          <div class="sidebar-header">
            <div class="user-info">
              <div class="user-avatar-mobile">
                <div class="avatar-glow"></div>
                {{ getUserInitials() }}
              </div>
              <div class="user-details">
                <h3>{{ getUserGreeting() }}</h3>
                <p class="user-role">{{ getUserRoleText() }}</p>
              </div>
            </div>
            <button @click="toggleMobileMenu" class="close-btn">
              <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="sidebar-links">
            <!-- Навигация для Админа -->
            <template v-if="authStore.isAdmin">
              <nuxt-link to="/admin" class="sidebar-link" @click="toggleMobileMenu">
                <span class="link-glow"></span>
                <span class="link-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </span>
                <span class="link-text">Панель управления</span>
                <span class="link-arrow">
                  <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </span>
              </nuxt-link>
            </template>

            <!-- Навигация для Слона -->
            <template v-else-if="authStore.isSlon">
              <nuxt-link to="/slon" class="sidebar-link" @click="toggleMobileMenu">
                <span class="link-glow"></span>
                <span class="link-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </span>
                <span class="link-text">Дашборд</span>
                <span class="link-arrow">
                  <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </span>
              </nuxt-link>
            </template>

            <!-- Навигация для Борова -->
            <template v-else-if="authStore.isBorov">
              <nuxt-link to="/borov" class="sidebar-link" @click="toggleMobileMenu">
                <span class="link-glow"></span>
                <span class="link-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                </span>
                <span class="link-text">Главная</span>
                <span class="link-arrow">
                  <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </span>
              </nuxt-link>
              <nuxt-link to="/borov/enterprises" class="sidebar-link" @click="toggleMobileMenu">
                <span class="link-glow"></span>
                <span class="link-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </span>

              </nuxt-link>
              <nuxt-link to="/borov/specialties" class="sidebar-link" @click="toggleMobileMenu">
                <span class="link-glow"></span>
                <span class="link-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </span>
                <span class="link-text">Специальности</span>
                <span class="link-arrow">
                  <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </span>
              </nuxt-link>
              <nuxt-link to="/borov/history" class="sidebar-link" @click="toggleMobileMenu">
                <span class="link-glow"></span>
                <span class="link-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                  </svg>
                </span>
                <span class="link-text">История</span>
                <span class="link-arrow">
                  <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </span>
              </nuxt-link>
              <nuxt-link to="/borov/profile" class="sidebar-link" @click="toggleMobileMenu">
                <span class="link-glow"></span>
                <span class="link-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </span>
                <span class="link-text">Профиль</span>
                <span class="link-arrow">
                  <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </span>
              </nuxt-link>
            </template>
          </div>

          <div class="sidebar-footer">
            <button @click="handleLogout" class="btn-logout-full">
              <span class="btn-glow"></span>
              <span class="btn-text">Выйти из системы</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Основной контент -->
    <main :class="{
      'mobile-layout': isMobile,
      'desktop-layout': !isMobile
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

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const getUserGreeting = () => {
  const role = authStore.userRole
  const name = authStore.user?.display_name || ''

  const greetings: any = {
    admin: `Админ ${name}`,
    slon: `Слон ${name}`,
    borov: ` ${name}`
  }

  return greetings[role] || name
}

const getUserRoleText = () => {
  const role = authStore.userRole
  const roles: any = {
    admin: 'Администратор',
    slon: 'Менеджер',
    borov: 'Работник'
  }
  return roles[role] || 'Пользователь'
}

const getUserInitials = () => {
  const name = authStore.user?.display_name || 'БР'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
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
/* Общие стили для иконок */
.icon {
  width: 20px;
  height: 20px;
  transition: all 0.3s ease;
}

.arrow-icon {
  width: 16px;
  height: 16px;
}

.close-icon {
  width: 24px;
  height: 24px;
}

/* Десктопная навигация */
.navbar {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border-bottom: 3px solid transparent;
  border-image: linear-gradient(90deg, #d4af37, #f4d03f, #d4af37) 1;
  padding: 0;
  margin-bottom: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

.nav-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4af37, #f4d03f, #d4af37, transparent);
  animation: glow-move 3s ease-in-out infinite;
}

@keyframes glow-move {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  position: relative;
  z-index: 2;
}

.nav-brand {
  position: relative;
}

.brand-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  padding: 10px 15px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.brand-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
}

.brand-link:hover .brand-glow {
  opacity: 1;
}

.nav-brand h2 {
  margin: 0;
  color: #d4af37;
  font-weight: 800;
  font-size: 1.8rem;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
}

.brand-link:hover h2 {
  transform: scale(1.05);
}

.brand-orbital {
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orbit {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  animation: orbit-rotate 4s linear infinite;
}

.core {
  width: 6px;
  height: 6px;
  background: #d4af37;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
}

@keyframes orbit-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.nav-links {
  display: flex;
  gap: 0;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: #e0e0e0;
  font-weight: 600;
  padding: 25px 20px;
  border-bottom: 3px solid transparent;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 1px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.link-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
  transition: left 0.6s ease;
}

.nav-link:hover .link-glow {
  left: 100%;
}

.nav-link:hover {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent);
  color: #d4af37;
  border-bottom-color: #d4af37;
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), transparent);
  color: #d4af37;
  border-bottom-color: #d4af37;
}

.nav-link.router-link-active::before {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 3px;
  background: linear-gradient(90deg, #d4af37, #f4d03f);
  border-radius: 2px;
  animation: active-pulse 2s ease-in-out infinite;
}

@keyframes active-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.link-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.nav-link:hover .link-icon {
  transform: scale(1.2) rotate(5deg);
}

.nav-link:hover .icon {
  transform: scale(1.1);
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  font-weight: 700;
  font-size: 0.9rem;
  position: relative;
  transition: all 0.3s ease;
}

.avatar-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.user-avatar:hover .avatar-glow {
  opacity: 1;
}

.user-avatar:hover {
  transform: scale(1.1) rotate(5deg);
}

.user-greeting {
  color: #e0e0e0;
  font-weight: 500;
  font-size: 0.9rem;
}

.btn-logout {
  background: transparent;
  border: 2px solid rgba(212, 175, 55, 0.3);
  color: #d4af37;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
  transition: left 0.6s ease;
}

.btn-logout:hover .btn-glow {
  left: 100%;
}

.btn-logout:hover {
  background: #d4af37;
  color: #1a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
  border-color: #d4af37;
}

/* Мобильная навигация */
.mobile-nav {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border-bottom: 3px solid transparent;
  border-image: linear-gradient(90deg, #d4af37, #f4d03f, #d4af37) 1;
  position: sticky;
  top: 10;
  z-index: 1000;
  backdrop-filter: blur(20px);
  position: relative;
}

.mobile-nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  height: 70px;
  position: relative;
  z-index: 2;
}

.brand-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  background: rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  animation: brand-pulse 2s ease-out infinite;
}

@keyframes brand-pulse {
  0% { width: 0; height: 0; opacity: 1; }
  100% { width: 100px; height: 100px; opacity: 0; }
}

.menu-toggle {
  background: none;
  border: none;
  color: #d4af37;
  cursor: pointer;
  padding: 10px;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.menu-toggle:hover {
  background: rgba(212, 175, 55, 0.1);
  transform: scale(1.1);
}

.menu-icon {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 24px;
  height: 18px;
  position: relative;
  transition: all 0.3s ease;
}

.bar {
  height: 2px;
  background: #d4af37;
  border-radius: 1px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.menu-icon.active .bar:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.menu-icon.active .bar:nth-child(2) {
  opacity: 0;
}

.menu-icon.active .bar:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Боковое меню */
.mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
}

.sidebar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.sidebar-content {
  position: absolute;
  top: 0;
  left: 90px;
  bottom: 0;
  width: 320px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border-left: 3px solid #d4af37;
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: -5px 0 30px rgba(0, 0, 0, 0.5);
}

.sidebar-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #d4af37, #f4d03f, #d4af37);
  animation: glow-move 3s ease-in-out infinite;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 30px 25px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  background: rgba(42, 42, 42, 0.9);
  backdrop-filter: blur(10px);
}

.user-info {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  flex: 1;
}

.user-avatar-mobile {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  font-weight: 700;
  font-size: 1.1rem;
  position: relative;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
}

.user-details h3 {
  margin: 0 0 5px 0;
  color: #d4af37;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.2;
}

.user-role {
  margin: 0;
  color: #9ca3af;
  font-size: 0.85rem;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  color: #e0e0e0;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 10px;
}

.close-btn:hover {
  color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
  transform: rotate(90deg);
}

.sidebar-links {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px 25px;
  color: #e0e0e0;
  text-decoration: none;
  border-bottom: 1px solid rgba(42, 42, 42, 0.5);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.sidebar-link:hover {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent);
  color: #d4af37;
  padding-left: 30px;
}

.sidebar-link.router-link-active {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), transparent);
  color: #d4af37;
  border-right: 3px solid #d4af37;
}

.sidebar-link.router-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #d4af37, #f4d03f);
  animation: active-glow 2s ease-in-out infinite;
}

@keyframes active-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.link-text {
  flex: 1;
  font-size: 1rem;
  font-weight: 500;
}

.link-arrow {
  color: #d4af37;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
}

.sidebar-link:hover .link-arrow {
  transform: translateX(5px);
}

.sidebar-footer {
  padding: 25px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  background: rgba(42, 42, 42, 0.9);
  backdrop-filter: blur(10px);
}

.btn-logout-full {
  width: 100%;
  background: transparent;
  border: 2px solid rgba(212, 175, 55, 0.3);
  color: #d4af37;
  padding: 15px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 0.9rem;
}

.btn-logout-full:hover {
  background: #d4af37;
  color: #1a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
  border-color: #d4af37;
}

/* Основной контент */
main {
  min-height: 100vh;
  background: #0f0f0f;
}

.mobile-layout {
  min-height: calc(100vh - 70px);
}

.desktop-layout {
  min-height: calc(100vh - 70px);
}

/* Адаптивность */
@media (max-width: 480px) {
  .sidebar-content {
    width: 100%;
    max-width: 300px;
  }

  .sidebar-header {
    padding: 25px 20px;
  }

  .user-avatar-mobile {
    width: 45px;
    height: 45px;
    font-size: 1rem;
  }

  .user-details h3 {
    font-size: 1.1rem;
  }

  .sidebar-link {
    padding: 16px 20px;
  }

  .link-text {
    font-size: 0.95rem;
  }
}

@media (max-width: 360px) {
  .mobile-nav-header {
    padding: 15px;
  }

  .nav-brand h2 {
    font-size: 1.5rem;
  }

  .sidebar-content {
    max-width: 280px;
  }
}

/* Плавные переходы */
.nav-link,
.btn-logout,
.sidebar-link,
.menu-toggle,
.close-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Улучшенная доступность */
@media (prefers-reduced-motion: reduce) {
  .nav-link,
  .btn-logout,
  .sidebar-link,
  .menu-toggle,
  .close-btn {
    transition: none;
  }

  .sidebar-content {
    animation: none;
  }

  .brand-orbital,
  .brand-pulse,
  .nav-glow,
  .sidebar-glow {
    animation: none;
    display: none;
  }
}
</style>