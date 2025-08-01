import { describe, it, expect } from 'vitest'
import { MetricsResponse, ErrorResponse, ApiResponse } from '../models/responses.ts'
import { Book } from '../models/book.ts'

describe('Response Types', () => {
  const mockBook: Book = {
    id: '1',
    name: 'Test Book',
    author: 'Test Author',
    unitsSold: 100,
    price: 20
  }

  describe('MetricsResponse', () => {
    it('should have correct structure', () => {
      const response: MetricsResponse = {
        mean_units_sold: 150,
        cheapest_book: mockBook,
        books_written_by_author: [mockBook]
      }

      expect(response.mean_units_sold).toBe(150)
      expect(response.cheapest_book).toEqual(mockBook)
      expect(response.books_written_by_author).toEqual([mockBook])
    })

    it('should allow null for cheapest_book', () => {
      const response: MetricsResponse = {
        mean_units_sold: 0,
        cheapest_book: null,
        books_written_by_author: []
      }

      expect(response.cheapest_book).toBeNull()
    })
  })

  describe('ErrorResponse', () => {
    it('should have correct structure', () => {
      const response: ErrorResponse = {
        error: 'Internal server error',
        message: 'Unable to fetch book metrics'
      }

      expect(response.error).toBe('Internal server error')
      expect(response.message).toBe('Unable to fetch book metrics')
    })
  })

  describe('ApiResponse', () => {
    it('should accept MetricsResponse', () => {
      const response: ApiResponse = {
        mean_units_sold: 150,
        cheapest_book: mockBook,
        books_written_by_author: [mockBook]
      }

      expect('mean_units_sold' in response).toBe(true)
    })

    it('should accept ErrorResponse', () => {
      const response: ApiResponse = {
        error: 'Internal server error',
        message: 'Unable to fetch book metrics'
      }

      expect('error' in response).toBe(true)
    })
  })
})
