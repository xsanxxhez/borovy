[file name]: index.vue
[file content begin]
<template>
  <div class="dashboard">
    <!-- Статус работы -->
    <div class="status-section">
      <div class="status-card" :class="currentWork.type">
        <div class="status-header">
          <div class="status-icon">
            <span v-if="currentWork.type === 'specialty'">💼</span>
            <span v-else-if="currentWork.type === 'vakhta'">🏗️</span>
            <span v-else">🆓</span>
          </div>
          <div class="status-info">
            <h2 v-if="currentWork.type === 'specialty'">
              Работаю: {{ currentWork.work.specialty_title }}
            </h2>
            <h2 v-else-if="currentWork.type === 'vakhta'">
              На вахте: {{ currentWork.work.vakhta_title }}
            </h2>
            <h2 v-else>Свободен</h2>
            <p v-if="currentWork.type !== 'none'" class="work-details">
              📍 {{ currentWork.work.location }} •
              📅 до {{ formatDate(currentWork.work.end_date) }} •
              ⏱️ {{ daysRemaining }} дней осталось
            </p>
            <p v-else class="work-details">Готов к новой работе</p>
          </div>
        </div>

        <div class="status-actions" v-if="currentWork.type !== 'none'">
          <button @click="leaveWork" class="btn btn-warning btn-large">
            🏁 Завершить работу
          </button>
        </div>
      </div>
    </div>

    <!-- Быстрые действия -->
    <div class="actions-section">
      <h3 class="section-title">Быстрый доступ</h3>
      <div class="actions-grid">
        <nuxt-link to="/borov/enterprises" class="action-card">
          <div class="card-icon">🏗️</div>
          <div class="card-content">
            <h4>Предприятия</h4>
            <p>Найди работу на предприятиях</p>
          </div>
          <div class="card-arrow">→</div>
        </nuxt-link>

        <nuxt-link to="/borov/specialties" class="action-card">
          <div class="card-icon">💼</div>
          <div class="card-content">
            <h4>Специальности</h4>
            <p>Выбери свою профессию</p>
          </div>
          <div class="card-arrow">→</div>
        </nuxt-link>

        <nuxt-link to="/borov/history" class="action-card">
          <div class="card-icon">📊</div>
          <div class="card-content">
            <h4>История работ</h4>
            <p>Вся трудовая биография</p>
          </div>
          <div class="card-arrow">→</div>
        </nuxt-link>
      </div>
    </div>

    <!-- Статистика -->
    <div class="stats-section">
      <h3 class="section-title">Моя статистика</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ stats.completed_vakhtas || 0 }}</div>
          <div class="stat-label">Завершено вахт</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.completed_specialties || 0 }}</div>
          <div class="stat-label">Выполнено работ</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.total_work_days || 0 }}</div>
          <div class="stat-label">Рабочих дней</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ formatSalary(totalEarned) }}</div>
          <div class="stat-label">Общий доход</div>
        </div>
      </div>
    </div>

    <!-- Последние активности -->
    <div class="activity-section">
      <div class="section-header">
        <h3 class="section-title">Последние активности</h3>
        <nuxt-link to="/borov/history" class="view-all">
          Вся история →
        </nuxt-link>
      </div>

      <div class="activity-list">
        <div v-if="recentActivity.length === 0" class="empty-activity">
          <div class="empty-icon">📝</div>
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

    <!-- Рекомендации -->
    <div v-if="!currentWork.work && recommendations.length > 0" class="recommendations-section">
      <div class="section-header">
        <h3 class="section-title">Рекомендуемые вакансии</h3>
        <span class="recommendation-badge">Для тебя</span>
      </div>

      <div class="recommendations-grid">
        <div
          v-for="job in recommendations"
          :key="job.id"
          class="recommendation-card"
        >
          <div class="job-header">
            <h4>{{ job.title }}</h4>
            <div class="salary-badge">{{ formatSalary(job.salary) }}/день</div>
          </div>
          <div class="job-info">
            <p class="enterprise">🏢 {{ job.vakhta_title }}</p>
            <p class="location">📍 {{ job.location }}</p>
          </div>
          <div class="job-meta">
            <span class="places">👥 {{ job.free_places }} мест</span>
            <button @click="applyForJob(job)" class="btn btn-primary btn-sm">
              Откликнуться
            </button>
          </div>
        </div>
      </div>
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

const daysRemaining = computed(() => {
  if (!currentWork.value.work || !currentWork.value.work.end_date) return 0
  const end = new Date(currentWork.value.work.end_date)
  const now = new Date()
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
})

