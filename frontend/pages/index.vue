
<template>
  <div class="home-page">
    <!-- Интерактивный фон с частицами -->
    <div class="particles-background" id="particles-js"></div>
    <!-- Герой секция -->
    <div class="hero-section">
      <div class="hero-background">
        <div class="animated-gradient"></div>
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>
      <div class="hero-content">


        <h1 class="hero-title">
          <span class="title-line">BOROVY</span>
          <span class="title-subline">ВАХТОВАЯ ПЛАТФОРМА</span>
        </h1>
        <div class="hero-divider">
          <div class="divider-line"></div>
          <div class="divider-dot"></div>
          <div class="divider-line"></div>
        </div>
        <p class="hero-description">
          Собери свой путь к успешной вахте. <br>
          От регистрации до карьерного роста — всё в твоих руках.
        </p>
        <!-- Кнопки авторизации -->
        <div class="auth-buttons" v-if="!authStore.isAuthenticated">
          <nuxt-link to="/login" class="btn btn-primary btn-hover-3d">
            <span class="btn-content">
              <span class="btn-text">Войти в систему</span>
              <span class="btn-arrow">→</span>
            </span>
            <div class="btn-shine"></div>
          </nuxt-link>
          <nuxt-link to="/register" class="btn btn-primary btn-hover-3d">
                      <span class="btn-content">
                        <span class="btn-text">Начать работать</span>
                        <span class="btn-arrow">→</span>
                      </span>
                      <div class="btn-shine"></div>
                    </nuxt-link>
                    <nuxt-link to="/borov/specialties" class="btn btn-primary btn-hover-3d">
                                <span class="btn-content">
                                  <span class="btn-text">Посмотреть вакансии</span>
                                  <span class="btn-arrow">→</span>
                                </span>
                                <div class="btn-shine"></div>
                              </nuxt-link>
        </div>
        <!-- Приветствие для авторизованных -->
        <div v-else class="user-welcome">
          <div class="welcome-card card-hover-3d">
            <div class="welcome-icon">
              <i class="icon-user-check"></i>
            </div>
            <h2>Добро пожаловать, {{ authStore.user?.display_name }}!</h2>
            <p>Ваш персональный кабинет готов к работе</p>
            <nuxt-link :to="getDashboardRoute()" class="btn btn-primary btn-large btn-pulse">
              <span>Перейти в кабинет</span>
            </nuxt-link>
          </div>
        </div>

      </div>
    </div>
    <!-- Преимущества -->
    <div class="benefits-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">ПОЧЕМУ ВЫБИРАЮТ BOROVY</h2>
          <p class="section-subtitle">Создаём новые стандарты в вахтовой работе</p>
        </div>
        <div class="benefits-grid">
          <div class="benefit-card card-3d" v-for="benefit in benefits" :key="benefit.id"
               @mouseenter="activateCard(benefit.id)"
               @mousemove="moveCard($event, benefit.id)"
               @mouseleave="resetCard(benefit.id)">
            <div class="card-inner">
              <div class="benefit-icon">
                <i :class="benefit.icon"></i>
                <div class="icon-glow"></div>
              </div>
              <h3>{{ benefit.title }}</h3>
              <p>{{ benefit.description }}</p>
              <div class="benefit-hover"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Конструктор пути -->
    <div class="constructor-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">СОБЕРИ СВОЙ ПУТЬ К РАБОТЕ</h2>
          <p class="section-subtitle">Перетащи элементы в правильном порядке и начни карьеру</p>
        </div>
        <div class="constructor-process">
          <div class="constructor-area">
            <div class="parts-pool">
              <div v-for="(part, index) in parts" :key="part.id"
                   class="constructor-part"
                   :class="{ used: part.used, dragging: draggedPartIndex === index }"
                   draggable="true"
                   @dragstart="dragStart($event, index)"
                   @dragend="dragEnd">
                <div class="part-icon">
                  <div class="icon-inner" :class="`icon-${part.id}`"></div>
                </div>
                <div class="part-content">
                  <h4>{{ part.title }}</h4>
                  <p>{{ part.description }}</p>
                </div>
                <div class="part-drag-hint">
                  <div class="drag-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="build-zone"
                 @dragover="dragOver"
                 @drop="drop">
              <div class="sequence-track">
                <div v-for="(slot, index) in sequenceSlots" :key="index"
                     class="sequence-slot"
                     :class="{
                       filled: slot.filled,
                       correct: slot.correct,
                       active: dragOverSlot === index
                     }"
                     @dragover="dragOverSlot = index"
                     @dragleave="dragOverSlot = null"
                     @drop="dropOnSlot($event, index)">
                  <div v-if="slot.filled" class="placed-part">
                    <div class="placed-icon">
                      <div class="icon-inner" :class="`icon-${slot.part?.id}`"></div>
                    </div>
                    <div class="placed-content">
                      <h4>{{ slot.part?.title }}</h4>
                      <p>{{ slot.part?.description }}</p>
                    </div>
                    <button class="remove-btn" @click="removePart(index)">
                      <svg width="12" height="12" viewBox="0 0 12 12">
                        <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </button>
                  </div>
                  <div v-else class="slot-placeholder">
                    <div class="placeholder-icon">+</div>
                    <span class="slot-label">{{ slotLabels[index] }}</span>
                    <div class="slot-guide">Перетащи сюда</div>
                  </div>
                  <div class="slot-connector" v-if="index < 3"></div>
                </div>
              </div>
              <transition name="construction-complete">
                <div class="construction-result" v-if="isSequenceComplete">
                  <div class="result-animation">
                    <div class="success-gears">
                      <div class="gear gear-1">
                        <div class="gear-tooth"></div>
                        <div class="gear-tooth"></div>
                        <div class="gear-tooth"></div>
                        <div class="gear-tooth"></div>
                        <div class="gear-tooth"></div>
                        <div class="gear-tooth"></div>
                      </div>
                      <div class="gear gear-2">
                        <div class="gear-tooth"></div>
                        <div class="gear-tooth"></div>
                        <div class="gear-tooth"></div>
                        <div class="gear-tooth"></div>
                        <div class="gear-tooth"></div>
                        <div class="gear-tooth"></div>
                      </div>
                    </div>
                    <h3>ПУТЬ СОБРАН!</h3>
                    <p>Ты готов начать карьеру вахтовика. Регистрируйся и приступай к работе!</p>
                    <div class="result-actions">
                      <nuxt-link to="/register" class="btn btn-primary btn-large cta-pulse">
                        НАЧАТЬ РАБОТАТЬ
                      </nuxt-link>
                      <button class="btn btn-outline" @click="resetConstructor">
                        Собрать заново
                      </button>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>

   ">

    <!-- CTA секция -->
    <div class="cta-section">
      <div class="cta-background">
        <div class="pulse-ring ring-1"></div>
        <div class="pulse-ring ring-2"></div>
        <div class="pulse-ring ring-3"></div>
      </div>
      <div class="container">
        <div class="cta-content">
          <h2>ГОТОВЫ НАЧАТЬ РАБОТАТЬ?</h2>
          <p>Присоединяйтесь к <span class="highlight-text">сообществу профессионалов</span></p>
          <div class="cta-counter">
            <div class="counter-item">
              <span class="counter-number">{{ liveUsers }}</span>
              <span class="counter-label">вахтовиков онлайн</span>
            </div>
          </div>
          <div class="cta-buttons">
            <nuxt-link to="/register" class="btn btn-primary btn-large btn-glow">
              <span>Начать карьеру сегодня</span>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const authStore = useAuthStore()
