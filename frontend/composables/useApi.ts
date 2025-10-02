export const useApi = () => {
const config = useRuntimeConfig()

return $fetch.create({
    baseURL: 'http://localhost:3000/api', // Явно указываем порт бэкенда
    headers: {
      'Content-Type': 'application/json',
    }
  })
}