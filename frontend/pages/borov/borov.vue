
<template>
  <div class="borov-dashboard">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="welcome-section">
          <h1 class="welcome-title">👋 Привет, {{ authStore.user?.display_name }}!</h1>
          <p class="welcome-subtitle">Управляй своей работой и находи новые возможности</p>
        </div>

        <div class="status-section">
          <div class="status-card" :class="currentWork.type">
            <div class="status-icon">
              <span v-if="currentWork.type === 'specialty'">💼</span>
              <span v-else-if="currentWork.type === 'vakhta'">🏕️</span>
              <span v-else>🆓</span>
            </div>
            <div class="status-info">
              <h3 v-if="currentWork.type === 'specialty'">
                Работаю: {{ currentWork.work.specialty_title }}
              </h3>
              <h3 v-else-if="currentWork.type === 'vakhta'">
                На вахте: {{ currentWork.work.vakhta_title }}
              </h3>
              <h3 v-else>Свободен</h3>
              <p v-if="currentWork.type !== 'none'">
                📍 {{ currentWork.work.location }} •
                📅 до {{ formatDate(currentWork.work.end_date) }}
              </p>
              <p v-else>Готов к новой работе</p>
            </div>
            <div class="status-actions" v-if="currentWork.type !== 'none'">
              <button @click="leaveWork" class="btn btn-warning btn-sm">
                🏁 Завершить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions-section">
      <h2 class="section-title">⚡ Быстрые действия</h2>
      <div class="actions-grid">
        <nuxt-link to="/borov/enterprises" class="action-card primary">
          <div class="action-icon">🏗️</div>
          <div class="action-content">
            <h3>Предприятия</h3>
            <p>Найди работу на предприятиях</p>
          </div>
          <div class="action-arrow">→</div>
        </nuxt-link>

        <nuxt-link to="/borov/specialties" class="action-card secondary">
          <div class="action-icon">💼</div>
          <div class="action-content">
            <h3>Специальности</h3>
            <p>Выбери свою профессию</p>
          </div>
          <div class="action-arrow">→</div>
        </nuxt-link>

        <nuxt-link to="/borov/history" class="action-card accent">
          <div class="action-icon">📊</div>
          <div class="action-content">
            <h3>История</h3>
            <p>Моя трудовая биография</p>
          </div>
          <div class="action-arrow">→</div>
        </nuxt-link>

        <nuxt-link to="/borov/profile" class="action-card neutral">
          <div class="action-icon">👤</div>
          <div class="action-content">
            <h3>Профиль</h3>
            <p>Личные данные и настройки</p>
          </div>
          <div class="action-arrow">→</div>
        </nuxt-link>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-section">
      <h2 class="section-title">📈 Моя статистика</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.completed_vakhtas || 0 }}</div>
            <div class="stat-label">Завершено вахт</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💼</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.completed_specialties || 0 }}</div>
            <div class="stat-label">Завершено работ</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.total_work_days || 0 }}</div>
            <div class="stat-label">Рабочих дней</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <div class="stat-number">{{ formatSalary(totalEarned) }}</div>
            <div class="stat-label">Общий доход</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="activity-section">
      <div class="section-header">
        <h2 class="section-title">📝 Недавняя активность</h2>
        <nuxt-link to="/borov/history" class="btn-link">
          Вся история →
        </nuxt-link>
      </div>

      <div class="activity-list">
        <div v-if="recentActivity.length === 0" class="empty-activity">
          <div class="empty-icon">🎯</div>
          <p>Начни свою первую работу!</p>
          <nuxt-link to="/borov/enterprises" class="btn btn-primary">
            Найти работу
          </nuxt-link>
        </div>

        <div v-else class="activity-items">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-icon" :class="activity.type">
              {{ getActivityIcon(activity.type) }}
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.text }}</p>
              <span class="activity-time">{{ formatTime(activity.date) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Job Recommendations -->
    <div v-if="!currentWork.work && recommendations.length > 0" class="recommendations-section">
      <div class="section-header">
        <h2 class="section-title">💎 Рекомендуемые вакансии</h2>
        <span class="section-badge">Для тебя</span>
      </div>

      <div class="recommendations-grid">
        <div
          v-for="job in recommendations"
          :key="job.id"
          class="recommendation-card"
        >
          <div class="job-header">
            <h4>{{ job.title }}</h4>
            <div class="job-badge">🔥 Горячая</div>
          </div>
          <div class="job-info">
            <p class="enterprise">🏢 {{ job.vakhta_title }}</p>
            <p class="location">📍 {{ job.location }}</p>
          </div>
          <div class="job-details">
            <span class="salary">{{ formatSalary(job.salary) }}/день</span>
            <span class="places">👥 {{ job.free_places }} мест</span>
          </div>
          <button @click="applyForJob(job)" class="btn btn-primary btn-full">
            📝 Откликнуться
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Загрузка...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const currentWork = ref({ type: 'none', work: null })
const stats = ref({})
const recentActivity = ref([])
const recommendations = ref([])
const loading = ref(false)

const totalEarned = computed(() => {
  return (stats.value.total_work_days || 0) * 4500
})

// Загрузка данных
const loadDashboardData = async () => {
  try {
    loading.value = true

    // Загружаем текущую работу
    const workResponse = await $fetch('http://localhost:3001/api/borov/current-work', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    currentWork.value = workResponse

    // Загружаем статистику
    const statsResponse = await $fetch('http://localhost:3001/api/borov/stats', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    stats.value = statsResponse

    // Загружаем историю для активности
    const specialtiesResponse = await $fetch('http://localhost:3001/api/borov/specialties/my', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })

    // Формируем активность
    recentActivity.value = specialtiesResponse
      .slice(0, 3)
      .map((item: any) => ({
        id: item.id,
        type: item.status === 'active' ? 'work' : 'completed',
        text: `${item.status === 'active' ? 'Начал работу' : 'Завершил работу'} "${item.specialty_title}"`,
        date: item.joined_at
      }))

    // Загружаем рекомендации если нет работы
    if (currentWork.value.type === 'none') {
      await loadRecommendations()
    }

  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const loadRecommendations = async () => {
  try {
    const response = await $fetch('http://localhost:3001/api/vakhta', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })

    const allSpecialties = []
    response.forEach(enterprise => {
      if (enterprise.specialties && enterprise.specialties.length > 0) {
        enterprise.specialties.forEach(specialty => {
          if (specialty.free_places > 0 && specialty.is_active) {
            allSpecialties.push({
              ...specialty,
              vakhta_title: enterprise.title,
              location: enterprise.location
            })
          }
        })
      }
    })

    recommendations.value = allSpecialties.slice(0, 2)
  } catch (error) {
    console.error('Error loading recommendations:', error)
  }
}

const leaveWork = async () => {
  try {
    if (!confirm('Вы уверены, что хотите завершить текущую работу?')) return

    let endpoint = ''
    if (currentWork.value.type === 'specialty') {
      endpoint = 'http://localhost:3001/api/borov/specialties/leave'
    } else if (currentWork.value.type === 'vakhta') {
      endpoint = 'http://localhost:3001/api/borov/vakhtas/leave'
    }

    if (endpoint) {
      await $fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authStore.token}` }
      })

      // Обновляем данные
      await loadDashboardData()
      showNotification('Работа завершена', 'success')
    }
  } catch (error: any) {
    console.error('Error leaving work:', error)
    showNotification(error.data?.error || 'Ошибка', 'error')
  }
}

const applyForJob = (job: any) => {
  navigateTo('/borov/specialties')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatSalary = (amount: number) => {
  return new Intl.NumberFormat('ru-RU').format(amount) + ' ₽'
}

const getActivityIcon = (type: string) => {
  const icons: any = {
    work: '👷',
    completed: '✅'
  }
  return icons[type] || '📝'
}

const showNotification = (message: string, type: string) => {
  // TODO: Реализовать систему уведомлений
  console.log(`${type}: ${message}`)
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.borov-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  margin-bottom: 30px;
}

.hero-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  align-items: start;
}

.welcome-title {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #333;
  font-weight: 700;
}

.welcome-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
}

/* Status Card */
.status-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  border-left: 6px solid #007bff;
}

.status-card.specialty {
  border-left-color: #28a745;
}

.status-card.vakhta {
  border-left-color: #ffc107;
}

.status-card.none {
  border-left-color: #6c757d;
}

.status-icon {
  font-size: 3rem;
}

.status-info h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.3rem;
}

.status-info p {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
}

/* Quick Actions */
.quick-actions-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 25px;
  color: #333;
  font-weight: 600;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.action-card.primary {
  border-color: #007bff;
}

.action-card.secondary {
  border-color: #28a745;
}

.action-card.accent {
  border-color: #ffc107;
}

.action-card.neutral {
  border-color: #6c757d;
}

.action-icon {
  font-size: 2.5rem;
}

.action-content h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.2rem;
}

.action-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.action-arrow {
  color: #007bff;
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: auto;
}

/* Stats Section */
.stats-section {
  margin-bottom: 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

/* Activity Section */
.activity-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.btn-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.activity-list {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
}

.empty-activity {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.7;
}

.activity-items {
  padding: 20px 0;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 30px;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.activity-icon.work {
  background: #fff3cd;
  color: #856404;
}

.activity-icon.completed {
  background: #d4edda;
  color: #155724;
}

.activity-text {
  margin: 0 0 5px 0;
  color: #333;
  font-weight: 500;
}

.activity-time {
  font-size: 0.8rem;
  color: #666;
}

/* Recommendations */
.recommendations-section {
  margin-bottom: 40px;
}

.section-badge {
  background: #ffc107;
  color: #212529;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.recommendation-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  border: 2px solid #ffc107;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.job-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.job-badge {
  background: #ffc107;
  color: #212529;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
}

.job-info {
  margin-bottom: 15px;
}

.enterprise, .location {
  margin: 5px 0;
  color: #666;
}

.job-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.salary {
  color: #28a745;
  font-weight: 600;
}

.places {
  color: #666;
}

/* Buttons */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background: #e0a800;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.9rem;
}

.btn-full {
  width: 100%;
  justify-content: center;
}

/* Loading */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .borov-dashboard {
    padding: 15px;
  }

  .hero-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .status-card {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .activity-item {
    padding: 15px 20px;
  }

  .recommendations-grid {
    grid-template-columns: 1fr;
  }

  .job-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }

  .action-card {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .action-arrow {
    margin-left: 0;
  }
}
</style>
