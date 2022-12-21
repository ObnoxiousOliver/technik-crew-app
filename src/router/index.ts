import { getAuth, onAuthStateChanged } from 'firebase/auth'
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
    name: 'new-event',
    path: '/events/new',
    component: () => import('../views/NewEventView.vue'),
    meta: {
      requriesAuth: true,
      title: 'Neuer Termin',
      depth: 10,
      defaultBackPath: '/events'
    }
  },
  {
    name: 'settings',
    path: '/settings',
    component: () => import('../views/SettingsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Einstellungen',
      depth: 10,
      defaultBackPath: '/dashboard'
    }
  },

  {
    name: 'profile',
    path: '/settings/profile',
    component: () => import('../views/ProfileView.vue'),
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
    component: () => import('../views/ResetPasswordView.vue'),
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
