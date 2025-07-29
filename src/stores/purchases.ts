import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { bookService } from '@/services/api'
import type { ApiError } from '@/types/api'
import { useNotifications } from '@/composables/useNotifications'
import { useBooksStore } from './books'
import type { PurchaseResponse } from '@/types/api'

export interface PurchaseHistory {
  id: string
  bookId: number
  bookTitle: string
  price: number
  purchasedAt: Date
  status: 'completed' | 'failed'
}

export const usePurchaseStore = defineStore('purchases', () => {
  // State
  const purchaseHistory = ref<PurchaseHistory[]>([])
  const processingPurchases = ref<Set<number>>(new Set())

  // Getters
  const isPurchasing = computed(() =>
    (bookId: number) => processingPurchases.value.has(bookId)
  )

  const recentPurchases = computed(() =>
    purchaseHistory.value
      .filter(purchase => purchase.status === 'completed')
      .sort((a, b) => b.purchasedAt.getTime() - a.purchasedAt.getTime())
      .slice(0, 10)
  )

  // Actions
  const { showSuccess, showError } = useNotifications()
  const booksStore = useBooksStore()

  const purchaseBook = async (bookId: number): Promise<boolean> => {
    if (processingPurchases.value.has(bookId)) {
      return false // Already processing this purchase
    }

    const book = booksStore.getBookById(bookId)
    if (!book) {
      showError('Purchase Failed', 'Book not found')
      return false
    }

    if (book.availableStock <= 0) {
      showError('Purchase Failed', 'This book is out of stock')
      return false
    }

    processingPurchases.value.add(bookId)

    try {
      const response: PurchaseResponse = await bookService.purchaseBook(bookId)
      
      if (response.success) {
        // Update local stock
        booksStore.decrementBookStock(bookId)
        
        // Add to purchase history
        purchaseHistory.value.push({
          id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
          bookId: book.id,
          bookTitle: book.title,
          price: book.price,
          purchasedAt: new Date(),
          status: 'completed'
        })

        // Show success notification
        showSuccess(
          'Purchase Successful!',
          `Thank you for your purchase of "${book.title}"`
        )

        return true
      } else {
        throw new Error(response.message || 'Purchase failed')
      }
    } catch (error) {
      const apiError = error as ApiError
      
      // Add failed purchase to history
      purchaseHistory.value.push({
        id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
        bookId: book.id,
        bookTitle: book.title,
        price: book.price,
        purchasedAt: new Date(),
        status: 'failed'
      })

      // Show error notification with retry option if retryable
      if (apiError.retryable) {
        showError(
          'Purchase Failed',
          apiError.message,
          [
            {
              label: 'Try Again',
              action: () => purchaseBook(bookId),
              primary: true
            },
            {
              label: 'Cancel',
              action: () => {}
            }
          ]
        )
      } else {
        showError('Purchase Failed', apiError.message)
      }

      return false
    } finally {
      processingPurchases.value.delete(bookId)
    }
  }

  return {
    // State
    purchaseHistory,
    
    // Getters
    isPurchasing,
    recentPurchases,
    
    // Actions
    purchaseBook
  }
})