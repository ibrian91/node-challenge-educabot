import { describe, it, expect } from 'vitest'
import { createBooksProvider } from '../factories/booksProviderFactory.ts'

describe('BooksProviderFactory', () => {
  it('should create a valid provider instance', () => {
    const provider = createBooksProvider()
    expect(provider).toBeDefined()
    expect(provider.getBooks).toBeDefined()
    expect(typeof provider.getBooks).toBe('function')
  })
})
