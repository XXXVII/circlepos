import type { Book } from './book'

export interface BooksResponse {
  books: Book[]
}

export interface BookDetailResponse {
  book: Book
}

export interface PurchaseResponse {
  success: boolean
  message: string
  book?: Book
  transactionId?: string
  orderId?: string
}

export interface ApiError {
  message: string
  code: string
  retryable: boolean
}