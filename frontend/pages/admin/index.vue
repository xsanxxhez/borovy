<template>
  <div class="admin-dashboard">
    <div class="container">
      <h1>👑 Кабинет Администратора</h1>
      <p class="admin-subtitle">Управление всей системой Borovy</p>
      
      <!-- Статистика -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ dashboardData.stats?.slons_count || 0 }}</div>
          <div class="stat-label">Активных слонов</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ dashboardData.stats?.borovs_count || 0 }}</div>
          <div class="stat-label">Всего боровов</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ dashboardData.stats?.vakhtas_count || 0 }}</div>
          <div class="stat-label">Всего вахт</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ dashboardData.stats?.active_vakhtas_count || 0 }}</div>
          <div class="stat-label">Активных вахт</div>
        </div>
      </div>

      <!-- Навигация по разделам -->
      <div class="admin-nav">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Контент вкладок -->
      <div class="tab-content">
        <!-- Управление Слонами -->
        <div v-if="activeTab === 'slons'" class="tab-panel">
          <div class="panel-header">
            <h2>🛠️ Управление Слонами</h2>
            <button class="btn btn-primary" @click="showCreateSlon = true">
              ➕ Добавить Слона
            </button>
          </div>
          
          <!-- Форма создания слона -->
          <div v-if="showCreateSlon" class="create-form">
            <h3>Создание нового Слона</h3>
            <form @submit.prevent="createNewSlon">
              <div class="form-grid">
                <div class="form-group">
                  <label>Логин (обязательно)</label>
                  <input v-model="newSlon.username" type="text" required>
                </div>
                <div class="form-group">
                  <label>Отображаемое имя</label>
                  <input v-model="newSlon.display_name" type="text" required>
                </div>
                <div class="form-group">
                  <label>Телефон</label>
                  <input v-model="newSlon.contact_phone" type="tel">
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input v-model="newSlon.contact_email" type="email">
                </div>
                <div class="form-group">
                  <label>Пароль</label>
                  <input v-model="newSlon.password" type="password" required>
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn-success" :disabled="creatingSlon">
                  {{ creatingSlon ? 'Создание...' : 'Создать Слона' }}
                </button>
                <button type="button" class="btn btn-outline" @click="cancelCreateSlon">
                  Отмена
                </button>
              </div>
            </form>
          </div>
          
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Логин</th>
                  <th>Контакты</th>
                  <th>Промокоды</th>
                  <th>Боровы</th>
                  <th>Статус</th>
                  <th>Дата создания</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="slon in dashboardData.slons" :key="slon.id">
                  <td>
                    <strong>{{ slon.display_name }}</strong>
                  </td>
                  <td>
                    <code>{{ slon.username }}</code>
                  </td>
                  <td>
                    <div v-if="slon.contact_phone">📱 {{ slon.contact_phone }}</div>
                    <div v-if="slon.contact_email">📧 {{ slon.contact_email }}</div>
                    <div v-if="!slon.contact_phone && !slon.contact_email" class="text-muted">—</div>
                  </td>
                  <td>
                    <span class="badge">{{ slon.promo_codes_count || 0 }}</span>
                  </td>
                  <td>
                    <span class="badge">{{ slon.borovs_count || 0 }}</span>
                  </td>
                  <td>
                    <span :class="['status', slon.is_active ? 'active' : 'inactive']">
                      {{ slon.is_active ? '✅ Активен' : '❌ Неактивен' }}
                    </span>
                  </td>
                  <td>{{ formatDate(slon.created_at) }}</td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn btn-sm btn-outline" @click="editSlon(slon)">
                        ✏️
                      </button>
                      <button 
                        :class="['btn', 'btn-sm', slon.is_active ? 'btn-warning' : 'btn-success']"
                        @click="toggleSlonStatus(slon)"
                      >
                        {{ slon.is_active ? '❌' : '✅' }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Все промокоды -->
        <div v-if="activeTab === 'promocodes'" class="tab-panel">
          <h2>🎫 Все промокоды в системе</h2>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Промокод</th>
                  <th>Слон</th>
                  <th>Описание</th>
                  <th>Боровы</th>
                  <th>Статус</th>
                  <th>Создан</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="promo in dashboardData.promocodes" :key="promo.id">
                  <td>
                    <strong>{{ promo.code }}</strong>
                  </td>
                  <td>{{ promo.slon_name }}</td>
                  <td>{{ promo.description || '—' }}</td>
                  <td>
                    <span class="badge">{{ promo.borovs_count }}</span>
                  </td>
                  <td>
                    <span :class="['status', promo.is_active ? 'active' : 'inactive']">
                      {{ promo.is_active ? '✅ Активен' : '❌ Неактивен' }}
                    </span>
                  </td>
                  <td>{{ formatDate(promo.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Все боровы -->
        <div v-if="activeTab === 'borovs'" class="tab-panel">
          <h2>💪 Все боровы в системе</h2>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Телефон</th>
                  <th>Email</th>
                  <th>Промокод</th>
                  <th>Слон</th>
                  <th>Дата регистрации</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="borov in dashboardData.borovs" :key="borov.id">
                  <td>{{ borov.full_name }}</td>
                  <td>{{ borov.phone }}</td>
                  <td>{{ borov.email }}</td>
                  <td>
                    <span class="badge">{{ borov.promo_code }}</span>
                  </td>
                  <td>{{ borov.slon_name }}</td>
                  <td>{{ formatDate(borov.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Управление вахтами -->
        <div v-if="activeTab === 'vakhtas'" class="tab-panel">
          <div class="panel-header">
            <h2>🏗️ Управление Вахтами</h2>
            <button class="btn btn-primary" @click="showCreateVakhta = true">
              ➕ Создать Вахту
            </button>
          </div>
          
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Местоположение</th>
                  <th>Места</th>
                  <th>Дата начала</th>
                  <th>Дата окончания</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="vakhta in dashboardData.vakhtas" :key="vakhta.id">
                  <td>
                    <strong>{{ vakhta.title }}</strong>
                    <div class="text-small">{{ vakhta.description }}</div>
                  </td>
                  <td>📍 {{ vakhta.location }}</td>
                  <td>
                    <div class="progress-info">
                      {{ vakhta.current_workers }}/{{ vakhta.total_places }}
                      <div class="progress-bar">
                        <div 
                          class="progress-fill" 
                          :style="{ width: (vakhta.current_workers / vakhta.total_places * 100) + '%' }"
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>{{ formatDate(vakhta.start_date) }}</td>
                  <td>{{ formatDate(vakhta.end_date) }}</td>
                  <td>
                    <span :class="['status', vakhta.is_active ? 'active' : 'inactive']">
                      {{ vakhta.is_active ? '✅ Активна' : '❌ Завершена' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline">
                      ✏️ Редактировать
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()

// Данные
const dashboardData = ref({
  stats: {},
  slons: [],
  promocodes: [],
  borovs: [],
  vakhtas: []
})

// UI состояние
const activeTab = ref('slons')
const showCreateSlon = ref(false)
const showCreateVakhta = ref(false)
const creatingSlon = ref(false)

const newSlon = ref({
  username: '',
  display_name: '',
  contact_phone: '',
  contact_email: '',
  password: ''
})

const tabs = [
  { id: 'slons', name: '🐘 Слоны' },
  { id: 'promocodes', name: '🎫 Промокоды' },
  { id: 'borovs', name: '💪 Боровы' },
  { id: 'vakhtas', name: '🏗️ Вахты' }
]

// Загрузка данных
const loadAdminDashboard = async () => {
  try {
    const response = await $fetch('http://localhost:3001/api/admin/dashboard', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    dashboardData.value = response
  } catch (error) {
    console.error('Error loading admin dashboard:', error)
  }
}

const createNewSlon = async () => {
  creatingSlon.value = true
  try {
    const response = await $fetch('http://localhost:3001/api/admin/slons', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      body: newSlon.value
    })
    
    // Обновляем данные
    await loadAdminDashboard()
    cancelCreateSlon()
    alert('Слон успешно создан!')
  } catch (error: any) {
    alert(error.data?.error || 'Ошибка при создании слона')
  } finally {
    creatingSlon.value = false
  }
}

const cancelCreateSlon = () => {
  showCreateSlon.value = false
  newSlon.value = {
    username: '',
    display_name: '',
    contact_phone: '',
    contact_email: '',
    password: ''
  }
}

const editSlon = (slon: any) => {
  // TODO: Реализовать редактирование
  alert(`Редактирование слона: ${slon.display_name}`)
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
    
    await loadAdminDashboard()
    alert(`Статус слона ${slon.display_name} изменен!`)
  } catch (error: any) {
    alert(error.data?.error || 'Ошибка при изменении статуса')
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

// Загружаем данные при монтировании
onMounted(async () => {
  await loadAdminDashboard()
})
</script>

<style scoped>
.admin-dashboard {
  padding: 20px 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  color: #333;
  margin-bottom: 5px;
  font-size: 2.2em;
}

.admin-subtitle {
  color: #666;
  margin-bottom: 30px;
  font-size: 1.1em;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-number {
  font-size: 2.5em;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 10px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.admin-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid #ddd;
}

.tab-button {
  padding: 12px 24px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  color: #666;
  transition: all 0.3s ease;
  font-size: 14px;
}

.tab-button.active {
  color: #007bff;
  border-bottom-color: #007bff;
  background: #f8f9fa;
}

.tab-button:hover {
  color: #0056b3;
}

.tab-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.tab-panel {
  padding: 30px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-header h2 {
  margin: 0;
  color: #333;
}

.create-form {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.create-form h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 5px;
  color: #333;
}

.form-group input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table th,
.table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.badge {
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status.active {
  background: #d4edda;
  color: #155724;
}

.status.inactive {
  background: #f8d7da;
  color: #721c24;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
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

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.progress-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
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
  background: #28a745;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.text-small {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.text-muted {
  color: #6c757d;
  font-style: italic;
}

code {
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}
</style>
