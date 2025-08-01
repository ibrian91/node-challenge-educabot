import { Request, Response } from 'express'
import { MetricsService } from '../services/metricsService.ts'

interface GetMetricsQuery {
  author?: string
}

// Interface para la respuesta de la API
interface MetricsResponse {
  mean_units_sold: number
  cheapest_book: any
  books_written_by_author: any[]
}

const metricsHandler = (metricsService: MetricsService) => {

  const get = async (req: Request<{}, {}, {}, GetMetricsQuery>, res: Response<MetricsResponse>) => {
    try {
      const { author } = req.query
      const metrics = await metricsService.getBookMetrics(author)

      res.status(200).json({
        mean_units_sold: metrics.meanUnitsSold,
        cheapest_book: metrics.cheapestBook,
        books_written_by_author: metrics.booksWrittenByAuthor,
      })
    } catch (error) {
      console.error('Error processing metrics request:', error)
      res.status(500).json({
        error: 'Internal server error',
        message: 'Unable to fetch book metrics'
      } as any)
    }
  }

  return {
    get,
  }
}

export default metricsHandler
