<template>
  <div class="specialties-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>🔍 Поиск работы</h1>
        <p>Выберите специальность и предприятие для работы</p>
      </div>

      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-number">{{ filteredSpecialties.length }}</span>
          <span class="stat-label">доступных вакансий</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ uniqueEnterprises }}</span>
          <span class="stat-label">предприятий</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ nearestStartDate }}</span>
          <span class="stat-label">ближайший старт</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <label>🔍 Поиск:</label>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Название специальности или предприятия..."
          class="filter-input"
        >
      </div>

      <div class="filter-group">
        <label>📍 Город:</label>
        <select v-model="filters.location" class="filter-select">
          <option value="">Все города</option>
          <option v-for="location in locations" :key="location" :value="location">
            {{ location }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>💰 Зарплата от:</label>
        <select v-model="filters.minSalary" class="filter-select">
          <option value="">Любая</option>
          <option value="4000">4 000 ₽</option>
          <option value="5000">5 000 ₽</option>
          <option value="6000">6 000 ₽</option>
          <option value="7000">7 000 ₽</option>
        </select>
      </div>

      <div class="filter-group">
        <label>📅 Дата начала:</label>
        <select v-model="filters.startDate" class="filter-select">
          <option value="">Любая дата</option>
          <option value="week">В течение недели</option>
          <option value="month">В течение месяца</option>
        </select>
      </div>

      <button @click="clearFilters" class="btn btn-outline btn-sm">
        🗑️ Очистить
      </button>
    </div>

    <!-- Active Work Warning -->
    <div v-if="hasActiveSpecialty" class="warning-banner">
      <div class="warning-content">
        <span class="warning-icon">⚠️</span>
        <div class="warning-text">
          <strong>У вас уже есть активная работа</strong>
          <p>Вы не можете записаться на новую специальность, пока не завершите текущую</p>
        </div>
      </div>
      <nuxt-link to="/borov" class="btn btn-outline btn-sm">
        Перейти к текущей работе →
      </nuxt-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Загрузка доступных специальностей...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredSpecialties.length === 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>Специальности не найдены</h3>
      <p>Попробуйте изменить параметры поиска или зайдите позже</p>
      <button @click="clearFilters" class="btn btn-primary">
        Сбросить фильтры
      </button>
    </div>

    <!-- Specialties Grid -->
    <div v-else class="specialties-grid">
      <div
        v-for="specialty in filteredSpecialties"
        :key="specialty.id"
        class="specialty-card"
        :class="{ 'featured': isFeatured(specialty) }"
      >
        <!-- Featured Badge -->
        <div v-if="isFeatured(specialty)" class="featured-badge">
          ⭐ Популярно
        </div>

        <div class="specialty-header">
          <div class="specialty-main">
            <h3>{{ specialty.title }}</h3>
            <p class="enterprise">🏢 {{ specialty.vakhta_title }}</p>
            <p class="location">📍 {{ specialty.location }}</p>
          </div>

          <div class="specialty-meta">
            <div class="salary">{{ formatSalary(specialty.salary) }}/день</div>
            <div class="places-badge" :class="getPlacesClass(specialty.free_places)">
              {{ specialty.free_places }} мест
            </div>
          </div>
        </div>

        <div class="specialty-details">
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-icon">📅</span>
              <span class="detail-text">
                {{ formatDate(specialty.start_date) }} - {{ formatDate(specialty.end_date) }}
              </span>
            </div>

            <div class="detail-item">
              <span class="detail-icon">⏱️</span>
              <span class="detail-text">
                {{ calculateDuration(specialty.start_date, specialty.end_date) }} дней
              </span>
            </div>
          </div>

          <div v-if="specialty.description" class="description">
            {{ truncateText(specialty.description, 120) }}
          </div>

          <div v-if="specialty.requirements" class="requirements">
            <strong>Требования:</strong> {{ truncateText(specialty.requirements, 100) }}
          </div>
        </div>

        <div class="specialty-actions">
          <button
            @click="viewSpecialtyDetails(specialty)"
            class="btn btn-outline"
          >
            👀 Подробнее
          </button>

          <button
            v-if="!hasActiveSpecialty"
            @click="joinSpecialty(specialty.id)"
            :disabled="joiningSpecialty === specialty.id"
            :class="['btn', 'btn-primary', { 'loading': joiningSpecialty === specialty.id }]"
          >
            <span v-if="joiningSpecialty === specialty.id" class="btn-spinner"></span>
            {{ joiningSpecialty === specialty.id ? 'Записываем...' : '📝 Записаться' }}
          </button>

          <button
            v-else
            disabled
            class="btn btn-disabled"
          >
            ❌ У вас есть активная работа
          </button>
        </div>
      </div>
    </div>

    <!-- Specialty Details Modal -->
    <div v-if="selectedSpecialty" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedSpecialty.title }}</h2>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>

        <div class="modal-body">
          <!-- Enterprise Info -->
          <div class="enterprise-section">
            <h3>🏢 О предприятии</h3>
            <div class="enterprise-info">
              <div class="info-item">
                <strong>Название:</strong> {{ selectedSpecialty.vakhta_title }}
              </div>
              <div class="info-item">
                <strong>Местоположение:</strong> {{ selectedSpecialty.location }}
              </div>
              <div class="info-item">
                <strong>Период работы:</strong>
                {{ formatDate(selectedSpecialty.start_date) }} - {{ formatDate(selectedSpecialty.end_date) }}
                ({{ calculateDuration(selectedSpecialty.start_date, selectedSpecialty.end_date) }} дней)
              </div>
            </div>
          </div>

          <!-- Specialty Details -->
          <div class="details-section">
            <h3>👷 Описание работы</h3>
            <div class="specialty-details-grid">
              <div class="detail-card">
                <div class="detail-icon">💰</div>
                <div class="detail-content">
                  <strong>Зарплата</strong>
                  <p>{{ formatSalary(selectedSpecialty.salary) }} в день</p>
                </div>
              </div>

              <div class="detail-card">
                <div class="detail-icon">👥</div>
                <div class="detail-content">
                  <strong>Доступные места</strong>
                  <p>{{ selectedSpecialty.free_places }} из {{ selectedSpecialty.total_places }}</p>
                </div>
              </div>

              <div class="detail-card">
                <div class="detail-icon">📅</div>
                <div class="detail-content">
                  <strong>Начало</strong>
                  <p>{{ formatDate(selectedSpecialty.start_date) }}</p>
                </div>
              </div>

              <div class="detail-card">
                <div class="detail-icon">🎯</div>
                <div class="detail-content">
                  <strong>Статус</strong>
                  <p :class="getPlacesClass(selectedSpecialty.free_places)">
                    {{ selectedSpecialty.free_places > 0 ? 'Есть места' : 'Заполнено' }}
                  </p>
                </div>
              </div>
            </div>

            <div v-if="selectedSpecialty.description" class="description-full">
              <h4>Описание работы:</h4>
              <p>{{ selectedSpecialty.description }}</p>
            </div>

            <div v-if="selectedSpecialty.requirements" class="requirements-full">
              <h4>Требования:</h4>
              <p>{{ selectedSpecialty.requirements }}</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn btn-outline">
            Назад к поиску
          </button>

          <button
            v-if="!hasActiveSpecialty && selectedSpecialty.free_places > 0"
            @click="joinSpecialty(selectedSpecialty.id)"
            :disabled="joiningSpecialty === selectedSpecialty.id"
            class="btn btn-primary btn-large"
          >
            <span v-if="joiningSpecialty === selectedSpecialty.id" class="btn-spinner"></span>
            {{ joiningSpecialty === selectedSpecialty.id ? 'Записываем...' : '📝 Записаться на эту работу' }}
          </button>

          <button
            v-else-if="hasActiveSpecialty"
            disabled
            class="btn btn-disabled"
          >
            ❌ У вас есть активная работа
          </button>

          <button
            v-else
            disabled
            class="btn btn-disabled"
          >
            ❌ Нет свободных мест
          </button>
        </div>
      </div>
    </div>

    <!-- Success Notification -->
    <div v-if="showSuccess" class="notification success">
      <div class="notification-content">
        <span class="notification-icon">✅</span>
        <div class="notification-text">
          <strong>Успешно записались на работу!</strong>
          <p>Вы записаны на специальность "{{ joinedSpecialtyTitle }}"</p>
        </div>
      </div>
      <button @click="showSuccess = false" class="notification-close">✕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const specialties = ref([])
