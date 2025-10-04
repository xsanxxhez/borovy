<template>
  <div class="borov-dashboard">
    <!-- Welcome Section -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1>Добро пожаловать, {{ authStore.user?.display_name }}! 👋</h1>
        <p>Ваш личный кабинет для поиска работы и управления вахтами</p>
      </div>
      <div class="welcome-actions">
        <nuxt-link to="/borov/specialties" class="btn btn-primary btn-large">
          🔍 Найти работу
        </nuxt-link>
        <nuxt-link to="/borov/profile" class="btn btn-outline">
          👤 Мой профиль
        </nuxt-link>
      </div>
    </div>

    <!-- Quick Stats -->
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
        <div class="stat-icon">💰</div>
        <div class="stat-info">
          <h3>{{ formatSalary(totalEarned) }}</h3>
          <p>Общий заработок</p>
        </div>
      </div>

      <div class="stat-card" :class="{ active: hasActiveSpecialty }">
        <div class="stat-icon">{{ hasActiveSpecialty ? '✅' : '⏸️' }}</div>
        <div class="stat-info">
          <h3>{{ hasActiveSpecialty ? 'На вахте' : 'Свободен' }}</h3>
          <p>{{ currentSpecialty?.title || 'Нет активной работы' }}</p>
        </div>
      </div>
    </div>

    <!-- Current Work -->
    <div v-if="hasActiveSpecialty" class="current-work">
      <div class="section-header">
        <h2>🎯 Текущая работа</h2>
        <span class="status-badge active">Активна</span>
      </div>

      <div class="current-work-card">
        <div class="work-info">
          <div class="work-main">
            <h3>{{ currentSpecialty.title }}</h3>
            <p class="enterprise">🏢 {{ currentSpecialty.vakhta_title }}</p>
            <p class="location">📍 {{ currentSpecialty.location }}</p>
          </div>

          <div class="work-details">
            <div class="detail-item">
              <span class="label">Зарплата:</span>
              <span class="value salary">{{ formatSalary(currentSpecialty.salary) }}/день</span>
            </div>
            <div class="detail-item">
              <span class="label">Начало:</span>
              <span class="value">{{ formatDate(currentSpecialty.start_date) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Окончание:</span>
              <span class="value">{{ formatDate(currentSpecialty.end_date) }}</span>
            </div>
          </div>
        </div>

        <div class="work-actions">
          <button @click="viewWorkDetails" class="btn btn-outline">
            📋 Подробнее
          </button>
          <button @click="endWork" class="btn btn-warning">
            🏁 Завершить
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h2>Быстрые действия</h2>
      <div class="actions-grid">
        <nuxt-link to="/borov/specialties" class="action-card">
          <div class="action-icon">🔍</div>
          <div class="action-content">
            <h3>Найти работу</h3>
            <p>Просмотреть доступные специальности и записаться</p>
          </div>
          <div class="action-arrow">→</div>
        </nuxt-link>

        <nuxt-link to="/borov/history" class="action-card">
          <div class="action-icon">📋</div>
          <div class="action-content">
            <h3>История работы</h3>
            <p>Посмотреть отработанные вахты и специальности</p>
          </div>
          <div class="action-arrow">→</div>
        </nuxt-link>

        <nuxt-link to="/borov/profile" class="action-card">
          <div class="action-icon">👤</div>
          <div class="action-content">
            <h3>Мой профиль</h3>
            <p>Редактировать личные данные и настройки</p>
          </div>
          <div class="action-arrow">→</div>
        </nuxt-link>

        <div class="action-card" @click="showStatistics = true">
          <div class="action-icon">📈</div>
          <div class="action-content">
            <h3>Статистика</h3>
            <p>Аналитика работы и заработка</p>
          </div>
          <div class="action-arrow">→</div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="recent-activity">
      <div class="section-header">
        <h2>📝 Недавняя активность</h2>
        <nuxt-link to="/borov/history" class="btn-link">
          Вся история →
        </nuxt-link>
      </div>

      <div class="activity-list">
        <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
          <div class="activity-icon" :class="activity.type">
            {{ getActivityIcon(activity.type) }}
          </div>
          <div class="activity-content">
            <p class="activity-text">{{ activity.text }}</p>
            <span class="activity-time">{{ formatTime(activity.created_at) }}</span>
          </div>
        </div>

        <div v-if="recentActivities.length === 0" class="empty-activity">
          <p>У вас пока нет активности</p>
          <nuxt-link to="/borov/specialties" class="btn btn-primary btn-sm">
            Найти первую работу
          </nuxt-link>
        </div>
      </div>
    </div>

    <!-- Statistics Modal -->
    <div v-if="showStatistics" class="modal-overlay" @click="showStatistics = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>📊 Моя статистика</h2>
          <button @click="showStatistics = false" class="close-btn">✕</button>
        </div>

        <div class="statistics-content">
          <div class="stat-grid">
            <div class="stat-item">
              <span class="stat-value">{{ stats.total_vakhtas_completed || 0 }}</span>
              <span class="stat-label">Всего вахт</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ stats.total_work_days || 0 }}</span>
              <span class="stat-label">Всего дней</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ formatSalary(totalEarned) }}</span>
              <span class="stat-label">Общий заработок</span>
            </div>
          </div>

          <div class="chart-placeholder">
            <div class="chart-icon">📈</div>
            <p>График вашей активности</p>
            <small>Здесь будет отображаться ваша статистика по месяцам</small>
          </div>
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

