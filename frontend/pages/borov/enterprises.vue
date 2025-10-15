<template>
  <div class="enterprises-page">
    <!-- Анимированный фон -->
    <div class="background-animation">
      <div class="parallax-layer layer-1"></div>
      <div class="parallax-layer layer-2"></div>
      <div class="parallax-layer layer-3"></div>
      <div class="particles-container" id="particles-js"></div>
      <div class="gradient-overlay"></div>
    </div>

    <!-- Плавающие элементы -->
    <div class="floating-elements">
      <div class="floating-element element-1"></div>
      <div class="floating-element element-2"></div>
      <div class="floating-element element-3"></div>
      <div class="floating-element element-4"></div>
      <div class="floating-element element-5"></div>
    </div>

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
      <!-- Current Work Banner -->
      <div v-if="currentWork.type !== 'none'" class="current-work-banner">
        <div class="banner-glow"></div>
        <div class="banner-content">
          <div class="banner-icon">
            <div class="icon-background"></div>
            <div class="icon-foreground">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="banner-text">
            <strong>У вас активная работа</strong>
            <p>Вы работаете: {{ currentWork.work.specialty_title || currentWork.work.vakhta_title }}</p>
          </div>
          <button @click="leaveWork" class="btn btn-warning">
            <span class="button-content">
              <span class="button-text">Отменить запись</span>
              <span class="button-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </span>
            </span>
          </button>
        </div>
      </div>

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
                  placeholder="Предприятия, вакансии..."
                  class="search-input"
                  @focus="searchFocused = true"
                  @blur="searchFocused = false"
                >
                <div class="search-ripple" v-if="searchFocused"></div>
              </div>
            </div>

            <!-- Регион/город -->
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

            <!-- Длительность (улучшенный ползунок) -->
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
                    @mousedown="setActiveSlider('duration')"
                  >
                  <input
                    type="range"
                    v-model.number="filters.duration[1]"
                    :min="durationRange.min"
                    :max="durationRange.max"
                    step="1"
                    class="range-input range-max"
                    @input="updateDurationRange"
                    @mousedown="setActiveSlider('duration')"
                  >
                </div>
                <div class="range-labels">
                  <span>{{ durationRange.min }} дн.</span>
                  <span>{{ durationRange.max }} дн.</span>
                </div>
              </div>
            </div>

            <!-- Зарплата (улучшенный ползунок) -->
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
                    @mousedown="setActiveSlider('salary')"
                  >
                  <input
                    type="range"
                    v-model.number="filters.salary[1]"
                    :min="salaryRange.min"
                    :max="salaryRange.max"
                    step="1000"
                    class="range-input range-max"
                    @input="updateSalaryRange"
                    @mousedown="setActiveSlider('salary')"
                  >
                </div>
                <div class="range-labels">
                  <span>{{ formatSalary(salaryRange.min) }}</span>
                  <span>{{ formatSalary(salaryRange.max) }}</span>
                </div>
              </div>
            </div>

            <!-- Тип работы -->
            <div class="filter-group">
              <div class="filter-label">
                <div class="filter-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM14 6H10V4H14V6Z" fill="currentColor"/>
                  </svg>
                </div>
                <span>Тип работы</span>
              </div>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="filters.workType" value="one-time">
                  <span class="checkmark"></span>
                  Разовая
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="filters.workType" value="regular">
                  <span class="checkmark"></span>
                  Регулярная
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Основной контент -->
        <div class="content-area">
          <!-- Состояния загрузки и пустого результата -->
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
            <p>Загрузка предприятий...</p>
          </div>

          <div v-else-if="filteredEnterprises.length === 0" class="empty-state">
            <div class="empty-orbital">
              <div class="orbit"></div>
              <div class="central-core">
                <div class="core-inner">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0a0a0a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15 9L9 15" stroke="#0a0a0a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 9L15 15" stroke="#0a0a0a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            <h3>Предприятия не найдены</h3>
            <p>Попробуйте изменить параметры поиска</p>
            <button @click="clearFilters" class="btn btn-primary">
              <span class="button-content">
                <span class="button-text">Сбросить фильтры</span>
              </span>
            </button>
          </div>

          <!-- Список предприятий -->
          <div v-else class="enterprises-grid">
            <div
              v-for="enterprise in filteredEnterprises"
              :key="enterprise.id"
              class="enterprise-card"
              :class="{ expanded: expandedEnterprise === enterprise.id }"
            >
              <div class="card-glow"></div>

              <!-- Заголовок предприятия -->
              <div class="enterprise-header" @click="toggleEnterprise(enterprise.id)">
                <div class="enterprise-badge">
                  <div class="badge-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" stroke-width="2"/>
                      <path d="M9 8H7V16H9V8Z" fill="currentColor"/>
                      <path d="M13 8H11V16H13V8Z" fill="currentColor"/>
                      <path d="M17 8H15V16H17V8Z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>

                <div class="enterprise-main">
                  <h3 class="enterprise-title">{{ enterprise.title }}</h3>

                  <div class="enterprise-meta">
                    <div class="meta-item">
                      <div class="meta-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.7764 3 12 3C8.22355 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <span>{{ enterprise.location }}</span>
                    </div>
                    <div class="meta-item">
                      <div class="meta-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <span>{{ enterprise.current_workers || 0 }}/{{ enterprise.total_places }}</span>
                    </div>
                    <div class="meta-item">
                      <div class="meta-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <span>{{ formatDate(enterprise.start_date) }} - {{ formatDate(enterprise.end_date) }}</span>
                    </div>
                  </div>
                </div>

                <div class="enterprise-actions">
                  <div class="specialties-count">
                    <span>{{ enterprise.specialties?.length || 0 }} вакансий</span>
                  </div>
                  <button class="expand-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Специальности (раскрывающийся контент) -->
              <div v-if="expandedEnterprise === enterprise.id" class="specialties-section">
                <div class="section-header">
                  <h4>Доступные вакансии</h4>
                  <div class="section-badge">{{ enterprise.specialties?.length || 0 }}</div>
                </div>

                <div v-if="!enterprise.specialties || enterprise.specialties.length === 0" class="no-specialties">
                  <div class="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM14 6H10V4H14V6Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <p>На этом предприятии пока нет вакансий</p>
                </div>

                <div v-else class="specialties-grid">
                  <div
                    v-for="specialty in enterprise.specialties"
                    :key="specialty.id"
                    class="specialty-card"
                    :class="{
                      'few-places': specialty.free_places <= 3,
                      'no-places': specialty.free_places === 0,
                      'joined': specialty.is_joined
                    }"
                  >
                    <div v-if="specialty.is_joined" class="joined-badge">
                      <div class="badge-icon">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      Вы записаны
                    </div>

                    <div class="specialty-content">
                      <div class="specialty-header">
                        <h5>
                          <nuxt-link :to="`/borov/specialties/${specialty.id}`" class="specialty-title">
                            {{ specialty.title }}
                          </nuxt-link>
                        </h5>
                        <p class="specialty-description" v-if="specialty.description">
                          {{ truncateText(specialty.description, 100) }}
                        </p>
                      </div>

                      <div class="specialty-details">
                        <div class="detail-row">
                          <div class="detail-item">
                            <div class="detail-icon">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                            </div>
                            <span class="label">Зарплата:</span>
                            <span class="value salary">{{ formatSalary(specialty.salary) }}/день</span>
                          </div>

                          <div class="detail-item">
                            <div class="detail-icon">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                            </div>
                            <span class="label">Места:</span>
                            <span class="value places" :class="getPlacesClass(specialty.free_places)">
                              {{ specialty.free_places }} из {{ specialty.total_places }}
                            </span>
                          </div>
                        </div>

                        <div v-if="specialty.requirements" class="requirements">
                          <div class="detail-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </div>
                          <span class="requirements-text">{{ truncateText(specialty.requirements, 80) }}</span>
                        </div>
                      </div>

                      <div class="specialty-actions">
                        <nuxt-link
                          :to="`/borov/specialties/${specialty.id}`"
                          class="btn btn-outline btn-sm"
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
                          v-if="currentWork.type === 'none' && specialty.free_places > 0 && !specialty.is_joined"
                          @click="applyForSpecialty(specialty)"
                          :disabled="applyingForSpecialty === specialty.id"
                          class="btn btn-primary btn-large"
                        >
                          <span class="button-content">
                            <span v-if="applyingForSpecialty === specialty.id" class="btn-spinner"></span>
                            <span v-else class="button-text">Записаться</span>
                            <span v-if="applyingForSpecialty !== specialty.id" class="button-icon">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                              </svg>
                            </span>
                          </span>
                        </button>

                        <button
                          v-else-if="specialty.is_joined"
                          @click="leaveCurrentWork"
                          class="btn btn-warning btn-large"
                        >
                          <span class="button-content">
                            <span class="button-text">Выйти</span>
                            <span class="button-icon">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                              </svg>
                            </span>
                          </span>
                        </button>

                        <button
                          v-else-if="currentWork.type !== 'none'"
                          disabled
                          class="btn btn-disabled btn-large"
                        >
                          <span class="button-text">Уже работаете</span>
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

