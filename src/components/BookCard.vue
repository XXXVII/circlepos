<template>
  <div class="book-card">
    <router-link
      :to="`/book/${book.id}`"
      class="card-link"
      :aria-label="`View ${book.title} by ${book.author}`"
    >
      <img
        :src="coverUrl"
        :alt="`${book.title} cover`"
        @error="handleImageError"
        class="cover-image"
        loading="lazy"
        width="200"
        height="240"
      />
      <h3 class="book-title">{{ book.title }}</h3>
    </router-link>

    <p class="book-author">by {{ book.author }}</p>

    <div class="book-pricing">
      <span class="book-price">${{ book.price.toFixed(2) }}</span>
      <div v-if="book.availableStock < 5" class="stock-indicator">
        <span class="stock-text">{{ book.availableStock }} left</span>
      </div>
    </div>

    <div class="book-actions">
      <button
        class="buy-btn"
        @click.stop="purchaseBook"
        :disabled="
          purchaseStore.isPurchasing(book.id) || book.availableStock === 0
        "
        :class="{
          purchasing: purchaseStore.isPurchasing(book.id),
          'out-of-stock': book.availableStock === 0,
        }"
      >
        <div class="btn-content">
          <div
            v-if="purchaseStore.isPurchasing(book.id)"
            class="btn-spinner"
          ></div>
          <span v-if="purchaseStore.isPurchasing(book.id)">Processing...</span>
          <span v-else-if="book.availableStock === 0">Out of Stock</span>
          <span v-else>Buy Now - ${{ book.price.toFixed(2) }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Book } from '@/types/book'
import { getCoverUrl } from '@/services/api'
import { usePurchaseStore } from '@/stores/purchases'

const props = defineProps<{
  book: Book
}>()

const emit = defineEmits<{
  'purchase-success': [bookId: number]
}>()

const purchaseStore = usePurchaseStore()
const imageError = ref(false)

const coverUrl = computed(() => {
  if (imageError.value) {
    return '/book-placeholder.svg'
  }
  return getCoverUrl(props.book.isbn)
})

const handleImageError = () => {
  imageError.value = true
}

const purchaseBook = async () => {
  if (
    purchaseStore.isPurchasing(props.book.id) ||
    props.book.availableStock === 0
  )
    return

  const success = await purchaseStore.purchaseBook(props.book.id)

  if (success) {
    emit('purchase-success', props.book.id)
  }
}
</script>

<style scoped>
.book-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.book-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.cover-image {
  display: block;
  width: 100%;
  max-width: 200px;
  height: 240px;
  margin: 0 auto 1rem auto;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  background: #f9fafb;
  transition: transform 0.2s ease;
  object-fit: cover;
}

.cover-image:hover {
  transform: scale(1.02);
}

.book-title {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.card-link:hover .book-title {
  color: #3b82f6;
}

.book-author {
  margin: 0 0 0.75rem 0;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.3;
}

.book-pricing {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5rem;
}

.book-price {
  color: #059669;
  font-size: 1.125rem;
  font-weight: 700;
}

.stock-indicator {
  display: flex;
  align-items: center;
}

.stock-text {
  color: #dc2626;
  font-size: 0.75rem;
  font-weight: 600;
  background: #fef2f2;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #fecaca;
}

.book-actions {
  margin-top: auto;
}

.buy-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  background: #3b82f6;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.buy-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.buy-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.buy-btn.purchasing {
  background: #10b981;
}

.buy-btn.out-of-stock {
  background: #6b7280;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .book-card {
    padding: 0.75rem;
  }

  .cover-image {
    height: 200px;
  }

  .book-title {
    font-size: 0.875rem;
  }

  .buy-btn {
    padding: 0.625rem 0.875rem;
    font-size: 0.8125rem;
  }
}
</style>
