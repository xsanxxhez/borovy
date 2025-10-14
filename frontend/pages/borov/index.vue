<template>
  <div class="dashboard">
    <!-- Анимированный фон как в history.vue -->
    <div class="background-animation">
      <div class="parallax-layer layer-1"></div>
      <div class="parallax-layer layer-2"></div>
      <div class="parallax-layer layer-3"></div>
      <div class="particles-container">
        <div class="particle" v-for="i in 25" :key="i" :style="particleStyle(i)"></div>
      </div>
      <div class="gradient-overlay"></div>
    </div>

    <!-- Анимированный логотип как в history.vue -->
    <div class="dashboard-logo">
      <div class="logo-orbital">
        <div class="orbit orbit-1">
          <div class="satellite"></div>
        </div>
        <div class="orbit orbit-2">
          <div class="satellite"></div>
        </div>
        <div class="orbit orbit-3">
          <div class="satellite"></div>
        </div>
        <div class="central-core">
          <div class="core-inner"></div>
        </div>
      </div>
    </div>

    <!-- Основной контент -->
    <div class="dashboard-content">

      <!-- Хедер пользователя с улучшенным дизайном -->
      <div class="user-header">
        <div class="user-avatar">
          <div class="avatar-circle">
            {{ getInitials(authStore.user?.display_name) }}
          </div>
          <div class="status-indicator" :class="currentWorkStatus"></div>
          <div class="avatar-glow"></div>
        </div>

        <div class="user-info">
          <h1 class="welcome-text">
            <span class="title-word">Добро пожаловать</span>
            <span class="user-name">{{ authStore.user?.display_name }}</span>
          </h1>
          <div class="user-subtitle-container">
            <p class="user-subtitle">Управляй своей карьерой в одном месте</p>
            <div class="subtitle-decoration">
              <div class="decoration-dot"></div>
              <div class="decoration-dot"></div>
              <div class="decoration-dot"></div>
            </div>
          </div>
        </div>

        <div class="user-stats">
          <div class="stat-badge">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.rating || '4.8' }}</div>
              <div class="stat-label">Рейтинг</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Текущий статус работы с премиальным дизайном -->
      <div class="current-work-section">
        <div class="work-status-card" :class="currentWorkStatus">
          <div class="status-glow"></div>
          <div class="status-content">
            <div class="status-icon">
              <div class="icon-background"></div>
              <div class="icon-foreground">
                <span v-if="currentWorkStatus === 'specialty'">💼</span>
                <span v-else-if="currentWorkStatus === 'vakhta'">🏗️</span>
                <span v-else>🌟</span>
              </div>
            </div>

            <div class="status-details">
              <div class="status-badge" :class="currentWorkStatus">
                {{ getStatusText(currentWorkStatus) }}
              </div>
              <h2 v-if="currentWork.work" class="work-title">
                {{ currentWork.work.specialty_title || currentWork.work.vakhta_title }}
              </h2>
              <h2 v-else class="work-title">Готов к работе</h2>

              <div v-if="currentWork.work" class="work-meta">
                <div class="meta-item">
                  <span class="meta-icon">📍</span>
                  <span>{{ currentWork.work.location }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">📅</span>
                  <span>до {{ formatDate(currentWork.work.end_date) }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">⏱️</span>
                  <span>{{ daysRemaining }} дней осталось</span>
                </div>
              </div>

              <p v-else class="work-description">
                Выбери подходящую вахту и начни зарабатывать
              </p>
            </div>
          </div>

          <div class="status-actions">
            <button
              v-if="currentWorkStatus !== 'none'"
              @click="leaveWork"
              class="btn btn-outline btn-glow"
            >
              <span class="button-content">
                <span class="button-text">Отменить запись</span>
              </span>
            </button>
            <nuxt-link
              v-else
              to="/borov/enterprises"
              class="btn btn-primary btn-glow"
            >
              <span class="button-content">
                <span class="button-text">🚀 Найти работу</span>
              </span>
              <div class="button-ripple" v-if="showRipple"></div>
            </nuxt-link>
          </div>
        </div>
      </div>

      <!-- Основные метрики с анимациями -->
      <div class="metrics-section">
        <div class="metrics-grid">
          <div
            v-for="metric in metrics"
            :key="metric.id"
            class="metric-card"
            :class="metric.status"
          >
            <div class="metric-glow"></div>
            <div class="metric-icon">
              <div class="icon-background"></div>
              <div class="icon-foreground">
                {{ metric.icon }}
              </div>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ metric.value }}</div>
              <div class="metric-label">{{ metric.label }}</div>
            </div>
            <div v-if="metric.trend" class="metric-trend" :class="metric.trend.type">
              {{ metric.trend.value }}
            </div>
            <div class="metric-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: metric.progress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Быстрые действия с hover-эффектами -->
      <div class="quick-actions-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-word">Быстрые</span>
            <span class="title-word">действия</span>
          </h2>
          <div class="section-decoration">
            <div class="decoration-line"></div>
          </div>
        </div>
        <div class="actions-grid">
          <nuxt-link
            v-for="action in quickActions"
            :key="action.id"
            :to="action.path"
            class="action-card"
            @click.native="trackAction(action.id)"
          >
            <div class="action-glow"></div>
            <div class="action-icon">
              <div class="icon-background"></div>
              <div class="icon-foreground">
                {{ action.icon }}
              </div>
            </div>
            <div class="action-content">
              <h3>{{ action.title }}</h3>
              <p>{{ action.description }}</p>
            </div>
            <div class="action-arrow">→</div>
          </nuxt-link>
        </div>
      </div>

      <!-- Двойная колонка с улучшенным дизайном -->
      <div class="content-columns">
        <!-- Недавняя активность -->
        <div class="column activity-column">
          <div class="section-header">
            <h2 class="section-title">
              <span class="title-word">Недавняя </span>

              <span class="title-word">активность</span>
            </h2>
            <nuxt-link to="/borov/history" class="view-all-link">
              <span>Вся история</span>
              <div class="link-arrow">→</div>
            </nuxt-link>
          </div>

          <div class="activity-list">
            <div v-if="recentActivity.length === 0" class="empty-state">
              <div class="empty-icon">📝</div>
              <p>Начни свою первую работу!</p>
              <nuxt-link to="/borov/enterprises" class="btn btn-outline btn-sm">
                Найти работу
              </nuxt-link>
            </div>

            <div v-else class="activity-items">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="activity-item"
                @click="viewActivityDetails(activity)"
              >
                <div class="activity-glow"></div>
                <div class="activity-icon" :class="activity.type">
                  <div class="icon-background"></div>
                  <div class="icon-foreground">
                    {{ getActivityIcon(activity.type) }}
                  </div>
                </div>
                <div class="activity-content">
                  <p class="activity-text">{{ activity.text }}</p>
                  <span class="activity-time">{{ formatTime(activity.date) }}</span>
                </div>
                <div class="activity-arrow">→</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Рекомендации -->
        <div class="column recommendations-column" v-if="recommendations.length > 0">
          <div class="section-header">
            <h2 class="section-title">
              <span class="title-word">Рекомендации</span>
            </h2>
            <span class="recommendation-count">{{ recommendations.length }} предложений</span>
          </div>

          <div class="recommendations-list">
            <div
              v-for="job in recommendations"
              :key="job.id"
              class="recommendation-card"
              @click="applyForJob(job)"
            >
              <div class="recommendation-glow"></div>
              <div class="job-header">
                <h4>{{ job.title }}</h4>
                <div class="salary">{{ formatSalary(job.salary) }}/день</div>
              </div>

              <div class="job-info">
                <div class="info-item">
                  <span class="info-icon">🏢</span>
                  {{ job.enterprise_name }}
                </div>
                <div class="info-item">
                  <span class="info-icon">📍</span>
                  {{ job.location }}
                </div>
              </div>

              <div class="job-footer">
                <div class="places-badge">
                  👥 {{ job.free_places }} мест
                </div>
                <button class="btn btn-primary btn-sm btn-glow">
                  Откликнуться
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Мотивационная секция с анимацией -->
      <div v-if="currentWorkStatus === 'none'" class="motivation-section">
        <div class="motivation-card">
          <div class="motivation-glow"></div>
          <div class="motivation-content">
            <h3>Готов к новым вызовам?</h3>
            <p>Найди идеальную вахту среди проверенных предприятий с гарантированной оплатой</p>
            <div class="motivation-stats">
              <div class="stat">
                <strong>1000+</strong>
                <span>успешных вахт</span>
              </div>
              <div class="stat">
                <strong>99%</strong>
                <span>гарантия выплат</span>
              </div>
              <div class="stat">
                <strong>24/7</strong>
                <span>поддержка</span>
              </div>
            </div>
          </div>
          <div class="motivation-action">
            <nuxt-link to="/borov/enterprises" class="btn btn-primary btn-large btn-glow">
              <span class="button-content">
                <span class="button-text">Начать поиск работы</span>
              </span>
              <div class="button-ripple" v-if="showRipple"></div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Плавающие элементы как в history.vue -->
    <div class="floating-elements">
      <div class="floating-element element-1"></div>
      <div class="floating-element element-2"></div>
      <div class="floating-element element-3"></div>
      <div class="floating-element element-4"></div>
      <div class="floating-element element-5"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

