<template>
  <div class="specialty-detail-page">
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

    <div class="page-container">
      <!-- Хлебные крошки -->
      <div class="breadcrumbs">
        <nuxt-link to="/borov/specialties" class="breadcrumb-link">
          <span class="breadcrumb-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="breadcrumb-text">Назад к специальностям</span>
        </nuxt-link>
      </div>

      <!-- Loading State -->
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
        <p>Загрузка информации о специальности...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-orbital">
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
        <h3>Специальность не найдена</h3>
        <p>Возможно, она была удалена или вы ввели неверный ID</p>
        <nuxt-link to="/borov/specialties" class="btn btn-primary">
          <span class="button-content">
            <span class="button-text">Вернуться к списку</span>
          </span>
        </nuxt-link>
      </div>

      <!-- Specialty Content -->
      <div v-else-if="specialty" class="specialty-content">
        <!-- Header -->
        <div class="specialty-header">
          <div class="header-glow"></div>

          <div class="header-main">
            <div class="specialty-badge">
              <div class="badge-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
              </div>
              <span>Специальность</span>
            </div>

            <h1 class="specialty-title">{{ specialty.title }}</h1>

            <div class="specialty-meta">
              <div class="meta-item">
                <div class="meta-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M9 8H7V16H9V8Z" fill="currentColor"/>
                    <path d="M13 8H11V16H13V8Z" fill="currentColor"/>
                    <path d="M17 8H15V16H17V8Z" fill="currentColor"/>
                  </svg>
                </div>
                <span>{{ specialty.vakhta_title }}</span>
              </div>

              <div class="meta-item">
                <div class="meta-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.7764 3 12 3C8.22355 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <span>{{ specialty.location }}</span>
              </div>

              <div class="meta-item">
                <div class="meta-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <span>{{ formatDate(specialty.start_date) }} - {{ formatDate(specialty.end_date) }}</span>
              </div>
            </div>
          </div>

          <div class="header-actions">
            <div class="salary-badge">
              <div class="salary-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="salary-content">
                <div class="salary-amount">{{ formatSalary(specialty.salary) }}</div>
                <div class="salary-period">в день</div>
              </div>
            </div>

            <div class="places-badge" :class="getPlacesClass(specialty.free_places)">
              <div class="places-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="places-content">
                <div class="places-count">{{ specialty.free_places }}/{{ specialty.total_places }}</div>
                <div class="places-text">свободных мест</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Work Warning -->
        <div v-if="hasActiveSpecialty" class="warning-banner">
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
              <p>Вы не можете записаться на новую специальность, пока не завершите текущую</p>
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

        <!-- Main Content -->
        <div class="content-grid">
          <!-- Left Column - Details -->
          <div class="details-column">
            <!-- Description -->
            <div v-if="specialty.description" class="info-card">
              <div class="card-header">
                <div class="header-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h3>Описание работы</h3>
              </div>
              <div class="card-content">
                <p>{{ specialty.description }}</p>
              </div>
            </div>

            <!-- Requirements -->
            <div v-if="specialty.requirements" class="info-card">
              <div class="card-header">
                <div class="header-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h3>Требования</h3>
              </div>
              <div class="card-content">
                <p>{{ specialty.requirements }}</p>
              </div>
            </div>

            <!-- Enterprise Info -->
            <div class="info-card">
              <div class="card-header">
                <div class="header-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M9 8H7V16H9V8Z" fill="currentColor"/>
                    <path d="M13 8H11V16H13V8Z" fill="currentColor"/>
                    <path d="M17 8H15V16H17V8Z" fill="currentColor"/>
                  </svg>
                </div>
                <h3>О предприятии</h3>
              </div>
              <div class="card-content">
                <div class="enterprise-info">
                  <div class="info-item">
                    <div class="info-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </div>
                    <div class="info-content">
                      <strong>Название:</strong>
                      <span>{{ specialty.vakhta_title }}</span>
                    </div>
                  </div>

                  <div class="info-item">
                    <div class="info-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.7764 3 12 3C8.22355 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="info-content">
                      <strong>Местоположение:</strong>
                      <span>{{ specialty.location }}</span>
                    </div>
                  </div>

                  <div class="info-item">
                    <div class="info-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="info-content">
                      <strong>Период работы:</strong>
                      <span>
                        {{ formatDate(specialty.start_date) }} - {{ formatDate(specialty.end_date) }}
                        ({{ calculateDuration(specialty.start_date, specialty.end_date) }} дней)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Actions & Stats -->
          <div class="actions-column">
            <!-- Quick Stats -->
            <div class="stats-card">
              <div class="card-header">
                <div class="header-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h3>Быстрая информация</h3>
              </div>
              <div class="card-content">
                <div class="stats-grid">
                  <div class="stat">
                    <div class="stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="stat-content">
                      <strong>Зарплата</strong>
                      <p>{{ formatSalary(specialty.salary) }} в день</p>
                    </div>
                  </div>

                  <div class="stat">
                    <div class="stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="stat-content">
                      <strong>Доступные места</strong>
                      <p>{{ specialty.free_places }} из {{ specialty.total_places }}</p>
                    </div>
                  </div>

                  <div class="stat">
                    <div class="stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="stat-content">
                      <strong>Начало</strong>
                      <p>{{ formatDate(specialty.start_date) }}</p>
                    </div>
                  </div>

                  <div class="stat">
                    <div class="stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="stat-content">
                      <strong>Длительность</strong>
                      <p>{{ calculateDuration(specialty.start_date, specialty.end_date) }} дней</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Card -->
            <div class="action-card">
              <div class="card-header">
                <div class="header-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <h3>Действия</h3>
              </div>
              <div class="card-content">
                <button
                  v-if="!hasActiveSpecialty && specialty.free_places > 0"
                  @click="joinSpecialty"
                  :disabled="joining"
                  class="btn btn-primary btn-large btn-full"
                >
                  <span class="button-content">
                    <span v-if="joining" class="btn-spinner"></span>
                    <span v-else class="button-text">Записаться на эту работу</span>
                    <span v-if="!joining" class="button-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>
                  </span>
                </button>

                <button
                  v-else-if="hasActiveSpecialty"
                  disabled
                  class="btn btn-disabled btn-large btn-full"
                >
                  <span class="button-text">У вас есть активная работа</span>
                </button>

                <button
                  v-else
                  disabled
                  class="btn btn-disabled btn-large btn-full"
                >
                  <span class="button-text">Нет свободных мест</span>
                </button>

                <div class="action-note">
                  <div class="note-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <p>После записи с вами свяжутся и вы сможете начать работу в указанную дату</p>
                </div>
              </div>
            </div>

            <!-- Share Card -->
            <div class="share-card">
              <div class="card-header">
                <div class="header-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.59 13.51L15.42 17.49" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15.41 6.51L8.59 10.49" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h3>Поделиться</h3>
              </div>
              <div class="card-content">
                <div class="share-buttons">
                  <button @click="copyLink" class="btn btn-outline btn-full">
                    <span class="button-content">
                      <span class="button-text">Скопировать ссылку</span>
                      <span class="button-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 16H6C5.46957 16 4.96086 15.7893 4.58579 15.4142C4.21071 15.0391 4 14.5304 4 14V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H14C14.5304 4 15.0391 4.21071 15.4142 4.58579C15.7893 4.96086 16 5.46957 16 6V8M10 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V10C20 9.46957 19.7893 8.96086 19.4142 8.58579C19.0391 8.21071 18.5304 8 18 8H10C9.46957 8 8.96086 8.21071 8.58579 8.58579C8.21071 8.96086 8 9.46957 8 10V18C8 18.5304 8.21071 19.0391 8.58579 19.4142C8.96086 19.7893 9.46957 20 10 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Notification -->
    <div v-if="showSuccess" class="notification-message success show">
      <div class="notification-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="notification-content">
        <strong>Успешно записались на работу!</strong>
        <p>Вы записаны на специальность "{{ specialty?.title }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { apiFetch } = useApi(
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

    if (authStore.isAuthenticated) {
      // Загрузка для авторизованного пользователя
      const response = await apiFetch('/vakhta')
      // Ищем специальность по ID во всех предприятиях
      let foundSpecialty = null
      for (const enterprise of response) {
        if (enterprise.specialties) {
          const spec = enterprise.specialties.find((s: any) => s.id.toString() === specialtyId.toString())
          if (spec) {
            foundSpecialty = {
              ...spec,
              vakhta_title: enterprise.title,
              location: enterprise.location,
              start_date: enterprise.start_date,
              end_date: enterprise.end_date,
              free_places: spec.free_places || (spec.total_places - (spec.current_workers || 0))
            }
            break
          }
        }
      }

      if (foundSpecialty) {
        specialty.value = foundSpecialty
      } else {
        error.value = true
      }
    } else {
      // Загрузка для гостя - используем публичный эндпоинт
      try {
        const response = await apiFetch(`/public/specialties/${specialtyId}`)
        specialty.value = response
      } catch (publicError) {
        console.error('Public endpoint failed, trying fallback:', publicError)
        // Fallback: попробуем получить через общий эндпоинт vakhta
        await loadSpecialtyFallback(specialtyId)
      }
    }

  } catch (err: any) {
    console.error('Error loading specialty:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

// Fallback метод для загрузки специальности
const loadSpecialtyFallback = async (specialtyId: string) => {
  try {
    const response = await apiFetch('/vakhta')

    let foundSpecialty = null
    for (const enterprise of response) {
      if (enterprise.specialties) {
        const spec = enterprise.specialties.find((s: any) => s.id.toString() === specialtyId.toString())
        if (spec) {
          foundSpecialty = {
            ...spec,
            vakhta_title: enterprise.title,
            location: enterprise.location,
            start_date: enterprise.start_date,
            end_date: enterprise.end_date,
            free_places: spec.free_places || (spec.total_places - (spec.current_workers || 0))
          }
          break
        }
      }
    }

    if (foundSpecialty) {
      specialty.value = foundSpecialty
    } else {
      error.value = true
    }
  } catch (fallbackError) {
    console.error('Fallback also failed:', fallbackError)
    error.value = true
  }
}

// Проверка активной специальности
const checkActiveSpecialty = async () => {
  if (!authStore.isAuthenticated) return

  try {
    const response = await apiFetch('/borov/specialties/my')

    hasActiveSpecialty.value = response.some((s: any) => s.status === 'active')
  } catch (error) {
    console.error('Error checking active specialty:', error)
  }
}

// Запись на специальность
const joinSpecialty = async () => {
  if (!authStore.isAuthenticated) {
    // Сохраняем ID специальности и перенаправляем на вход
    return navigateTo(`/login?redirect=/borov/specialties/${specialty.value.id}`)
  }

  try {
    joining.value = true

    await apiFetch('/borov/specialties/join', {
      method: 'POST',
      body: { specialty_id: specialty.value.id }
    })

    showSuccess.value = true
    await Promise.all([loadSpecialty(), checkActiveSpecialty()])

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
    // Можно добавить toast-уведомление вместо alert
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

/* Хлебные крошки */
.breadcrumbs {
  margin-bottom: 30px;
}

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: rgba(212, 175, 55, 0.9);
  text-decoration: none;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 10px;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  transition: all 0.3s ease;
}

.breadcrumb-link:hover {
  background: rgba(212, 175, 55, 0.15);
  border-color: rgba(212, 175, 55, 0.3);
  transform: translateX(-5px);
}

.breadcrumb-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Состояния загрузки и ошибки */
.loading-state, .error-state {
  text-align: center;
  padding: 100px 20px;
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(21, 21, 21, 0.8));
  backdrop-filter: blur(20px);
  border-radius: 25px;
  border: 1px solid rgba(212, 175, 55, 0.1);
  margin: 20px 0;
}

.loading-orbital, .error-orbital {
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

.loading-state p, .error-state p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.error-state h3 {
  color: white;
  margin-bottom: 15px;
  font-size: 1.8rem;
  font-weight: 600;
}

/* Заголовок специальности */
.specialty-header {
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.9), rgba(21, 21, 21, 0.9));
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 40px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
}

.header-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.05), transparent 50%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.specialty-header:hover .header-glow {
  opacity: 1;
}

