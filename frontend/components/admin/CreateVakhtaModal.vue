<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content large" @click.stop>
      <div class="modal-header">
        <h2>🏗️ Создание нового Предприятия (Вахты)</h2>
        <button @click="closeModal" class="close-btn">✕</button>
      </div>

      <div class="modal-tabs">
        <button
          :class="['tab-button', { active: activeTab === 'enterprise' }]"
          @click="activeTab = 'enterprise'"
        >
          📋 Информация о предприятии
        </button>
        <button
          :class="['tab-button', { active: activeTab === 'specialties' }]"
          @click="activeTab = 'specialties'"
        >
          👷 Специальности
          <span class="tab-count">{{ specialties.length }}</span>
        </button>
      </div>

      <div class="modal-body">
        <!-- Вкладка информации о предприятии -->
        <div v-if="activeTab === 'enterprise'" class="tab-content">
          <form class="enterprise-form">
            <div class="form-section">
              <h3>Основная информация</h3>
              <div class="form-grid">
                <div class="form-group full-width">
                  <label>Название предприятия *</label>
                  <input
                    v-model="enterpriseForm.title"
                    type="text"
                    required
                    placeholder="Например: Складской комплекс №5"
                    class="form-input"
                  >
                </div>

                <div class="form-group full-width">
                  <label>Описание предприятия</label>
                  <textarea
                    v-model="enterpriseForm.description"
                    rows="3"
                    placeholder="Подробное описание предприятия, условий работы..."
                    class="form-input"
                  ></textarea>
                </div>

                <div class="form-group full-width">
                  <label>Местоположение *</label>
                  <input
                    v-model="enterpriseForm.location"
                    type="text"
                    required
                    placeholder="Город, адрес, ориентиры"
                    class="form-input"
                  >
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Период работы</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label>Дата начала *</label>
                  <input
                    v-model="enterpriseForm.start_date"
                    type="date"
                    required
                    class="form-input"
                  >
                </div>

                <div class="form-group">
                  <label>Дата окончания *</label>
                  <input
                    v-model="enterpriseForm.end_date"
                    type="date"
                    required
                    class="form-input"
                  >
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Общие условия</h3>
              <div class="form-grid">
                <div class="form-group full-width">
                  <label>Условия проживания и питания</label>
                  <textarea
                    v-model="enterpriseForm.conditions"
                    rows="2"
                    placeholder="Общежитие, питание, транспорт и т.д."
                    class="form-input"
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Вкладка специальностей -->
        <div v-if="activeTab === 'specialties'" class="tab-content">
          <div class="specialties-header">
            <h3>Управление специальностями</h3>
            <button @click="addSpecialty" class="btn btn-primary btn-sm">
              ➕ Добавить специальность
            </button>
          </div>

          <div class="specialties-list">
            <div
              v-for="(specialty, index) in specialties"
              :key="index"
              class="specialty-card"
            >
              <div class="specialty-header">
                <h4>Специальность #{{ index + 1 }}</h4>
                <button
                  @click="removeSpecialty(index)"
                  class="btn-icon danger"
                  title="Удалить специальность"
                >
                  🗑️
                </button>
              </div>

              <div class="specialty-form">
                <div class="form-grid compact">
                  <div class="form-group">
                    <label>Название специальности *</label>
                    <input
                      v-model="specialty.title"
                      type="text"
                      required
                      placeholder="Например: Разнорабочий"
                      class="form-input"
                    >
                  </div>

                  <div class="form-group">
                    <label>Количество мест *</label>
                    <input
                      v-model="specialty.total_places"
                      type="number"
                      required
                      min="1"
                      max="100"
                      class="form-input"
                    >
                  </div>

                  <div class="form-group">
                    <label>Зарплата в день (руб)</label>
                    <input
                      v-model="specialty.salary"
                      type="number"
                      placeholder="5000"
                      class="form-input"
                    >
                  </div>

                  <div class="form-group full-width">
                    <label>Описание работы</label>
                    <textarea
                      v-model="specialty.description"
                      rows="2"
                      placeholder="Обязанности, задачи..."
                      class="form-input"
                    ></textarea>
                  </div>

                  <div class="form-group full-width">
                    <label>Требования</label>
                    <textarea
                      v-model="specialty.requirements"
                      rows="2"
                      placeholder="Навыки, опыт, физическая форма..."
                      class="form-input"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="specialties.length === 0" class="empty-specialties">
            <div class="empty-icon">👷</div>
            <h4>Нет добавленных специальностей</h4>
            <p>Добавьте хотя бы одну специальность для предприятия</p>
            <button @click="addSpecialty" class="btn btn-primary">
              ➕ Добавить первую специальность
            </button>
          </div>
        </div>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="modal-footer">
        <div class="footer-actions">
          <button
            v-if="activeTab === 'specialties'"
            @click="activeTab = 'enterprise'"
            class="btn btn-outline"
          >
            ← Назад к информации
          </button>

          <button
            v-if="activeTab === 'enterprise'"
            @click="validateEnterpriseAndProceed"
            class="btn btn-primary"
          >
            Далее: Специальности →
          </button>

          <button
            v-if="activeTab === 'specialties' && specialties.length > 0"
            @click="createVakhtaWithSpecialties"
            :disabled="loading"
            class="btn btn-success"
          >
            <span v-if="loading" class="btn-spinner"></span>
            {{ loading ? 'Создание...' : '✅ Создать Предприятие' }}
          </button>
        </div>

        <button
          v-if="activeTab === 'enterprise'"
          @click="closeModal"
          class="btn btn-outline"
        >
          Отмена
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const emit = defineEmits(['close', 'saved'])

