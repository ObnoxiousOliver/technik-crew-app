import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/change-password',
    name: 'change-password',
    component: () => import('../views/ChangePasswordView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dashboard',
    alias: '/',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (getAuth().currentUser) {
      next()
      console.log('[Router]', 'User logged in')
    } else {
      onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          next()
          console.log('[Router]', 'User logged in')
        } else {
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
          console.log('[Router]', 'User not logged in')
        }
      })()
    }
  } else {
    next()
  }
})

export default router
