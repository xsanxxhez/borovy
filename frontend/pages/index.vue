<template>
  <div class="home-page">
    <!-- Герой секция -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">BOROVY</h1>
        <p class="hero-subtitle">ТВОЯ НАДЁЖНАЯ ВАХТА</p>
        <p class="hero-description">
          Первая платформа, которая ставит интересы вахтовика на первое место.
          Не просто поиск работы, а полноценная экосистема для твоей карьеры.
        </p>

        <!-- Кнопки авторизации -->
        <div class="auth-buttons" v-if="!authStore.isAuthenticated">
          <nuxt-link to="/login" class="btn btn-primary">
            <span>Войти в систему</span>
          </nuxt-link>
          <nuxt-link to="/register" class="btn btn-outline">
            <span>Начать работать</span>
          </nuxt-link>
        </div>

        <!-- Приветствие для авторизованных -->
        <div v-else class="user-welcome">
          <div class="welcome-card">
            <h2>С возвращением, {{ authStore.user?.display_name }}!</h2>
            <p>Твой личный кабинет готов к работе</p>
            <nuxt-link :to="getDashboardRoute()" class="btn btn-primary btn-large">
              Перейти в кабинет
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Почему мы другие -->
    <div class="difference-section">
      <div class="container">
        <h2 class="section-title">ПОЧЕМУ МЫ — НЕ ПРОСТО ДОСКА ОБЪЯВЛЕНИЙ</h2>
        <div class="difference-grid">
          <div class="difference-card">
            <div class="difference-icon">🛡️</div>
            <h3>Гарантия безопасности</h3>
            <p>Мы лично проверяем каждое предприятие. Никаких мошенников — только проверенные вахты с реальными работодателями.</p>
          </div>

          <div class="difference-card">
            <div class="difference-icon">💼</div>
            <h3>Постоянная работа</h3>
            <p>Не разовые подработки, а долгосрочная карьера. Закончил одну вахту — мы сразу подберем следующую.</p>
          </div>

          <div class="difference-card">
            <div class="difference-icon">📊</div>
            <h3>Личный рост</h3>
            <p>Веди статистику, повышай рейтинг, получай доступ к лучшим вахтам. Чем больше работаешь — тем выгоднее условия.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Как это работает -->
    <div class="how-it-works">
      <div class="container">
        <h2 class="section-title">КАК МЫ РАБОТАЕМ ДЛЯ ТЕБЯ</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Регистрация</h3>
            <p>Получи промокод от нашего менеджера и создай аккаунт. Это гарантия того, что ты работаешь через проверенного посредника.</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>Выбор вахты</h3>
            <p>Просматривай только проверенные вакансии. Мы уже отсеяли сомнительные предложения за тебя.</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>Работа с гарантией</h3>
            <p>Выходи на вахту с уверенностью. Мы контролирем процесс и решаем любые вопросы.</p>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <h3>Карьерный рост</h3>
            <p>Зарабатывай репутацию, получай доступ к более выгодным вахтам, строй карьеру в нашей системе.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Наши преимущества -->
    <div class="advantages-section">
      <div class="container">
        <h2 class="section-title">ЧТО ТЫ ПОЛУЧАЕШЬ С BOROVY</h2>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="advantage-header">
              <div class="advantage-icon">🎯</div>
              <h3>Только проверенные вахты</h3>
            </div>
            <p>Мы сотрудничаем исключительно с надежными рекрутинговыми агентствами. Никаких "левых" предложений и обмана.</p>
          </div>

          <div class="advantage-card">
            <div class="advantage-header">
              <div class="advantage-icon">🤝</div>
              <h3>Забота о каждом</h3>
            </div>
            <p>Мы не бросаем тебя после устройства на работу. Решаем вопросы, консультируем, помогаем на всех этапах.</p>
          </div>

          <div class="advantage-card">
            <div class="advantage-header">
              <div class="advantage-icon">📈</div>
              <h3>Растем вместе</h3>
            </div>
            <p>Наша бизнес-модель построена на твоем успехе. Мы зарабатываем, только когда ты успешно работаешь.</p>
          </div>

          <div class="advantage-card">
            <div class="advantage-header">
              <div class="advantage-icon">🔒</div>
              <h3>Финансовая безопасность</h3>
            </div>
            <p>Прозрачные условия оплаты. Все расчеты через официальные каналы. Никаких серых схем.</p>
          </div>

          <div class="advantage-card">
            <div class="advantage-header">
              <div class="advantage-icon">🚀</div>
              <h3>Умный подбор</h3>
            </div>
            <p>Система запоминает твои предпочтения и опыт. Со временем подбор вахт становится точнее и выгоднее для тебя.</p>
          </div>

          <div class="advantage-card">
            <div class="advantage-header">
              <div class="advantage-icon">⭐</div>
              <h3>Репутация имеет значение</h3>
            </div>
            <p>Чем лучше ты работаешь, тем выше твой рейтинг. Это открывает доступ к премиальным вахтам с лучшими условиями.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Для кого это -->
    <div class="for-whom-section">
      <div class="container">
        <h2 class="section-title">ЭТОТ СЕРВИС ДЛЯ ТЕБЯ, ЕСЛИ ТЫ:</h2>
        <div class="for-whom-grid">
          <div class="for-whom-card">
            <div class="for-whom-icon">💪</div>
            <div class="for-whom-content">
              <h3>Ищешь надежную работу</h3>
              <p>Устал от мошенников и невыплат? Мы даем гарантии и отвечаем за каждое предложение.</p>
            </div>
          </div>

          <div class="for-whom-card">
            <div class="for-whom-icon">📅</div>
            <div class="for-whom-content">
              <h3>Хочешь стабильности</h3>
              <p>Мечтаешь о системе, где закончил одну вахту — уже есть следующая? Мы строим такую экосистему.</p>
            </div>
          </div>

          <div class="for-whom-card">
            <div class="for-whom-icon">🎯</div>
            <div class="for-whom-content">
              <h3>Ценишь свое время</h3>
              <p>Не хочешь тратить недели на поиск работы? Мы подбираем проверенные варианты быстро и точно.</p>
            </div>
          </div>

          <div class="for-whom-card">
            <div class="for-whom-icon">🚀</div>
            <div class="for-whom-content">
              <h3>Планируешь карьеру</h3>
              <p>Видишь себя в вахтовой работе на годы вперед? Мы поможем построить успешную карьеру.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA секция -->
    <div class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>ГОТОВ НАЧАТЬ РАБОТАТЬ С ГАРАНТИЯМИ?</h2>
          <p>Присоединяйся к сообществу профессиональных вахтовиков</p>
          <div class="cta-buttons" v-if="!authStore.isAuthenticated">
            <nuxt-link to="/register" class="btn btn-primary btn-large">
              Начать карьеру
            </nuxt-link>
            <nuxt-link to="/login" class="btn btn-outline btn-large">
              Уже работаю
            </nuxt-link>
          </div>
          <div v-else class="cta-buttons">
            <nuxt-link :to="getDashboardRoute()" class="btn btn-primary btn-large">
              Перейти в кабинет
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const getRoleName = (role: string) => {
  const roles: any = {
    admin: 'Администратор',
    slon: 'Менеджер',
    borov: 'Боров'
  }
  return roles[role] || role
}

