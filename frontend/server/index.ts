import { createServer } from 'http'
import { listen } from 'listhen'

export default defineEventHandler(async (event) => {
  // Пустой обработчик для сервера
})

// Для продакшена
if (process.env.NODE_ENV === 'production') {
  const server = createServer()
  const port = process.env.PORT || 3000

  server.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}