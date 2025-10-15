<template>
  <div class="specialties-page">
    <!-- Анимированный фон -->
    <div class="background-animation">
      <div class="parallax-layer layer-1"></div>
      <div class="parallax-layer layer-2"></div>
      <div class="parallax-layer layer-3"></div>
      <div class="gradient-overlay"></div>
    </div>

    <!-- Плавающие элементы -->
    <div class="floating-elements">
      <div class="floating-element element-1"></div>
      <div class="floating-element element-2"></div>
      <div class="floating-element element-3"></div>
    </div>



    <!-- Кнопка мобильных фильтров -->
    <div class="mobile-filters-toggle">
      <button @click="toggleMobileFilters" class="btn btn-primary">
        <span class="button-content">
          <span class="button-text">Фильтры</span>
          <span class="button-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 4H21M3 8H15M3 12H9M7 20L17 20M13 16L17 20M17 20L13 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </span>
        </span>
      </button>
    </div>

    <div class="page-container">
      <!-- Основной контент с фильтрами -->
      <div class="main-content">
        <!-- Боковые фильтры -->
        <div class="filters-sidebar" :class="{ 'mobile-open': showMobileFilters }" ref="filtersSidebar">
          <!-- Заголовок для мобильной версии -->
          <div class="mobile-filters-header">
            <h3>Фильтры</h3>
            <button @click="closeMobileFilters" class="btn btn-outline btn-sm close-filters-btn">
              <span class="button-content">
                <span class="button-text">Закрыть</span>
                <span class="button-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </span>
              </span>
            </button>
          </div>

          <div class="filters-header">
            <h3>Фильтры</h3>
            <button @click="clearFilters" class="btn btn-outline btn-sm">
              <span class="button-content">
                <span class="button-text">Сбросить</span>
                <span class="button-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </span>
              </span>
            </button>
          </div>

          <div class="filters-content">
            <!-- Поиск -->
            <div class="filter-group">
              <div class="filter-label">
                <div class="filter-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <span>Поиск</span>
              </div>
              <div class="search-input-wrapper">
                <input
                  v-model="filters.search"
                  type="text"
                  placeholder="Название, предприятие..."
                  class="search-input"
                >
              </div>
            </div>

            <!-- Город -->
            <div class="filter-group">
              <div class="filter-label">
                <div class="filter-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.7764 3 12 3C8.22355 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <span>Город</span>
              </div>
              <select v-model="filters.location" class="filter-select">
                <option value="">Все города</option>
                <option v-for="location in locations" :key="location" :value="location">
                  {{ location }}
                </option>
              </select>
            </div>

            <!-- Зарплата -->
            <div class="filter-group">
              <div class="filter-label">
                <div class="filter-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <span>Зарплата</span>
              </div>
              <div class="range-slider-group">
                <div class="range-values">
                  <span class="range-value-min">От: {{ formatSalary(filters.salary[0]) }}</span>
                  <span class="range-value-max">До: {{ formatSalary(filters.salary[1]) }}</span>
                </div>
                <div class="custom-range-slider">
                  <div class="range-track">
                    <div class="range-progress" :style="salaryProgressStyle"></div>
                  </div>
                  <input
                    type="range"
                    v-model.number="filters.salary[0]"
                    :min="salaryRange.min"
                    :max="salaryRange.max"
                    step="1000"
                    class="range-input range-min"
                    @input="updateSalaryRange"
                  >
                  <input
                    type="range"
                    v-model.number="filters.salary[1]"
                    :min="salaryRange.min"
                    :max="salaryRange.max"
                    step="1000"
                    class="range-input range-max"
                    @input="updateSalaryRange"
                  >
                </div>
                <div class="range-labels">
                  <span>{{ formatSalary(salaryRange.min) }}</span>
                  <span>{{ formatSalary(salaryRange.max) }}</span>
                </div>
              </div>
            </div>

            <!-- Длительность -->
            <div class="filter-group">
              <div class="filter-label">
                <div class="filter-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <span>Длительность</span>
              </div>
              <div class="range-slider-group">
                <div class="range-values">
                  <span class="range-value-min">От: {{ filters.duration[0] }} дн.</span>
                  <span class="range-value-max">До: {{ filters.duration[1] }} дн.</span>
                </div>
                <div class="custom-range-slider">
                  <div class="range-track">
                    <div class="range-progress" :style="durationProgressStyle"></div>
                  </div>
                  <input
                    type="range"
                    v-model.number="filters.duration[0]"
                    :min="durationRange.min"
                    :max="durationRange.max"
                    step="1"
                    class="range-input range-min"
                    @input="updateDurationRange"
                  >
                  <input
                    type="range"
                    v-model.number="filters.duration[1]"
                    :min="durationRange.min"
                    :max="durationRange.max"
                    step="1"
                    class="range-input range-max"
                    @input="updateDurationRange"
                  >
                </div>
                <div class="range-labels">
                  <span>{{ durationRange.min }} дн.</span>
                  <span>{{ durationRange.max }} дн.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Основная область контента -->
        <div class="content-area">
          <!-- Баннер активной работы -->
          <div v-if="hasActiveSpecialty && authStore.isAuthenticated" class="warning-banner">
            <div class="banner-glow"></div>
            <div class="warning-content">
              <div class="warning-icon">
                <div class="icon-background"></div>
                <div class="icon-foreground">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <div class="warning-text">
                <strong>У вас уже есть активная работа</strong>
                <p>Вы не можете записаться на новую специальность, пока не отмените текущую</p>
              </div>
            </div>
            <nuxt-link to="/borov" class="btn btn-outline btn-sm">
              <span class="button-content">
                <span class="button-text">Перейти к работе</span>
                <span class="button-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </span>
            </nuxt-link>
          </div>

          <!-- Состояние загрузки -->
          <div v-if="loading" class="loading-state">
            <div class="loading-orbital">
              <div class="orbit orbit-1">
                <div class="satellite"></div>
              </div>
              <div class="orbit orbit-2">
                <div class="satellite"></div>
              </div>
              <div class="central-core">
                <div class="core-inner"></div>
              </div>
            </div>
            <p>Загрузка специальностей...</p>
          </div>

          <!-- Пустое состояние -->
          <div v-else-if="filteredSpecialties.length === 0" class="empty-state">
            <div class="empty-orbital">
              <div class="orbit"></div>
              <div class="central-core">
                <div class="core-inner">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#0a0a0a" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
            </div>
            <h3>Специальности не найдены</h3>
            <p>Попробуйте изменить параметры поиска</p>
            <button @click="clearFilters" class="btn btn-primary">
              <span class="button-content">
                <span class="button-text">Сбросить фильтры</span>
              </span>
            </button>
          </div>

          <!-- Сетка специальностей -->
          <div v-else class="specialties-grid">
            <div
              v-for="specialty in filteredSpecialties"
              :key="specialty.id"
              class="specialty-card"
              :class="{ 'featured': isFeatured(specialty) }"
            >


              <div class="specialty-header">
                <div class="specialty-main">
                  <h3>
                    <nuxt-link
                      :to="`/borov/specialties/${specialty.id}`"
                      class="specialty-title-link"
                    >
                      {{ specialty.title }}
                    </nuxt-link>
                  </h3>
                  <div class="enterprise">
                    <div class="meta-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" stroke-width="2"/>
                        <path d="M9 8H7V16H9V8Z" fill="currentColor"/>
                        <path d="M13 8H11V16H13V8Z" fill="currentColor"/>
                        <path d="M17 8H15V16H17V8Z" fill="currentColor"/>
                      </svg>
                    </div>
                    {{ specialty.vakhta_title }}
                  </div>
                  <div class="location">
                    <div class="meta-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.7764 3 12 3C8.22355 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    {{ specialty.location }}
                  </div>
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
                    <div class="detail-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <span class="detail-text">
                      {{ formatDate(specialty.start_date) }} - {{ formatDate(specialty.end_date) }}
                    </span>
                  </div>

                  <div class="detail-item">
                    <div class="detail-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <span class="detail-text">
                      {{ calculateDuration(specialty.start_date, specialty.end_date) }} дней
                    </span>
                  </div>
                </div>

                <div v-if="specialty.description" class="description">
                  {{ truncateText(specialty.description, 120) }}
                </div>

                <div v-if="specialty.requirements" class="requirements">
                  <div class="requirements-header">
                    <div class="detail-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <strong>Требования:</strong>
                  </div>
                  {{ truncateText(specialty.requirements, 100) }}
                </div>
              </div>

              <div class="specialty-actions">
                <nuxt-link
                  :to="`/borov/specialties/${specialty.id}`"
                  class="btn btn-outline"
                >
                  <span class="button-content">
                    <span class="button-text">Подробнее</span>
                    <span class="button-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" stroke-width="2"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5C16.477 5 20.268 7.943 21.542 12C20.268 16.057 16.477 19 12 19C7.523 19 3.732 16.057 2.458 12Z" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </span>
                  </span>
                </nuxt-link>

                <button
                  v-if="authStore.isAuthenticated && !hasActiveSpecialty && specialty.free_places > 0"
                  @click="joinSpecialty(specialty.id)"
                  :disabled="joiningSpecialty === specialty.id"
                  :class="['btn', 'btn-primary', 'btn-large', { 'loading': joiningSpecialty === specialty.id }]"
                >
                  <span class="button-content">
                    <span v-if="joiningSpecialty === specialty.id" class="btn-spinner"></span>
                    <span v-else class="button-text">Записаться</span>
                    <span v-if="joiningSpecialty !== specialty.id" class="button-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </span>
                  </span>
                </button>

                <button
                  v-else-if="authStore.isAuthenticated && hasActiveSpecialty"
                  disabled
                  class="btn btn-disabled btn-large"
                >
                  <span class="button-text">У вас есть активная работа</span>
                </button>

                <button
                  v-else-if="!authStore.isAuthenticated"
                  @click="redirectToLogin"
                  class="btn btn-primary btn-large"
                >
                  <span class="button-text">Войти для записи</span>
                </button>

                <button
                  v-else
                  disabled
                  class="btn btn-disabled btn-large"
                >
                  <span class="button-text">Нет мест</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Уведомление об успехе -->
    <div v-if="showSuccess" class="notification-message success show">
      <div class="notification-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="notification-content">
        <strong>Успешно записались на работу!</strong>
        <p>Вы записаны на специальность "{{ joinedSpecialtyTitle }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