// Живая статистика
const liveStats = ref([
  { id: 1, value: 12540, current: 0, label: 'Вакансий доступно' },
  { id: 2, value: 8430, current: 0, label: 'Вахтовиков работают' },
  { id: 3, value: 267, current: 0, label: 'Компаний партнёров' },
  { id: 4, value: 98, current: 0, label: 'Городов работы' }
])
const animateStats = () => {
  liveStats.value.forEach(stat => {
    const duration = 2000
    const step = Math.ceil(stat.value / (duration / 16))
    const timer = setInterval(() => {
      if (stat.current < stat.value) {
        stat.current += step
        if (stat.current > stat.value) stat.current = stat.value
      } else {
        clearInterval(timer)
      }
    }, 16)
  })
}
// Конструктор пути
const draggedPartIndex = ref<number | null>(null)
const dragOverSlot = ref<number | null>(null)
const correctSequence = [0, 1, 2, 3]
const parts = ref([
  {
    id: 1,
    title: 'Регистрация',
    description: 'Получи промокод и создай аккаунт за 2 минуты',
    used: false
  },
  {
    id: 2,
    title: 'Подбор вахты',
    description: 'Выбирай из проверенных вакансий по твоему опыту',
    used: false
  },
  {
    id: 3,
    title: 'Выход на объект',
    description: 'Приступай к работе с полным пакетом документов',
    used: false
  },
  {
    id: 4,
    title: 'Карьерный рост',
    description: 'Повышай рейтинг и получай лучшие условия',
    used: false
  }
])
const sequenceSlots = ref([
  { filled: false, part: null, correct: false },
  { filled: false, part: null, correct: false },
  { filled: false, part: null, correct: false },
  { filled: false, part: null, correct: false }
])
const slotLabels = ['ШАГ 1', 'ШАГ 2', 'ШАГ 3', 'ШАГ 4']
const isSequenceComplete = computed(() => {
  return sequenceSlots.value.every(slot => slot.filled && slot.correct)
})
const dragStart = (event: DragEvent, index: number) => {
  if (parts.value[index].used) {
    event.preventDefault()
    return
  }
  draggedPartIndex.value = index
  event.dataTransfer?.setData('text/plain', index.toString())
  event.dataTransfer.effectAllowed = 'move'
  setTimeout(() => {
    const target = event.target as HTMLElement
    target.style.opacity = '0.4'
  }, 0)
}
const dragEnd = (event: DragEvent) => {
  draggedPartIndex.value = null
  dragOverSlot.value = null
  const target = event.target as HTMLElement
  target.style.opacity = '1'
}
const dragOver = (event: DragEvent) => {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'
}
const drop = (event: DragEvent) => {
  event.preventDefault()
  const firstEmptySlot = sequenceSlots.value.findIndex(slot => !slot.filled)
  if (firstEmptySlot !== -1 && draggedPartIndex.value !== null) {
    placePart(draggedPartIndex.value, firstEmptySlot)
  }
}
const dropOnSlot = (event: DragEvent, slotIndex: number) => {
  event.preventDefault()
  const partIndex = parseInt(event.dataTransfer?.getData('text/plain') || '')
  if (!isNaN(partIndex) && !sequenceSlots.value[slotIndex].filled) {
    placePart(partIndex, slotIndex)
  }
}
const placePart = (partIndex: number, slotIndex: number) => {
  const part = parts.value[partIndex]
  sequenceSlots.value[slotIndex] = {
    filled: true,
    part: part,
    correct: correctSequence[slotIndex] === partIndex
  }
  parts.value[partIndex].used = true
  draggedPartIndex.value = null
  dragOverSlot.value = null
}
const removePart = (slotIndex: number) => {
  const part = sequenceSlots.value[slotIndex].part
  if (!part) return
  const partIndex = parts.value.findIndex(p => p.id === part.id)
  if (partIndex !== -1) {
    parts.value[partIndex].used = false
  }
  sequenceSlots.value[slotIndex] = {
    filled: false,
    part: null,
    correct: false
  }
}
const resetConstructor = () => {
  parts.value.forEach(part => {
    part.used = false
  })
  sequenceSlots.value = [
    { filled: false, part: null, correct: false },
    { filled: false, part: null, correct: false },
    { filled: false, part: null, correct: false },
    { filled: false, part: null, correct: false }
  ]
}
// 3D карточки
const activateCard = (id: number) => {
  // Активация карточки при наведении
}
const moveCard = (event: MouseEvent, id: number) => {
  const card = event.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const rotateY = (x - centerX) / 25
  const rotateX = (centerY - y) / 25
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
}
const resetCard = (id: number) => {
  const cards = document.querySelectorAll('.benefit-card')
  cards.forEach(card => {
    (card as HTMLElement).style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  })
}
// Онлайн счетчик
const liveUsers = ref(0)
// Данные для преимуществ
const benefits = [
  {
    id: 1,
    icon: 'icon-shield-check',
    title: 'Проверенные компании',
    description: 'Все работодатели проходят тщательную проверку. Никаких мошенников или невыплат.'
  },
  {
    id: 2,
    icon: 'icon-briefcase',
    title: 'Непрерывная занятость',
    description: 'Завершили одну вахту — сразу получаете следующую. Никаких простоев в работе.'
  },
  {
    id: 3,
    icon: 'icon-trending-up',
    title: 'Карьерное развитие',
    description: 'Повышайте рейтинг, открывайте доступ к премиальным вахтам с лучшими условиями.'
  },
  {
    id: 4,
    icon: 'icon-file-text',
    title: 'Прозрачные условия',
    description: 'Все договоры и условия работы полностью прозрачны. Никаких скрытых пунктов.'
  },
  {
    id: 5,
    icon: 'icon-users',
    title: 'Персональный менеджер',
    description: 'Ваш личный помощник решает все вопросы 24/7. Вы никогда не остаетесь один на один с проблемами.'
  },
  {
    id: 6,
    icon: 'icon-award',
    title: 'Премиум-вахты',
    description: 'Доступ к эксклюзивным проектам с повышенной оплатой и улучшенными условиями.'
  }
]
const getDashboardRoute = () => {
  if (authStore.isAdmin) return '/admin'
  if (authStore.isSlon) return '/slon'
  if (authStore.isBorov) return '/borov'
  return '/'
}
// Инициализация
onMounted(() => {
  animateStats()
  // Анимация появления элементов при скролле
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
        if (entry.target.classList.contains('stat-item')) {
          animateStats()
        }
      }
    })
  }, observerOptions)
  document.querySelectorAll('.benefit-card, .stat-item').forEach(el => {
    observer.observe(el)
  })
  // Запуск счетчика онлайн пользователей
  const userTimer = setInterval(() => {
    if (liveUsers.value < 156) {
      liveUsers.value += Math.floor(Math.random() * 3) + 1
    } else {
      clearInterval(userTimer)
    }
  }, 2000)
})
</script>
<style scoped>
.home-page {
  min-height: 100vh;
  background: #0a0a0a;
  position: relative;
  overflow-x: hidden;
}
/* Частицы на фоне */
.particles-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
/* Герой секция */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  color: white;
  padding: 120px 20px 80px;
}
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
.animated-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(10, 10, 10, 0.8) 0%, transparent 50%),
    linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%);
  animation: gradientShift 8s ease-in-out infinite;
}
@keyframes gradientShift {
  0%, 100% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(10deg); }
}
.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.1);
  animation: float 6s ease-in-out infinite;
}
.shape-1 {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}
.shape-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 10%;
  animation-delay: -2s;
}
.shape-3 {
  width: 80px;
  height: 80px;
  bottom: 20%;
  left: 20%;
  animation-delay: -4s;
}
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}
.hero-content {
  position: relative;
  z-index: 3;
  text-align: center;
  max-width: 1200px;
  width: 100%;
}
/* Анимированный логотип */
.logo-animation {
  display: inline-flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 40px;
  animation: logoEntrance 1s ease-out;
}
.logo-circle {
  width: 50px;
  height: 50px;
  border: 2px solid #d4af37;
  border-radius: 50%;
  position: relative;
  animation: logoRotate 3s linear infinite;
}
.logo-circle::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: #d4af37;
  border-radius: 50%;
}
.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
@keyframes logoEntrance {
  0% { transform: translateY(-50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
@keyframes logoRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.hero-title {
  font-size: 4.5rem;
  font-weight: 300;
  margin-bottom: 20px;
  line-height: 1.1;
}
.title-line {
  display: block;
  font-weight: 700;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.title-subline {
  display: block;
  font-size: 1.8rem;
  font-weight: 300;
  letter-spacing: 8px;
  margin-top: 10px;
  opacity: 0.8;
}
.hero-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 30px 0;
}
.divider-line {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
}
.divider-dot {
  width: 6px;
  height: 6px;
  background: #d4af37;
  border-radius: 50%;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}
.hero-description {
  font-size: 1.3rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 50px;
  color: rgba(255, 255, 255, 0.8);
}
/* Улучшенные кнопки */
.auth-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 80px;
}
.btn {
  padding: 18px 40px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-size: 16px;
  min-width: 220px;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  border: none;
  cursor: pointer;
}
.btn-hover-3d:hover {
  transform: translateY(-5px) rotateX(10deg);
  box-shadow:
    0 15px 40px rgba(212, 175, 55, 0.4),
    0 0 0 1px rgba(212, 175, 55, 0.1);
}
.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.6s;
}
.btn:hover .btn-shine {
  left: 100%;
}
.btn-primary {
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  color: #0a0a0a;
  box-shadow: 0 8px 30px rgba(212, 175, 55, 0.3);
}
.btn-outline {
  background: transparent;
  color: #d4af37;
  border: 2px solid #d4af37;
  backdrop-filter: blur(10px);
}
.btn-outline:hover {
  background: #d4af37;
  color: #0a0a0a;
}
.btn-large {
  padding: 20px 45px;
  font-size: 18px;
}
.btn-pulse {
  animation: pulse-glow 2s infinite;
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.4); }
  50% { box-shadow: 0 0 40px rgba(212, 175, 55, 0.8); }
}
.btn-glow {
  position: relative;
  overflow: visible;
}
/* Интерактивная статистика */
.interactive-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  padding-top: 50px;
}
.stat-item {
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}
.stat-item.animate-in {
  opacity: 1;
  transform: translateY(0);
}
.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}
.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
}
/* Секции */
.benefits-section,
.constructor-section {
  padding: 100px 20px;
  position: relative;
}
.benefits-section {
  background: #0f0f0f;
}
.constructor-section {
  background: #0a0a0a;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}
.section-header {
  text-align: center;
  margin-bottom: 80px;
}
.section-title {
  font-size: 2.8rem;
  font-weight: 300;
  margin-bottom: 15px;
  color: #fff;
  letter-spacing: 2px;
}
.section-subtitle {
  font-size: 1.2rem;
  opacity: 0.7;
  font-weight: 300;
}
/* 3D карточки преимуществ */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  perspective: 1000px;
}
.benefit-card {
  background: linear-gradient(145deg, #1a1a1a, #151515);
  padding: 0;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  border: 1px solid #2a2a2a;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  opacity: 0;
  transform: translateY(30px) rotateX(5deg);
  cursor: pointer;
}
.benefit-card.animate-in {
  opacity: 1;
  transform: translateY(0) rotateX(0);
  transition-delay: calc(var(--index, 0) * 0.1s);
}
.card-3d {
  transform-style: preserve-3d;
}
.card-inner {
  padding: 50px 30px;
  position: relative;
  z-index: 2;
  transform: translateZ(20px);
}
.benefit-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 25px;
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 2px solid #d4af37;
  transition: all 0.3s ease;
}
.icon-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  border-radius: 50%;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.benefit-card:hover .benefit-icon {
  transform: scale(1.1) rotateY(180deg);
}
.benefit-card:hover .icon-glow {
  opacity: 1;
}
.benefit-icon i {
  font-size: 2rem;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
}
.benefit-card h3 {
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: #fff;
  font-weight: 600;
}
.benefit-card p {
  color: #999;
  line-height: 1.6;
  font-size: 1rem;
}

