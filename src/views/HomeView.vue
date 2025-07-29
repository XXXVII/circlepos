<template>
  <AppHeader id="navigation" />

  <HeroSection @browse-books="scrollToBooks" />

  <main
    id="main-content"
    class="main-content"
    role="main"
    aria-labelledby="page-title"
  >
    <div class="container">
      <section
        class="section-header"
        ref="booksSection"
        aria-labelledby="page-title"
      >
        <div>
          <h2 id="page-title" class="section-title">Our Book Collection</h2>
          <p class="section-subtitle">
            Discover your next favorite read from our curated selection
          </p>
        </div>
      </section>

      <section class="books-section" aria-labelledby="page-title">
        <!-- Loading state with accessible skeleton -->
        <AccessibleSkeleton
          v-if="booksStore.loading"
          type="book-grid"
          :count="5"
          loading-message="Loading book collection, please wait..."
        />

        <!-- Error state -->
        <div
          v-else-if="booksStore.error"
          role="alert"
          aria-live="assertive"
          class="error-message"
        >
          <p>{{ booksStore.error }}</p>
          <button @click="booksStore.fetchBooks()" class="retry-btn">
            Try Again
          </button>
        </div>

        <!-- Books grid -->
        <div
          v-else
          class="books-grid"
          role="list"
          :aria-label="`${booksStore.books.length} books available`"
        >
          <div
            v-for="book in booksStore.books"
            :key="book.id"
            role="listitem"
            :aria-label="`Book: ${book.title} by ${book.author}`"
          >
            <BookCard :book="book" />
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import BookCard from '@/components/BookCard.vue'
import AccessibleSkeleton from '@/components/AccessibleSkeleton.vue'
import AppHeader from '@/components/AppHeader.vue'
import HeroSection from '@/components/HeroSection.vue'
import { useBooksStore } from '@/stores/books'
import { useFocusManagement } from '@/composables/useFocusManagement'

const booksSection = ref<HTMLElement>()
const booksStore = useBooksStore()
const { focusElement } = useFocusManagement()

const scrollToBooks = () => {
  booksSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// Watch for books loading completion
watch(
  () => booksStore.loading,
  async (isLoading, wasLoading) => {
    // When loading completes (was loading, now not loading)
    if (wasLoading && !isLoading) {
      if (booksStore.error) {
        await focusElement('page-title')
      } else if (booksStore.books.length > 0) {
        await focusElement('page-title')
      }
    }
  }
)

onMounted(() => {
  booksStore.fetchBooks()
})
</script>

<style scoped>
.error-message {
  text-align: center;
  padding: 2rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 500px;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: #b91c1c;
}

.retry-btn:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
}

.main-content {
  position: relative;
  padding: 4rem 0;
  background: white;
}

.main-content::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
  content: '';
}

.section-header {
  margin-bottom: 3rem;
}

.section-title {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.section-subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 1.125rem;
  line-height: 1.5;
}

.books-section {
  position: relative;
  min-height: 400px;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  gap: 2rem;
}

/* Desktop - 4 books per row */
@media (max-width: 1399px) and (min-width: 1200px) {
  .books-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Laptop - 3 books per row */
@media (max-width: 1199px) and (min-width: 900px) {
  .books-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .section-title {
    font-size: 2.25rem;
  }
}

/* Tablet - 2 books per row */
@media (max-width: 899px) and (min-width: 600px) {
  .books-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .main-content {
    padding: 3rem 0;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    gap: 1.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-actions {
    justify-content: center;
    align-self: stretch;
  }
}

/* Mobile - 2 books per row, smaller */
@media (max-width: 599px) {
  .books-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .main-content {
    padding: 2rem 0;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 2rem;
    text-align: left;
    gap: 1.5rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .section-subtitle {
    font-size: 1rem;
  }

  .section-actions {
    align-self: stretch;
  }

  .filter-btn {
    flex: 1;
    padding: 0.625rem 1rem;
    font-size: 0.8rem;
    text-align: center;
  }
}

/* Small mobile - 1 book per row */
@media (max-width: 400px) {
  .books-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .container {
    padding: 0 0.75rem;
  }

  .section-title {
    font-size: 1.5rem;
  }
}

/* Loading state centering */
.books-section .loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  min-height: 200px;
  transform: translate(-50%, -50%);
}
</style>
