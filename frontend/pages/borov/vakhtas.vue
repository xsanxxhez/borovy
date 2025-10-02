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
      <div class="filter-group">
        <label>Сортировка:</label>
        <select v-model="sortBy" class="filter-select">
          <option value="start_date">По дате начала</option>
          <option value="title">По названию</option>
          <option value="location">По местоположению</option>
        </select>
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
          <p class="places">👥 {{ vakhta.current_workers }}/{{ vakhta.total_places }} занято</p>

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
const sortBy = ref('start_date')
const message = ref('')
const messageType = ref('success')
const hasActiveVakhta = ref(false)

// Загрузка доступных вахт
const loadVakhtas = async () => {
  try {
    loading.value = true
    const response = await $fetch('http://localhost:3001/api/borov/vakhtas/available', {
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

  // Сортировка
  filtered.sort((a: any, b: any) => {
    if (sortBy.value === 'start_date') {
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    }
    return a[sortBy.value].localeCompare(b[sortBy.value])
  })

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

<style scoped>
.vakhtas-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  color: #333;
  margin-bottom: 10px;
}

.page-header p {
  color: #666;
  font-size: 18px;
}

.filters-section {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-weight: 500;
  color: #333;
}

.filter-input, .filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.no-vakhtas {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-vakhtas-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.vakhtas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 25px;
}

.vakhta-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 25px;
  border-left: 4px solid #20c997;
  transition: transform 0.2s, box-shadow 0.2s;
}

.vakhta-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.vakhta-card.full {
  border-left-color: #dc3545;
  opacity: 0.7;
}

.vakhta-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.vakhta-header h3 {
  margin: 0;
  color: #333;
  flex: 1;
}

.places-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: #20c997;
  color: white;
}

.places-badge.few {
  background: #fd7e14;
}

.places-badge.full {
  background: #dc3545;
}

.vakhta-details {
  margin-bottom: 20px;
}

.vakhta-details p {
  margin: 8px 0;
  color: #555;
}

.requirements, .conditions {
  margin: 10px 0;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
  font-size: 14px;
}

.vakhta-actions {
  text-align: center;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  width: 100%;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.btn-disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 5px;
  color: white;
  z-index: 1000;
}

.message.success {
  background: #28a745;
}

.message.error {
  background: #dc3545;
}
</style>