const currentSpecialty = ref(null)
const recentActivities = ref([])
const showStatistics = ref(false)
const loading = ref(false)

const hasActiveSpecialty = computed(() => currentSpecialty.value !== null)

const totalEarned = computed(() => {
  // Простой расчет - можно улучшить когда будет больше данных
  return (stats.value.total_work_days || 0) * 5000
})

// Загрузка данных
const loadDashboardData = async () => {
  try {
    loading.value = true

    // Загружаем статистику
    const statsResponse = await $fetch('http://localhost:3001/api/borov/stats', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    stats.value = statsResponse

    // Загружаем текущую специальность
    const specialtiesResponse = await $fetch('http://localhost:3001/api/borov/specialties/my', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    const activeSpecialty = specialtiesResponse.find((s: any) => s.status === 'active')
    currentSpecialty.value = activeSpecialty || null

    // Формируем недавнюю активность
    recentActivities.value = specialtiesResponse
      .slice(0, 3)
      .map((specialty: any) => ({
        id: specialty.id,
        type: specialty.status === 'active' ? 'work' : 'completed',
        text: `${specialty.status === 'active' ? 'Начал работу' : 'Завершил работу'} "${specialty.specialty_title}"`,
        created_at: specialty.joined_at
      }))

  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
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
  // TODO: Реализовать просмотр деталей работы
  console.log('View work details:', currentSpecialty.value)
}

const endWork = async () => {
  if (!confirm('Вы уверены, что хотите завершить эту работу?')) return

  try {
    // TODO: Реализовать завершение работы
    console.log('End work:', currentSpecialty.value)
  } catch (error) {
    console.error('Error ending work:', error)
  }
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

.welcome-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  border-radius: 20px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-content h1 {
  margin: 0 0 10px 0;
  font-size: 2.2rem;
}

.welcome-content p {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.welcome-actions {
  display: flex;
  gap: 15px;
}

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
}

.btn-primary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-primary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-outline:hover {
  background: white;
  color: #667eea;
}

.btn-large {
  padding: 15px 30px;
  font-size: 1.1rem;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.9rem;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background: #e0a800;
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
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card.active {
  border-left: 4px solid #28a745;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-info h3 {
  margin: 0 0 5px 0;
  font-size: 1.8rem;
  color: #333;
}

.stat-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  color: #333;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.current-work-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.work-info {
  flex: 1;
}

.work-main h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.3rem;
}

.enterprise, .location {
  margin: 5px 0;
  color: #666;
}

.work-details {
  display: flex;
  gap: 30px;
  margin-top: 15px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
}

.value {
  font-weight: 600;
  color: #333;
}

.value.salary {
  color: #28a745;
}

.work-actions {
  display: flex;
  gap: 10px;
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.action-card {
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
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.action-icon {
  font-size: 2rem;
}

.action-content {
  flex: 1;
}

.action-content h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.action-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.action-arrow {
  color: #007bff;
  font-size: 1.2rem;
  font-weight: bold;
}

.recent-activity {
  margin-bottom: 40px;
}

.btn-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.btn-link:hover {
  text-decoration: underline;
}

.activity-list {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  overflow: hidden;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px 25px;
  border-bottom: 1px solid #f8f9fa;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.activity-icon.work {
  background: #fff3cd;
  color: #856404;
}

.activity-icon.completed {
  background: #d4edda;
  color: #155724;
}

.activity-icon.joined {
  background: #cce7ff;
  color: #004085;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0 0 5px 0;
  color: #333;
}

.activity-time {
  font-size: 0.8rem;
  color: #666;
}

.empty-activity {
  text-align: center;
  padding: 40px;
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
  border-radius: 15px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
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

.statistics-content {
  padding: 30px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.chart-placeholder {
  text-align: center;
  padding: 40px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 2px dashed #dee2e6;
}

.chart-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  opacity: 0.7;
}

/* Responsive */
@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .welcome-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .current-work-card {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .work-details {
    flex-direction: column;
    gap: 15px;
  }

  .work-actions {
    width: 100%;
    justify-content: center;
  }

  .stat-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>