[file name]: components/admin/EnterprisesTab.vue
[file content begin]
<template>
  <div class="enterprises-tab">
    <div class="section-header">
      <h2>🏗️ Управление Предприятиями и Специальностями</h2>
      <button @click="$emit('create-vakhta')" class="btn btn-primary">
        ➕ Новое Предприятие
      </button>
    </div>

    <!-- Предприятия с специальностями -->
    <div class="enterprises-container">
      <div
        v-for="vakhta in vakhtas"
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

          <div class="enterprise-actions">
            <button
              @click.stop="$emit('create-specialty', vakhta)"
              class="btn btn-success btn-sm"
            >
              ➕ Специальность
            </button>
            <button
              @click.stop="toggleVakhtaStatus(vakhta)"
              :class="['btn', 'btn-sm', vakhta.is_active ? 'btn-warning' : 'btn-success']"
            >
              {{ vakhta.is_active ? '⏸️ Стоп' : '▶️ Старт' }}
            </button>
            <button
              @click.stop="toggleVakhtaExpansion(vakhta.id)"
              class="btn btn-outline btn-sm"
            >
              {{ expandedVakhtas.includes(vakhta.id) ? '▲' : '▼' }}
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
            <button @click="$emit('create-specialty', vakhta)" class="btn btn-primary btn-sm">
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
                  >
                    ✏️
                  </button>
                  <button
                    @click="toggleSpecialtyStatus(specialty)"
                    :class="['btn', 'btn-sm', specialty.is_active ? 'btn-warning' : 'btn-success']"
                  >
                    {{ specialty.is_active ? '⏸️' : '▶️' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  vakhtas: any[]
}>()

const emit = defineEmits(['refresh', 'create-specialty'])

const expandedVakhtas = ref<number[]>([])

const toggleVakhtaExpansion = (vakhtaId: number) => {
  const index = expandedVakhtas.value.indexOf(vakhtaId)
  if (index > -1) {
    expandedVakhtas.value.splice(index, 1)
  } else {
    expandedVakhtas.value.push(vakhtaId)
  }
}

const toggleVakhtaStatus = async (vakhta: any) => {
  try {
    await $fetch(`http://localhost:3001/api/admin/vakhtas/${vakhta.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${useAuthStore().token}`,
        'Content-Type': 'application/json'
      },
      body: {
        ...vakhta,
        is_active: !vakhta.is_active
      }
    })

    emit('refresh')
  } catch (error: any) {
    console.error('Error toggling vakhta status:', error)
  }
}

const toggleSpecialtyStatus = async (specialty: any) => {
  try {
    await $fetch(`http://localhost:3001/api/admin/specialties/${specialty.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${useAuthStore().token}`,
        'Content-Type': 'application/json'
      },
      body: {
        ...specialty,
        is_active: !specialty.is_active
      }
    })

    emit('refresh')
  } catch (error: any) {
    console.error('Error toggling specialty status:', error)
  }
}

const editSpecialty = (specialty: any) => {
  // TODO: Реализовать редактирование
  console.log('Edit specialty:', specialty)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const formatSalary = (salary: number) => {
  return new Intl.NumberFormat('ru-RU').format(salary)
}

const truncateText = (text: string, length: number) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}
</script>

<style scoped>
/* Стили такие же как в основном файле */
</style>
[file content end]