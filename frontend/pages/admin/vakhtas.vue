<!-- pages/admin/vakhtas.vue - исправленная версия -->
<template>
  <div class="vakhtas-page">
    <div class="page-header">
      <h1>Управление вахтами</h1>
      <p>Создание и редактирование рабочих вахт для боровов</p>
    </div>

    <!-- Кнопка создания новой вахты -->
    <div class="actions-bar">
      <button @click="showCreateForm = true" class="btn btn-primary">
        ➕ Создать новую вахту
      </button>
    </div>

    <!-- Форма создания вахты -->
    <div v-if="showCreateForm" class="form-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Создать новую вахту</h2>
          <button @click="closeForm" class="close-btn">✕</button>
        </div>

        <form @submit.prevent="createVakhta" class="vakhta-form">
          <div class="form-grid">
            <div class="form-group">
              <label>Название вахты *</label>
              <input v-model="form.title" type="text" required placeholder="Например: Разнорабочий на склад">
            </div>

            <div class="form-group">
              <label>Местоположение *</label>
              <input v-model="form.location" type="text" required placeholder="Например: Москва, склад №1">
            </div>

            <div class="form-group">
              <label>Количество мест *</label>
              <input v-model="form.total_places" type="number" min="1" max="100" required>
            </div>

            <div class="form-group">
              <label>Дата начала *</label>
              <input v-model="form.start_date" type="date" required>
            </div>

            <div class="form-group">
              <label>Дата окончания *</label>
              <input v-model="form.end_date" type="date" required>
            </div>

            <div class="form-group full-width">
              <label>Описание</label>
              <textarea v-model="form.description" rows="3" placeholder="Подробное описание вахты..."></textarea>
            </div>

            <div class="form-group full-width">
              <label>Требования к работнику</label>
              <textarea v-model="form.requirements" rows="2" placeholder="Навыки, опыт, физическая форма..."></textarea>
            </div>

            <div class="form-group full-width">
              <label>Условия работы</label>
              <textarea v-model="form.conditions" rows="2" placeholder="Условия труда, проживание, питание..."></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeForm" class="btn btn-outline">Отмена</button>
            <button type="submit" :disabled="saving" class="btn btn-primary">
              {{ saving ? 'Создание...' : 'Создать вахту' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Список вахт -->
    <div v-if="loading" class="loading">Загрузка вахт...</div>

    <div v-else-if="vakhtas.length === 0" class="empty-state">
      <div class="empty-icon">🏕️</div>
      <h3>Нет созданных вахт</h3>
      <p>Создайте первую вахту, чтобы боровы могли на нее записываться</p>
    </div>

    <div v-else class="vakhtas-list">
      <div class="vakhta-card" v-for="vakhta in vakhtas" :key="vakhta.id">
        <div class="vakhta-header">
          <div class="vakhta-info">
            <h3>{{ vakhta.title }}</h3>
            <p class="location">📍 {{ vakhta.location }}</p>
            <p class="dates">📅 {{ formatDate(vakhta.start_date) }} - {{ formatDate(vakhta.end_date) }}</p>
          </div>

          <div class="vakhta-stats">
            <div class="stat-badge">
              {{ vakhta.current_workers || 0 }}/{{ vakhta.total_places }}
            </div>
            <div class="status-badge" :class="{ active: vakhta.is_active }">
              {{ vakhta.is_active ? 'Активна' : 'Неактивна' }}
            </div>
          </div>
        </div>

        <div class="vakhta-details">
          <div v-if="vakhta.description" class="detail">
            <strong>Описание:</strong> {{ vakhta.description }}
          </div>
          <div v-if="vakhta.requirements" class="detail">
            <strong>Требования:</strong> {{ vakhta.requirements }}
          </div>
          <div v-if="vakhta.conditions" class="detail">
            <strong>Условия:</strong> {{ vakhta.conditions }}
          </div>
        </div>

        <div class="vakhta-actions">
          <button
            @click="toggleVakhtaStatus(vakhta)"
            :class="['btn', 'btn-sm', vakhta.is_active ? 'btn-warning' : 'btn-success']"
          >
            {{ vakhta.is_active ? '⏸️ Деактивировать' : '▶️ Активировать' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Уведомления -->
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const vakhtas = ref([])
const loading = ref(false)
const saving = ref(false)
const showCreateForm = ref(false)
const message = ref('')
const messageType = ref('success')

const form = reactive({
  title: '',
  description: '',
  location: '',
  total_places: 10,
  start_date: '',
  end_date: '',
  requirements: '',
  conditions: ''
})

// Загрузка всех вахт
const loadVakhtas = async () => {
  try {
    loading.value = true
    const response = await $fetch('http://localhost:3001/api/admin/vakhtas', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    vakhtas.value = response
  } catch (error) {
    console.error('Error loading vakhtas:', error)
    showMessage('Ошибка загрузки вахт', 'error')
  } finally {
    loading.value = false
  }
}

// Создание вахты
const createVakhta = async () => {
  try {
    saving.value = true

    await $fetch('http://localhost:3001/api/admin/vakhtas', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: form
    })

    showMessage('Вахта успешно создана!', 'success')
    closeForm()
    await loadVakhtas()

  } catch (error: any) {
    console.error('Error creating vakhta:', error)
    showMessage(error.data?.error || 'Ошибка создания вахты', 'error')
  } finally {
    saving.value = false
  }
}

// Переключение статуса вахты
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
    showMessage(`Вахта ${!vakhta.is_active ? 'активирована' : 'деактивирована'}!`, 'success')
    await loadVakhtas()
  } catch (error: any) {
    console.error('Error toggling vakhta status:', error)
    showMessage(error.data?.error || 'Ошибка изменения статуса', 'error')
  }
}

// Закрытие формы
const closeForm = () => {
  showCreateForm.value = false
  Object.assign(form, {
    title: '',
    description: '',
    location: '',
    total_places: 10,
    start_date: '',
    end_date: '',
    requirements: '',
    conditions: ''
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const showMessage = (text: string, type: string) => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

onMounted(() => {
  loadVakhtas()

  // Устанавливаем даты по умолчанию
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  form.start_date = tomorrow.toISOString().split('T')[0]

  const in30Days = new Date()
  in30Days.setDate(in30Days.getDate() + 30)
  form.end_date = in30Days.toISOString().split('T')[0]
})
</script>