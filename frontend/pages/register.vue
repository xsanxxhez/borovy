<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="register-title">Регистрация Борова</h1>
      <p class="register-subtitle">Заполните форму для создания аккаунта</p>

      <form @submit.prevent="handleRegister">
        <!-- Промокод -->
        <div class="form-group">
          <label class="form-label">Промокод *</label>
          <input
            v-model="form.promo_code"
            type="text"
            class="form-input"
            placeholder="Введите промокод от Слона"
            required
          >
          <small class="form-help">Промокод можно получить у менеджера (Слона)</small>
        </div>

        <!-- Личная информация -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">ФИО *</label>
            <input
              v-model="form.full_name"
              type="text"
              class="form-input"
              placeholder="Иванов Иван Иванович"
              required
            >
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Email *</label>
            <input
              v-model="form.email"
              type="email"
              class="form-input"
              placeholder="ivanov@example.com"
              required
            >
          </div>

          <div class="form-group">
            <label class="form-label">Телефон *</label>
            <input
              v-model="form.phone"
              type="tel"
              class="form-input"
              placeholder="+7 900 123-45-67"
              required
            >
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Дата рождения *</label>
            <input
              v-model="form.birth_date"
              type="date"
              class="form-input"
              required
            >
          </div>

          <div class="form-group">
            <label class="form-label">Пароль *</label>
            <input
              v-model="form.password"
              type="password"
              class="form-input"
              placeholder="Не менее 6 символов"
              required
              minlength="6"
            >
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Подтвердите пароль *</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            class="form-input"
            placeholder="Повторите пароль"
            required
          >
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="message" class="success-message">
          {{ message }}
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="loading"
        >
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>

        <div class="login-link">
          Уже есть аккаунт? <nuxt-link to="/login">Войдите</nuxt-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const router = useRouter()

const form = reactive({
  promo_code: '',
  full_name: '',
  email: '',
  phone: '',
  birth_date: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const message = ref('')

const handleRegister = async () => {
  // Валидация
  if (form.password !== form.confirmPassword) {
    error.value = 'Пароли не совпадают'
    return
  }

  if (form.password.length < 6) {
    error.value = 'Пароль должен быть не менее 6 символов'
    return
  }

  // Проверка возраста (18+)
  const birthDate = new Date(form.birth_date)
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  if (age < 18) {
    error.value = 'Регистрация доступна только с 18 лет'
    return
  }

  try {
    loading.value = true
    error.value = ''

    const response = await $fetch('http://localhost:3001/api/borov/register', {
      method: 'POST',
      body: {
        promo_code: form.promo_code,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        birth_date: form.birth_date,
        password: form.password
      }
    })

    message.value = 'Регистрация успешна! Вы будете перенаправлены на страницу входа.'

    // Редирект на логин через 3 секунды
    setTimeout(() => {
      router.push('/login')
    }, 3000)

  } catch (err: any) {
    console.error('Registration error:', err)
    error.value = err.data?.error || 'Ошибка регистрации. Проверьте введенные данные.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 500px;
}

.register-title {
  text-align: center;
  margin-bottom: 10px;
  color: #333;
  font-size: 24px;
}

.register-subtitle {
  text-align: center;
  margin-bottom: 30px;
  color: #666;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #007bff;
  outline: none;
}

.form-help {
  display: block;
  margin-top: 5px;
  color: #666;
  font-size: 12px;
}

.btn {
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  margin-top: 10px;
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

.error-message {
  color: #dc3545;
  margin: 15px 0;
  padding: 10px;
  background: #f8d7da;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
}

.success-message {
  color: #155724;
  margin: 15px 0;
  padding: 10px;
  background: #d4edda;
  border-radius: 4px;
  border: 1px solid #c3e6cb;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .register-card {
    padding: 20px;
  }
}
</style>