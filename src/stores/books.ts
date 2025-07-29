import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { bookService } from '@/services/api'
import type { ApiError } from '@/types/api'
import { useNotifications } from '@/composables/useNotifications'
import type { Book } from '@/types/book'

export const useBooksStore = defineStore('books', () => {
  // State
  const books = ref<Book[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const availableBooks = computed(() => 
    books.value.filter(book => book.availableStock > 0)
  )

  const lowStockBooks = computed(() =>
    books.value.filter(book => book.availableStock > 0 && book.availableStock < 5)
  )

  const outOfStockBooks = computed(() =>
    books.value.filter(book => book.availableStock === 0)
  )

  const getBookById = computed(() => 
    (id: number) => books.value.find(book => book.id === id)
  )

  // Actions
  const { showError } = useNotifications()

  const fetchBooks = async () => {
    if (loading.value) return // Prevent multiple simultaneous requests

    loading.value = true
    error.value = null

    try {
      books.value = await bookService.getBooks()
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.message

      if (apiError.retryable) {
        showError(
          'Failed to Load Books',
          apiError.message,
          [
            {
              label: 'Try Again',
              action: () => fetchBooks(),
              primary: true
            }
          ]
        )
      } else {
        showError('Failed to Load Books', apiError.message)
      }
    } finally {
      loading.value = false
    }
  }

  const updateBookStock = (bookId: number, newStock: number) => {
    const book = books.value.find(b => b.id === bookId)
    if (book) {
      book.availableStock = newStock
    }
  }

  const decrementBookStock = (bookId: number) => {
    const book = books.value.find(b => b.id === bookId)
    if (book && book.availableStock > 0) {
      book.availableStock -= 1
    }
  }

  const resetError = () => {
    error.value = null
  }

  return {
    // State
    books,
    loading,
    error,
    
    // Getters
    availableBooks,
    lowStockBooks,
    outOfStockBooks,
    getBookById,
    
    // Actions
    fetchBooks,
    updateBookStock,
    decrementBookStock,
    resetError
  }
})