import { describe, it, expect, vi, beforeEach } from 'vitest'
import metricsHandler from './metrics'
import { Request, Response } from 'express'
import { BooksProvider } from '../providers/books'
import { Book } from '../models/book'

describe('metricsHandler', () => {
  // Mock data
  const mockBooks: Book[] = [
    { id: '1', name: 'Book 1', author: 'Author 1', unitsSold: 100, price: 20 },
    { id: '2', name: 'Book 2', author: 'Author 2', unitsSold: 200, price: 15 },
    { id: '3', name: 'Book 3', author: 'Author 1', unitsSold: 300, price: 25 }
  ]

  // Mock BooksProvider
  const mockBooksProvider: BooksProvider = {
    getBooks: vi.fn().mockResolvedValue(mockBooks)
  }

  // Set up handler with mock provider
  const handler = metricsHandler(mockBooksProvider)

  // Mock request and response
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let jsonMock: any

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
      await handler.get(mockReq as any, mockRes as any)

      expect(mockBooksProvider.getBooks).toHaveBeenCalled()
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith({
        mean_units_sold: 200,
        cheapest_book: mockBooks[1],
        books_written_by_author: []
      })
    })

    it('should return metrics with author query', async () => {
      mockReq.query = { author: 'Author 1' }

      await handler.get(mockReq as any, mockRes as any)

      expect(mockBooksProvider.getBooks).toHaveBeenCalled()
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith({
        mean_units_sold: 200,
        cheapest_book: mockBooks[1],
        books_written_by_author: [
          mockBooks[0],
          mockBooks[2]
        ]
      })
    })

    it('should handle case insensitive author search', async () => {
      mockReq.query = { author: 'AUTHOR 1' }

      await handler.get(mockReq as any, mockRes as any)

      expect(mockBooksProvider.getBooks).toHaveBeenCalled()
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith({
        mean_units_sold: 200,
        cheapest_book: mockBooks[1],
        books_written_by_author: [
          mockBooks[0],
          mockBooks[2]
        ]
      })
    })

    it('should handle provider error gracefully', async () => {
      const errorProvider: BooksProvider = {
        getBooks: vi.fn().mockRejectedValue(new Error('API Error'))
      }
      const errorHandler = metricsHandler(errorProvider)

      await errorHandler.get(mockReq as any, mockRes as any)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: 'Unable to fetch book metrics'
      })
    })

    it('should handle empty books array', async () => {
      const emptyProvider: BooksProvider = {
        getBooks: vi.fn().mockResolvedValue([])
      }
      const emptyHandler = metricsHandler(emptyProvider)

      await emptyHandler.get(mockReq as any, mockRes as any)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith({
        mean_units_sold: 0,
        cheapest_book: null,
        books_written_by_author: []
      })
    })
  })
})
