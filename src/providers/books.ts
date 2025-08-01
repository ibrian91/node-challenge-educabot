import { Book } from '../models/book.ts'

export type BooksProvider = {
  getBooks: () => Promise<Book[]>
}
