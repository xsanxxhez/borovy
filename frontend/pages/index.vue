<template>
  <div class="home-page">
    <!-- Герой секция с параллакс эффектом -->
    <div class="hero-section">
      <div class="hero-background">
        <div class="parallax-bg"></div>
        <div class="hero-overlay"></div>
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
          Профессиональная экосистема для вахтовиков.
          Гарантированная работа, защищённые условия и карьерный рост
          в проверенных компаниях.
        </p>

        <!-- Кнопки авторизации -->
        <div class="auth-buttons" v-if="!authStore.isAuthenticated">
          <nuxt-link to="/login" class="btn btn-primary">
            <span class="btn-content">
              <span class="btn-text">Войти в систему</span>
              <span class="btn-arrow">→</span>
            </span>
          </nuxt-link>
          <nuxt-link to="/register" class="btn btn-outline">
            <span class="btn-content">
              <span class="btn-text">Начать работать</span>
              <span class="btn-arrow">→</span>
            </span>
          </nuxt-link>
        </div>

        <!-- Приветствие для авторизованных -->
        <div v-else class="user-welcome">
          <div class="welcome-card">
            <div class="welcome-icon">
              <i class="icon-user-check"></i>
            </div>
            <h2>Добро пожаловать, {{ authStore.user?.display_name }}!</h2>
            <p>Ваш персональный кабинет готов к работе</p>
            <nuxt-link :to="getDashboardRoute()" class="btn btn-primary btn-large">
              <span>Перейти в кабинет</span>
            </nuxt-link>
          </div>
        </div>

        <!-- Статистика компании -->
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-number">50+</div>
            <div class="stat-label">компаний-партнёров</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">10 000+</div>
            <div class="stat-label">успешных вахт</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">98%</div>
            <div class="stat-label">положительных отзывов</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Преимущества с иконками -->
    <div class="benefits-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">ПОЧЕМУ ВЫБИРАЮТ BOROVY</h2>
          <p class="section-subtitle">Создаём новые стандарты в вахтовой работе</p>
        </div>

        <div class="benefits-grid">
          <div class="benefit-card" v-for="benefit in benefits" :key="benefit.id">
            <div class="benefit-icon">
              <i :class="benefit.icon"></i>
            </div>
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.description }}</p>
            <div class="benefit-hover"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Процесс работы -->
    <div class="process-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">КАК НАЧАТЬ РАБОТАТЬ</h2>
          <p class="section-subtitle">Простой путь к вашей следующей вахте</p>
        </div>

        <div class="process-timeline">
          <div class="process-step" v-for="step in processSteps" :key="step.number">
            <div class="step-number">{{ step.number }}</div>
            <div class="step-content">
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
            <div class="step-connector" v-if="step.number < 4"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Особенности платформы -->
    <div class="features-section">
      <div class="container">
        <div class="features-grid">
          <div class="feature-main">
            <h2>ИНТЕЛЛЕКТУАЛЬНАЯ ПЛАТФОРМА</h2>
            <p>Система, которая учится вашим предпочтениям и предлагает идеальные вахты</p>

            <div class="feature-highlights">
              <div class="highlight-item">
                <i class="icon-target"></i>
                <div>
                  <h4>Умный подбор</h4>
                  <p>Алгоритмы анализируют ваш опыт и подбирают оптимальные варианты</p>
                </div>
              </div>

              <div class="highlight-item">
                <i class="icon-shield"></i>
                <div>
                  <h4>Гарантия безопасности</h4>
                  <p>Все работодатели проходят многоэтапную проверку</p>
                </div>
              </div>
            </div>
          </div>

          <div class="feature-visual">
            <div class="visual-card card-1">
              <div class="card-content">
                <h4>Рейтинговая система</h4>
                <p>Зарабатывайте репутацию, получайте лучшие условия</p>
              </div>
            </div>
            <div class="visual-card card-2">
              <div class="card-content">
                <h4>Карьерный рост</h4>
                <p>От рядового специалиста до руководителя проекта</p>
              </div>
            </div>
            <div class="visual-card card-3">
              <div class="card-content">
                <h4>Поддержка 24/7</h4>
                <p>Персональный менеджер решает любые вопросы</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA секция -->
    <div class="cta-section">
      <div class="cta-background">
        <div class="cta-overlay"></div>
      </div>

      <div class="container">
        <div class="cta-content">
          <h2>ГОТОВЫ НАЧАТЬ РАБОТАТЬ?</h2>
          <p>Присоединяйтесь к сообществу профессионалов</p>

          <div class="cta-buttons" v-if="!authStore.isAuthenticated">
            <nuxt-link to="/register" class="btn btn-primary btn-large">
              <span>Начать карьеру</span>
            </nuxt-link>
            <nuxt-link to="/login" class="btn btn-outline btn-large">
              <span>Войти в систему</span>
            </nuxt-link>
          </div>

          <div v-else class="cta-buttons">
            <nuxt-link :to="getDashboardRoute()" class="btn btn-primary btn-large">
              <span>Перейти в кабинет</span>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

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

