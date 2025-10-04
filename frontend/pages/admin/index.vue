<template>
  <div class="admin-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1>👑 Панель управления Borovy</h1>
        <p>Полный контроль над системой вахтовой работы</p>
      </div>
      <div class="header-stats">
        <div class="stat-badge">
          <span class="stat-number">{{ totalStats.slons || 0 }}</span>
          <span class="stat-label">Слонов</span>
        </div>
        <div class="stat-badge">
          <span class="stat-number">{{ totalStats.borovs || 0 }}</span>
          <span class="stat-label">Боровов</span>
        </div>
        <div class="stat-badge">
          <span class="stat-number">{{ totalStats.vakhtas || 0 }}</span>
          <span class="stat-label">Вахт</span>
        </div>
        <div class="stat-badge">
          <span class="stat-number">{{ totalStats.promo_codes || 0 }}</span>
          <span class="stat-label">Промокодов</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="dashboard-content">
      <!-- Left Sidebar - Navigation -->
      <div class="sidebar">
        <nav class="sidebar-nav">
          <button
            v-for="section in sections"
            :key="section.id"
            :class="['nav-item', { active: activeSection === section.id }]"
            @click="activeSection = section.id"
          >
            <span class="nav-icon">{{ section.icon }}</span>
            <span class="nav-text">{{ section.name }}</span>
            <span v-if="section.count !== undefined" class="nav-count">
              {{ section.count }}
            </span>
          </button>
        </nav>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h3>Быстрые действия</h3>
          <button @click="showCreateSlon = true" class="action-btn">
            <span>➕</span>
            Добавить Слона
          </button>
          <button @click="showCreateVakhta = true" class="action-btn">
            <span>🏗️</span>
            Создать Вахту
          </button>
          <button @click="showCreatePromo = true" class="action-btn">
            <span>🎫</span>
            Новый Промокод
          </button>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="main-content">
        <!-- Slons Management -->
        <div v-if="activeSection === 'slons'" class="section-content">
          <div class="section-header">
            <h2>🐘 Управление Слонами</h2>
            <div class="section-actions">
              <button @click="showCreateSlon = true" class="btn btn-primary">
                ➕ Добавить Слона
              </button>
              <button @click="refreshData" class="btn btn-outline">
                🔄 Обновить
              </button>
            </div>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Слон</th>
                  <th>Контакт</th>
                  <th>Промокоды</th>
                  <th>Боровы</th>
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
                      <div v-if="slon.contact_phone">📱 {{ slon.contact_phone }}</div>
                      <div v-if="slon.contact_email">📧 {{ slon.contact_email }}</div>
                    </div>
                  </td>
                  <td>
                    <span class="metric-badge">{{ slon.promo_codes_count || 0 }}</span>
                  </td>
                  <td>
                    <span class="metric-badge">{{ slon.borovs_count || 0 }}</span>
                  </td>
                  <td>
                    <span :class="['status-badge', slon.is_active ? 'active' : 'inactive']">
                      {{ slon.is_active ? 'Активен' : 'Неактивен' }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button @click="editSlon(slon)" class="btn-icon" title="Редактировать">
                        ✏️
                      </button>
                      <button
                        @click="toggleSlonStatus(slon)"
                        :class="['btn-icon', slon.is_active ? 'warning' : 'success']"
                        :title="slon.is_active ? 'Деактивировать' : 'Активировать'"
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

        <!-- Vakhtas Management -->
        <div v-if="activeSection === 'vakhtas'" class="section-content">
          <div class="section-header">
            <h2>🏗️ Управление Вахтами</h2>
            <div class="section-actions">
              <button @click="showCreateVakhta = true" class="btn btn-primary">
                ➕ Создать Вахту
              </button>
              <button @click="refreshData" class="btn btn-outline">
                🔄 Обновить
              </button>
            </div>
          </div>

          <div class="vakhtas-grid">
            <div
              v-for="vakhta in dashboardData.vakhtas"
              :key="vakhta.id"
              class="vakhta-card"
            >
              <div class="vakhta-header">
                <h3>{{ vakhta.title }}</h3>
                <div class="vakhta-meta">
                  <span :class="['status-badge', vakhta.is_active ? 'active' : 'inactive']">
                    {{ vakhta.is_active ? 'Активна' : 'Неактивна' }}
                  </span>
                  <span class="occupancy-badge">
                    {{ vakhta.current_workers || 0 }}/{{ vakhta.total_places }}
                  </span>
                </div>
              </div>

              <div class="vakhta-details">
                <div class="detail-item">
                  <span class="detail-icon">📍</span>
                  <span>{{ vakhta.location }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">📅</span>
                  <span>{{ formatDate(vakhta.start_date) }} - {{ formatDate(vakhta.end_date) }}</span>
                </div>
                <div v-if="vakhta.description" class="detail-item">
                  <span class="detail-icon">📝</span>
                  <span class="description">{{ vakhta.description }}</span>
                </div>
              </div>

              <div class="vakhta-actions">
                <button @click="editVakhta(vakhta)" class="btn btn-outline btn-sm">
                  ✏️ Редактировать
                </button>
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
        <div v-if="activeSection === 'promocodes'" class="section-content">
          <div class="section-header">
            <h2>🎫 Управление Промокодами</h2>
            <div class="section-actions">
              <button @click="showCreatePromo = true" class="btn btn-primary">
                ➕ Создать Промокод
              </button>
              <button @click="refreshData" class="btn btn-outline">
                🔄 Обновить
              </button>
            </div>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Промокод</th>
                  <th>Слон</th>
                  <th>Описание</th>
                  <th>Активации</th>
                  <th>Статус</th>
                  <th>Создан</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="promo in dashboardData.promocodes" :key="promo.id">
                  <td>
                    <strong class="promo-code">{{ promo.code }}</strong>
                    <button @click="copyPromoCode(promo.code)" class="btn-copy" title="Скопировать">
                      📋
                    </button>
                  </td>
                  <td>{{ promo.slon_name }}</td>
                  <td>{{ promo.description || '—' }}</td>
                  <td>
                    <span class="metric-badge">{{ promo.borovs_count }}</span>
                  </td>
                  <td>
                    <span :class="['status-badge', promo.is_active ? 'active' : 'inactive']">
                      {{ promo.is_active ? 'Активен' : 'Неактивен' }}
                    </span>
                  </td>
                  <td>{{ formatDate(promo.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Borovs Management -->
        <div v-if="activeSection === 'borovs'" class="section-content">
          <div class="section-header">
            <h2>💪 Управление Боровами</h2>
            <div class="section-actions">
              <button @click="refreshData" class="btn btn-outline">
                🔄 Обновить
              </button>
            </div>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Боров</th>
                  <th>Контакты</th>
                  <th>Промокод</th>
                  <th>Слон</th>
                  <th>Вахт</th>
                  <th>Статус</th>
                  <th>Регистрация</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="borov in dashboardData.borovs" :key="borov.id">
                  <td>
                    <div class="user-info">
                      <div class="user-avatar">💪</div>
                      <div class="user-details">
                        <strong>{{ borov.full_name }}</strong>
                        <small>{{ borov.email }}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="contact-info">
                      <div>📧 {{ borov.email }}</div>
                      <div>📱 {{ borov.phone }}</div>
                    </div>
                  </td>
                  <td>
                    <span class="promo-badge">{{ borov.promo_code }}</span>
                  </td>
                  <td>{{ borov.slon_name }}</td>
                  <td>
                    <span class="metric-badge">{{ borov.total_vakhtas_completed || 0 }}</span>
                  </td>
                  <td>
                    <span :class="['status-badge', borov.is_active ? 'active' : 'inactive']">
                      {{ borov.is_active ? 'На вахте' : 'Свободен' }}
                    </span>
                  </td>
                  <td>{{ formatDate(borov.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Statistics -->
        <div v-if="activeSection === 'stats'" class="section-content">
          <div class="section-header">
            <h2>📊 Статистика системы</h2>
            <div class="section-actions">
              <button @click="refreshData" class="btn btn-outline">
                🔄 Обновить
              </button>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card large">
              <h3>📈 Общая статистика</h3>
              <div class="stat-list">
                <div class="stat-item">
                  <span class="stat-label">Всего слонов:</span>
                  <span class="stat-value">{{ totalStats.slons || 0 }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Всего боровов:</span>
                  <span class="stat-value">{{ totalStats.borovs || 0 }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Активных вахт:</span>
                  <span class="stat-value">{{ totalStats.active_vakhtas || 0 }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Всего промокодов:</span>
                  <span class="stat-value">{{ totalStats.promo_codes || 0 }}</span>
                </div>
              </div>
            </div>

            <div class="stat-card large">
              <h3>🎯 Эффективность промокодов</h3>
              <div class="promo-stats">
                <div
                  v-for="promo in dashboardData.promocodes"
                  :key="promo.id"
                  class="promo-stat-item"
                >
                  <div class="promo-info">
                    <span class="promo-code">{{ promo.code }}</span>
                    <span class="promo-count">{{ promo.borovs_count }} боровов</span>
                  </div>
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: Math.min((promo.borovs_count / Math.max(...dashboardData.promocodes.map(p => p.borovs_count))) * 100, 100) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
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

    <!-- Notifications -->
    <div v-if="notification.show" class="notification" :class="notification.type">
      {{ notification.message }}
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

const activeSection = ref('slons')
const loading = ref(false)
const showCreateSlon = ref(false)
const showCreateVakhta = ref(false)
const showCreatePromo = ref(false)

const notification = ref({
  show: false,
  message: '',
  type: 'success'
})

// Sections configuration
const sections = computed(() => [
  { id: 'slons', name: 'Слоны', icon: '🐘', count: dashboardData.value.slons?.length },
  { id: 'vakhtas', name: 'Вахты', icon: '🏗️', count: dashboardData.value.vakhtas?.length },
  { id: 'promocodes', name: 'Промокоды', icon: '🎫', count: dashboardData.value.promocodes?.length },
  { id: 'borovs', name: 'Боровы', icon: '💪', count: dashboardData.value.borovs?.length },
  { id: 'stats', name: 'Статистика', icon: '📊' }
])

const totalStats = computed(() => dashboardData.value.stats || {})

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
  } catch (error) {
    console.error('Error loading admin dashboard:', error)
    showNotification('Ошибка загрузки данных', 'error')
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  await loadAdminDashboard()
  showNotification('Данные обновлены', 'success')
}

const toggleSlonStatus = async (slon: any) => {
  try {
    await $fetch(`http://localhost:3001/api/admin/slons/${slon.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      body: {
        ...slon,
        is_active: !slon.is_active
      }
    })

    showNotification(`Статус слона "${slon.display_name}" изменен`, 'success')
    await refreshData()
  } catch (error: any) {
    showNotification(error.data?.error || 'Ошибка изменения статуса', 'error')
  }
}

const toggleVakhtaStatus = async (vakhta: any) => {
  try {
    await $fetch(`http://localhost:3001/api/admin/vakhtas/${vakhta.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      body: {
        ...vakhta,
        is_active: !vakhta.is_active
      }
    })

    showNotification(`Статус вахты "${vakhta.title}" изменен`, 'success')
    await refreshData()
  } catch (error: any) {
    showNotification(error.data?.error || 'Ошибка изменения статуса', 'error')
  }
}

const editSlon = (slon: any) => {
  // TODO: Implement edit slon
  showNotification(`Редактирование слона: ${slon.display_name}`, 'info')
}

const editVakhta = (vakhta: any) => {
  // TODO: Implement edit vakhta
  showNotification(`Редактирование вахты: ${vakhta.title}`, 'info')
}

const copyPromoCode = (code: string) => {
  navigator.clipboard.writeText(code)
  showNotification('Промокод скопирован в буфер', 'success')
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
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
}

.dashboard-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 20px 30px;
}

.header-content h1 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 1.8rem;
}

.header-content p {
  margin: 0;
  color: #666;
}

.header-stats {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.stat-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 20px;
  background: #f8f9fa;
  border-radius: 10px;
  min-width: 80px;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
}

.dashboard-content {
  display: flex;
  min-height: calc(100vh - 160px);
}

.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e9ecef;
  padding: 20px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  color: #666;
}

.nav-item:hover {
  background: #f8f9fa;
}

.nav-item.active {
  background: #007bff;
  color: white;
}

.nav-icon {
  font-size: 1.2rem;
}

.nav-text {
  flex: 1;
  font-weight: 500;
}

.nav-count {
  background: #e9ecef;
  color: #495057;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 500;
}

.nav-item.active .nav-count {
  background: rgba(255,255,255,0.2);
  color: white;
}

.quick-actions {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.quick-actions h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #e9ecef;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.action-btn:hover {
  border-color: #007bff;
  background: #f8f9ff;
}

.main-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.section-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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

.section-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  border: 1px solid #007bff;
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

.btn-success {
  background: #28a745;
  color: white;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.9rem;
}

.btn-icon {
  padding: 6px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background: #f8f9fa;
}

.btn-icon.warning:hover {
  background: #fff3cd;
}

.btn-icon.success:hover {
  background: #d4edda;
}

.table-container {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
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
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  font-size: 1.5rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-details strong {
  color: #333;
}

.user-details small {
  color: #666;
  font-size: 0.8rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.9rem;
  color: #555;
}

.metric-badge {
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
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
  gap: 5px;
}

.promo-code {
  font-family: 'Courier New', monospace;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 8px;
}

.btn-copy {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.btn-copy:hover {
  background: #e9ecef;
}

.promo-badge {
  background: #fff3cd;
  color: #856404;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.vakhtas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.vakhta-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-left: 4px solid #007bff;
}

.vakhta-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.vakhta-header h3 {
  margin: 0;
  color: #333;
  flex: 1;
}

.vakhta-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-end;
}

.occupancy-badge {
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.vakhta-details {
  margin-bottom: 15px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #555;
}

.detail-icon {
  font-size: 1rem;
}

.description {
  font-style: italic;
  color: #666;
}

.vakhta-actions {
  display: flex;
  gap: 10px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.stat-card.large {
  grid-column: 1 / -1;
}

.stat-card h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.stat-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.stat-label {
  color: #666;
}

.stat-value {
  font-weight: 600;
  color: #333;
}

.promo-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.promo-stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.promo-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.promo-code {
  font-family: 'Courier New', monospace;
  font-weight: 500;
}

.promo-count {
  color: #666;
  font-size: 0.9rem;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #007bff;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  animation: slideIn 0.3s ease;
}

.notification.success {
  background: #28a745;
}

.notification.error {
  background: #dc3545;
}

.notification.info {
  background: #17a2b8;
}

@keyframes slideIn {
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
@media (max-width: 1024px) {
  .dashboard-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e9ecef;
  }

  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
  }

  .nav-item {
    white-space: nowrap;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 15px 20px;
  }

  .header-stats {
    flex-wrap: wrap;
  }

  .main-content {
    padding: 20px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .vakhtas-grid {
    grid-template-columns: 1fr;
  }

  .data-table {
    font-size: 0.9rem;
  }

  .data-table th,
  .data-table td {
    padding: 10px;
  }
}
</style>