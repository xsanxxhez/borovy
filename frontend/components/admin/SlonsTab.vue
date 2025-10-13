[file name]: components/admin/SlonsTab.vue
[file content begin]
<template>
  <div class="slons-tab">
    <div class="section-header">
      <h2>🐘 Управление Слонами</h2>
      <button @click="$emit('create-slon')" class="btn btn-primary">
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
          <tr v-for="slon in slons" :key="slon.id">
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
                >
                  {{ slon.is_active ? '⏸️' : '▶️' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  slons: any[]
}>()

const emit = defineEmits(['refresh'])

const toggleSlonStatus = async (slon: any) => {
  try {
    await $fetch(`http://localhost:3001/api/admin/slons/${slon.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${useAuthStore().token}`,
        'Content-Type': 'application/json'
      },
      body: {
        ...slon,
        is_active: !slon.is_active
      }
    })

    emit('refresh')
  } catch (error: any) {
    console.error('Error toggling slon status:', error)
  }
}
</script>

<style scoped>
/* Стили такие же как в основном файле */
</style>
[file content end]