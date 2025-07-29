<template>
  <nav class="breadcrumb-nav" aria-label="Breadcrumb navigation">
    <ol class="breadcrumb-list">
      <li 
        v-for="(crumb, index) in breadcrumbs" 
        :key="crumb.to || crumb.text"
        class="breadcrumb-item"
      >
        <!-- Current page (not a link) -->
        <span 
          v-if="index === breadcrumbs.length - 1"
          class="breadcrumb-current"
          :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
        >
          {{ crumb.text }}
        </span>
        
        <!-- Navigable breadcrumb -->
        <router-link 
          v-else-if="crumb.to"
          :to="crumb.to"
          class="breadcrumb-link"
          :aria-label="`Go to ${crumb.text}`"
        >
          {{ crumb.text }}
        </router-link>
        
        <!-- Non-navigable breadcrumb (fallback) -->
        <span 
          v-else
          class="breadcrumb-text"
        >
          {{ crumb.text }}
        </span>
        
        <!-- Separator -->
        <span 
          v-if="index < breadcrumbs.length - 1"
          class="breadcrumb-separator"
          aria-hidden="true"
        >
          /
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
export interface BreadcrumbItem {
  text: string
  to?: string
  ariaLabel?: string
}

interface Props {
  breadcrumbs: BreadcrumbItem[]
}

defineProps<Props>()
</script>

<style scoped>
.breadcrumb-nav {
  margin-bottom: 1rem;
  padding: 0.75rem 0;
}

.breadcrumb-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
  gap: 0.5rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.breadcrumb-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.breadcrumb-link:hover {
  background: #f8f9fa;
  text-decoration: underline;
}

.breadcrumb-link:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
  background: #f8f9fa;
}

.breadcrumb-current {
  color: #6b7280;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.breadcrumb-text {
  color: #6b7280;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.breadcrumb-separator {
  color: #9ca3af;
  font-weight: 400;
  user-select: none;
  margin: 0 0.25rem;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .breadcrumb-nav {
    margin-bottom: 0.75rem;
    padding: 0.5rem 0;
  }
  
  .breadcrumb-list {
    gap: 0.25rem;
  }
  
  .breadcrumb-link,
  .breadcrumb-current,
  .breadcrumb-text {
    padding: 0.125rem 0.375rem;
    font-size: 0.875rem;
    min-height: 36px;
  }
  
  .breadcrumb-separator {
    margin: 0 0.125rem;
    font-size: 0.875rem;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .breadcrumb-link {
    border: 1px solid #3498db;
  }
  
  .breadcrumb-current,
  .breadcrumb-text {
    border: 1px solid #6b7280;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .breadcrumb-link {
    transition: none;
  }
}
</style>