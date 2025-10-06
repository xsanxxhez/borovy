<template>
  <div class="dashboard">
    <!-- Статус работы с анимацией -->
    <div class="status-section">
      <div class="status-card" :class="currentWork.type">
        <div class="status-glow"></div>
        <div class="status-header">
          <div class="status-icon">
            <span v-if="currentWork.type === 'specialty'">💼</span>
            <span v-else-if="currentWork.type === 'vakhta'">🏗️</span>
            <span v-else>🆓</span>
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
            <p v-if="currentWork.type === 'none'" class="work-details">Готов к новой работе</p>
          </div>
          <div class="status-badge" :class="currentWork.type">
            {{ getStatusText(currentWork.type) }}
          </div>
        </div>

        <div class="status-actions" v-if="currentWork.type !== 'none'">
          <button @click="leaveWork" class="btn btn-warning btn-large">
            <span class="btn-glow"></span>
            🏁 Завершить работу
          </button>
        </div>
        <div class="status-actions" v-if="currentWork.type === 'none'">
          <nuxt-link to="/borov/enterprises" class="btn btn-primary btn-large">
            <span class="btn-glow"></span>
            🚀 Найти работу
          </nuxt-link>
        </div>
      </div>
    </div>

    <!-- Быстрые действия с hover эффектами -->
    <div class="actions-section">
      <h3 class="section-title">Быстрый доступ</h3>
      <div class="actions-grid">
        <nuxt-link to="/borov/enterprises" class="action-card">
          <div class="card-glow"></div>
          <div class="card-icon">🏗️</div>
          <div class="card-content">
            <h4>Предприятия</h4>
            <p>Найди работу на предприятиях</p>
          </div>
          <div class="card-arrow">→</div>
        </nuxt-link>

        <nuxt-link to="/borov/specialties" class="action-card">
          <div class="card-glow"></div>
          <div class="card-icon">💼</div>
          <div class="card-content">
            <h4>Специальности</h4>
            <p>Выбери свою профессию</p>
          </div>
          <div class="card-arrow">→</div>
        </nuxt-link>

        <nuxt-link to="/borov/history" class="action-card">
          <div class="card-glow"></div>
          <div class="card-icon">📊</div>
          <div class="card-content">
            <h4>История работ</h4>
            <p>Вся трудовая биография</p>
          </div>
          <div class="card-arrow">→</div>
        </nuxt-link>

        <nuxt-link to="/borov/profile" class="action-card">
          <div class="card-glow"></div>
          <div class="card-icon">👤</div>
          <div class="card-content">
            <h4>Профиль</h4>
            <p>Управление аккаунтом</p>
          </div>
          <div class="card-arrow">→</div>
        </nuxt-link>
      </div>
    </div>

    <!-- Статистика с анимированными счетчиками -->
    <div class="stats-section">
      <h3 class="section-title">Моя статистика</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-circle">
            <svg class="progress-ring" width="80" height="80">
              <circle class="progress-ring-background" cx="40" cy="40" r="35"></circle>
              <circle class="progress-ring-circle" cx="40" cy="40" r="35"
                      :style="{'stroke-dashoffset': 220 - (220 * (stats.completed_vakhtas || 0)) / 10}"></circle>
            </svg>
            <div class="stat-value">{{ stats.completed_vakhtas || 0 }}</div>
          </div>
          <div class="stat-label">Завершено вахт</div>
        </div>
        <div class="stat-item">
          <div class="stat-circle">
            <svg class="progress-ring" width="80" height="80">
              <circle class="progress-ring-background" cx="40" cy="40" r="35"></circle>
              <circle class="progress-ring-circle" cx="40" cy="40" r="35"
                      :style="{'stroke-dashoffset': 220 - (220 * (stats.completed_specialties || 0)) / 20}"></circle>
            </svg>
            <div class="stat-value">{{ stats.completed_specialties || 0 }}</div>
          </div>
          <div class="stat-label">Выполнено работ</div>
        </div>
        <div class="stat-item">
          <div class="stat-circle">
            <svg class="progress-ring" width="80" height="80">
              <circle class="progress-ring-background" cx="40" cy="40" r="35"></circle>
              <circle class="progress-ring-circle" cx="40" cy="40" r="35"
                      :style="{'stroke-dashoffset': 220 - (220 * (stats.total_work_days || 0)) / 100}"></circle>
            </svg>
            <div class="stat-value">{{ stats.total_work_days || 0 }}</div>
          </div>
          <div class="stat-label">Рабочих дней</div>
        </div>
        <div class="stat-item">
          <div class="stat-circle">
            <svg class="progress-ring" width="80" height="80">
              <circle class="progress-ring-background" cx="40" cy="40" r="35"></circle>
              <circle class="progress-ring-circle" cx="40" cy="40" r="35"
                      :style="{'stroke-dashoffset': 220 - (220 * totalEarned) / 500000}"></circle>
            </svg>
            <div class="stat-value">{{ formatSalary(totalEarned) }}</div>
          </div>
          <div class="stat-label">Общий доход</div>
        </div>
      </div>
    </div>

    <!-- Последние активности с timeline -->
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

        <div v-else class="activity-timeline">
          <div
            v-for="(activity, index) in recentActivity"
            :key="activity.id"
            class="timeline-item"
            :style="{ '--delay': index * 0.1 + 's' }"
          >
            <div class="timeline-marker" :class="activity.type">
              <div class="marker-dot"></div>
              <div class="marker-pulse"></div>
            </div>
            <div class="timeline-content">
              <p class="activity-text">{{ activity.text }}</p>
              <span class="activity-time">{{ formatTime(activity.date) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Рекомендации с градиентами -->
    <div v-if="currentWork.type === 'none' && recommendations.length > 0" class="recommendations-section">
      <div class="section-header">
        <h3 class="section-title">Рекомендуемые вакансии</h3>
        <div class="recommendation-header">
          <span class="recommendation-badge">Для тебя</span>
          <span class="recommendation-count">{{ recommendations.length }} предложений</span>
        </div>
      </div>

      <div class="recommendations-grid">
        <div
          v-for="job in recommendations"
          :key="job.id"
          class="recommendation-card"
          @click="applyForJob(job)"
        >
          <div class="job-gradient"></div>
          <div class="job-header">
            <h4>{{ job.title }}</h4>
            <div class="salary-badge">{{ formatSalary(job.salary) }}/день</div>
          </div>
          <div class="job-info">
            <p class="enterprise">🏢 {{ job.vakhta_title }}</p>
            <p class="location">📍 {{ job.location }}</p>
            <p class="description">{{ job.description || 'Стабильная работа с гарантированной оплатой' }}</p>
          </div>
          <div class="job-meta">
            <div class="meta-tags">
              <span class="tag places">👥 {{ job.free_places }} мест</span>
              <span class="tag urgency" v-if="job.free_places < 3">🔥 Скорее!</span>
            </div>
            <button class="btn btn-primary btn-sm apply-btn">
              Откликнуться
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Мотивационная секция -->
    <div v-if="currentWork.type === 'none'" class="motivation-section">
      <div class="motivation-card">
        <div class="motivation-content">
          <h3>Готов к новым вызовам?</h3>
          <p>Твоя следующая вахта ждет тебя. Выбирай из проверенных предприятий с гарантированной оплатой.</p>
          <div class="motivation-stats">
            <div class="motivation-stat">
              <strong>1000+</strong>
              <span>успешных вахт</span>
            </div>
            <div class="motivation-stat">
              <strong>99%</strong>
              <span>гарантия выплат</span>
            </div>
            <div class="motivation-stat">
              <strong>24/7</strong>
              <span>поддержка</span>
            </div>
          </div>
          <nuxt-link to="/borov/enterprises" class="btn btn-primary btn-large motivation-btn">
            🚀 Начать поиск работы
          </nuxt-link>
        </div>
        <div class="motivation-visual">
          <div class="floating-icon">💪</div>
          <div class="floating-icon">⚡</div>
          <div class="floating-icon">🎯</div>
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

const getStatusText = (type: string) => {
  const statuses: any = {
    specialty: 'В работе',
    vakhta: 'На вахте',
    none: 'Свободен'
  }
  return statuses[type] || 'Неизвестно'
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
  position: relative;
}

.dashboard::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
}

/* Статус работы */
.status-section {
  margin-bottom: 50px;
}

.status-card {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  border: 2px solid #333;
  border-radius: 20px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
}

.status-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #d4af37, #ffd700);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.status-card:hover::before {
  transform: scaleX(1);
}

