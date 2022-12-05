import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc } from 'firebase/firestore'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    name: 'login',
    path: '/login',
    component: LoginView,
    meta: {
      title: 'Anmelden'
    }
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
          requiresAuth: true,
          title: 'Dashboard'
        }
      },
      {
        name: 'events',
        path: '/events',
        component: () => import('../views/DashboardView.vue'),
        meta: {
          requiresAuth: true,
          title: 'Termine'
        }
      },
      {
        name: 'equipment',
        path: '/equipment',
        component: () => import('../views/DashboardView.vue'),
        meta: {
          requiresAuth: true,
          title: 'Equipment'
        }
      },
      {
        name: 'wiki',
        path: '/wiki',
        component: () => import('../views/DashboardView.vue'),
        meta: {
          requiresAuth: true,
          title: 'Wiki'
        }
      }
    ]
  },

  {
    name: 'settings',
    path: '/settings',
    component: () => import('../views/DashboardView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Einstellungen'
    }
  },

  {
    name: 'reset-password',
    path: '/reset-password',
    component: () => import('../views/ResetPasswordView.vue'),
    meta: {
      title: 'Passwort zurücksetzen'
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

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  } else {
    document.title = 'Technik Crew'
  }
})

export default router
