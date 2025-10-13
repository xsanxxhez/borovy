<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- Режим просмотра -->
      <div v-if="!isEditing" class="profile-view">
        <div class="profile-header">
          <h2 class="profile-title">Мой профиль</h2>
          <button @click="startEditing" class="btn btn-edit">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M13.5 1.5L16.5 4.5M14.25 3.75L7.5 10.5L4.5 11.25L5.25 8.25L12 1.5L14.25 3.75Z"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Изменить информацию
          </button>
        </div>

        <div class="profile-grid">
          <!-- Основная информация -->
          <div class="profile-section">
            <h3 class="section-title">Основная информация</h3>
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
            <h3 class="section-title">Профессиональная информация</h3>
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
            <h3 class="section-title">О себе</h3>
            <p class="about-text">{{ profileData.about_me }}</p>
          </div>

          <!-- Навыки -->
          <div class="profile-section" v-if="hasSkills">
            <h3 class="section-title">Навыки</h3>
            <div class="tags">
              <span v-for="skill in profileData.skills" :key="skill" class="tag">
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- Языки -->
          <div class="profile-section" v-if="hasLanguages">
            <h3 class="section-title">Знание языков</h3>
            <div class="info-grid">
              <div v-for="(level, lang) in profileData.languages" :key="lang" class="info-item">
                <label>{{ lang }}:</label>
                <span class="language-level">{{ getLanguageLevel(level) }}</span>
              </div>
            </div>
          </div>

          <!-- Дополнительная информация -->
          <div class="profile-section" v-if="hasAdditionalInfo">
            <h3 class="section-title">Дополнительная информация</h3>
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
            <div class="empty-icon">👤</div>
            <h3>Профиль не заполнен</h3>
            <p>Заполните информацию о себе, чтобы работодатели могли вас найти</p>
            <button @click="startEditing" class="btn btn-primary">
              Заполнить профиль
            </button>
          </div>
        </div>
      </div>

      <!-- Режим редактирования -->
      <div v-else class="profile-edit">
        <div class="profile-header">
          <h2 class="profile-title">Редактирование профиля</h2>
          <div class="edit-actions">
            <button @click="cancelEditing" class="btn btn-secondary" :disabled="loading">
              Отмена
            </button>
            <button @click="saveProfile" class="btn btn-primary" :disabled="loading || !hasChanges">
              {{ loading ? 'Сохранение...' : 'Сохранить изменения' }}
            </button>
          </div>
        </div>

        <form @submit.prevent="saveProfile" class="profile-form">
          <!-- О себе -->
          <div class="form-section">
            <h3 class="section-title">О себе</h3>
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
            <h3 class="section-title">Специализация</h3>
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
            <h3 class="section-title">Опыт работы</h3>
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
            <h3 class="section-title">Водительские права</h3>
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
            <h3 class="section-title">Знание языков</h3>
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
                + Добавить язык
              </button>
            </div>
          </div>

          <!-- Навыки -->
          <div class="form-section">
            <h3 class="section-title">Профессиональные навыки</h3>
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
            <h3 class="section-title">Дополнительная информация</h3>
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

      <!-- Уведомления -->
      <Transition name="slide-fade">
        <div v-if="message" class="notification success-message">
          <span>{{ message }}</span>
          <button @click="clearMessage" class="notification-close">×</button>
        </div>
      </Transition>
      <Transition name="slide-fade">
        <div v-if="error" class="notification error-message">
          <span>{{ error }}</span>
          <button @click="clearError" class="notification-close">×</button>
        </div>
      </Transition>
    </div>
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
  return originalEditForm.value !== JSON.stringify(editForm)
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

const clearMessage = () => {
  message.value = ''
}

const clearError = () => {
  error.value = ''
}

// Lifecycle
onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #0f0f0f;
  padding: 20px;
}

.profile-container {
  max-width: 1000px;
  margin: 0 auto;
  background: #1a1a1a;
  border-radius: 16px;
  padding: 30px;
  border: 1px solid #333;
  position: relative;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #333;
}

.profile-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  color: #1a1a1a;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
}

.btn-edit {
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.btn-edit:hover {
  background: rgba(212, 175, 55, 0.2);
}

.btn-outline {
  background: transparent;
  color: #d4af37;
  border: 1px solid #d4af37;
}

.btn-outline:hover {
  background: rgba(212, 175, 55, 0.1);
}

.profile-grid {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.profile-section {
  background: rgba(255, 255, 255, 0.05);
  padding: 25px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #d4af37;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: rgba(212, 175, 55, 0.2);
  color: #d4af37;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid rgba(212, 175, 55, 0.3);
  display: flex;
  align-items: center;
  gap: 5px;
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
}

.about-text {
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

.status-yes {
  color: #28a745;
  font-weight: 600;
}

.status-no {
  color: #dc3545;
  font-weight: 600;
}

.salary {
  color: #d4af37;
  font-weight: 600;
}

.language-level {
  color: #d4af37;
  font-weight: 500;
}

/* Стили формы */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-section {
  background: rgba(255, 255, 255, 0.05);
  padding: 25px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
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
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.1);
}

.form-input.error,
.form-textarea.error,
.form-select.error {
  border-color: #dc3545;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

/* Чекбоксы */
.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px 0;
  transition: opacity 0.3s ease;
}

.checkbox-label.large {
  align-items: flex-start;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.checkbox-label.large:hover {
  background: rgba(255, 255, 255, 0.08);
}

.checkbox-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.checkbox-title {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.checkbox-description {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}





.checkbox-label.large .checkbox-custom {
  margin-top: 2px;
}




/* Языки */
.languages-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.language-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 10px;
  align-items: start;
}

.btn-remove {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 4px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 12px;
}

.btn-remove:hover:not(:disabled) {
  background: rgba(220, 53, 69, 0.3);
}

.btn-remove:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Ввод тегов */
.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  min-height: 50px;
  align-items: center;
  cursor: text;
}

.tag-input {
  flex: 1;
  background: none;
  border: none;
  color: #fff;
  outline: none;
  min-width: 150px;
  font-size: 0.95rem;
}

.tag-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* Уведомления */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 20px;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 400px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.success-message {
  background: rgba(40, 167, 69, 0.9);
  color: #fff;
  border: 1px solid rgba(40, 167, 69, 0.3);
}

.error-message {
  background: rgba(220, 53, 69, 0.9);
  color: #fff;
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.notification-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  margin-top: 4px;
}

.form-hint {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 6px;
}

/* Пустое состояние */
.empty-state {
  text-align: center;
  padding: 60px 40px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 2px dashed rgba(255, 255, 255, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #d4af37;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 30px;
  line-height: 1.5;
}

.edit-actions {
  display: flex;
  gap: 12px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .profile-container {
    padding: 20px;
  }

  .profile-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .edit-actions {
    width: 100%;
    justify-content: space-between;
  }

  .btn {
    padding: 10px 16px;
    font-size: 0.9rem;
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
    gap: 8px;
  }

  .notification {
    left: 20px;
    right: 20px;
    max-width: none;
  }

  .profile-title {
    font-size: 1.7rem;
  }
}

@media (max-width: 480px) {
  .profile-page {
    padding: 10px;
  }

  .profile-container {
    padding: 15px;
  }

  .profile-section {
    padding: 20px;
  }

  .form-section {
    padding: 20px;
  }

  .empty-state {
    padding: 40px 20px;
  }

  .empty-icon {
    font-size: 3rem;
  }
}
</style>