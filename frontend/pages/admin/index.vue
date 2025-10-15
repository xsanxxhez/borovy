<template>
  <div class="admin-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1>👑 Панель управления Borovy</h1>
        <p>Полный контроль над системой вахтовой работы</p>
      </div>
      <div class="header-actions">
        <button @click="refreshData" class="btn btn-outline" title="Обновить данные">
          🔄 Обновить
        </button>
        <div class="last-updated">
          Обновлено: {{ lastUpdated }}
        </div>
      </div>
    </div>

    <!-- Statistics Overview -->
    <div class="stats-overview">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🐘</div>
          <div class="stat-info">
            <h3>{{ totalStats.slons_count || 0 }}</h3>
            <p>Активных слонов</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💪</div>
          <div class="stat-info">
            <h3>{{ totalStats.borovs_count || 0 }}</h3>
            <p>Всего боровов</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🏗️</div>
          <div class="stat-info">
            <h3>{{ totalStats.vakhtas_count || 0 }}</h3>
            <p>Предприятий</p>
            <div class="stat-trend">
              {{ totalStats.active_vakhtas_count || 0 }} активных
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🎫</div>
          <div class="stat-info">
            <h3>{{ totalStats.promo_codes || 0 }}</h3>
            <p>Промокодов</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions-section">
      <h2>⚡ Быстрые действия</h2>
      <div class="actions-grid">
        <button @click="showCreateSlon = true" class="action-card">
          <span class="action-icon">🐘</span>
          <span class="action-text">Добавить Слона</span>
        </button>

        <button @click="showCreateVakhta = true" class="action-card">
          <span class="action-icon">🏗️</span>
          <span class="action-text">Новое Предприятие</span>
        </button>

        <button @click="showCreatePromo = true" class="action-card">
          <span class="action-icon">🎫</span>
          <span class="action-text">Новый Промокод</span>
        </button>

        <button @click="exportData" class="action-card">
          <span class="action-icon">📊</span>
          <span class="action-text">Экспорт данных</span>
        </button>
      </div>
    </div>

    <!-- Модальное окно подтверждения удаления -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content delete-modal">
        <div class="modal-header">
          <h3>⚠️ Подтверждение удаления</h3>
          <button @click="closeDeleteModal" class="close-btn">✕</button>
        </div>

        <div class="delete-content">
          <div class="delete-icon">🗑️</div>
          <div class="delete-text">
            <h4>{{ deleteModal.title }}</h4>
            <p>{{ deleteModal.message }}</p>

            <!-- Предупреждение о зависимых данных -->
            <div v-if="deleteModal.warning" class="delete-warning">
              <span class="warning-icon">⚠️</span>
              {{ deleteModal.warning }}
            </div>
          </div>
        </div>

        <div class="delete-actions">
          <button @click="closeDeleteModal" class="btn btn-outline">
            Отмена
          </button>
          <button
            @click="confirmDelete"
            :disabled="deleting"
            :class="['btn', 'btn-danger', { 'loading': deleting }]"
          >
            <span v-if="deleting" class="loading-spinner"></span>
            {{ deleting ? 'Удаление...' : 'Удалить' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно создания слона -->
    <div v-if="showCreateSlon" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Создать нового Слона</h3>
          <button @click="showCreateSlon = false" class="close-btn">✕</button>
        </div>
        <form @submit.prevent="createSlon" class="modal-form">
          <div class="form-group">
            <label>Логин *</label>
            <input v-model="newSlon.username" type="text" required placeholder="Уникальный логин">
          </div>
          <div class="form-group">
            <label>Имя для отображения *</label>
            <input v-model="newSlon.display_name" type="text" required placeholder="Полное имя">
          </div>
          <div class="form-group">
            <label>Пароль *</label>
            <input v-model="newSlon.password" type="password" required placeholder="Минимум 6 символов">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="newSlon.contact_email" type="email" placeholder="email@example.com">
          </div>
          <div class="form-group">
            <label>Телефон</label>
            <input v-model="newSlon.contact_phone" type="tel" placeholder="+79990000000">
          </div>
          <div class="form-actions">
            <button type="button" @click="showCreateSlon = false" class="btn btn-outline">Отмена</button>
            <button type="submit" :disabled="creatingSlon" class="btn btn-primary">
              {{ creatingSlon ? 'Создание...' : 'Создать Слона' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Модальное окно создания вахты -->
    <div v-if="showCreateVakhta" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Создать новую Вахту</h3>
          <button @click="showCreateVakhta = false" class="close-btn">✕</button>
        </div>
        <form @submit.prevent="createVakhta" class="modal-form">
          <div class="form-group">
            <label>Название вахты *</label>
            <input v-model="newVakhta.title" type="text" required placeholder="Например: Разнорабочий на склад">
          </div>
          <div class="form-group">
            <label>Местоположение *</label>
            <input v-model="newVakhta.location" type="text" required placeholder="Например: Москва, склад №1">
          </div>
          <div class="form-group">
            <label>Количество мест *</label>
            <input v-model="newVakhta.total_places" type="number" min="1" max="100" required>
          </div>
          <div class="form-group">
            <label>Дата начала *</label>
            <input v-model="newVakhta.start_date" type="date" required>
          </div>
          <div class="form-group">
            <label>Дата окончания *</label>
            <input v-model="newVakhta.end_date" type="date" required>
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="newVakhta.description" rows="3" placeholder="Подробное описание вахты..."></textarea>
          </div>
          <div class="form-group">
            <label>Требования</label>
            <textarea v-model="newVakhta.requirements" rows="2" placeholder="Навыки, опыт, физическая форма..."></textarea>
          </div>
          <div class="form-group">
            <label>Условия</label>
            <textarea v-model="newVakhta.conditions" rows="2" placeholder="Условия труда, проживание, питание..."></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="showCreateVakhta = false" class="btn btn-outline">Отмена</button>
            <button type="submit" :disabled="creatingVakhta" class="btn btn-primary">
              {{ creatingVakhta ? 'Создание...' : 'Создать Вахту' }}
            </button>
          </div>
        </form>
      </div>
    </div>


    <!-- Модальное окно просмотра профиля борова -->
    <div v-if="showBorovProfileModal" class="modal-overlay">
      <div class="modal-content borov-profile-modal">
        <div class="modal-header">
          <h3>👤 Профиль Борова</h3>
          <button @click="closeBorovProfileModal" class="close-btn">✕</button>
        </div>

        <div v-if="selectedBorov" class="borov-profile-content">
          <!-- Основная информация -->
          <div class="profile-section">
            <div class="profile-header">
              <div class="avatar-section">
                <div class="avatar-placeholder">💪</div>
                <div class="user-info">
                  <h4>{{ selectedBorov.full_name }}</h4>
                  <p class="user-meta">
                    Возраст: {{ calculateAge(selectedBorov.birth_date) }} лет
                  </p>
                  <p class="user-meta">
                    Зарегистрирован: {{ formatDate(selectedBorov.created_at) }}
                  </p>
                </div>
              </div>
              <div class="status-info">
                <span :class="['status-badge', selectedBorov.current_vakhta_id ? 'active' : 'inactive']">
                  {{ selectedBorov.current_vakhta_id ? 'Работает' : 'Свободен' }}
                </span>
              </div>
            </div>

            <div class="contact-info">
              <div class="contact-item">
                <span class="contact-icon">📧</span>
                <span>{{ selectedBorov.email }}</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📱</span>
                <span>{{ selectedBorov.phone }}</span>
              </div>
              <div class="contact-item" v-if="selectedBorov.promo_code">
                <span class="contact-icon">🎫</span>
                <span>Промокод: {{ selectedBorov.promo_code }} ({{ selectedBorov.slon_name }})</span>
              </div>
            </div>
          </div>

          <!-- Статистика -->
          <div class="profile-section">
            <h5>📊 Статистика</h5>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-value">{{ selectedBorov.total_vakhtas_completed || 0 }}</span>
                <span class="stat-label">Завершено вахт</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ selectedBorov.total_work_days || 0 }}</span>
                <span class="stat-label">Отработано дней</span>
              </div>
            </div>
          </div>

          <!-- Текущая работа -->
          <div class="profile-section" v-if="selectedBorov.active_specialty || selectedBorov.active_vakhta">
            <h5>💼 Текущая работа</h5>
            <div class="current-work">
              <div v-if="selectedBorov.active_specialty" class="work-item">
                <span class="work-icon">👷</span>
                <div class="work-details">
                  <strong>{{ selectedBorov.active_specialty.specialty_title }}</strong>
                  <p>{{ selectedBorov.active_specialty.vakhta_title }}</p>
                  <small>С: {{ formatDate(selectedBorov.active_specialty.start_date) }}</small>
                </div>
              </div>
              <div v-else-if="selectedBorov.active_vakhta" class="work-item">
                <span class="work-icon">🏗️</span>
                <div class="work-details">
                  <strong>{{ selectedBorov.active_vakhta.vakhta_title }}</strong>
                  <small>С: {{ formatDate(selectedBorov.active_vakhta.start_date) }}</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Анкета -->
          <div class="profile-section" v-if="selectedBorov.profile">
            <h5>📝 Анкета</h5>

            <div v-if="selectedBorov.profile.about_me" class="profile-field">
              <label>О себе:</label>
              <p>{{ selectedBorov.profile.about_me }}</p>
            </div>

            <div v-if="selectedBorov.profile.specialization" class="profile-field">
              <label>Специализация:</label>
              <div class="tags">
                <span v-for="spec in selectedBorov.profile.specialization" :key="spec" class="tag">
                  {{ spec }}
                </span>
              </div>
            </div>

            <div v-if="selectedBorov.profile.experience_years" class="profile-field">
              <label>Опыт работы:</label>
              <p>{{ selectedBorov.profile.experience_years }} лет</p>
            </div>

            <div v-if="selectedBorov.profile.experience_description" class="profile-field">
              <label>Описание опыта:</label>
              <p>{{ selectedBorov.profile.experience_description }}</p>
            </div>

            <div v-if="selectedBorov.profile.skills" class="profile-field">
              <label>Навыки:</label>
              <div class="tags">
                <span v-for="skill in selectedBorov.profile.skills" :key="skill" class="tag">
                  {{ skill }}
                </span>
              </div>
            </div>

            <div v-if="selectedBorov.profile.driver_license_category" class="profile-field">
              <label>Водительские права:</label>
              <div class="tags">
                <span v-for="category in selectedBorov.profile.driver_license_category" :key="category" class="tag">
                  {{ category }}
                </span>
              </div>
            </div>

            <div v-if="selectedBorov.profile.preferred_work_types" class="profile-field">
              <label>Предпочтительные виды работ:</label>
              <div class="tags">
                <span v-for="type in selectedBorov.profile.preferred_work_types" :key="type" class="tag">
                  {{ type }}
                </span>
              </div>
            </div>

            <div class="profile-details-grid">
              <div v-if="selectedBorov.profile.has_car !== null" class="detail-item">
                <label>Есть автомобиль:</label>
                <span :class="['status-indicator', selectedBorov.profile.has_car ? 'yes' : 'no']">
                  {{ selectedBorov.profile.has_car ? 'Да' : 'Нет' }}
                </span>
              </div>

              <div v-if="selectedBorov.profile.has_tools !== null" class="detail-item">
                <label>Есть инструменты:</label>
                <span :class="['status-indicator', selectedBorov.profile.has_tools ? 'yes' : 'no']">
                  {{ selectedBorov.profile.has_tools ? 'Да' : 'Нет' }}
                </span>
              </div>

              <div v-if="selectedBorov.profile.work_radius" class="detail-item">
                <label>Радиус работы:</label>
                <span>{{ selectedBorov.profile.work_radius }} км</span>
              </div>

              <div v-if="selectedBorov.profile.salary_expectations" class="detail-item">
                <label>Ожидания по зарплате:</label>
                <span>{{ formatSalary(selectedBorov.profile.salary_expectations) }} руб/день</span>
              </div>
            </div>
          </div>

          <div v-else class="profile-section">
            <div class="no-profile">
              <p>😔 Боров еще не заполнил анкету</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно создания специальности -->
    <div v-if="showCreateSpecialtyModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Создать специальность для {{ selectedVakhta?.title }}</h3>
          <button @click="closeCreateSpecialtyModal" class="close-btn">✕</button>
        </div>
        <form @submit.prevent="createSpecialty" class="modal-form">
          <div class="form-group">
            <label>Название специальности *</label>
            <input v-model="newSpecialty.title" type="text" required placeholder="Например: Разнорабочий">
          </div>
          <div class="form-group">
            <label>Количество мест *</label>
            <input v-model="newSpecialty.total_places" type="number" min="1" max="100" required>
          </div>
          <div class="form-group">
            <label>Зарплата в день (₽) *</label>
            <input v-model="newSpecialty.salary" type="number" min="1000" required>
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="newSpecialty.description" rows="3" placeholder="Описание работы..."></textarea>
          </div>
          <div class="form-group">
            <label>Требования</label>
            <textarea v-model="newSpecialty.requirements" rows="2" placeholder="Требования к работнику..."></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="closeCreateSpecialtyModal" class="btn btn-outline">Отмена</button>
            <button type="submit" :disabled="creatingSpecialty" class="btn btn-primary">
              {{ creatingSpecialty ? 'Создание...' : 'Создать Специальность' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Модальное окно создания промокода -->
    <div v-if="showCreatePromo" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Создать новый Промокод</h3>
          <button @click="showCreatePromo = false" class="close-btn">✕</button>
        </div>
        <form @submit.prevent="createPromoCode" class="modal-form">
          <div class="form-group">
            <label>Код промокода *</label>
            <input v-model="newPromo.code" type="text" required placeholder="Например: SLON1_TIKTOK">
          </div>
          <div class="form-group">
            <label>Слон *</label>
            <select v-model="newPromo.slon_id" required>
              <option value="">Выберите слона</option>
              <option v-for="slon in dashboardData.slons" :key="slon.id" :value="slon.id">
                {{ slon.display_name }} (@{{ slon.username }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="newPromo.description" rows="3" placeholder="Описание промокода..."></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="showCreatePromo = false" class="btn btn-outline">Отмена</button>
            <button type="submit" :disabled="creatingPromo" class="btn btn-primary">
              {{ creatingPromo ? 'Создание...' : 'Создать Промокод' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Main Content Tabs -->
    <div class="content-tabs">
      <div class="tabs-header">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-text">{{ tab.name }}</span>
          <span v-if="tab.count !== null" class="tab-count">
            {{ getTabCount(tab.id) }}
          </span>
        </button>
      </div>

      <div class="tab-content">
        <!-- Slons Management -->
        <div v-if="activeTab === 'slons'" class="tab-pane">
          <div class="section-header">
            <h2>🐘 Управление Слонами</h2>
            <button @click="showCreateSlon = true" class="btn btn-primary">
              ➕ Добавить Слона
            </button>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Слон</th>
                  <th>Контакты</th>
                  <th>Статистика</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="slon in dashboardData.slons" :key="slon.id">
                  <td>
                    <div class="user-info">
                      <div class="user-avatar">🐘</div>
                      <div class="user-details">
                        <strong>{{ slon.display_name }}</strong>
                        <small>@{{ slon.username }}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="contact-info">
                      <div v-if="slon.contact_phone" class="contact-item">
                        📱 {{ slon.contact_phone }}
                      </div>
                      <div v-if="slon.contact_email" class="contact-item">
                        📧 {{ slon.contact_email }}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="stats-info">
                      <div class="stat-item">
                        <span class="stat-value">{{ slon.promo_codes_count || 0 }}</span>
                        <span class="stat-label">промокодов</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-value">{{ slon.borovs_count || 0 }}</span>
                        <span class="stat-label">боровов</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span :class="['status-badge', slon.is_active ? 'active' : 'inactive']">
                      {{ slon.is_active ? 'Активен' : 'Неактивен' }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button
                        @click="toggleSlonStatus(slon)"
                        :class="['btn', 'btn-sm', slon.is_active ? 'btn-warning' : 'btn-success']"
                        title="Переключить статус"
                      >
                        {{ slon.is_active ? '⏸️' : '▶️' }}
                      </button>
                      <button
                        v-if="slon.borovs_count === 0 && slon.promo_codes_count === 0"
                        @click="openDeleteModal('slon', slon)"
                        class="btn btn-danger btn-sm"
                        title="Удалить слона"
                      >
                        🗑️
                      </button>
                      <button
                        v-else
                        class="btn btn-disabled btn-sm"
                        title="Нельзя удалить - есть зависимые данные"
                        disabled
                      >
                        🔒
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Enterprises Management with Specialties -->
        <div v-if="activeTab === 'enterprises'" class="tab-pane">
          <div class="section-header">
            <h2>🏗️ Управление Предприятиями и Специальностями</h2>
            <button @click="showCreateVakhta = true" class="btn btn-primary">
              ➕ Новое Предприятие
            </button>
          </div>

          <!-- Предприятия с специальностями -->
          <div class="enterprises-container">
            <div
              v-for="vakhta in vakhtasWithSpecialties"
              :key="vakhta.id"
              class="enterprise-card"
            >
              <!-- Заголовок предприятия -->
              <div class="enterprise-header" @click="toggleVakhtaExpansion(vakhta.id)">
                <div class="enterprise-main">
                  <div class="enterprise-title">
                    <h3>{{ vakhta.title }}</h3>
                    <span :class="['status-badge', vakhta.is_active ? 'active' : 'inactive']">
                      {{ vakhta.is_active ? 'Активно' : 'Неактивно' }}
                    </span>
                  </div>
                  <p class="location">📍 {{ vakhta.location }}</p>
                  <p class="dates">📅 {{ formatDate(vakhta.start_date) }} - {{ formatDate(vakhta.end_date) }}</p>
                  <p class="workers">👥 {{ vakhta.current_workers || 0 }}/{{ vakhta.total_places }} работников</p>
                </div>

               <!-- В enterprise-actions заменить кнопку удаления -->
               <div class="enterprise-actions">
                 <button
                   @click.stop="showCreateSpecialty(vakhta)"
                   class="btn btn-success btn-sm"
                   title="Добавить специальность"
                 >
                   ➕ Специальность
                 </button>
                 <button
                   @click.stop="toggleVakhtaStatus(vakhta)"
                   :class="['btn', 'btn-sm', vakhta.is_active ? 'btn-warning' : 'btn-success']"
                   title="Переключить статус"
                 >
                   {{ vakhta.is_active ? '⏸️ Стоп' : '▶️ Старт' }}
                 </button>
                 <!-- Новая кнопка управления работниками -->
                 <button
                   @click.stop="manageVakhtaWorkers(vakhta)"
                   class="btn btn-info btn-sm"
                   title="Управление работниками"
                 >
                   👥 Работники
                 </button>
                 <button
                   @click.stop="openDeleteModal('vakhta', vakhta)"
                   class="btn btn-danger btn-sm"
                   title="Удалить предприятие"
                 >
                   🗑️
                 </button>
                 <button
                   @click.stop="toggleVakhtaExpansion(vakhta.id)"
                   class="btn btn-outline btn-sm"
                   title="Показать/скрыть специальности"
                 >
                   {{ expandedVakhtas.includes(vakhta.id) ? '▲' : '▼' }}
                 </button>
                 <!-- В enterprise-actions добавьте эту кнопку -->
                 <button
                   @click.stop="universalRemoveWorkers(vakhta)"
                   class="btn btn-danger btn-sm"
                   title="Принудительно снять всех работников"
                   v-if="vakhta.current_workers > 0"
                 >
                   💥 Снять всех
                 </button>
               </div>
              </div>

              <!-- Специальности предприятия -->
              <div v-if="expandedVakhtas.includes(vakhta.id)" class="specialties-section">
                <div class="specialties-header">
                  <h4>👷 Специальности предприятия</h4>
                  <span class="specialties-count">
                    {{ vakhta.specialties?.length || 0 }} специальностей
                  </span>
                </div>

                <div v-if="!vakhta.specialties || vakhta.specialties.length === 0" class="no-specialties">
                  <p>😔 Нет созданных специальностей</p>
                  <button @click="showCreateSpecialty(vakhta)" class="btn btn-primary btn-sm">
                    ➕ Создать первую специальность
                  </button>
                </div>

                <div v-else class="specialties-grid">
                  <div
                    v-for="specialty in vakhta.specialties"
                    :key="specialty.id"
                    class="specialty-card"
                  >
                    <div class="specialty-header">
                      <div class="specialty-info">
                        <h5>{{ specialty.title }}</h5>
                        <p class="specialty-description" v-if="specialty.description">
                          {{ specialty.description }}
                        </p>
                        <div class="specialty-details">
                          <span class="salary">💰 {{ formatSalary(specialty.salary) }}/день</span>
                          <span class="places">
                            👥 {{ specialty.current_workers || 0 }}/{{ specialty.total_places }}
                          </span>
                          <span v-if="specialty.requirements" class="requirements">
                            📋 {{ truncateText(specialty.requirements, 50) }}
                          </span>
                        </div>
                      </div>

                      <div class="specialty-actions">
                        <span :class="['status-badge', specialty.is_active ? 'active' : 'inactive']">
                          {{ specialty.is_active ? 'Активна' : 'Неактивна' }}
                        </span>
                        <button
                          @click="editSpecialty(specialty)"
                          class="btn btn-outline btn-sm"
                          title="Редактировать"
                        >
                          ✏️
                        </button>
                        <button
                          @click="toggleSpecialtyStatus(specialty)"
                          :class="['btn', 'btn-sm', specialty.is_active ? 'btn-warning' : 'btn-success']"
                          title="Переключить статус"
                        >
                          {{ specialty.is_active ? '⏸️' : '▶️' }}
                        </button>
                        <button
                          @click="openDeleteModal('specialty', specialty)"
                          class="btn btn-danger btn-sm"
                          title="Удалить специальность"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Promocodes Management -->
        <div v-if="activeTab === 'promocodes'" class="tab-pane">
          <div class="section-header">
            <h2>🎫 Управление Промокодами</h2>
            <button @click="showCreatePromo = true" class="btn btn-primary">
              ➕ Создать Промокод
            </button>
          </div>

          <div class="promocodes-grid">
            <div
              v-for="promo in dashboardData.promocodes"
              :key="promo.id"
              class="promocode-card"
            >
              <div class="promo-header">
                <h3>{{ promo.code }}</h3>
                <div class="promo-header-actions">
                  <span class="usage-badge">
                    Использован {{ promo.borovs_count }} раз
                  </span>
                  <button
                    @click="openDeleteModal('promo', promo)"
                    class="btn btn-danger btn-sm"
                    title="Удалить промокод"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div class="promo-info">
                <p class="slon">🐘 Создан: {{ promo.slon_name }}</p>
                <p class="description" v-if="promo.description">{{ promo.description }}</p>
                <p class="created">📅 Создан: {{ formatDate(promo.created_at) }}</p>
              </div>

              <div class="promo-actions">
                <span :class="['status-badge', promo.is_active ? 'active' : 'inactive']">
                  {{ promo.is_active ? 'Активен' : 'Неактивен' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Borovs Management -->
        <div v-if="activeTab === 'borovs'" class="tab-pane">
          <div class="section-header">
            <h2>💪 Управление Боровами</h2>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Боров</th>
                  <th>Контакты</th>
                  <th>Промокод</th>
                  <th>Статистика</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="borov in dashboardData.borovs" :key="borov.id">
                  <td>
                    <div class="user-info">
                      <div class="user-avatar">💪</div>
                      <div class="user-details">
                        <strong>{{ borov.full_name }}</strong>
                        <small>Возраст: {{ calculateAge(borov.birth_date) }}</small>
                      </div>
                    </div>
                  </td>
                  <!-- В таблице боровов обновим колонку действий -->
                  <td>
                    <div class="action-buttons">
                      <button
                        @click="viewBorovProfile(borov)"
                        class="btn btn-primary btn-sm"
                        title="Просмотреть профиль"
                      >
                        👁️ Профиль
                      </button>
                      <button
                        @click="openDeleteModal('borov', borov)"
                        class="btn btn-danger btn-sm"
                        title="Удалить борова"
                        :disabled="borov.current_vakhta"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                  <td>
                    <div class="contact-info">
                      <div class="contact-item">📧 {{ borov.email }}</div>
                      <div class="contact-item">📱 {{ borov.phone }}</div>
                    </div>
                  </td>
                  <td>
                    <span class="promo-code">{{ borov.promo_code }}</span>
                    <small>от {{ borov.slon_name }}</small>
                  </td>
                  <td>
                    <div class="stats-info">
                      <div class="stat-item">
                        <span class="stat-value">{{ borov.total_vakhtas_completed || 0 }}</span>
                        <span class="stat-label">вахт</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-value">{{ borov.total_work_days || 0 }}</span>
                        <span class="stat-label">дней</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span :class="['status-badge', borov.current_vakhta ? 'active' : 'inactive']">
                      {{ borov.current_vakhta ? 'Работает' : 'Свободен' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>




<!-- Модальное окно управления работниками вахты -->
<div v-if="showVakhtaWorkersModal" class="modal-overlay">
  <div class="modal-content vakhta-workers-modal">
    <div class="modal-header">
      <h3>👥 Управление работниками вахты</h3>
      <button @click="closeVakhtaWorkersModal" class="close-btn">✕</button>
    </div>

    <div v-if="selectedVakhtaForWorkers" class="vakhta-workers-content">
      <!-- Информация о вахте -->
      <div class="vakhta-info-section">
        <h4>{{ selectedVakhtaForWorkers.title }}</h4>
        <p class="location">📍 {{ selectedVakhtaForWorkers.location }}</p>
        <p class="workers-count">
          Активных работников: <strong>{{ selectedVakhtaForWorkers.current_workers || 0 }}</strong>
        </p>
        <p class="debug-info" style="font-size: 12px; color: #666;">
          ID вахты: {{ selectedVakhtaForWorkers.id }} |
          Загружено работников: {{ vakhtaWorkers.length }}
        </p>
      </div>

      <!-- Список работников -->
      <div class="workers-section">
        <div class="section-header">
          <h5>Список работников</h5>
          <button
            v-if="vakhtaWorkers.length > 0"
            @click="removeAllWorkers"
            :disabled="removingWorkers"
            class="btn btn-danger btn-sm"
          >
            {{ removingWorkers ? 'Удаление...' : '❌ Снять всех' }}
          </button>
        </div>

        <div v-if="loadingWorkers" class="loading-workers">
          <p>Загрузка списка работников...</p>
        </div>

        <div v-else-if="vakhtaWorkers.length === 0" class="no-workers">
          <p>😔 На этой вахте нет активных работников</p>
          <div class="debug-actions">
            <button @click="forceShowWorkers(selectedVakhtaForWorkers)" class="btn btn-warning btn-sm">
              🔍 Принудительно найти работников
            </button>
            <button @click="closeVakhtaWorkersModal" class="btn btn-primary">
              Закрыть
            </button>
          </div>
        </div>

        <div v-else class="workers-list">
          <div
            v-for="worker in vakhtaWorkers"
            :key="worker.id"
            class="worker-card"
          >
            <div class="worker-info">
              <div class="worker-avatar">💪</div>
              <div class="worker-details">
                <strong>{{ worker.full_name }}</strong>
                <div class="worker-contacts">
                  <span>📱 {{ worker.phone }}</span>
                  <span>📧 {{ worker.email }}</span>
                </div>
                <div class="worker-meta">
                  <small>Записан: {{ formatDate(worker.start_date) }}</small>
                  <small>ID: {{ worker.borov_id }}</small>
                </div>
              </div>
            </div>
            <div class="worker-actions">
              <button
                @click="viewBorovProfileFromWorker(worker)"
                class="btn btn-outline btn-sm"
                title="Просмотреть профиль"
              >
                👁️ Профиль
              </button>
              <button
                @click="removeWorker(worker)"
                :disabled="removingWorkers"
                class="btn btn-danger btn-sm"
                title="Снять с вахты"
              >
                🗑️ Снять
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>



        <!-- Activity Logs -->
        <div v-if="activeTab === 'activity'" class="tab-pane">
          <div class="section-header">
            <h2>📊 Активность Боровов</h2>
          </div>

          <div class="activity-list">
            <div v-for="activity in borovActivity" :key="activity.id" class="activity-item">
              <div class="activity-icon">
                {{ getActivityIcon(activity.status) }}
              </div>
              <div class="activity-content">
                <div class="activity-header">
                  <strong>{{ activity.borov_name }}</strong>
                  <span class="activity-time">{{ formatTime(activity.created_at) }}</span>
                </div>
                <p class="activity-text">
                  {{ getActivityText(activity) }}
                </p>
                <div class="activity-details">
                  <span class="detail">📱 {{ activity.borov_phone }}</span>
                  <span v-if="activity.slon_name" class="detail">🐘 Слон: {{ activity.slon_name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification -->
    <div v-if="notification.show" class="notification" :class="notification.type">
      <div class="notification-content">
        <span class="notification-icon">{{ notification.icon }}</span>
        <div class="notification-text">
          <strong>{{ notification.title }}</strong>
          <p>{{ notification.message }}</p>
        </div>
      </div>
      <button @click="notification.show = false" class="notification-close">✕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Добавить в data

// Добавить в data
const showVakhtaWorkersModal = ref(false)
const selectedVakhtaForWorkers = ref(null)
const vakhtaWorkers = ref([])
const loadingWorkers = ref(false)
const removingWorkers = ref(false)

const manageVakhtaWorkers = async (vakhta) => {
  try {
    console.log('🔄 Managing workers for vakhta:', {
      id: vakhta.id,
      title: vakhta.title,
      current_workers: vakhta.current_workers
    });

    selectedVakhtaForWorkers.value = vakhta
    showVakhtaWorkersModal.value = true
    loadingWorkers.value = true
    vakhtaWorkers.value = []

    // Добавим таймаут для отладки
    console.log('📡 Making API request to:', `http://localhost:3001/api/admin/vakhtas/${vakhta.id}/workers`);

    const response = await $fetch(`http://localhost:3001/api/admin/vakhtas/${vakhta.id}/workers`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    console.log('✅ API Response:', response);
    vakhtaWorkers.value = response

  } catch (error) {
    console.error('❌ Error loading vakhta workers:', error)
    console.error('❌ Error details:', error.data)
    showNotification('Ошибка', 'Не удалось загрузить список работников', 'error')
    closeVakhtaWorkersModal()
  } finally {
    loadingWorkers.value = false
  }
}

const closeVakhtaWorkersModal = () => {
  showVakhtaWorkersModal.value = false
  selectedVakhtaForWorkers.value = null
  vakhtaWorkers.value = []
  loadingWorkers.value = false
  removingWorkers.value = false
}

const removeAllWorkers = async () => {
  if (!selectedVakhtaForWorkers.value) return

  try {
    removingWorkers.value = true

    const response = await $fetch(
      `http://localhost:3001/api/admin/vakhtas/${selectedVakhtaForWorkers.value.id}/workers`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      }
    )

    showNotification(
      'Успех',
      `Снято ${response.removed_count} работников с вахты`,
      'success'
    )

    // Обновляем список работников
    await manageVakhtaWorkers(selectedVakhtaForWorkers.value)

  } catch (error) {
    console.error('Error removing all workers:', error)
    showNotification('Ошибка', 'Не удалось снять работников', 'error')
  } finally {
    removingWorkers.value = false
  }
}

const removeWorker = async (worker) => {
  if (!selectedVakhtaForWorkers.value) return

  try {
    removingWorkers.value = true

    await $fetch(
      `http://localhost:3001/api/admin/vakhtas/${selectedVakhtaForWorkers.value.id}/workers/${worker.borov_id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      }
    )

    showNotification(
      'Успех',
      `Работник ${worker.full_name} снят с вахты`,
      'success'
    )

    // Обновляем список работников
    await manageVakhtaWorkers(selectedVakhtaForWorkers.value)

  } catch (error) {
    console.error('Error removing worker:', error)
    showNotification('Ошибка', 'Не удалось снять работника', 'error')
  } finally {
    removingWorkers.value = false
  }
}

const forceDeleteVakhta = async (vakhta) => {
  if (!confirm(`ОПАСНО! Вы уверены, что хотите принудительно удалить вахту "${vakhta.title}"? Это может повредить данные.`)) {
    return;
  }

  try {
    const response = await $fetch(
      `http://localhost:3001/api/admin/vakhtas/${vakhta.id}/force-delete`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      }
    );

    showNotification('Успех', 'Вахта принудительно удалена', 'success');
    await refreshData();
  } catch (error) {
    console.error('Force delete vakhta error:', error);
    showNotification('Ошибка', 'Не удалось удалить вахту', 'error');
  }
}

const deleteVakhtaAfterCleanup = async () => {
  if (!selectedVakhtaForWorkers.value) return

  try {
    await $fetch(
      `http://localhost:3001/api/admin/vakhtas/${selectedVakhtaForWorkers.value.id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      }
    )

    showNotification(
      'Успех',
      `Вахта "${selectedVakhtaForWorkers.value.title}" удалена`,
      'success'
    )

    closeVakhtaWorkersModal()
    await refreshData()

  } catch (error) {
    console.error('Error deleting vakhta after cleanup:', error)
    showNotification('Ошибка', 'Не удалось удалить вахту', 'error')
  }
}

const viewBorovProfileFromWorker = (worker) => {
  // Используем существующий метод просмотра профиля
  viewBorovProfile({
    id: worker.borov_id,
    full_name: worker.full_name,
    email: worker.email,
    phone: worker.phone
  })
}

// Универсальный метод снятия всех работников с вахты
const universalRemoveWorkers = async (vakhta) => {
  if (!confirm(`Принудительно снять ВСЕХ работников с вахты "${vakhta.title}"? Это действие нельзя отменить.`)) {
    return;
  }

  try {
    const response = await $fetch(`http://localhost:3001/api/admin/vakhtas/${vakhta.id}/workers`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    showNotification('Успех', `Снято ${response.removed_count} работников`, 'success');
    await refreshData();
    closeVakhtaWorkersModal();

  } catch (error) {
    console.error('Universal remove workers error:', error);
    showNotification('Ошибка', 'Не удалось снять работников', 'error');
  }
}
const showBorovProfileModal = ref(false)
const selectedBorov = ref(null)
const loadingBorovProfile = ref(false)

const viewBorovProfile = async (borov) => {
  try {
    loadingBorovProfile.value = true
    selectedBorov.value = null
    showBorovProfileModal.value = true

    console.log('Loading profile for borov:', borov.id)

    const response = await $fetch(`http://localhost:3001/api/admin/borovs/${borov.id}/profile`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    selectedBorov.value = response
    console.log('Profile loaded successfully')
  } catch (error) {
    console.error('Error loading borov profile:', error)
    console.error('Error details:', error.data)
    showNotification('Ошибка', 'Не удалось загрузить профиль борова', 'error')
    closeBorovProfileModal()
  } finally {
    loadingBorovProfile.value = false
  }
}

const closeBorovProfileModal = () => {
  showBorovProfileModal.value = false
  selectedBorov.value = null
}
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()

// Data
const dashboardData = ref({
  stats: {},
  slons: [],
  promocodes: [],
  borovs: [],
  vakhtas: []
})

const activeTab = ref('slons')
const loading = ref(false)
const showCreateSlon = ref(false)
const showCreateVakhta = ref(false)
const showCreatePromo = ref(false)
const creatingSlon = ref(false)
const creatingVakhta = ref(false)
const creatingPromo = ref(false)
const lastUpdated = ref('')

// Новые данные для удаления
const showDeleteModal = ref(false)
const deleting = ref(false)
const deleteModal = ref({
  type: '',
  data: null,
  title: '',
  message: '',
  warning: ''
})

const vakhtasWithSpecialties = ref([])
const borovActivity = ref([])
const expandedVakhtas = ref([])
const showCreateSpecialtyModal = ref(false)
const selectedVakhta = ref(null)
const creatingSpecialty = ref(false)

const newSlon = ref({
  username: '',
  display_name: '',
  password: '',
  contact_email: '',
  contact_phone: ''
})

const newVakhta = ref({
  title: '',
  description: '',
  location: '',
  total_places: 10,
  start_date: '',
  end_date: '',
  requirements: '',
  conditions: ''
})

const newSpecialty = ref({
  title: '',
  description: '',
  requirements: '',
  total_places: 10,
  salary: 5000
})

const newPromo = ref({
  code: '',
  description: '',
  slon_id: ''
})

const notification = ref({
  show: false,
  title: '',
  message: '',
  type: 'success',
  icon: '✅'
})

// Tabs
const tabs = [
  { id: 'slons', name: 'Слоны', icon: '🐘' },
  { id: 'enterprises', name: 'Предприятия', icon: '🏗️' },
  { id: 'promocodes', name: 'Промокоды', icon: '🎫' },
  { id: 'borovs', name: 'Боровы', icon: '💪' },
  { id: 'activity', name: 'Активность', icon: '📊' }
]

// Computed
const totalStats = computed(() => dashboardData.value.stats || {})

const getTabCount = (tabId: string) => {
  switch (tabId) {
    case 'slons': return dashboardData.value.slons?.length || 0
    case 'enterprises': return vakhtasWithSpecialties.value?.length || 0
    case 'promocodes': return dashboardData.value.promocodes?.length || 0
    case 'borovs': return dashboardData.value.borovs?.length || 0
    case 'activity': return borovActivity.value?.length || 0
    default: return 0
  }
}

// В методе openDeleteModal добавить case для 'borov'
const openDeleteModal = (type: string, data: any) => {
  const modalConfig = {
    slon: {
      title: `Удаление Слона`,
      message: `Вы уверены, что хотите удалить слона "${data.display_name}"?`,
      warning: data.borovs_count > 0 ? `У этого слона есть ${data.borovs_count} зарегистрированных боровов. Удаление невозможно.` :
               data.promo_codes_count > 0 ? `У этого слона есть ${data.promo_codes_count} промокодов. Удаление невозможно.` : ''
    },
    vakhta: {
      title: `Удаление Предприятия`,
      message: `Вы уверены, что хотите удалить предприятие "${data.title}"?`,
      warning: data.current_workers > 0 ? `На предприятии работает ${data.current_workers} боровов. Удаление невозможно.` : ''
    },
    specialty: {
      title: `Удаление Специальности`,
      message: `Вы уверены, что хотите удалить специальность "${data.title}"?`,
      warning: data.current_workers > 0 ? `На этой специальности работает ${data.current_workers} боровов. Удаление невозможно.` : ''
    },
    promo: {
      title: `Удаление Промокода`,
      message: `Вы уверены, что хотите удалить промокод "${data.code}"?`,
      warning: data.borovs_count > 0 ? `Этот промокод использован ${data.borovs_count} раз. Удаление невозможно.` : ''
    },
    borov: {
      title: `Удаление Борова`,
      message: `Вы уверены, что хотите удалить борова "${data.full_name}"?`,
      warning: data.current_vakhta ? `Боров сейчас работает на вахте. Сначала снимите его с работы.` : ''
    }
  }

  const config = modalConfig[type]

  deleteModal.value = {
    type,
    data,
    title: config.title,
    message: config.message,
    warning: config.warning
  }

  // Показываем модальное окно только если нет предупреждений
  showDeleteModal.value = !config.warning
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deleting.value = false
  deleteModal.value = {
    type: '',
    data: null,
    title: '',
    message: '',
    warning: ''
  }
}

// В методе confirmDelete добавить case для 'borov'
const confirmDelete = async () => {
  try {
    deleting.value = true

    const { type, data } = deleteModal.value
    let endpoint = ''
    let successMessage = ''

    switch (type) {
      case 'slon':
        endpoint = `http://localhost:3001/api/admin/slons/${data.id}`
        successMessage = `Слон "${data.display_name}" успешно удален`
        break
      case 'vakhta':
        endpoint = `http://localhost:3001/api/admin/vakhtas/${data.id}`
        successMessage = `Предприятие "${data.title}" успешно удалено`
        break
      case 'specialty':
        endpoint = `http://localhost:3001/api/admin/specialties/${data.id}`
        successMessage = `Специальность "${data.title}" успешно удалена`
        break
      case 'promo':
        endpoint = `http://localhost:3001/api/admin/promocodes/${data.id}`
        successMessage = `Промокод "${data.code}" успешно удален`
        break
      case 'borov':
        endpoint = `http://localhost:3001/api/admin/borovs/${data.id}`
        successMessage = `Боров "${data.full_name}" успешно удален`
        break
    }

    const response = await $fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    showNotification('Успешное удаление', successMessage, 'success')
    closeDeleteModal()
    await refreshData()

  } catch (error: any) {
    console.error('Error deleting:', error)

    // Более информативные сообщения об ошибках
    let errorMessage = error.data?.error || 'Не удалось удалить'

    if (errorMessage.includes('foreign key constraint') || errorMessage.includes('violates foreign key')) {
      errorMessage = 'Нельзя удалить - есть связанные данные'
    } else if (errorMessage.includes('active work assignments')) {
      errorMessage = 'Нельзя удалить борова с активными заданиями. Сначала снимите его с вахты/специальности.'
    }

    showNotification('Ошибка удаления', errorMessage, 'error')
  } finally {
    deleting.value = false
  }
}

// Существующие методы
const loadAdminDashboard = async () => {
  try {
    loading.value = true

    const response = await $fetch('http://localhost:3001/api/admin/dashboard', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    dashboardData.value = response
    lastUpdated.value = new Date().toLocaleTimeString('ru-RU')

    await Promise.all([
      loadVakhtasWithSpecialties(),
      loadBorovActivity()
    ])

  } catch (error) {
    console.error('Error loading admin dashboard:', error)
    showNotification('Ошибка загрузки', 'Не удалось загрузить данные', 'error')
  } finally {
    loading.value = false
  }
}

// Загрузка предприятий со специальностями
const loadVakhtasWithSpecialties = async () => {
  try {
    const response = await $fetch('http://localhost:3001/api/admin/vakhtas-with-specialties', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    vakhtasWithSpecialties.value = response
  } catch (error) {
    console.error('Error loading vakhtas with specialties:', error)
  }
}

// Загрузка активности боровов
const loadBorovActivity = async () => {
  try {
    const response = await $fetch('http://localhost:3001/api/admin/activity/borovs', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    borovActivity.value = response
  } catch (error) {
    console.error('Error loading borov activity:', error)
  }
}

const refreshData = async () => {
  await loadAdminDashboard()
  showNotification('Данные обновлены', 'Все данные успешно обновлены', 'success')
}

const createSlon = async () => {
  try {
    creatingSlon.value = true

    await $fetch('http://localhost:3001/api/admin/slons', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: newSlon.value
    })

    showNotification('Слон создан', 'Новый слон успешно добавлен в систему', 'success')
    showCreateSlon.value = false
    resetNewSlon()
    await refreshData()
  } catch (error: any) {
    console.error('Error creating slon:', error)
    showNotification('Ошибка создания', error.data?.error || 'Не удалось создать слона', 'error')
  } finally {
    creatingSlon.value = false
  }
}

const createVakhta = async () => {
  try {
    creatingVakhta.value = true

    await $fetch('http://localhost:3001/api/admin/vakhtas', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: newVakhta.value
    })

    showNotification('Вахта создана', 'Новая вахта успешно создана', 'success')
    showCreateVakhta.value = false
    resetNewVakhta()
    await refreshData()
  } catch (error: any) {
    console.error('Error creating vakhta:', error)
    showNotification('Ошибка создания', error.data?.error || 'Не удалось создать вахту', 'error')
  } finally {
    creatingVakhta.value = false
  }
}

const createPromoCode = async () => {
  try {
    creatingPromo.value = true

    await $fetch('http://localhost:3001/api/admin/promocodes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: newPromo.value
    })

    showNotification('Промокод создан', 'Новый промокод успешно создан', 'success')
    showCreatePromo.value = false
    resetNewPromo()
    await refreshData()
  } catch (error: any) {
    console.error('Error creating promo code:', error)
    showNotification('Ошибка создания', error.data?.error || 'Не удалось создать промокод', 'error')
  } finally {
    creatingPromo.value = false
  }
}

// Переключение раскрытия предприятия
const toggleVakhtaExpansion = (vakhtaId: number) => {
  const index = expandedVakhtas.value.indexOf(vakhtaId)
  if (index > -1) {
    expandedVakhtas.value.splice(index, 1)
  } else {
    expandedVakhtas.value.push(vakhtaId)
  }
}

// Показать модальное окно создания специальности
const showCreateSpecialty = (vakhta: any) => {
  selectedVakhta.value = vakhta
  showCreateSpecialtyModal.value = true
}

// Закрыть модальное окно создания специальности
const closeCreateSpecialtyModal = () => {
  showCreateSpecialtyModal.value = false
  selectedVakhta.value = null
  resetNewSpecialty()
}

// Создание специальности
const createSpecialty = async () => {
  if (!selectedVakhta.value) return

  try {
    creatingSpecialty.value = true

    await $fetch('http://localhost:3001/api/admin/specialties', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: {
        ...newSpecialty.value,
        vakhta_id: selectedVakhta.value.id
      }
    })

    showNotification('Специальность создана', 'Новая специальность успешно добавлена', 'success')
    closeCreateSpecialtyModal()
    await loadVakhtasWithSpecialties()
  } catch (error: any) {
    showNotification('Ошибка создания', error.data?.error || 'Не удалось создать специальность', 'error')
  } finally {
    creatingSpecialty.value = false
  }
}

// Переключение статуса специальности
const toggleSpecialtyStatus = async (specialty: any) => {
  try {
    await $fetch(`http://localhost:3001/api/admin/specialties/${specialty.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: {
        ...specialty,
        is_active: !specialty.is_active
      }
    })

    showNotification(
      'Статус изменен',
      `Специальность "${specialty.title}" ${!specialty.is_active ? 'активирована' : 'деактивирована'}`,
      'success'
    )
    await loadVakhtasWithSpecialties()
  } catch (error: any) {
    showNotification('Ошибка', error.data?.error || 'Не удалось изменить статус', 'error')
  }
}

const toggleSlonStatus = async (slon: any) => {
  try {
    await $fetch(`http://localhost:3001/api/admin/slons/${slon.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: {
        ...slon,
        is_active: !slon.is_active
      }
    })

    showNotification(
      'Статус изменен',
      `Слон "${slon.display_name}" ${!slon.is_active ? 'активирован' : 'деактивирован'}`,
      'success'
    )
    await refreshData()
  } catch (error: any) {
    showNotification('Ошибка', error.data?.error || 'Не удалось изменить статус', 'error')
  }
}

const toggleVakhtaStatus = async (vakhta: any) => {
  try {
    await $fetch(`http://localhost:3001/api/admin/vakhtas/${vakhta.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: {
        ...vakhta,
        is_active: !vakhta.is_active
      }
    })

    showNotification(
      'Статус изменен',
      `Предприятие "${vakhta.title}" ${!vakhta.is_active ? 'активировано' : 'деактивировано'}`,
      'success'
    )
    await refreshData()
  } catch (error: any) {
    showNotification('Ошибка', error.data?.error || 'Не удалось изменить статус', 'error')
  }
}

const exportData = () => {
  showNotification('Экспорт', 'Функция экспорта в разработке', 'info')
}

// Вспомогательные функции для активности
const getActivityIcon = (status: string) => {
  const icons: any = {
    active: '✅',
    completed: '🏁',
    cancelled: '❌'
  }
  return icons[status] || '📝'
}

const getActivityText = (activity: any) => {
  const statusText: any = {
    active: 'записался на',
    completed: 'завершил',
    cancelled: 'отменил'
  }
  return `${activity.borov_name} ${statusText[activity.status] || 'обновил'} специальность "${activity.specialty_title}" на предприятии "${activity.vakhta_title}"`
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('ru-RU')
}

const formatSalary = (salary: number) => {
  return new Intl.NumberFormat('ru-RU').format(salary)
}

const editSpecialty = (specialty: any) => {
  // TODO: Реализовать редактирование специальности
  console.log('Edit specialty:', specialty)
  showNotification('Редактирование', 'Функция редактирования в разработке', 'info')
}

// Вспомогательная функция для обрезки текста
const truncateText = (text: string, length: number) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Reset functions
const resetNewSlon = () => {
  newSlon.value = {
    username: '',
    display_name: '',
    password: '',
    contact_email: '',
    contact_phone: ''
  }
}

const resetNewVakhta = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const in30Days = new Date()
  in30Days.setDate(in30Days.getDate() + 30)

  newVakhta.value = {
    title: '',
    description: '',
    location: '',
    total_places: 10,
    start_date: tomorrow.toISOString().split('T')[0],
    end_date: in30Days.toISOString().split('T')[0],
    requirements: '',
    conditions: ''
  }
}

const resetNewSpecialty = () => {
  newSpecialty.value = {
    title: '',
    description: '',
    requirements: '',
    total_places: 10,
    salary: 5000
  }
}

const resetNewPromo = () => {
  newPromo.value = {
    code: '',
    description: '',
    slon_id: ''
  }
}

// Utility functions
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const calculateAge = (birthDate: string) => {
  if (!birthDate) return '-'
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

const showNotification = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' }

  notification.value = {
    show: true,
    title,
    message,
    type,
    icon: icons[type]
  }

  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

// Lifecycle
onMounted(async () => {
  await loadAdminDashboard()
  resetNewVakhta() // Устанавливаем даты по умолчанию для вахты
})
</script>

<style scoped>

/* Добавить в стили */
.vakhta-workers-modal {
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
}

.vakhta-workers-content {
  padding: 20px;
}

.vakhta-info-section {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #007bff;
}

.vakhta-info-section h4 {
  margin: 0 0 8px 0;
  color: #333;
}

.location, .workers-count {
  margin: 5px 0;
  color: #666;
}

.workers-section {
  margin-bottom: 25px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h5 {
  margin: 0;
  color: #333;
}

.loading-workers, .no-workers {
  text-align: center;
  padding: 40px;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
}

.workers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.worker-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.worker-card:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.worker-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.worker-avatar {
  font-size: 2rem;
}

.worker-details strong {
  display: block;
  margin-bottom: 4px;
  color: #333;
}

.worker-contacts {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 4px;
}

.worker-contacts span {
  font-size: 0.8rem;
  color: #666;
}

.worker-meta small {
  color: #888;
}

.worker-actions {
  display: flex;
  gap: 8px;
}

.actions-section {
  background: #d4edda;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #c3e6cb;
}

.success-message {
  text-align: center;
  margin-bottom: 15px;
}

.success-message p {
  margin: 5px 0;
  color: #155724;
}

.hint {
  font-size: 0.9rem;
  opacity: 0.8;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

/* Адаптивность */
@media (max-width: 768px) {
  .worker-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .worker-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .section-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
.admin-dashboard {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px;
}

.dashboard-header {
  background: white;
  border-radius: 15px;
  padding: 25px 30px;
  margin-bottom: 25px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.8rem;
}

.header-content p {
  margin: 0;
  color: #666;
  font-size: 1.1rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.last-updated {
  color: #666;
  font-size: 0.9rem;
}

.stats-overview {
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-info h3 {
  margin: 0 0 5px 0;
  font-size: 2rem;
  color: #333;
}

.stat-info p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 0.9rem;
}

.stat-trend {
  font-size: 0.8rem;
  font-weight: 500;
  color: #28a745;
}

.quick-actions-section {
  background: white;
  border-radius: 15px;
  padding: 25px 30px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.quick-actions-section h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.4rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.action-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

.action-card:hover {
  border-color: #007bff;
  background: #f8f9ff;
  transform: translateY(-2px);
}

.action-icon {
  font-size: 2rem;
}

.action-text {
  font-weight: 600;
  color: #333;
}

.content-tabs {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  overflow: hidden;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 25px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  color: #666;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tab-button.active {
  color: #007bff;
  border-bottom-color: #007bff;
  background: white;
}

.tab-count {
  background: #e9ecef;
  color: #495057;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tab-button.active .tab-count {
  background: #007bff;
  color: white;
}

.tab-content {
  padding: 30px;
}

.tab-pane {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.table-container {
  background: #f8f9fa;
  border-radius: 10px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.data-table th,
.data-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  font-size: 1.5rem;
}

.user-details strong {
  display: block;
  margin-bottom: 4px;
  color: #333;
}

.user-details small {
  color: #666;
  font-size: 0.8rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.contact-item {
  font-size: 0.9rem;
  color: #666;
}

.stats-info {
  display: flex;
  gap: 15px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-weight: bold;
  color: #007bff;
  font-size: 1.1rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.promo-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.enterprises-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.enterprise-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  overflow: hidden;
}

.enterprise-header {
  padding: 25px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #f8f9fa;
  transition: background-color 0.3s ease;
}

.enterprise-header:hover {
  background: #e9ecef;
}

.enterprise-main {
  flex: 1;
}

.enterprise-title {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.enterprise-title h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.location, .dates, .workers {
  margin: 5px 0;
  color: #666;
  font-size: 0.9rem;
}

.enterprise-actions {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.specialties-section {
  border-top: 1px solid #e9ecef;
  padding: 25px;
  background: #fafafa;
}

.specialties-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.specialties-header h4 {
  margin: 0;
  color: #333;
}

.specialties-count {
  background: #007bff;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.no-specialties {
  text-align: center;
  padding: 40px;
  color: #666;
  background: white;
  border-radius: 10px;
  border: 2px dashed #dee2e6;
}

.specialties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 15px;
}

.specialty-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-left: 4px solid #20c997;
}

.specialty-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
}

.specialty-info {
  flex: 1;
}

.specialty-info h5 {
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
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
}

.salary {
  color: #28a745;
  font-weight: 600;
  font-size: 0.9rem;
}

.places, .requirements {
  color: #666;
  font-size: 0.8rem;
}

.specialty-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  min-width: 140px;
}

.promocodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.promocode-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #e9ecef;
}

.promo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.promo-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.usage-badge {
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
}

.promo-info p {
  margin: 8px 0;
  color: #666;
  font-size: 0.9rem;
}

.promo-actions {
  margin-top: 15px;
}

.promo-code {
  display: block;
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 4px;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #007bff;
}

.activity-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.activity-header strong {
  color: #333;
  font-size: 1rem;
}

.activity-time {
  color: #666;
  font-size: 0.8rem;
}

.activity-text {
  margin: 0 0 10px 0;
  color: #555;
  line-height: 1.4;
}

.activity-details {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.detail {
  font-size: 0.8rem;
  color: #666;
}

/* Buttons */
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

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #218838;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-warning:hover:not(:disabled) {
  background: #e0a800;
}

.btn-danger {
  background: #dc3545;
  color: white;
  border: none;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline {
  background: transparent;
  border: 1px solid #6c757d;
  color: #6c757d;
}

.btn-outline:hover {
  background: #6c757d;
  color: white;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-disabled {
  background: #6c757d;
  color: white;
  cursor: not-allowed;
  opacity: 0.6;
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
  border-left: 4px solid;
  max-width: 400px;
}

.notification.success {
  border-left-color: #28a745;
}

.notification.error {
  border-left-color: #dc3545;
}

.notification.info {
  border-left-color: #17a2b8;
}

.notification-content {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.notification-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.notification-text strong {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.notification-text p {
  margin: 0;
  color: #666;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: #6c757d;
  position: absolute;
  top: 10px;
  right: 10px;
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

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.delete-modal {
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
  min-height: 60px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

/* Новые стили для модального окна удаления */
.delete-content {
  padding: 30px;
  text-align: center;
}

.delete-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.8;
}

.delete-text h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.3rem;
}

.delete-text p {
  margin: 0 0 20px 0;
  color: #666;
  line-height: 1.5;
}

.delete-warning {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
  text-align: left;
}

.warning-icon {
  margin-right: 8px;
  font-size: 1.1rem;
}

.delete-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid #e9ecef;
}

/* Анимация загрузки */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn.loading {
  pointer-events: none;
}

/* Адаптивность */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .tabs-header {
    flex-direction: column;
  }

  .tab-button {
    justify-content: center;
  }

  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .enterprise-header {
    flex-direction: column;
    gap: 15px;
  }

  .enterprise-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .specialties-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .specialties-grid {
    grid-template-columns: 1fr;
  }

  .specialty-header {
    flex-direction: column;
  }

  .specialty-actions {
    width: 100%;
    flex-direction: row;
    justify-content: flex-end;
    min-width: auto;
  }

  .promocodes-grid {
    grid-template-columns: 1fr;
  }

  .data-table {
    font-size: 0.8rem;
  }

  .data-table th,
  .data-table td {
    padding: 8px;
  }

  .activity-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .activity-details {
    flex-direction: column;
    gap: 5px;
  }

  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .promo-header-actions {
    flex-direction: column;
    gap: 5px;
  }

  .enterprise-actions {
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .delete-actions {
    flex-direction: column;
  }
}
/* Добавить в стили */
.borov-profile-modal {
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.borov-profile-content {
  padding: 20px;
}

.profile-section {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.profile-section:last-child {
  border-bottom: none;
}

.profile-section h5 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1rem;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar-placeholder {
  font-size: 3rem;
}

.user-info h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.user-meta {
  margin: 2px 0;
  color: #666;
  font-size: 0.9rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #555;
}

.contact-icon {
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
}

.current-work {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.work-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.work-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.work-details strong {
  display: block;
  margin-bottom: 4px;
  color: #333;
}

.work-details p {
  margin: 0 0 4px 0;
  color: #666;
}

.work-details small {
  color: #888;
}

.profile-field {
  margin-bottom: 15px;
}

.profile-field label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.profile-field p {
  margin: 0;
  color: #555;
  line-height: 1.4;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.profile-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
}

.detail-item label {
  font-weight: 500;
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.status-indicator {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-indicator.yes {
  background: #d4edda;
  color: #155724;
}

.status-indicator.no {
  background: #f8d7da;
  color: #721c24;
}

.no-profile {
  text-align: center;
  padding: 30px;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    gap: 15px;
  }

  .profile-details-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>