const activeTab = ref('enterprise')
const loading = ref(false)
const error = ref('')

// Форма предприятия
const enterpriseForm = reactive({
  title: '',
  description: '',
  location: '',
  start_date: '',
  end_date: '',
  conditions: ''
})

// Список специальностей
const specialties = ref<Array<{
  title: string
  description: string
  requirements: string
  total_places: number
  salary: number
}>>([])

// Добавление новой специальности
const addSpecialty = () => {
  specialties.value.push({
    title: '',
    description: '',
    requirements: '',
    total_places: 10,
    salary: 5000
  })
}

// Удаление специальности
const removeSpecialty = (index: number) => {
  specialties.value.splice(index, 1)
}

// Валидация формы предприятия и переход к специальностям
const validateEnterpriseAndProceed = () => {
  if (!enterpriseForm.title.trim()) {
    error.value = 'Введите название предприятия'
    return
  }

  if (!enterpriseForm.location.trim()) {
    error.value = 'Введите местоположение'
    return
  }

  if (!enterpriseForm.start_date || !enterpriseForm.end_date) {
    error.value = 'Укажите даты начала и окончания'
    return
  }

  const startDate = new Date(enterpriseForm.start_date)
  const endDate = new Date(enterpriseForm.end_date)

  if (endDate <= startDate) {
    error.value = 'Дата окончания должна быть после даты начала'
    return
  }

  error.value = ''
  activeTab.value = 'specialties'
}

// Создание предприятия со специальностями
const createVakhtaWithSpecialties = async () => {
  // Валидация специальностей
  for (const [index, specialty] of specialties.value.entries()) {
    if (!specialty.title.trim()) {
      error.value = `Введите название для специальности #${index + 1}`
      return
    }

    if (specialty.total_places < 1) {
      error.value = `Укажите количество мест для специальности "${specialty.title}"`
      return
    }
  }

  try {
    loading.value = true
    error.value = ''

    // Сначала создаем предприятие (вахту)
    const vakhtaResponse = await $fetch('http://localhost:3001/api/admin/vakhtas', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      body: {
        title: enterpriseForm.title,
        description: enterpriseForm.description,
        location: enterpriseForm.location,
        start_date: enterpriseForm.start_date,
        end_date: enterpriseForm.end_date,
        conditions: enterpriseForm.conditions,
        total_places: specialties.value.reduce((sum, spec) => sum + spec.total_places, 0)
      }
    })

    console.log('Vakhta created:', vakhtaResponse)

    // Создаем специальности для этого предприятия
    const specialtyPromises = specialties.value.map(specialty =>
      $fetch('http://localhost:3001/api/specialties', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        },
        body: {
          vakhta_id: vakhtaResponse.id,
          title: specialty.title,
          description: specialty.description,
          requirements: specialty.requirements,
          total_places: specialty.total_places,
          salary: specialty.salary || null
        }
      })
    )

    await Promise.all(specialtyPromises)
    console.log('All specialties created successfully')

    emit('saved')
    closeModal()

  } catch (err: any) {
    console.error('Error creating vakhta:', err)
    error.value = err.data?.error || 'Ошибка при создании предприятия'
  } finally {
    loading.value = false
  }
}


const closeModal = () => {
  emit('close')
  // Сброс формы
  Object.assign(enterpriseForm, {
    title: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    conditions: ''
  })
  specialties.value = []
  activeTab.value = 'enterprise'
  error.value = ''
}

// Устанавливаем даты по умолчанию
onMounted(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  enterpriseForm.start_date = tomorrow.toISOString().split('T')[0]

  const in30Days = new Date()
  in30Days.setDate(in30Days.getDate() + 30)
  enterpriseForm.end_date = in30Days.toISOString().split('T')[0]
})
</script>

<style scoped>
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

.modal-content.large {
  max-width: 800px;
  max-height: 90vh;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.4rem;
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

.modal-tabs {
  display: flex;
  border-bottom: 1px solid #e9ecef;
  padding: 0 30px;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 15px 20px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  color: #666;
  font-weight: 500;
  transition: all 0.3s;
}

.tab-button.active {
  color: #007bff;
  border-bottom-color: #007bff;
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

.modal-body {
  padding: 30px;
  max-height: 400px;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 30px;
}

.form-section h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-grid.compact {
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

.specialties-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.specialties-header h3 {
  margin: 0;
  color: #333;
}

.specialties-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.specialty-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #007bff;
}

.specialty-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.specialty-header h4 {
  margin: 0;
  color: #333;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: background 0.3s;
}

.btn-icon.danger:hover {
  background: #f8d7da;
}

.empty-specialties {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  opacity: 0.7;
}

.empty-specialties h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.empty-specialties p {
  margin: 0 0 20px 0;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 12px 15px;
  border-radius: 6px;
  border: 1px solid #f5c6cb;
  margin: 0 30px;
}

.modal-footer {
  padding: 20px 30px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-1px);
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
  padding: 8px 16px;
  font-size: 13px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-spinner {
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

@media (max-width: 768px) {
  .modal-content.large {
    margin: 10px;
  }

  .modal-body {
    padding: 20px;
    max-height: 300px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .specialties-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .modal-footer {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .footer-actions {
    flex-direction: column;
  }
}
</style>