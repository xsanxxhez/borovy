<template>
  <div class="specialty-detail-page">
    <!-- Хлебные крошки -->
    <div class="breadcrumbs">
      <nuxt-link to="/borov/specialties" class="breadcrumb-link">
        ← Назад к списку специальностей
      </nuxt-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Загрузка информации о специальности...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">❌</div>
      <h3>Специальность не найдена</h3>
      <p>Возможно, она была удалена или вы ввели неверный ID</p>
      <nuxt-link to="/borov/specialties" class="btn btn-primary">
        Вернуться к списку
      </nuxt-link>
    </div>

    <!-- Specialty Content -->
    <div v-else-if="specialty" class="specialty-content">
      <!-- Header -->
      <div class="specialty-header">
        <div class="header-main">
          <h1>{{ specialty.title }}</h1>
          <div class="specialty-meta">
            <span class="enterprise">🏢 {{ specialty.vakhta_title }}</span>
            <span class="location">📍 {{ specialty.location }}</span>
            <span class="dates">
              📅 {{ formatDate(specialty.start_date) }} - {{ formatDate(specialty.end_date) }}
            </span>
          </div>
        </div>

        <div class="header-actions">
          <div class="salary-badge">
            {{ formatSalary(specialty.salary) }}/день
          </div>
          <div class="places-badge" :class="getPlacesClass(specialty.free_places)">
            {{ specialty.free_places }} из {{ specialty.total_places }} мест
          </div>
        </div>
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

      <!-- Main Content -->
      <div class="content-grid">
        <!-- Left Column - Details -->
        <div class="details-column">
          <!-- Description -->
          <div v-if="specialty.description" class="info-card">
            <h3>📝 Описание работы</h3>
            <p>{{ specialty.description }}</p>
          </div>

          <!-- Requirements -->
          <div v-if="specialty.requirements" class="info-card">
            <h3>📋 Требования</h3>
            <p>{{ specialty.requirements }}</p>
          </div>

          <!-- Enterprise Info -->
          <div class="info-card">
            <h3>🏢 О предприятии</h3>
            <div class="enterprise-info">
              <div class="info-item">
                <strong>Название:</strong> {{ specialty.vakhta_title }}
              </div>
              <div class="info-item">
                <strong>Местоположение:</strong> {{ specialty.location }}
              </div>
              <div class="info-item">
                <strong>Период работы:</strong>
                {{ formatDate(specialty.start_date) }} - {{ formatDate(specialty.end_date) }}
                ({{ calculateDuration(specialty.start_date, specialty.end_date) }} дней)
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Actions & Stats -->
        <div class="actions-column">
          <!-- Quick Stats -->
          <div class="stats-card">
            <h3>📊 Быстрая информация</h3>
            <div class="stats-grid">
              <div class="stat">
                <div class="stat-icon">💰</div>
                <div class="stat-content">
                  <strong>Зарплата</strong>
                  <p>{{ formatSalary(specialty.salary) }} в день</p>
                </div>
              </div>
              <div class="stat">
                <div class="stat-icon">👥</div>
                <div class="stat-content">
                  <strong>Доступные места</strong>
                  <p>{{ specialty.free_places }} из {{ specialty.total_places }}</p>
                </div>
              </div>
              <div class="stat">
                <div class="stat-icon">📅</div>
                <div class="stat-content">
                  <strong>Начало</strong>
                  <p>{{ formatDate(specialty.start_date) }}</p>
                </div>
              </div>
              <div class="stat">
                <div class="stat-icon">⏱️</div>
                <div class="stat-content">
                  <strong>Длительность</strong>
                  <p>{{ calculateDuration(specialty.start_date, specialty.end_date) }} дней</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Card -->
          <div class="action-card">
            <h3>🎯 Действия</h3>

            <button
              v-if="!hasActiveSpecialty && specialty.free_places > 0"
              @click="joinSpecialty"
              :disabled="joining"
              class="btn btn-primary btn-large btn-full"
            >
              <span v-if="joining" class="btn-spinner"></span>
              {{ joining ? 'Записываем...' : '📝 Записаться на эту работу' }}
            </button>

            <button
              v-else-if="hasActiveSpecialty"
              disabled
              class="btn btn-disabled btn-large btn-full"
            >
              ❌ У вас есть активная работа
            </button>

            <button
              v-else
              disabled
              class="btn btn-disabled btn-large btn-full"
            >
              ❌ Нет свободных мест
            </button>

            <div class="action-note">
              <p>💡 После записи с вами свяжутся и вы сможете начать работу в указанную дату</p>
            </div>
          </div>

          <!-- Share Card -->
          <div class="share-card">
            <h3>📤 Поделиться</h3>
            <div class="share-buttons">
              <button @click="copyLink" class="btn btn-outline btn-sm">
                📋 Скопировать ссылку
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Notification -->
    <div v-if="showSuccess" class="notification success">
      <div class="notification-content">
        <span class="notification-icon">✅</span>
        <div class="notification-text">
          <strong>Успешно записались на работу!</strong>
          <p>Вы записаны на специальность "{{ specialty?.title }}"</p>
        </div>
      </div>
      <button @click="showSuccess = false" class="notification-close">✕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const route = useRoute()