const getDashboardRoute = () => {
  if (authStore.isAdmin) return '/admin'
  if (authStore.isSlon) return '/slon'
  if (authStore.isBorov) return '/borov'
  return '/'
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #0f0f0f;
}

/* Герой секция */
.hero-section {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  color: white;
  padding: 100px 20px;
  text-align: center;
  border-bottom: 3px solid #d4af37;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23d4af37' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.3;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 4rem;
  margin-bottom: 1rem;
  font-weight: 800;
  color: #d4af37;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.hero-subtitle {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
  font-weight: 600;
  letter-spacing: 1px;
}

.hero-description {
  font-size: 1.3rem;
  margin-bottom: 3rem;
  opacity: 0.8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.auth-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 15px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 16px;
  min-width: 200px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-primary {
  background: #d4af37;
  color: #1a1a1a;
  border: 2px solid #d4af37;
  font-weight: 700;
}

.btn-primary:hover {
  background: #c19b2e;
  border-color: #c19b2e;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}

.btn-outline {
  background: transparent;
  color: #d4af37;
  border: 2px solid #d4af37;
}

.btn-outline:hover {
  background: #d4af37;
  color: #1a1a1a;
  transform: translateY(-2px);
}

.btn-large {
  padding: 18px 40px;
  font-size: 18px;
}

/* Приветствие пользователя */
.user-welcome {
  margin-top: 30px;
}

.welcome-card {
  background: rgba(212, 175, 55, 0.1);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 15px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  max-width: 500px;
  margin: 0 auto;
}

.welcome-card h2 {
  margin-bottom: 15px;
  font-size: 2rem;
  color: #d4af37;
}

.welcome-card p {
  margin-bottom: 25px;
  opacity: 0.9;
  font-size: 1.1rem;
  color: #e0e0e0;
}

/* Секции */
.difference-section,
.how-it-works,
.advantages-section,
.for-whom-section {
  padding: 80px 20px;
  background: #1a1a1a;
  border-bottom: 1px solid #333;
}

.difference-section {
  background: #0f0f0f;
}

.advantages-section {
  background: #0f0f0f;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #d4af37;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* Difference Grid */
.difference-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.difference-card {
  background: #2a2a2a;
  padding: 40px 30px;
  border-radius: 15px;
  border: 1px solid #333;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.difference-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #d4af37, #ffd700);
}

.difference-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
}

.difference-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  display: block;
}

.difference-card h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #fff;
  font-weight: 600;
}

