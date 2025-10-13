<template>
  <div class="auth-container">
    <!-- Улучшенный анимированный фон -->
    <div class="auth-background">
      <div class="parallax-layer layer-1"></div>
      <div class="parallax-layer layer-2"></div>
      <div class="parallax-layer layer-3"></div>
      <div class="particles-container" id="particles-js"></div>
      <div class="gradient-overlay"></div>
    </div>

    <div class="auth-content">
      <!-- Улучшенный заголовок -->
      <div class="auth-header">
        <div class="logo">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7V12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12V7L12 2Z" fill="currentColor"/>
              <path d="M12 12L16 10V14C16 15.1 15.1 16 14 16H10C8.9 16 8 15.1 8 14V10L12 12Z" fill="#0a0a0a"/>
            </svg>
          </div>
          <h1 class="logo-text">BOROVY</h1>
        </div>
        <div class="auth-divider">
          <div class="divider-line"></div>
          <div class="divider-dot"></div>
          <div class="divider-dot"></div>
          <div class="divider-dot"></div>
          <div class="divider-line"></div>
        </div>
        <p class="auth-subtitle">Профессиональная экосистема для вахтовиков</p>
      </div>

      <!-- Карточка формы с улучшенным дизайном -->
      <div class="auth-card">
        <div class="card-inner">
          <div class="card-front">
            <div class="card-header">
              <h2 class="card-title">Вход в систему</h2>
              <div class="card-decoration">
                <div class="decoration-circle"></div>
                <div class="decoration-circle"></div>
              </div>
            </div>

            <form @submit.prevent="handleLogin" class="auth-form">
              <div class="form-group">
                <div class="input-container" :class="{ 'input-focused': usernameFocused, 'input-filled': form.username }">
                  <input
                    v-model="form.username"
                    @focus="usernameFocused = true"
                    @blur="usernameFocused = false"
                    type="text"
                    class="form-input"
                    required
                  >
                  <label class="input-label">
                    <span class="label-text">Имя пользователя или Email</span>
                    <span class="required-star">*</span>
                  </label>
                  <div class="input-underline"></div>
                  <div class="input-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 10C11.6569 10 13 8.65685 13 7C13 5.34315 11.6569 4 10 4C8.34315 4 7 5.34315 7 7C7 8.65685 8.34315 10 10 10Z" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M15 16V15C15 13.3431 13.6569 12 12 12H8C6.34315 12 5 13.3431 5 15V16" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <div class="input-container" :class="{ 'input-focused': passwordFocused, 'input-filled': form.password }">
                  <input
                    v-model="form.password"
                    @focus="passwordFocused = true"
                    @blur="passwordFocused = false"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-input"
                    required
                  >
                  <label class="input-label">
                    <span class="label-text">Пароль</span>
                    <span class="required-star">*</span>
                  </label>
                  <div class="input-underline"></div>
                  <div class="input-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 8.33333H15.8333C16.2754 8.33333 16.6993 8.50893 17.0118 8.82149C17.3244 9.13405 17.5 9.55797 17.5 10V16.6667C17.5 17.1087 17.3244 17.5326 17.0118 17.8452C16.6993 18.1577 16.2754 18.3333 15.8333 18.3333H4.16667C3.72464 18.3333 3.30072 18.1577 2.98816 17.8452C2.67559 17.5326 2.5 17.1087 2.5 16.6667V10C2.5 9.55797 2.67559 9.13405 2.98816 8.82149C3.30072 8.50893 3.72464 8.33333 4.16667 8.33333H5V6.66667C5 5.34058 5.52678 4.06881 6.46447 3.13112C7.40215 2.19344 8.67392 1.66667 10 1.66667C11.3261 1.66667 12.5979 2.19344 13.5355 3.13112C14.4732 4.06881 15 5.34058 15 6.66667V8.33333Z" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                  </div>
                  <button
                    type="button"
                    class="password-toggle"
                    @click="showPassword = !showPassword"
                    :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
                  >
                    <svg v-if="showPassword" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.5 2.5L17.5 17.5M8.156 8.156C7.813 8.499 7.5 9.12 7.5 10C7.5 11.381 8.619 12.5 10 12.5C10.88 12.5 11.501 12.187 11.844 11.844M5.605 5.605C4.238 6.446 3.059 7.736 2.5 10C3.44 13.07 6.364 15 10 15C11.464 15 12.819 14.606 14 14M12.738 9.354C12.53 8.231 11.769 7.47 10.646 7.262" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 4C13.636 4 16.56 6.126 17.5 9C16.56 11.874 13.636 14 10 14C6.364 14 3.44 11.874 2.5 9C3.44 6.126 6.364 4 10 4Z" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M10 11C11.1046 11 12 10.1046 12 9C12 7.89543 11.1046 7 10 7C8.89543 7 8 7.89543 8 9C8 10.1046 8.89543 11 10 11Z" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="form-options">
                <label class="checkbox-container">
                  <input type="checkbox" v-model="rememberMe">
                  <span class="checkmark"></span>
                  Запомнить меня
                </label>
                <a href="#" class="forgot-link">Забыли пароль?</a>
              </div>

              <button
                type="submit"
                class="btn btn-primary btn-auth"
                :disabled="loading"
                :class="{ 'btn-loading': loading }"
              >
                <span class="btn-content">
                  <span class="btn-text">{{ loading ? 'Вход...' : 'Войти в систему' }}</span>
                  <span class="btn-arrow">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 1L14.5 8L8 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M14.5 8H1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  </span>
                </span>
                <div class="btn-loader">
                  <div class="loader-dot"></div>
                  <div class="loader-dot"></div>
                  <div class="loader-dot"></div>
                </div>
              </button>

              <div v-if="error" class="error-message">
                <div class="error-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M9 6V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M9 11.25H9.0075" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </div>
                <span>{{ error }}</span>
              </div>
            </form>

            <div class="auth-footer">
              <p>Нет аккаунта?
                <nuxt-link to="/register" class="auth-link">
                  Зарегистрируйтесь как Боров
                </nuxt-link>
              </p>
            </div>

            <!-- Улучшенный блок тестовых данных -->
            <div class="test-credentials">
              <div class="test-header" @click="toggleTestData">
                <span>Тестовые доступы</span>
                <div class="test-icon" :class="{ rotated: showTestData }">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <transition name="slide">
                <div class="test-content" v-if="showTestData">
                  <div class="test-item" @click="fillTestData('admin')">
                    <div class="test-role">
                      <div class="role-icon admin"></div>
                      <div>
                        <strong>Администратор</strong>
                        <span>admin / admin123</span>
                      </div>
                    </div>
                  </div>
                  <div class="test-item" @click="fillTestData('slon')">
                    <div class="test-role">
                      <div class="role-icon slon"></div>
                      <div>
                        <strong>Слон</strong>
                        <span>slon1 / slon123</span>
                      </div>
                    </div>
                  </div>
                  <div class="test-note">
                    <small>Для Борова - сначала регистрация через промокод</small>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Улучшенные плавающие элементы -->
      <div class="floating-elements">
        <div class="floating-element element-1"></div>
        <div class="floating-element element-2"></div>
        <div class="floating-element element-3"></div>
        <div class="floating-element element-4"></div>
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
const rememberMe = ref(false)
const showPassword = ref(false)
const showTestData = ref(false)
const usernameFocused = ref(false)
const passwordFocused = ref(false)