// Реактивные данные
const specialties = ref([])
const loading = ref(false)
const joiningSpecialty = ref(null)
const showSuccess = ref(false)
const joinedSpecialtyTitle = ref('')
const hasActiveSpecialty = ref(false)
const showMobileFilters = ref(false)

// Диапазоны для ползунков
const salaryRange = {
  min: 1000,
  max: 20000
}

const durationRange = {
  min: 1,
  max: 30
}

// Фильтры
const filters = reactive({
  search: '',
  location: '',
  salary: [salaryRange.min, salaryRange.max],
  duration: [durationRange.min, durationRange.max],
  employmentType: [],
  experience: []
})

// Вычисляемые свойства для стилей прогресса
const salaryProgressStyle = computed(() => {
  const min = filters.salary[0]
  const max = filters.salary[1]
  const minPercent = ((min - salaryRange.min) / (salaryRange.max - salaryRange.min)) * 100
  const maxPercent = ((max - salaryRange.min) / (salaryRange.max - salaryRange.min)) * 100
  return {
    left: `${minPercent}%`,
    width: `${maxPercent - minPercent}%`
  }
})

const durationProgressStyle = computed(() => {
  const min = filters.duration[0]
  const max = filters.duration[1]
  const minPercent = ((min - durationRange.min) / (durationRange.max - durationRange.min)) * 100
  const maxPercent = ((max - durationRange.min) / (durationRange.max - durationRange.min)) * 100
  return {
    left: `${minPercent}%`,
    width: `${maxPercent - minPercent}%`
  }
})

