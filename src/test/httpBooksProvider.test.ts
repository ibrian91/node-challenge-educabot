import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest'
import axios from 'axios'
import httpBooksProvider from '../providers/httpBooksProvider.ts'
import { BookApiResponse } from '../models/book.ts'

// Mock axios
vi.mock('axios')

interface MockedAxios {
  get: Mock<[string, object?], Promise<{ data: BookApiResponse[] }>>
}

const mockedAxios = axios as unknown as MockedAxios

describe('HttpBooksProvider', () => {
  let provider: ReturnType<typeof httpBooksProvider>

  beforeEach(() => {
    provider = httpBooksProvider()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getBooks', () => {
    it('should fetch books successfully and transform them correctly', async () => {
      // Arrange
      const mockApiResponse: BookApiResponse[] = [
        {
          id: 1,
          name: 'The Fellowship of the Ring',
          author: 'J.R.R. Tolkien',
          units_sold: 50000000,
          price: 20
        },
        {
          id: 2,
          name: 'The Two Towers',
          author: 'J.R.R. Tolkien',
          units_sold: 30000000,
          price: 20
        }
      ]

      mockedAxios.get.mockResolvedValueOnce({
        data: mockApiResponse
      })

      // Act
      const result = await provider.getBooks()

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith('https://6781684b85151f714b0aa5db.mockapi.io/api/v1/books', {
        timeout: 5000
      })
      expect(result).toEqual([
        {
          id: '1',
          name: 'The Fellowship of the Ring',
          author: 'J.R.R. Tolkien',
          unitsSold: 50000000,
          price: 20
        },
        {
          id: '2',
          name: 'The Two Towers',
          author: 'J.R.R. Tolkien',
          unitsSold: 30000000,
          price: 20
        }
      ])
    })

    it('should handle empty response', async () => {
      // Arrange
      mockedAxios.get.mockResolvedValueOnce({
        data: []
      })

      // Act
      const result = await provider.getBooks()

      // Assert
      expect(result).toEqual([])
    })

    it('should throw error when API request fails', async () => {
      // Arrange
      const errorMessage = 'Network Error'
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage))

      // Act & Assert
      await expect(provider.getBooks()).rejects.toThrow('Failed to fetch books from external service')
    })

    it('should handle API timeout error', async () => {
      // Arrange
      mockedAxios.get.mockRejectedValueOnce({
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded'
      })

      // Act & Assert
      await expect(provider.getBooks()).rejects.toThrow('Failed to fetch books from external service')
    })

    it('should handle 404 error from API', async () => {
      // Arrange
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          status: 404,
          data: { message: 'Not Found' }
        }
      })

      // Act & Assert
      await expect(provider.getBooks()).rejects.toThrow('Failed to fetch books from external service')
    })

    it('should handle 500 error from API', async () => {
      // Arrange
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { message: 'Internal Server Error' }
        }
      })

      // Act & Assert
      await expect(provider.getBooks()).rejects.toThrow('Failed to fetch books from external service')
    })

    it('should transform single book correctly', async () => {
      // Arrange
      const mockApiResponse: BookApiResponse[] = [
        {
          id: 999,
          name: 'Test Book',
          author: 'Test Author',
          units_sold: 1000,
          price: 25.99
        }
      ]

      mockedAxios.get.mockResolvedValueOnce({
        data: mockApiResponse
      })

      // Act
      const result = await provider.getBooks()

      // Assert
      expect(result).toEqual([
        {
          id: '999',
          name: 'Test Book',
          author: 'Test Author',
          unitsSold: 1000,
          price: 25.99
        }
      ])
    })
  })
})