// Данные для процесса работы
const processSteps = [
  {
    number: 1,
    title: 'Регистрация',
    description: 'Получите промокод от менеджера и создайте аккаунт в системе'
  },
  {
    number: 2,
    title: 'Подбор вахты',
    description: 'Выбирайте из проверенных вакансий, которые соответствуют вашему опыту'
  },
  {
    number: 3,
    title: 'Выход на объект',
    description: 'Приступайте к работе с полной уверенностью в условиях и оплате'
  },
  {
    number: 4,
    title: 'Карьерный рост',
    description: 'Повышайте рейтинг и получайте доступ к более выгодным проектам'
  }
]

const getDashboardRoute = () => {
  if (authStore.isAdmin) return '/admin'
  if (authStore.isSlon) return '/slon'
  if (authStore.isBorov) return '/borov'
  return '/'
}

// Анимация при скролле
onMounted(() => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
      }
    })
  }, observerOptions)

  document.querySelectorAll('.benefit-card, .process-step, .feature-card').forEach(el => {
    observer.observe(el)
  })
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #0a0a0a;
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
  z-index: 1;
}

.parallax-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120%;
  background:
    linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%),
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  background-attachment: fixed;
  transform: translateZ(0);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(10, 10, 10, 0.9) 0%,
    rgba(26, 26, 26, 0.7) 50%,
    rgba(42, 42, 42, 0.9) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 1200px;
  width: 100%;
}

.hero-badge {
  display: inline-block;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  color: #0a0a0a;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 30px;
  text-transform: uppercase;
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
}

.hero-description {
  font-size: 1.3rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 50px;
  opacity: 0.9;
  font-weight: 300;
}

/* Кнопки */
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
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.6s;
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  color: #0a0a0a;
  box-shadow: 0 8px 30px rgba(212, 175, 55, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(212, 175, 55, 0.4);
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
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 2;
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.btn:hover .btn-arrow {
  transform: translateX(5px);
}

.btn-large {
  padding: 20px 45px;
  font-size: 18px;
}

/* Статистика */
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  padding-top: 50px;
}