// Загрузка данных
const loadDashboardData = async () => {
  try {
    loading.value = true

    const workResponse = await $fetch('http://localhost:3001/api/borov/current-work', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    currentWork.value = workResponse

    const statsResponse = await $fetch('http://localhost:3001/api/borov/stats', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    stats.value = statsResponse

    const specialtiesResponse = await $fetch('http://localhost:3001/api/borov/specialties/my', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })

    recentActivity.value = specialtiesResponse
      .slice(0, 3)
      .map((item: any) => ({
        id: item.id,
        type: item.status === 'active' ? 'work' : 'completed',
        text: `${item.status === 'active' ? 'Начал работу' : 'Завершил работу'} "${item.specialty_title}"`,
        date: item.joined_at
      }))

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
    if (!confirm('Точно завершить текущую работу?')) return

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

      await loadDashboardData()
    }
  } catch (error: any) {
    console.error('Error leaving work:', error)
    alert(error.data?.error || 'Ошибка')
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

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  min-height: 100vh;
  background: #0f0f0f;
}

/* Статус работы */
.status-section {
  margin-bottom: 40px;
}

.status-card {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  border: 2px solid #d4af37;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.15);
}

.status-card.specialty {
  border-color: #28a745;
  box-shadow: 0 8px 32px rgba(40, 167, 69, 0.15);
}

.status-card.vakhta {
  border-color: #ffc107;
  box-shadow: 0 8px 32px rgba(255, 193, 7, 0.15);
}

.status-header {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 20px;
}

.status-icon {
  font-size: 4rem;
  opacity: 0.9;
}

.status-info h2 {
  margin: 0 0 10px 0;
  color: #fff;
  font-size: 1.8rem;
  font-weight: 700;
}

.work-details {
  margin: 0;
  color: #ccc;
  font-size: 1.1rem;
  line-height: 1.5;
}

.status-actions {
  text-align: right;
}

/* Секции */
.section-title {
  font-size: 1.5rem;
  margin-bottom: 25px;
  color: #fff;
  font-weight: 600;
  border-bottom: 2px solid #d4af37;
  padding-bottom: 10px;
  display: inline-block;
}

/* Быстрые действия */
.actions-section {
  margin-bottom: 40px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.action-card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 25px;
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
  transition: left 0.5s;
}

.action-card:hover {
  border-color: #d4af37;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
}

.action-card:hover::before {
  left: 100%;
}

.card-icon {
  font-size: 2.5rem;
  opacity: 0.9;
}

.card-content h4 {
  margin: 0 0 8px 0;
  color: #fff;
  font-size: 1.2rem;
}

.card-content p {
  margin: 0;
  color: #999;
  font-size: 0.9rem;
}

.card-arrow {
  color: #d4af37;
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: auto;
}

/* Статистика */
.stats-section {
  margin-bottom: 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-item {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-item:hover {
  border-color: #d4af37;
  transform: translateY(-3px);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #d4af37;
  margin-bottom: 8px;
}

.stat-label {
  color: #999;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Активности */
.activity-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.view-all {
  color: #d4af37;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.view-all:hover {
  color: #fff;
}

.activity-list {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
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
  border-bottom: 1px solid #2a2a2a;
  transition: background 0.3s ease;
}

.activity-item:hover {
  background: #2a2a2a;
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
  font-size: 1.3rem;
  flex-shrink: 0;
}

.activity-icon.work {
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
  border: 2px solid #d4af37;
}

.activity-icon.completed {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
  border: 2px solid #28a745;
}

.activity-text {
  margin: 0 0 5px 0;
  color: #fff;
  font-weight: 500;
  flex: 1;
}

.activity-time {
  font-size: 0.8rem;
  color: #999;
}

/* Рекомендации */
.recommendations-section {
  margin-bottom: 40px;
}

.recommendation-badge {
  background: #d4af37;
  color: #1a1a1a;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.recommendation-card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 25px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.recommendation-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #d4af37, #ffd700);
}

.recommendation-card:hover {
  border-color: #d4af37;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.job-header h4 {
  margin: 0;
  color: #fff;
  font-size: 1.2rem;
  flex: 1;
}

.salary-badge {
  background: #28a745;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
}

.job-info {
  margin-bottom: 20px;
}

.enterprise, .location {
  margin: 5px 0;
  color: #ccc;
}

.job-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.places {
  color: #999;
  font-size: 0.9rem;
}

/* Кнопки */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-primary {
  background: #d4af37;
  color: #1a1a1a;
}

.btn-primary:hover {
  background: #c19b2e;
  transform: translateY(-2px);
}

.btn-warning {
  background: #dc3545;
  color: white;
}

.btn-warning:hover {
  background: #c82333;
  transform: translateY(-2px);
}

.btn-large {
  padding: 15px 30px;
  font-size: 1rem;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.8rem;
}

/* Мобильная адаптация */
@media (max-width: 768px) {
  .dashboard {
    padding: 20px 15px;
  }

  .status-header {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .status-info h2 {
    font-size: 1.4rem;
  }

  .work-details {
    font-size: 1rem;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-value {
    font-size: 2rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .recommendations-grid {
    grid-template-columns: 1fr;
  }

  .job-header {
    flex-direction: column;
    gap: 10px;
  }

  .job-meta {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .activity-item {
    padding: 15px 20px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .action-card {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .card-arrow {
    margin-left: 0;
  }

  .status-card {
    padding: 20px;
  }
}
</style>
[file content end]