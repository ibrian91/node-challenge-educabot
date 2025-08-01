import express from 'express'
import cors from 'cors'
import { createBooksProvider } from './factories/booksProviderFactory.ts'
import { MetricsService } from './services/metricsService.ts'
import MetricsHandler from './handlers/metrics.ts'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

const booksProvider = createBooksProvider()
const metricsService = new MetricsService(booksProvider)
const metricsHandler = MetricsHandler(metricsService)
app.get('/', metricsHandler.get)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export { app }