.status-card.specialty {
  border-color: #28a745;
}

.status-card.vakhta {
  border-color: #ffc107;
}

.status-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.status-card:hover .status-glow {
  opacity: 1;
}

.status-header {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 25px;
  position: relative;
}

.status-icon {
  font-size: 4rem;
  opacity: 0.9;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}

.status-info h2 {
  margin: 0 0 12px 0;
  color: #fff;
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #fff, #d4af37);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.work-details {
  margin: 0;
  color: #ccc;
  font-size: 1.1rem;
  line-height: 1.5;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-left: auto;
}

.status-badge.specialty {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
  border: 1px solid #28a745;
}

.status-badge.vakhta {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border: 1px solid #ffc107;
}

.status-badge.none {
  background: rgba(108, 117, 125, 0.2);
  color: #6c757d;
  border: 1px solid #6c757d;
}

.status-actions {
  text-align: center;
}

/* Секции */
.section-title {
  font-size: 1.5rem;
  margin-bottom: 25px;
  color: #fff;
  font-weight: 600;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #d4af37, #ffd700);
  border-radius: 2px;
}

/* Быстрые действия */
.actions-section {
  margin-bottom: 50px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.action-card {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  border: 1px solid #333;
  border-radius: 16px;
  padding: 30px;
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.card-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
  transition: left 0.6s ease;
}

.action-card:hover {
  border-color: #d4af37;
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(212, 175, 55, 0.2);
}

.action-card:hover .card-glow {
  left: 100%;
}

.card-icon {
  font-size: 2.5rem;
  opacity: 0.9;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  z-index: 2;
}

.card-content h4 {
  margin: 0 0 8px 0;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
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
  transition: transform 0.3s ease;
  z-index: 2;
}

.action-card:hover .card-arrow {
  transform: translateX(5px);
}

/* Статистика */
.stats-section {
  margin-bottom: 50px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
}

.stat-item {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  border: 1px solid #333;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #d4af37, #ffd700);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.stat-item:hover::before {
  transform: scaleX(1);
}

.stat-item:hover {
  border-color: #d4af37;
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(212, 175, 55, 0.15);
}

.stat-circle {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 15px;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-background {
  fill: transparent;
  stroke: #333;
  stroke-width: 4;
}

.progress-ring-circle {
  fill: transparent;
  stroke: #d4af37;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 220;
  stroke-dashoffset: 220;
  transition: stroke-dashoffset 1.5s ease;
}

.stat-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: 800;
  color: #d4af37;
}

.stat-label {
  color: #999;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

/* Активности */
.activity-section {
  margin-bottom: 50px;
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
  transition: all 0.3s ease;
  position: relative;
}

.view-all::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #d4af37;
  transition: width 0.3s ease;
}

.view-all:hover {
  color: #fff;
}

.view-all:hover::after {
  width: 100%;
}

.activity-list {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  border: 1px solid #333;
  border-radius: 16px;
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
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.activity-timeline {
  padding: 30px;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #2a2a2a;
  opacity: 0;
  transform: translateX(-20px);
  animation: slideIn 0.6s ease forwards;
  animation-delay: var(--delay);
}

.timeline-item:last-child {
  border-bottom: none;
}

.timeline-item:hover {
  background: rgba(42, 42, 42, 0.5);
  margin: 0 -20px;
  padding: 20px;
  border-radius: 8px;
}

.timeline-marker {
  position: relative;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.marker-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #d4af37;
  position: relative;
  z-index: 2;
}

.marker-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 2px solid #d4af37;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.timeline-marker.work .marker-dot {
  background: #d4af37;
}

.timeline-marker.work .marker-pulse {
  border-color: #d4af37;
}

.timeline-marker.completed .marker-dot {
  background: #28a745;
}

.timeline-marker.completed .marker-pulse {
  border-color: #28a745;
}

.timeline-content {
  flex: 1;
}

.activity-text {
  margin: 0 0 5px 0;
  color: #fff;
  font-weight: 500;
}

.activity-time {
  font-size: 0.8rem;
  color: #999;
}

/* Рекомендации */
.recommendations-section {
  margin-bottom: 50px;
}

.recommendation-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.recommendation-badge {
  background: linear-gradient(135deg, #d4af37, #ffd700);
  color: #1a1a1a;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.recommendation-count {
  color: #999;
  font-size: 0.8rem;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
}

.recommendation-card {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  border: 1px solid #333;
  border-radius: 16px;
  padding: 30px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.job-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #d4af37, #ffd700);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.recommendation-card:hover {
  border-color: #d4af37;
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(212, 175, 55, 0.2);
}

.recommendation-card:hover .job-gradient {
  transform: scaleX(1);
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
  font-weight: 600;
  flex: 1;
}

.salary-badge {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
}

.job-info {
  margin-bottom: 20px;
}

.enterprise, .location, .description {
  margin: 5px 0;
  color: #ccc;
  line-height: 1.4;
}

.description {
  font-size: 0.9rem;
  opacity: 0.8;
}

.job-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-tags {
  display: flex;
  gap: 10px;
}

.tag {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tag.places {
  background: rgba(108, 117, 125, 0.2);
  color: #6c757d;
  border: 1px solid #6c757d;
}

.tag.urgency {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border: 1px solid #dc3545;
}

.apply-btn {
  position: relative;
  overflow: hidden;
}

.apply-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.apply-btn:hover::before {
  left: 100%;
}

/* Мотивационная секция */
.motivation-section {
  margin-bottom: 40px;
}

.motivation-card {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  border: 2px solid #d4af37;
  border-radius: 20px;
  padding: 40px;
  display: flex;
  align-items: center;
  gap: 40px;
  position: relative;
  overflow: hidden;
}

.motivation-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

.motivation-content {
  flex: 1;
  position: relative;
  z-index: 2;
}

.motivation-content h3 {
  margin: 0 0 15px 0;
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #fff, #d4af37);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.motivation-content p {
  margin: 0 0 25px 0;
  color: #ccc;
  font-size: 1.1rem;
  line-height: 1.6;
}

.motivation-stats {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.motivation-stat {
  text-align: center;
}

.motivation-stat strong {
  display: block;
  font-size: 1.5rem;
  color: #d4af37;
  margin-bottom: 5px;
}

.motivation-stat span {
  font-size: 0.9rem;
  color: #999;
}

.motivation-btn {
  position: relative;
  overflow: hidden;
}

.motivation-visual {
  position: relative;
  width: 200px;
  height: 200px;
  flex-shrink: 0;
}

.floating-icon {
  position: absolute;
  font-size: 3rem;
  animation: float 3s ease-in-out infinite;
}

.floating-icon:nth-child(1) {
  top: 20px;
  left: 20px;
  animation-delay: 0s;
}

.floating-icon:nth-child(2) {
  top: 60px;
  right: 30px;
  animation-delay: 1s;
}

.floating-icon:nth-child(3) {
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 2s;
}

/* Кнопки */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
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
  position: relative;
  overflow: hidden;
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.5s ease;
}

.btn:hover .btn-glow {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37, #ffd700);
  color: #1a1a1a;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}

.btn-warning {
  background: linear-gradient(135deg, #dc3545, #e83e8c);
  color: white;
}

.btn-warning:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(220, 53, 69, 0.3);
}

.btn-large {
  padding: 15px 30px;
  font-size: 1rem;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.8rem;
}

/* Анимации */
@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  70% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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

  .status-badge {
    margin-left: 0;
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
    font-size: 1.2rem;
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

  .motivation-card {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }

  .motivation-stats {
    justify-content: center;
  }

  .motivation-visual {
    width: 150px;
    height: 150px;
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
    padding: 25px;
  }

  .motivation-card {
    padding: 25px;
  }
}
</style>