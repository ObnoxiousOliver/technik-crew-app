import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    name: 'login',
    path: '/login',
    component: LoginView,
    meta: {
      requiresNoAuth: true,
      title: 'Anmelden',
      depth: 0
    }
  },
  {
    name: 'sign-up',
    alias: '/sign-up',
    path: '/sign-up/enter-code',
    component: () => import('../views/auth/signUp/EnterCodeView.vue'),
    meta: {
      requiresNoAuth: true,
      title: 'Registrieren',
      depth: 1
    }
  },

  {
    path: '/',
    redirect: '/dashboard',
    component: () => import('../views/UserView.vue'),
    meta: {
      requiresAuth: true,
      depth: 10
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
        component: () => import('../views/EventView.vue'),
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
    component: () => import('../views/settings/SettingsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Einstellungen',
      depth: 11,
      defaultBackPath: '/dashboard'
    }
  },

  {
    name: 'profile',
    path: '/settings/profile',
    component: () => import('../views/settings/ProfileView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Profil',
      depth: 100,
      defaultBackPath: '/settings'
    }
  },

  {
    name: 'reset-password',
    path: '/reset-password',
    component: () => import('../views/auth/ResetPasswordView.vue'),
    meta: {
      title: 'Passwort zurücksetzen',
      depth: 100,
      defaultBackPath: '/settings'
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
  } else if (to.matched.some(record => record.meta.requiresNoAuth)) {
    if (getAuth().currentUser) {
      next('/')
      console.log('[Router]', 'User logged in')
    } else {
      onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          next('/')
          console.log('[Router]', 'User logged in')
        } else {
          next()
          console.log('[Router]', 'User not logged in')
        }
      })()
    }
  } else {
    next()
  }
})

router.beforeEach((to, from) => {
  let transitionName: string | undefined = to.meta.transition as string | undefined

  if (!transitionName) {
    const toDepth: number = to.meta.depth as number ?? to.path.split('/').length
    const fromDepth: number = from.meta.depth as number ?? to.path.split('/').length
    const depthDiff = fromDepth - toDepth

    transitionName = depthDiff <= 0 ? 'slide-left' : 'slide-right'
  }

  if (transitionName) {
    to.meta.transitionName = transitionName
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
