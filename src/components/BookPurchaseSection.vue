<template>
  <section class="purchase-section" aria-labelledby="purchase-title">
    <h3 id="purchase-title" class="sr-only">Purchase Options</h3>
    <button
      @click="$emit('purchase')"
      :disabled="isPurchasing || book.availableStock === 0"
      class="purchase-btn"
      :class="{
        purchasing: isPurchasing,
        'out-of-stock': book.availableStock === 0,
      }"
      :aria-label="getPurchaseButtonLabel()"
      :aria-describedby="book.availableStock < 5 && book.availableStock > 0 ? 'low-stock-warning' : undefined"
    >
      <div class="btn-content">
        <div v-if="isPurchasing" class="btn-spinner" aria-hidden="true"></div>
        <span v-if="isPurchasing">Processing...</span>
        <span v-else-if="book.availableStock === 0">Out of Stock</span>
        <span v-else>Buy Now - ${{ book.price.toFixed(2) }}</span>
      </div>
    </button>
    
    <div 
      v-if="book.availableStock < 5 && book.availableStock > 0"
      id="low-stock-warning"
      class="stock-warning"
      role="status"
    >
      Only {{ book.availableStock }} copies left!
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Book } from '@/types/book'

interface Props {
  book: Book
  isPurchasing: boolean
}

interface Emits {
  purchase: []
}

const props = defineProps<Props>()
defineEmits<Emits>()

const getPurchaseButtonLabel = () => {
  if (props.isPurchasing) {
    return `Processing purchase for ${props.book.title}...`
  }
  
  if (props.book.availableStock === 0) {
    return `${props.book.title} is out of stock`
  }
  
  const stockInfo = props.book.availableStock < 5 
    ? `, only ${props.book.availableStock} copies remaining`
    : ''
    
  return `Purchase ${props.book.title} by ${props.book.author} for $${props.book.price.toFixed(2)}${stockInfo}`
}
</script>

<style scoped>
.purchase-section {
  margin: 2rem 0;
}

.purchase-btn {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.purchase-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.purchase-btn:active:not(:disabled) {
  transform: translateY(0);
}

.purchase-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.purchase-btn.out-of-stock {
  background: #6b7280;
}

.purchase-btn.purchasing {
  background: #10b981;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-spinner {
  width: 20px;
  height: 20px;
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

.stock-warning {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 6px;
  color: #92400e;
  font-weight: 600;
  text-align: center;
}

@media (max-width: 768px) {
  .purchase-btn {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
}
</style>