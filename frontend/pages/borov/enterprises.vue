<template>
  <div class="enterprises-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>🏗️ Предприятия</h1>
        <p>Выберите предприятие и найдите подходящую вакансию</p>
      </div>

      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-number">{{ filteredEnterprises.length }}</span>
          <span class="stat-label">предприятий</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ totalSpecialties }}</span>
          <span class="stat-label">вакансий</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="search-box">
        <input
          v-model="filters.search"
          type="text"
          placeholder="🔍 Поиск предприятий или вакансий..."
          class="search-input"
        >
      </div>

      <div class="filter-controls">
        <select v-model="filters.location" class="filter-select">
          <option value="">📍 Все города</option>
          <option v-for="location in locations" :key="location" :value="location">
            {{ location }}
          </option>
        </select>

        <select v-model="filters.salary" class="filter-select">
          <option value="">💰 Любая зарплата</option>
          <option value="4000">от 4,000 ₽</option>
          <option value="5000">от 5,000 ₽</option>
          <option value="6000">от 6,000 ₽</option>
        </select>
      </div>
    </div>

    <!-- Active Work Warning -->
    <div v-if="hasActiveWork" class="warning-banner">
      <div class="warning-content">
        <span class="warning-icon">⚠️</span>
        <div class="warning-text">
          <strong>У вас уже есть активная работа</strong>
          <p>Вы не можете записаться на новую вахту пока не завершите текущую</p>
        </div>
      </div>
    </div>

    <!-- Enterprises List -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Загрузка предприятий...</p>
    </div>

    <div v-else-if="filteredEnterprises.length === 0" class="empty-state">
      <div class="empty-icon">🏭</div>
      <h3>Предприятия не найдены</h3>
      <p>Попробуйте изменить параметры поиска</p>
      <button @click="clearFilters" class="btn btn-primary">
        Сбросить фильтры
      </button>
    </div>

    <div v-else class="enterprises-list">
      <div
        v-for="enterprise in filteredEnterprises"
        :key="enterprise.id"
        class="enterprise-card"
        :class="{ expanded: expandedEnterprise === enterprise.id }"
      >
        <!-- Enterprise Header -->
        <div class="enterprise-header" @click="toggleEnterprise(enterprise.id)">
          <div class="enterprise-main">
            <div class="enterprise-title">
              <h3>{{ enterprise.title }}</h3>
              <div class="enterprise-meta">
                <span class="location">📍 {{ enterprise.location }}</span>
                <span class="workers">👥 {{ enterprise.current_workers || 0 }}/{{ enterprise.total_places }}</span>
              </div>
            </div>

            <div class="enterprise-dates">
              <span class="date">📅 {{ formatDate(enterprise.start_date) }} - {{ formatDate(enterprise.end_date) }}</span>
            </div>
          </div>

          <div class="enterprise-actions">
            <div class="specialties-count">
              {{ enterprise.specialties?.length || 0 }} вакансий
            </div>
            <button class="expand-btn">
              {{ expandedEnterprise === enterprise.id ? '▲' : '▼' }}
            </button>
          </div>
        </div>

        <!-- Specialties List -->
        <div v-if="expandedEnterprise === enterprise.id" class="specialties-section">
          <div class="specialties-header">
            <h4>💼 Доступные вакансии</h4>
          </div>

          <div v-if="!enterprise.specialties || enterprise.specialties.length === 0" class="no-specialties">
            <p>😔 На этом предприятии пока нет вакансий</p>
          </div>

          <div v-else class="specialties-grid">
            <div
              v-for="specialty in enterprise.specialties"
              :key="specialty.id"
              class="specialty-card"
              :class="{ 'few-places': specialty.free_places <= 3, 'no-places': specialty.free_places === 0 }"
            >
              <div class="specialty-header">
                <div class="specialty-main">
                  <h5>{{ specialty.title }}</h5>
                  <p class="specialty-description" v-if="specialty.description">
                    {{ specialty.description }}
                  </p>

                  <div class="specialty-details">
                    <div class="detail-item">
                      <span class="label">💰 Зарплата:</span>
                      <span class="value salary">{{ formatSalary(specialty.salary) }}/день</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">👥 Места:</span>
                      <span class="value places" :class="getPlacesClass(specialty.free_places)">
                        {{ specialty.free_places }} из {{ specialty.total_places }}
                      </span>
                    </div>
                    <div class="detail-item" v-if="specialty.requirements">
                      <span class="label">📋 Требования:</span>
                      <span class="value">{{ truncateText(specialty.requirements, 60) }}</span>
                    </div>
                  </div>
                </div>

                <div class="specialty-actions">
                  <button
                    v-if="!hasActiveWork && specialty.free_places > 0"
                    @click="applyForSpecialty(specialty)"
                    :disabled="applyingForSpecialty === specialty.id"
                    class="btn btn-primary"
                  >
                    <span v-if="applyingForSpecialty === specialty.id" class="btn-spinner"></span>
                    {{ applyingForSpecialty === specialty.id ? 'Записываем...' : '📝 Записаться' }}
                  </button>

                  <button
                    v-else-if="hasActiveWork"
                    disabled
                    class="btn btn-disabled"
                  >
                    ❌ Уже работаете
                  </button>

                  <button
                    v-else
                    disabled
                    class="btn btn-disabled"
                  >
                    ❌ Нет мест
                  </button>
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
const authStore = useAuthStore()

