import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    name: 'login',
    path: '/login',
    component: LoginView
  },
  {
    path: '/',
    redirect: '/dashboard',
    component: () => import('../views/UserView.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        name: 'dashboard',
        path: '/dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    name: 'reset-password',
    path: '/reset-password',
    component: () => import('../views/ResetPasswordView.vue')
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
