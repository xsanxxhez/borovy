<template>
  <div class="container">
    <div class="welcome-card">
      <h1>Добро пожаловать в Borovy!</h1>
      <p class="subtitle">Платформа для организации вахтовой работы</p>
      
      <div v-if="!authStore.isAuthenticated" class="auth-section">
        <NuxtLink to="/login" class="btn btn-primary btn-large">
          Войти в систему
        </NuxtLink>
      </div>
      
      <div v-else class="dashboard-section">
        <h2>Ваш кабинет</h2>
        <p>Вы вошли как <strong>{{ authStore.user?.display_name }}</strong></p>
        
        <div class="role-actions">
          <NuxtLink 
            v-if="authStore.isAdmin" 
            to="/admin" 
            class="action-card"
          >
            <h3>👑 Администратор</h3>
            <p>Управление системой, слонами и вахтами</p>
          </NuxtLink>
          
          <NuxtLink 
            v-if="authStore.isSlon" 
            to="/slon" 
            class="action-card"
          >
            <h3>🐘 Слон</h3>
            <p>Управление промокодами и боровыми</p>
          </NuxtLink>
          
          <NuxtLink 
            v-if="authStore.isBorov" 
            to="/borov" 
            class="action-card"
          >
            <h3>💪 Боров</h3>
            <p>Просмотр и запись на вахты</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

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
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 2.5em;
}

.subtitle {
  color: #666;
  font-size: 1.2em;
  margin-bottom: 40px;
}

.auth-section {
  margin-top: 30px;
}

.btn-large {
  padding: 15px 30px;
  font-size: 1.1em;
}

.dashboard-section h2 {
  color: #333;
  margin-bottom: 10px;
}

.role-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
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
}

.action-card:hover {
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.action-card h3 {
  color: #333;
  margin-bottom: 10px;
}

.action-card p {
  color: #666;
  margin: 0;
}
</style>
