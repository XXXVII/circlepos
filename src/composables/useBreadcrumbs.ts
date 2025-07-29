import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBooksStore } from '@/stores/books'
import type { BreadcrumbItem } from '@/components/BreadcrumbNavigation.vue'

/**
 * Composable for managing breadcrumb navigation
 * Automatically generates breadcrumbs based on current route
 */
export function useBreadcrumbs() {
  const route = useRoute()
  const booksStore = useBooksStore()

  const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const crumbs: BreadcrumbItem[] = []

    // Always start with home
    crumbs.push({
      text: 'Home',
      to: '/'
    })

    // Handle different routes
    if (route.name === 'book-detail') {
      // For book detail pages, add book title
      const bookId = parseInt(route.params.id as string)
      const book = booksStore.getBookById(bookId)
      
      if (book) {
        crumbs.push({
          text: book.title,
          ariaLabel: `Book details for ${book.title} by ${book.author}`
        })
      } else {
        crumbs.push({
          text: 'Book Details'
        })
      }
    }

    return crumbs
  })

  /**
   * Generate breadcrumbs for a specific book
   */
  const getBreadcrumbsForBook = (bookId: number): BreadcrumbItem[] => {
    const book = booksStore.getBookById(bookId)
    
    const crumbs: BreadcrumbItem[] = [
      {
        text: 'Home',
        to: '/'
      }
    ]
    
    if (book) {
      crumbs.push({
        text: book.title,
        ariaLabel: `Book details for ${book.title} by ${book.author}`
      })
    } else {
      crumbs.push({
        text: 'Book Details'
      })
    }
    
    return crumbs
  }

  /**
   * Generate custom breadcrumbs
   */
  const createBreadcrumbs = (items: Omit<BreadcrumbItem, 'ariaLabel'>[]): BreadcrumbItem[] => {
    return items.map(item => ({
      ...item,
      ariaLabel: item.to ? `Go to ${item.text}` : undefined
    }))
  }

  return {
    breadcrumbs,
    getBreadcrumbsForBook,
    createBreadcrumbs
  }
}