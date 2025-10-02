<template>
  <div>
    <!-- Навигационная панель -->
    <nav v-if="authStore.isAuthenticated" class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <h2>Borovy</h2>
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
}

.btn-outline:hover {
  background: #dc3545;
  color: white;
}
</style>
