import { Permission } from '@/model/permissions'
import { createRouter } from './router'

const { router, back, getLastPageOfRoot } = createRouter([
  // Auth
  {
    title: 'Anmelden',
    name: 'login',
    component: () => import('../views/auth/LoginView.vue'),
    requiresAuth: false,
    depth: -1,

    children: [
      // Reset password
      {
        title: 'Passwort zurücksetzen',
        name: 'reset-password',
        path: '/reset-password',
        component: () => import('../views/auth/ResetPasswordView.vue'),
        requiresAuth: null,
        depth: Infinity,
        meta: {
          noRootTransition: true
        }
      },

      // Sign up
      {
        title: 'Registrieren',
        name: 'sign-up-code',
        alias: '/sign-up',
        path: '/sign-up/code/:code?',
        component: () => import('../views/auth/signUp/EnterCodeView.vue'),

        children: [
          {
            name: 'sign-up-email',
            path: '/sign-up/email',
            component: () => import('../views/auth/signUp/EnterEmailView.vue'),

            children: [
              {
                name: 'sign-up-password',
                path: '/sign-up/password',
                component: () => import('../views/auth/signUp/EnterPasswordView.vue')
              }
            ]
          }
        ]
      }
    ]
  },

  // Wiki
  {
    title: 'Wiki',
    name: 'wiki',
    component: () => import('../views/WikiView.vue'),
    requiresAuth: true,

    children: [
      {
        name: 'wiki-page',
        pathName: '/:id',
        component: () => import('../views/WikiPageView.vue'),

        children: [
          {
            name: 'wiki-page-edit',
            pathName: '/edit',
            component: () => import('../views/WikiPageEditView.vue')
          }
        ]
      },
      {
        title: 'Neue Seite',
        name: 'wiki-page-new',
        pathName: '/new',
        component: () => import('../views/WikiPageNewView.vue')
      }
    ]
  },

  // Event
  {
    title: 'Termine',
    name: 'events',
    component: () => import('../views/EventView.vue'),
    requiresAuth: true,

    children: [
      {
        title: 'Neuer Termin',
        name: 'event-new',
        pathName: 'new',
        component: () => import('../views/NewEventView.vue')
      },
      {
        title: 'Termin',
        name: 'event',
        pathName: '/:id',
        component: () => import('../views/EventView.vue')
      }
    ]
  },

  // Dashboard
  {
    title: 'Dashboard',
    name: 'dashboard',
    alias: '/',
    component: () => import('../views/DashboardView.vue'),
    requiresAuth: true
  },

  // Equipment
  {
    title: 'Equipment',
    name: 'equipment',
    path: '/equipment',
    component: () => import('../views/EquipmentView.vue'),
    requiresAuth: true,

    children: [
      {
        title: 'Neues Equipment',
        name: 'equipment-add',
        pathName: 'add',
        component: () => import('../views/EquipmentAddView.vue')
      },
      {
        title: 'Equipment Details',
        name: 'equipment-details',
        path: '/equipment/:id',
        component: () => import('../views/EquipmentDetailsView.vue')
      },

      // Locations
      {
        title: 'Standorte',
        name: 'locations',
        path: '/locations',
        component: () => import('../views/LocationsView.vue'),
        children: [
          {
            title: 'Neuer Standort',
            name: 'location-add',
            path: '/locations/add',
            component: () => import('../views/LocationAddView.vue')
          },
          {
            title: 'Standort details',
            name: 'location-details',
            path: '/locations/:id',
            component: () => import('../views/LocationDetailsView.vue')
          }
        ]
      }
    ]
  },

  // Settings
  {
    depth: 99999,
    title: 'Einstellungen',
    name: 'settings',
    path: '/settings',
    component: () => import('../views/settings/SettingsView.vue'),
    requiresAuth: true,
    backPath: '/dashboard',
    meta: {
      noRootTransition: true
    },

    children: [
      // Profile
      {
        title: 'Profil',
        name: 'profile',
        path: '/settings/profile',
        component: () => import('../views/settings/profile/ProfileView.vue'),

        children: [
          {
            title: 'Profil bearbeiten',
            name: 'profile-edit',
            path: '/settings/profile/edit',
            component: () => import('../views/settings/profile/ProfileEditView.vue')
          },
          {
            title: 'E-Mail Adresse ändern',
            name: 'profile-email',
            path: '/settings/profile/email',
            component: () => import('../views/settings/profile/ProfileEmailView.vue')
          }
        ]
      },

      // Admin
      // Tickets
      {
        title: 'Tickets',
        name: 'tickets',
        path: '/admin/tickets',
        component: () => import('../views/admin/tickets/TicketsView.vue'),
        requiresPermission: Permission.ManageTickets,

        children: [
          {
            title: 'Ticket erstellen',
            name: 'ticket-create',
            path: '/admin/tickets/create',
            component: () => import('../views/admin/tickets/TicketCreateView.vue')
          }
        ]
      },

      // Users
      {
        title: 'Benutzer verwalten',
        name: 'users',
        path: '/admin/users',
        component: () => import('../views/admin/users/UsersView.vue'),
        requiresAuth: true,
        requiresPermission: Permission.ManageUsers,

        children: [
          {
            title: 'Benutzer verwalten',
            name: 'user-manage',
            path: '/admin/users/:username',
            component: () => import('../views/admin/users/UserManageView.vue'),
            requiresAuth: true
          }
        ]
      },

      // Who are the admins
      {
        title: 'Wer sind die Admins?',
        name: 'admins-who',
        path: '/admin/who',
        component: () => import('../views/WhoAreTheAdminsView.vue')
      }
    ]
  },

  // 404
  {
    name: '404',
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFoundView.vue'),
    depth: Infinity,
    backPath: null,
    meta: {
      noRootTransition: true
    }
  }
])

export default router
export { back, getLastPageOfRoot }
