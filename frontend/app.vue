<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

// Инициализируем состояние аутентификации при загрузке приложения
onMounted(() => {
  authStore.initializeAuth()
})
</script>

<style>
/* Глобальные стили для всего приложения */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #0a0a0a;
  color: #ffffff;
  line-height: 1.6;
  overflow-x: hidden;
}

html, body, #__nuxt {
  height: 100%;
  margin: 0;
  padding: 0;
}

/* Кастомный скроллбар */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #f4d03f;
}

/* Улучшение выделения текста */
::selection {
  background: rgba(212, 175, 55, 0.3);
  color: #ffffff;
}

/* Убираем стандартные стили для кнопок и инпутов */
button, input, textarea, select {
  font-family: inherit;
  font-size: inherit;
  color: inherit;
}

/* Убираем стандартный outline и добавляем кастомный */
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid #d4af37;
  outline-offset: 2px;
}

/* Анимации для плавного появления элементов */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Утилитарные классы */
.text-gold {
  color: #d4af37;
}

.bg-gold {
  background: #d4af37;
}

.border-gold {
  border-color: #d4af37;
}

/* Адаптивные изображения */
img {
  max-width: 100%;
  height: auto;
}

/* Отключаем подсветку ссылок на iOS */
a {
  -webkit-tap-highlight-color: transparent;
}

/* Улучшаем рендеринг шрифтов */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Поддержка reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Темная тема по умолчанию */
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
  }
}

/* Улучшаем читаемость для длинного текста */
p {
  max-width: 65ch;
}

/* Сброс стилей для списков */
ul, ol {
  list-style: none;
}

/* Сброс стилей для ссылок */
a {
  color: inherit;
  text-decoration: none;
}

/* Улучшаем доступность для фокуса */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #d4af37;
  color: #0a0a0a;
  padding: 8px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  z-index: 10000;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 6px;
}
</style>