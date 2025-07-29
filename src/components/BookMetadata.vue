<template>
  <section class="book-meta" aria-labelledby="book-info-title">
    <h3 id="book-info-title" class="sr-only">Book Information</h3>
    <dl class="meta-list">
      <div class="meta-item">
        <dt class="meta-label">ISBN:</dt>
        <dd class="meta-value">{{ book.isbn }}</dd>
      </div>
      <div class="meta-item">
        <dt class="meta-label">Price:</dt>
        <dd class="meta-value price">${{ book.price.toFixed(2) }}</dd>
      </div>
      <div class="meta-item">
        <dt class="meta-label">In Stock:</dt>
        <dd
          class="meta-value"
          :class="{ 'low-stock': book.availableStock < 5 }"
          :aria-label="
            book.availableStock < 5
              ? `Low stock: ${book.availableStock} copies remaining`
              : `${book.availableStock} copies available`
          "
        >
          {{ book.availableStock }} copies
        </dd>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
import type { Book } from '@/types/book'

interface Props {
  book: Book
}

defineProps<Props>()
</script>

<style scoped>
.book-meta {
  margin: 2rem 0;
}

.meta-list {
  margin: 0;
  padding: 0;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
  gap: 1rem;
}

.meta-item:last-child {
  border-bottom: none;
}

.meta-label {
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.meta-value {
  font-weight: 500;
  color: #1f2937;
  margin: 0;
}

.meta-value.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #059669;
}

.meta-value.low-stock {
  color: #dc2626;
  font-weight: 600;
}

@media (max-width: 768px) {
  .meta-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.75rem 0;
    gap: 0.25rem;
  }
}
</style>