const toggleTestData = () => {
  showTestData.value = !showTestData.value
}

// Автозаполнение тестовых данных
const fillTestData = (type: 'admin' | 'slon') => {
  if (type === 'admin') {
    form.username = 'admin'
    form.password = 'admin123'
  } else {
    form.username = 'slon1'
    form.password = 'slon123'
  }

  // Добавляем небольшую анимацию при заполнении
  const inputs = document.querySelectorAll('.input-container')
  inputs.forEach(input => {
    input.classList.add('input-filled')
    setTimeout(() => {
      input.classList.remove('input-filled')
      setTimeout(() => {
        input.classList.add('input-filled')
      }, 50)
    }, 300)
  })
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await $fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      body: form
    })

    console.log('Login response:', response)
    console.log('User role:', response.user.role)

    authStore.setAuth(response.token, response.user)

    // Анимация успешного входа
    document.querySelector('.auth-card')?.classList.add('success-animation')

    setTimeout(async () => {
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
    }, 1000)
  } catch (err: any) {
    error.value = err.data?.error || 'Ошибка входа'
    console.error('Login error:', err)

    // Анимация ошибки
    document.querySelector('.auth-card')?.classList.add('error-shake')
    setTimeout(() => {
      document.querySelector('.auth-card')?.classList.remove('error-shake')
    }, 500)
  } finally {
    loading.value = false
  }
}

