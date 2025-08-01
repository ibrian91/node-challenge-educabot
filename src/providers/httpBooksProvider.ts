import axios, { AxiosResponse } from 'axios'
import { Book, BookApiResponse } from '../models/book.ts'
import { BooksProvider } from './books.ts'
import { PROVIDER_CONFIG } from '../config/providers.ts'

const httpBooksProvider = (): BooksProvider => {
  
  const getBooks = async (): Promise<Book[]> => {
    try {
      const response: AxiosResponse<BookApiResponse[]> = await axios.get(
        `${PROVIDER_CONFIG.apiBaseUrl}/books`,
        {
          timeout: PROVIDER_CONFIG.httpTimeout
        }
      )
      
      // Transformar la respuesta de la API al formato interno
      return response.data.map((bookApi: BookApiResponse): Book => ({
        id: bookApi.id.toString(),
        name: bookApi.name,
        author: bookApi.author,
        unitsSold: bookApi.units_sold,
        price: bookApi.price
      }))
    } catch (error) {
      console.error('Error fetching books from external API:', error)
      throw new Error('Failed to fetch books from external service')
    }
  }

  return {
    getBooks,
  }
}

export default httpBooksProvider
