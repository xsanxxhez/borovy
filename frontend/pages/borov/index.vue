<template>
  <div class="borov-dashboard">
    <div class="welcome-section">
      <h1>Добро пожаловать, {{ authStore.user?.display_name }}!</h1>
      <p>Ваш личный кабинет для управления вахтами</p>
    </div>

    <!-- Статистика -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <h3>{{ stats.total_vakhtas_completed || 0 }}</h3>
          <p>Отработано вахт</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-info">
          <h3>{{ stats.total_work_days || 0 }}</h3>
          <p>Общий стаж (дней)</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📍</div>
        <div class="stat-info">
          <h3>{{ currentVakhta ? 'На вахте' : 'Свободен' }}</h3>
          <p>{{ currentVakhta?.title || 'Нет активной вахты' }}</p>
        </div>
      </div>
    </div>

    <!-- Быстрые действия -->
    <div class="quick-actions">
      <h2>Быстрые действия</h2>
      <div class="actions-grid">
        <nuxt-link to="/borov/vakhtas" class="action-card">
          <div class="action-icon">🔍</div>
          <h3>Найти вахту</h3>
          <p>Просмотреть доступные вахты и записаться</p>
        </nuxt-link>

        <nuxt-link to="/borov/history" class="action-card">
          <div class="action-icon">📋</div>
          <h3>История вахт</h3>
          <p>Посмотреть отработанные вахты</p>
        </nuxt-link>

        <nuxt-link to="/borov/profile" class="action-card">
          <div class="action-icon">👤</div>
          <h3>Мой профиль</h3>
          <p>Редактировать личные данные</p>
        </nuxt-link>
      </div>
    </div>

    <!-- Текущая вахта -->
    <div v-if="currentVakhta" class="current-vakhta">
      <h2>Текущая вахта</h2>
      <div class="vakhta-card active">
        <div class="vakhta-header">
          <h3>{{ currentVakhta.title }}</h3>
          <span class="status-badge active">Активна</span>
        </div>
        <div class="vakhta-details">
          <p><strong>📍 Местоположение:</strong> {{ currentVakhta.location }}</p>
          <p><strong>📅 Период:</strong> {{ formatDate(currentVakhta.start_date) }} - {{ formatDate(currentVakhta.end_date) }}</p>
          <p><strong>👥 Занято мест:</strong> {{ currentVakhta.current_workers }}/{{ currentVakhta.total_places }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const stats = ref({
  total_vakhtas_completed: 0,
  total_work_days: 0,
  current_vakhta_id: null
})

const currentVakhta = ref(null)
const loading = ref(false)

// Загрузка статистики
const loadStats = async () => {
  try {
    loading.value = true
    const response = await $fetch('http://localhost:3001/api/borov/stats', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    stats.value = response

    // Загрузка текущей вахты если есть
    if (response.current_vakhta_id) {
      const vakhtaResponse = await $fetch(`http://localhost:3001/api/vakhta/${response.current_vakhta_id}`)
      currentVakhta.value = vakhtaResponse
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.borov-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
}

.welcome-section h1 {
  color: #333;
  margin-bottom: 10px;
}

.welcome-section p {
  color: #666;
  font-size: 18px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  font-size: 40px;
}

.stat-info h3 {
  font-size: 32px;
  margin: 0;
  color: #333;
}

.stat-info p {
  margin: 5px 0 0;
  color: #666;
}

.quick-actions {
  margin-bottom: 40px;
}

.quick-actions h2 {
  margin-bottom: 20px;
  color: #333;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.action-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.action-card h3 {
  margin: 0 0 10px;
  color: #333;
}

.action-card p {
  margin: 0;
  color: #666;
}

.current-vakhta h2 {
  margin-bottom: 20px;
  color: #333;
}

.vakhta-card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-left: 4px solid #20c997;
}

.vakhta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.vakhta-header h3 {
  margin: 0;
  color: #333;
}

.status-badge {
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.active {
  background: #20c997;
  color: white;
}

.vakhta-details p {
  margin: 8px 0;
  color: #555;
}
</style>