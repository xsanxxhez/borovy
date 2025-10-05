<template>
  <div class="borov-dashboard">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="welcome-message">
          <h1>Привет, {{ authStore.user?.display_name }}! 👋</h1>
          <p class="hero-subtitle">Найди свою идеальную работу и начни зарабатывать уже сегодня</p>
        </div>

        <div class="hero-stats">
          <div class="stat-badge" :class="{ active: hasActiveWork }">
            <span class="stat-icon">{{ hasActiveWork ? '✅' : '⏸️' }}</span>
            <span class="stat-text">{{ hasActiveWork ? 'На работе' : 'Свободен' }}</span>
          </div>
          <div class="stat-badge">
            <span class="stat-icon">📊</span>
            <span class="stat-text">{{ stats.total_work_days || 0 }} дней стажа</span>
          </div>
        </div>
      </div>

      <div class="hero-actions">
        <nuxt-link to="/borov/enterprises" class="btn btn-primary btn-large">
          🔍 Найти работу
        </nuxt-link>
        <nuxt-link to="/borov/profile" class="btn btn-outline">
          👤 Профиль
        </nuxt-link>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-icon">🎯</div>
          <div class="stat-info">
            <h3>{{ stats.total_vakhtas_completed || 0 }}</h3>
            <p>Завершено вахт</p>
          </div>
        </div>
        <div class="stat-trend">+2 за месяц</div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <h3>{{ formatSalary(totalEarned) }}</h3>
            <p>Общий заработок</p>
          </div>
        </div>
        <div class="stat-trend success">+15%</div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <h3>4.8</h3>
            <p>Рейтинг</p>
          </div>
        </div>
        <div class="stat-trend">из 5.0</div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-icon">🚀</div>
          <div class="stat-info">
            <h3>{{ availableJobs }}</h3>
            <p>Доступных вакансий</p>
          </div>
        </div>
        <div class="stat-trend success">Новые!</div>
      </div>
    </div>

    <!-- Current Work Section -->
    <div v-if="hasActiveWork" class="current-work-section">
      <div class="section-header">
        <h2>🎯 Текущая работа</h2>
        <div class="status-indicator active">
          <div class="pulse"></div>
          Активно
        </div>
      </div>

      <div class="current-work-card">
        <div class="work-main">
          <div class="work-badge">Текущая</div>
          <h3>{{ currentWork.specialty_title }}</h3>
          <p class="enterprise">🏢 {{ currentWork.vakhta_title }}</p>
          <p class="location">📍 {{ currentWork.location }}</p>
        </div>

        <div class="work-details">
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Зарплата</span>
              <span class="detail-value salary">{{ formatSalary(currentWork.salary) }}/день</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Начало</span>
              <span class="detail-value">{{ formatDate(currentWork.start_date) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Окончание</span>
              <span class="detail-value">{{ formatDate(currentWork.end_date) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Осталось</span>
              <span class="detail-value">{{ daysRemaining }} дней</span>
            </div>
          </div>
        </div>

        <div class="work-progress">
          <div class="progress-header">
            <span>Прогресс вахты</span>
            <span>{{ progressPercentage }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>

        <div class="work-actions">
          <button @click="viewWorkDetails" class="btn btn-outline">
            📋 Детали
          </button>
          <button @click="showEndWorkModal = true" class="btn btn-warning">
            🏁 Завершить
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Access -->
    <div class="quick-access-section">
      <h2>⚡ Быстрый доступ</h2>
      <div class="access-grid">
        <nuxt-link to="/borov/enterprises" class="access-card">
          <div class="access-icon">🏗️</div>
          <div class="access-content">
            <h3>Предприятия</h3>
            <p>Найдите подходящее предприятие и вахту</p>
          </div>
          <div class="access-arrow">→</div>
        </nuxt-link>

        <nuxt-link to="/borov/history" class="access-card">
          <div class="access-icon">📊</div>
          <div class="access-content">
            <h3>История работы</h3>
            <p>Ваша трудовая биография и достижения</p>
          </div>
          <div class="access-arrow">→</div>
        </nuxt-link>

        <nuxt-link to="/borov/profile" class="access-card">
          <div class="access-icon">👤</div>
          <div class="access-content">
            <h3>Мой профиль</h3>
            <p>Личные данные и настройки аккаунта</p>
          </div>
          <div class="access-arrow">→</div>
        </nuxt-link>

        <div class="access-card" @click="showStatistics = true">
          <div class="access-icon">📈</div>
          <div class="access-content">
            <h3>Аналитика</h3>
            <p>Статистика заработка и продуктивности</p>
          </div>
          <div class="access-arrow">→</div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="recent-activity-section">
      <div class="section-header">
        <h2>📝 Недавняя активность</h2>
        <nuxt-link to="/borov/history" class="btn-link">
          Вся история →
        </nuxt-link>
      </div>

      <div class="activity-timeline">
        <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
          <div class="activity-line"></div>
          <div class="activity-icon" :class="activity.type">
            {{ getActivityIcon(activity.type) }}
          </div>
          <div class="activity-content">
            <p class="activity-text">{{ activity.text }}</p>
            <span class="activity-time">{{ formatTime(activity.created_at) }}</span>
          </div>
        </div>

        <div v-if="recentActivities.length === 0" class="empty-timeline">
          <div class="empty-icon">🎯</div>
          <p>Начните свою первую работу</p>
          <nuxt-link to="/borov/enterprises" class="btn btn-primary">
            Найти работу
          </nuxt-link>
        </div>
      </div>
    </div>

    <!-- Job Recommendations -->
    <div v-if="!hasActiveWork && jobRecommendations.length > 0" class="recommendations-section">
      <div class="section-header">
        <h2>💎 Рекомендуемые вакансии</h2>
        <span class="section-badge">Подобрано для вас</span>
      </div>

      <div class="recommendations-grid">
        <div
          v-for="job in jobRecommendations"
          :key="job.id"
          class="recommendation-card"
        >
          <div class="recommendation-badge">🔥 Горячая</div>
          <div class="job-main">
            <h4>{{ job.title }}</h4>
            <p class="enterprise">🏢 {{ job.vakhta_title }}</p>
            <p class="location">📍 {{ job.location }}</p>
          </div>
          <div class="job-details">
            <span class="salary">{{ formatSalary(job.salary) }}/день</span>
            <span class="places">👥 {{ job.free_places }} мест</span>
          </div>
          <button @click="applyForJob(job)" class="btn btn-primary btn-sm">
            📝 Откликнуться
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Modal -->
    <div v-if="showStatistics" class="modal-overlay" @click="showStatistics = false">
      <div class="modal-content stats-modal" @click.stop>
        <div class="modal-header">
          <h2>📊 Моя статистика</h2>
          <button @click="showStatistics = false" class="close-btn">✕</button>
        </div>

        <div class="stats-content">
          <div class="stats-grid-modal">
            <div class="stat-item-modal">
              <div class="stat-circle">
                <span class="stat-number">{{ stats.total_vakhtas_completed || 0 }}</span>
              </div>
              <span class="stat-label">Всего вахт</span>
            </div>
            <div class="stat-item-modal">
              <div class="stat-circle">
                <span class="stat-number">{{ stats.total_work_days || 0 }}</span>
              </div>
              <span class="stat-label">Рабочих дней</span>
            </div>
            <div class="stat-item-modal">
              <div class="stat-circle">
                <span class="stat-number">{{ formatSalary(totalEarned) }}</span>
              </div>
              <span class="stat-label">Общий доход</span>
            </div>
          </div>

          <div class="charts-section">
            <div class="chart-placeholder">
              <div class="chart-icon">📈</div>
              <h4>График активности</h4>
              <p>Ваша продуктивность по месяцам</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- End Work Modal -->
    <div v-if="showEndWorkModal" class="modal-overlay" @click="showEndWorkModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>🏁 Завершение работы</h2>
          <button @click="showEndWorkModal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <p>Вы уверены, что хотите завершить текущую работу?</p>
          <p class="warning-text">Это действие нельзя отменить.</p>
        </div>
        <div class="modal-footer">
          <button @click="showEndWorkModal = false" class="btn btn-outline">Отмена</button>
          <button @click="endWork" class="btn btn-warning">Завершить работу</button>
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

const currentWork = ref(null)
const recentActivities = ref([])
const jobRecommendations = ref([])
const showStatistics = ref(false)
const showEndWorkModal = ref(false)
const loading = ref(false)
const availableJobs = ref(0)

const hasActiveWork = computed(() => currentWork.value !== null)

const totalEarned = computed(() => {
  return (stats.value.total_work_days || 0) * 4500 // Примерная средняя зарплата
})

const progressPercentage = computed(() => {
  if (!currentWork.value) return 0
  const start = new Date(currentWork.value.start_date)
  const end = new Date(currentWork.value.end_date)
  const now = new Date()
  const total = end.getTime() - start.getTime()
  const passed = now.getTime() - start.getTime()
  return Math.min(100, Math.max(0, (passed / total) * 100))
})

const daysRemaining = computed(() => {
  if (!currentWork.value) return 0
  const end = new Date(currentWork.value.end_date)
  const now = new Date()
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
})

// Загрузка данных
// Загрузка данных
const loadDashboardData = async () => {
  try {
    loading.value = true

    // Загружаем статистику - исправленный URL
    const statsResponse = await $fetch('http://localhost:3001/api/borov/stats', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    stats.value = statsResponse

    // Загружаем текущую работу
    const specialtiesResponse = await $fetch('http://localhost:3001/api/borov/specialties/my', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })

    const activeSpecialty = specialtiesResponse.find((s: any) => s.status === 'active')
    currentWork.value = activeSpecialty || null

    // Формируем активность
    recentActivities.value = specialtiesResponse
      .slice(0, 5)
      .map((specialty: any) => ({
        id: specialty.id,
        type: specialty.status === 'active' ? 'work' : 'completed',
        text: `${specialty.status === 'active' ? 'Начал работу' : 'Завершил работу'} "${specialty.specialty_title}"`,
        created_at: specialty.joined_at
      }))

    // Загружаем рекомендации (если нет активной работы)
    if (!hasActiveWork.value) {
      await loadJobRecommendations()
    }

  } catch (error) {
    console.error('Error loading dashboard data:', error)
    // Если статистика не найдена, создаем пустую
    stats.value = {
      total_vakhtas_completed: 0,
      total_work_days: 0,
      current_vakhta_id: null
    }
  } finally {
    loading.value = false
  }
}

const loadJobRecommendations = async () => {
  try {
    // Используем правильный endpoint для предприятий
    const response = await $fetch('http://localhost:3001/api/vakhta', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })

    // Преобразуем в плоский список специальностей
    const allSpecialties = []
    response.forEach(enterprise => {
      if (enterprise.specialties && enterprise.specialties.length > 0) {
        enterprise.specialties.forEach(specialty => {
          if (specialty.free_places > 0 && specialty.is_active) {
            allSpecialties.push({
              ...specialty,
              vakhta_title: enterprise.title,
              location: enterprise.location,
              start_date: enterprise.start_date,
              end_date: enterprise.end_date
            })
          }
        })
      }
    })

    jobRecommendations.value = allSpecialties.slice(0, 3)
    availableJobs.value = allSpecialties.length
  } catch (error) {
    console.error('Error loading job recommendations:', error)
  }
}

const formatSalary = (amount: number) => {
  return new Intl.NumberFormat('ru-RU').format(amount) + ' ₽'
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

const getActivityIcon = (type: string) => {
  const icons: any = {
    work: '👷',
    completed: '✅',
    joined: '🎯'
  }
  return icons[type] || '📝'
}

const viewWorkDetails = () => {
  // TODO: Реализовать просмотр деталей
  console.log('View work details')
}

const endWork = async () => {
  try {
    // TODO: Реализовать завершение работы
    console.log('End work')
    showEndWorkModal.value = false
    showNotification('Работа завершена', 'Вы успешно завершили текущую работу', 'success')
    await loadDashboardData()
  } catch (error) {
    console.error('Error ending work:', error)
    showNotification('Ошибка', 'Не удалось завершить работу', 'error')
  }
}

const applyForJob = (job: any) => {
  // TODO: Реализовать отклик на вакансию
  console.log('Apply for job:', job)
  showNotification('Отклик отправлен', 'Вы откликнулись на вакансию', 'success')
}

const showNotification = (title: string, message: string, type: string) => {
  // TODO: Реализовать систему уведомлений
  console.log(`${type}: ${title} - ${message}`)
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
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 50px 40px;
  border-radius: 20px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hero-content {
  flex: 1;
}

.welcome-message h1 {
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.hero-subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 1.2rem;
  max-width: 500px;
}

.hero-stats {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.stat-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.stat-badge.active {
  background: rgba(40, 167, 69, 0.3);
}

.hero-actions {
  display: flex;
  gap: 15px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.stat-info h3 {
  margin: 0 0 5px 0;
  font-size: 2rem;
  color: #333;
}

.stat-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.stat-trend {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6c757d;
}

.stat-trend.success {
  color: #28a745;
}

/* Current Work Section */
.current-work-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #d4edda;
  color: #155724;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.pulse {
  width: 8px;
  height: 8px;
  background: #28a745;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.current-work-card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  border-left: 6px solid #28a745;
}

.work-badge {
  background: #28a745;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 15px;
}

.work-main h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.4rem;
}

.enterprise, .location {
  margin: 5px 0;
  color: #666;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.detail-item {
  text-align: center;
}

.detail-label {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 5px;
  text-transform: uppercase;
}

.detail-value {
  display: block;
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
}

.detail-value.salary {
  color: #28a745;
}

.work-progress {
  margin: 25px 0;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #666;
}

.progress-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #28a745, #20c997);
  transition: width 0.3s ease;
}

.work-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* Quick Access */
.quick-access-section {
  margin-bottom: 40px;
}

.quick-access-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.access-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.access-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  border: 2px solid transparent;
}

.access-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  border-color: #667eea;
}

.access-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.access-content {
  flex: 1;
}

.access-content h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.access-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.access-arrow {
  color: #667eea;
  font-size: 1.5rem;
  font-weight: bold;
}

/* Recent Activity */
.recent-activity-section {
  margin-bottom: 40px;
}

.activity-timeline {
  position: relative;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  padding: 30px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 15px 0;
  position: relative;
}

.activity-line {
  position: absolute;
  left: 35px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e9ecef;
}

.activity-item:last-child .activity-line {
  display: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  z-index: 2;
  position: relative;
}

.activity-icon.work {
  background: #fff3cd;
  color: #856404;
}

.activity-icon.completed {
  background: #d4edda;
  color: #155724;
}

.activity-content {
  flex: 1;
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

.empty-timeline {
  text-align: center;
  padding: 40px;
  color: #666;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  opacity: 0.7;
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
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  position: relative;
  border: 2px solid #ffc107;
}

.recommendation-badge {
  position: absolute;
  top: -10px;
  right: 20px;
  background: #ffc107;
  color: #212529;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.job-main h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.2rem;
}

.job-details {
  display: flex;
  gap: 15px;
  margin: 15px 0;
  flex-wrap: wrap;
}

.salary {
  color: #28a745;
  font-weight: 600;
}

.places {
  color: #666;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.stats-modal {
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
  padding: 5px;
}

.close-btn:hover {
  color: #333;
}

.stats-content {
  padding: 30px;
}

.stats-grid-modal {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-item-modal {
  text-align: center;
}

.stat-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
}

.stat-number {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.charts-section {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
}

.chart-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  opacity: 0.7;
}

.modal-body {
  padding: 30px;
}

.warning-text {
  color: #dc3545;
  font-weight: 500;
}

.modal-footer {
  padding: 20px 30px;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
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
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  border: 2px solid #007bff;
  color: #007bff;
}

.btn-outline:hover {
  background: #007bff;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background: #e0a800;
}

.btn-large {
  padding: 15px 30px;
  font-size: 1.1rem;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.9rem;
}

.btn-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.btn-link:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    gap: 25px;
    padding: 30px 20px;
  }

  .hero-stats {
    justify-content: center;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .access-grid {
    grid-template-columns: 1fr;
  }

  .recommendations-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid-modal {
    grid-template-columns: 1fr;
  }

  .work-actions {
    flex-direction: column;
  }

  .modal-footer {
    flex-direction: column;
  }
}
</style>