const enterprises = ref([])
const expandedEnterprise = ref(null)
const loading = ref(false)
const applyingForSpecialty = ref(null)
const showSuccess = ref(false)
const joinedSpecialtyTitle = ref('')
const currentWork = ref({ type: 'none', work: null })
const searchFocused = ref(false)
const showMobileFilters = ref(false)
const activeSlider = ref<string | null>(null)

// Диапазоны для ползунков
const durationRange = {
  min: 1,
  max: 30
}

const salaryRange = {
  min: 1000,
  max: 20000
}

// Обновленные фильтры
const filters = reactive({
  search: '',
  location: '',
  duration: [durationRange.min, durationRange.max],
  salary: [salaryRange.min, salaryRange.max],
  workType: []
})

// Вычисляемые свойства для стилей прогресса
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

// Функции для обновления диапазонов
const updateDurationRange = () => {
  // Убедимся, что min <= max
  if (filters.duration[0] > filters.duration[1]) {
    if (activeSlider.value === 'duration') {
      filters.duration[0] = filters.duration[1]
    } else {
      filters.duration[1] = filters.duration[0]
    }
  }
}

const updateSalaryRange = () => {
  // Убедимся, что min <= max
  if (filters.salary[0] > filters.salary[1]) {
    if (activeSlider.value === 'salary') {
      filters.salary[0] = filters.salary[1]
    } else {
      filters.salary[1] = filters.salary[0]
    }
  }
}

