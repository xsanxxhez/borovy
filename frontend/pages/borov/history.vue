<template>
  <div class="coming-soon-page">
    <!-- Анимированный фон -->
    <div class="background-animation">
      <div class="parallax-layer layer-1"></div>
      <div class="parallax-layer layer-2"></div>
      <div class="parallax-layer layer-3"></div>
      <div class="particles-container" id="particles-js"></div>
      <div class="gradient-overlay"></div>
    </div>

    <!-- Основной контент -->
    <div class="coming-soon-content">
      <!-- Анимированный логотип -->
      <div class="animated-logo">
        <div class="logo-orbital">
          <div class="orbit orbit-1">
            <div class="satellite"></div>
          </div>
          <div class="orbit orbit-2">
            <div class="satellite"></div>
          </div>
          <div class="orbit orbit-3">
            <div class="satellite"></div>
          </div>
          <div class="central-core">
            <div class="core-inner"></div>
          </div>
        </div>
      </div>

      <!-- Текст контента -->
      <div class="content-text">
        <h1 class="main-title">
          <span class="title-word">История</span>
          <span class="title-word">вахт</span>
        </h1>

        <div class="subtitle-container">
          <p class="subtitle">Скоро в следующем обновлении</p>
          <div class="subtitle-decoration">
            <div class="decoration-dot"></div>
            <div class="decoration-dot"></div>
            <div class="decoration-dot"></div>
          </div>
        </div>

        <p class="description">
          Мы работаем над созданием полноценной системы отслеживания вашей рабочей истории.
          Здесь вы сможете просматривать все вахты, анализировать статистику и отслеживать свой профессиональный рост.
        </p>
      </div>

      <!-- Прогресс и фичи -->
      <div class="features-grid">
        <div class="feature-card" v-for="feature in features" :key="feature.id">
          <div class="feature-icon" :class="feature.status">
            <div class="icon-background"></div>
            <div class="icon-foreground">
              {{ feature.emoji }}
            </div>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
          <div class="feature-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: feature.progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ feature.progress }}%</span>
          </div>
        </div>
      </div>

      <!-- Таймер обратного отсчета -->
      <div class="countdown-section">
        <div class="countdown-title">До релиза осталось</div>
        <div class="countdown-timer">
          <div class="time-unit">
            <div class="time-value">{{ days }}</div>
            <div class="time-label">дней</div>
          </div>
          <div class="time-separator">:</div>
          <div class="time-unit">
            <div class="time-value">{{ hours }}</div>
            <div class="time-label">часов</div>
          </div>
          <div class="time-separator">:</div>
          <div class="time-unit">
            <div class="time-value">{{ minutes }}</div>
            <div class="time-label">минут</div>
          </div>
          <div class="time-separator">:</div>
          <div class="time-unit">
            <div class="time-value">{{ seconds }}</div>
            <div class="time-label">секунд</div>
          </div>
        </div>
      </div>

      <!-- CTA кнопка -->
      <div class="cta-section">
        <button class="cta-button" @click="handleNotification">
          <span class="button-content">
            <span class="button-text">Уведомить о запуске</span>
            <span class="button-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2C10.5523 2 11 2.44772 11 3V4.12602C13.7252 4.57006 15.5 6.37559 15.5 9.5V9.93797C15.5 11.815 16.3018 13.4887 17.5 14.5C17.5 15.0523 17.0523 15.5 16.5 15.5H3.5C2.94772 15.5 2.5 15.0523 2.5 14.5C3.69821 13.4887 4.5 11.815 4.5 9.93797V9.5C4.5 6.37559 6.27475 4.57006 9 4.12602V3C9 2.44772 9.44772 2 10 2Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M7.5 15.5C7.5 16.8807 8.61929 18 10 18C11.3807 18 12.5 16.8807 12.5 15.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </span>
          </span>
          <div class="button-ripple" v-if="showRipple"></div>
        </button>

        <div class="notification-message" :class="{ show: showNotification }">
          <div class="notification-icon">✓</div>
          <span>Мы сообщим вам, когда функция будет готова!</span>
        </div>
      </div>

      <!-- Дополнительная информация -->
      <div class="info-section">
        <div class="info-card">
          <h3>Что будет в обновлении?</h3>
          <ul class="info-list">
            <li>📊 Детальная статистика по всем вахтам</li>
            <li>📈 Графики и аналитика работы</li>
            <li>🏆 Достижения и рейтинги</li>
            <li>💼 История заработков</li>
            <li>📱 Уведомления о новых вахтах</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Плавающие элементы -->
    <div class="floating-elements">
      <div class="floating-element element-1"></div>
      <div class="floating-element element-2"></div>
      <div class="floating-element element-3"></div>
      <div class="floating-element element-4"></div>
      <div class="floating-element element-5"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Состояния