// Состояния
const currentWork = ref({ type: 'none', work: null })
const stats = ref({})
const recentActivity = ref([])
const recommendations = ref([])
const showRipple = ref(false)

// Загрузка данных
const loadDashboardData = async () => {
  try {
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
      .slice(0, 4)
      .map((item: any) => ({
        id: item.id,
        type: item.status === 'active' ? 'work' : 'completed',
        text: `${item.status === 'active' ? 'Начал работу' : 'Завершил'} "${item.specialty_title}"`,
        date: item.joined_at
      }))

    if (currentWork.value.type === 'none') {
      await loadRecommendations()
    }

  } catch (error) {
    console.error('Error loading dashboard data:', error)
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
              id: specialty.id,
              title: specialty.title,
              enterprise_name: enterprise.title,
              location: enterprise.location,
              salary: specialty.salary || 4500,
              free_places: specialty.free_places
            })
          }
        })
      }
    })

    recommendations.value = allSpecialties.slice(0, 3)
  } catch (error) {
    console.error('Error loading recommendations:', error)
  }
}

// Вычисляемые свойства
const currentWorkStatus = computed(() => currentWork.value.type)

const daysRemaining = computed(() => {
  if (!currentWork.value.work?.end_date) return 0
  const end = new Date(currentWork.value.work.end_date)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
})