const selectedSpecialty = ref(null)
const loading = ref(false)
const joiningSpecialty = ref(null)
const showSuccess = ref(false)
const joinedSpecialtyTitle = ref('')

const filters = reactive({
  search: '',
  location: '',
  minSalary: '',
  startDate: ''
})

// Загрузка специальностей
const loadSpecialties = async () => {
  try {
    loading.value = true
    const response = await $fetch('http://localhost:3001/api/borov/specialties/available', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    specialties.value = response
  } catch (error) {
    console.error('Error loading specialties:', error)
  } finally {
    loading.value = false
  }
}

// Проверка активной специальности
const hasActiveSpecialty = ref(false)

const checkActiveSpecialty = async () => {
  try {
    const response = await $fetch('http://localhost:3001/api/borov/specialties/my', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    hasActiveSpecialty.value = response.some((s: any) => s.status === 'active')
  } catch (error) {
    console.error('Error checking active specialty:', error)
  }
}

// Фильтрация
const filteredSpecialties = computed(() => {
  let filtered = [...specialties.value]

  if (filters.search) {
    const query = filters.search.toLowerCase()
    filtered = filtered.filter(s =>
      s.title.toLowerCase().includes(query) ||
      s.vakhta_title.toLowerCase().includes(query) ||
      s.location.toLowerCase().includes(query)
    )
  }

  if (filters.location) {
    filtered = filtered.filter(s => s.location === filters.location)
  }

  if (filters.minSalary) {
    filtered = filtered.filter(s => s.salary >= parseInt(filters.minSalary))
  }

  if (filters.startDate) {
    const now = new Date()
    const futureDate = new Date()

    if (filters.startDate === 'week') {
      futureDate.setDate(now.getDate() + 7)
    } else if (filters.startDate === 'month') {
      futureDate.setDate(now.getDate() + 30)
    }

    filtered = filtered.filter(s => {
      const startDate = new Date(s.start_date)
      return startDate <= futureDate
    })
  }

  return filtered
})

// Уникальные локации для фильтра
const locations = computed(() => {
  return [...new Set(specialties.value.map(s => s.location))].sort()
})

// Статистика
const uniqueEnterprises = computed(() => {
  return new Set(specialties.value.map(s => s.vakhta_title)).size
})

const nearestStartDate = computed(() => {
  if (specialties.value.length === 0) return '-'

  const nearest = specialties.value.reduce((nearest, specialty) => {
    const specialtyDate = new Date(specialty.start_date)
    return (!nearest || specialtyDate < new Date(nearest.start_date)) ? specialty : nearest
  }, null)

  return nearest ? formatDate(nearest.start_date) : '-'
})

// Действия
const joinSpecialty = async (specialtyId: number) => {
  try {
    joiningSpecialty.value = specialtyId

    await $fetch('http://localhost:3001/api/borov/specialties/join', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      body: {
        specialty_id: specialtyId
      }
    })

    const joinedSpecialty = specialties.value.find(s => s.id === specialtyId)
    joinedSpecialtyTitle.value = joinedSpecialty?.title || ''
    showSuccess.value = true

    // Обновляем данные
    await Promise.all([loadSpecialties(), checkActiveSpecialty()])
    closeModal()

    // Автоматически скрываем уведомление через 5 секунд
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)

  } catch (error: any) {
    console.error('Error joining specialty:', error)
    alert(error.data?.error || 'Ошибка при записи на специальность')
  } finally {
    joiningSpecialty.value = null
  }
}