// Уникальные локации для фильтра
const locations = computed(() => {
  return [...new Set(specialties.value.map(s => s.location))].sort()
})

// Фильтрация специальностей
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

  // Фильтрация по зарплате
  if (filters.salary[0] > salaryRange.min || filters.salary[1] < salaryRange.max) {
    filtered = filtered.filter(s =>
      s.salary >= filters.salary[0] && s.salary <= filters.salary[1]
    )
  }

  // Фильтрация по длительности
  if (filters.duration[0] > durationRange.min || filters.duration[1] < durationRange.max) {
    filtered = filtered.filter(s => {
      const duration = calculateDuration(s.start_date, s.end_date)
      return duration >= filters.duration[0] && duration <= filters.duration[1]
    })
  }

  return filtered
})

// Функции для обновления диапазонов
const updateSalaryRange = () => {
  if (filters.salary[0] > filters.salary[1]) {
    filters.salary[0] = filters.salary[1]
  }
}

const updateDurationRange = () => {
  if (filters.duration[0] > filters.duration[1]) {
    filters.duration[0] = filters.duration[1]
  }
}

// Загрузка специальностей
const loadSpecialties = async () => {
  try {
    loading.value = true;

    if (authStore.isAuthenticated) {
      // Загрузка для авторизованных пользователей
      const response = await $fetch('http://localhost:3001/api/vakhta', {
        headers: { 'Authorization': `Bearer ${authStore.token}` }
      });
      processSpecialties(response);
    } else {
      // Загрузка для гостей - используем публичный эндпоинт
      const response = await $fetch('http://localhost:3001/api/public/specialties');
      processPublicSpecialties(response); // Новая функция для обработки публичных данных
    }
  } catch (error) {
    console.error('Error loading specialties:', error);

    // Fallback: попробуем получить данные через vakhta роут
    try {
      const response = await $fetch('http://localhost:3001/api/vakhta');
      processSpecialties(response);
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }
  } finally {
    loading.value = false;
  }
}