/* Конструктор пути */
.constructor-process {
  background: rgba(26, 26, 26, 0.8);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 20px;
  padding: 40px;
  backdrop-filter: blur(10px);
}
.constructor-area {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  align-items: start;
}
.parts-pool {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.constructor-part {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(212, 175, 55, 0.5);
  border-radius: 12px;
  cursor: grab;
  transition: all 0.3s ease;
  position: relative;
}
.constructor-part:hover:not(.used) {
  border-color: #d4af37;
  transform: translateX(5px);
  background: rgba(255, 255, 255, 0.08);
}
.constructor-part.used {
  opacity: 0.4;
  cursor: not-allowed;
  border-style: dashed;
}
.constructor-part.dragging {
  opacity: 0.7;
  transform: rotate(5deg);
}
.part-icon {
  width: 50px;
  height: 50px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}
.icon-inner {
  width: 30px;
  height: 30px;
  background: #d4af37;
  border-radius: 6px;
  position: relative;
}
.icon-1::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: #1a1a1a;
  border-radius: 2px;
}
.icon-2::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 2px;
  background: #1a1a1a;
  border-radius: 1px;
}
.icon-2::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(90deg);
  width: 20px;
  height: 2px;
  background: #1a1a1a;
  border-radius: 1px;
}
.icon-3 {
  background: #1a1a1a;
  border: 2px solid #d4af37;
}
.icon-3::before {
  content: '';
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  background: #d4af37;
  border-radius: 2px;
}
.icon-4::before {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 5px;
  right: 5px;
  height: 8px;
  background: #1a1a1a;
  border-radius: 2px;
}
.part-content {
  flex: 1;
}
.part-content h4 {
  color: #fff;
  margin-bottom: 5px;
  font-size: 1.1rem;
}
.part-content p {
  color: #999;
  font-size: 0.9rem;
  line-height: 1.4;
}
.part-drag-hint {
  opacity: 0.5;
  transition: opacity 0.3s ease;
}
.constructor-part:hover .part-drag-hint {
  opacity: 1;
}
.drag-dots {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.drag-dots span {
  width: 4px;
  height: 4px;
  background: #d4af37;
  border-radius: 50%;
}
.build-zone {
  min-height: 500px;
  background: rgba(255, 255, 255, 0.02);
  border: 2px solid rgba(212, 175, 55, 0.2);
  border-radius: 15px;
  padding: 30px;
  position: relative;
  overflow: hidden;
}
.sequence-track {
  display: grid;
  gap: 25px;
}
.sequence-slot {
  min-height: 100px;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
  padding: 20px;
}
.sequence-slot.filled {
  border-style: solid;
  border-color: rgba(212, 175, 55, 0.5);
  background: rgba(212, 175, 55, 0.05);
}
.sequence-slot.correct {
  border-color: #27ae60;
  background: rgba(39, 174, 96, 0.1);
}
.sequence-slot.active {
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
}
.sequence-slot:hover {
  border-color: rgba(212, 175, 55, 0.7);
}
.placed-part {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
}
.placed-icon {
  width: 50px;
  height: 50px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.placed-content {
  flex: 1;
}
.placed-content h4 {
  color: #fff;
  margin-bottom: 5px;
  font-size: 1.1rem;
}
.placed-content p {
  color: #999;
  font-size: 0.9rem;
  line-height: 1.4;
}
.remove-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}
.remove-btn:hover {
  background: rgba(231, 76, 60, 0.8);
  transform: scale(1.1);
}
.slot-placeholder {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  color: rgba(255, 255, 255, 0.3);
}
.placeholder-icon {
  width: 50px;
  height: 50px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}
.slot-label {
  font-size: 1rem;
  font-weight: 600;
}
.slot-guide {
  margin-left: auto;
  font-size: 0.8rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.sequence-slot:hover .slot-guide {
  opacity: 1;
}
.slot-connector {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 25px;
  background: linear-gradient(to bottom, rgba(212, 175, 55, 0.5), transparent);
}
.construction-result {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 26, 26, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
}
.result-animation {
  text-align: center;
  padding: 40px;
}
.success-gears {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
}
.gear {
  position: absolute;
  width: 60px;
  height: 60px;
  background: #d4af37;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gear-1 {
  top: 0;
  left: 0;
  animation: gearRotate 4s linear infinite;
}
.gear-2 {
  bottom: 0;
  right: 0;
  animation: gearRotate 4s linear infinite reverse;
}
.gear-tooth {
  position: absolute;
  width: 12px;
  height: 25px;
  background: #1a1a1a;
  border-radius: 2px;
}
.gear-tooth:nth-child(1) { transform: rotate(0deg) translateY(-30px); }
.gear-tooth:nth-child(2) { transform: rotate(60deg) translateY(-30px); }
.gear-tooth:nth-child(3) { transform: rotate(120deg) translateY(-30px); }
.gear-tooth:nth-child(4) { transform: rotate(180deg) translateY(-30px); }
.gear-tooth:nth-child(5) { transform: rotate(240deg) translateY(-30px); }
.gear-tooth:nth-child(6) { transform: rotate(300deg) translateY(-30px); }
.result-animation h3 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.result-animation p {
  font-size: 1.2rem;
  color: #999;
  margin-bottom: 30px;
  line-height: 1.6;
}
.result-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}
.cta-pulse {
  animation: ctaPulse 2s infinite;
}
@keyframes gearRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes ctaPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(212, 175, 55, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(212, 175, 55, 0.8); }
}
.construction-complete-enter-active {
  animation: constructionComplete 0.6s ease;
}
@keyframes constructionComplete {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* НОВАЯ СЕКЦИЯ: Аутентичный стиль */
.authentic-section {
  padding: 100px 20px;
  background: #0f0f0f;
  position: relative;
  overflow: hidden;
}
.authentic-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
  pointer-events: none;
}
.authentic-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 50px;
  position: relative;
  z-index: 2;
}
.testimonial-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(212, 175, 55, 0.5);
  border-radius: 15px;
  padding: 30px;
  max-width: 400px;
  position: relative;
  backdrop-filter: blur(10px);
}
.testimonial-avatar {
  font-size: 3rem;
  margin-bottom: 15px;
}
.testimonial-text p {
  color: #ccc;
  line-height: 1.5;
  margin-bottom: 10px;
}
.testimonial-author {
  font-weight: 600;
  color: #d4af37;
}
.authentic-visual {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-shape {
  position: absolute;
  border: 2px solid #d4af37;
  border-radius: 10px;
  opacity: 0.2;
}
.shape-brutal-1 {
  width: 200px;
  height: 200px;
  top: 20%;
  left: 20%;
  transform: rotate(-15deg);
  animation: brutalMove1 10s infinite alternate;
}
.shape-brutal-2 {
  width: 150px;
  height: 150px;
  bottom: 15%;
  right: 25%;
  transform: rotate(25deg);
  animation: brutalMove2 8s infinite alternate-reverse;
}
.shape-brutal-3 {
  width: 100px;
  height: 100px;
  top: 40%;
  right: 10%;
  transform: rotate(45deg);
  animation: brutalMove3 6s infinite alternate;
}
.authentic-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  padding: 20px 40px;
  border-radius: 50px;
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
  z-index: 3;
}
.badge-content {
  color: #0a0a0a;
  font-weight: 700;
  font-size: 1.2rem;
  text-align: center;
}
@keyframes brutalMove1 {
  0% { transform: rotate(-15deg) translate(0, 0); }
  100% { transform: rotate(-15deg) translate(20px, 20px); }
}
@keyframes brutalMove2 {
  0% { transform: rotate(25deg) translate(0, 0); }
  100% { transform: rotate(25deg) translate(-15px, -15px); }
}
@keyframes brutalMove3 {
  0% { transform: rotate(45deg) translate(0, 0); }
  100% { transform: rotate(45deg) translate(10px, -10px); }
}

