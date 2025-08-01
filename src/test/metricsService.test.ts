import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MetricsService } from '../services/metricsService.ts'
import { BooksProvider } from '../providers/books.ts'
import { Book } from '../models/book.ts'

describe('MetricsService', () => {
  // Mock data
  const mockBooks: Book[] = [
    { id: '1', name: 'Book 1', author: 'Author 1', unitsSold: 100, price: 20 },
    { id: '2', name: 'Book 2', author: 'Author 2', unitsSold: 200, price: 15 },
    { id: '3', name: 'Book 3', author: 'Author 1', unitsSold: 300, price: 25 }
  ]

  let mockBooksProvider: BooksProvider
  let metricsService: MetricsService

  beforeEach(() => {
    mockBooksProvider = {
      getBooks: vi.fn().mockResolvedValue(mockBooks)
    }
    metricsService = new MetricsService(mockBooksProvider)
    vi.clearAllMocks()
  })

  describe('getBookMetrics', () => {
    it('should return correct metrics without author filter', async () => {
      const result = await metricsService.getBookMetrics()

      expect(mockBooksProvider.getBooks).toHaveBeenCalledOnce()
      expect(result).toEqual({
        meanUnitsSold: 200, // (100 + 200 + 300) / 3 = 200
        cheapestBook: mockBooks[1], // price: 15
        booksWrittenByAuthor: []
      })
    })

    it('should return correct metrics with author filter', async () => {
      const result = await metricsService.getBookMetrics('Author 1')

      expect(mockBooksProvider.getBooks).toHaveBeenCalledOnce()
      expect(result).toEqual({
        meanUnitsSold: 200,
        cheapestBook: mockBooks[1],
        booksWrittenByAuthor: [mockBooks[0], mockBooks[2]]
      })
    })

    it('should return correct metrics with case insensitive author filter', async () => {
      const result = await metricsService.getBookMetrics('AUTHOR 1')

      expect(result.booksWrittenByAuthor).toEqual([mockBooks[0], mockBooks[2]])
    })

    it('should handle empty books array', async () => {
      mockBooksProvider.getBooks = vi.fn().mockResolvedValue([])

      const result = await metricsService.getBookMetrics()

      expect(result).toEqual({
        meanUnitsSold: 0,
        cheapestBook: null,
        booksWrittenByAuthor: []
      })
    })

    it('should handle single book', async () => {
      const singleBook = [mockBooks[0]]
      mockBooksProvider.getBooks = vi.fn().mockResolvedValue(singleBook)

      const result = await metricsService.getBookMetrics()

      expect(result).toEqual({
        meanUnitsSold: 100,
        cheapestBook: mockBooks[0],
        booksWrittenByAuthor: []
      })
    })

    it('should throw error when provider fails', async () => {
      const error = new Error('Provider error')
      mockBooksProvider.getBooks = vi.fn().mockRejectedValue(error)

      await expect(metricsService.getBookMetrics()).rejects.toThrow('Provider error')
    })

    it('should return empty array when author not found', async () => {
      const result = await metricsService.getBookMetrics('Non-existent Author')

      expect(result.booksWrittenByAuthor).toEqual([])
    })

    it('should find cheapest book correctly when all have same price', async () => {
      const samePrice: Book[] = [
        { id: '1', name: 'Book 1', author: 'Author 1', unitsSold: 100, price: 20 },
        { id: '2', name: 'Book 2', author: 'Author 2', unitsSold: 200, price: 20 },
        { id: '3', name: 'Book 3', author: 'Author 3', unitsSold: 300, price: 20 }
      ]
      mockBooksProvider.getBooks = vi.fn().mockResolvedValue(samePrice)

      const result = await metricsService.getBookMetrics()

      expect(result.cheapestBook).toEqual(samePrice[0]) // Should return first one
    })
  })
})