.stat-item {
  text-align: center;
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
.process-section,
.features-section {
  padding: 100px 20px;
  position: relative;
}

.benefits-section {
  background: #0f0f0f;
}

.process-section {
  background: #0a0a0a;
}

.features-section {
  background: #0f0f0f;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
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

/* Преимущества */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
}

.benefit-card {
  background: linear-gradient(145deg, #1a1a1a, #151515);
  padding: 50px 30px;
  border-radius: 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
  border: 1px solid #2a2a2a;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  opacity: 0;
  transform: translateY(30px);
}

.benefit-card.animate-in {
  opacity: 1;
  transform: translateY(0);
  transition-delay: calc(var(--index, 0) * 0.1s);
}

.benefit-card:hover {
  transform: translateY(-10px);
  border-color: #d4af37;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(212, 175, 55, 0.1);
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
}

.benefit-icon::before {
  content: '';
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

.benefit-card:hover .benefit-icon::before {
  opacity: 1;
}

.benefit-icon i {
  font-size: 2rem;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

.benefit-hover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.05), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.benefit-card:hover .benefit-hover {
  opacity: 1;
}

/* Процесс работы */
.process-timeline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0;
  position: relative;
}

.process-step {
  padding: 40px 30px;
  text-align: center;
  position: relative;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.process-step.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  border: 2px solid #d4af37;
  color: #d4af37;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 25px;
  position: relative;
  z-index: 2;
}

.step-content h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #fff;
  font-weight: 600;
}

.step-content p {
  color: #999;
  line-height: 1.6;
  font-size: 0.95rem;
}

.step-connector {
  position: absolute;
  top: 90px;
  right: -20px;
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #d4af37, transparent);
  z-index: 1;
}

/* Особенности */
.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.feature-main h2 {
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 20px;
  color: #fff;
  line-height: 1.2;
}

.feature-main > p {
  font-size: 1.2rem;
  color: #999;
  margin-bottom: 40px;
  line-height: 1.6;
}

.feature-highlights {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.highlight-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.highlight-item i {
  font-size: 2rem;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex-shrink: 0;
  margin-top: 5px;
}

.highlight-item h4 {
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #fff;
  font-weight: 600;
}

.highlight-item p {
  color: #999;
  line-height: 1.5;
  font-size: 0.95rem;
}

.feature-visual {
  position: relative;
  height: 500px;
}

.visual-card {
  position: absolute;
  background: linear-gradient(145deg, #1a1a1a, #151515);
  padding: 30px;
  border-radius: 15px;
  border: 1px solid #2a2a2a;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.4s ease;
}

.card-1 {
  top: 0;
  left: 0;
  width: 70%;
  z-index: 3;
}

.card-2 {
  top: 30%;
  right: 0;
  width: 60%;
  z-index: 2;
}

.card-3 {
  bottom: 0;
  left: 10%;
  width: 80%;
  z-index: 1;
}

.visual-card:hover {
  transform: translateY(-5px);
  border-color: #d4af37;
  z-index: 4;
}

.card-content h4 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #fff;
  font-weight: 600;
}

.card-content p {
  color: #999;
  line-height: 1.5;
  font-size: 0.9rem;
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

.cta-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
    linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
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
  margin-bottom: 50px;
}

/* Иконки (замени на реальные иконки из библиотеки) */
.icon-user-check:before { content: '✓'; }
.icon-shield-check:before { content: '🛡'; }
.icon-briefcase:before { content: '💼'; }
.icon-trending-up:before { content: '📈'; }
.icon-file-text:before { content: '📄'; }
.icon-users:before { content: '👥'; }
.icon-award:before { content: '⭐'; }
.icon-target:before { content: '🎯'; }
.icon-shield:before { content: '🛡'; }

/* Адаптивность */
@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: 1fr;
    gap: 60px;
  }

  .feature-visual {
    height: 400px;
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

  .auth-buttons,
  .cta-buttons {
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

  .process-timeline {
    grid-template-columns: 1fr;
  }

  .step-connector {
    display: none;
  }

  .hero-stats {
    gap: 40px;
  }

  .stat-number {
    font-size: 2rem;
  }

  .section-title {
    font-size: 2.2rem;
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
  .process-section,
  .features-section {
    padding: 60px 20px;
  }

  .benefit-card {
    padding: 30px 20px;
  }

  .cta-content h2 {
    font-size: 2.2rem;
  }

  .visual-card {
    position: relative;
    width: 100% !important;
    margin-bottom: 20px;
  }

  .feature-visual {
    height: auto;
  }
}
</style>