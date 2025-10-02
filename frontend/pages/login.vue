<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Borovy</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Имя пользователя или Email</label>
          <input
            v-model="form.username"
            type="text"
            class="form-input"
            placeholder="Введите имя пользователя или email"
            required
          >
        </div>

        <div class="form-group">
          <label class="form-label">Пароль</label>
          <input
            v-model="form.password"
            type="password"
            class="form-input"
            placeholder="Введите пароль"
            required
          >
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="loading"
        >
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>

        <div class="register-link">
          Нет аккаунта? <nuxt-link to="/register">Зарегистрируйтесь как Боров</nuxt-link>
        </div>
      </form>

      <div class="test-credentials">
        <h4>Тестовые данные:</h4>
        <p><strong>Админ:</strong> admin / admin123</p>
        <p><strong>Слон:</strong> slon1 / slon123</p>
        <p><small>Для Борова - сначала регистрация через промокод</small></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    // Используем прямой URL к бэкенду на порту 3001
    const response = await $fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      body: form
    })

    // Добавим логирование для отладки
    console.log('Login response:', response)
    console.log('User role:', response.user.role)
    console.log('User data:', response.user)

    authStore.setAuth(response.token, response.user)

    // Проверим что роль правильно определяется
    switch (response.user.role) {
      case 'admin':
        console.log('Redirecting to admin')
        await router.push('/admin')
        break
      case 'slon':
        console.log('Redirecting to slon')
        await router.push('/slon')
        break
      case 'borov':
        console.log('Redirecting to borov')
        await router.push('/borov')
        break
      default:
        console.log('Unknown role, redirecting to home')
        await router.push('/')
    }
  } catch (err: any) {
    error.value = err.data?.error || 'Ошибка входа'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
}

.form-group {
  margin-bottom: 15px;
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

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

.test-credentials {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.test-credentials h4 {
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
}

.test-credentials p {
  margin: 8px 0;
  color: #555;
  font-size: 14px;
}

.test-credentials small {
  color: #6c757d;
  font-style: italic;
}
</style>