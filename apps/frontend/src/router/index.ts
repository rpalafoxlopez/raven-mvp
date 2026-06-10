import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: () => import('@/views/LandingView.vue')
    },
    {
      path: '/quiz',
      name: 'Quiz',
      component: () => import('@/views/QuizView.vue')
    },
    {
      path: '/resultado',
      name: 'Resultado',
      component: () => import('@/views/ResultView.vue'),
      meta: { requiresQuiz: true }
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: () => import('@/views/CheckoutView.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true, requiresPlan: ['premium', 'pro'] }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Requiere haber completado el quiz
  if (to.meta.requiresQuiz) {
    const quizStore = JSON.parse(localStorage.getItem('quiz-result') || '{}')
    if (!quizStore.diagnostico) {
      return next('/quiz')
    }
  }

  // Requiere auth
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/')
  }

  // Requiere plan premium/pro
  if (to.meta.requiresPlan) {
    const plans = to.meta.requiresPlan as string[]
    if (!plans.includes(authStore.user?.plan || 'free')) {
      return next('/checkout')
    }
  }

  next()
})

export default router