.difference-card p {
  color: #ccc;
  margin-bottom: 0;
  line-height: 1.6;
  font-size: 1.1rem;
}

/* Steps */
.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.step {
  text-align: center;
  padding: 40px 30px;
  background: #2a2a2a;
  border-radius: 15px;
  border: 1px solid #333;
  transition: all 0.3s ease;
  position: relative;
}

.step:hover {
  border-color: #d4af37;
  transform: translateY(-5px);
}

.step-number {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #d4af37 0%, #ffd700 100%);
  color: #1a1a1a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0 auto 25px;
  border: 4px solid #2a2a2a;
  box-shadow: 0 0 0 2px #d4af37;
}

.step h3 {
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: #fff;
  font-weight: 600;
}

.step p {
  color: #ccc;
  line-height: 1.6;
  font-size: 1.1rem;
}

/* Advantages Grid */
.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.advantage-card {
  background: #2a2a2a;
  padding: 30px;
  border-radius: 12px;
  border: 1px solid #333;
  transition: all 0.3s ease;
}

.advantage-card:hover {
  border-color: #d4af37;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.1);
}

.advantage-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.advantage-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.advantage-header h3 {
  margin: 0;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 600;
}

.advantage-card p {
  color: #ccc;
  line-height: 1.6;
  margin: 0;
  font-size: 1rem;
}

/* For Whom Section */
.for-whom-section {
  background: #1a1a1a;
}

.for-whom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.for-whom-card {
  background: #2a2a2a;
  padding: 30px;
  border-radius: 12px;
  border: 1px solid #333;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  transition: all 0.3s ease;
}

.for-whom-card:hover {
  border-color: #d4af37;
  transform: translateY(-3px);
}

.for-whom-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
  margin-top: 5px;
}

.for-whom-content h3 {
  margin: 0 0 10px 0;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
}

.for-whom-content p {
  color: #ccc;
  line-height: 1.5;
  margin: 0;
  font-size: 0.95rem;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  padding: 100px 20px;
  text-align: center;
  border-top: 3px solid #d4af37;
}

.cta-content h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #d4af37;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.cta-content p {
  font-size: 1.3rem;
  margin-bottom: 3rem;
  color: #ccc;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Адаптивность */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.3rem;
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

  .difference-grid,
  .advantages-grid,
  .for-whom-grid {
    grid-template-columns: 1fr;
  }

  .steps {
    grid-template-columns: 1fr;
  }

  .welcome-card {
    padding: 30px 20px;
  }

  .welcome-card h2 {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .cta-content h2 {
    font-size: 2rem;
  }

  .for-whom-card {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 60px 20px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .difference-section,
  .how-it-works,
  .advantages-section,
  .for-whom-section {
    padding: 60px 20px;
  }

  .difference-card,
  .step,
  .advantage-card {
    padding: 25px 20px;
  }
}
</style>