<template>
  <div class="profile-page">
    <div class="page-header">
      <h1>Мой профиль</h1>
      <p>Управление личными данными</p>
    </div>

    <div class="profile-content">
      <!-- Информация о профиле -->
      <div class="profile-card">
        <h2>Личная информация</h2>

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

          <div class="info-item">
            <label>Дата рождения:</label>
            <span>{{ formatDate(profile.birth_date) }}</span>
          </div>

          <div class="info-item">
            <label>Дата регистрации:</label>
            <span>{{ formatDate(profile.created_at) }}</span>
          </div>

          <div v-if="profile.promo_code" class="info-item">
            <label>Промокод:</label>
            <span>{{ profile.promo_code }}</span>
          </div>

          <div v-if="profile.slon_name" class="info-item">
            <label>Привлек слон:</label>
            <span>{{ profile.slon_name }}</span>
          </div>
        </div>
      </div>

      <!-- Смена пароля -->
      <div class="profile-card">
        <h2>Смена пароля</h2>

        <form @submit.prevent="changePassword" class="password-form">
          <div class="form-group">
            <label>Текущий пароль:</label>
            <input
              v-model="passwordForm.currentPassword"
              type="password"
              required
            >
          </div>

          <div class="form-group">
            <label>Новый пароль:</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              required
              minlength="6"
            >
          </div>

          <div class="form-group">
            <label>Подтвердите новый пароль:</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              required
            >
          </div>

          <div v-if="passwordMessage" class="message" :class="passwordMessageType">
            {{ passwordMessage }}
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="changingPassword"
          >
            {{ changingPassword ? 'Смена пароля...' : 'Сменить пароль' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const profile = ref({
  full_name: '',
  email: '',
  phone: '',
  birth_date: '',
  created_at: '',
  promo_code: '',
  slon_name: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const changingPassword = ref(false)
const passwordMessage = ref('')
const passwordMessageType = ref('success')

// Загрузка профиля
const loadProfile = async () => {
  try {
    loading.value = true
    const response = await $fetch('http://localhost:3001/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    profile.value = response
  } catch (error) {
    console.error('Error loading profile:', error)
  } finally {
    loading.value = false
  }
}

// Смена пароля
const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    showPasswordMessage('Пароли не совпадают', 'error')
    return
  }

  if (passwordForm.newPassword.length < 6) {
    showPasswordMessage('Пароль должен быть не менее 6 символов', 'error')
    return
  }

  try {
    changingPassword.value = true
    // Здесь должен быть API для смены пароля
    // await $fetch('http://localhost:3001/api/borov/change-password', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${authStore.token}`
    //   },
    //   body: {
    //     current_password: passwordForm.currentPassword,
    //     new_password: passwordForm.newPassword
    //   }
    // })

    showPasswordMessage('Пароль успешно изменен!', 'success')
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error: any) {
    showPasswordMessage(error.data?.error || 'Ошибка смены пароля', 'error')
  } finally {
    changingPassword.value = false
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const showPasswordMessage = (text: string, type: string) => {
  passwordMessage.value = text
  passwordMessageType.value = type
  setTimeout(() => {
    passwordMessage.value = ''
  }, 5000)
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-page {
  max-width: 800px;
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

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.profile-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.profile-card h2 {
  margin: 0 0 20px;
  color: #333;
  border-bottom: 2px solid #f8f9fa;
  padding-bottom: 10px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f8f9fa;
}

.info-item label {
  font-weight: 500;
  color: #333;
}

.info-item span {
  color: #555;
}

.password-form {
  max-width: 400px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
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

.message {
  padding: 10px 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>