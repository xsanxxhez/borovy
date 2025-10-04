<!-- pages/borov/vakhtas.vue - исправленная версия -->
<template>
  <div class="vakhtas-page">
    <div class="page-header">
      <h1>Доступные вахты</h1>
      <p>Выберите подходящую вахту и запишитесь на работу</p>
    </div>

    <!-- Фильтры -->
    <div class="filters-section">
      <div class="filter-group">
        <label>Поиск:</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Название вахты или местоположение..."
          class="filter-input"
        >
      </div>
    </div>

    <!-- Список вахт -->
    <div v-if="loading" class="loading">Загрузка вахт...</div>

    <div v-else-if="filteredVakhtas.length === 0" class="no-vakhtas">
      <div class="no-vakhtas-icon">🏕️</div>
      <h3>Нет доступных вахт</h3>
      <p>В данный момент нет доступных вахт для записи</p>
    </div>

    <div v-else class="vakhtas-grid">
      <div
        v-for="vakhta in filteredVakhtas"
        :key="vakhta.id"
        class="vakhta-card"
        :class="{ 'full': vakhta.free_places <= 0 }"
      >
        <div class="vakhta-header">
          <h3>{{ vakhta.title }}</h3>
          <div class="vakhta-meta">
            <span class="places-badge" :class="{ 'few': vakhta.free_places > 0 && vakhta.free_places <= 3, 'full': vakhta.free_places <= 0 }">
              {{ vakhta.free_places > 0 ? `${vakhta.free_places} мест` : 'Заполнена' }}
            </span>
          </div>
        </div>

        <div class="vakhta-details">
          <p class="location">📍 {{ vakhta.location }}</p>
          <p class="dates">📅 {{ formatDate(vakhta.start_date) }} - {{ formatDate(vakhta.end_date) }}</p>
          <p class="places">👥 {{ vakhta.current_workers || 0 }}/{{ vakhta.total_places }} занято</p>

          <div v-if="vakhta.requirements" class="requirements">
            <strong>Требования:</strong> {{ vakhta.requirements }}
          </div>

          <div v-if="vakhta.conditions" class="conditions">
            <strong>Условия:</strong> {{ vakhta.conditions }}
          </div>
        </div>

        <div class="vakhta-actions">
          <button
            v-if="vakhta.free_places > 0 && !hasActiveVakhta"
            @click="joinVakhta(vakhta.id)"
            :disabled="joiningVakhta === vakhta.id"
            class="btn btn-primary"
          >
            {{ joiningVakhta === vakhta.id ? 'Записываем...' : 'Записаться' }}
          </button>

          <button v-else-if="hasActiveVakhta" disabled class="btn btn-disabled">
            У вас уже есть активная вахта
          </button>

          <button v-else disabled class="btn btn-disabled">
            Нет свободных мест
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
const joiningVakhta = ref(null)
const searchQuery = ref('')
const message = ref('')
const messageType = ref('success')
const hasActiveVakhta = ref(false)

// Загрузка доступных вахт
const loadVakhtas = async () => {
  try {
    loading.value = true
    const response = await $fetch('http://localhost:3001/api/vakhta', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    vakhtas.value = response

    // Проверяем есть ли активная вахта
    const myVakhtas = await $fetch('http://localhost:3001/api/borov/vakhtas/my', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    hasActiveVakhta.value = myVakhtas.some((v: any) => v.status === 'active')
  } catch (error) {
    console.error('Error loading vakhtas:', error)
    showMessage('Ошибка загрузки вахт', 'error')
  } finally {
    loading.value = false
  }
}

// Запись на вахту
const joinVakhta = async (vakhtaId: number) => {
  try {
    joiningVakhta.value = vakhtaId
    await $fetch('http://localhost:3001/api/borov/vakhtas/join', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      body: {
        vakhta_id: vakhtaId
      }
    })

    showMessage('Успешно записались на вахту!', 'success')
    await loadVakhtas() // Перезагружаем список
  } catch (error: any) {
    console.error('Error joining vakhta:', error)
    showMessage(error.data?.error || 'Ошибка записи на вахту', 'error')
  } finally {
    joiningVakhta.value = null
  }
}

// Фильтрация вахт
const filteredVakhtas = computed(() => {
  let filtered = vakhtas.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((v: any) =>
      v.title.toLowerCase().includes(query) ||
      v.location.toLowerCase().includes(query)
    )
  }

  return filtered
})

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
})
</script>