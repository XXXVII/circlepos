import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/book/:id',
      name: 'book-detail',
      component: () => import('../views/BookDetailView.vue'),
    },
  ],
})

export default router
