// Configuración para el provider de libros
export const PROVIDER_CONFIG = {
  // Cambiar a 'mock' para usar datos simulados o 'http' para usar la API real
  type: 'http' as 'http' | 'mock',
  
  // URL base para la API externa
  apiBaseUrl: 'https://6781684b85151f714b0aa5db.mockapi.io/api/v1',
  
  // Timeout para las solicitudes HTTP (en milisegundos)
  httpTimeout: 5000
}