// Новая функция для обработки публичных данных
const processPublicSpecialties = (response) => {
  const allSpecialties = [];

  response.forEach(vakhta => {
    if (vakhta.specialties && vakhta.specialties.length > 0) {
      vakhta.specialties.forEach(specialty => {
        if (specialty.id) { // Проверяем, что specialty существует
          allSpecialties.push({
            ...specialty,
            vakhta_title: vakhta.title,
            location: vakhta.location,
            start_date: vakhta.start_date,
            end_date: vakhta.end_date,
            free_places: specialty.free_places || (specialty.total_places - (specialty.current_workers || 0))
          });
        }
      });
    }
  });

  specialties.value = allSpecialties;
}

// Обработка данных специальностей
const processSpecialties = (response: any[]) => {
  const allSpecialties = []
  response.forEach(vakhta => {
    if (vakhta.specialties && vakhta.specialties.length > 0) {
      vakhta.specialties.forEach(specialty => {
        allSpecialties.push({
          ...specialty,
          vakhta_title: vakhta.title,
          location: vakhta.location,
          start_date: vakhta.start_date,
          end_date: vakhta.end_date,
          free_places: specialty.free_places || (specialty.total_places - (specialty.current_workers || 0))
        })
      })
    }
  })
  specialties.value = allSpecialties
}