const setActiveSlider = (type: string) => {
  activeSlider.value = type
}

// Загрузка предприятий
const loadEnterprises = async () => {
  try {
    loading.value = true

    const response = await $fetch('http://localhost:3001/api/vakhta', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })

    enterprises.value = response.map(enterprise => ({
      ...enterprise,
      specialties: enterprise.specialties?.map(specialty => ({
        ...specialty,
        free_places: specialty.free_places || (specialty.total_places - (specialty.current_workers || 0))
      })) || []
    }))

    const workResponse = await $fetch('http://localhost:3001/api/borov/current-work', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    currentWork.value = workResponse

  } catch (error) {
    console.error('Error loading enterprises:', error)
  } finally {
    loading.value = false
  }
}

// Фильтрация с обновленными условиями
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

  // Фильтрация по длительности
  if (filters.duration[0] > durationRange.min || filters.duration[1] < durationRange.max) {
    filtered = filtered.filter(enterprise => {
      const startDate = new Date(enterprise.start_date)
      const endDate = new Date(enterprise.end_date)
      const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

      return durationDays >= filters.duration[0] && durationDays <= filters.duration[1]
    })
  }

  // Фильтрация по зарплате
  if (filters.salary[0] > salaryRange.min || filters.salary[1] < salaryRange.max) {
    filtered = filtered.filter(enterprise =>
      enterprise.specialties?.some((s: any) =>
        s.salary >= filters.salary[0] && s.salary <= filters.salary[1]
      )
    )
  }

  // Фильтрация по типу работы
  if (filters.workType.length > 0) {
    filtered = filtered.filter(enterprise => {
      const enterpriseWorkType = enterprise.work_type || 'regular'
      return filters.workType.includes(enterpriseWorkType)
    })
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

// Функции для мобильных фильтров
const toggleMobileFilters = () => {
  showMobileFilters.value = !showMobileFilters.value
}

const closeMobileFilters = () => {
  showMobileFilters.value = false
}

// Закрывать фильтры при изменении размера окна на десктоп
const handleResize = () => {
  if (window.innerWidth > 1024) {
    showMobileFilters.value = false
  }
}

// Закрытие фильтров по клику вне области
const filtersSidebar = ref(null)

const handleClickOutside = (event: Event) => {
  if (filtersSidebar.value && !filtersSidebar.value.contains(event.target) &&
      !event.target.closest('.mobile-filters-toggle')) {
    closeMobileFilters()
  }
}

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

    joinedSpecialtyTitle.value = specialty.title
    showSuccess.value = true

    await loadEnterprises()

    setTimeout(() => {
      showSuccess.value = false
    }, 5000)

  } catch (error: any) {
    console.error('Error applying for specialty:', error)
    alert(error.data?.error || 'Ошибка при записи на вакансию')
  } finally {
    applyingForSpecialty.value = null
  }
}

