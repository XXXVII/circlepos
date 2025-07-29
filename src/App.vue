<script setup lang="ts">
import { RouterView } from 'vue-router'
import NotificationContainer from '@/components/NotificationContainer.vue'
import { useFocusManagement } from '@/composables/useFocusManagement'

const { focusElement } = useFocusManagement()

const handleSkipToContent = (event: Event, targetId: string) => {
  event.preventDefault()
  focusElement(targetId)
}
</script>

<template>
  <!-- Skip navigation for keyboard users -->
  <div class="skip-links">
    <a 
      href="#main-content" 
      class="skip-link"
      @click="handleSkipToContent($event, 'main-content')"
    >
      Skip to main content
    </a>
    <a 
      href="#navigation" 
      class="skip-link"
      @click="handleSkipToContent($event, 'navigation')"
    >
      Skip to navigation
    </a>
  </div>
  
  <RouterView />
  <NotificationContainer />
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  margin: 0;
  background-color: #ffffff;
  color: #2c3e50;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  line-height: 1.6;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}

#app {
  width: 100%;
  min-height: 100vh;
  background: #fafafa;
}

a {
  color: #3498db;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Skip links for accessibility */
.skip-links {
  position: relative;
  z-index: 10000;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #2c3e50;
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 0 0 4px 4px;
  font-weight: 600;
  font-size: 14px;
  transition: top 0.3s ease;
  z-index: 10001;
  outline: none;
}

.skip-link:focus {
  top: 0;
  text-decoration: none;
  outline: 3px solid #3498db;
  outline-offset: 2px;
}

.skip-link:hover {
  background: #34495e;
  text-decoration: none;
}

/* Focus management styles */
[tabindex="-1"]:focus {
  outline: none;
}

/* Ensure focus indicators are visible */
button:focus,
input:focus,
select:focus,
textarea:focus,
a:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}
</style>
