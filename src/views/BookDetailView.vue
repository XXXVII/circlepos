<template>
  <AppHeader />

  <div class="book-detail-content">
    <!-- Loading state with accessible skeleton -->
    <AccessibleSkeleton
      v-if="loading"
      type="book-detail"
      loading-message="Loading book details, please wait..."
    />

    <main
      v-else-if="book"
      class="container"
      role="main"
      aria-labelledby="book-title"
    >
      <!-- Breadcrumb Navigation -->
      <BreadcrumbNavigation :breadcrumbs="breadcrumbs" />

      <div class="book-layout">
        <div class="book-cover-section">
          <img
            :src="coverUrl"
            :alt="`Cover of ${book.title}`"
            @error="handleImageError"
            class="large-cover"
          />
        </div>

        <div class="book-details">
          <h1 id="book-title" class="book-title">{{ book.title }}</h1>
          <h2 class="book-author">by {{ book.author }}</h2>

          <BookMetadata :book="book" />
          <BookPurchaseSection
            :book="book"
            :isPurchasing="purchaseStore.isPurchasing(book.id)"
            @purchase="purchaseBook"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AccessibleSkeleton from '@/components/AccessibleSkeleton.vue'
import BookMetadata from '@/components/BookMetadata.vue'
import BookPurchaseSection from '@/components/BookPurchaseSection.vue'
import AppHeader from '@/components/AppHeader.vue'
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.vue'
import { getCoverUrl } from '@/services/api'
import { useBooksStore } from '@/stores/books'
import { usePurchaseStore } from '@/stores/purchases'
import { useFocusManagement } from '@/composables/useFocusManagement'
import { useBreadcrumbs } from '@/composables/useBreadcrumbs'

const route = useRoute()
const booksStore = useBooksStore()
const purchaseStore = usePurchaseStore()
const loading = ref(true)
const imageError = ref(false)
const { focusElement } = useFocusManagement()
const { getBreadcrumbsForBook } = useBreadcrumbs()

const bookId = computed(() => parseInt(route.params.id as string))
const book = computed(() => booksStore.getBookById(bookId.value))
const breadcrumbs = computed(() => getBreadcrumbsForBook(bookId.value))

const coverUrl = computed(() => {
  if (!book.value || imageError.value) {
    return '/book-placeholder.svg'
  }
  return getCoverUrl(book.value.isbn, 'L')
})

const handleImageError = () => {
  imageError.value = true
}

const purchaseBook = async () => {
  if (!book.value || purchaseStore.isPurchasing(book.value.id)) return

  await purchaseStore.purchaseBook(book.value.id)
}

const loadBookData = async () => {
  // If books aren't loaded yet, load them
  if (booksStore.books.length === 0) {
    await booksStore.fetchBooks()
  }

  // Focus the book title after loading if book exists
  if (book.value) {
    await focusElement('book-title')
  }

  loading.value = false
}

onMounted(() => {
  loadBookData()
})

// Watch for route changes to handle navigation between book details
watch(
  () => route.params.id,
  () => {
    if (route.params.id) {
      loading.value = true
      loadBookData()
    }
  }
)
</script>

<style scoped>
.book-detail-content {
  min-height: calc(100vh - 100px);
  padding: 2rem 0;
  background: white;
}

.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
}

.book-layout {
  display: grid;
  align-items: start;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
}

.book-cover-section {
  text-align: center;
}

.large-cover {
  width: 250px;
  height: 375px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  background: #f5f5f5;
  object-fit: cover;
}

.book-details {
  padding-top: 1rem;
  max-width: 500px;
}

.book-title {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 300;
  line-height: 1.2;
}

.book-author {
  margin: 0 0 2rem 0;
  color: #7f8c8d;
  font-size: 1.5rem;
  font-weight: 400;
}

/* Tablet styles */
@media (max-width: 1024px) {
  .book-layout {
    grid-template-columns: 280px 1fr;
    gap: 2rem;
  }

  .large-cover {
    width: 220px;
    height: 330px;
  }

  .book-title {
    font-size: 2.2rem;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .book-detail {
    padding: 1rem;
  }

  .book-layout {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }

  .book-cover-section {
    order: 1;
  }

  .book-details {
    padding-top: 0;
    order: 2;
  }

  .large-cover {
    width: 200px;
    height: 300px;
  }

  .book-title {
    font-size: 2rem;
  }

  .book-author {
    font-size: 1.25rem;
  }
}

/* Small mobile styles */
@media (max-width: 480px) {
  .book-detail {
    padding: 0.75rem;
  }

  .back-link {
    margin-bottom: 1rem;
  }

  .large-cover {
    width: 160px;
    height: 240px;
  }

  .book-title {
    font-size: 1.75rem;
    line-height: 1.3;
  }

  .book-author {
    font-size: 1.1rem;
  }
}
</style>