// Проверка активной специальности
const checkActiveSpecialty = async () => {
  if (!authStore.isAuthenticated) return

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
const joinSpecialty = async (specialtyId: number) => {
  if (!authStore.isAuthenticated) {
    return redirectToLogin()
  }

  try {
    joiningSpecialty.value = specialtyId

    await $fetch('http://localhost:3001/api/borov/specialties/join', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authStore.token}` },
      body: { specialty_id: specialtyId }
    })

    const joinedSpecialty = specialties.value.find(s => s.id === specialtyId)
    joinedSpecialtyTitle.value = joinedSpecialty?.title || ''
    showSuccess.value = true

    await Promise.all([loadSpecialties(), checkActiveSpecialty()])

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

// Редирект на страницу входа
const redirectToLogin = () => {
  navigateTo('/login')
}

// Функции для мобильных фильтров
const toggleMobileFilters = () => {
  showMobileFilters.value = !showMobileFilters.value
}

const closeMobileFilters = () => {
  showMobileFilters.value = false
}

const clearFilters = () => {
  Object.assign(filters, {
    search: '',
    location: '',
    salary: [salaryRange.min, salaryRange.max],
    duration: [durationRange.min, durationRange.max],
    employmentType: [],
    experience: []
  })
}

// Закрытие фильтров по клику вне области
const filtersSidebar = ref(null)

const handleClickOutside = (event: Event) => {
  if (filtersSidebar.value && !filtersSidebar.value.contains(event.target) &&
      !event.target.closest('.mobile-filters-toggle')) {
    closeMobileFilters()
  }
}

const handleResize = () => {
  if (window.innerWidth > 1024) {
    showMobileFilters.value = false
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

const truncateText = (text: string, length: number) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const getPlacesClass = (freePlaces: number) => {
  if (freePlaces === 0) return 'full'
  if (freePlaces <= 3) return 'few'
  return 'available'
}

    const isFeatured = (specialty: any ) => {
      return specialty.salary >= 60000 || specialty.free_places <= 2
    }

// Инициализация
onMounted(async () => {
  await Promise.all([loadSpecialties(), checkActiveSpecialty()])
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.specialties-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  background: #0a0a0a;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Анимированный фон */
.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.parallax-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%);
}

.layer-1 {
  transform: translateZ(-10px) scale(2);
  opacity: 0.6;
  animation: parallax-1 20s infinite linear;
}

.layer-2 {
  transform: translateZ(-5px) scale(1.5);
  opacity: 0.4;
  animation: parallax-2 15s infinite linear;
}

.layer-3 {
  transform: translateZ(0);
  opacity: 0.3;
  animation: parallax-3 10s infinite linear;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at top right, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at bottom left, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
  z-index: 3;
}

@keyframes parallax-1 {
  0%, 100% { transform: translateZ(-10px) scale(2) translateY(0px); }
  50% { transform: translateZ(-10px) scale(2) translateY(-10px); }
}

@keyframes parallax-2 {
  0%, 100% { transform: translateZ(-5px) scale(1.5) translateY(0px); }
  50% { transform: translateZ(-5px) scale(1.5) translateY(-15px); }
}

@keyframes parallax-3 {
  0%, 100% { transform: translateZ(0) translateY(0px); }
  50% { transform: translateZ(0) translateY(-20px); }
}

/* Плавающие элементы */
.floating-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent);
  animation: float-element 8s ease-in-out infinite;
  filter: blur(1px);
}

.element-1 {
  width: 100px;
  height: 100px;
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.element-2 {
  width: 60px;
  height: 60px;
  top: 70%;
  left: 10%;
  animation-delay: -2s;
}

.element-3 {
  width: 80px;
  height: 80px;
  top: 20%;
  right: 10%;
  animation-delay: -4s;
}

@keyframes float-element {
  0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
  33% { transform: translateY(-30px) rotate(120deg) scale(1.1); }
  66% { transform: translateY(15px) rotate(240deg) scale(0.9); }
}

.page-container {
  position: relative;
  z-index: 4;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Анимированный заголовок */
.animated-header {
  text-align: center;
  margin-bottom: 50px;
  position: relative;
}

.header-orbital {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orbit {
  position: absolute;
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  animation: orbit-rotate linear infinite;
}

.orbit-1 {
  width: 80px;
  height: 80px;
  animation-duration: 6s;
}

.orbit-2 {
  width: 120px;
  height: 120px;
  animation-duration: 8s;
  animation-direction: reverse;
}

.satellite {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #d4af37;
  border-radius: 50%;
  top: -3px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 8px rgba(212, 175, 55, 0.8);
}

.central-core {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 0 20px rgba(212, 175, 55, 0.5),
    inset 0 0 10px rgba(255, 255, 255, 0.2);
  animation: core-pulse 3s ease-in-out infinite;
}

.core-inner {
  width: 15px;
  height: 15px;
  background: #0a0a0a;
  border-radius: 50%;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes orbit-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes core-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(212, 175, 55, 0.5); }
  50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(212, 175, 55, 0.8); }
}

.header-content {
  margin-bottom: 40px;
}

.main-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-word {
  display: inline-block;
  opacity: 0;
  transform: translateY(30px);
  animation: title-word-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.title-word:nth-child(1) { animation-delay: 0.3s; }

@keyframes title-word-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.subtitle-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  letter-spacing: 1px;
}

.subtitle-decoration {
  display: flex;
  gap: 5px;
}

.decoration-dot {
  width: 6px;
  height: 6px;
  background: #d4af37;
  border-radius: 50%;
  animation: dot-pulse 2s infinite;
}

.decoration-dot:nth-child(2) { animation-delay: 0.3s; }
.decoration-dot:nth-child(3) { animation-delay: 0.6s; }

@keyframes dot-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.header-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 40px;
}

.stat-card {
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(21, 21, 21, 0.8));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(212, 175, 55, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 200px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: rgba(212, 175, 55, 0.3);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.stat-icon {
  width: 60px;
  height: 60px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-background {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 50%;
  animation: icon-rotate 10s linear infinite;
}

.icon-foreground {
  font-size: 1.5rem;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes icon-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #d4af37;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 5px;
}

/* Основной контент с фильтрами */
.main-content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 30px;
  align-items: start;
}

/* Боковые фильтры */
.filters-sidebar {
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(21, 21, 21, 0.8));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(212, 175, 55, 0.1);
  padding: 25px;
  position: sticky;
  top: 30px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.filters-header h3 {
  margin: 0;
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
}

.filters-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.95rem;
}

.filter-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(212, 175, 55, 0.8);
}

.search-input-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 10px;
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.1);
  background: rgba(255, 255, 255, 0.08);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  to {
    width: 200px;
    height: 200px;
    opacity: 0;
  }
}

.filter-select {
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 10px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.1);
}

.filter-select option {
  background: #1a1a1a;
  color: white;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  transition: color 0.3s;
}

.checkbox-label:hover {
  color: rgba(255, 255, 255, 0.9);
}

.checkbox-label input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 4px;
  position: relative;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-label input:checked + .checkmark {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
}

.checkbox-label input:checked + .checkmark::after {
  content: '';
  width: 6px;
  height: 10px;
  border: solid #d4af37;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  position: absolute;
  top: 1px;
}

/* Улучшенные стили для ползунков */
.range-slider-group {
  margin-top: 10px;
}

.range-values {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
}

.range-value-min,
.range-value-max {
  background: rgba(212, 175, 55, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  font-weight: 500;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.custom-range-slider {
  position: relative;
  height: 24px;
  margin: 15px 0;
  touch-action: none;
}

.range-track {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  transform: translateY(-50%);
  overflow: hidden;
}

.range-progress {
  position: absolute;
  height: 100%;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  border-radius: 3px;
  transition: all 0.2s ease;
}

.range-input {
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
  outline: none;
}

.range-input::-webkit-slider-thumb {
  pointer-events: all;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #d4af37;
  border: 2px solid #0a0a0a;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  box-shadow:
    0 2px 8px rgba(212, 175, 55, 0.4),
    0 0 0 0px rgba(212, 175, 55, 0.3);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.range-input::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  box-shadow:
    0 4px 12px rgba(212, 175, 55, 0.6),
    0 0 0 4px rgba(212, 175, 55, 0.2);
}

.range-input::-webkit-slider-thumb:active {
  transform: scale(1.1);
  box-shadow:
    0 3px 10px rgba(212, 175, 55, 0.5),
    0 0 0 6px rgba(212, 175, 55, 0.15);
}

.range-input::-moz-range-thumb {
  pointer-events: all;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #d4af37;
  border: 2px solid #0a0a0a;
  cursor: pointer;
  box-shadow:
    0 2px 8px rgba(212, 175, 55, 0.4),
    0 0 0 0px rgba(212, 175, 55, 0.3);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.range-input::-moz-range-thumb:hover {
  transform: scale(1.15);
  box-shadow:
    0 4px 12px rgba(212, 175, 55, 0.6),
    0 0 0 4px rgba(212, 175, 55, 0.2);
}

.range-input::-moz-range-thumb:active {
  transform: scale(1.1);
  box-shadow:
    0 3px 10px rgba(212, 175, 55, 0.5),
    0 0 0 6px rgba(212, 175, 55, 0.15);
}

.range-input::-webkit-slider-track {
  background: transparent;
  border: none;
  height: 6px;
  -webkit-appearance: none;
}

.range-input::-moz-range-track {
  background: transparent;
  border: none;
  height: 6px;
}

.range-input:active::-webkit-slider-thumb {
  animation: thumb-pulse 1.5s infinite;
}

.range-input:active::-moz-range-thumb {
  animation: thumb-pulse 1.5s infinite;
}

@keyframes thumb-pulse {
  0%, 100% {
    box-shadow:
      0 2px 8px rgba(212, 175, 55, 0.4),
      0 0 0 0px rgba(212, 175, 55, 0.3);
  }
  50% {
    box-shadow:
      0 2px 8px rgba(212, 175, 55, 0.4),
      0 0 0 4px rgba(212, 175, 55, 0.2);
  }
}

/* Основная область контента */
.content-area {
  min-height: 500px;
}

/* Warning Banner */
.warning-banner {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 193, 7, 0.2);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 25px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.banner-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 193, 7, 0.1), transparent);
  animation: banner-glow 3s ease-in-out infinite;
}

@keyframes banner-glow {
  0%, 100% { left: -100%; }
  50% { left: 100%; }
}

.warning-content {
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  z-index: 2;
  flex: 1;
}

.warning-icon {
  width: 50px;
  height: 50px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.warning-text strong {
  display: block;
  margin-bottom: 5px;
  color: #ffc107;
  font-weight: 600;
  font-size: 1.1rem;
}

.warning-text p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
}

/* Кнопки */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  text-decoration: none;
  background: transparent;
  color: currentColor;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  color: #0a0a0a;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(212, 175, 55, 0.4);
}

.btn-outline {
  background: transparent;
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: rgba(212, 175, 55, 0.9);
}

.btn-outline:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.1);
  border-color: rgba(212, 175, 55, 0.5);
  transform: translateY(-2px);
}

.btn-disabled {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.4);
  cursor: not-allowed;
}

.btn-sm {
  padding: 10px 16px;
  font-size: 0.85rem;
}

.btn-large {
  padding: 14px 24px;
  font-size: 0.95rem;
  min-width: 140px;
  justify-content: center;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 2;
}

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Состояния загрузки */
.loading-state {
  text-align: center;
  padding: 100px 20px;
  color: rgba(255, 255, 255, 0.7);
}

.loading-orbital {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-state p {
  font-size: 1.1rem;
  letter-spacing: 1px;
}

/* Пустое состояние */
.empty-state {
  text-align: center;
  padding: 100px 20px;
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.6), rgba(21, 21, 21, 0.6));
  backdrop-filter: blur(20px);
  border-radius: 25px;
  border: 1px solid rgba(212, 175, 55, 0.1);
  margin: 20px 0;
}

.empty-orbital {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-orbital .orbit {
  width: 100px;
  height: 100px;
  border-color: rgba(212, 175, 55, 0.2);
  animation: orbit-rotate 8s linear infinite;
}

.empty-state h3 {
  color: white;
  margin-bottom: 15px;
  font-size: 1.8rem;
  font-weight: 600;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 30px;
  font-size: 1.1rem;
}

/* Сетка специальностей */
.specialties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 25px;
}

.specialty-card {
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(21, 21, 21, 0.8));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(212, 175, 55, 0.1);
  position: relative;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.05), transparent 50%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.specialty-card:hover {
  border-color: rgba(212, 175, 55, 0.3);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
  transform: translateY(-8px);
}

.specialty-card:hover .card-glow {
  opacity: 1;
}

.specialty-card.featured {
  border-color: rgba(212, 175, 55, 0.5);
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.9), rgba(33, 26, 0, 0.6));
}

.featured-badge {
  position: absolute;
  top: -10px;
  right: 20px;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  color: #0a0a0a;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.specialty-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 15px;
}

.specialty-main h3 {
  margin: 0 0 15px 0;
  color: white;
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.3;
}

.specialty-title-link {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.specialty-title-link:hover {
  color: #d4af37;
}

.enterprise, .location {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.meta-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.specialty-meta {
  text-align: right;
  min-width: 120px;
}

.salary {
  font-size: 1.3rem;
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 10px;
}

.places-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.places-badge.available {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.places-badge.few {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.places-badge.full {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.specialty-details {
  margin-bottom: 25px;
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
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  flex: 1;
}

.detail-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.description, .requirements {
  margin: 15px 0;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
}

.requirements {
  border-left: 3px solid rgba(212, 175, 55, 0.5);
}

.requirements-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}

.requirements-header strong {
  color: rgba(255, 255, 255, 0.9);
}

.specialty-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Уведомления */
.notification-message {
  position: fixed;
  top: 30px;
  right: 30px;
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.95), rgba(21, 21, 21, 0.95));
  backdrop-filter: blur(20px);
  border-radius: 18px;
  padding: 20px 25px;
  z-index: 1001;
  border: 1px solid rgba(76, 175, 80, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  max-width: 400px;
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  align-items: center;
  gap: 15px;
}

.notification-message.show {
  transform: translateX(0);
  opacity: 1;
}

.notification-message.success {
  border-color: rgba(76, 175, 80, 0.5);
}

.notification-icon {
  width: 40px;
  height: 40px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4caf50;
  font-size: 1.2rem;
  font-weight: bold;
  flex-shrink: 0;
}

.notification-content strong {
  display: block;
  margin-bottom: 5px;
  color: white;
  font-weight: 600;
}

.notification-content p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

/* Мобильные фильтры */
.mobile-filters-toggle {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  display: none;
}

.mobile-filters-toggle .btn {
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
  border-radius: 50px;
  padding: 16px 24px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
  }
  50% {
    box-shadow: 0 8px 30px rgba(212, 175, 55, 0.6);
  }
  100% {
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
  }
}

/* Заголовок фильтров для мобильной версии */
.mobile-filters-header {
  display: none;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.mobile-filters-header h3 {
  margin: 0;
  color: white;
  font-size: 1.4rem;
}

.close-filters-btn {
  display: none;
}

/* Адаптивность */
@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 280px 1fr;
    gap: 25px;
  }

  .filters-sidebar {
    padding: 20px;
  }
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    width: 85%;
    max-width: 400px;
    height: 100vh;
    max-height: none;
    border-radius: 0;
    border-right: 1px solid rgba(212, 175, 55, 0.2);
    z-index: 1001;
    transition: left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    overflow-y: auto;
    padding: 25px;
  }

  .filters-sidebar.mobile-open {
    left: 0;
  }

  .mobile-filters-header {
    display: flex;
  }

  .close-filters-btn {
    display: inline-flex;
  }

  .filters-header {
    display: none;
  }

  .mobile-filters-toggle {
    display: block;
  }

  .specialties-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }

  .header-stats {
    flex-direction: column;
    align-items: center;
  }

  .stat-card {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 20px 15px;
  }

  .main-title {
    font-size: 2.5rem;
  }

  .subtitle-container {
    flex-direction: column;
    gap: 10px;
  }

  .header-orbital {
    width: 80px;
    height: 80px;
  }

  .orbit-1 {
    width: 60px;
    height: 60px;
  }

  .orbit-2 {
    width: 80px;
    height: 80px;
  }

  .central-core {
    width: 30px;
    height: 30px;
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

  .specialty-actions .btn {
    width: 100%;
    justify-content: center;
  }

  .detail-row {
    flex-direction: column;
    gap: 10px;
  }

  .warning-banner {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .notification-message {
    right: 15px;
    left: 15px;
    max-width: none;
  }

  .range-values {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .range-value-min,
  .range-value-max {
    font-size: 0.8rem;
    padding: 6px 10px;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .filters-sidebar {
    width: 90%;
    padding: 15px;
  }

  .specialty-card {
    padding: 20px;
  }

  .mobile-filters-toggle {
    bottom: 20px;
    right: 20px;
  }

  .mobile-filters-toggle .btn {
    padding: 14px 20px;
    font-size: 0.9rem;
  }

  .custom-range-slider {
    height: 32px;
  }

  .range-input::-webkit-slider-thumb {
    width: 24px;
    height: 24px;
  }

  .range-input::-moz-range-thumb {
    width: 24px;
    height: 24px;
  }

  .range-track {
    height: 8px;
  }
}

/* Улучшения для touch-устройств */
@media (hover: none) and (pointer: coarse) {
  .range-input::-webkit-slider-thumb {
    width: 24px;
    height: 24px;
  }

  .range-input::-moz-range-thumb {
    width: 24px;
    height: 24px;
  }

  .custom-range-slider {
    height: 32px;
  }
}

/* Подсветка при фокусе для доступности */
.range-input:focus::-webkit-slider-thumb {
  outline: 2px solid rgba(212, 175, 55, 0.5);
  outline-offset: 2px;
}

.range-input:focus::-moz-range-thumb {
  outline: 2px solid rgba(212, 175, 55, 0.5);
  outline-offset: 2px;
}

.specialties-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  background: #0a0a0a;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}



.guest-banner {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 25px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.guest-content {
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  z-index: 2;
  flex: 1;
}

.guest-icon {
  width: 50px;
  height: 50px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.guest-text strong {
  display: block;
  margin-bottom: 5px;
  color: #3b82f6;
  font-weight: 600;
  font-size: 1.1rem;
}

.guest-text p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
}

.guest-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

/* Адаптивность для гостевого баннера */
@media (max-width: 768px) {
  .guest-banner {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .guest-content {
    flex-direction: column;
    text-align: center;
  }

  .guest-actions {
    width: 100%;
    justify-content: center;
  }
}

</style>


