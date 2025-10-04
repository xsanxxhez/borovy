<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>🎫 Создание промокода</h2>
        <button @click="closeModal" class="close-btn">✕</button>
      </div>

      <form @submit.prevent="createPromoCode" class="modal-form">
        <div class="form-group">
          <label>Промокод *</label>
          <input
            v-model="form.code"
            type="text"
            required
            placeholder="Например: SUMMER2024"
            class="form-input"
          >
          <small>Только латинские буквы, цифры и дефисы</small>
        </div>

        <div class="form-group">
          <label>Описание</label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Описание промокода для чего он предназначен..."
            class="form-input"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Выберите Слона *</label>
          <select v-model="form.slon_id" required class="form-input">
            <option value="">Выберите слона</option>
            <option v-for="slon in availableSlons" :key="slon.id" :value="slon.id">
              {{ slon.display_name }} (@{{ slon.username }})
            </option>
          </select>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-actions">
          <button type="button" @click="closeModal" class="btn btn-outline">
            Отмена
          </button>
          <button type="submit" :disabled="loading" class="btn btn-primary">
            <span v-if="loading" class="btn-spinner"></span>
            {{ loading ? 'Создание...' : 'Создать промокод' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const emit = defineEmits(['close', 'saved'])

const form = reactive({
  code: '',
  description: '',
  slon_id: ''
})

const availableSlons = ref([])
const loading = ref(false)
const error = ref('')

const loadSlons = async () => {
  try {
    const response = await $fetch('http://localhost:3001/api/admin/slons', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    availableSlons.value = response
  } catch (error) {
    console.error('Error loading slons:', error)
  }
}

const createPromoCode = async () => {
  try {
    loading.value = true
    error.value = ''

    await $fetch('http://localhost:3001/api/admin/promocodes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      body: form
    })

    emit('saved')
    closeModal()

  } catch (err: any) {
    console.error('Error creating promo code:', err)
    error.value = err.data?.error || 'Ошибка при создании промокода'
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  emit('close')
  Object.assign(form, {
    code: '',
    description: '',
    slon_id: ''
  })
  error.value = ''
}

onMounted(() => {
  loadSlons()
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

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
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

.modal-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
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

.form-group small {
  color: #6c757d;
  font-size: 12px;
  display: block;
  margin-top: 5px;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 12px 15px;
  border-radius: 6px;
  border: 1px solid #f5c6cb;
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s;
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

.btn-primary:disabled {
  background: #6c757d;
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
  .modal-content {
    margin: 10px;
  }

  .modal-form {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>