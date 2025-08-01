import { BooksProvider } from '../providers/books.ts'
import { PROVIDER_CONFIG } from '../config/providers.ts'
import httpBooksProvider from '../providers/httpBooksProvider.ts'
import mockBooksProvider from '../repositories/mocks/booksProvider.ts'

export const createBooksProvider = (): BooksProvider => {
  switch (PROVIDER_CONFIG.type) {
    case 'http':
      return httpBooksProvider()
    case 'mock':
      return mockBooksProvider()
    default:
      throw new Error(`Unknown provider type: ${PROVIDER_CONFIG.type}`)
  }
}
