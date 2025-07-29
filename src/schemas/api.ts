import type { Book } from '@/types/book'
import type { BooksResponse, BookDetailResponse, PurchaseResponse } from '@/types/api'
import { ValidationError } from '@/types/validation'

// Validation rules configuration
const validationRules = {
  book: {
    id: { min: 1, type: 'number' },
    title: { minLength: 1, maxLength: 255, type: 'string' },
    author: { minLength: 1, maxLength: 255, type: 'string' },
    isbn: { pattern: /^(?:\d{10}|\d{13})$/, type: 'string' },
    price: { min: 0.01, type: 'number' },
    availableStock: { min: 0, type: 'number' }
  }
}

// Simple type guards
const isNumber = (value: unknown): value is number => 
  typeof value === 'number' && !isNaN(value)

const isString = (value: unknown): value is string => 
  typeof value === 'string'

const isArray = (value: unknown): value is unknown[] => 
  Array.isArray(value)

const isObject = (value: unknown): value is Record<string, unknown> => 
  typeof value === 'object' && value !== null && !Array.isArray(value)

// Book validator
const validateBook = (data: unknown, path = ''): Book => {
  if (!isObject(data)) {
    throw new ValidationError(
      `Expected object at ${path}`,
      path,
      'object',
      data
    )
  }

  const { id, title, author, isbn, price, availableStock } = data
  const rules = validationRules.book

  // Validate ID
  if (!isNumber(id) || id < rules.id.min) {
    throw new ValidationError(
      `Invalid book ID at ${path}.id`,
      `${path}.id`,
      `number >= ${rules.id.min}`,
      id
    )
  }

  // Validate title
  if (!isString(title) || title.length < rules.title.minLength || title.length > rules.title.maxLength) {
    throw new ValidationError(
      `Invalid book title at ${path}.title`,
      `${path}.title`,
      `string (${rules.title.minLength}-${rules.title.maxLength} chars)`,
      title
    )
  }

  // Validate author
  if (!isString(author) || author.length < rules.author.minLength || author.length > rules.author.maxLength) {
    throw new ValidationError(
      `Invalid book author at ${path}.author`,
      `${path}.author`,
      `string (${rules.author.minLength}-${rules.author.maxLength} chars)`,
      author
    )
  }

  // Validate ISBN
  if (!isString(isbn) || !rules.isbn.pattern.test(isbn)) {
    throw new ValidationError(
      `Invalid book ISBN at ${path}.isbn`,
      `${path}.isbn`,
      '10 or 13 digit string',
      isbn
    )
  }

  // Validate price
  if (!isNumber(price) || price < rules.price.min) {
    throw new ValidationError(
      `Invalid book price at ${path}.price`,
      `${path}.price`,
      `number >= ${rules.price.min}`,
      price
    )
  }

  // Validate stock
  if (!isNumber(availableStock) || availableStock < rules.availableStock.min) {
    throw new ValidationError(
      `Invalid book stock at ${path}.availableStock`,
      `${path}.availableStock`,
      `number >= ${rules.availableStock.min}`,
      availableStock
    )
  }

  return { id, title, author, isbn, price, availableStock }
}

// API response validators
export const validateBooksResponse = (data: unknown): BooksResponse => {
  if (!isObject(data)) {
    throw new ValidationError(
      'Expected object for books response',
      '',
      'object',
      data
    )
  }

  const { books } = data

  if (!isArray(books)) {
    throw new ValidationError(
      'Expected books array',
      'books',
      'array',
      books
    )
  }

  return {
    books: books.map((book, index) => validateBook(book, `books[${index}]`))
  }
}

export const validateBookDetailResponse = (data: unknown): BookDetailResponse => {
  if (!isObject(data)) {
    throw new ValidationError(
      'Expected object for book detail response',
      '',
      'object',
      data
    )
  }

  const { book } = data

  return {
    book: validateBook(book, 'book')
  }
}

export const validatePurchaseResponse = (data: unknown): PurchaseResponse => {
  if (!isObject(data)) {
    throw new ValidationError(
      'Expected object for purchase response',
      '',
      'object',
      data
    )
  }

  const { success, message, book, transactionId, orderId } = data

  const result: PurchaseResponse = {
    success: success !== undefined ? Boolean(success) : true,
    message: isString(message) ? message : 'Purchase completed successfully'
  }

  if (book !== undefined) {
    result.book = validateBook(book, 'book')
  }

  if (transactionId !== undefined && isString(transactionId)) {
    result.transactionId = transactionId
  }

  if (orderId !== undefined && isString(orderId)) {
    result.orderId = orderId
  }

  return result
}

// Generic validation helper
export function validateApiResponse<T>(
  validator: (data: unknown) => T,
  data: unknown,
  endpoint: string
): T {
  try {
    return validator(data)
  } catch (error) {
    if (error instanceof ValidationError) {
      // Enhanced debugging information
      console.error('API Validation Error:', {
        endpoint,
        field: error.field,
        expectedType: error.expectedType,
        receivedValue: error.receivedValue,
        rawData: data,
      })

      throw new ValidationError(
        `API response validation failed for ${endpoint}: ${error.message}`,
        error.field,
        error.expectedType,
        error.receivedValue
      )
    }
    throw error
  }
}

// Schema equivalents for the API service
export const BooksResponseSchema = validateBooksResponse
export const BookDetailResponseSchema = validateBookDetailResponse  
export const PurchaseResponseSchema = validatePurchaseResponse
