export interface Book {
  id: number
  title: string
  author: string
  isbn: string
  price: number
  availableStock: number
}

export type PartialBook = Partial<Book>

export interface BookUpdate {
  id: number
  availableStock: number
}