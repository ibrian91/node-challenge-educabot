import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import metricsHandler from './metrics'
import { Request, Response } from 'express'
import { MetricsService, BookMetrics } from '../services/metricsService.ts'
import { Book } from '../models/book'

describe('metricsHandler', () => {
  // Mock data
  const mockBooks: Book[] = [
    { id: '1', name: 'Book 1', author: 'Author 1', unitsSold: 100, price: 20 },
    { id: '2', name: 'Book 2', author: 'Author 2', unitsSold: 200, price: 15 },
    { id: '3', name: 'Book 3', author: 'Author 1', unitsSold: 300, price: 25 }
  ]

  // Mock MetricsService
  const mockGetBookMetrics = vi.fn<[string?], Promise<BookMetrics>>()
  const mockMetricsService = {
    getBookMetrics: mockGetBookMetrics
  } as unknown as MetricsService

  // Set up handler with mock service
  const handler = metricsHandler(mockMetricsService)

  // Mock request and response
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let jsonMock: Mock

  beforeEach(() => {
    jsonMock = vi.fn()
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: jsonMock
    }
    mockReq = {
      query: {}
    }
    vi.clearAllMocks()
  })

  describe('get', () => {
    it('should return metrics with empty author query', async () => {
      const mockMetrics = {
        meanUnitsSold: 200,
        cheapestBook: mockBooks[1],
        booksWrittenByAuthor: []
      }
      
      mockGetBookMetrics.mockResolvedValue(mockMetrics)

      await handler.get(mockReq as Request, mockRes as Response)

      expect(mockGetBookMetrics).toHaveBeenCalledWith(undefined)
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith({
        mean_units_sold: 200,
        cheapest_book: mockBooks[1],
        books_written_by_author: []
      })
    })

    it('should return metrics with author query', async () => {
      mockReq.query = { author: 'Author 1' }
      
      const mockMetrics = {
        meanUnitsSold: 200,
        cheapestBook: mockBooks[1],
        booksWrittenByAuthor: [mockBooks[0], mockBooks[2]]
      }
      
      mockGetBookMetrics.mockResolvedValue(mockMetrics)

      await handler.get(mockReq as Request, mockRes as Response)

      expect(mockGetBookMetrics).toHaveBeenCalledWith('Author 1')
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith({
        mean_units_sold: 200,
        cheapest_book: mockBooks[1],
        books_written_by_author: [mockBooks[0], mockBooks[2]]
      })
    })

    it('should handle service error gracefully', async () => {
      mockGetBookMetrics.mockRejectedValue(new Error('Service Error'))

      await handler.get(mockReq as Request, mockRes as Response)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: 'Unable to fetch book metrics'
      })
    })

    it('should handle empty metrics response', async () => {
      const mockMetrics = {
        meanUnitsSold: 0,
        cheapestBook: null,
        booksWrittenByAuthor: []
      }
      
      mockGetBookMetrics.mockResolvedValue(mockMetrics)

      await handler.get(mockReq as Request, mockRes as Response)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith({
        mean_units_sold: 0,
        cheapest_book: null,
        books_written_by_author: []
      })
    })
  })
})
