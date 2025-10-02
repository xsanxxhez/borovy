<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Borovy</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Имя пользователя</label>
          <input
            v-model="form.username"
            type="text"
            class="form-input"
            placeholder="Введите имя пользователя"
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
      </form>

      <div class="test-credentials">
        <h4>Тестовые данные:</h4>
        <p><strong>Админ:</strong> admin / admin123</p>
        <p><strong>Слон:</strong> slon1 / slon123</p>
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

    authStore.setAuth(response.token, response.user)

    switch (response.user.role) {
      case 'admin':
        await router.push('/admin')
        break
      case 'slon':
        await router.push('/slon')
        break
      case 'borov':
        await router.push('/borov')
        break
      default:
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
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.btn {
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-bottom: 15px;
  padding: 10px;
  background: #f8d7da;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
}

.test-credentials {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 5px;
}

.test-credentials h4 {
  margin-bottom: 10px;
  color: #333;
}

.test-credentials p {
  margin: 5px 0;
  color: #666;
}
</style>