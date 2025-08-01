import { Request, Response } from 'express'
import { MetricsService } from '../services/metricsService.ts'
import { MetricsResponse, ErrorResponse } from '../models/responses.ts'

interface GetMetricsQuery {
  author?: string
}

const metricsHandler = (metricsService: MetricsService) => {

  const get = async (req: Request<{}, {}, {}, GetMetricsQuery>, res: Response<MetricsResponse | ErrorResponse>) => {
    try {
      const { author } = req.query
      const metrics = await metricsService.getBookMetrics(author)

      const response: MetricsResponse = {
        mean_units_sold: metrics.meanUnitsSold,
        cheapest_book: metrics.cheapestBook,
        books_written_by_author: metrics.booksWrittenByAuthor,
      }

      res.status(200).json(response)
    } catch (error) {
      console.error('Error processing metrics request:', error)
      
      const errorResponse: ErrorResponse = {
        error: 'Internal server error',
        message: 'Unable to fetch book metrics'
      }
      
      res.status(500).json(errorResponse)
    }
  }

  return {
    get,
  }
}

export default metricsHandler
