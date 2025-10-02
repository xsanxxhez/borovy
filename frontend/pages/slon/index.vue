<template>
  <div class="slon-dashboard">
    <div class="container">
      <h1>Кабинет Слона</h1>
      <p class="welcome">Привет, {{ authStore.user?.display_name }}! Вот ваша статистика:</p>
      
      <!-- Статистика -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ stats.promo_codes || 0 }}</div>
          <div class="stat-label">Промокодов</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.total_borovs || 0 }}</div>
          <div class="stat-label">Всего боровов</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.active_borovs || 0 }}</div>
          <div class="stat-label">Активных боровов</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.total_activations || 0 }}</div>
          <div class="stat-label">Всего активаций</div>
        </div>
      </div>

      <!-- Навигация -->
      <div class="slon-nav">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Контент -->
      <div class="tab-content">
        <!-- Мои промокоды -->
        <div v-if="activeTab === 'promocodes'" class="tab-panel">
          <div class="panel-header">
            <h2>Мои промокоды</h2>
            <button class="btn btn-primary" @click="showCreatePromo = true">
              Создать промокод
            </button>
          </div>
          
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Промокод</th>
                  <th>Описание</th>
                  <th>Боровы</th>
                  <th>Статус</th>
                  <th>Создан</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="promo in promocodes" :key="promo.id">
                  <td>
                    <strong>{{ promo.code }}</strong>
                    <div class="promo-link" @click="copyPromoLink(promo.code)">
                      📋 Скопировать ссылку
                    </div>
                  </td>
                  <td>{{ promo.description || '—' }}</td>
                  <td>{{ promo.borovs_count }}</td>
                  <td>
                    <span :class="['status', promo.is_active ? 'active' : 'inactive']">
                      {{ promo.is_active ? 'Активен' : 'Неактивен' }}
                    </span>
                  </td>
                  <td>{{ formatDate(promo.created_at) }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline">Статистика</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Мои боровы -->
        <div v-if="activeTab === 'borovs'" class="tab-panel">
          <h2>Мои боровы</h2>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Телефон</th>
                  <th>Email</th>
                  <th>Промокод</th>
                  <th>Отработано вахт</th>
                  <th>Статус</th>
                  <th>Дата регистрации</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="borov in borovs" :key="borov.id">
                  <td>{{ borov.full_name }}</td>
                  <td>{{ borov.phone }}</td>
                  <td>{{ borov.email }}</td>
                  <td>{{ borov.promo_code }}</td>
                  <td>{{ borov.total_vakhtas_completed || 0 }}</td>
                  <td>
                    <span :class="['status', borov.is_active ? 'active' : 'inactive']">
                      {{ borov.is_active ? 'На вахте' : 'Свободен' }}
                    </span>
                  </td>
                  <td>{{ formatDate(borov.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Статистика -->
        <div v-if="activeTab === 'stats'" class="tab-panel">
          <h2>Статистика эффективности</h2>
          
          <div class="charts-grid">
            <div class="chart-card">
              <h3>Эффективность промокодов</h3>
              <div class="chart-container">
                <div 
                  v-for="promo in promoEffectiveness" 
                  :key="promo.code"
                  class="promo-bar"
                >
                  <div class="promo-info">
                    <span class="promo-name">{{ promo.code }}</span>
                    <span class="promo-count">{{ promo.borovs_count }} боровов</span>
                  </div>
                  <div class="bar-container">
                    <div 
                      class="bar-fill"
                      :style="{ width: (promo.borovs_count / Math.max(...promoEffectiveness.map(p => p.borovs_count)) * 100) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="chart-card">
              <h3>Регистрации по неделям</h3>
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
const promocodes = ref([])
const borovs = ref([])
const promoEffectiveness = ref([])
const weeklyStats = ref([])

// UI состояние
const activeTab = ref('promocodes')
const showCreatePromo = ref(false)

const tabs = [
  { id: 'promocodes', name: 'Мои промокоды' },
  { id: 'borovs', name: 'Мои боровы' },
  { id: 'stats', name: 'Статистика' }
]

// Загрузка данных
const loadStats = async () => {
  try {
    const response = await $fetch('http://localhost:3001/api/slon/stats', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    stats.value = response
    promoEffectiveness.value = response.promo_effectiveness || []
    weeklyStats.value = response.weekly_stats || []
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const loadPromocodes = async () => {
  try {
    const response = await $fetch('http://localhost:3001/api/slon/promocodes', {
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
    const response = await $fetch('http://localhost:3001/api/slon/borovs', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    borovs.value = response
  } catch (error) {
    console.error('Error loading borovs:', error)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const formatWeek = (weekString: string) => {
  const date = new Date(weekString)
  return date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })
}

const copyPromoLink = (promoCode: string) => {
  const link = `${window.location.origin}/register?promo=${promoCode}`
  navigator.clipboard.writeText(link)
  alert('Ссылка скопирована в буфер обмена!')
}

// Загружаем данные
onMounted(async () => {
  await Promise.all([
    loadStats(),
    loadPromocodes(),
    loadBorovs()
  ])
})
</script>

<style scoped>
.slon-dashboard {
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  color: #333;
  margin-bottom: 10px;
}

.welcome {
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

.slon-nav {
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
}

.promo-link {
  color: #007bff;
  cursor: pointer;
  font-size: 12px;
  margin-top: 5px;
}

.promo-link:hover {
  text-decoration: underline;
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

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.chart-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.chart-card h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.promo-bar, .week-bar {
  margin-bottom: 15px;
}

.promo-info, .week-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.bar-container {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #007bff;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.week-count {
  font-weight: bold;
  color: #333;
}
</style>
