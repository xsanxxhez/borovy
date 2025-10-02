<template>
  <div class="admin-dashboard">
    <div class="container">
      <h1>Кабинет Администратора</h1>
      
      <!-- Статистика -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ stats.slons || 0 }}</div>
          <div class="stat-label">Слонов</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.borovs || 0 }}</div>
          <div class="stat-label">Боровов</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.vakhtas || 0 }}</div>
          <div class="stat-label">Вахт</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.active_vakhtas || 0 }}</div>
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
            <h2>Управление Слонами</h2>
            <button class="btn btn-primary" @click="showCreateSlon = true">
              Добавить Слона
            </button>
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
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="slon in slons" :key="slon.id">
                  <td>{{ slon.display_name }}</td>
                  <td>{{ slon.username }}</td>
                  <td>
                    <div>{{ slon.contact_phone }}</div>
                    <div>{{ slon.contact_email }}</div>
                  </td>
                  <td>{{ slon.promo_codes_count }}</td>
                  <td>{{ slon.borovs_count }}</td>
                  <td>
                    <span :class="['status', slon.is_active ? 'active' : 'inactive']">
                      {{ slon.is_active ? 'Активен' : 'Неактивен' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline">Редактировать</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Все промокоды -->
        <div v-if="activeTab === 'promocodes'" class="tab-panel">
          <h2>Все промокоды</h2>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Промокод</th>
                  <th>Слон</th>
                  <th>Боровы</th>
                  <th>Статус</th>
                  <th>Создан</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="promo in promocodes" :key="promo.id">
                  <td>{{ promo.code }}</td>
                  <td>{{ promo.slon_name }}</td>
                  <td>{{ promo.borovs_count }}</td>
                  <td>
                    <span :class="['status', promo.is_active ? 'active' : 'inactive']">
                      {{ promo.is_active ? 'Активен' : 'Неактивен' }}
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
          <h2>Все боровы</h2>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Телефон</th>
                  <th>Email</th>
                  <th>Промокод</th>
                  <th>Слон</th>
                  <th>Отработано вахт</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="borov in borovs" :key="borov.id">
                  <td>{{ borov.full_name }}</td>
                  <td>{{ borov.phone }}</td>
                  <td>{{ borov.email }}</td>
                  <td>{{ borov.promo_code }}</td>
                  <td>{{ borov.slon_name }}</td>
                  <td>{{ borov.total_vakhtas_completed || 0 }}</td>
                  <td>
                    <span :class="['status', borov.current_vakhta ? 'active' : 'inactive']">
                      {{ borov.current_vakhta ? 'На вахте' : 'Свободен' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Управление вахтами -->
        <div v-if="activeTab === 'vakhtas'" class="tab-panel">
          <div class="panel-header">
            <h2>Управление Вахтами</h2>
            <button class="btn btn-primary" @click="showCreateVakhta = true">
              Создать Вахту
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
                <tr v-for="vakhta in vakhtas" :key="vakhta.id">
                  <td>{{ vakhta.title }}</td>
                  <td>{{ vakhta.location }}</td>
                  <td>
                    {{ vakhta.current_workers }}/{{ vakhta.total_places }}
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :style="{ width: (vakhta.current_workers / vakhta.total_places * 100) + '%' }"
                      ></div>
                    </div>
                  </td>
                  <td>{{ formatDate(vakhta.start_date) }}</td>
                  <td>{{ formatDate(vakhta.end_date) }}</td>
                  <td>
                    <span :class="['status', vakhta.is_active ? 'active' : 'inactive']">
                      {{ vakhta.is_active ? 'Активна' : 'Завершена' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline">Редактировать</button>
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
const stats = ref({})
const slons = ref([])
const promocodes = ref([])
const borovs = ref([])
const vakhtas = ref([])

// UI состояние
const activeTab = ref('slons')
const showCreateSlon = ref(false)
const showCreateVakhta = ref(false)

const tabs = [
  { id: 'slons', name: 'Слоны' },
  { id: 'promocodes', name: 'Промокоды' },
  { id: 'borovs', name: 'Боровы' },
  { id: 'vakhtas', name: 'Вахты' }
]

// Загрузка данных
const loadStats = async () => {
  try {
    const response = await $fetch('http://localhost:3001/api/admin/stats', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    stats.value = response
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const loadSlons = async () => {
  try {
    const response = await $fetch('http://localhost:3001/api/admin/slons', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    slons.value = response
  } catch (error) {
    console.error('Error loading slons:', error)
  }
}

const loadPromocodes = async () => {
  try {
    const response = await $fetch('http://localhost:3001/api/admin/promocodes', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    promocodes.value = response
  } catch (error) {
    console.error('Error loading promocodes:', error)
  }
}

const loadBorovs = async () => {
  try {
    const response = await $fetch('http://localhost:3001/api/admin/borovs', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    borovs.value = response
  } catch (error) {
    console.error('Error loading borovs:', error)
  }
}

const loadVakhtas = async () => {
  try {
    const response = await $fetch('http://localhost:3001/api/vakhta')
    vakhtas.value = response
  } catch (error) {
    console.error('Error loading vakhtas:', error)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

// Загружаем данные при монтировании
onMounted(async () => {
  await Promise.all([
    loadStats(),
    loadSlons(),
    loadPromocodes(),
    loadBorovs(),
    loadVakhtas()
  ])
})
</script>

<style scoped>
.admin-dashboard {
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  color: #333;
  margin-bottom: 30px;
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
}

.tab-button.active {
  color: #007bff;
  border-bottom-color: #007bff;
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

.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
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

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
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

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  margin-top: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #28a745;
  border-radius: 3px;
  transition: width 0.3s ease;
}
</style>
