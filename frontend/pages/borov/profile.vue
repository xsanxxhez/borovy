<template>
  <div class="profile-page">
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
      <div class="floating-element element-4"></div>
      <div class="floating-element element-5"></div>
    </div>

    <div class="page-container">
      <!-- Режим просмотра -->
      <div v-if="!isEditing" class="profile-view">


        <div class="profile-container-view">
          <div class="profile-card">
            <div class="card-glow"></div>

            <!-- Аватар и основная информация -->
            <div class="profile-header-section">
              <div class="avatar-section">
                <div class="avatar-container">
                  <div class="avatar-wrapper">
                    <img
                      v-if="profile.avatar_url"
                      :src="profile.avatar_url"
                      alt="Аватар"
                      class="avatar-image"
                    >
                    <div v-else class="avatar-placeholder">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" stroke-width="2"/>
                        <path d="M6 20C6 17.7909 7.79086 16 10 16H14C16.2091 16 18 17.7909 18 20V21C18 21.5523 17.5523 22 17 22H7C6.44772 22 6 21.5523 6 21V20Z" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </div>
                    <div class="avatar-status"></div>
                  </div>
                </div>
                <div class="profile-main-info">
                  <h2 class="profile-name">{{ profile.full_name || 'Не указано' }}</h2>
                  <p class="profile-email">{{ profile.email || 'Не указан' }}</p>
                  <div class="profile-stats">
                    <div class="stat-item">
                      <div class="stat-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <span>{{ profileData.experience_years || 0 }} лет опыта</span>
                    </div>
                    <div class="stat-item">
                      <div class="stat-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <span>{{ formatSalary(profileData.salary_expectations || 0) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button @click="startEditing" class="btn btn-edit">
                <span class="button-content">
                  <span class="button-text">Редактировать профиль</span>
                  <span class="button-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                </span>
              </button>
            </div>

            <div class="profile-grid">
              <!-- Основная информация -->
              <div class="profile-section">
                <div class="section-header">
                  <div class="section-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" stroke-width="2"/>
                      <path d="M6 20C6 17.7909 7.79086 16 10 16H14C16.2091 16 18 17.7909 18 20V21C18 21.5523 17.5523 22 17 22H7C6.44772 22 6 21.5523 6 21V20Z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <h3 class="section-title">Основная информация</h3>
                </div>
                <div class="info-grid">
                  <div class="info-item">
                    <label>ФИО:</label>
                    <span>{{ profile.full_name || 'Не указано' }}</span>
                  </div>
                  <div class="info-item">
                    <label>Email:</label>
                    <span>{{ profile.email || 'Не указан' }}</span>
                  </div>
                  <div class="info-item">
                    <label>Телефон:</label>
                    <span>{{ profile.phone || 'Не указан' }}</span>
                  </div>
                </div>
              </div>

              <!-- Профессиональная информация -->
              <div class="profile-section" v-if="hasProfessionalInfo">
                <div class="section-header">
                  <div class="section-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 10V16M22 10L12 4L2 10L12 16L22 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h3 class="section-title">Профессиональная информация</h3>
                </div>
                <div class="info-grid">
                  <div class="info-item" v-if="hasSpecialization">
                    <label>Специализация:</label>
                    <div class="tags">
                      <span v-for="spec in profileData.specialization" :key="spec" class="tag">
                        {{ getSpecializationLabel(spec) }}
                      </span>
                    </div>
                  </div>
                  <div class="info-item" v-if="profileData.experience_years">
                    <label>Опыт работы:</label>
                    <span>{{ getExperienceText(profileData.experience_years) }}</span>
                  </div>
                  <div class="info-item" v-if="hasDriverLicense">
                    <label>Категории прав:</label>
                    <div class="tags">
                      <span v-for="category in profileData.driver_license_category" :key="category" class="tag">
                        {{ category }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- О себе -->
              <div class="profile-section" v-if="profileData?.about_me">
                <div class="section-header">
                  <div class="section-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 11.5C21 16.7467 16.7467 21 11.5 21C6.25329 21 2 16.7467 2 11.5C2 6.25329 6.25329 2 11.5 2C16.7467 2 21 6.25329 21 11.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <path d="M11.5 15.5C13.7091 15.5 15.5 13.7091 15.5 11.5C15.5 9.29086 13.7091 7.5 11.5 7.5C9.29086 7.5 7.5 9.29086 7.5 11.5C7.5 13.7091 9.29086 15.5 11.5 15.5Z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <h3 class="section-title">О себе</h3>
                </div>
                <p class="about-text">{{ profileData.about_me }}</p>
              </div>

              <!-- Навыки -->
              <div class="profile-section" v-if="hasSkills">
                <div class="section-header">
                  <div class="section-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h3 class="section-title">Навыки</h3>
                </div>
                <div class="tags">
                  <span v-for="skill in profileData.skills" :key="skill" class="tag">
                    {{ skill }}
                  </span>
                </div>
              </div>

              <!-- Языки -->
              <div class="profile-section" v-if="hasLanguages">
                <div class="section-header">
                  <div class="section-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 12H22M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h3 class="section-title">Знание языков</h3>
                </div>
                <div class="info-grid">
                  <div v-for="(level, lang) in profileData.languages" :key="lang" class="info-item">
                    <label>{{ lang }}:</label>
                    <span class="language-level">{{ getLanguageLevel(level) }}</span>
                  </div>
                </div>
              </div>

              <!-- Дополнительная информация -->
              <div class="profile-section" v-if="hasAdditionalInfo">
                <div class="section-header">
                  <div class="section-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h3 class="section-title">Дополнительная информация</h3>
                </div>
                <div class="info-grid">
                  <div class="info-item" v-if="profileData.has_car !== null && profileData.has_car !== undefined">
                    <label>Личный автомобиль:</label>
                    <span :class="profileData.has_car ? 'status-yes' : 'status-no'">
                      {{ profileData.has_car ? 'Да' : 'Нет' }}
                    </span>
                  </div>
                  <div class="info-item" v-if="profileData.has_tools !== null && profileData.has_tools !== undefined">
                    <label>Собственные инструменты:</label>
                    <span :class="profileData.has_tools ? 'status-yes' : 'status-no'">
                      {{ profileData.has_tools ? 'Да' : 'Нет' }}
                    </span>
                  </div>
                  <div class="info-item" v-if="profileData.salary_expectations">
                    <label>Ожидания по зарплате:</label>
                    <span class="salary">{{ formatSalary(profileData.salary_expectations) }}</span>
                  </div>
                </div>
              </div>

              <!-- Пустое состояние -->
              <div class="empty-state" v-if="!hasProfileData">
                <div class="empty-orbital">
                  <div class="orbit"></div>
                  <div class="central-core">
                    <div class="core-inner">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="#0a0a0a" stroke-width="2"/>
                        <path d="M6 20C6 17.7909 7.79086 16 10 16H14C16.2091 16 18 17.7909 18 20V21C18 21.5523 17.5523 22 17 22H7C6.44772 22 6 21.5523 6 21V20Z" stroke="#0a0a0a" stroke-width="2"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <h3>Профиль не заполнен</h3>
                <p>Заполните информацию о себе, чтобы работодатели могли вас найти</p>
                <button @click="startEditing" class="btn btn-primary">
                  <span class="button-content">
                    <span class="button-text">Заполнить профиль</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Режим редактирования -->
      <div v-else class="profile-edit">
        <!-- Анимированный заголовок -->


        <div class="profile-container-edit">
          <div class="profile-card">
            <div class="card-glow"></div>

            <div class="profile-header-edit">
              <div class="edit-actions">
                <button @click="cancelEditing" class="btn btn-secondary" :disabled="loading">
                  <span class="button-content">
                    <span class="button-text">Отмена</span>
                  </span>
                </button>
                <button @click="saveProfile" class="btn btn-primary" :disabled="loading || !hasChanges">
                  <span class="button-content">
                    <span v-if="loading" class="btn-spinner"></span>
                    <span v-else class="button-text">Сохранить изменения</span>
                  </span>
                </button>
              </div>
            </div>

            <form @submit.prevent="saveProfile" class="profile-form">
              <!-- Аватар -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" stroke-width="2"/>
                      <path d="M6 20C6 17.7909 7.79086 16 10 16H14C16.2091 16 18 17.7909 18 20V21C18 21.5523 17.5523 22 17 22H7C6.44772 22 6 21.5523 6 21V20Z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <h3 class="section-title">Фотография профиля</h3>
                </div>
                <div class="avatar-upload-section">
                  <div class="avatar-upload-container">
                    <div class="avatar-preview" @click="triggerFileInput">
                      <img
                        v-if="avatarPreview"
                        :src="avatarPreview"
                        alt="Предпросмотр аватара"
                        class="avatar-preview-image"
                      >
                      <div v-else class="avatar-preview-placeholder">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" stroke-width="2"/>
                          <path d="M6 20C6 17.7909 7.79086 16 10 16H14C16.2091 16 18 17.7909 18 20V21C18 21.5523 17.5523 22 17 22H7C6.44772 22 6 21.5523 6 21V20Z" stroke="currentColor" stroke-width="2"/>
                        </svg>
                      </div>
                      <div class="avatar-upload-overlay">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>Загрузить фото</span>
                      </div>
                    </div>
                    <input
                      ref="fileInput"
                      type="file"
                      accept="image/*"
                      @change="handleAvatarUpload"
                      class="avatar-file-input"
                    >
                    <div class="avatar-upload-info">
                      <p>Рекомендуемый размер: 500×500px</p>
                      <p>Форматы: JPG, PNG, WebP</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- О себе -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 11.5C21 16.7467 16.7467 21 11.5 21C6.25329 21 2 16.7467 2 11.5C2 6.25329 6.25329 2 11.5 2C16.7467 2 21 6.25329 21 11.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <path d="M11.5 15.5C13.7091 15.5 15.5 13.7091 15.5 11.5C15.5 9.29086 13.7091 7.5 11.5 7.5C9.29086 7.5 7.5 9.29086 7.5 11.5C7.5 13.7091 9.29086 15.5 11.5 15.5Z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <h3 class="section-title">О себе</h3>
                </div>
                <div class="form-group">
                  <label>Расскажите о себе</label>
                  <textarea
                    v-model="editForm.about_me"
                    rows="4"
                    placeholder="Ваш опыт, достижения, профессиональные цели..."
                    class="form-textarea"
                    maxlength="1000"
                  ></textarea>
                  <div class="char-counter">{{ editForm.about_me.length }}/1000</div>
                </div>
              </div>

              <!-- Специализация -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 10V16M22 10L12 4L2 10L12 16L22 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h3 class="section-title">Специализация</h3>
                </div>
                <div class="form-group">
                  <label>Выберите специализации</label>
                  <div class="checkbox-grid">
                    <label v-for="spec in specializations" :key="spec.value" class="checkbox-label">
                      <input
                        type="checkbox"
                        :value="spec.value"
                        v-model="editForm.specialization"
                        class="checkbox-input"
                      >
                      <span class="checkbox-custom"></span>
                      {{ spec.label }}
                    </label>
                  </div>
                </div>
              </div>

              <!-- Опыт работы -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h3 class="section-title">Опыт работы</h3>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Лет опыта</label>
                    <input
                      type="number"
                      v-model.number="editForm.experience_years"
                      min="0"
                      max="50"
                      class="form-input"
                    >
                  </div>
                </div>
                <div class="form-group">
                  <label>Описание опыта (необязательно)</label>
                  <textarea
                    v-model="editForm.experience_description"
                    rows="3"
                    placeholder="Подробно опишите ваш профессиональный опыт..."
                    class="form-textarea"
                    maxlength="500"
                  ></textarea>
                  <div class="char-counter">{{ editForm.experience_description.length }}/500</div>
                </div>
              </div>

              <!-- Водительские права -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L6.5 8.5H17.5L19 13M5 13L3 13V16H5M5 13H19M19 13L20.5 16H21M5 16V19H7M19 16V19H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h3 class="section-title">Водительские права</h3>
                </div>
                <div class="form-group">
                  <label>Категории прав</label>
                  <div class="checkbox-grid">
                    <label v-for="category in licenseCategories" :key="category" class="checkbox-label">
                      <input
                        type="checkbox"
                        :value="category"
                        v-model="editForm.driver_license_category"
                        class="checkbox-input"
                      >
                      <span class="checkbox-custom"></span>
                      {{ category }}
                    </label>
                  </div>
                </div>
              </div>

              <!-- Языки -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 12H22M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h3 class="section-title">Знание языков</h3>
                </div>
                <div class="form-group">
                  <div class="languages-list">
                    <div v-for="(lang, index) in editForm.languages" :key="index" class="language-row">
                      <select v-model="lang.language" class="form-select" :class="{ 'error': !lang.language && submitted }">
                        <option value="">Выберите язык</option>
                        <option v-for="language in availableLanguages" :key="language" :value="language">
                          {{ language }}
                        </option>
                      </select>
                      <select v-model="lang.level" class="form-select" :class="{ 'error': !lang.level && submitted }">
                        <option value="">Уровень</option>
                        <option value="beginner">Начальный</option>
                        <option value="intermediate">Средний</option>
                        <option value="advanced">Продвинутый</option>
                        <option value="native">Родной</option>
                      </select>
                      <button
                        type="button"
                        @click="removeLanguage(index)"
                        class="btn-remove"
                        :disabled="editForm.languages.length === 1"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <button type="button" @click="addLanguage" class="btn btn-outline">
                    <span class="button-content">
                      <span class="button-text">+ Добавить язык</span>
                    </span>
                  </button>
                </div>
              </div>

              <!-- Навыки -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h3 class="section-title">Профессиональные навыки</h3>
                </div>
                <div class="form-group">
                  <label>Добавьте ваши ключевые навыки</label>
                  <div class="tags-input" @click="focusSkillInput">
                    <div v-for="(skill, index) in editForm.skills" :key="index" class="tag">
                      {{ skill }}
                      <button type="button" @click.stop="removeSkill(index)" class="tag-remove">
                        ×
                      </button>
                    </div>
                    <input
                      ref="skillInput"
                      v-model="newSkill"
                      @keydown="handleSkillInput"
                      placeholder="Введите навык и нажмите Enter"
                      class="tag-input"
                      maxlength="50"
                    >
                  </div>
                  <div class="form-hint">Нажмите Enter или запятую для добавления навыка</div>
                </div>
              </div>

              <!-- Дополнительная информация -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h3 class="section-title">Дополнительная информация</h3>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="checkbox-label large">
                      <input type="checkbox" v-model="editForm.has_car" class="checkbox-input">
                      <span class="checkbox-custom"></span>
                      <div class="checkbox-text">
                        <div class="checkbox-title">Личный автомобиль</div>
                        <div class="checkbox-description">Доступен для работы</div>
                      </div>
                    </label>
                  </div>
                  <div class="form-group">
                    <label class="checkbox-label large">
                      <input type="checkbox" v-model="editForm.has_tools" class="checkbox-input">
                      <span class="checkbox-custom"></span>
                      <div class="checkbox-text">
                        <div class="checkbox-title">Собственные инструменты</div>
                        <div class="checkbox-description">Есть необходимое оборудование</div>
                      </div>
                    </label>
                  </div>
                </div>
                <div class="form-group">
                  <label>Ожидания по зарплате (руб/час)</label>
                  <input
                    type="number"
                    v-model.number="editForm.salary_expectations"
                    class="form-input"
                    placeholder="например, 500"
                    min="0"
                    max="10000"
                  >
                  <div class="form-hint">Укажите желаемую ставку за час работы</div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Уведомления -->
    <Transition name="slide-fade">
      <div v-if="message" class="notification-message success show">
        <div class="notification-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="notification-content">
          <strong>Успешно!</strong>
          <p>{{ message }}</p>
        </div>
      </div>
    </Transition>

    <Transition name="slide-fade">
      <div v-if="error" class="notification-message error show">
        <div class="notification-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="notification-content">
          <strong>Ошибка!</strong>
          <p>{{ error }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

interface Profile {
  full_name: string
  email: string
  phone: string
  avatar_url?: string
  profile?: ProfileData
}

interface ProfileData {
  about_me?: string
  specialization?: string[]
  experience_years?: number
  experience_description?: string
  driver_license_category?: string[]
  languages?: Record<string, string>
  skills?: string[]
  has_car?: boolean
  has_tools?: boolean
  salary_expectations?: number
}

interface LanguageEntry {
  language: string
  level: string
}

interface EditForm {
  about_me: string
  specialization: string[]
  experience_years: number
  experience_description: string
  driver_license_category: string[]
  languages: LanguageEntry[]
  skills: string[]
  has_car: boolean
  has_tools: boolean
  salary_expectations: number
}

const authStore = useAuthStore()

// Refs
const profile = ref<Profile>({
  full_name: '',
  email: '',
  phone: ''
})
const isEditing = ref(false)
const loading = ref(false)
const error = ref('')
const message = ref('')
const newSkill = ref('')
const skillInput = ref<HTMLInputElement>()
const submitted = ref(false)
const fileInput = ref<HTMLInputElement>()
const avatarPreview = ref<string>('')
const avatarFile = ref<File | null>(null)

// Константы
const specializations = [
  { value: 'construction', label: 'Строительные работы' },
  { value: 'renovation', label: 'Ремонтные работы' },
  { value: 'electrical', label: 'Электромонтажные работы' },
  { value: 'plumbing', label: 'Сантехнические работы' },
  { value: 'carpentry', label: 'Плотницкие работы' },
  { value: 'painting', label: 'Малярные работы' },
  { value: 'welding', label: 'Сварочные работы' },
  { value: 'landscaping', label: 'Благоустройство территории' },
  { value: 'other', label: 'Другое' }
]

const licenseCategories = ['A', 'B', 'C', 'D', 'E']
const availableLanguages = ['Русский', 'Английский', 'Немецкий', 'Французский', 'Китайский', 'Испанский', 'Другой']

// Форма редактирования
const editForm = reactive<EditForm>({
  about_me: '',
  specialization: [],
  experience_years: 0,
  experience_description: '',
  driver_license_category: [],
  languages: [{ language: '', level: '' }],
  skills: [],
  has_car: false,
  has_tools: false,
  salary_expectations: 0
})

const originalEditForm = ref<string>('')

// Computed
const profileData = computed(() => profile.value.profile || {})

const hasProfileData = computed(() => {
  const data = profileData.value
  return data.about_me ||
         (data.specialization && data.specialization.length > 0) ||
         data.experience_years ||
         (data.driver_license_category && data.driver_license_category.length > 0) ||
         (data.languages && Object.keys(data.languages).length > 0) ||
         (data.skills && data.skills.length > 0) ||
         data.has_car !== undefined ||
         data.has_tools !== undefined ||
         data.salary_expectations
})

const hasProfessionalInfo = computed(() => {
  const data = profileData.value
  return (data.specialization && data.specialization.length > 0) ||
         data.experience_years ||
         (data.driver_license_category && data.driver_license_category.length > 0)
})

const hasSpecialization = computed(() =>
  profileData.value.specialization && profileData.value.specialization.length > 0
)

const hasDriverLicense = computed(() =>
  profileData.value.driver_license_category && profileData.value.driver_license_category.length > 0
)

const hasSkills = computed(() =>
  profileData.value.skills && profileData.value.skills.length > 0
)

const hasLanguages = computed(() =>
  profileData.value.languages && Object.keys(profileData.value.languages).length > 0
)

const hasAdditionalInfo = computed(() => {
  const data = profileData.value
  return data.has_car !== undefined || data.has_tools !== undefined || data.salary_expectations
})

const hasChanges = computed(() => {
  return originalEditForm.value !== JSON.stringify(editForm) || avatarFile.value !== null
})

// Methods
const loadProfile = async () => {
  try {
    loading.value = true
    const data = await $fetch('http://localhost:3001/api/borov/profile', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    profile.value = data

    if (data.profile) {
      initializeEditForm(data.profile)
    } else {
      resetEditForm()
    }
  } catch (err) {
    console.error('Error loading profile:', err)
    error.value = 'Ошибка загрузки профиля'
  } finally {
    loading.value = false
  }
}

const initializeEditForm = (profileData: ProfileData) => {
  const languagesArray: LanguageEntry[] = profileData.languages
    ? Object.entries(profileData.languages).map(([language, level]) => ({
        language,
        level: level as string
      }))
    : [{ language: '', level: '' }]

  Object.assign(editForm, {
    about_me: profileData.about_me || '',
    specialization: profileData.specialization || [],
    experience_years: profileData.experience_years || 0,
    experience_description: profileData.experience_description || '',
    driver_license_category: profileData.driver_license_category || [],
    languages: languagesArray,
    skills: profileData.skills || [],
    has_car: profileData.has_car || false,
    has_tools: profileData.has_tools || false,
    salary_expectations: profileData.salary_expectations || 0
  })

  saveOriginalForm()
}

const resetEditForm = () => {
  Object.assign(editForm, {
    about_me: '',
    specialization: [],
    experience_years: 0,
    experience_description: '',
    driver_license_category: [],
    languages: [{ language: '', level: '' }],
    skills: [],
    has_car: false,
    has_tools: false,
    salary_expectations: 0
  })
  saveOriginalForm()
}

const saveOriginalForm = () => {
  originalEditForm.value = JSON.stringify(editForm)
}

const startEditing = () => {
  isEditing.value = true
  submitted.value = false
  avatarPreview.value = profile.value.avatar_url || ''
  avatarFile.value = null
}

const cancelEditing = () => {
  if (hasChanges.value) {
    if (!confirm('У вас есть несохраненные изменения. Вы уверены, что хотите отменить?')) {
      return
    }
  }
  isEditing.value = false
  loadProfile() // Reload original data
}

const saveProfile = async () => {
  submitted.value = true

  // Валидация языков
  const invalidLanguages = editForm.languages.some(lang =>
    (lang.language && !lang.level) || (!lang.language && lang.level)
  )

  if (invalidLanguages) {
    error.value = 'Заполните все выбранные языки'
    return
  }

  try {
    loading.value = true
    error.value = ''

    // Фильтруем пустые языки и преобразуем в объект
    const languagesObj = editForm.languages.reduce((acc, { language, level }) => {
      if (language && level) {
        acc[language] = level
      }
      return acc
    }, {} as Record<string, string>)

    const payload = {
      ...editForm,
      languages: languagesObj
    }

    // Если есть новый аватар, загружаем его отдельно
    if (avatarFile.value) {
      const formData = new FormData()
      formData.append('avatar', avatarFile.value)

      await $fetch('http://localhost:3001/api/borov/profile/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
        },
        body: formData
      })
    }

    await $fetch('http://localhost:3001/api/borov/profile', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${authStore.token}` },
      body: payload
    })

    message.value = 'Профиль успешно обновлен'
    isEditing.value = false
    submitted.value = false
    await loadProfile()

    setTimeout(() => {
      message.value = ''
    }, 5000)
  } catch (err: any) {
    console.error('Error saving profile:', err)
    error.value = err.data?.error || 'Ошибка сохранения профиля'

    setTimeout(() => {
      error.value = ''
    }, 5000)
  } finally {
    loading.value = false
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      error.value = 'Пожалуйста, выберите изображение'
      return
    }

    // Проверка размера файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error.value = 'Размер файла не должен превышать 5MB'
      return
    }

    avatarFile.value = file

    // Создание preview
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const addSkill = () => {
  const skill = newSkill.value.trim()
  if (skill && !editForm.skills.includes(skill)) {
    editForm.skills.push(skill)
    newSkill.value = ''
  }
}

const removeSkill = (index: number) => {
  editForm.skills.splice(index, 1)
}

const handleSkillInput = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    addSkill()
  }
}

const focusSkillInput = () => {
  skillInput.value?.focus()
}

const addLanguage = () => {
  editForm.languages.push({ language: '', level: '' })
}

const removeLanguage = (index: number) => {
  if (editForm.languages.length > 1) {
    editForm.languages.splice(index, 1)
  }
}

const getSpecializationLabel = (value: string) => {
  const spec = specializations.find(s => s.value === value)
  return spec?.label || value
}

const getExperienceText = (years: number) => {
  if (years === 1) return '1 год'
  if (years >= 2 && years <= 4) return `${years} года`
  return `${years} лет`
}

const getLanguageLevel = (level: string) => {
  const levels: Record<string, string> = {
    'beginner': 'Начальный',
    'intermediate': 'Средний',
    'advanced': 'Продвинутый',
    'native': 'Родной'
  }
  return levels[level] || level
}

const formatSalary = (amount: number) => {
  return `${new Intl.NumberFormat('ru-RU').format(amount)} ₽/час`
}

// Lifecycle
onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-page {
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
  max-width: 1200px;
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

/* Карточка профиля */
.profile-container-view,
.profile-container-edit {
  max-width: 900px;
  margin: 0 auto;
}

.profile-card {
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.9), rgba(21, 21, 21, 0.9));
  backdrop-filter: blur(20px);
  border-radius: 25px;
  border: 1px solid rgba(212, 175, 55, 0.15);
  overflow: hidden;
  position: relative;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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

.profile-card:hover {
  border-color: rgba(212, 175, 55, 0.3);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
  transform: translateY(-5px);
}

.profile-card:hover .card-glow {
  opacity: 1;
}

/* Шапка профиля */
.profile-header-section {
  padding: 40px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 25px;
  flex: 1;
}

.avatar-container {
  position: relative;
}

.avatar-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  position: relative;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1));
  border: 2px solid rgba(212, 175, 55, 0.3);
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(212, 175, 55, 0.7);
  background: rgba(212, 175, 55, 0.1);
}

.avatar-status {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 16px;
  height: 16px;
  background: #4caf50;
  border: 2px solid #1a1a1a;
  border-radius: 50%;
}

.profile-main-info {
  flex: 1;
}

.profile-name {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: white;
  line-height: 1.2;
}

.profile-email {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
}

.profile-stats {
  display: flex;
  gap: 25px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d4af37;
}

/* Кнопки */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
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

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.btn-edit {
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.btn-edit:hover {
  background: rgba(212, 175, 55, 0.2);
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  color: #d4af37;
  border: 1px solid #d4af37;
}

.btn-outline:hover {
  background: rgba(212, 175, 55, 0.1);
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
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

/* Сетка профиля */
.profile-grid {
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 40px;
}

.profile-section {
  background: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.profile-section:hover {
  border-color: rgba(212, 175, 55, 0.2);
  transform: translateY(-2px);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.section-icon {
  width: 40px;
  height: 40px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d4af37;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.section-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #d4af37;
  margin: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

.info-item span {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background: rgba(212, 175, 55, 0.2);
  color: #d4af37;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid rgba(212, 175, 55, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.tag:hover {
  background: rgba(212, 175, 55, 0.3);
  transform: translateY(-1px);
}

.tag-remove {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.tag-remove:hover {
  background: rgba(255, 255, 255, 0.1);
}

.about-text {
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.05rem;
}

.status-yes {
  color: #4caf50;
  font-weight: 600;
}

.status-no {
  color: #f44336;
  font-weight: 600;
}

.salary {
  color: #d4af37;
  font-weight: 600;
  font-size: 1.1rem;
}

.language-level {
  color: #d4af37;
  font-weight: 500;
}

/* Форма редактирования */
.profile-header-edit {
  padding: 30px 40px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.edit-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 40px;
}

.form-section {
  background: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.form-section:hover {
  border-color: rgba(212, 175, 55, 0.2);
}

.form-group {
  margin-bottom: 25px;
  position: relative;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.05);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.form-input.error,
.form-textarea.error,
.form-select.error {
  border-color: #f44336;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

/* Загрузка аватара */
.avatar-upload-section {
  margin-top: 10px;
}

.avatar-upload-container {
  display: flex;
  align-items: flex-start;
  gap: 30px;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(212, 175, 55, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.avatar-preview:hover {
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.05);
}

.avatar-preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-preview-placeholder {
  color: rgba(212, 175, 55, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 50%;
}

.avatar-preview:hover .avatar-upload-overlay {
  opacity: 1;
}

.avatar-file-input {
  display: none;
}

.avatar-upload-info {
  flex: 1;
}

.avatar-upload-info p {
  margin: 5px 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

/* Чекбоксы */
.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 12px 0;
  transition: opacity 0.3s ease;
  color: rgba(255, 255, 255, 0.9);
}

.checkbox-label.large {
  align-items: flex-start;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.checkbox-label.large:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(212, 175, 55, 0.2);
}

.checkbox-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.checkbox-title {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
}

.checkbox-description {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(212, 175, 55, 0.5);
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.checkbox-label.large .checkbox-custom {
  margin-top: 2px;
}

.checkbox-input:checked + .checkbox-custom {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 1px;
  width: 6px;
  height: 12px;
  border: solid #d4af37;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Языки */
.languages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.language-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 12px;
  align-items: start;
}

.btn-remove {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 6px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 14px;
}

.btn-remove:hover:not(:disabled) {
  background: rgba(244, 67, 54, 0.3);
  transform: scale(1.05);
}

.btn-remove:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Ввод тегов */
.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  min-height: 60px;
  align-items: center;
  cursor: text;
  transition: all 0.3s ease;
}

.tags-input:focus-within {
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.05);
}

.tag-input {
  flex: 1;
  background: none;
  border: none;
  color: #fff;
  outline: none;
  min-width: 150px;
  font-size: 1rem;
  padding: 8px 0;
}

.tag-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
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
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  max-width: 400px;
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid;
}

.notification-message.show {
  transform: translateX(0);
  opacity: 1;
}

.notification-message.success {
  border-color: rgba(76, 175, 80, 0.5);
}

.notification-message.error {
  border-color: rgba(244, 67, 54, 0.5);
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  flex-shrink: 0;
}

.notification-message.success .notification-icon {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.notification-message.error .notification-icon {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
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

/* Анимации */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Вспомогательные элементы */
.char-counter {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: right;
  margin-top: 6px;
}

.form-hint {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 8px;
}

/* Пустое состояние */
.empty-state {
  text-align: center;
  padding: 60px 40px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 2px dashed rgba(255, 255, 255, 0.1);
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
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #d4af37;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 30px;
  line-height: 1.5;
  font-size: 1.1rem;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .profile-header-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .avatar-section {
    width: 100%;
  }

  .edit-actions {
    width: 100%;
    justify-content: space-between;
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

  .profile-header-section,
  .profile-grid,
  .profile-form {
    padding: 25px;
  }

  .avatar-section {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .profile-stats {
    justify-content: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .checkbox-grid {
    grid-template-columns: 1fr;
  }

  .language-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .avatar-upload-container {
    flex-direction: column;
    text-align: center;
  }

  .notification-message {
    right: 15px;
    left: 15px;
    max-width: none;
  }

  .edit-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .profile-header-section,
  .profile-grid,
  .profile-form {
    padding: 20px;
  }

  .profile-name {
    font-size: 1.7rem;
  }

  .section-title {
    font-size: 1.2rem;
  }

  .empty-state {
    padding: 40px 20px;
  }

  .avatar-wrapper {
    width: 80px;
    height: 80px;
  }

  .avatar-preview {
    width: 100px;
    height: 100px;
  }
}
</style>