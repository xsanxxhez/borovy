<template>
  <div class="enterprises-page">
    <div class="page-header">
      <h1>Доступные предприятия</h1>
      <p>Выберите предприятие и посмотрите доступные вакансии</p>

      <!-- Статистика -->
      <div class="stats-bar">
        <div class="stat">
          <span class="stat-number">{{ filteredEnterprises.length }}</span>
          <span class="stat-label">предприятий</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ totalVacancies }}</span>
          <span class="stat-label">вакансий</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ nearestEnterpriseDate }}</span>
          <span class="stat-label">ближайшая вахта</span>
        </div>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="filters-section">
      <div class="filter-group">
        <label>🔍 Поиск:</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Название предприятия или местоположение..."
          class="filter-input"
        >
      </div>
      <div class="filter-group">
        <label>📊 Сортировка:</label>
        <select v-model="sortBy" class="filter-select">
          <option value="start_date">По дате начала</option>
          <option value="title">По названию</option>
          <option value="location">По местоположению</option>
          <option value="vacancies_count">По количеству вакансий</option>
        </select>
      </div>
      <button @click="loadEnterprises" class="btn btn-refresh" title="Обновить список">
        🔄
      </button>
    </div>

    <!-- Сообщение если нет активных предприятий -->
    <div v-if="!loading && filteredEnterprises.length === 0" class="empty-state">
      <div class="empty-icon">🏭</div>
      <h3>Нет доступных предприятий</h3>
      <p>В данный момент нет активных предприятий для работы. Зайдите позже.</p>
      <button @click="loadEnterprises" class="btn btn-outline">
        🔄 Обновить список
      </button>
    </div>

    <!-- Список предприятий -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Загрузка предприятий...</p>
    </div>

    <div v-else-if="filteredEnterprises.length > 0" class="enterprises-grid">
      <div
        v-for="enterprise in filteredEnterprises"
        :key="enterprise.id"
        class="enterprise-card"
        @click="viewEnterpriseDetails(enterprise.id)"
      >
        <div class="enterprise-header">
          <h3>{{ enterprise.title }}</h3>
          <div class="enterprise-meta">
            <span class="vacancies-badge">
              {{ enterprise.vacancies_count }} вакансий
            </span>
          </div>
        </div>

        <div class="enterprise-details">
          <div class="detail-item">
            <span class="detail-icon">📍</span>
            <span class="detail-text">{{ enterprise.location }}</span>
          </div>

          <div class="detail-item">
            <span class="detail-icon">📅</span>
            <span class="detail-text">
              {{ formatDate(enterprise.start_date) }} - {{ formatDate(enterprise.end_date) }}
            </span>
          </div>

          <div class="detail-item">
            <span class="detail-icon">🏢</span>
            <span class="detail-text">
              {{ enterprise.vacancies_count }} доступных вакансий
            </span>
          </div>

          <div v-if="enterprise.amenities && enterprise.amenities.length > 0" class="amenities">
            <div class="amenities-label">Условия:</div>
            <div class="amenities-list">
              <span v-for="amenity in enterprise.amenities.slice(0, 3)" :key="amenity" class="amenity-tag">
                {{ amenity }}
              </span>
              <span v-if="enterprise.amenities.length > 3" class="amenity-tag more">
                +{{ enterprise.amenities.length - 3 }}
              </span>
            </div>
          </div>

          <div v-if="enterprise.description" class="description">
            {{ truncateText(enterprise.description, 120) }}
          </div>
        </div>

        <div class="enterprise-actions">
          <button class="btn btn-primary view-btn">
            👀 Посмотреть вакансии
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно с деталями предприятия -->
    <div v-if="selectedEnterprise" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedEnterprise.title }}</h2>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>

        <div class="modal-body">
          <!-- Галерея изображений -->
          <div v-if="selectedEnterprise.images && selectedEnterprise.images.length > 0" class="image-gallery">
            <div class="main-image">
              <img :src="selectedEnterprise.images[0]" :alt="selectedEnterprise.title">
            </div>
          </div>

          <!-- Основная информация -->
          <div class="enterprise-info">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">📍 Местоположение:</span>
                <span class="info-value">{{ selectedEnterprise.location }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">📅 Период работы:</span>
                <span class="info-value">
                  {{ formatDate(selectedEnterprise.start_date) }} - {{ formatDate(selectedEnterprise.end_date) }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">📞 Контакты:</span>
                <span class="info-value">
                  {{ selectedEnterprise.contacts?.phone }}, {{ selectedEnterprise.contacts?.email }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">👨‍💼 Менеджер:</span>
                <span class="info-value">{{ selectedEnterprise.contacts?.manager }}</span>
              </div>
            </div>

            <!-- Условия -->
            <div v-if="selectedEnterprise.conditions" class="conditions-section">
              <h3>Условия работы</h3>
              <p>{{ selectedEnterprise.conditions }}</p>
            </div>

            <!-- Удобства -->
            <div v-if="selectedEnterprise.amenities && selectedEnterprise.amenities.length > 0" class="amenities-section">
              <h3>Удобства на предприятии</h3>
              <div class="amenities-grid">
                <div v-for="amenity in selectedEnterprise.amenities" :key="amenity" class="amenity-item">
                  ✅ {{ amenity }}
                </div>
              </div>
            </div>

            <!-- Описание -->
            <div v-if="selectedEnterprise.description" class="description-section">
              <h3>Описание предприятия</h3>
              <p>{{ selectedEnterprise.description }}</p>
            </div>

            <!-- Вакансии -->
            <div class="vacancies-section">
              <h3>Доступные вакансии</h3>
              <div v-if="selectedEnterprise.vacancies && selectedEnterprise.vacancies.length > 0" class="vacancies-list">
                <div
                  v-for="vacancy in selectedEnterprise.vacancies"
                  :key="vacancy.id"
                  class="vacancy-card"
                  :class="{ 'full': vacancy.free_places <= 0 }"
                >
                  <div class="vacancy-header">
                    <h4>{{ vacancy.title }}</h4>
                    <div class="vacancy-meta">
                      <span class="salary">{{ formatSalary(vacancy.salary) }}</span>
                      <span class="places-badge" :class="{ 'few': vacancy.free_places > 0 && vacancy.free_places <= 3, 'full': vacancy.free_places <= 0 }">
                        {{ vacancy.free_places > 0 ? `${vacancy.free_places} мест` : 'Заполнена' }}
                      </span>
                    </div>
                  </div>

                  <div class="vacancy-details">
                    <p v-if="vacancy.description" class="vacancy-description">
                      {{ vacancy.description }}
                    </p>
                    <p v-if="vacancy.requirements" class="vacancy-requirements">
                      <strong>Требования:</strong> {{ vacancy.requirements }}
                    </p>
                  </div>

                  <div class="vacancy-actions">
                    <button
                      v-if="vacancy.free_places > 0 && !hasActiveVacancy"
                      @click="joinVacancy(vacancy.id)"
                      :disabled="joiningVacancy === vacancy.id"
                      class="btn btn-primary join-btn"
                    >
                      <span v-if="joiningVacancy === vacancy.id" class="btn-loading"></span>
                      {{ joiningVacancy === vacancy.id ? 'Записываем...' : '📝 Записаться' }}
                    </button>

                    <button v-else-if="hasActiveVacancy" disabled class="btn btn-disabled">
                      ⚠️ У вас уже есть активная вахта
                    </button>

                    <button v-else disabled class="btn btn-disabled">
                      ❌ Нет свободных мест
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="no-vacancies">
                <p>На данный момент нет доступных вакансий на этом предприятии.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Уведомления -->
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const enterprises = ref([])
const selectedEnterprise = ref(null)
const loading = ref(false)
const joiningVacancy = ref(null)
const searchQuery = ref('')
const sortBy = ref('start_date')
const message = ref('')
const messageType = ref('success')
const hasActiveVacancy = ref(false)

// Загрузка предприятий
const loadEnterprises = async () => {
  try {
    loading.value = true
    console.log('🔄 Loading enterprises...')

    const response = await $fetch('http://localhost:3001/api/borov/enterprises', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    enterprises.value = response
    console.log(`✅ Loaded ${response.length} enterprises`)

    // Проверяем есть ли активная вакансия
    const myVacancies = await $fetch('http://localhost:3001/api/borov/vacancies/my', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    hasActiveVacancy.value = myVacancies.some((v: any) => v.status === 'active')
    console.log(`📊 Has active vacancy: ${hasActiveVacancy.value}`)

  } catch (error) {
    console.error('❌ Error loading enterprises:', error)
    showMessage('Ошибка загрузки предприятий', 'error')
  } finally {
    loading.value = false
  }
}

// Просмотр деталей предприятия
const viewEnterpriseDetails = async (enterpriseId: number) => {
  try {
    const response = await $fetch(`http://localhost:3001/api/borov/enterprises/${enterpriseId}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    selectedEnterprise.value = response
  } catch (error) {
    console.error('Error loading enterprise details:', error)
    showMessage('Ошибка загрузки деталей предприятия', 'error')
  }
}

// Запись на вакансию
const joinVacancy = async (vacancyId: number) => {
  try {
    joiningVacancy.value = vacancyId
    console.log(`📝 Joining vacancy ${vacancyId}...`)

    await $fetch('http://localhost:3001/api/borov/vacancies/join', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      body: {
        vacancy_id: vacancyId
      }
    })

    showMessage('✅ Успешно записались на вакансию!', 'success')
    await loadEnterprises()
    closeModal()

  } catch (error: any) {
    console.error('❌ Error joining vacancy:', error)
    showMessage(error.data?.error || 'Ошибка записи на вакансию', 'error')
  } finally {
    joiningVacancy.value = null
  }
}

// Закрытие модального окна
const closeModal = () => {
  selectedEnterprise.value = null
}

// Фильтрация предприятий
const filteredEnterprises = computed(() => {
  let filtered = [...enterprises.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((e: any) =>
      e.title.toLowerCase().includes(query) ||
      e.location.toLowerCase().includes(query) ||
      (e.description && e.description.toLowerCase().includes(query))
    )
  }

  // Сортировка
  filtered.sort((a: any, b: any) => {
    if (sortBy.value === 'start_date') {
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    } else if (sortBy.value === 'vacancies_count') {
      return b.vacancies_count - a.vacancies_count
    }
    return a[sortBy.value].localeCompare(b[sortBy.value])
  })

  return filtered
})

// Статистика
const totalVacancies = computed(() => {
  return filteredEnterprises.value.reduce((total, enterprise: any) => {
    return total + (enterprise.vacancies_count || 0)
  }, 0)
})

const nearestEnterpriseDate = computed(() => {
  if (filteredEnterprises.value.length === 0) return '-'

  const nearest = filteredEnterprises.value.reduce((nearest, enterprise) => {
    const enterpriseDate = new Date(enterprise.start_date)
    return (!nearest || enterpriseDate < new Date(nearest.start_date)) ? enterprise : nearest
  }, null)

  return nearest ? formatDate(nearest.start_date) : '-'
})

// Вспомогательные функции
const formatDate = (dateString: string) => {
  if (!dateString) return 'не указана'
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const formatSalary = (salary: number) => {
  if (!salary) return 'по договоренности'
  return new Intl.NumberFormat('ru-RU').format(salary) + ' ₽'
}

const truncateText = (text: string, length: number) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const showMessage = (text: string, type: string) => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

onMounted(() => {
  loadEnterprises()
})
</script>

<style scoped>
.enterprises-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 2.5rem;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.stats-bar {
  display: flex;
  gap: 40px;
  margin: 30px 0;
  padding: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  color: white;
}

.stat {
  text-align: center;
  flex: 1;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
  text-transform: uppercase;
}

.filters-section {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.filter-input, .filter-select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.filter-input:focus, .filter-select:focus {
  border-color: #007bff;
  outline: none;
}

.btn-refresh {
  background: #f8f9fa;
  border: 1px solid #ddd;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.btn-refresh:hover {
  background: #007bff;
  color: white;
  transform: rotate(180deg);
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
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  opacity: 0.7;
}

.empty-state h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.5rem;
}

.empty-state p {
  margin-bottom: 25px;
  color: #666;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.enterprises-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 25px;
}

.enterprise-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  padding: 25px;
  border-left: 5px solid #007bff;
  transition: all 0.3s ease;
  cursor: pointer;
}

.enterprise-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.enterprise-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 15px;
}

.enterprise-header h3 {
  margin: 0;
  color: #333;
  flex: 1;
  font-size: 1.3rem;
  line-height: 1.3;
}

.vacancies-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.enterprise-details {
  margin-bottom: 25px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-icon {
  font-size: 16px;
  min-width: 20px;
  text-align: center;
}

.detail-text {
  color: #555;
  line-height: 1.5;
  flex: 1;
}

.amenities {
  margin: 15px 0;
}

.amenities-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.amenities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.amenity-tag {
  padding: 4px 8px;
  background: #e9ecef;
  border-radius: 12px;
  font-size: 11px;
  color: #495057;
}

.amenity-tag.more {
  background: #007bff;
  color: white;
}

.description {
  color: #666;
  font-style: italic;
  line-height: 1.4;
  margin-top: 15px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #007bff;
}

.enterprise-actions {
  text-align: center;
}

.view-btn {
  width: 100%;
  padding: 12px;
  font-weight: 600;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
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
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-radius: 15px 15px 0 0;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  flex: 1;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
  padding: 5px;
  margin-left: 20px;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 0;
}

.image-gallery {
  padding: 0;
}

.main-image {
  width: 100%;
  height: 300px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 1.2rem;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.enterprise-info {
  padding: 30px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.info-value {
  color: #555;
}

.conditions-section,
.amenities-section,
.description-section,
.vacancies-section {
  margin-bottom: 30px;
}

.conditions-section h3,
.amenities-section h3,
.description-section h3,
.vacancies-section h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.3rem;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.amenity-item {
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
}

.vacancies-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.vacancy-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-left: 4px solid #20c997;
}

.vacancy-card.full {
  border-left-color: #dc3545;
  opacity: 0.7;
}

.vacancy-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  gap: 15px;
}

.vacancy-header h4 {
  margin: 0;
  color: #333;
  flex: 1;
  font-size: 1.2rem;
}

.vacancy-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  min-width: 120px;
}

.salary {
  font-weight: 600;
  color: #28a745;
  font-size: 1.1rem;
}

.places-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.places-badge:not(.full) {
  background: #d4edda;
  color: #155724;
}

.places-badge.few {
  background: #fff3cd;
  color: #856404;
}

.places-badge.full {
  background: #f8d7da;
  color: #721c24;
}

.vacancy-description {
  color: #555;
  line-height: 1.5;
  margin-bottom: 10px;
}

.vacancy-requirements {
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.vacancy-actions {
  text-align: center;
  margin-top: 15px;
}

.join-btn {
  position: relative;
  min-height: 44px;
}

.btn-loading {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

.no-vacancies {
  text-align: center;
  padding: 40px;
  color: #666;
  background: #f8f9fa;
  border-radius: 10px;
  border: 2px dashed #dee2e6;
}

.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  animation: slideIn 0.3s ease;
}

.message.success {
  background: #28a745;
  border-left: 4px solid #1e7e34;
}

.message.error {
  background: #dc3545;
  border-left: 4px solid #c82333;
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

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: #007bff;
  border: 2px solid #007bff;
}

.btn-outline:hover {
  background: #007bff;
  color: white;
}

.btn-disabled {
  background: #6c757d;
  color: white;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Адаптивность */
@media (max-width: 768px) {
  .enterprises-page {
    padding: 15px;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .stats-bar {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    min-width: auto;
  }

  .enterprises-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    margin: 10px;
    max-height: calc(100vh - 20px);
  }

  .modal-header {
    padding: 20px;
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .close-btn {
    align-self: flex-end;
    margin-top: -10px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .vacancy-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .vacancy-meta {
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: space-between;
  }

  .amenities-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .enterprise-card {
    padding: 20px;
  }

  .enterprise-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .vacancies-badge {
    align-self: flex-start;
  }

  .stat-number {
    font-size: 2rem;
  }

  .empty-icon {
    font-size: 3rem;
  }
}

/* Анимации */
.enterprise-card {
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Скроллбар для модального окна */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 0 0 15px 0;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Состояния загрузки */
.btn-loading {
  display: inline-block;
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

/* Улучшение доступности */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Фокус состояния для доступности */
.btn:focus,
.filter-input:focus,
.filter-select:focus,
.close-btn:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Темная тема поддержка */
@media (prefers-color-scheme: dark) {
  .enterprise-card,
  .filters-section,
  .empty-state,
  .modal-content {
    background: #2d3748;
    color: #e2e8f0;
  }

  .enterprise-header h3,
  .modal-header h2,
  .vacancy-header h4 {
    color: #f7fafc;
  }

  .detail-text,
  .info-value {
    color: #cbd5e0;
  }

  .filter-input,
  .filter-select {
    background: #4a5568;
    border-color: #718096;
    color: #e2e8f0;
  }

  .description {
    background: #4a5568;
    color: #cbd5e0;
  }
}
</style scoped>