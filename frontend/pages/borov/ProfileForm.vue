<template>
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
              <span>{{ profile.full_name }}</span>
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span>{{ profile.email }}</span>
            </div>
            <div class="info-item">
              <label>Телефон:</label>
              <span>{{ profile.phone }}</span>
            </div>
          </div>
        </div>

        <!-- Профессиональная информация -->
        <div class="profile-section" v-if="profileData">
          <h3 class="section-title">Профессиональная информация</h3>
          <div class="info-grid">
            <div class="info-item" v-if="profileData.specialization">
              <label>Специализация:</label>
              <div class="tags">
                <span v-for="spec in profileData.specialization" :key="spec" class="tag">
                  {{ spec }}
                </span>
              </div>
            </div>
            <div class="info-item" v-if="profileData.experience_years">
              <label>Опыт работы:</label>
              <span>{{ profileData.experience_years }} лет</span>
            </div>
            <div class="info-item" v-if="profileData.driver_license_category">
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
        <div class="profile-section" v-if="profileData?.skills">
          <h3 class="section-title">Навыки</h3>
          <div class="tags">
            <span v-for="skill in profileData.skills" :key="skill" class="tag">
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Языки -->
        <div class="profile-section" v-if="profileData?.languages">
          <h3 class="section-title">Знание языков</h3>
          <div class="info-grid">
            <div v-for="(level, lang) in profileData.languages" :key="lang" class="info-item">
              <label>{{ lang }}:</label>
              <span class="language-level">{{ level }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Режим редактирования -->
    <div v-else class="profile-edit">
      <div class="profile-header">
        <h2 class="profile-title">Редактирование профиля</h2>
        <div class="edit-actions">
          <button @click="cancelEditing" class="btn btn-secondary">
            Отмена
          </button>
          <button @click="saveProfile" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
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
            ></textarea>
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
                v-model="editForm.experience_years"
                min="0"
                max="50"
                class="form-input"
              >
            </div>
          </div>
          <div class="form-group">
            <label>Описание опыта</label>
            <textarea
              v-model="editForm.experience_description"
              rows="3"
              placeholder="Подробно опишите ваш профессиональный опыт..."
              class="form-textarea"
            ></textarea>
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
            <div v-for="(lang, index) in editForm.languages" :key="index" class="language-row">
              <select v-model="lang.language" class="form-select">
                <option value="">Выберите язык</option>
                <option v-for="language in languages" :key="language" :value="language">
                  {{ language }}
                </option>
              </select>
              <select v-model="lang.level" class="form-select">
                <option value="">Уровень</option>
                <option value="beginner">Начальный</option>
                <option value="intermediate">Средний</option>
                <option value="advanced">Продвинутый</option>
                <option value="native">Родной</option>
              </select>
              <button type="button" @click="removeLanguage(index)" class="btn-remove">
                ×
              </button>
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
            <div class="tags-input">
              <div v-for="(skill, index) in editForm.skills" :key="index" class="tag">
                {{ skill }}
                <button type="button" @click="removeSkill(index)" class="tag-remove">
                  ×
                </button>
              </div>
              <input
                v-model="newSkill"
                @keydown.enter.prevent="addSkill"
                placeholder="Введите навык и нажмите Enter"
                class="tag-input"
              >
            </div>
          </div>
        </div>

        <!-- Дополнительная информация -->
        <div class="form-section">
          <h3 class="section-title">Дополнительная информация</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="editForm.has_car" class="checkbox-input">
                <span class="checkbox-custom"></span>
                Есть личный автомобиль
              </label>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="editForm.has_tools" class="checkbox-input">
                <span class="checkbox-custom"></span>
                Есть собственные инструменты
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>Ожидания по зарплате (руб/час)</label>
            <input
              type="number"
              v-model="editForm.salary_expectations"
              class="form-input"
              placeholder="например, 500"
            >
          </div>
        </div>
      </form>
    </div>

    <!-- Уведомления -->
    <div v-if="message" class="success-message">
      {{ message }}
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Profile {
  full_name: string
  email: string
  phone: string
  profile?: {
    about_me: string
    specialization: string[]
    experience_years: number
    experience_description: string
    driver_license_category: string[]
    languages: Record<string, string>
    skills: string[]
    education: string
    certifications: string[]
    preferred_work_types: string[]
    work_radius: number
    has_car: boolean
    has_tools: boolean
    salary_expectations: number
  }
}

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

// Списки для выбора
const specializations = [
  { value: 'construction', label: 'Строительные работы' },
  { value: 'renovation', label: 'Ремонтные работы' },
  { value: 'electrical', label: 'Электромонтажные работы' },
  { value: 'plumbing', label: 'Сантехнические работы' },
  { value: 'carpentry', label: 'Плотницкие работы' },
  { value: 'painting', label: 'Малярные работы' },
  { value: 'welding', label: 'Сварочные работы' },
  { value: 'landscaping', label: 'Благоустройство территории' }
]

const licenseCategories = ['A', 'B', 'C', 'D', 'E']
const languages = ['Русский', 'Английский', 'Немецкий', 'Французский', 'Китайский', 'Другой']

// Форма редактирования
const editForm = reactive({
  about_me: '',
  specialization: [] as string[],
  experience_years: 0,
  experience_description: '',
  driver_license_category: [] as string[],
  languages: [] as Array<{language: string, level: string}>,
  skills: [] as string[],
  education: '',
  certifications: [] as string[],
  preferred_work_types: [] as string[],
  work_radius: 50,
  has_car: false,
  has_tools: false,
  salary_expectations: 0
})

const profileData = computed(() => profile.value.profile)

// Загрузка профиля
const loadProfile = async () => {
  try {
    const data = await $fetch('/api/borov/profile')
    profile.value = data

    if (data.profile) {
      // Преобразуем языки из объекта в массив для формы
      const languagesArray = data.profile.languages ?
        Object.entries(data.profile.languages).map(([language, level]) => ({
          language,
          level: level as string
        })) : []

      Object.assign(editForm, {
        ...data.profile,
        languages: languagesArray.length ? languagesArray : [{ language: '', level: '' }]
      })
    }
  } catch (err) {
    error.value = 'Ошибка загрузки профиля'
  }
}

// Начало редактирования
const startEditing = () => {
  isEditing.value = true
}

// Отмена редактирования
const cancelEditing = () => {
  isEditing.value = false
  loadProfile() // Перезагружаем исходные данные
}

// Сохранение профиля
const saveProfile = async () => {
  try {
    loading.value = true
    error.value = ''

    // Преобразуем языки обратно в объект
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

    await $fetch('/api/borov/profile', {
      method: 'PUT',
      body: payload
    })

    message.value = 'Профиль успешно обновлен'
    isEditing.value = false
    await loadProfile() // Обновляем данные

    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (err: any) {
    error.value = err.data?.error || 'Ошибка сохранения профиля'
  } finally {
    loading.value = false
  }
}

// Управление навыками
const addSkill = () => {
  if (newSkill.value.trim() && !editForm.skills.includes(newSkill.value.trim())) {
    editForm.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

const removeSkill = (index: number) => {
  editForm.skills.splice(index, 1)
}

// Управление языками
const addLanguage = () => {
  editForm.languages.push({ language: '', level: '' })
}

const removeLanguage = (index: number) => {
  editForm.languages.splice(index, 1)
}

// Загружаем профиль при монтировании
onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.profile-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  color: #0a0a0a;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-edit {
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.btn-outline {
  background: transparent;
  color: #d4af37;
  border: 1px solid #d4af37;
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
}

.about-text {
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
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
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.05);
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
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-input:checked + .checkbox-custom {
  background: #d4af37;
  border-color: #d4af37;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #0a0a0a;
  font-size: 12px;
  font-weight: bold;
}

/* Языки */
.language-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.btn-remove {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 4px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
}

.tag-input {
  flex: 1;
  background: none;
  border: none;
  color: #fff;
  outline: none;
  min-width: 150px;
}

/* Уведомления */
.success-message {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
  padding: 15px 20px;
  border-radius: 8px;
  border: 1px solid rgba(40, 167, 69, 0.3);
  margin-top: 20px;
}

.error-message {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  padding: 15px 20px;
  border-radius: 8px;
  border: 1px solid rgba(220, 53, 69, 0.3);
  margin-top: 20px;
}

.edit-actions {
  display: flex;
  gap: 12px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .profile-container {
    padding: 15px;
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
  }
}
</style>