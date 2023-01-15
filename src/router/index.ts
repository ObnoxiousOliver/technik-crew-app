import { Permission } from '@/model/permissions'
import { useUser } from '@/stores/user'
import { setStore } from '@/utilities/auth'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { createRouter, createWebHistory, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  // Login
  {
    name: 'login',
    path: '/login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: {
      requiresNoAuth: true,
      title: 'Anmelden',
      depth: 0
    }
  },

  // Sign up
  {
    name: 'sign-up-code',
    alias: '/sign-up',
    path: '/sign-up/code/:code?',
    component: () => import('../views/auth/signUp/EnterCodeView.vue'),
    meta: {
      requiresNoAuth: true,
      title: 'Registrieren',
      depth: 1,
      defaultBackPath: '/login'
    }
  },
  {
    name: 'sign-up-email',
    alias: '/sign-up',
    path: '/sign-up/email',
    component: () => import('../views/auth/signUp/EnterEmailView.vue'),
    meta: {
      requiresNoAuth: true,
      title: 'Registrieren',
      depth: 2,
      defaultBackPath: '/sign-up/code'
    }
  },
  {
    name: 'sign-up-password',
    alias: '/sign-up',
    path: '/sign-up/password',
    component: () => import('../views/auth/signUp/EnterPasswordView.vue'),
    meta: {
      requiresNoAuth: true,
      title: 'Registrieren',
      depth: 3,
      defaultBackPath: '/sign-up/email'
    }
  },

  // Dashboard
  {
    name: 'dashboard',
    path: '/dashboard',
    alias: '/',
    component: () => import('../views/DashboardView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard',
      showNavbar: true,
      depth: 7,
      linearTransition: true
    }
  },

  // Event
  {
    name: 'events',
    path: '/events',
    component: () => import('../views/EventView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Termine',
      showNavbar: true,
      depth: 6,
      linearTransition: true
    }
  },
  {
    name: 'new-event',
    path: '/events/new',
    component: () => import('../views/NewEventView.vue'),
    meta: {
      requriesAuth: true,
      title: 'Neuer Termin',
      depth: 10,
      defaultBackPath: '/events',
      showNavbar: true
    }
  },

  // Equipment
  {
    name: 'equipment',
    path: '/equipment',
    component: () => import('../views/EquipmentView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Equipment',
      showNavbar: true,
      depth: 8,
      linearTransition: true
    }
  },
  {
    name: 'equipment-add',
    path: '/equipment/add',
    component: () => import('../views/EquipmentAddView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Neues Equipment',
      depth: 10,
      defaultBackPath: '/equipment',
      showNavbar: true
    }
  },
  {
    name: 'equipment-details',
    path: '/equipment/:id',
    component: () => import('../views/EquipmentDetailsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Equipment Details',
      depth: 10,
      defaultBackPath: '/equipment',
      showNavbar: true
    }
  },

  // Wiki
  {
    name: 'wiki',
    path: '/wiki',
    component: () => import('../views/DashboardView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Wiki',
      showNavbar: true,
      depth: 5,
      linearTransition: true
    }
  },

  // Settings
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

  // Profile
  {
    name: 'profile',
    path: '/settings/profile',
    component: () => import('../views/settings/profile/ProfileView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Profil',
      depth: 100,
      defaultBackPath: '/settings'
    }
  },
  {
    name: 'profile-edit',
    path: '/settings/profile/edit',
    component: () => import('../views/settings/profile/ProfileEditView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Profil bearbeiten',
      depth: 101,
      defaultBackPath: '/settings/profile'
    }
  },
  {
    name: 'profile-email',
    path: '/settings/profile/email',
    component: () => import('../views/settings/profile/ProfileEmailView.vue'),
    meta: {
      requiresAuth: true,
      title: 'E-Mail Adresse ändern',
      depth: 101,
      defaultBackPath: '/settings/profile'
    }
  },

  // Reset password
  {
    name: 'reset-password',
    path: '/reset-password',
    component: () => import('../views/auth/ResetPasswordView.vue'),
    meta: {
      title: 'Passwort zurücksetzen',
      depth: 1000,
      defaultBackPath: '/settings'
    }
  },

  // Who are the admins
  {
    name: 'who-are-the-admins',
    path: '/admin/who',
    component: () => import('../views/WhoAreTheAdminsView.vue'),
    meta: {
      title: 'Passwort zurücksetzen',
      depth: 1001,
      defaultBackPath: '/'
    }
  },

  // Admin
  // Tickets
  {
    name: 'tickets',
    path: '/admin/tickets',
    component: () => import('../views/admin/tickets/TicketsView.vue'),
    meta: {
      requiresAuth: true,
      requiresPermission: 'create_tickets' as Permission,
      title: 'Tickets',
      depth: 100,
      defaultBackPath: '/settings'
    }
  },
  {
    name: 'ticket-create',
    path: '/admin/tickets/create',
    component: () => import('../views/admin/tickets/TicketCreateView.vue'),
    meta: {
      requiresAuth: true,
      requiresPermission: 'create_tickets' as Permission,
      title: 'Ticket erstellen',
      depth: 101,
      defaultBackPath: '/admin/tickets'
    }
  },
  // Users
  {
    name: 'users',
    path: '/admin/users',
    component: () => import('../views/admin/users/UsersView.vue'),
    meta: {
      requiresAuth: true,
      requiresPermission: 'manage_users' as Permission,
      title: 'Benutzer verwalten',
      depth: 100,
      defaultBackPath: '/settings'
    }
  },
  {
    name: 'user-manage',
    path: '/admin/users/:username',
    component: () => import('../views/admin/users/UserManageView.vue'),
    meta: {
      requiresAuth: true,
      requiresPermission: 'manage_users' as Permission,
      title: 'Benutzer verwalten',
      depth: 101,
      defaultBackPath: '/admin/users'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  console.log(localStorage.getItem('last_auth'))

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (getAuth().currentUser) {
      next()
      console.log('[Router]', 'User logged in')
    } else if (localStorage.getItem('last_auth') === 'true') {
      next()
      console.log('[Router]', 'User logged in')
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      console.log('[Router]', 'User not logged in')
    }
  } else if (to.matched.some(record => record.meta.requiresNoAuth)) {
    if (getAuth().currentUser) {
      next(from)
      console.log('[Router]', 'User logged in')
    } else if (localStorage.getItem('last_auth') === 'true') {
      next(from)
      console.log('[Router]', 'User logged in')
    } else {
      next()
      console.log('[Router]', 'User not logged in')
    }
  } else {
    next()
  }
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresPermission)) {
    const permission = to.meta.requiresPermission as Permission
    const user = useUser()

    if (!user.user) {
      await setStore()
    }

    if (user.permissions?.is_admin) {
      next()
      console.log('[Router]', 'User is admin')
    } else if (user.permissions?.[permission]) {
      next()
      console.log('[Router]', 'User has permission')
    } else {
      next(from)
      console.log('[Router]', 'User has no permission')
    }
  } else {
    next()
  }
})

router.beforeEach((to, from) => {
  let transitionName = to.meta.transition as string | undefined

  const toDepth: number = to.meta.depth as number ?? to.path.split('/').length
  const fromDepth: number = from.meta.depth as number ?? to.path.split('/').length
  const depthDiff = fromDepth - toDepth

  if (!transitionName) {
    transitionName = depthDiff <= 0 ? 'slide-left' : 'slide-right'
  }

  if (from.meta.linearTransition && to.meta.linearTransition) {
    transitionName = depthDiff <= 0 ? 'linear-slide-left' : 'linear-slide-right'
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

export function back (fallbackPath?: string) {
  const route = router.currentRoute.value
  console.log('[Router]', 'Back', history.state.back, fallbackPath, route.meta.defaultBackPath)
  if (history.state.back) {
    router.back()
  } else {
    router.replace(fallbackPath ?? route.meta.defaultBackPath ?? '/')
  }
}

export default router