// Инициализация частиц
onMounted(() => {
  // Анимация при загрузке
  const elements = document.querySelectorAll('.auth-card, .auth-header')
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('animate-in')
    }, index * 200)
  })

  // Инициализация частиц
  initParticles()
})

// Функция для инициализации частиц
const initParticles = () => {
  if (typeof window !== 'undefined') {
    const canvas = document.createElement('canvas')
    canvas.id = 'particles-canvas'
    canvas.style.position = 'absolute'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.pointerEvents = 'none'
    document.querySelector('.particles-container')?.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Настройки частиц
    const particles: any[] = []
    const particleCount = 30

    // Создание частиц
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.2
      })
    }

    // Анимация частиц
    const animateParticles = () => {
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Обновление размеров canvas
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Отрисовка и обновление частиц
      particles.forEach(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Если частица вышла за границы, возвращаем ее
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

        // Отрисовка частицы
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 175, 55, ${particle.opacity})`
        ctx.fill()
      })

      requestAnimationFrame(animateParticles)
    }

    animateParticles()
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #0a0a0a;
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Улучшенный анимированный фон */
.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.parallax-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%);
}

.layer-1 {
  transform: translateZ(-10px) scale(2);
  opacity: 0.6;
  animation: parallax-1 20s infinite linear;
}

.layer-2 {
  transform: translateZ(-5px) scale(1.5);
  opacity: 0.4;
  animation: parallax-2 15s infinite linear;
}

.layer-3 {
  transform: translateZ(0);
  opacity: 0.3;
  animation: parallax-3 10s infinite linear;
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at top right, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at bottom left, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
  z-index: 3;
}

@keyframes parallax-1 {
  0%, 100% { transform: translateZ(-10px) scale(2) translateY(0px); }
  50% { transform: translateZ(-10px) scale(2) translateY(-10px); }
}

@keyframes parallax-2 {
  0%, 100% { transform: translateZ(-5px) scale(1.5) translateY(0px); }
  50% { transform: translateZ(-5px) scale(1.5) translateY(-15px); }
}

@keyframes parallax-3 {
  0%, 100% { transform: translateZ(0) translateY(0px); }
  50% { transform: translateZ(0) translateY(-20px); }
}

.auth-content {
  position: relative;
  z-index: 4;
  width: 100%;
  max-width: 440px;
}

/* Улучшенный заголовок */
.auth-header {
  text-align: center;
  margin-bottom: 40px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.auth-header.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.logo-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}

.logo-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent, rgba(255,255,255,0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.logo:hover .logo-icon::before {
  transform: translateX(100%);
}

.logo-icon svg {
  color: #0a0a0a;
}

.logo-text {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: 1px;
}

.auth-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 20px 0;
}

.divider-line {
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
}

.divider-dot {
  width: 4px;
  height: 4px;
  background: #d4af37;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.divider-dot:nth-child(2) { animation-delay: 0.3s; }
.divider-dot:nth-child(3) { animation-delay: 0.6s; }

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.auth-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 1px;
}

/* Улучшенная карточка */
.auth-card {
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.95), rgba(21, 21, 21, 0.95));
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(212, 175, 55, 0.15);
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(212, 175, 55, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
  opacity: 0;
  transform: translateY(40px) scale(0.95);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.auth-card.animate-in {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.05), transparent);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.auth-card:hover::before {
  opacity: 1;
}

.auth-card.success-animation {
  animation: success-pulse 1s ease;
}

.auth-card.error-shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes success-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); box-shadow: 0 0 30px rgba(212, 175, 55, 0.5); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.card-inner {
  padding: 40px;
}

.card-header {
  position: relative;
  margin-bottom: 10px;
}

.card-title {
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 35px;
  color: #fff;
  position: relative;
}

.card-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
}

.card-decoration {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 5px;
}

.decoration-circle {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d4af37;
  opacity: 0.5;
  animation: decoration-pulse 2s infinite;
}

.decoration-circle:nth-child(2) {
  animation-delay: 0.5s;
}

@keyframes decoration-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* Улучшенная форма */
.auth-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.input-container {
  position: relative;
  transition: all 0.3s ease;
}

/* Улучшенные плавающие лейблы */
.input-label {
  position: absolute;
  top: 16px;
  left: 20px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  padding: 0;
  z-index: 2;
  transform-origin: left center;
  display: flex;
  align-items: center;
  gap: 4px;
}

.label-text {
  transition: all 0.3s ease;
}

.required-star {
  color: #dc3545;
  font-size: 0.9em;
  transition: all 0.3s ease;
}

.input-focused .input-label,
.input-filled .input-label {
  transform: translateY(-28px) scale(0.85);
  color: #d4af37;
  background: linear-gradient(145deg, #1a1a1a, #151515);
  padding: 2px 12px;
  left: 8px;
  border-radius: 8px;
  font-weight: 500;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.input-focused .input-label .required-star,
.input-filled .input-label .required-star {
  color: #d4af37;
  transform: scale(1.1);
}

.input-focused .input-underline {
  transform: scaleX(1);
}

.input-focused .input-icon {
  color: #d4af37;
}

.form-input {
  width: 100%;
  padding: 16px 50px 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.form-input:focus {
  outline: none;
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.05);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.input-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #d4af37, #f4d03f);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.input-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle {
  position: absolute;
  right: 45px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 5px;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: #d4af37;
}

/* Опции формы */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.checkbox-container:hover {
  color: #fff;
}

.checkbox-container input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  margin-right: 8px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-container input:checked + .checkmark {
  background: #d4af37;
  border-color: #d4af37;
}

.checkbox-container input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: solid #0a0a0a;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.forgot-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #d4af37;
}

/* Улучшенная кнопка */
.btn-auth {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 18px 30px;
  border-radius: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  color: #0a0a0a;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(212, 175, 55, 0.4);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-loading .btn-content {
  opacity: 0;
}

.btn-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-loading .btn-loader {
  opacity: 1;
}

.loader-dot {
  width: 6px;
  height: 6px;
  background: #0a0a0a;
  border-radius: 50%;
  animation: loader-bounce 1.4s infinite ease-in-out both;
}

.loader-dot:nth-child(1) { animation-delay: -0.32s; }
.loader-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes loader-bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: opacity 0.3s ease;
}

.btn-arrow {
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn:hover:not(:disabled) .btn-arrow {
  transform: translateX(5px);
}

/* Сообщение об ошибке */
.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 8px;
  color: #dc3545;
  margin-top: 20px;
  animation: slideIn 0.3s ease-out;
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Футер */
.auth-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.auth-footer p {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.auth-link {
  color: #d4af37;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
  position: relative;
}

.auth-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #d4af37;
  transition: width 0.3s ease;
}

.auth-link:hover {
  color: #f4d03f;
}

.auth-link:hover::after {
  width: 100%;
}

/* Улучшенные тестовые данные */
.test-credentials {
  margin-top: 25px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(212, 175, 55, 0.03);
}

.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(212, 175, 55, 0.05);
  cursor: pointer;
  transition: background 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
}

.test-header:hover {
  background: rgba(212, 175, 55, 0.1);
}

.test-icon {
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.test-icon.rotated {
  transform: rotate(180deg);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.test-content {
  padding: 0 20px;
  overflow: hidden;
}

.test-item {
  padding: 12px 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
}

.test-item:hover {
  background: rgba(212, 175, 55, 0.05);
  padding-left: 5px;
}

.test-item:last-child {
  border-bottom: none;
}

.test-role {
  display: flex;
  align-items: center;
  gap: 12px;
}

.role-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  color: #0a0a0a;
}

.role-icon.admin {
  background: linear-gradient(135deg, #d4af37, #f4d03f);
}

.role-icon.slon {
  background: linear-gradient(135deg, #6c757d, #adb5bd);
}

.test-role div {
  display: flex;
  flex-direction: column;
}

.test-role strong {
  color: #fff;
  margin-bottom: 2px;
}

.test-role span {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.test-note {
  padding: 12px 0;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.test-note small {
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

/* Улучшенные плавающие элементы */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent);
  animation: float 6s ease-in-out infinite;
  filter: blur(1px);
}

.element-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.element-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  right: 10%;
  animation-delay: -2s;
}

.element-3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 20%;
  animation-delay: -4s;
}

.element-4 {
  width: 100px;
  height: 100px;
  top: 30%;
  right: 20%;
  animation-delay: -1s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
  33% { transform: translateY(-20px) rotate(120deg) scale(1.05); }
  66% { transform: translateY(10px) rotate(240deg) scale(0.95); }
}

/* Адаптивность */
@media (max-width: 768px) {
  .auth-content {
    max-width: 100%;
    padding: 0 15px;
  }

  .card-inner {
    padding: 30px 25px;
  }

  .logo {
    flex-direction: column;
    gap: 10px;
  }

  .logo-text {
    font-size: 2rem;
  }

  .form-options {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .floating-element {
    display: none;
  }

  .input-focused .input-label,
  .input-filled .input-label {
    transform: translateY(-26px) scale(0.8);
    padding: 2px 10px;
    left: 10px;
  }
}

@media (max-width: 480px) {
  .auth-container {
    padding: 10px;
  }

  .card-inner {
    padding: 25px 20px;
  }

  .card-title {
    font-size: 1.5rem;
  }

  .btn-auth {
    padding: 16px 25px;
  }

  .test-role {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .input-label {
    font-size: 0.9rem;
  }

  .input-focused .input-label,
  .input-filled .input-label {
    transform: translateY(-24px) scale(0.75);
  }
}

/* Улучшения для мобильных устройств */
@media (max-width: 380px) {
  .auth-content {
    padding: 0 10px;
  }

  .card-inner {
    padding: 20px 15px;
  }

  .form-input {
    padding: 14px 45px 14px 15px;
    font-size: 16px; /* Предотвращает zoom в iOS */
  }

  .input-label {
    left: 15px;
  }

  .input-icon {
    right: 15px;
  }

  .password-toggle {
    right: 40px;
  }
}

/* Поддержка темной темы */
@media (prefers-color-scheme: dark) {
  .auth-container {
    background: #0a0a0a;
  }
}

/* Улучшения доступности */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Фокус для доступности */
.form-input:focus-visible {
  outline: 2px solid #d4af37;
  outline-offset: 2px;
}

.btn:focus-visible {
  outline: 2px solid #d4af37;
  outline-offset: 2px;
}
</style>