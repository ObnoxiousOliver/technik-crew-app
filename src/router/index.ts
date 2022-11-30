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
    } else {
      onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          next()
        } else {
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
        }
      })()
    }
  } else {
    next()
  }
})

export default router
