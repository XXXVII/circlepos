<template>
  <header class="app-header" role="banner">
    <!-- Main Header -->
    <div class="main-header">
      <div class="container">
        <div class="header-content">
          <!-- Logo with proper heading -->
          <h1 class="site-title">
            <router-link
              to="/"
              class="logo"
              aria-label="CirclePOS Bookstore - Go to homepage"
            >
              <div class="logo-icon" aria-hidden="true">📚</div>
              <span class="logo-text">CirclePOS</span>
            </router-link>
          </h1>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  background: white;
}

.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
}

.main-header {
  background: white;
}

.header-content {
  display: flex;
  align-items: center;
  height: 4rem;
}

.site-title {
  margin: 0;
  font-size: inherit;
  font-weight: inherit;
}

.logo {
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  flex-shrink: 0;
  gap: 0.5rem;
  transition: opacity 0.2s ease;
}

.logo:hover {
  opacity: 0.8;
}

.logo:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
  border-radius: 4px;
}

.logo-icon {
  font-size: 2rem;
}

.logo-text {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .logo-text {
    font-size: 1.25rem;
  }
}
</style>
