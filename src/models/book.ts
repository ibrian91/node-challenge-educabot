export interface Book {
  id: string
  name: string
  author: string
  unitsSold: number
  price: number
}

// Interface para la respuesta de la API externa
export interface BookApiResponse {
  id: number
  name: string
  author: string
  units_sold: number
  price: number
}
