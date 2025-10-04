<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>➕ Создание нового Слона</h2>
        <button @click="closeModal" class="close-btn">✕</button>
      </div>

      <form @submit.prevent="createSlon" class="modal-form">
        <div class="form-grid">
          <div class="form-group">
            <label>Логин *</label>
            <input
              v-model="form.username"
              type="text"
              required
              placeholder="Уникальное имя пользователя"
              class="form-input"
            >
            <small>Латиница, без пробелов</small>
          </div>

          <div class="form-group">
            <label>Отображаемое имя *</label>
            <input
              v-model="form.display_name"
              type="text"
              required
              placeholder="Имя для отображения"
              class="form-input"
            >
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              v-model="form.contact_email"
              type="email"
              placeholder="email@example.com"
              class="form-input"
            >
          </div>

          <div class="form-group">
            <label>Телефон</label>
            <input
              v-model="form.contact_phone"
              type="tel"
              placeholder="+7 900 123-45-67"
              class="form-input"
            >
          </div>

          <div class="form-group">
            <label>Пароль *</label>
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="Минимум 6 символов"
              class="form-input"
              minlength="6"
            >
            <small>Пароль для входа в систему</small>
          </div>

          <div class="form-group">
            <label>Подтверждение пароля *</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              required
              placeholder="Повторите пароль"
              class="form-input"
            >
          </div>
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
            {{ loading ? 'Создание...' : 'Создать Слона' }}
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
  username: '',
  display_name: '',
  contact_email: '',
  contact_phone: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')

const createSlon = async () => {
  // Валидация
  if (form.password !== form.confirmPassword) {
    error.value = 'Пароли не совпадают'
    return
  }

  if (form.password.length < 6) {
    error.value = 'Пароль должен быть не менее 6 символов'
    return
  }

  try {
    loading.value = true
    error.value = ''

    await $fetch('http://localhost:3001/api/admin/slons', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      body: {
        username: form.username,
        display_name: form.display_name,
        contact_email: form.contact_email,
        contact_phone: form.contact_phone,
        password: form.password
      }
    })

    emit('saved')
    closeModal()

  } catch (err: any) {
    console.error('Error creating slon:', err)
    error.value = err.data?.error || 'Ошибка при создании Слона'
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  emit('close')
  // Сброс формы
  Object.assign(form, {
    username: '',
    display_name: '',
    contact_email: '',
    contact_phone: '',
    password: '',
    confirmPassword: ''
  })
  error.value = ''
}
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
  max-width: 600px;
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group:nth-child(5),
.form-group:nth-child(6) {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-input {
  padding: 12px;
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

.form-group small {
  color: #6c757d;
  font-size: 12px;
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
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
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
  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    margin: 10px;
  }

  .modal-form {
    padding: 20px;
  }
}
</style>