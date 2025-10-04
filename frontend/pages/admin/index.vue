<template>
  <div class="admin-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1>👑 Панель управления Borovy</h1>
        <p>Полный контроль над системой вахтовой работы</p>
      </div>
      <div class="header-actions">
        <button @click="refreshData" class="btn btn-outline" title="Обновить данные">
          🔄 Обновить
        </button>
        <div class="last-updated">
          Обновлено: {{ lastUpdated }}
        </div>
      </div>
    </div>

    <!-- Statistics Overview -->
    <div class="stats-overview">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🐘</div>
          <div class="stat-info">
            <h3>{{ totalStats.slons_count || 0 }}</h3>
            <p>Активных слонов</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💪</div>
          <div class="stat-info">
            <h3>{{ totalStats.borovs_count || 0 }}</h3>
            <p>Всего боровов</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🏗️</div>
          <div class="stat-info">
            <h3>{{ totalStats.vakhtas_count || 0 }}</h3>
            <p>Предприятий</p>
            <div class="stat-trend">
              {{ totalStats.active_vakhtas_count || 0 }} активных
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🎫</div>
          <div class="stat-info">
            <h3>{{ totalStats.promo_codes || 0 }}</h3>
            <p>Промокодов</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions-section">
      <h2>⚡ Быстрые действия</h2>
      <div class="actions-grid">
        <button @click="showCreateSlon = true" class="action-card">
          <span class="action-icon">🐘</span>
          <span class="action-text">Добавить Слона</span>
        </button>

        <button @click="showCreateVakhta = true" class="action-card">
          <span class="action-icon">🏗️</span>
          <span class="action-text">Новое Предприятие</span>
        </button>

        <button @click="showCreatePromo = true" class="action-card">
          <span class="action-icon">🎫</span>
          <span class="action-text">Создать Промокод</span>
        </button>

        <button @click="exportData" class="action-card">
          <span class="action-icon">📊</span>
          <span class="action-text">Экспорт данных</span>
        </button>
      </div>
    </div>

    <!-- Main Content Tabs -->
    <div class="content-tabs">
      <div class="tabs-header">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-text">{{ tab.name }}</span>
          <span v-if="tab.count !== null" class="tab-count">
            {{ getTabCount(tab.id) }}
          </span>
        </button>
      </div>

      <div class="tab-content">
        <!-- Slons Management -->
        <div v-if="activeTab === 'slons'" class="tab-pane">
          <div class="section-header">
            <h2>🐘 Управление Слонами</h2>
            <button @click="showCreateSlon = true" class="btn btn-primary">
              ➕ Добавить Слона
            </button>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Слон</th>
                  <th>Контакты</th>
                  <th>Статистика</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="slon in dashboardData.slons" :key="slon.id">
                  <td>
                    <div class="user-info">
                      <div class="user-avatar">🐘</div>
                      <div class="user-details">
                        <strong>{{ slon.display_name }}</strong>
                        <small>@{{ slon.username }}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="contact-info">
                      <div v-if="slon.contact_phone" class="contact-item">
                        📱 {{ slon.contact_phone }}
                      </div>
                      <div v-if="slon.contact_email" class="contact-item">
                        📧 {{ slon.contact_email }}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="stats-info">
                      <div class="stat-item">
                        <span class="stat-value">{{ slon.promo_codes_count || 0 }}</span>
                        <span class="stat-label">промокодов</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-value">{{ slon.borovs_count || 0 }}</span>
                        <span class="stat-label">боровов</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span :class="['status-badge', slon.is_active ? 'active' : 'inactive']">
                      {{ slon.is_active ? 'Активен' : 'Неактивен' }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button
                        @click="toggleSlonStatus(slon)"
                        :class="['btn', 'btn-sm', slon.is_active ? 'btn-warning' : 'btn-success']"
                      >
                        {{ slon.is_active ? '⏸️' : '▶️' }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Enterprises Management -->
        <div v-if="activeTab === 'enterprises'" class="tab-pane">
          <div class="section-header">
            <h2>🏗️ Управление Предприятиями</h2>
            <button @click="showCreateVakhta = true" class="btn btn-primary">
              ➕ Новое Предприятие
            </button>
          </div>

          <div class="enterprises-grid">
            <div
              v-for="vakhta in dashboardData.vakhtas"
              :key="vakhta.id"
              class="enterprise-card"
            >
              <div class="enterprise-header">
                <h3>{{ vakhta.title }}</h3>
                <span :class="['status-badge', vakhta.is_active ? 'active' : 'inactive']">
                  {{ vakhta.is_active ? 'Активно' : 'Неактивно' }}
                </span>
              </div>

              <div class="enterprise-info">
                <p class="location">📍 {{ vakhta.location }}</p>
                <p class="dates">📅 {{ formatDate(vakhta.start_date) }} - {{ formatDate(vakhta.end_date) }}</p>
                <p class="workers">👥 {{ vakhta.current_workers || 0 }}/{{ vakhta.total_places }} работников</p>
              </div>

              <div class="enterprise-actions">
                <button
                  @click="toggleVakhtaStatus(vakhta)"
                  :class="['btn', 'btn-sm', vakhta.is_active ? 'btn-warning' : 'btn-success']"
                >
                  {{ vakhta.is_active ? '⏸️ Стоп' : '▶️ Старт' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Promocodes Management -->
        <div v-if="activeTab === 'promocodes'" class="tab-pane">
          <div class="section-header">
            <h2>🎫 Управление Промокодами</h2>
            <button @click="showCreatePromo = true" class="btn btn-primary">
              ➕ Создать Промокод
            </button>
          </div>

          <div class="promocodes-grid">
            <div
              v-for="promo in dashboardData.promocodes"
              :key="promo.id"
              class="promocode-card"
            >
              <div class="promo-header">
                <h3>{{ promo.code }}</h3>
                <span class="usage-badge">
                  Использован {{ promo.borovs_count }} раз
                </span>
              </div>

              <div class="promo-info">
                <p class="slon">🐘 Создан: {{ promo.slon_name }}</p>
                <p class="description" v-if="promo.description">{{ promo.description }}</p>
                <p class="created">📅 Создан: {{ formatDate(promo.created_at) }}</p>
              </div>

              <div class="promo-actions">
                <span :class="['status-badge', promo.is_active ? 'active' : 'inactive']">
                  {{ promo.is_active ? 'Активен' : 'Неактивен' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Borovs Management -->
        <div v-if="activeTab === 'borovs'" class="tab-pane">
          <div class="section-header">
            <h2>💪 Управление Боровами</h2>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Боров</th>
                  <th>Контакты</th>
                  <th>Промокод</th>
                  <th>Статистика</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="borov in dashboardData.borovs" :key="borov.id">
                  <td>
                    <div class="user-info">
                      <div class="user-avatar">💪</div>
                      <div class="user-details">
                        <strong>{{ borov.full_name }}</strong>
                        <small>Возраст: {{ calculateAge(borov.birth_date) }}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="contact-info">
                      <div class="contact-item">📧 {{ borov.email }}</div>
                      <div class="contact-item">📱 {{ borov.phone }}</div>
                    </div>
                  </td>
                  <td>
                    <span class="promo-code">{{ borov.promo_code }}</span>
                    <small>от {{ borov.slon_name }}</small>
                  </td>
                  <td>
                    <div class="stats-info">
                      <div class="stat-item">
                        <span class="stat-value">{{ borov.total_vakhtas_completed || 0 }}</span>
                        <span class="stat-label">вахт</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-value">{{ borov.total_work_days || 0 }}</span>
                        <span class="stat-label">дней</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span :class="['status-badge', borov.current_vakhta ? 'active' : 'inactive']">
                      {{ borov.current_vakhta ? 'Работает' : 'Свободен' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CreateSlonModal
      v-if="showCreateSlon"
      @close="showCreateSlon = false"
      @saved="handleSlonCreated"
    />

    <CreateVakhtaModal
      v-if="showCreateVakhta"
      @close="showCreateVakhta = false"
      @saved="handleVakhtaCreated"
    />

    <CreatePromoModal
      v-if="showCreatePromo"
      @close="showCreatePromo = false"
      @saved="handlePromoCreated"
    />

    <!-- Notification -->
    <div v-if="notification.show" class="notification" :class="notification.type">
      <div class="notification-content">
        <span class="notification-icon">{{ notification.icon }}</span>
        <div class="notification-text">
          <strong>{{ notification.title }}</strong>
          <p>{{ notification.message }}</p>
        </div>
      </div>
      <button @click="notification.show = false" class="notification-close">✕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()

// Data
const dashboardData = ref({
  stats: {},
  slons: [],
  promocodes: [],
  borovs: [],
  vakhtas: []
})

const activeTab = ref('slons')
const loading = ref(false)
const showCreateSlon = ref(false)
const showCreateVakhta = ref(false)
const showCreatePromo = ref(false)
const lastUpdated = ref('')

const notification = ref({
  show: false,
  title: '',
  message: '',
  type: 'success',
  icon: '✅'
})

// Tabs configuration
const tabs = [
  { id: 'slons', name: 'Слоны', icon: '🐘' },
  { id: 'enterprises', name: 'Предприятия', icon: '🏗️' },
  { id: 'promocodes', name: 'Промокоды', icon: '🎫' },
  { id: 'borovs', name: 'Боровы', icon: '💪' }
]

// Computed
const totalStats = computed(() => dashboardData.value.stats || {})

const getTabCount = (tabId: string) => {
  switch (tabId) {
    case 'slons': return dashboardData.value.slons?.length || 0
    case 'enterprises': return dashboardData.value.vakhtas?.length || 0
    case 'promocodes': return dashboardData.value.promocodes?.length || 0
    case 'borovs': return dashboardData.value.borovs?.length || 0
    default: return 0
  }
}

// Methods
const loadAdminDashboard = async () => {
  try {
    loading.value = true

    const response = await $fetch('http://localhost:3001/api/admin/dashboard', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    dashboardData.value = response
    lastUpdated.value = new Date().toLocaleTimeString('ru-RU')

  } catch (error) {
    console.error('Error loading admin dashboard:', error)
    showNotification('Ошибка загрузки', 'Не удалось загрузить данные', 'error')
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  await loadAdminDashboard()
  showNotification('Данные обновлены', 'Все данные успешно обновлены', 'success')
}

const toggleSlonStatus = async (slon: any) => {
  try {
    await $fetch(`http://localhost:3001/api/admin/slons/${slon.id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${authStore.token}` },
      body: {
        ...slon,
        is_active: !slon.is_active
      }
    })

    showNotification(
      'Статус изменен',
      `Слон "${slon.display_name}" ${!slon.is_active ? 'активирован' : 'деактивирован'}`,
      'success'
    )
    await refreshData()
  } catch (error: any) {
    showNotification('Ошибка', error.data?.error || 'Не удалось изменить статус', 'error')
  }
}

const toggleVakhtaStatus = async (vakhta: any) => {
  try {
    await $fetch(`http://localhost:3001/api/admin/vakhtas/${vakhta.id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${authStore.token}` },
      body: {
        ...vakhta,
        is_active: !vakhta.is_active
      }
    })

    showNotification(
      'Статус изменен',
      `Предприятие "${vakhta.title}" ${!vakhta.is_active ? 'активировано' : 'деактивировано'}`,
      'success'
    )
    await refreshData()
  } catch (error: any) {
    showNotification('Ошибка', error.data?.error || 'Не удалось изменить статус', 'error')
  }
}

const exportData = () => {
  showNotification('Экспорт', 'Функция экспорта в разработке', 'info')
}

const handleSlonCreated = () => {
  showCreateSlon.value = false
  refreshData()
}

const handleVakhtaCreated = () => {
  showCreateVakhta.value = false
  refreshData()
}

const handlePromoCreated = () => {
  showCreatePromo.value = false
  refreshData()
}

// Utility functions
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const calculateAge = (birthDate: string) => {
  if (!birthDate) return '-'
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

const showNotification = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' }

  notification.value = {
    show: true,
    title,
    message,
    type,
    icon: icons[type]
  }

  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

// Lifecycle
onMounted(async () => {
  await loadAdminDashboard()
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px;
}

.dashboard-header {
  background: white;
  border-radius: 15px;
  padding: 25px 30px;
  margin-bottom: 25px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.8rem;
}

.header-content p {
  margin: 0;
  color: #666;
  font-size: 1.1rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.last-updated {
  color: #666;
  font-size: 0.9rem;
}

.stats-overview {
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-info h3 {
  margin: 0 0 5px 0;
  font-size: 2rem;
  color: #333;
}

.stat-info p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 0.9rem;
}

.stat-trend {
  font-size: 0.8rem;
  font-weight: 500;
  color: #28a745;
}

.quick-actions-section {
  background: white;
  border-radius: 15px;
  padding: 25px 30px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.quick-actions-section h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.4rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.action-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

.action-card:hover {
  border-color: #007bff;
  background: #f8f9ff;
  transform: translateY(-2px);
}

.action-icon {
  font-size: 2rem;
}

.action-text {
  font-weight: 600;
  color: #333;
}

.content-tabs {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  overflow: hidden;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 25px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  color: #666;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tab-button.active {
  color: #007bff;
  border-bottom-color: #007bff;
  background: white;
}

.tab-count {
  background: #e9ecef;
  color: #495057;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tab-button.active .tab-count {
  background: #007bff;
  color: white;
}

.tab-content {
  padding: 30px;
}

.tab-pane {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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

.table-container {
  background: #f8f9fa;
  border-radius: 10px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
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
  color: #333;
  font-size: 0.9rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  font-size: 1.5rem;
}

.user-details strong {
  display: block;
  margin-bottom: 4px;
  color: #333;
}

.user-details small {
  color: #666;
  font-size: 0.8rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.contact-item {
  font-size: 0.9rem;
  color: #666;
}

.stats-info {
  display: flex;
  gap: 15px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-weight: bold;
  color: #007bff;
  font-size: 1.1rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.enterprises-grid,
.promocodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.enterprise-card,
.promocode-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #e9ecef;
}

.enterprise-header,
.promo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.enterprise-header h3,
.promo-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.usage-badge {
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
}

.enterprise-info p,
.promo-info p {
  margin: 8px 0;
  color: #666;
  font-size: 0.9rem;
}

.enterprise-actions,
.promo-actions {
  margin-top: 15px;
}

.promo-code {
  display: block;
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 4px;
}

/* Buttons */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #218838;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-warning:hover:not(:disabled) {
  background: #e0a800;
}

.btn-outline {
  background: transparent;
  border: 1px solid #6c757d;
  color: #6c757d;
}

.btn-outline:hover {
  background: #6c757d;
  color: white;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Notification */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  padding: 20px;
  z-index: 1001;
  animation: slideInRight 0.3s ease;
  border-left: 4px solid;
  max-width: 400px;
}

.notification.success {
  border-left-color: #28a745;
}

.notification.error {
  border-left-color: #dc3545;
}

.notification.info {
  border-left-color: #17a2b8;
}

.notification-content {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.notification-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.notification-text strong {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.notification-text p {
  margin: 0;
  color: #666;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: #6c757d;
  position: absolute;
  top: 10px;
  right: 10px;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .tabs-header {
    flex-direction: column;
  }

  .tab-button {
    justify-content: center;
  }

  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .enterprises-grid,
  .promocodes-grid {
    grid-template-columns: 1fr;
  }

  .data-table {
    font-size: 0.8rem;
  }

  .data-table th,
  .data-table td {
    padding: 8px;
  }
}
</style>