const metrics = computed(() => [
  {
    id: 1,
    icon: '💰',
    value: formatSalary((stats.value.total_work_days || 0) * 4500),
    label: 'Общий доход',
    trend: { type: 'up', value: '+12%' },
    progress: 85,
    status: 'completed'
  },
  {
    id: 2,
    icon: '📅',
    value: `${stats.value.total_work_days || 0} дней`,
    label: 'Отработано',
    progress: 70,
    status: 'in-progress'
  },
  {
    id: 3,
    icon: '⭐',
    value: stats.value.rating || '4.8',
    label: 'Рейтинг',
    progress: 90,
    status: 'completed'
  },
  {
    id: 4,
    icon: '🎯',
    value: stats.value.completed_jobs || '0',
    label: 'Завершено работ',
    progress: 60,
    status: 'in-progress'
  }
])

const quickActions = computed(() => [
  {
    id: 'enterprises',
    icon: '🏗️',
    title: 'Предприятия',
    description: 'Найди работу',
    path: '/borov/enterprises'
  },
  {
    id: 'specialties',
    icon: '💼',
    title: 'Специальности',
    description: 'Мои профессии',
    path: '/borov/specialties'
  },
  {
    id: 'history',
    icon: '📊',
    title: 'История',
    description: 'Вся статистика',
    path: '/borov/history'
  },
  {
    id: 'profile',
    icon: '👤',
    title: 'Профиль',
    description: 'Настройки',
    path: '/borov/profile'
  }
])

