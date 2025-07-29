import type { Book } from '@/types/book'
import type { PurchaseResponse, ApiError } from '@/types/api'
import {
  BooksResponseSchema,
  BookDetailResponseSchema,
  PurchaseResponseSchema,
  validateApiResponse,
} from '@/schemas/api'
import { ValidationError } from '@/types/validation'
import { errorLogger } from '@/utils/errorLogger'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

class FetchError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message)
    this.name = 'FetchError'
  }
}

const createUserFriendlyError = (
  error: FetchError | ValidationError,
  endpoint?: string
): ApiError => {
  // Handle validation errors
  if (error instanceof ValidationError) {
    if (endpoint) {
      errorLogger.logValidationError(error, endpoint)
    }
    return {
      message:
        'The server returned invalid data. Please try again or contact support if the problem persists.',
      code: 'VALIDATION_ERROR',
      retryable: true,
    }
  }

  // Handle network/HTTP errors
  if (!error.status) {
    errorLogger.logNetworkError(error.message, endpoint, {
      name: error.name,
    })
    return {
      message:
        'Unable to connect to the server. Please check your internet connection.',
      code: 'NETWORK_ERROR',
      retryable: true,
    }
  }

  const status = error.status

  if (status >= 500) {
    errorLogger.logServerError(`Server error: ${error.message}`, endpoint, status)
    return {
      message: 'Server error occurred. Please try again in a moment.',
      code: 'SERVER_ERROR',
      retryable: true,
    }
  }

  if (status === 404) {
    return {
      message: 'The requested item was not found.',
      code: 'NOT_FOUND',
      retryable: false,
    }
  }

  if (status === 400) {
    return {
      message: 'Invalid request. Please refresh the page and try again.',
      code: 'BAD_REQUEST',
      retryable: false,
    }
  }

  return {
    message: 'Something went wrong. Please try again.',
    code: 'UNKNOWN_ERROR',
    retryable: true,
  }
}

const fetchWithError = async (url: string, options?: RequestInit): Promise<Response> => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new FetchError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response
      )
    }

    return response
  } catch (error) {
    if (error instanceof FetchError) {
      throw error
    }
    throw new FetchError(error instanceof Error ? error.message : 'Network error')
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const withRetry = async <T>(
  operation: () => Promise<T>,
  endpoint: string,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  let lastError: FetchError | ValidationError

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as FetchError | ValidationError

      const userError = createUserFriendlyError(lastError, endpoint)

      // Don't retry validation errors - they indicate API contract mismatch
      if (error instanceof ValidationError) {
        throw userError
      }

      // Don't retry if error is not retryable or this is the last attempt
      if (!userError.retryable || attempt === maxRetries) {
        throw userError
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000
      await sleep(delay)
    }
  }

  throw createUserFriendlyError(lastError!, endpoint)
}

export const bookService = {
  async getBooks(): Promise<Book[]> {
    return withRetry(async () => {
      const response = await fetchWithError('/books')
      const data = await response.json()
      const validatedData = validateApiResponse(
        BooksResponseSchema,
        data,
        'GET /books'
      )
      return validatedData.books
    }, 'GET /books')
  },

  async getBook(id: number): Promise<Book> {
    return withRetry(async () => {
      const response = await fetchWithError(`/books/${id}`)
      const data = await response.json()
      const validatedData = validateApiResponse(
        BookDetailResponseSchema,
        data,
        `GET /books/${id}`
      )
      return validatedData.book
    }, `GET /books/${id}`)
  },

  async purchaseBook(id: number): Promise<PurchaseResponse> {
    return withRetry(async () => {
      const response = await fetchWithError(`/books/${id}/purchase`, {
        method: 'POST',
      })

      const data = await response.json()

      // Debug log in development
      if (import.meta.env.DEV) {
        console.log('Purchase API Response:', {
          endpoint: `POST /books/${id}/purchase`,
          status: response.status,
          data,
        })
      }

      return validateApiResponse(
        PurchaseResponseSchema,
        data,
        `POST /books/${id}/purchase`
      )
    }, `POST /books/${id}/purchase`)
  },
}

export const getCoverUrl = (
  isbn: string,
  size: 'S' | 'M' | 'L' = 'L'
): string => {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`
}