.header-main {
  flex: 1;
}

.specialty-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 20px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.specialty-title {
  margin: 0 0 25px 0;
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.specialty-meta {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

.meta-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.header-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 220px;
}

.salary-badge {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1));
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.salary-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4caf50;
}

.salary-content {
  display: flex;
  flex-direction: column;
}

.salary-amount {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4caf50;
  line-height: 1;
}

.salary-period {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 5px;
}

.places-badge {
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid;
}

.places-badge.available {
  background: rgba(76, 175, 80, 0.1);
  border-color: rgba(76, 175, 80, 0.3);
}

.places-badge.few {
  background: rgba(255, 193, 7, 0.1);
  border-color: rgba(255, 193, 7, 0.3);
}

.places-badge.full {
  background: rgba(244, 67, 54, 0.1);
  border-color: rgba(244, 67, 54, 0.3);
}

.places-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.places-badge.available .places-icon {
  color: #4caf50;
}

.places-badge.few .places-icon {
  color: #ffc107;
}

.places-badge.full .places-icon {
  color: #f44336;
}

.places-content {
  display: flex;
  flex-direction: column;
}

.places-count {
  font-size: 1.3rem;
  font-weight: bold;
  line-height: 1;
}

.places-badge.available .places-count {
  color: #4caf50;
}