/* НОВАЯ СЕКЦИЯ: Y2K / Неоновый стиль */
.y2k-section {
  padding: 80px 20px;
  background: linear-gradient(135deg, #000428, #004e92);
  text-align: center;
  position: relative;
  overflow: hidden;
}
.y2k-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="none" stroke="rgba(255,0,255,0.05)" stroke-width="2"/></svg>');
  z-index: 1;
}
.y2k-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}
.y2k-badge {
  background: linear-gradient(45deg, #ff00cc, #333399);
  color: white;
  display: inline-block;
  padding: 10px 25px;
  border-radius: 50px;
  font-weight: 700;
  margin-bottom: 20px;
  box-shadow: 0 0 15px rgba(255, 0, 204, 0.5);
  animation: y2kPulse 2s infinite;
}
@keyframes y2kPulse {
  0%, 100% { box-shadow: 0 0 15px rgba(255, 0, 204, 0.5); }
  50% { box-shadow: 0 0 30px rgba(255, 0, 204, 0.8); }
}
.y2k-content h3 {
  font-size: 2.5rem;
  color: white;
  margin-bottom: 15px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}
.y2k-content p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
}

/* CTA секция */
.cta-section {
  padding: 120px 20px;
  position: relative;
  background: #0a0a0a;
  text-align: center;
  overflow: hidden;
}
.cta-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  animation: pulseRing 3s linear infinite;
}
.ring-1 {
  width: 200px;
  height: 200px;
  animation-delay: 0s;
}
.ring-2 {
  width: 400px;
  height: 400px;
  animation-delay: -1s;
}
.ring-3 {
  width: 600px;
  height: 600px;
  animation-delay: -2s;
}
@keyframes pulseRing {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0;
  }
}
.cta-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}
.cta-content h2 {
  font-size: 3.2rem;
  font-weight: 300;
  margin-bottom: 20px;
  color: #fff;
  letter-spacing: 2px;
}
.cta-content p {
  font-size: 1.3rem;
  color: #999;
  margin-bottom: 30px;
}
.highlight-text {
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.cta-counter {
  margin-bottom: 50px;
}
.counter-item {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(212, 175, 55, 0.1);
  padding: 15px 30px;
  border-radius: 25px;
  border: 1px solid rgba(212, 175, 55, 0.3);
}
.counter-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #d4af37;
}
.counter-label {
  color: #999;
  font-size: 0.9rem;
}
/* Иконки */
.icon-user-check:before { content: '✓'; }
.icon-shield-check:before { content: '🛡'; }
.icon-briefcase:before { content: '💼'; }
.icon-trending-up:before { content: '📈'; }
.icon-file-text:before { content: '📄'; }
.icon-users:before { content: '👥'; }
.icon-award:before { content: '⭐'; }
/* Адаптивность */
@media (max-width: 1024px) {
  .constructor-area {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  .build-zone {
    min-height: 400px;
  }
  .authentic-content {
    flex-direction: column;
    text-align: center;
  }
  .testimonial-card {
    max-width: 100%;
  }
  .authentic-visual {
    width: 100%;
    height: 300px;
  }
  .y2k-content h3 {
    font-size: 2rem;
  }
}
@media (max-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }
  .title-subline {
    font-size: 1.2rem;
    letter-spacing: 4px;
  }
  .auth-buttons {
    flex-direction: column;
    align-items: center;
  }
  .btn {
    width: 100%;
    max-width: 300px;
  }
  .benefits-grid {
    grid-template-columns: 1fr;
  }
  .interactive-stats {
    gap: 40px;
  }
  .stat-number {
    font-size: 2rem;
  }
  .section-title {
    font-size: 2.2rem;
  }
  .constructor-process {
    padding: 20px;
  }
  .result-actions {
    flex-direction: column;
    align-items: center;
  }
  .result-actions .btn {
    width: 100%;
    max-width: 250px;
  }
  .y2k-content h3 {
    font-size: 1.8rem;
  }
  .y2k-content p {
    font-size: 1rem;
  }
}
@media (max-width: 480px) {
  .hero-section {
    padding: 100px 20px 60px;
  }
  .hero-title {
    font-size: 2.2rem;
  }
  .benefits-section,
  .constructor-section {
    padding: 60px 20px;
  }
  .benefit-card {
    padding: 0;
  }
  .card-inner {
    padding: 30px 20px;
  }
  .cta-content h2 {
    font-size: 2.2rem;
  }
  .constructor-part,
  .placed-part {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  .part-content,
  .placed-content {
    text-align: center;
  }
  .slot-placeholder {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  .slot-guide {
    margin-left: 0;
  }
}
</style>
