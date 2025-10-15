<template>
  <div class="slon-dashboard">
 <div class="background-image" :style="{ backgroundImage: `url(${backgroundImage})` }"></div>

   <div class="background-overlay"></div>
    <!-- Welcome Header -->
    <div class="welcome-header">

      <div class="welcome-content">
        <h1>🐘 Добро пожаловать, {{ authStore.user?.display_name }}!</h1>
        <p>Ваш центр управления промокодами и боровыми</p>
      </div>
      <div class="welcome-stats">
        <div class="stat-badge">
          <span class="stat-number">{{ totalStats.promo_codes || 0 }}</span>
          <span class="stat-label">Промокодов</span>
        </div>
        <div class="stat-badge">
          <span class="stat-number">{{ totalStats.total_borovs || 0 }}</span>
          <span class="stat-label">Боровов</span>
        </div>
        <div class="stat-badge highlight">
          <span class="stat-number">{{ totalStats.active_borovs || 0 }}</span>
          <span class="stat-label">Работают сейчас</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="dashboard-content">
      <!-- Navigation -->
      <div class="slon-nav">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['nav-tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-text">{{ tab.name }}</span>
          <span v-if="tab.count !== null" class="tab-count">
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Content Area -->
      <div class="content-area">
        <!-- Promocodes Tab -->
        <div v-if="activeTab === 'promocodes'" class="tab-content">
          <div class="tab-header">
            <div class="header-content">
              <h2>🎫 Мои промокоды</h2>
              <p>Создавайте и управляйте промокодами для привлечения боровов</p>
            </div>
            <div class="header-actions">
              <button @click="showCreatePromo = true" class="btn btn-primary">
                <span>➕</span>
                Создать промокод
              </button>
              <button @click="refreshData" class="btn btn-outline">
                <span>🔄</span>
                Обновить
              </button>
            </div>
          </div>

          <!-- Promocodes Grid -->
          <div class="promocodes-grid">
            <div
              v-for="promo in promocodes"
              :key="promo.id"
              class="promo-card"
              :class="{ 'featured': promo.borovs_count > 0 }"
            >
              <div class="promo-header">
                <div class="promo-main">
                  <h3>{{ promo.code }}</h3>
                  <p class="promo-description">{{ promo.description || 'Без описания' }}</p>
                </div>
                <div class="promo-stats">
                  <div class="stat-bubble">
                    <span class="stat-number">{{ promo.borovs_count }}</span>
                    <span class="stat-label">боровов</span>
                  </div>
                  <span :class="['status-badge', promo.is_active ? 'active' : 'inactive']">
                    {{ promo.is_active ? 'Активен' : 'Неактивен' }}
                  </span>
                </div>
              </div>

              <div class="promo-meta">
                <div class="meta-item">
                  <span class="meta-icon">📅</span>
                  <span class="meta-text">Создан: {{ formatDate(promo.created_at) }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">👥</span>
                  <span class="meta-text">Активаций: {{ promo.usage_count || 0 }}</span>
                </div>
              </div>

              <div class="promo-actions">
                <button
                  @click="copyPromoLink(promo.code)"
                  class="btn btn-outline btn-sm"
                  title="Скопировать ссылку"
                >
                  📋 Ссылка
                </button>
                <button
                  @click="togglePromoStatus(promo)"
                  :class="['btn', 'btn-sm', promo.is_active ? 'btn-warning' : 'btn-success']"
                >
                  {{ promo.is_active ? '⏸️ Стоп' : '▶️ Старт' }}
                </button>
                <button
                  @click="viewPromoStats(promo)"
                  class="btn btn-outline btn-sm"
                >
                  📊 Статистика
                </button>
              </div>

              <!-- QR Code Placeholder -->
              <div v-if="promo.is_active" class="promo-qr">
                <div class="qr-placeholder">
                  <div class="qr-icon">📱</div>
                  <p>QR-код для быстрой регистрации</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="promocodes.length === 0" class="empty-state">
            <div class="empty-icon">🎫</div>
            <h3>У вас пока нет промокодов</h3>
            <p>Создайте первый промокод чтобы начать привлекать боровов</p>
            <button @click="showCreatePromo = true" class="btn btn-primary">
              ➕ Создать первый промокод
            </button>
          </div>
        </div>

        <!-- Borovs Tab -->
        <div v-if="activeTab === 'borovs'" class="tab-content">
          <div class="tab-header">
            <div class="header-content">
              <h2>💪 Мои боровы</h2>
              <p>Боровы, зарегистрированные по вашим промокодам</p>
            </div>
            <div class="header-actions">
              <div class="filter-group">
                <select v-model="borovsFilter" class="filter-select">
                  <option value="all">Все боровы</option>
                  <option value="active">Работают сейчас</option>
                  <option value="inactive">Свободны</option>
                </select>
              </div>
              <button @click="refreshData" class="btn btn-outline">
                <span>🔄</span>
                Обновить
              </button>
            </div>
          </div>

          <!-- Borovs Statistics -->
          <div class="borovs-stats">
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <h3>{{ filteredBorovs.length }}</h3>
                <p>Всего боровов</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-info">
                <h3>{{ activeBorovsCount }}</h3>
                <p>Работают сейчас</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-info">
                <h3>{{ conversionRate }}%</h3>
                <p>Конверсия</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-info">
                <h3>{{ formatSalary(totalEarned) }}</h3>
                <p>Общий доход</p>
              </div>
            </div>
          </div>

          <!-- Borovs Table -->
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Боров</th>
                  <th>Контакты</th>
                  <th>Промокод</th>
                  <th>Текущая работа</th>
                  <th>Статистика</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="borov in filteredBorovs" :key="borov.id">
                  <td>
                    <div class="user-info">
                      <div class="user-avatar">💪</div>
                      <div class="user-details">
                        <strong>{{ borov.full_name }}</strong>
                        <div class="user-meta">
                          <span class="meta-item">Возраст: {{ calculateAge(borov.birth_date) }}</span>
                          <span class="meta-item">Регистрация: {{ formatDate(borov.created_at) }}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="contact-info">
                      <div class="contact-item">
                        <span class="contact-icon">📧</span>
                        {{ borov.email }}
                      </div>
                      <div class="contact-item">
                        <span class="contact-icon">📱</span>
                        {{ borov.phone }}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="promo-badge">{{ borov.promo_code }}</span>
                  </td>
                  <td>
                    <div v-if="borov.is_active" class="current-work">
                      <strong>{{ borov.current_vakhta }}</strong>
                      <p class="work-specialty">{{ borov.current_specialty }}</p>
                      <p class="work-dates">
                        {{ formatDate(borov.work_start_date) }} - {{ formatDate(borov.work_end_date) }}
                      </p>
                    </div>
                    <div v-else class="no-work">
                      <span class="status-text">Свободен</span>
                    </div>
                  </td>
                  <td>
                    <div class="borov-stats">
                      <div class="stat-item">
                        <span class="stat-label">Вахт:</span>
                        <span class="stat-value">{{ borov.total_vakhtas_completed || 0 }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">Дней:</span>
                        <span class="stat-value">{{ borov.total_work_days || 0 }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">Заработал:</span>
                        <span class="stat-value salary">{{ formatSalary(calculateBorovEarnings(borov)) }}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span :class="['status-badge', borov.is_active ? 'active' : 'inactive']">
                      {{ borov.is_active ? 'На вахте' : 'Свободен' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="filteredBorovs.length === 0" class="empty-state">
            <div class="empty-icon">💪</div>
            <h3>Пока нет боровов</h3>
            <p>Боровы появятся здесь после регистрации по вашим промокодам</p>
            <button @click="activeTab = 'promocodes'" class="btn btn-primary">
              🎫 Создать промокод
            </button>
          </div>
        </div>

        <!-- Statistics Tab -->
        <div v-if="activeTab === 'stats'" class="tab-content">
          <div class="tab-header">
            <div class="header-content">
              <h2>📊 Моя статистика</h2>
              <p>Аналитика эффективности ваших промокодов</p>
            </div>
            <div class="header-actions">
              <button @click="exportStats" class="btn btn-outline">
                <span>📥</span>
                Экспорт отчета
              </button>
            </div>
          </div>

          <!-- Stats Overview -->
          <div class="stats-overview">
            <div class="stats-grid">
              <div class="stat-card large">
                <h3>📈 Общая эффективность</h3>
                <div class="stat-list">
                  <div class="stat-item">
                    <span class="stat-label">Всего промокодов:</span>
                    <span class="stat-value">{{ totalStats.promo_codes || 0 }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Всего боровов:</span>
                    <span class="stat-value">{{ totalStats.total_borovs || 0 }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Конверсия:</span>
                    <span class="stat-value">{{ conversionRate }}%</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Активных боровов:</span>
                    <span class="stat-value">{{ totalStats.active_borovs || 0 }}</span>
                  </div>
                </div>
              </div>

              <div class="stat-card large">
                <h3>💰 Финансовая статистика</h3>
                <div class="stat-list">
                  <div class="stat-item">
                    <span class="stat-label">Общий доход:</span>
                    <span class="stat-value salary">{{ formatSalary(totalEarned) }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Средний доход с борова:</span>
                    <span class="stat-value">{{ formatSalary(averageEarnings) }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Отработано дней:</span>
                    <span class="stat-value">{{ totalWorkDays }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Средняя зарплата:</span>
                    <span class="stat-value">{{ formatSalary(averageSalary) }}/день</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Promo Effectiveness -->
            <div class="effectiveness-section">
              <h3>🎯 Эффективность промокодов</h3>
              <div class="effectiveness-chart">
                <div
                  v-for="promo in promocodes"
                  :key="promo.id"
                  class="promo-bar"
                >
                  <div class="promo-info">
                    <span class="promo-name">{{ promo.code }}</span>
                    <span class="promo-count">{{ promo.borovs_count }} боровов</span>
                  </div>
                  <div class="bar-container">
                    <div
                      class="bar-fill"
                      :style="{ width: calculatePromoEffectiveness(promo) + '%' }"
                      :class="getEffectivenessClass(promo)"
                    ></div>
                  </div>
                  <div class="bar-percentage">
                    {{ calculatePromoEffectiveness(promo) }}%
                  </div>
                </div>
              </div>
            </div>

            <!-- Weekly Activity -->
            <div class="activity-section">
              <h3>📅 Активность по неделям</h3>
              <div class="weekly-stats">
                <div
                  v-for="week in weeklyStats"
                  :key="week.week"
                  class="week-bar"
                >
                  <div class="week-label">
                    {{ formatWeek(week.week) }}
                  </div>
                  <div class="bar-container">
                    <div
                      class="bar-fill"
                      :style="{ width: (week.count / Math.max(...weeklyStats.map(w => w.count)) * 100) + '%' }"
                    ></div>
                  </div>
                  <div class="week-count">{{ week.count }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Tab -->
        <div v-if="activeTab === 'actions'" class="tab-content">
          <div class="tab-header">
            <div class="header-content">
              <h2>⚡ Быстрые действия</h2>
              <p>Все необходимые инструменты под рукой</p>
            </div>
          </div>

          <div class="actions-grid">
            <div class="action-card" @click="showCreatePromo = true">
              <div class="action-icon">🎫</div>
              <div class="action-content">
                <h3>Создать промокод</h3>
                <p>Сгенерировать новый промокод для привлечения боровов</p>
              </div>
              <div class="action-arrow">→</div>
            </div>

            <div class="action-card" @click="copyAllPromoCodes">
              <div class="action-icon">📋</div>
              <div class="action-content">
                <h3>Скопировать все промокоды</h3>
                <p>Скопировать все активные промокоды в буфер обмена</p>
              </div>
              <div class="action-arrow">→</div>
            </div>

            <div class="action-card" @click="generateQRCode">
              <div class="action-icon">📱</div>
              <div class="action-content">
                <h3>Генератор QR-кодов</h3>
                <p>Создать QR-коды для быстрой регистрации боровов</p>
              </div>
              <div class="action-arrow">→</div>
            </div>

            <div class="action-card" @click="exportReport">
              <div class="action-icon">📊</div>
              <div class="action-content">
                <h3>Отчет эффективности</h3>
                <p>Скачать детальный отчет по эффективности промокодов</p>
              </div>
              <div class="action-arrow">→</div>
            </div>

            <div class="action-card" @click="showBulkCreate = true">
              <div class="action-icon">🔄</div>
              <div class="action-content">
                <h3>Массовое создание</h3>
                <p>Создать несколько промокодов одновременно</p>
              </div>
              <div class="action-arrow">→</div>
            </div>

            <div class="action-card" @click="showSettings = true">
              <div class="action-icon">⚙️</div>
              <div class="action-content">
                <h3>Настройки профиля</h3>
                <p>Изменить контактные данные и настройки уведомлений</p>
              </div>
              <div class="action-arrow">→</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Promo Modal -->
    <div v-if="showCreatePromo" class="modal-overlay" @click="showCreatePromo = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>🎫 Создание нового промокода</h2>
          <button @click="showCreatePromo = false" class="close-btn">✕</button>
        </div>

        <form @submit.prevent="createPromoCode" class="modal-form">
          <div class="form-group">
            <label>Код промокода *</label>
            <div class="input-with-suggestion">
              <input
                v-model="newPromo.code"
                type="text"
                required
                placeholder="Например: SLON1_SUMMER"
                class="form-input"
                :class="{ 'error': codeError }"
              >
              <button type="button" @click="generateCode" class="btn-suggestion">
                🎲 Сгенерировать
              </button>
            </div>
            <small>Только латинские буквы, цифры и подчеркивания</small>
            <div v-if="codeError" class="error-message">
              {{ codeError }}
            </div>
          </div>

          <div class="form-group">
            <label>Описание промокода</label>
            <textarea
              v-model="newPromo.description"
              rows="3"
              placeholder="Краткое описание для чего этот промокод..."
              class="form-input"
            ></textarea>
            <small>Это описание увидят боровы при регистрации</small>
          </div>

          <div class="form-group">
            <label>Тип промокода</label>
            <div class="radio-group">
              <label class="radio-option">
                <input
                  v-model="newPromo.type"
                  type="radio"
                  value="standard"
                  checked
                >
                <span class="radio-label">
                  <span class="radio-icon">🎯</span>
                  <span class="radio-text">
                    <strong>Стандартный</strong>
                    <small>Обычный промокод для регистрации</small>
                  </span>
                </span>
              </label>

              <label class="radio-option">
                <input
                  v-model="newPromo.type"
                  type="radio"
                  value="bonus"
                >
                <span class="radio-label">
                  <span class="radio-icon">⭐</span>
                  <span class="radio-text">
                    <strong>Бонусный</strong>
                    <small>С дополнительными преимуществами</small>
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="showCreatePromo = false" class="btn btn-outline">
              Отмена
            </button>
            <button type="submit" :disabled="creatingPromo" class="btn btn-primary">
              <span v-if="creatingPromo" class="btn-spinner"></span>
              {{ creatingPromo ? 'Создание...' : '🎫 Создать промокод' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Notification -->
    <div v-if="showSuccess" class="notification success">
      <div class="notification-content">
        <span class="notification-icon">✅</span>
        <div class="notification-text">
          <strong>Промокод создан!</strong>
          <p>Промокод "{{ createdPromoCode }}" успешно создан и активирован</p>
        </div>
      </div>
      <button @click="showSuccess = false" class="notification-close">✕</button>
    </div>
  </div>
</template>

<script setup lang="ts">

const backgroundImage = '/business.jpeg'


definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()

// Data
const activeTab = ref('promocodes')
const promocodes = ref([])
const borovs = ref([])
const totalStats = ref({})
const loading = ref(false)
const showCreatePromo = ref(false)
const showSuccess = ref(false)
const borovsFilter = ref('all')
const creatingPromo = ref(false)
const createdPromoCode = ref('')
const codeError = ref('')

const newPromo = reactive({
  code: '',
  description: '',
  type: 'standard'
})

// Tabs configuration
const tabs = [
  { id: 'promocodes', name: 'Промокоды', icon: '🎫', count: promocodes.value.length },
  { id: 'borovs', name: 'Мои боровы', icon: '💪', count: borovs.value.length },
  { id: 'stats', name: 'Статистика', icon: '📊', count: null },
  { id: 'actions', name: 'Действия', icon: '⚡', count: null }
]

// Computed
const filteredBorovs = computed(() => {
  let filtered = borovs.value

  if (borovsFilter.value === 'active') {
    filtered = filtered.filter((b: any) => b.is_active)
  } else if (borovsFilter.value === 'inactive') {
    filtered = filtered.filter((b: any) => !b.is_active)
  }

  return filtered
})

const activeBorovsCount = computed(() => {
  return borovs.value.filter((b: any) => b.is_active).length
})

const conversionRate = computed(() => {
  const totalPromos = promocodes.value.length
  const totalBorovs = borovs.value.length
  if (totalPromos === 0) return 0
  return Math.round((totalBorovs / totalPromos) * 100)
})

const totalEarned = computed(() => {
  return borovs.value.reduce((total: number, borov: any) => {
    return total + (calculateBorovEarnings(borov) || 0)
  }, 0)
})

const averageEarnings = computed(() => {
  if (borovs.value.length === 0) return 0
  return Math.round(totalEarned.value / borovs.value.length)
})

const totalWorkDays = computed(() => {
  return borovs.value.reduce((total: number, borov: any) => {
    return total + (borov.total_work_days || 0)
  }, 0)
})

const averageSalary = computed(() => {
  if (totalWorkDays.value === 0) return 0
  return Math.round(totalEarned.value / totalWorkDays.value)
})

const weeklyStats = computed(() => {
  // Mock data - в реальном приложении будет с API
  return [
    { week: '2024-09-23', count: 5 },
    { week: '2024-09-16', count: 8 },
    { week: '2024-09-09', count: 3 },
    { week: '2024-09-02', count: 6 },
    { week: '2024-08-26', count: 4 }
  ]
})

// Methods
const loadSlonData = async () => {
  try {
    loading.value = true

    const [statsResponse, promocodesResponse, borovsResponse] = await Promise.all([
      $fetch('http://localhost:3001/api/slon/stats', {
        headers: { 'Authorization': `Bearer ${authStore.token}` }
      }),
      $fetch('http://localhost:3001/api/slon/promocodes', {
        headers: { 'Authorization': `Bearer ${authStore.token}` }
      }),
      $fetch('http://localhost:3001/api/slon/borovs', {
        headers: { 'Authorization': `Bearer ${authStore.token}` }
      })
    ])

    totalStats.value = statsResponse
    promocodes.value = promocodesResponse
    borovs.value = borovsResponse

    // Обновляем счетчики в табах
    tabs[0].count = promocodes.value.length
    tabs[1].count = borovs.value.length

  } catch (error) {
    console.error('Error loading slon data:', error)
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  await loadSlonData()
}

const createPromoCode = async () => {
  // Валидация кода
  if (!newPromo.code.match(/^[a-zA-Z0-9_-]{4,50}$/)) {
    codeError.value = 'Код должен содержать только латинские буквы, цифры, дефисы и подчеркивания (4-50 символов)'
    return
  }

  codeError.value = ''

  try {
    creatingPromo.value = true

    const response = await $fetch('http://localhost:3001/api/slon/promocodes', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authStore.token}` },
      body: {
        code: newPromo.code,
        description: newPromo.description
      }
    })

    createdPromoCode.value = newPromo.code
    showCreatePromo.value = false
    showSuccess.value = true

    // Сброс формы
    Object.assign(newPromo, {
      code: '',
      description: '',
      type: 'standard'
    })

    await refreshData()

    // Авто-скрытие уведомления
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)

  } catch (error: any) {
    console.error('Error creating promo code:', error)
    codeError.value = error.data?.error || 'Ошибка при создании промокода'
  } finally {
    creatingPromo.value = false
  }
}


const generateCode = () => {
  const prefix = authStore.user?.username?.toUpperCase() || 'SLON'
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  newPromo.code = `${prefix}_${random}`
}

const copyPromoLink = (code: string) => {
  const link = `${window.location.origin}/register?promo=${code}`
  navigator.clipboard.writeText(link)

  // Показать временное уведомление
  const notification = document.createElement('div')
  notification.className = 'copy-notification'
  notification.textContent = 'Ссылка скопирована в буфер!'
  document.body.appendChild(notification)

  setTimeout(() => {
    document.body.removeChild(notification)
  }, 2000)
}

const togglePromoStatus = async (promo: any) => {
  try {
    await $fetch(`http://localhost:3001/api/slon/promocodes/${promo.id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${authStore.token}` },
      body: { ...promo, is_active: !promo.is_active }
    })

    await refreshData()
  } catch (error) {
    console.error('Error toggling promo status:', error)
  }
}

const viewPromoStats = (promo: any) => {
  console.log('View stats for promo:', promo.code)
  // В реальном приложении здесь будет переход на детальную статистику
}

const copyAllPromoCodes = () => {
  const activePromos = promocodes.value.filter((p: any) => p.is_active)
  const codes = activePromos.map((p: any) => p.code).join('\n')
  navigator.clipboard.writeText(codes)

  // Показать уведомление
  const notification = document.createElement('div')
  notification.className = 'copy-notification'
  notification.textContent = `${activePromos.length} промокодов скопировано!`
  document.body.appendChild(notification)

  setTimeout(() => {
    document.body.removeChild(notification)
  }, 2000)
}

const generateQRCode = () => {
  console.log('Generate QR codes')
  // В реальном приложении здесь будет генератор QR-кодов
}

const exportReport = () => {
  console.log('Export report')
  // В реальном приложении здесь будет экспорт отчета
}

const exportStats = () => {
  console.log('Export statistics')
  // В реальном приложении здесь будет экспорт статистики
}

// Utility functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const formatSalary = (amount: number) => {
  return new Intl.NumberFormat('ru-RU').format(amount) + ' ₽'
}

const calculateAge = (birthDate: string) => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

const calculateBorovEarnings = (borov: any) => {
  // Простой расчет - можно улучшить с реальными данными
  return (borov.total_work_days || 0) * 5000
}

const calculatePromoEffectiveness = (promo: any) => {
  const maxBorovs = Math.max(...promocodes.value.map((p: any) => p.borovs_count))
  if (maxBorovs === 0) return 0
  return Math.round((promo.borovs_count / maxBorovs) * 100)
}

const getEffectivenessClass = (promo: any) => {
  const effectiveness = calculatePromoEffectiveness(promo)
  if (effectiveness >= 70) return 'high'
  if (effectiveness >= 40) return 'medium'
  return 'low'
}

const formatWeek = (weekString: string) => {
  const date = new Date(weekString)
  return date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })
}

// Lifecycle
onMounted(async () => {
  await loadSlonData()
})
</script>

<style scoped>
/* Стили для кабинета слона (аналогично админке, но с акцентом на промокоды) */

.welcome-content h1 {
  margin: 0 0 10px 0;
  font-size: 2.2rem;
}

.welcome-content p {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.welcome-stats {
  display: flex;
  gap: 30px;
  margin-top: 25px;
  padding-top: 25px;
  border-top: 1px solid rgba(255,255,255,0.3);
}

.stat-badge {
  text-align: center;
  flex: 1;
}

.stat-badge.highlight {
  background: rgba(255,255,255,0.2);
  padding: 15px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
  text-transform: uppercase;
}

.dashboard-content {
  display: flex;
  gap: 30px;
}

.slon-nav {
  width: 250px;
  flex-shrink: 0;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 15px 20px;
  border: none;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-tab:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
}

.nav-tab.active {
  background: #007bff;
  color: white;
}

.tab-icon {
  font-size: 1.2rem;
}

.tab-text {
  flex: 1;
  font-weight: 500;
  text-align: left;
}

.tab-count {
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  min-width: 24px;
  text-align: center;
}

.nav-tab.active .tab-count {
  background: rgba(255,255,255,0.3);
  color: white;
}

.content-area {
  flex: 1;
  min-height: 600px;
}

.tab-content {
  background: white;
  border-radius: 15px;
  padding: 0;
  box-shadow: 0 2px 20px rgba(0,0,0,0.1);
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 30px;
  border-bottom: 1px solid #e9ecef;
}

.header-content h2 {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
}

.header-content p {
  margin: 0;
  color: #6c757d;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
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
  border: 2px solid #e9ecef;
  color: #495057;
}

.btn-outline:hover {
  border-color: #007bff;
  color: #007bff;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.9rem;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background: #e0a800;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #218838;
}

/* Promocodes Grid */
.promocodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  padding: 30px;
}

.promo-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.promo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.promo-card.featured {
  border-color: #007bff;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
}

.promo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.promo-main h3 {
  margin: 0 0 8px 0;
  font-size: 1.3rem;
  color: #212529;
}

.promo-description {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.promo-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.stat-bubble {
  background: #e9ecef;
  padding: 6px 12px;
  border-radius: 20px;
  text-align: center;
}

.stat-bubble .stat-number {
  font-size: 1.1rem;
  font-weight: bold;
  color: #212529;
}

.stat-bubble .stat-label {
  font-size: 0.8rem;
  color: #6c757d;
  text-transform: lowercase;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.promo-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6c757d;
  font-size: 0.9rem;
}

.promo-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

.promo-qr {
  border-top: 1px solid #e9ecef;
  padding-top: 15px;
}

.qr-placeholder {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.qr-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.qr-placeholder p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 30px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #212529;
}

.empty-state p {
  margin: 0 0 25px 0;
  color: #6c757d;
  font-size: 1.1rem;
}

/* Borovs Statistics */
.borovs-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 0 30px 30px;
}

.stat-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-card.large {
  grid-column: span 1;
  flex-direction: column;
  align-items: flex-start;
}

.stat-card.large h3 {
  margin: 0 0 15px 0;
  font-size: 1.1rem;
}

.stat-icon {
  font-size: 2rem;
}

.stat-info h3 {
  margin: 0 0 5px 0;
  font-size: 1.5rem;
}

.stat-info p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Table Styles */
.table-container {
  padding: 0 30px 30px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.data-table th,
.data-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.data-table tr:hover {
  background: #f8f9fa;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: #007bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.user-details strong {
  display: block;
  margin-bottom: 4px;
}

.user-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-item {
  font-size: 0.8rem;
  color: #6c757d;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
}

.promo-badge {
  background: #e9ecef;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.current-work strong {
  display: block;
  margin-bottom: 4px;
}

.work-specialty {
  margin: 0 0 4px 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.work-dates {
  margin: 0;
  font-size: 0.8rem;
  color: #6c757d;
}

.no-work .status-text {
  color: #6c757d;
  font-style: italic;
}

.borov-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.stat-label {
  color: #6c757d;
}

.stat-value {
  font-weight: 500;
}

.stat-value.salary {
  color: #28a745;
  font-weight: bold;
}

/* Stats Overview */
.stats-overview {
  padding: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f3f4;
}

/* Effectiveness Chart */
.effectiveness-section {
  margin-bottom: 30px;
}

.effectiveness-section h3 {
  margin: 0 0 20px 0;
}

.effectiveness-chart {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.promo-bar {
  display: flex;
  align-items: center;
  gap: 15px;
}

.promo-info {
  display: flex;
  justify-content: space-between;
  width: 200px;
}

.promo-name {
  font-weight: 500;
}

.promo-count {
  color: #6c757d;
  font-size: 0.9rem;
}

.bar-container {
  flex: 1;
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.bar-fill.high {
  background: linear-gradient(90deg, #28a745, #20c997);
}

.bar-fill.medium {
  background: linear-gradient(90deg, #ffc107, #fd7e14);
}

.bar-fill.low {
  background: linear-gradient(90deg, #dc3545, #e83e8c);
}

.bar-percentage {
  width: 50px;
  text-align: right;
  font-weight: 500;
}

/* Weekly Activity */
.activity-section h3 {
  margin: 0 0 20px 0;
}

.weekly-stats {
  display: flex;
  gap: 15px;
  align-items: flex-end;
}

.week-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.week-label {
  font-size: 0.8rem;
  color: #6c757d;
}

.week-count {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Actions Grid */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 30px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 25px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-card:hover {
  border-color: #007bff;
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.action-icon {
  font-size: 2rem;
}

.action-content {
  flex: 1;
}

.action-content h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
}

.action-content p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.action-arrow {
  font-size: 1.2rem;
  color: #007bff;
  transition: transform 0.3s ease;
}

.action-card:hover .action-arrow {
  transform: translateX(5px);
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
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px 0;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.4rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 5px;
}

.close-btn:hover {
  color: #495057;
}

.modal-form {
  padding: 0 30px 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
}

.form-input.error {
  border-color: #dc3545;
}

.input-with-suggestion {
  display: flex;
  gap: 10px;
}

.input-with-suggestion .form-input {
  flex: 1;
}

.btn-suggestion {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
}

.btn-suggestion:hover {
  background: #5a6268;
}

.form-group small {
  display: block;
  margin-top: 6px;
  color: #6c757d;
  font-size: 0.8rem;
}

.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 6px;
}

/* Radio Group */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-option {
  cursor: pointer;
}

.radio-option input {
  display: none;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.radio-option input:checked + .radio-label {
  border-color: #007bff;
  background: #f8f9ff;
}

.radio-icon {
  font-size: 1.5rem;
}

.radio-text {
  display: flex;
  flex-direction: column;
}

.radio-text strong {
  margin-bottom: 4px;
}

.radio-text small {
  color: #6c757d;
  font-size: 0.8rem;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

/* Notifications */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  z-index: 1001;
  border-left: 4px solid #28a745;
}

.notification.success {
  border-left-color: #28a745;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-icon {
  font-size: 1.5rem;
}

.notification-text strong {
  display: block;
  margin-bottom: 4px;
}

.notification-text p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.notification-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
  padding: 5px;
}

.copy-notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  z-index: 1001;
  font-size: 0.9rem;
}

/* Loading States */
.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-content {
    flex-direction: column;
  }

  .slon-nav {
    width: 100%;
    display: flex;
    overflow-x: auto;
    gap: 8px;
  }

  .nav-tab {
    flex-shrink: 0;
    min-width: 150px;
  }

  .tab-header {
    flex-direction: column;
    gap: 15px;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .promocodes-grid {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .borovs-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .input-with-suggestion {
    flex-direction: column;
  }

  .welcome-stats {
    flex-direction: column;
    gap: 15px;
  }

  .stat-badge.highlight {
    order: -1;
  }
}

/* Filter Styles */
.filter-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.filter-select {
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #007bff;
}

.slon-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  min-height: 100vh;
}

/* Фоновое изображение - правильный путь */

/* Оверлей для читаемости */
.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 10, 10, 0.7);
  z-index: -1;
}

/* Обновите стили контента для прозрачности */
.welcome-header {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  color: white;
  padding: 40px;
  border-radius: 20px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.promo-card, .stat-card, .action-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.modal-overlay {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Убедитесь, что контент поверх фона */
.welcome-header,
.tab-content,
.modal-content {
  position: relative;
  z-index: 1;
}

</style scoped>