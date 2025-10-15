<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Инициализируем состояние аутентификации при загрузке приложения
onMounted(() => {
  // Используем setTimeout чтобы Pinia успел инициализироваться
  setTimeout(() => {
    const authStore = useAuthStore()
    authStore.initializeAuth()
  }, 100)
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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

html, body, #__nuxt {
  height: 100%;
}
</style>