const specialty = ref(null)
const loading = ref(true)
const error = ref(false)
const joining = ref(false)
const showSuccess = ref(false)
const hasActiveSpecialty = ref(false)

// Загрузка данных специальности
const loadSpecialty = async () => {
  try {
    loading.value = true
    error.value = false

    const specialtyId = route.params.id

    // Используем API для загрузки конкретной специальности
    const response = await $fetch(`http://localhost:3001/api/specialties/${specialtyId}`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })

    specialty.value = response

  } catch (err: any) {
    console.error('Error loading specialty:', err)
    if (err.status === 404) {
      error.value = true
    } else {
      alert('Ошибка при загрузке специальности')
    }
  } finally {
    loading.value = false
  }
}

// Проверка активной специальности
const checkActiveSpecialty = async () => {
  try {
    const response = await $fetch('http://localhost:3001/api/borov/specialties/my', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    hasActiveSpecialty.value = response.some((s: any) => s.status === 'active')
  } catch (error) {
    console.error('Error checking active specialty:', error)
  }
}

// Запись на специальность
const joinSpecialty = async () => {
  try {
    joining.value = true

    await $fetch('http://localhost:3001/api/borov/specialties/join', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authStore.token}` },
      body: { specialty_id: specialty.value.id }
    })

    showSuccess.value = true
    await Promise.all([loadSpecialty(), checkActiveSpecialty()])

    // Автоматически скрываем уведомление
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)

  } catch (error: any) {
    console.error('Error joining specialty:', error)
    alert(error.data?.error || 'Ошибка при записи на специальность')
  } finally {
    joining.value = false
  }
}

// Копирование ссылки
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    alert('Ссылка скопирована в буфер обмена!')
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
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

const getPlacesClass = (freePlaces: number) => {
  if (freePlaces === 0) return 'full'
  if (freePlaces <= 3) return 'few'
  return 'available'
}

// Инициализация
onMounted(async () => {
  await Promise.all([loadSpecialty(), checkActiveSpecialty()])
})

// Обновляем данные при изменении параметров маршрута
watch(() => route.params.id, () => {
  loadSpecialty()
})
</script>

<style scoped>
.specialty-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.breadcrumbs {
  margin-bottom: 30px;
}

.breadcrumb-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.loading-state, .error-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
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

.error-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.error-state h3 {
  margin-bottom: 15px;
  color: #333;
}

.error-state p {
  margin-bottom: 25px;
  color: #666;
}

.specialty-header {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  margin-bottom: 25px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
}

.header-main h1 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 2rem;
}

.specialty-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.specialty-meta span {
  color: #666;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: 200px;
}

.salary-badge {
  background: #28a745;
  color: white;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
}

.places-badge {
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
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

.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
}

.details-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.actions-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card, .stats-card, .action-card, .share-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.info-card h3, .stats-card h3, .action-card h3, .share-card h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.3rem;
}

.enterprise-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item {
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.info-item:last-child {
  border-bottom: none;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-content strong {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.stat-content p {
  margin: 0;
  color: #666;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline {
  background: transparent;
  border: 1px solid #007bff;
  color: #007bff;
}

.btn-outline:hover:not(:disabled) {
  background: #007bff;
  color: white;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: 1px solid #007bff;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
  border-color: #0056b3;
}

.btn-disabled {
  background: #6c757d;
  color: white;
  border: 1px solid #6c757d;
  cursor: not-allowed;
}

.btn-sm {
  padding: 8px 12px;
  font-size: 13px;
}

.btn-large {
  padding: 15px 25px;
  font-size: 1.1rem;
}

.btn-full {
  width: 100%;
  justify-content: center;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.action-note {
  margin-top: 15px;
  padding: 12px;
  background: #e7f3ff;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.action-note p {
  margin: 0;
  color: #0066cc;
  font-size: 0.9rem;
}

.share-buttons {
  display: flex;
  gap: 10px;
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
  .content-grid {
    grid-template-columns: 1fr;
  }

  .specialty-header {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
    flex-direction: row;
  }

  .specialty-meta {
    flex-direction: column;
    gap: 10px;
  }

  .warning-banner {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}
</style>