const enterprises = ref([])
const expandedEnterprise = ref(null)
const loading = ref(false)
const applyingForSpecialty = ref(null)
const hasActiveWork = ref(false)

const filters = reactive({
  search: '',
  location: '',
  salary: ''
})

// Загрузка предприятий
// Загрузка предприятий
const loadEnterprises = async () => {
  try {
    loading.value = true

    // Загружаем предприятия со специальностями - правильный URL
    const response = await $fetch('http://localhost:3001/api/vakhta', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    enterprises.value = response

    // Проверяем активную работу
    const mySpecialties = await $fetch('http://localhost:3001/api/borov/specialties/my', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    hasActiveWork.value = mySpecialties.some((s: any) => s.status === 'active')

  } catch (error) {
    console.error('Error loading enterprises:', error)
  } finally {
    loading.value = false
  }
}

// Фильтрация
const filteredEnterprises = computed(() => {
  let filtered = enterprises.value

  if (filters.search) {
    const query = filters.search.toLowerCase()
    filtered = filtered.filter(enterprise =>
      enterprise.title.toLowerCase().includes(query) ||
      enterprise.location.toLowerCase().includes(query) ||
      enterprise.specialties?.some((s: any) =>
        s.title.toLowerCase().includes(query)
      )
    )
  }

  if (filters.location) {
    filtered = filtered.filter(enterprise =>
      enterprise.location === filters.location
    )
  }

  if (filters.salary) {
    filtered = filtered.filter(enterprise =>
      enterprise.specialties?.some((s: any) =>
        s.salary >= parseInt(filters.salary)
      )
    )
  }

  return filtered
})

// Уникальные локации
const locations = computed(() => {
  return [...new Set(enterprises.value.map(e => e.location))].sort()
})

// Общее количество вакансий
const totalSpecialties = computed(() => {
  return enterprises.value.reduce((total, enterprise) =>
    total + (enterprise.specialties?.length || 0), 0
  )
})

// Действия
const toggleEnterprise = (enterpriseId: number) => {
  expandedEnterprise.value = expandedEnterprise.value === enterpriseId ? null : enterpriseId
}

const applyForSpecialty = async (specialty: any) => {
  try {
    applyingForSpecialty.value = specialty.id

    await $fetch('http://localhost:3001/api/borov/specialties/join', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authStore.token}` },
      body: { specialty_id: specialty.id }
    })

    // Показываем уведомление об успехе
    alert(`🎉 Вы успешно записались на вакансию "${specialty.title}"!`)

    // Обновляем данные
    await loadEnterprises()

  } catch (error: any) {
    console.error('Error applying for specialty:', error)
    alert(error.data?.error || 'Ошибка при записи на вакансию')
  } finally {
    applyingForSpecialty.value = null
  }
}

const clearFilters = () => {
  Object.assign(filters, {
    search: '',
    location: '',
    salary: ''
  })
}

const formatSalary = (amount: number) => {
  return new Intl.NumberFormat('ru-RU').format(amount) + ' ₽'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const truncateText = (text: string, length: number) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const getPlacesClass = (freePlaces: number) => {
  if (freePlaces === 0) return 'no-places'
  if (freePlaces <= 3) return 'few-places'
  return 'available'
}

onMounted(() => {
  loadEnterprises()
})
</script>

<style scoped>
.enterprises-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.header-content h1 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 2.2rem;
}

.header-content p {
  margin: 0;
  color: #666;
  font-size: 1.1rem;
}

.header-stats {
  display: flex;
  gap: 40px;
  margin-top: 25px;
  padding-top: 25px;
  border-top: 1px solid #e9ecef;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
}

.filters-section {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  margin-bottom: 25px;
}

.search-box {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

.filter-controls {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  min-width: 180px;
}

.warning-banner {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 25px;
}

.warning-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.warning-icon {
  font-size: 1.5rem;
}

.warning-text strong {
  color: #856404;
  display: block;
  margin-bottom: 5px;
}

.warning-text p {
  margin: 0;
  color: #856404;
  opacity: 0.8;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.7;
}

.empty-state h3 {
  margin-bottom: 15px;
  color: #333;
}

.empty-state p {
  margin-bottom: 25px;
  color: #666;
}

.enterprises-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.enterprise-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.enterprise-card:hover {
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.enterprise-card.expanded {
  border: 2px solid #007bff;
}

.enterprise-header {
  padding: 25px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #f8f9fa;
  transition: background-color 0.3s;
}

.enterprise-header:hover {
  background: #e9ecef;
}

.enterprise-main {
  flex: 1;
}

.enterprise-title h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.3rem;
}

.enterprise-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.location, .workers {
  color: #666;
  font-size: 0.9rem;
}

.enterprise-dates {
  margin-top: 10px;
}

.date {
  color: #666;
  font-size: 0.9rem;
}

.enterprise-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.specialties-count {
  background: #007bff;
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.expand-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  padding: 5px;
}

.specialties-section {
  border-top: 1px solid #e9ecef;
  padding: 25px;
  background: #fafafa;
}

.specialties-header h4 {
  margin: 0 0 20px 0;
  color: #333;
}

.no-specialties {
  text-align: center;
  padding: 40px;
  color: #666;
  background: white;
  border-radius: 10px;
}

.specialties-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.specialty-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-left: 4px solid #20c997;
}

.specialty-card.few-places {
  border-left-color: #ffc107;
}

.specialty-card.no-places {
  border-left-color: #dc3545;
  opacity: 0.7;
}

.specialty-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.specialty-main {
  flex: 1;
}

.specialty-main h5 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.1rem;
}

.specialty-description {
  margin: 8px 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.specialty-details {
  margin-top: 15px;
}

.detail-item {
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.label {
  font-weight: 500;
  color: #333;
  min-width: 100px;
  font-size: 0.9rem;
}

.value {
  color: #666;
  font-size: 0.9rem;
}

.value.salary {
  color: #28a745;
  font-weight: 600;
}

.value.places.no-places {
  color: #dc3545;
}

.value.places.few-places {
  color: #ffc107;
}

.specialty-actions {
  min-width: 140px;
}

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

.btn-disabled {
  background: #6c757d;
  color: white;
  cursor: not-allowed;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .enterprise-header {
    flex-direction: column;
    gap: 15px;
  }

  .enterprise-actions {
    width: 100%;
    justify-content: space-between;
  }

  .specialty-header {
    flex-direction: column;
  }

  .specialty-actions {
    width: 100%;
  }

  .filter-controls {
    flex-direction: column;
  }

  .filter-select {
    min-width: auto;
  }

  .detail-item {
    flex-direction: column;
    gap: 5px;
  }

  .label {
    min-width: auto;
  }
}
</style>