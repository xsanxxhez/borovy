<template>
  <div class="enterprise-detail-page">
    <!-- Хлебные крошки -->
    <nav class="breadcrumbs">
      <nuxt-link to="/borov/enterprises" class="breadcrumb-link">
        ← Назад к предприятиям
      </nuxt-link>
    </nav>

    <!-- Загрузка -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Загрузка информации о предприятии...</p>
    </div>

    <!-- Основной контент -->
    <div v-else-if="enterprise" class="enterprise-content">
      <!-- Хедер предприятия -->
      <div class="enterprise-header">
        <div class="header-main">
          <h1>{{ enterprise.title }}</h1>
          <div class="enterprise-meta">
            <span class="location">📍 {{ enterprise.location }}</span>
            <span class="workers">👥 {{ enterprise.current_workers || 0 }}/{{ enterprise.total_places }} работников</span>
          </div>
        </div>

        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-value">{{ enterprise.specialties?.length || 0 }}</div>
            <div class="stat-label">вакансий</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ calculateDuration(enterprise.start_date, enterprise.end_date) }}</div>
            <div class="stat-label">дней</div>
          </div>
        </div>
      </div>

      <!-- Предупреждение об активной работе -->
      <div v-if="hasActiveWork" class="work-warning">
        <div class="warning-content">
          <span class="warning-icon">⚠️</span>
          <div>
            <div class="warning-title">У вас активная работа</div>
            <div class="warning-text">Завершите текущую вахту для записи на новую</div>
          </div>
        </div>
      </div>

      <!-- Информация о предприятии -->
      <div class="info-section">
        <h2>📋 Информация о предприятии</h2>
        <div class="info-grid">
          <div class="info-card">
            <div class="info-icon">📅</div>
            <div class="info-content">
              <div class="info-label">Период работы</div>
              <div class="info-value">
                {{ formatDate(enterprise.start_date) }} - {{ formatDate(enterprise.end_date) }}
              </div>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon">⏱️</div>
            <div class="info-content">
              <div class="info-label">Длительность</div>
              <div class="info-value">
                {{ calculateDuration(enterprise.start_date, enterprise.end_date) }} дней
              </div>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon">👥</div>
            <div class="info-content">
              <div class="info-label">Занято мест</div>
              <div class="info-value">
                {{ enterprise.current_workers || 0 }} из {{ enterprise.total_places }}
              </div>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon">🎯</div>
            <div class="info-content">
              <div class="info-label">Статус</div>
              <div class="info-value" :class="getEnterpriseStatus(enterprise)">
                {{ getStatusText(enterprise) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Описание -->
        <div v-if="enterprise.description" class="description-section">
          <h3>Описание</h3>
          <p>{{ enterprise.description }}</p>
        </div>

        <!-- Требования -->
        <div v-if="enterprise.requirements" class="requirements-section">
          <h3>Общие требования</h3>
          <p>{{ enterprise.requirements }}</p>
        </div>

        <!-- Условия -->
        <div v-if="enterprise.conditions" class="conditions-section">
          <h3>Условия работы</h3>
          <p>{{ enterprise.conditions }}</p>
        </div>
      </div>

      <!-- Специальности -->
      <div class="specialties-section">
        <div class="section-header">
          <h2>💼 Доступные вакансии</h2>
          <div class="section-badge">{{ enterprise.specialties?.length || 0 }} позиций</div>
        </div>

        <div v-if="!enterprise.specialties || enterprise.specialties.length === 0" class="no-specialties">
          <div class="empty-icon">💼</div>
          <h3>Нет доступных вакансий</h3>
          <p>На этом предприятии пока нет открытых вакансий</p>
        </div>

        <div v-else class="specialties-grid">
          <div
            v-for="specialty in enterprise.specialties"
            :key="specialty.id"
            class="specialty-card"
            :class="{ 'disabled': specialty.free_places === 0 || hasActiveWork }"
          >
            <div class="specialty-header">
              <h3>{{ specialty.title }}</h3>
              <div class="specialty-meta">
                <span class="salary">{{ formatSalary(specialty.salary) }}/день</span>
                <span class="places" :class="getPlacesClass(specialty.free_places)">
                  {{ specialty.free_places }} из {{ specialty.total_places }} мест
                </span>
              </div>
            </div>

            <div class="specialty-content">
              <div v-if="specialty.description" class="description">
                {{ specialty.description }}
              </div>

              <div v-if="specialty.requirements" class="requirements">
                <strong>Требования:</strong> {{ specialty.requirements }}
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

    <!-- Ошибка -->
    <div v-else class="error-state">
      <div class="error-icon">❌</div>
      <h3>Предприятие не найдено</h3>
      <p>Запрошенное предприятие не существует или было удалено</p>
      <nuxt-link to="/borov/enterprises" class="btn btn-primary">
        Вернуться к предприятиям
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const route = useRoute()

const enterprise = ref(null)
const loading = ref(false)
const hasActiveWork = ref(false)
const applyingForSpecialty = ref(null)

// Загрузка данных предприятия
const loadEnterprise = async () => {
  try {
    loading.value = true
    const enterprises = await $fetch('http://localhost:3001/api/vakhta', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })

    const foundEnterprise = enterprises.find((e: any) => e.id === parseInt(route.params.id as string))
    enterprise.value = foundEnterprise || null

    // Проверяем активную работу
    const mySpecialties = await $fetch('http://localhost:3001/api/borov/specialties/my', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    hasActiveWork.value = mySpecialties.some((s: any) => s.status === 'active')

  } catch (error) {
    console.error('Error loading enterprise:', error)
    enterprise.value = null
  } finally {
    loading.value = false
  }
}

// Запись на специальность
const applyForSpecialty = async (specialty: any) => {
  try {
    applyingForSpecialty.value = specialty.id

    await $fetch('http://localhost:3001/api/borov/specialties/join', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authStore.token}` },
      body: { specialty_id: specialty.id }
    })

    alert(`🎉 Вы успешно записались на вакансию "${specialty.title}"!`)
    await loadEnterprise() // Обновляем данные

  } catch (error: any) {
    console.error('Error applying for specialty:', error)
    alert(error.data?.error || 'Ошибка при записи на вакансию')
  } finally {
    applyingForSpecialty.value = null
  }
}

// Вспомогательные функции
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const formatSalary = (amount: number) => {
  return new Intl.NumberFormat('ru-RU').format(amount) + ' ₽'
}

const calculateDuration = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

const getEnterpriseStatus = (enterprise: any) => {
  const freePlaces = enterprise.total_places - (enterprise.current_workers || 0)
  if (freePlaces === 0) return 'full'
  if (freePlaces <= 3) return 'limited'
  return 'available'
}

const getStatusText = (enterprise: any) => {
  const freePlaces = enterprise.total_places - (enterprise.current_workers || 0)
  if (freePlaces === 0) return 'Нет мест'
  if (freePlaces <= 3) return 'Мало мест'
  return 'Есть места'
}

const getPlacesClass = (freePlaces: number) => {
  if (freePlaces === 0) return 'no-places'
  if (freePlaces <= 3) return 'few-places'
  return 'available'
}

onMounted(() => {
  loadEnterprise()
})
</script>

<style scoped>
.enterprise-detail-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px 20px;
  background: #0f0f0f;
  min-height: 100vh;
}

/* Хлебные крошки */
.breadcrumbs {
  margin-bottom: 30px;
}

.breadcrumb-link {
  color: #007bff;
  text-decoration: none;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #333;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.breadcrumb-link:hover {
  background: #1a1a1a;
  border-color: #007bff;
}

/* Загрузка и ошибки */
.loading-state, .error-state {
  text-align: center;
  padding: 80px 20px;
  background: #1a1a1a;
  border-radius: 12px;
  border: 1px solid #333;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #333;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.error-icon, .empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.7;
}

.error-state h3, .empty-state h3 {
  color: #fff;
  margin-bottom: 10px;
}

.error-state p, .empty-state p {
  color: #888;
  margin-bottom: 25px;
}

/* Хедер предприятия */
.enterprise-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #333;
}

.header-main h1 {
  margin: 0 0 15px 0;
  color: #fff;
  font-size: 2.2rem;
  font-weight: 700;
}

.enterprise-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.location, .workers {
  color: #888;
  font-size: 1rem;
}

.header-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 15px 20px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 5px;
}

.stat-label {
  color: #888;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Предупреждение */
.work-warning {
  background: #2d1a1a;
  border: 1px solid #5a2a2a;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.warning-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.warning-icon {
  font-size: 1.5rem;
}

.warning-title {
  color: #ff6b6b;
  font-weight: 600;
  margin-bottom: 4px;
}

.warning-text {
  color: #ccc;
  font-size: 0.9rem;
}

/* Секции информации */
.info-section {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
}

.info-section h2 {
  margin: 0 0 25px 0;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.info-card:hover {
  border-color: #007bff;
  transform: translateY(-2px);
}

.info-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.info-label {
  color: #888;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
}

.info-value {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
}

.info-value.available {
  color: #4caf50;
}

.info-value.limited {
  color: #ff9800;
}

.info-value.full {
  color: #f44336;
}

.description-section, .requirements-section, .conditions-section {
  margin-top: 25px;
  padding-top: 25px;
  border-top: 1px solid #333;
}

.description-section h3, .requirements-section h3, .conditions-section h3 {
  margin: 0 0 15px 0;
  color: #fff;
  font-size: 1.2rem;
}

.description-section p, .requirements-section p, .conditions-section p {
  color: #ccc;
  line-height: 1.6;
  margin: 0;
}

/* Специальности */
.specialties-section {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-header h2 {
  margin: 0;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
}

.section-badge {
  background: #007bff;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.no-specialties {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.specialties-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.specialty-card {
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 25px;
  transition: all 0.3s ease;
  position: relative;
}

.specialty-card:not(.disabled):hover {
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 123, 255, 0.1);
}

.specialty-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.specialty-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  gap: 20px;
}

.specialty-header h3 {
  margin: 0;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 600;
}

.specialty-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  min-width: 150px;
}

.salary {
  color: #4caf50;
  font-weight: 600;
  font-size: 1.1rem;
}

.places {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.places.available {
  background: #1a3a1a;
  color: #4caf50;
  border: 1px solid #2d5a2d;
}

.places.few-places {
  background: #3a2a1a;
  color: #ff9800;
  border: 1px solid #5a452a;
}

.places.no-places {
  background: #3a1a1a;
  color: #f44336;
  border: 1px solid #5a2a2a;
}

.specialty-content {
  margin-bottom: 20px;
}

.description {
  color: #ccc;
  line-height: 1.5;
  margin-bottom: 15px;
}

.requirements {
  color: #999;
  font-size: 0.9rem;
  line-height: 1.4;
}

.specialty-actions {
  display: flex;
  justify-content: flex-end;
}

/* Кнопки */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-disabled {
  background: #666;
  color: #ccc;
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

/* Анимации */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Адаптивность */
@media (max-width: 768px) {
  .enterprise-header {
    flex-direction: column;
    gap: 20px;
  }

  .header-stats {
    width: 100%;
    justify-content: space-around;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .specialty-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .specialty-meta {
    align-items: flex-start;
    width: 100%;
  }

  .specialty-actions {
    justify-content: stretch;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>