// Методы
const leaveWork = async () => {
  try {
    if (!confirm('Вы уверены, что хотите отменить запись на текущую работу?')) return

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
    alert(error.data?.error || 'Не удалось отменить запись')
  }
}

const applyForJob = (job: any) => {
  navigateTo('/borov/specialties')
}

const trackAction = (action: string) => {
  console.log('Action tracked:', action)
}

const viewActivityDetails = (activity: any) => {
  navigateTo('/borov/history')
}

const getInitials = (name: string) => {
  if (!name) return 'БР'
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const getStatusText = (type: string) => {
  const statuses: any = {
    specialty: 'Работаю',
    vakhta: 'На вахте',
    none: 'Свободен'
  }
  return statuses[type] || 'Неизвестно'
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short'
  })
}

const formatSalary = (amount: number) => {
  return new Intl.NumberFormat('ru-RU').format(amount) + ' ₽'
}

const getActivityIcon = (type: string) => {
  const icons: any = {
    work: '📝',
    completed: '✅'
  }
  return icons[type] || '📅'
}

const particleStyle = (index: number) => {
  const size = Math.random() * 4 + 1
  const duration = Math.random() * 20 + 10
  const delay = Math.random() * 5
  return {
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`
  }
}

onMounted(() => {
  loadDashboardData()

  // Анимация появления контента
  setTimeout(() => {
    document.querySelector('.dashboard-content')?.classList.add('animate-in')
  }, 100)
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #0a0a0a;
  position: relative;
  overflow-x: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Анимированный фон как в history.vue */
.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.parallax-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%);
}

.layer-1 {
  transform: translateZ(-10px) scale(2);
  opacity: 0.6;
  animation: parallax-1 15s infinite linear;
}

.layer-2 {
  transform: translateZ(-5px) scale(1.5);
  opacity: 0.4;
  animation: parallax-2 10s infinite linear;
}

.layer-3 {
  transform: translateZ(0);
  opacity: 0.3;
  animation: parallax-3 5s infinite linear;
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.particle {
  position: absolute;
  background: rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  animation: float 20s infinite linear;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at top right, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at bottom left, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
  z-index: 3;
}

@keyframes parallax-1 {
  0%, 100% { transform: translateZ(-10px) scale(2) translateY(0px); }
  50% { transform: translateZ(-10px) scale(2) translateY(-10px); }
}

@keyframes parallax-2 {
  0%, 100% { transform: translateZ(-5px) scale(1.5) translateY(0px); }
  50% { transform: translateZ(-5px) scale(1.5) translateY(-15px); }
}

@keyframes parallax-3 {
  0%, 100% { transform: translateZ(0) translateY(0px); }
  50% { transform: translateZ(0) translateY(-20px); }
}

@keyframes float {
  0% {
    transform: translateY(100vh) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(100px) rotate(360deg);
    opacity: 0;
  }
}

/* Анимированный логотип */
.dashboard-logo {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 4;
}

.logo-orbital {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orbit {
  position: absolute;
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  animation: orbit-rotate linear infinite;
}

.orbit-1 {
  width: 50px;
  height: 50px;
  animation-duration: 6s;
}

.orbit-2 {
  width: 65px;
  height: 65px;
  animation-duration: 8s;
  animation-direction: reverse;
}

.orbit-3 {
  width: 80px;
  height: 80px;
  animation-duration: 10s;
}

.satellite {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #d4af37;
  border-radius: 50%;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 8px rgba(212, 175, 55, 0.8);
}

.central-core {
  width: 25px;
  height: 25px;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 0 20px rgba(212, 175, 55, 0.5),
    inset 0 0 10px rgba(255, 255, 255, 0.2);
  animation: core-pulse 3s ease-in-out infinite;
}

.core-inner {
  width: 8px;
  height: 8px;
  background: #0a0a0a;
  border-radius: 50%;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
}

@keyframes orbit-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes core-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(212, 175, 55, 0.5); }
  50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(212, 175, 55, 0.8); }
}

/* Основной контент */
.dashboard-content {
  position: relative;
  z-index: 4;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.dashboard-content.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Хедер пользователя */
.user-header {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 50px;
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(21, 21, 21, 0.8));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 25px;
  padding: 30px;
  position: relative;
  overflow: hidden;
}

.user-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.05), transparent);
  transition: left 0.6s ease;
}

.user-header:hover::before {
  left: 100%;
}

.user-avatar {
  position: relative;
}

.avatar-circle {
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.8rem;
  color: #0a0a0a;
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
  position: relative;
  z-index: 2;
}

.avatar-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 110px;
  height: 110px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: glow-pulse 2s ease-in-out infinite;
}

.status-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 18px;
  height: 18px;
  border: 3px solid #1a1a1a;
  border-radius: 50%;
  z-index: 3;
}

.status-indicator.specialty { background: #10b981; }
.status-indicator.vakhta { background: #f59e0b; }
.status-indicator.none { background: #6b7280; }

.user-info {
  flex: 1;
}

.welcome-text {
  font-size: 2.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
}

.title-word {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  animation: title-word-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.title-word:nth-child(1) { animation-delay: 0.2s; }
.title-word:nth-child(2) { animation-delay: 0.4s; }

@keyframes title-word-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-name {
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-left: 10px;
}

.user-subtitle-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-subtitle {
  color: #9ca3af;
  font-size: 1.2rem;
  margin: 0;
}

.subtitle-decoration {
  display: flex;
  gap: 5px;
}

.decoration-dot {
  width: 6px;
  height: 6px;
  background: #d4af37;
  border-radius: 50%;
  animation: dot-pulse 2s infinite;
}

.decoration-dot:nth-child(2) { animation-delay: 0.3s; }
.decoration-dot:nth-child(3) { animation-delay: 0.6s; }

@keyframes dot-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.user-stats {
  display: flex;
  gap: 20px;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 15px;
  padding: 15px 20px;
  backdrop-filter: blur(10px);
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #d4af37;
}

.stat-label {
  font-size: 0.8rem;
  color: #9ca3af;
}

/* Текущий статус работы */
.current-work-section {
  margin-bottom: 50px;
}

.work-status-card {
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(21, 21, 21, 0.8));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 25px;
  padding: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.work-status-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
  transition: left 0.6s ease;
}

.work-status-card:hover::before {
  left: 100%;
}

.work-status-card:hover {
  border-color: rgba(212, 175, 55, 0.3);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.status-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.work-status-card:hover .status-glow {
  opacity: 1;
}

.status-content {
  display: flex;
  align-items: center;
  gap: 25px;
  flex: 1;
}

.status-icon {
  width: 80px;
  height: 80px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-background {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 50%;
  animation: icon-rotate 10s linear infinite;
}

.icon-foreground {
  font-size: 2rem;
  position: relative;
  z-index: 2;
}

.status-details {
  flex: 1;
}

.status-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 12px;
  backdrop-filter: blur(10px);
}

.status-badge.specialty {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-badge.vakhta {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-badge.none {
  background: rgba(107, 114, 128, 0.2);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.3);
}

.work-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: white;
  margin: 0 0 18px 0;
  background: linear-gradient(135deg, #ffffff, #d4af37);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.work-meta {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px 12px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.work-description {
  color: #9ca3af;
  margin: 0;
  font-size: 1.1rem;
}

.status-actions {
  flex-shrink: 0;
}

/* Метрики */
.metrics-section {
  margin-bottom: 50px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.metric-card {
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(21, 21, 21, 0.8));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 20px;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
  transition: left 0.6s ease;
}

.metric-card:hover::before {
  left: 100%;
}

.metric-card:hover {
  border-color: rgba(212, 175, 55, 0.3);
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.metric-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.metric-card:hover .metric-glow {
  opacity: 1;
}

.metric-icon {
  width: 60px;
  height: 60px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-icon .icon-background {
  background: rgba(212, 175, 55, 0.1);
}

.metric-icon.completed .icon-background {
  background: rgba(16, 185, 129, 0.2);
  animation: none;
}

.metric-icon.in-progress .icon-background {
  background: rgba(255, 193, 7, 0.2);
}

.metric-icon .icon-foreground {
  font-size: 1.5rem;
}

@keyframes icon-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin-bottom: 6px;
}

.metric-label {
  color: #9ca3af;
  font-size: 0.95rem;
}

.metric-trend {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.metric-trend.up {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.metric-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0 30px 15px;
}

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4af37, #f4d03f);
  border-radius: 2px;
  transition: width 1s ease-in-out;
}

/* Быстрые действия */
.quick-actions-section {
  margin-bottom: 50px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
}

.section-decoration {
  flex: 1;
  margin-left: 20px;
}

.decoration-line {
  height: 2px;
  background: linear-gradient(90deg, rgba(212, 175, 55, 0.3), transparent);
  border-radius: 1px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.action-card {
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(21, 21, 21, 0.8));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 20px;
  padding: 30px;
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
  transition: left 0.6s ease;
}

.action-card:hover::before {
  left: 100%;
}

.action-card:hover {
  border-color: rgba(212, 175, 55, 0.3);
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.action-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-card:hover .action-glow {
  opacity: 1;
}

.action-icon {
  width: 60px;
  height: 60px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-icon .icon-background {
  background: rgba(212, 175, 55, 0.1);
}

.action-icon .icon-foreground {
  font-size: 1.5rem;
}

.action-content {
  flex: 1;
}

.action-content h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  margin: 0 0 8px 0;
}

.action-content p {
  color: #9ca3af;
  margin: 0;
  font-size: 0.95rem;
}

.action-arrow {
  color: #d4af37;
  font-weight: bold;
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.action-card:hover .action-arrow {
  transform: translateX(5px);
}

/* Колонки контента */
.content-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 50px;
}

.column {
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(21, 21, 21, 0.8));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 20px;
  padding: 30px;
  transition: all 0.3s ease;
}

.column:hover {
  border-color: rgba(212, 175, 55, 0.2);
}

.view-all-link {
  color: #d4af37;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-all-link:hover {
  color: #f4d03f;
}

.link-arrow {
  transition: transform 0.3s ease;
}

.view-all-link:hover .link-arrow {
  transform: translateX(3px);
}

.recommendation-count {
  color: #9ca3af;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 6px 12px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

/* Активность */
.activity-list {
  min-height: 250px;
}

.empty-state {
  text-align: center;
  padding: 50px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 3.5rem;
  margin-bottom: 20px;
  opacity: 0.7;
}

.activity-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.activity-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(5px);
}

.activity-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.activity-item:hover .activity-glow {
  opacity: 1;
}

.activity-icon {
  width: 45px;
  height: 45px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon .icon-background {
  border-radius: 12px;
}

.activity-icon.work .icon-background {
  background: rgba(245, 158, 11, 0.2);
}

.activity-icon.completed .icon-background {
  background: rgba(16, 185, 129, 0.2);
}

.activity-icon .icon-foreground {
  font-size: 1.2rem;
}

.activity-content {
  flex: 1;
}

.activity-text {
  color: white;
  margin: 0 0 6px 0;
  font-weight: 500;
  font-size: 0.95rem;
}

.activity-time {
  color: #9ca3af;
  font-size: 0.85rem;
}

.activity-arrow {
  color: #d4af37;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.activity-item:hover .activity-arrow {
  transform: translateX(3px);
}

/* Рекомендации */
.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.recommendation-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.recommendation-card:hover {
  border-color: rgba(212, 175, 55, 0.3);
  transform: translateY(-5px);
}

.recommendation-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.recommendation-card:hover .recommendation-glow {
  opacity: 1;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.job-header h4 {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.salary {
  color: #10b981;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
}

.job-info {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
  font-size: 0.9rem;
  margin-bottom: 6px;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.places-badge {
  background: rgba(107, 114, 128, 0.2);
  color: #9ca3af;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.85rem;
  backdrop-filter: blur(10px);
}

/* Мотивационная секция */
.motivation-section {
  margin-bottom: 50px;
}

.motivation-card {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(244, 208, 63, 0.05));
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 25px;
  padding: 45px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  position: relative;
  overflow: hidden;
}

.motivation-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.motivation-card:hover .motivation-glow {
  opacity: 1;
}

.motivation-content {
  flex: 1;
}

.motivation-content h3 {
  font-size: 2.2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 20px 0;
  background: linear-gradient(135deg, #ffffff, #d4af37);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.motivation-content p {
  color: #9ca3af;
  font-size: 1.2rem;
  margin: 0 0 30px 0;
  line-height: 1.5;
}

.motivation-stats {
  display: flex;
  gap: 40px;
}

.stat {
  text-align: center;
}

.stat strong {
  display: block;
  font-size: 1.5rem;
  color: #d4af37;
  margin-bottom: 6px;
}

.stat span {
  font-size: 0.95rem;
  color: #9ca3af;
}

.motivation-action {
  flex-shrink: 0;
}

/* Кнопки */
.btn {
  padding: 12px 25px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-size: 14px;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  color: #0a0a0a;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(212, 175, 55, 0.4);
}

.btn-outline {
  background: transparent;
  color: #9ca3af;
  border: 1px solid #4b5563;
}

.btn-outline:hover {
  color: #d4af37;
  border-color: #d4af37;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.2);
}

.btn-glow {
  position: relative;
}

.btn-glow::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

.btn-glow:hover::after {
  width: 100%;
  height: 100%;
  opacity: 0;
}

.btn-large {
  padding: 16px 35px;
  font-size: 1.1rem;
  border-radius: 20px;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.85rem;
  border-radius: 12px;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 2;
}

.button-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  to {
    width: 300px;
    height: 300px;
    opacity: 0;
  }
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

/* Плавающие элементы */
.floating-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent);
  animation: float-element 8s ease-in-out infinite;
  filter: blur(1px);
}

.element-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.element-2 {
  width: 80px;
  height: 80px;
  top: 70%;
  left: 10%;
  animation-delay: -2s;
}

.element-3 {
  width: 100px;
  height: 100px;
  top: 20%;
  right: 10%;
  animation-delay: -4s;
}

.element-4 {
  width: 140px;
  height: 140px;
  top: 60%;
  right: 5%;
  animation-delay: -1s;
}

.element-5 {
  width: 90px;
  height: 90px;
  top: 80%;
  right: 20%;
  animation-delay: -3s;
}

@keyframes float-element {
  0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
  33% { transform: translateY(-30px) rotate(120deg) scale(1.1); }
  66% { transform: translateY(15px) rotate(240deg) scale(0.9); }
}

/* Адаптивность */
@media (max-width: 1200px) {
  .dashboard-content {
    max-width: 1000px;
  }
}

@media (max-width: 1024px) {
  .content-columns {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .motivation-card {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }

  .motivation-stats {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 20px 15px;
  }

  .user-header {
    flex-direction: column;
    text-align: center;
    gap: 20px;
    padding: 25px;
  }

  .user-subtitle-container {
    justify-content: center;
  }

  .work-status-card {
    flex-direction: column;
    text-align: center;
    gap: 25px;
    padding: 25px;
  }

  .status-content {
    flex-direction: column;
    text-align: center;
  }

  .work-meta {
    justify-content: center;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .section-decoration {
    margin-left: 0;
    width: 100%;
  }

  .dashboard-logo {
    top: 10px;
    right: 10px;
  }

  .logo-orbital {
    width: 60px;
    height: 60px;
  }

  .orbit-1 { width: 35px; height: 35px; }
  .orbit-2 { width: 50px; height: 50px; }
  .orbit-3 { width: 60px; height: 60px; }

  .central-core {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 480px) {
  .welcome-text {
    font-size: 1.8rem;
  }

  .work-title {
    font-size: 1.5rem;
  }

  .metric-card {
    padding: 20px;
  }

  .action-card {
    padding: 20px;
  }

  .column {
    padding: 20px;
  }

  .motivation-card {
    padding: 30px 20px;
  }

  .motivation-stats {
    flex-direction: column;
    gap: 25px;
  }

  .user-stats {
    justify-content: center;
    width: 100%;
  }
}
</style>