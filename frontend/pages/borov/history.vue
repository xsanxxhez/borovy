<template>
  <div class="history-page">
    <div class="page-header">
      <h1>История вахт</h1>
      <p>Все ваши вахты и статистика работы</p>
    </div>

    <!-- Статистика -->
    <div class="stats-summary">
      <div class="stat-item">
        <span class="stat-number">{{ totalVakhtas }}</span>
        <span class="stat-label">Всего вахт</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ totalDays }}</span>
        <span class="stat-label">Всего дней</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ currentVakhtas }}</span>
        <span class="stat-label">Активных</span>
      </div>
    </div>

    <!-- Список вахт -->
    <div v-if="loading" class="loading">Загрузка истории...</div>

    <div v-else-if="vakhtas.length === 0" class="no-history">
      <div class="no-history-icon">📊</div>
      <h3>История вахт пуста</h3>
      <p>У вас еще нет отработанных вахт</p>
      <nuxt-link to="/borov/vakhtas" class="btn btn-primary">
        Найти вахту
      </nuxt-link>
    </div>

    <div v-else class="history-list">
      <div
        v-for="vakhta in vakhtas"
        :key="vakhta.id"
        class="history-item"
        :class="vakhta.status"
      >
        <div class="vakhta-info">
          <h3>{{ vakhta.title }}</h3>
          <p class="location">📍 {{ vakhta.location }}</p>
          <p class="period">
            📅 {{ formatDate(vakhta.start_date) }}
            <span v-if="vakhta.end_date">- {{ formatDate(vakhta.end_date) }}</span>
            <span v-else>- по настоящее время</span>
          </p>
          <p class="joined-date">📋 Записан: {{ formatDate(vakhta.joined_at) }}</p>
        </div>

        <div class="vakhta-status">
          <span class="status-badge" :class="vakhta.status">
            {{ getStatusText(vakhta.status) }}
          </span>
          <div v-if="vakhta.status === 'completed'" class="duration">
            {{ calculateDuration(vakhta.start_date, vakhta.end_date) }} дней
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const vakhtas = ref([])
const loading = ref(false)
const totalVakhtas = ref(0)
const totalDays = ref(0)
const currentVakhtas = ref(0)

// Загрузка истории вахт
const loadHistory = async () => {
  try {
    loading.value = true
    const response = await $fetch('http://localhost:3001/api/borov/vakhtas/my', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    vakhtas.value = response

    // Расчет статистики
    calculateStats(response)
  } catch (error) {
    console.error('Error loading history:', error)
  } finally {
    loading.value = false
  }
}

// Расчет статистики
const calculateStats = (vakhtasList: any[]) => {
  totalVakhtas.value = vakhtasList.length
  currentVakhtas.value = vakhtasList.filter(v => v.status === 'active').length

  // Расчет общего количества дней
  totalDays.value = vakhtasList
    .filter(v => v.status === 'completed' && v.start_date && v.end_date)
    .reduce((total, vakhta) => {
      const start = new Date(vakhta.start_date)
      const end = new Date(vakhta.end_date)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      return total + days
    }, 0)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const getStatusText = (status: string) => {
  const statusMap: any = {
    active: 'Активна',
    completed: 'Завершена',
    cancelled: 'Отменена'
  }
  return statusMap[status] || status
}

const calculateDuration = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.history-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h1 {
  color: #333;
  margin-bottom: 10px;
}

.page-header p {
  color: #666;
  font-size: 18px;
}

.stats-summary {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 32px;
  font-weight: bold;
  color: #007bff;
}

.stat-label {
  font-size: 14px;
  color: #666;
  text-transform: uppercase;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.no-history {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-history-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.no-history h3 {
  margin-bottom: 10px;
  color: #333;
}

.no-history p {
  margin-bottom: 20px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.history-item {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-left: 4px solid #20c997;
}

.history-item.active {
  border-left-color: #20c997;
}

.history-item.completed {
  border-left-color: #6c757d;
}

.history-item.cancelled {
  border-left-color: #dc3545;
}

.vakhta-info {
  flex: 1;
}

.vakhta-info h3 {
  margin: 0 0 10px;
  color: #333;
}

.vakhta-info p {
  margin: 5px 0;
  color: #555;
}

.vakhta-status {
  text-align: right;
  min-width: 120px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: 10px;
}

.status-badge.active {
  background: #20c997;
  color: white;
}

.status-badge.completed {
  background: #6c757d;
  color: white;
}

.status-badge.cancelled {
  background: #dc3545;
  color: white;
}

.duration {
  font-size: 14px;
  color: #666;
}

.btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  display: inline-block;
}

.btn-primary:hover {
  background: #0056b3;
}
</style>