.places-badge.few .places-count {
  color: #ffc107;
}

.places-badge.full .places-count {
  color: #f44336;
}

.places-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 5px;
}

/* Warning Banner */
.warning-banner {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 193, 7, 0.2);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
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
  gap: 20px;
  position: relative;
  z-index: 2;
  flex: 1;
}

.warning-icon {
  width: 60px;
  height: 60px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-background {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 193, 7, 0.1);
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
  color: #ffc107;
}

@keyframes icon-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.warning-text strong {
  display: block;
  margin-bottom: 8px;
  color: #ffc107;
  font-weight: 600;
  font-size: 1.1rem;
}

.warning-text p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
}

/* Основной контент */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
}

.details-column {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.actions-column {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* Карточки */
.info-card, .stats-card, .action-card, .share-card {
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(21, 21, 21, 0.8));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(212, 175, 55, 0.1);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.info-card:hover, .stats-card:hover, .action-card:hover, .share-card:hover {
  border-color: rgba(212, 175, 55, 0.3);
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 25px 25px 0;
  margin-bottom: 20px;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(212, 175, 55, 0.8);
}

.card-header h3 {
  margin: 0;
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
}

.card-content {
  padding: 0 25px 25px;
}

.info-card .card-content p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
  font-size: 1rem;
}

/* Enterprise Info */
.enterprise-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-item:last-child {
  border-bottom: none;
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  color: rgba(212, 175, 55, 0.7);
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-content strong {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
}

.info-content span {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

/* Stats Grid */
.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.stat:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(212, 175, 55, 0.3);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(212, 175, 55, 0.8);
}

.stat-content strong {
  display: block;
  margin-bottom: 5px;
  color: white;
  font-size: 0.95rem;
}

.stat-content p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
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
  padding: 16px 24px;
  font-size: 1rem;
}

.btn-full {
  width: 100%;
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

/* Action Note */
.action-note {
  margin-top: 20px;
  padding: 15px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 10px;
  border-left: 4px solid rgba(212, 175, 55, 0.5);
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.note-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(212, 175, 55, 0.8);
  margin-top: 2px;
}

.action-note p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Share Buttons */
.share-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  .content-grid {
    grid-template-columns: 1fr 350px;
    gap: 25px;
  }
}

@media (max-width: 1024px) {
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

  .salary-badge, .places-badge {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 20px 15px;
  }

  .specialty-header {
    padding: 30px 25px;
  }

  .specialty-title {
    font-size: 2rem;
  }

  .specialty-meta {
    flex-direction: column;
    gap: 15px;
  }

  .header-actions {
    flex-direction: column;
  }

  .warning-banner {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .warning-content {
    flex-direction: column;
    text-align: center;
  }

  .notification-message {
    right: 15px;
    left: 15px;
    max-width: none;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .specialty-header {
    padding: 25px 20px;
  }

  .specialty-title {
    font-size: 1.8rem;
  }

  .card-header, .card-content {
    padding-left: 20px;
    padding-right: 20px;
  }

  .salary-badge, .places-badge {
    padding: 15px;
  }

  .salary-amount {
    font-size: 1.3rem;
  }

  .places-count {
    font-size: 1.1rem;
  }
}
</style>