const viewSpecialtyDetails = (specialty: any) => {
  selectedSpecialty.value = specialty
}

const closeModal = () => {
  selectedSpecialty.value = null
}

const clearFilters = () => {
  Object.assign(filters, {
    search: '',
    location: '',
    minSalary: '',
    startDate: ''
  })
}

// Вспомогательные функции
const formatSalary = (amount: number) => {
  return new Intl.NumberFormat('ru-RU').format(amount) + ' ₽'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const calculateDuration = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

const truncateText = (text: string, length: number) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const getPlacesClass = (freePlaces: number) => {
  if (freePlaces === 0) return 'full'
  if (freePlaces <= 3) return 'few'
  return 'available'
}

const isFeatured = (specialty: any) => {
  // Помечаем как популярные специальности с высокой зарплатой или малым количеством мест
  return specialty.salary >= 6000 || specialty.free_places <= 2
}

// Инициализация
onMounted(async () => {
  await Promise.all([loadSpecialties(), checkActiveSpecialty()])
})
</script>

<style scoped>
.specialties-page {
  max-width: 1200px;
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
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  padding: 25px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  flex-wrap: wrap;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 180px;
}

.filter-group label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.filter-input, .filter-select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.filter-input:focus, .filter-select:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

.warning-banner {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.specialties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 25px;
}

.specialty-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  position: relative;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.specialty-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.specialty-card.featured {
  border-color: #ffc107;
  background: linear-gradient(135deg, #fff, #fff9e6);
}

.featured-badge {
  position: absolute;
  top: -10px;
  right: 20px;
  background: #ffc107;
  color: #212529;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.specialty-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 15px;
}

.specialty-main h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.3rem;
  line-height: 1.3;
}

.enterprise, .location {
  margin: 5px 0;
  color: #666;
  font-size: 0.9rem;
}

.specialty-meta {
  text-align: right;
  min-width: 120px;
}

.salary {
  font-size: 1.2rem;
  font-weight: bold;
  color: #28a745;
  margin-bottom: 8px;
}

.places-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.places-badge.available {
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

.specialty-details {
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  font-size: 0.9rem;
}

.description, .requirements {
  margin: 10px 0;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
  line-height: 1.4;
}

.requirements {
  border-left: 3px solid #007bff;
}

.specialty-actions {
  display: flex;
  gap: 10px;
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
  border-radius: 20px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  border-bottom: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-radius: 20px 20px 0 0;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
  padding: 5px;
  border-radius: 4px;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #333;
}

.modal-body {
  padding: 30px;
}

.enterprise-section, .details-section {
  margin-bottom: 30px;
}

.enterprise-section h3, .details-section h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.3rem;
}

.enterprise-info {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}

.info-item {
  margin-bottom: 10px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.specialty-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.detail-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
  border: 1px solid #e9ecef;
}

.detail-card .detail-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.detail-card strong {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.detail-card p {
  margin: 0;
  color: #666;
}

.description-full, .requirements-full {
  margin-top: 25px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.description-full h4, .requirements-full h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.description-full p, .requirements-full p {
  margin: 0;
  line-height: 1.6;
  color: #555;
}

.modal-footer {
  padding: 25px 30px;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.btn-large {
  padding: 15px 25px;
  font-size: 1.1rem;
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
  border-left: 4px solid #28a745;
}

.notification.success {
  border-left-color: #28a745;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.notification-icon {
  font-size: 1.5rem;
}

.notification-text strong {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.notification-text p {
  margin: 0;
  color: #666;
}

.notification-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: #6c757d;
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
  .header-stats {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .filters-section {
    flex-direction: column;
  }

  .filter-group {
    min-width: auto;
  }

  .specialties-grid {
    grid-template-columns: 1fr;
  }

  .specialty-header {
    flex-direction: column;
  }

  .specialty-meta {
    text-align: left;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .specialty-actions {
    flex-direction: column;
  }

  .warning-banner {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .modal-content {
    margin: 10px;
  }

  .modal-footer {
    flex-direction: column;
  }

  .specialty-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>