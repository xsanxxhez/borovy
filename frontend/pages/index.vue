<template>
  <div class="container">
    <div class="welcome-card">
      <h1>Добро пожаловать в Borovy!</h1>
      <p class="subtitle">Платформа для организации вахтовой работы</p>
      
      <div v-if="!authStore.isAuthenticated" class="auth-section">
        <NuxtLink to="/login" class="btn btn-primary btn-large">
          Войти в систему
        </NuxtLink>
        
        <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
          <h3 style="color: #333; margin-bottom: 15px;">Роли в системе:</h3>
          <div style="display: grid; gap: 15px;">
            <div style="display: flex; align-items: start; gap: 10px;">
              <span style="background: #dc3545; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">👑 АДМИН</span>
              <div>
                <strong>Создает слонов</strong><br>
                <small>Управляет всей системой, создает аккаунты для слонов и вахты</small>
              </div>
            </div>
            <div style="display: flex; align-items: start; gap: 10px;">
              <span style="background: #fd7e14; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">🐘 СЛОН</span>
              <div>
                <strong>Создает промокоды</strong><br>
                <small>Привлекает боровов через промокоды, следит за статистикой</small>
              </div>
            </div>
            <div style="display: flex; align-items: start; gap: 10px;">
              <span style="background: #20c997; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">💪 БОРОВ</span>
              <div>
                <strong>Работает на вахтах</strong><br>
                <small>Регистрируется по промокоду, записывается на вахты</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="dashboard-section">
        <h2>Ваш кабинет</h2>
        <p>Вы вошли как 
          <strong>{{ authStore.user?.display_name }}</strong> 
          <span class="role-badge" :class="authStore.userRole">
            {{ getRoleName(authStore.userRole) }}
          </span>
        </p>
        
        <div class="role-actions">
          <NuxtLink 
            v-if="authStore.isAdmin" 
            to="/admin" 
            class="action-card admin-card"
          >
            <h3>👑 Администратор</h3>
            <p>Управление системой: создание слонов, вахт, просмотр статистики</p>
            <div class="card-features">
              <span>✅ Создавать слонов</span>
              <span>✅ Управлять вахтами</span>
              <span>✅ Видеть всю статистику</span>
            </div>
          </NuxtLink>
          
          <NuxtLink 
            v-if="authStore.isSlon" 
            to="/slon" 
            class="action-card slon-card"
          >
            <h3>🐘 Слон</h3>
            <p>Привлечение боровов: создание промокодов, отслеживание эффективности</p>
            <div class="card-features">
              <span>✅ Создавать промокоды</span>
              <span>✅ Смотреть своих боровов</span>
              <span>✅ Анализировать статистику</span>
            </div>
          </NuxtLink>
          
          <NuxtLink 
            v-if="authStore.isBorov" 
            to="/borov" 
            class="action-card borov-card"
          >
            <h3>💪 Боров</h3>
            <p>Работа на вахтах: просмотр доступных вахт, запись, история работы</p>
            <div class="card-features">
              <span>✅ Смотреть вахты</span>
              <span>✅ Записываться на работу</span>
              <span>✅ Видеть историю</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const getRoleName = (role: string) => {
  const roles: any = {
    admin: 'АДМИНИСТРАТОР',
    slon: 'СЛОН', 
    borov: 'БОРОВ'
  }
  return roles[role] || role
}

definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.welcome-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 2.5em;
  text-align: center;
}

.subtitle {
  color: #666;
  font-size: 1.2em;
  margin-bottom: 40px;
  text-align: center;
}

.auth-section {
  margin-top: 30px;
}

.btn-large {
  padding: 15px 30px;
  font-size: 1.1em;
  display: block;
  width: 200px;
  margin: 0 auto;
}

.dashboard-section h2 {
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

.dashboard-section p {
  text-align: center;
  margin-bottom: 30px;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  margin-left: 10px;
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

.role-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 30px;
}

.action-card {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.admin-card::before {
  background: #dc3545;
}

.slon-card::before {
  background: #fd7e14;
}

.borov-card::before {
  background: #20c997;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.admin-card:hover {
  border-color: #dc3545;
}

.slon-card:hover {
  border-color: #fd7e14;
}

.borov-card:hover {
  border-color: #20c997;
}

.action-card h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1.3em;
}

.action-card p {
  color: #666;
  margin-bottom: 15px;
  text-align: left;
}

.card-features {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.card-features span {
  font-size: 0.9em;
  color: #555;
}
</style>
