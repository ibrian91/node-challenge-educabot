import { Book } from '../models/book.ts'
import { BooksProvider } from '../providers/books.ts'

// Interface para las métricas de respuesta
export interface BookMetrics {
  meanUnitsSold: number
  cheapestBook: Book | null
  booksWrittenByAuthor: Book[]
}

export class MetricsService {
  constructor(private booksProvider: BooksProvider) {}

  async getBookMetrics(author?: string): Promise<BookMetrics> {
    const books = await this.booksProvider.getBooks()

    const meanUnitsSold = this.calculateMeanUnitsSold(books)
    const cheapestBook = this.findCheapestBook(books)
    const booksWrittenByAuthor = author ? this.filterBooksByAuthor(books, author) : []

    return {
      meanUnitsSold,
      cheapestBook,
      booksWrittenByAuthor
    }
  }

  private calculateMeanUnitsSold(books: Book[]): number {
    if (books.length === 0) return 0
    const totalUnitsSold = books.reduce((sum, book) => sum + book.unitsSold, 0)
    return totalUnitsSold / books.length
  }

  private findCheapestBook(books: Book[]): Book | null {
    if (books.length === 0) return null
    return books.reduce((cheapest, book) => {
      return book.price < cheapest.price ? book : cheapest
    }, books[0])
  }

  private filterBooksByAuthor(books: Book[], author: string): Book[] {
    return books.filter(book => book.author.toLowerCase() === author.toLowerCase())
  }
}
