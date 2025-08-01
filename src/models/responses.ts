import { Book } from './book.ts'

// Interface para la respuesta de métricas de la API
export interface MetricsResponse {
  mean_units_sold: number
  cheapest_book: Book | null
  books_written_by_author: Book[]
}

// Interface para respuesta de error de la API
export interface ErrorResponse {
  error: string
  message: string
}

// Union type para respuestas HTTP posibles
export type ApiResponse = MetricsResponse | ErrorResponse
