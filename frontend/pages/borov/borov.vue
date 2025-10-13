<template>
  <div class="borov-dashboard">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-background">
        <div class="hero-glow"></div>
        <div class="hero-particles">
          <div class="particle" v-for="i in 15" :key="i" :style="particleStyle(i)"></div>
        </div>
      </div>

      <div class="hero-content">
        <div class="welcome-section">
          <div class="avatar-container">
            <div class="user-avatar">
              {{ getInitials(authStore.user?.display_name) }}
            </div>
            <div class="online-status"></div>
          </div>

          <div class="welcome-text">
            <h1 class="welcome-title">
              <span class="greeting">👋 Привет, {{ authStore.user?.display_name }}!</span>
              <span class="status-dot" :class="currentWork.type"></span>
            </h1>
            <p class="welcome-subtitle">Управляй своими вахтами и находи новые возможности</p>
          </div>
        </div>

        <div class="status-section">
          <div class="status-card" :class="currentWork.type">
            <div class="status-glow"></div>
            <div class="status-icon">
              <span v-if="currentWork.type === 'specialty'">💼</span>
              <span v-else-if="currentWork.type === 'vakhta'">🏕️</span>
              <span v-else>🌟</span>
            </div>
            <div class="status-info">
              <div class="status-badge" :class="currentWork.type">
                {{ getStatusText(currentWork.type) }}
              </div>
              <h3 v-if="currentWork.type === 'specialty'">
                {{ currentWork.work.specialty_title }}
              </h3>
              <h3 v-else-if="currentWork.type === 'vakhta'">
                {{ currentWork.work.vakhta_title }}
              </h3>
              <h3 v-else>Готов к работе</h3>

              <div class="status-details" v-if="currentWork.type !== 'none'">
                <div class="detail-item">
                  <span class="detail-icon">📍</span>
                  <span>{{ currentWork.work.location }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">📅</span>
                  <span>до {{ formatDate(currentWork.work.end_date) }}</span>
                </div>
                <div class="contact-info" v-if="currentWork.type === 'vakhta'">
                  <div class="contact-badge">
                    📞 С вами скоро свяжутся
                  </div>
                </div>
              </div>

              <div class="status-details" v-else>
                <p>Выберите вахту и начните работать</p>
              </div>
            </div>
            <div class="status-actions" v-if="currentWork.type !== 'none'">
              <button @click="leaveWork" class="btn btn-warning">
                <span class="btn-icon">🚪</span>
                Отменить запись
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions-section">
      <h2 class="section-title">
        <span class="title-icon">⚡</span>
        Быстрые действия
      </h2>
      <div class="actions-grid">
        <nuxt-link to="/borov/vakhtas" class="action-card primary" @click.native="trackAction('vakhtas')">
          <div class="action-glow"></div>
          <div class="action-icon">🏕️</div>
          <div class="action-content">
            <h3>Записаться на вахту</h3>
            <p>Найди подходящую вахту и начни работать</p>
          </div>
          <div class="action-arrow">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </nuxt-link>

        <nuxt-link to="/borov/specialties" class="action-card secondary" @click.native="trackAction('specialties')">
          <div class="action-glow"></div>
          <div class="action-icon">💼</div>
          <div class="action-content">
            <h3>Мои специальности</h3>
            <p>Управляй своими профессиями</p>
          </div>
          <div class="action-arrow">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </nuxt-link>

        <nuxt-link to="/borov/history" class="action-card accent" @click.native="trackAction('history')">
          <div class="action-glow"></div>
          <div class="action-icon">📊</div>
          <div class="action-content">
            <h3>История работы</h3>
            <p>Вся твоя рабочая биография</p>
          </div>
          <div class="action-arrow">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </nuxt-link>

        <nuxt-link to="/borov/profile" class="action-card neutral" @click.native="trackAction('profile')">
          <div class="action-glow"></div>
          <div class="action-icon">👤</div>
          <div class="action-content">
            <h3>Мой профиль</h3>
            <p>Настройки и личная информация</p>
          </div>
          <div class="action-arrow">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </nuxt-link>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-section">
      <h2 class="section-title">
        <span class="title-icon">📈</span>
        Моя статистика
      </h2>
      <div class="stats-grid">
        <div class="stat-card" v-for="stat in formattedStats" :key="stat.label">
          <div class="stat-glow"></div>
          <div class="stat-icon">{{ stat.icon }}</div>
          <div class="stat-content">
            <div class="stat-number" :style="{ color: stat.color }">
              {{ stat.value }}
            </div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
          <div class="stat-trend" v-if="stat.trend">
            <span :class="stat.trend.type">{{ stat.trend.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="activity-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-icon">📝</span>
          Недавняя активность
        </h2>
        <nuxt-link to="/borov/history" class="btn-link">
          <span>Вся история</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </nuxt-link>
      </div>

      <div class="activity-list">
        <div v-if="recentActivity.length === 0" class="empty-activity">
          <div class="empty-icon">🎯</div>
          <h4>Начни свою первую работу!</h4>
          <p>Запишись на вахту и начни зарабатывать</p>
          <nuxt-link to="/borov/vakhtas" class="btn btn-primary">
            <span class="btn-icon">🏕️</span>
            Найти вахту
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
              {{ getActivityIcon(activity.type) }}
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.text }}</p>
              <div class="activity-meta">
                <span class="activity-time">{{ formatTime(activity.date) }}</span>
                <span class="activity-status" :class="activity.status">{{ activity.statusText }}</span>
              </div>
            </div>
            <div class="activity-arrow">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- Notification System -->
    <div class="notification-container">
      <TransitionGroup name="notification">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification"
          :class="notification.type"
        >
          <div class="notification-icon">
            <span v-if="notification.type === 'success'">✅</span>
            <span v-else-if="notification.type === 'error'">❌</span>
            <span v-else>ℹ️</span>
          </div>
          <div class="notification-content">
            <p class="notification-title">{{ notification.title }}</p>
            <p class="notification-message">{{ notification.message }}</p>
          </div>
          <button @click="removeNotification(notification.id)" class="notification-close">
            ×
          </button>
        </div>
      </TransitionGroup>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>Загружаем ваши данные...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

// Реактивные данные
const currentWork = ref({ type: 'none', work: null })
const stats = ref({})
const recentActivity = ref([])
const recommendations = ref([])
const loading = ref(false)
const notifications = ref([])

// Вычисляемые свойства
const totalEarned = computed(() => {
  return (stats.value.total_work_days || 0) * 4500
})



// Методы
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
      .slice(0, 4)
      .map((item: any) => ({
        id: item.id,
        type: item.status === 'active' ? 'work' : 'completed',
        text: `${item.status === 'active' ? 'Записался на' : 'Завершил'} "${item.specialty_title}"`,
        date: item.joined_at,
        status: item.status,
        statusText: item.status === 'active' ? 'Ожидает связи' : 'Завершено'
      }))

    // Загружаем рекомендации если нет работы
    if (currentWork.value.type === 'none') {
      await loadRecommendations()
    }

  } catch (error) {
    console.error('Error loading dashboard data:', error)
    showNotification('Ошибка загрузки', 'Не удалось загрузить данные', 'error')
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
              enterprise_name: enterprise.title,
              location: enterprise.location,
              is_hot: specialty.free_places < 3,
              is_urgent: specialty.free_places === 1,
              contact_soon: true
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

const leaveWork = async () => {
  try {
    if (!confirm('Вы уверены, что хотите отменить запись на эту вахту?')) return

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
      showNotification('Запись отменена', 'Вы успешно отменили запись на вахту', 'success')
    }
  } catch (error: any) {
    console.error('Error leaving work:', error)
    showNotification('Ошибка', error.data?.error || 'Не удалось отменить запись', 'error')
  }
}