const leaveWork = async () => {
  try {
    if (!confirm('Вы уверены, что хотите завершить текущую работу?')) return

    let endpoint = ''
    if (currentWork.value.type === 'specialty') {
      endpoint = 'http://localhost:3001/api/borov/specialties/leave'
    } else if (currentWork.value.type === 'vakhta') {
      endpoint = 'http://localhost:3001/api/borov/vakhtas/leave'
    }

    if (endpoint) {
      await $fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authStore.token}` }
      })

      await loadEnterprises()
    }
  } catch (error: any) {
    console.error('Error leaving work:', error)
    alert(error.data?.error || 'Ошибка')
  }
}

const leaveCurrentWork = () => {
  leaveWork()
}

const clearFilters = () => {
  Object.assign(filters, {
    search: '',
    location: '',
    duration: [durationRange.min, durationRange.max],
    salary: [salaryRange.min, salaryRange.max],
    workType: []
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
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleClickOutside)
})
</script>



<style scoped>
.enterprises-page {
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

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
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

.element-4 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 5%;
  animation-delay: -1s;
}

.element-5 {
  width: 70px;
  height: 70px;
  top: 80%;
  right: 20%;
  animation-delay: -3s;
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

/* Current Work Banner */
.current-work-banner {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 193, 7, 0.2);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
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

.banner-content {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 2;
}

.banner-icon {
  width: 60px;
  height: 60px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.banner-text {
  flex: 1;
}

.banner-text strong {
  display: block;
  margin-bottom: 5px;
  color: #ffc107;
  font-weight: 600;
  font-size: 1.1rem;
}

.banner-text p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
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

/* Основная область контента */
.content-area {
  min-height: 500px;
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

.btn-warning {
  background: linear-gradient(135deg, #ffc107, #ffb300);
  color: #212529;
  box-shadow: 0 8px 25px rgba(255, 193, 7, 0.3);
}

.btn-warning:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(255, 193, 7, 0.4);
}

.btn-outline {
  background: transparent;
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: rgba(212, 175, 55, 0.9);
}

.btn-outline:hover {
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

/* Сетка предприятий */
.enterprises-grid {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.enterprise-card {
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(21, 21, 21, 0.8));
  backdrop-filter: blur(20px);
  border-radius: 25px;
  border: 1px solid rgba(212, 175, 55, 0.1);
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
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

.enterprise-card:hover {
  border-color: rgba(212, 175, 55, 0.3);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
  transform: translateY(-8px);
}

.enterprise-card:hover .card-glow {
  opacity: 1;
}

.enterprise-card.expanded {
  border-color: rgba(212, 175, 55, 0.5);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
}

.enterprise-header {
  padding: 30px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: background-color 0.3s;
  position: relative;
  z-index: 2;
}

.enterprise-header:hover {
  background: rgba(255, 255, 255, 0.02);
}

.enterprise-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 20px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.badge-icon {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.enterprise-main {
  flex: 1;
}

.enterprise-title {
  margin: 0 0 20px 0;
  color: white;
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.3;
}

.enterprise-meta {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
}

.meta-icon {
  font-size: 1rem;
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.enterprise-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.specialties-count {
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.expand-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expand-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.enterprise-card.expanded .expand-btn {
  transform: rotate(180deg);
}

/* Секция специальностей */
.specialties-section {
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  padding: 35px 30px;
  background: rgba(0, 0, 0, 0.3);
  position: relative;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.section-header h4 {
  margin: 0;
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
}

.section-badge {
  background: #d4af37;
  color: #0a0a0a;
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
}

.no-specialties {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.5);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  opacity: 0.5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.specialties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.specialty-card {
  background: linear-gradient(145deg, rgba(38, 38, 38, 0.6), rgba(32, 32, 32, 0.6));
  backdrop-filter: blur(20px);
  padding: 25px;
  border-radius: 18px;
  border: 1px solid rgba(212, 175, 55, 0.1);
  position: relative;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.specialty-card:hover {
  border-color: rgba(212, 175, 55, 0.3);
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.specialty-card.few-places {
  border-left: 4px solid #ffc107;
}

.specialty-card.no-places {
  border-left: 4px solid #f44336;
  opacity: 0.7;
}

.specialty-card.joined {
  border-left: 4px solid #4caf50;
  background: linear-gradient(145deg, rgba(38, 38, 38, 0.8), rgba(32, 50, 32, 0.6));
}

.joined-badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background: #4caf50;
  color: white;
  padding: 8px 16px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.specialty-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.specialty-header h5 {
  margin: 0 0 12px 0;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.4;
}

.specialty-title {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.specialty-title:hover {
  color: #d4af37;
}

.specialty-description {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  line-height: 1.5;
}

.specialty-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.detail-row {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 200px;
}

.detail-icon {
  font-size: 1.1rem;
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  min-width: 70px;
}

.value {
  font-size: 0.95rem;
  font-weight: 500;
}

.value.salary {
  color: #4caf50;
}

.value.places.no-places {
  color: #f44336;
}

.value.places.few-places {
  color: #ffc107;
}

.value.places.available {
  color: #4caf50;
}

.requirements {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.requirements-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  line-height: 1.4;
  flex: 1;
}

.specialty-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
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
    position: static;
    max-height: none;
  }

  .specialties-grid {
    grid-template-columns: 1fr;
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

  .enterprise-header {
    flex-direction: column;
    gap: 20px;
  }

  .enterprise-actions {
    width: 100%;
    justify-content: space-between;
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
    gap: 15px;
  }

  .notification-message {
    right: 15px;
    left: 15px;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .enterprise-meta {
    flex-direction: column;
    gap: 10px;
  }

  .specialties-section {
    padding: 25px 20px;
  }

  .filters-sidebar {
    padding: 15px;
  }

  .specialties-grid {
    grid-template-columns: 1fr;
  }
}

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
@media (max-width: 1024px) {
  .mobile-filters-toggle {
    display: block;
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

  /* Затемнение фона при открытых фильтрах */
  .filters-sidebar.mobile-open::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    z-index: -1;
  }

  /* Скрываем обычный заголовок на мобильных */
  .filters-header {
    display: none;
  }
}

@media (max-width: 480px) {
  .filters-sidebar {
    width: 90%;
  }

  .mobile-filters-toggle {
    bottom: 20px;
    right: 20px;
  }

  .mobile-filters-toggle .btn {
    padding: 14px 20px;
    font-size: 0.9rem;
  }
}

/* Анимация для кнопки фильтров */
.mobile-filters-toggle .btn {
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

/* Убираем стандартные стили для Firefox */
.range-input::-moz-focus-outer {
  border: 0;
}

/* Анимация для активного ползунка */
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

/* Улучшенная адаптивность для ползунков */
@media (max-width: 768px) {
  .custom-range-slider {
    height: 28px;
    margin: 20px 0;
  }

  .range-input::-webkit-slider-thumb {
    width: 22px;
    height: 22px;
  }

  .range-input::-moz-range-thumb {
    width: 22px;
    height: 22px;
  }

  .range-track {
    height: 8px;
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


/* Анимация для кнопки фильтров */
.mobile-filters-toggle .btn {
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

.custom-range-slider {
  position: relative;
  height: 20px;
  margin: 20px 0;
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
}

.range-progress {
  position: absolute;
  height: 6px;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  border-radius: 3px;
  top: 0;
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
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
  transition: all 0.3s ease;
}

.range-input::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.6);
}

.range-input::-moz-range-thumb {
  pointer-events: all;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #d4af37;
  border: 2px solid #0a0a0a;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
  transition: all 0.3s ease;
}

.range-input::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.6);
}

.range-input::-webkit-slider-track {
  background: transparent;
  border: none;
  height: 6px;
}

.range-input::-moz-range-track {
  background: transparent;
  border: none;
  height: 6px;
}

/* Убираем стандартные стили для Firefox */
.range-input::-moz-focus-outer {
  border: 0;
}

/* Адаптивность для ползунков */
@media (max-width: 480px) {
  .range-input::-webkit-slider-thumb {
    width: 18px;
    height: 18px;
  }

  .range-input::-moz-range-thumb {
    width: 18px;
    height: 18px;
  }
}
</style>