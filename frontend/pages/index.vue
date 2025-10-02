<template>
  <div class="home-page">
    <!-- Герой секция -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Borovy</h1>
        <p class="hero-subtitle">Платформа для организации вахтовой работы</p>
        <p class="hero-description">
          Эффективная система управления вахтовым методом работы с трехступенчатой системой доступа
        </p>

        <!-- Кнопки авторизации -->
        <div class="auth-buttons" v-if="!authStore.isAuthenticated">
          <nuxt-link to="/login" class="btn btn-primary">
            <span>Войти в систему</span>
          </nuxt-link>
          <nuxt-link to="/register" class="btn btn-outline">
            <span>Регистрация Борова</span>
          </nuxt-link>
        </div>

        <!-- Приветствие для авторизованных -->
        <div v-else class="user-welcome">
          <div class="welcome-card">
            <h2>Добро пожаловать, {{ authStore.user?.display_name }}!</h2>
            <p>Вы вошли в систему как <strong>{{ getRoleName(authStore.userRole) }}</strong></p>
            <nuxt-link :to="getDashboardRoute()" class="btn btn-primary btn-large">
              Перейти в личный кабинет
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Информация о ролях -->
    <div class="roles-section" v-if="!authStore.isAuthenticated">
      <div class="container">
        <h2 class="section-title">Роли в системе</h2>
        <div class="roles-grid">
          <div class="role-card">
            <div class="role-icon admin">👑</div>
            <h3>Администратор</h3>
            <p>Полный контроль над системой: управление слонами, вахтами, промокодами и статистикой</p>
            <div class="role-features">
              <span>Управление вахтами</span>
              <span>Контроль слонов</span>
              <span>Вся статистика</span>
            </div>
          </div>

          <div class="role-card">
            <div class="role-icon slon">🐘</div>
            <h3>Слон (Менеджер)</h3>
            <p>Привлечение рабочих через промокоды и отслеживание эффективности привлечения</p>
            <div class="role-features">
              <span>Создание промокодов</span>
              <span>Мои боровы</span>
              <span>Статистика</span>
            </div>
          </div>

          <div class="role-card">
            <div class="role-icon borov">💪</div>
            <h3>Боров (Рабочий)</h3>
            <p>Просмотр доступных вахт, запись на работу и отслеживание своей статистики</p>
            <div class="role-features">
              <span>Поиск вахт</span>
              <span>История работы</span>
              <span>Личный профиль</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Как это работает -->
    <div class="how-it-works" v-if="!authStore.isAuthenticated">
      <div class="container">
        <h2 class="section-title">Как это работает</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Регистрация</h3>
            <p>Боров регистрируется по промокоду от Слона</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>Выбор вахты</h3>
            <p>Просмотр доступных вахт и запись на подходящую</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>Работа</h3>
            <p>Выполнение рабочих обязанностей на вахте</p>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <h3>Статистика</h3>
            <p>Отслеживание прогресса и истории работы</p>
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
    slon: 'Слон',
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
}

/* Герой секция */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.1rem;
  margin-bottom: 3rem;
  opacity: 0.8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
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
}

.btn-primary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-primary:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-outline:hover {
  background: white;
  color: #667eea;
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  margin: 0 auto;
}

.welcome-card h2 {
  margin-bottom: 15px;
  font-size: 2rem;
}

.welcome-card p {
  margin-bottom: 25px;
  opacity: 0.9;
  font-size: 1.1rem;
}

/* Секция ролей */
.roles-section {
  padding: 80px 20px;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.role-card {
  background: white;
  padding: 40px 30px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.role-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.role-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  display: block;
}

.role-card h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
}

.role-card p {
  color: #666;
  margin-bottom: 25px;
  line-height: 1.6;
}

.role-features {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.role-features span {
  background: #f8f9fa;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  color: #555;
}

/* Секция "Как это работает" */
.how-it-works {
  padding: 80px 20px;
  background: white;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;
}

.step {
  text-align: center;
  padding: 30px;
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 20px;
}

.step h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #333;
}

.step p {
  color: #666;
  line-height: 1.6;
}

/* Адаптивность */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.3rem;
  }

  .auth-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 300px;
  }

  .roles-grid {
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
}

@media (max-width: 480px) {
  .hero-section {
    padding: 60px 20px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .role-card {
    padding: 30px 20px;
  }
}
</style>