const applyForJob = (job: any) => {
  navigateTo('/borov/vakhtas')
  showNotification('Успешно!', 'Вы записались на вахту. С вами свяжутся в ближайшее время.', 'success')
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
  const statusMap: any = {
    specialty: 'Работаю',
    vakhta: 'На вахте',
    none: 'Свободен'
  }
  return statusMap[type] || 'Неизвестно'
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
    work: '📝',
    completed: '✅',
    cancelled: '❌'
  }
  return icons[type] || '📅'
}

const showNotification = (title: string, message: string, type: string = 'info') => {
  const id = Date.now()
  notifications.value.push({
    id,
    title,
    message,
    type
  })

  setTimeout(() => {
    removeNotification(id)
  }, 5000)
}

const removeNotification = (id: number) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

const particleStyle = (index: number) => {
  const size = Math.random() * 4 + 2
  const duration = Math.random() * 20 + 10
  const delay = Math.random() * 5
  return {
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }
}

// Хуки жизненного цикла
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
  position: relative;
}

/* Hero Section */
.hero-section {
  margin-bottom: 40px;
  position: relative;
  border-radius: 24px;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 1;
}

.hero-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

.hero-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float 20s infinite linear;
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

.hero-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  align-items: start;
  padding: 40px;
  color: white;
}

.welcome-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-container {
  position: relative;
}