const showNotification = ref(false)
const showRipple = ref(false)

// Обратный отсчет до следующего обновления (примерно 2 недели)
const targetDate = ref(new Date())
targetDate.value.setDate(targetDate.value.getDate() + 14)

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

// Функции обратного отсчета
const updateCountdown = () => {
  const now = new Date().getTime()
  const distance = targetDate.value.getTime() - now

  days.value = Math.floor(distance / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((distance % (1000 * 60)) / 1000)
}

// Фичи в разработке
const features = ref([
  {
    id: 1,
    emoji: '📊',
    title: 'Статистика',
    description: 'Подробная аналитика по всем вашим вахтам',
    progress: 85,
    status: 'in-progress'
  },
  {
    id: 2,
    emoji: '📈',
    title: 'Графики',
    description: 'Визуализация вашего рабочего прогресса',
    progress: 70,
    status: 'in-progress'
  },
  {
    id: 3,
    emoji: '🏆',
    title: 'Достижения',
    description: 'Система рейтингов и наград',
    progress: 45,
    status: 'in-progress'
  },
  {
    id: 4,
    emoji: '💼',
    title: 'История',
    description: 'Полный архив всех рабочих вахт',
    progress: 95,
    status: 'completed'
  }
])

// Обработчик уведомления
const handleNotification = () => {
  showRipple.value = true
  setTimeout(() => {
    showRipple.value = false
    showNotification.value = true

    setTimeout(() => {
      showNotification.value = false
    }, 3000)
  }, 600)
}

// Инициализация
onMounted(() => {
  updateCountdown()
  setInterval(updateCountdown, 1000)

  // Запуск анимаций
  setTimeout(() => {
    document.querySelector('.coming-soon-content')?.classList.add('animate-in')
  }, 100)
})
</script>

<style scoped>
.coming-soon-page {
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

/* Анимированный фон */
.background-animation {
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

/* Основной контент */
.coming-soon-content {
  position: relative;
  z-index: 4;
  width: 100%;
  max-width: 1200px;
  text-align: center;
  opacity: 0;
  transform: translateY(50px);
  transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.coming-soon-content.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Анимированный логотип */
.animated-logo {
  margin-bottom: 60px;
  display: flex;
  justify-content: center;
}

.logo-orbital {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orbit {
  position: absolute;
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  animation: orbit-rotate linear infinite;
}

.orbit-1 {
  width: 120px;
  height: 120px;
  animation-duration: 8s;
}

.orbit-2 {
  width: 160px;
  height: 160px;
  animation-duration: 12s;
  animation-direction: reverse;
}

.orbit-3 {
  width: 200px;
  height: 200px;
  animation-duration: 16s;
}

.satellite {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #d4af37;
  border-radius: 50%;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
}

.central-core {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 0 30px rgba(212, 175, 55, 0.5),
    inset 0 0 20px rgba(255, 255, 255, 0.2);
  animation: core-pulse 3s ease-in-out infinite;
}

.core-inner {
  width: 20px;
  height: 20px;
  background: #0a0a0a;
  border-radius: 50%;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
}

@keyframes orbit-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes core-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(212, 175, 55, 0.5); }
  50% { transform: scale(1.05); box-shadow: 0 0 50px rgba(212, 175, 55, 0.8); }
}

/* Текст контента */
.content-text {
  margin-bottom: 60px;
}

.main-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-word {
  display: inline-block;
  opacity: 0;
  transform: translateY(30px);
  animation: title-word-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.title-word:nth-child(1) { animation-delay: 0.3s; }
.title-word:nth-child(2) { animation-delay: 0.5s; }

@keyframes title-word-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.subtitle-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.subtitle {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.subtitle-decoration {
  display: flex;
  gap: 5px;
}

.decoration-dot {
  width: 6px;
  height: 6px;
  background: #d4af37;
  border-radius: 50%;
  animation: dot-pulse 2s infinite;
}

.decoration-dot:nth-child(2) { animation-delay: 0.3s; }
.decoration-dot:nth-child(3) { animation-delay: 0.6s; }

@keyframes dot-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.description {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

/* Сетка фич */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.feature-card {
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(21, 21, 21, 0.8));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(212, 175, 55, 0.1);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
  transition: left 0.6s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  border-color: rgba(212, 175, 55, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.feature-card:hover::before {
  left: 100%;
}

.feature-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-background {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 50%;
  animation: icon-rotate 10s linear infinite;
}

.icon-foreground {
  font-size: 2rem;
  position: relative;
  z-index: 2;
}

.feature-icon.completed .icon-background {
  background: rgba(40, 167, 69, 0.2);
  animation: none;
}

.feature-icon.in-progress .icon-background {
  background: rgba(255, 193, 7, 0.2);
}

@keyframes icon-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.feature-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #fff;
}

.feature-description {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
  line-height: 1.5;
}

.feature-progress {
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4af37, #f4d03f);
  border-radius: 3px;
  transition: width 1s ease-in-out;
}

.progress-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  min-width: 40px;
  text-align: right;
}

/* Таймер обратного отсчета */
.countdown-section {
  margin-bottom: 50px;
}

.countdown-title {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.countdown-timer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.time-unit {
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 15px;
  min-width: 100px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.1);
  transition: all 0.3s ease;
}

.time-unit:hover {
  transform: translateY(-5px);
  border-color: rgba(212, 175, 55, 0.3);
  box-shadow: 0 10px 25px rgba(212, 175, 55, 0.2);
}

.time-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #d4af37;
  margin-bottom: 5px;
}

.time-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.time-separator {
  font-size: 2rem;
  color: #d4af37;
  font-weight: 300;
  margin-bottom: 20px;
}

/* CTA секция */
.cta-section {
  margin-bottom: 50px;
  position: relative;
}

.cta-button {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  color: #0a0a0a;
  border: none;
  padding: 18px 40px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(212, 175, 55, 0.4);
}

.cta-button:active {
  transform: translateY(-1px);
}

.button-content {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 2;
}

.button-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  to {
    width: 300px;
    height: 300px;
    opacity: 0;
  }
}

.notification-message {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: rgba(40, 167, 69, 0.9);
  color: white;
  padding: 15px 25px;
  border-radius: 25px;
  font-size: 0.9rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  align-items: center;
  gap: 10px;
  backdrop-filter: blur(10px);
}

.notification-message.show {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(10px);
}

.notification-icon {
  width: 20px;
  height: 20px;
  background: white;
  color: #28a745;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

/* Информационная секция */
.info-section {
  max-width: 600px;
  margin: 0 auto;
}

.info-card {
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.6), rgba(21, 21, 21, 0.6));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(212, 175, 55, 0.1);
}

.info-card h3 {
  color: #fff;
  margin-bottom: 20px;
  font-size: 1.3rem;
  text-align: center;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  padding: 10px 0;
  color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.info-list li:last-child {
  border-bottom: none;
}

.info-list li:hover {
  color: #d4af37;
  transform: translateX(10px);
}

/* Плавающие элементы */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent);
  animation: float-element 8s ease-in-out infinite;
  filter: blur(1px);
}

.element-1 {
  width: 100px;
  height: 100px;
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.element-2 {
  width: 60px;
  height: 60px;
  top: 70%;
  left: 10%;
  animation-delay: -2s;
}

.element-3 {
  width: 80px;
  height: 80px;
  top: 20%;
  right: 10%;
  animation-delay: -4s;
}

.element-4 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 5%;
  animation-delay: -1s;
}

.element-5 {
  width: 70px;
  height: 70px;
  top: 80%;
  right: 20%;
  animation-delay: -3s;
}

@keyframes float-element {
  0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
  33% { transform: translateY(-30px) rotate(120deg) scale(1.1); }
  66% { transform: translateY(15px) rotate(240deg) scale(0.9); }
}

/* Адаптивность */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .description {
    font-size: 1rem;
    padding: 0 20px;
  }

  .countdown-timer {
    gap: 10px;
  }

  .time-unit {
    min-width: 70px;
    padding: 15px 10px;
  }

  .time-value {
    font-size: 1.8rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .logo-orbital {
    width: 150px;
    height: 150px;
  }

  .orbit-1 { width: 90px; height: 90px; }
  .orbit-2 { width: 120px; height: 120px; }
  .orbit-3 { width: 150px; height: 150px; }
}

@media (max-width: 480px) {
  .coming-soon-page {
    padding: 10px;
  }

  .main-title {
    font-size: 2rem;
  }

  .countdown-timer {
    flex-wrap: wrap;
  }

  .time-separator {
    display: none;
  }

  .cta-button {
    padding: 15px 30px;
    font-size: 1rem;
  }

  .feature-card {
    padding: 20px;
  }
}
</style>