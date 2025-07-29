<template>
  <section class="hero-section">
    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            Discover Your Next
            <span class="highlight">Great Read</span>
          </h1>
          <p class="hero-subtitle">
            From bestsellers to hidden gems, explore our curated collection of
            books that inspire, educate, and entertain. Join thousands of
            readers in their literary journey.
          </p>
          <div>
            <button class="cta-button primary" @click="$emit('browse-books')">
              Browse Collection
              <svg
                class="button-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineEmits<{
  'browse-books': []
}>()
</script>

<style scoped>
.hero-section {
  display: flex;
  align-items: center;
  min-height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-content {
  padding: 3rem 0;
}

.hero-text {
  color: white;
}

.hero-title {
  margin-bottom: 1.5rem;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.highlight {
  display: block;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  max-width: 600px;
  margin-bottom: 2.5rem;
  font-size: 1.125rem;
  line-height: 1.6;
  opacity: 0.9;
}

.cta-button {
  display: flex;
  align-items: center;
  padding: 0.875rem 2rem;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 0.5rem;
}

.cta-button.primary {
  border-color: white;
  background: white;
  color: #667eea;
}

.cta-button.primary:hover {
  border-color: white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  background: transparent;
  color: white;
  transform: translateY(-2px);
}

.cta-button.secondary {
  border-color: rgba(255, 255, 255, 0.5);
  background: transparent;
  color: white;
}

.cta-button.secondary:hover {
  border-color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.button-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.3s ease;
}

.cta-button.primary:hover .button-icon {
  transform: translateX(4px);
}

/* Desktop styles */
@media (min-width: 768px) {
  .hero-title {
    font-size: 3.5rem;
  }
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 4rem;
  }
}
</style>
