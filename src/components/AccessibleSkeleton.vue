<template>
  <div
    class="skeleton-container"
    role="status"
    aria-live="polite"
    :aria-label="ariaLabel"
  >
    <span class="sr-only">{{ loadingMessage }}</span>

    <!-- Book Card Skeleton -->
    <div v-if="type === 'book-card'" class="skeleton-book-card">
      <div class="skeleton-image"></div>
      <div class="skeleton-line skeleton-title"></div>
      <div class="skeleton-line skeleton-author"></div>
      <div class="skeleton-line skeleton-price"></div>
      <div class="skeleton-button"></div>
    </div>

    <!-- Book Grid Skeleton -->
    <div v-else-if="type === 'book-grid'" class="skeleton-book-grid">
      <div v-for="n in count" :key="n" class="skeleton-book-card">
        <div class="skeleton-image"></div>
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-author"></div>
        <div class="skeleton-line skeleton-price"></div>
        <div class="skeleton-button"></div>
      </div>
    </div>

    <!-- Book Detail Skeleton -->
    <div v-else-if="type === 'book-detail'" class="skeleton-book-detail">
      <div class="skeleton-line skeleton-breadcrumb"></div>
      <div class="skeleton-detail-layout">
        <div class="skeleton-image skeleton-large-image"></div>
        <div class="skeleton-detail-content">
          <div class="skeleton-line skeleton-large-title"></div>
          <div class="skeleton-line skeleton-author"></div>
          <div class="skeleton-line skeleton-price"></div>
          <div class="skeleton-button"></div>
        </div>
      </div>
    </div>

    <!-- Generic Spinner (fallback) -->
    <div v-else class="skeleton-spinner">
      <div class="spinner-ring"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'book-card' | 'book-grid' | 'book-detail' | 'spinner'
  count?: number
  loadingMessage?: string
  ariaLabel?: string
}

withDefaults(defineProps<Props>(), {
  type: 'spinner',
  count: 5,
  loadingMessage: 'Loading content, please wait...',
  ariaLabel: 'Loading',
})
</script>

<style scoped>
.skeleton-container {
  width: 100%;
}

/* Book Grid Skeleton */
.skeleton-book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}

/* Book Card Skeleton */
.skeleton-book-card {
  width: 100%;
  max-width: 200px;
  gap: 0.75rem;
}

.skeleton-book-card > * {
  margin-bottom: 0.75rem;
}

.skeleton-book-card > *:last-child {
  margin-bottom: 0;
}

/* Basic skeleton elements */
.skeleton-image {
  width: 100%;
  height: 240px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-line {
  height: 1rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-title {
  height: 1.25rem;
  width: 90%;
}

.skeleton-author {
  height: 1rem;
  width: 70%;
}

.skeleton-price {
  height: 1.125rem;
  width: 50%;
}

.skeleton-button {
  height: 2.5rem;
  width: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}

/* Book Detail Skeleton */
.skeleton-book-detail {
  width: 100%;
  gap: 2rem;
}

.skeleton-book-detail > * {
  margin-bottom: 2rem;
}

.skeleton-book-detail > *:last-child {
  margin-bottom: 0;
}

.skeleton-breadcrumb {
  width: 30%;
  height: 1rem;
}

.skeleton-detail-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
}

.skeleton-large-image {
  height: 400px;
}

.skeleton-detail-content > * {
  margin-bottom: 1.5rem;
}

.skeleton-detail-content > *:last-child {
  margin-bottom: 0;
}

.skeleton-large-title {
  height: 2rem;
  width: 80%;
}

@media (max-width: 768px) {
  .skeleton-detail-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

/* Spinner */
.skeleton-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.spinner-ring {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Animations */
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .skeleton-image,
  .skeleton-line,
  .skeleton-button {
    animation: none;
    background: #e0e0e0;
  }

  .spinner-ring {
    animation: none;
    border-top-color: #3498db;
  }
}
</style>
