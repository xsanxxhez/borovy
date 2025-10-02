<template>
  <div>
    <!-- Навигационная панель -->
    <nav v-if="authStore.isAuthenticated" class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <nuxt-link to="/">
            <h2>Borovy</h2>
          </nuxt-link>
        </div>

        <div class="nav-links">
          <!-- Навигация для Админа -->
          <template v-if="authStore.isAdmin">
            <nuxt-link to="/admin" class="nav-link">Дашборд</nuxt-link>
            <nuxt-link to="/admin/slons" class="nav-link">Слоны</nuxt-link>
            <nuxt-link to="/admin/vakhtas" class="nav-link">Вахты</nuxt-link>
            <nuxt-link to="/admin/promocodes" class="nav-link">Промокоды</nuxt-link>
            <nuxt-link to="/admin/borovs" class="nav-link">Боровы</nuxt-link>
          </template>

          <!-- Навигация для Слона -->
          <template v-else-if="authStore.isSlon">
            <nuxt-link to="/slon" class="nav-link">Дашборд</nuxt-link>
            <nuxt-link to="/slon/promocodes" class="nav-link">Промокоды</nuxt-link>
            <nuxt-link to="/slon/borovs" class="nav-link">Боровы</nuxt-link>
          </template>

          <!-- Навигация для Борова -->
          <template v-else-if="authStore.isBorov">
            <nuxt-link to="/borov" class="nav-link">Главная</nuxt-link>
            <nuxt-link to="/borov/vakhtas" class="nav-link">Вахты</nuxt-link>
            <nuxt-link to="/borov/history" class="nav-link">История</nuxt-link>
            <nuxt-link to="/borov/profile" class="nav-link">Профиль</nuxt-link>
          </template>
        </div>

        <div class="nav-user">
          <span>Привет, {{ authStore.user?.display_name }}!</span>
          <span class="role-badge" :class="authStore.userRole">
            {{ getRoleName(authStore.userRole) }}
          </span>
          <button @click="handleLogout" class="btn btn-outline">
            Выйти
          </button>
        </div>
      </div>
    </nav>

    <!-- Основной контент -->
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

const getRoleName = (role: string) => {
  const roles: any = {
    admin: 'Администратор',
    slon: 'Слон',
    borov: 'Боров'
  }
  return roles[role] || role
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 1rem 0;
  margin-bottom: 2rem;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h2 {
  margin: 0;
  color: #333;
}

.nav-brand a {
  text-decoration: none;
  color: inherit;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background: #f8f9fa;
}

.nav-link.router-link-active {
  background: #007bff;
  color: white;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 15px;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.role-badge.admin {
  background: #dc3545;
  color: white;
}

.role-badge.slon {
  background: #fd7e14;
  color: white;
}

.role-badge.borov {
  background: #20c997;
  color: white;
}

.btn-outline {
  background: transparent;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
}

.btn-outline:hover {
  background: #dc3545;
  color: white;
}
</style>