.user-avatar {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.online-status {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 16px;
  height: 16px;
  background: #4ade80;
  border: 2px solid white;
  border-radius: 50%;
}

.welcome-title {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: white;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-dot.specialty { background: #4ade80; }
.status-dot.vakhta { background: #f59e0b; }
.status-dot.none { background: #94a3b8; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.welcome-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

/* Status Card */
.status-section {
  position: relative;
}

.status-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.status-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.status-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.status-card:hover .status-glow {
  opacity: 1;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 20px;
}

.status-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.status-info {
  flex: 1;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.status-badge.specialty {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.status-badge.vakhta {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-badge.none {
  background: rgba(148, 163, 184, 0.2);
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.status-info h3 {
  margin: 0 0 15px 0;
  color: white;
  font-size: 1.3rem;
}

.status-details {
  color: rgba(255, 255, 255, 0.8);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}

.contact-info {
  margin-top: 10px;
}

.contact-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border-radius: 12px;
  font-size: 0.8rem;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

/* Quick Actions */
.quick-actions-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 25px;
  color: #1f2937;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  font-size: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.action-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-card:hover .action-glow {
  opacity: 1;
}

.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.action-card.primary {
  border-color: #3b82f6;
}

.action-card.secondary {
  border-color: #10b981;
}

.action-card.accent {
  border-color: #f59e0b;
}

.action-card.neutral {
  border-color: #6b7280;
}

.action-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.action-content h3 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 1.2rem;
}

.action-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.action-arrow {
  color: #3b82f6;
  margin-left: auto;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.action-card:hover .action-arrow {
  transform: translateX(5px);
}

/* Stats Section */
.stats-section {
  margin-bottom: 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.15);
}

.stat-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover .stat-glow {
  opacity: 1;
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.8;
  flex-shrink: 0;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  color: #6b7280;
  font-size: 0.9rem;
}

.stat-trend {
  margin-left: auto;
}

.stat-trend .up {
  color: #10b981;
  font-size: 0.8rem;
  font-weight: 600;
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
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: gap 0.3s ease;
}

.btn-link:hover {
  gap: 10px;
}

.activity-list {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
}

.empty-activity {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.7;
}

.empty-activity h4 {
  margin: 0 0 10px 0;
  color: #374151;
}

.empty-activity p {
  margin: 0 0 20px 0;
}

.activity-items {
  padding: 10px 0;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 30px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.activity-item:hover {
  background: #f9fafb;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.activity-item:hover .activity-glow {
  opacity: 1;
}

.activity-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.activity-icon.work {
  background: #fff7ed;
  color: #ea580c;
}

.activity-icon.completed {
  background: #f0fdf4;
  color: #16a34a;
}

.activity-icon.cancelled {
  background: #fef2f2;
  color: #dc2626;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0 0 8px 0;
  color: #374151;
  font-weight: 500;
}

.activity-meta {
  display: flex;
  align-items: center;
  gap: 15px;
}

.activity-time {
  font-size: 0.8rem;
  color: #6b7280;
}

.activity-status {
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 10px;
  font-weight: 600;
}

.activity-status.pending {
  background: #fef3c7;
  color: #d97706;
}

.activity-status.completed {
  background: #d1fae5;
  color: #065f46;
}

.activity-arrow {
  color: #9ca3af;
  transition: transform 0.3s ease;
}

.activity-item:hover .activity-arrow {
  transform: translateX(5px);
  color: #3b82f6;
}

/* Recommendations */
.recommendations-section {
  margin-bottom: 40px;
}

.section-badge {
  background: #f59e0b;
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: 10px;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.recommendation-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  border: 2px solid #e5e7eb;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.recommendation-card.hot {
  border-color: #f59e0b;
}

.recommendation-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.job-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.recommendation-card:hover .job-glow {
  opacity: 1;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.job-header h4 {
  margin: 0;
  color: #1f2937;
  font-size: 1.2rem;
  flex: 1;
}

.job-badges {
  display: flex;
  gap: 8px;
}

.job-badge {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
}

.job-badge.hot {
  background: #fef3c7;
  color: #d97706;
}

.job-badge.urgent {
  background: #fee2e2;
  color: #dc2626;
}

.job-info {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #6b7280;
  font-size: 0.9rem;
}

.job-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 12px;
}

.salary {
  color: #059669;
  font-weight: 600;
  font-size: 1.1rem;
}

.places {
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Buttons */
.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
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
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.btn-warning {
  background: #f59e0b;
  color: white;
}

.btn-warning:hover {
  background: #d97706;
  transform: translateY(-2px);
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.9rem;
}

.btn-full {
  width: 100%;
  justify-content: center;
}

.btn-icon {
  font-size: 1.1rem;
}

/* Notifications */
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.notification {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-left: 4px solid #3b82f6;
  animation: slideInRight 0.3s ease;
}

.notification.success {
  border-left-color: #10b981;
}

.notification.error {
  border-left-color: #ef4444;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1f2937;
}

.notification-message {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.notification-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-close:hover {
  color: #6b7280;
}

/* Loading */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(10px);
}

.loading-content {
  text-align: center;
  color: white;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255,255,255,0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .borov-dashboard {
    padding: 15px;
  }

  .hero-content {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 30px 20px;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .welcome-section {
    flex-direction: column;
    text-align: center;
    gap: 15px;
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

  .job-badges {
    align-self: flex-start;
  }

  .notification-container {
    left: 20px;
    right: 20px;
    max-width: none;
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

  .job-details {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .hero-content {
    padding: 20px 15px;
  }

  .welcome-title {
    font-size: 1.7rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .borov-dashboard {
    background: #0f0f0f;
    color: white;
  }

  .action-card,
  .stat-card,
  .activity-list,
  .recommendation-card {
    background: #1a1a1a;
    color: white;
  }

  .action-content h3,
  .stat-label,
  .activity-text {
    color: white;
  }

  .action-content p,
  .activity-time {
    color: #a0a0a0;
  }
}
</style>