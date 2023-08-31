import { Permission } from '@/model/permissions'
import { createRouter } from './router'
import { useDev } from '@/stores/developer'

const { router, back, getLastPageOfRoot, temporaryRoute } = createRouter([
  // Auth
  {
    title: 'Anmelden',
    name: 'login',
    component: () => import('../views/auth/LoginView.vue' /* webpackChunkName: "login" */),
    requiresAuth: false,
    depth: -1,
    offlineVisible: true,

    children: [
      // Reset password
      {
        title: 'Passwort zurücksetzen',
        name: 'reset-password',
        path: '/reset-password',
        component: () => import('../views/auth/ResetPasswordView.vue' /* webpackChunkName: "reset-password" */),
        requiresAuth: null,
        depth: 9999,
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
        component: () => import('../views/auth/signUp/EnterCodeView.vue' /* webpackChunkName: "sign-up-code" */),

        children: [
          {
            name: 'sign-up-email',
            path: '/sign-up/email',
            component: () => import('../views/auth/signUp/EnterEmailView.vue' /* webpackChunkName: "sign-up-email" */),

            children: [
              {
                name: 'sign-up-password',
                path: '/sign-up/password',
                component: () => import('../views/auth/signUp/EnterPasswordView.vue' /* webpackChunkName: "sign-up-password" */)
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
    component: () => import('../views/wiki/WikiView.vue' /* webpackChunkName: "wiki" */),
    requiresAuth: true,
    offlineVisible: true,

    children: [
      {
        name: 'wiki-page',
        pathName: '/:id',
        component: () => import('../views/wiki/WikiPageView.vue' /* webpackChunkName: "wiki-page" */),

        children: [
          {
            name: 'wiki-page-edit',
            pathName: '/edit',
            depth: 10,
            component: () => import('../views/wiki/WikiPageEditView.vue' /* webpackChunkName: "wiki-page-edit" */)
          },
          {
            name: 'wiki-page-details',
            pathName: '/details',
            component: () => import('../views/wiki/WikiPageDetailsView.vue' /* webpackChunkName: "wiki-page-details" */),

            children: [
              {
                name: 'wiki-page-history',
                pathName: '/history',
                component: () => import('../views/wiki/WikiPageHistoryView.vue' /* webpackChunkName: "wiki-page-history" */)
              }
            ]
          }
        ]
      },
      {
        name: 'wiki-archive',
        pathName: '/archive',
        component: () => import('../views/wiki/WikiArchiveView.vue' /* webpackChunkName: "wiki-archive" */)
      },
      {
        title: 'Neue Seite',
        name: 'wiki-page-new',
        pathName: '/new',
        component: () => import('../views/wiki/WikiPageNewView.vue')
      }
    ]
  },

  // Event
  {
    title: 'Termine',
    name: 'events',
    component: () => import('../views/events/EventsView.vue' /* webpackChunkName: "events" */),
    requiresAuth: true,
    offlineVisible: true,

    children: [
      {
        title: 'Neuer Termin',
        name: 'events-add',
        pathName: 'add',
        component: () => import('../views/events/EventsAddView.vue' /* webpackChunkName: "events-add" */)
      },
      {
        title: 'Terminarchiv',
        name: 'events-archive',
        pathName: 'archive',
        component: () => import('../views/events/EventsArchiveView.vue' /* webpackChunkName: "events-archive" */)
      },
      {
        title: 'Termin',
        name: 'events-details',
        pathName: '/:id',
        component: () => import('../views/events/EventsDetailView.vue' /* webpackChunkName: "events-detail" */),
        children: [
          {
            title: 'Termin bearbeiten',
            name: 'events-edit',
            pathName: '/edit/:field?',
            component: () => import('../views/events/EventsEditView.vue' /* webpackChunkName: "events-edit" */)
          },
          {
            title: 'Termin Teilnehmer',
            name: 'events-history',
            pathName: '/history',
            component: () => import('../views/events/EventsHistoryView.vue' /* webpackChunkName: "events-history" */)
          }
        ]
      }
    ]
  },

  // Dashboard
  {
    title: 'Dashboard',
    name: 'dashboard',
    alias: '/',
    component: () => import('../views/DashboardView.vue' /* webpackChunkName: "dashboard" */),
    requiresAuth: true,
    offlineVisible: true
  },

  // // Equipment
  // {
  //   title: 'Equipment',
  //   name: 'equipment',
  //   path: '/equipment',
  //   component: () => import('../views/equipment/EquipmentView.vue' /* webpackChunkName: "equipment" */),
  //   requiresAuth: true,
  //   offlineVisible: true,

  //   children: [
  //     {
  //       title: 'Neues Equipment',
  //       name: 'equipment-add',
  //       pathName: 'add',
  //       component: () => import('../views/equipment/EquipmentAddView.vue' /* webpackChunkName: "equipment-add" */)
  //     },
  //     {
  //       title: 'Equipment Details',
  //       name: 'equipment-details',
  //       path: '/equipment/:id',
  //       component: () => import('../views/equipment/EquipmentDetailsView.vue' /* webpackChunkName: "equipment-details" */),
  //       offlineVisible: true,
  //       children: [
  //         {
  //           title: 'Equipment Verlauf',
  //           name: 'equipment-history',
  //           path: '/equipment/:id/history',
  //           component: () => import('../views/equipment/EquipmentHistoryView.vue' /* webpackChunkName: "equipment-history" */),
  //           offlineVisible: true
  //         },
  //         {
  //           title: 'Equipment bearbeiten',
  //           name: 'equipment-edit',
  //           path: '/equipment/:id/edit/:field?',
  //           component: () => import('../views/equipment/EquipmentEditView.vue' /* webpackChunkName: "equipment-edit" */),

  //           children: [
  //             {
  //               title: 'Standort ändern',
  //               name: 'equipment-edit-location',
  //               path: '/equipment/:id/edit/location',
  //               component: () => import('../views/equipment/EquipmentEditLocationView.vue' /* webpackChunkName: "equipment-edit-location" */)
  //             }
  //           ]
  //         },
  //         {
  //           title: 'Equipment Anzahl Teilen',
  //           name: 'equipment-split',
  //           path: '/equipment/:id/split',
  //           component: () => import('../views/equipment/EquipmentSplitView.vue' /* webpackChunkName: "equipment-split" */)
  //         }
  //       ]
  //     },
  //     {
  //       title: 'Equipment Code Scannen',
  //       name: 'equipment-scan',
  //       pathName: '/scan',
  //       component: () => import('../views/equipment/EquipmentScanView.vue' /* webpackChunkName: "equipment-scan" */)
  //     },

  //     // Locations
  //     {
  //       title: 'Standorte',
  //       name: 'locations',
  //       path: '/locations',
  //       component: () => import('../views/LocationsView.vue' /* webpackChunkName: "locations" */),
  //       children: [
  //         {
  //           title: 'Neuer Standort',
  //           name: 'location-add',
  //           path: '/locations/add',
  //           component: () => import('../views/LocationAddView.vue' /* webpackChunkName: "location-add" */)
  //         },
  //         {
  //           title: 'Standort bearbeiten',
  //           name: 'location-edit',
  //           path: '/locations/:id',
  //           component: () => import('../views/LocationEditView.vue' /* webpackChunkName: "location-edit" */)
  //         },
  //         {
  //           title: 'Standortverlauf',
  //           name: 'location-history',
  //           path: '/locations/:id/history',
  //           component: () => import('../views/LocationHistoryView.vue' /* webpackChunkName: "location-history" */)
  //         }
  //       ]
  //     }
  //   ]
  // },

  {
    title: 'Inventar',
    name: 'inventory',
    component: () => import('../views/inventory/InventoryView.vue' /* webpackChunkName: "inventory" */),
    requiresAuth: true,

    children: [
      {
        title: 'Kollektion erstellen',
        name: 'inventory-create',
        pathName: 'create',
        component: () => import('../views/inventory/InventoryCreateView.vue' /* webpackChunkName: "inventory-create" */)
      },
      {
        title: 'Kollektion',
        name: 'inventory-collection',
        pathName: '/:id',
        component: () => import('../views/inventory/InventoryCollectionView.vue' /* webpackChunkName: "inventory-collection" */),

        children: [{
          title: 'Gegenstand',
          name: 'inventory-item-details',
          pathName: 'item/:itemId',
          component: () => import('../views/inventory/InventoryItemDetailsView.vue' /* webpackChunkName: "inventory-item-details" */)
        }]
      },
      {
        title: 'Gegenstand erstellen',
        name: 'inventory-item-create',
        pathName: 'create-item',
        depth: 2.1,
        component: () => import('../views/inventory/InventoryItemCreateView.vue' /* webpackChunkName: "inventory-item-create" */)
      }
    ]
  },

  // Settings
  {
    depth: 999,
    title: 'Einstellungen',
    name: 'settings',
    path: '/settings',
    component: () => import('../views/settings/SettingsView.vue' /* webpackChunkName: "settings" */),
    requiresAuth: true,
    backPath: '/dashboard',
    offlineVisible: true,
    meta: {
      noRootTransition: true
    },

    children: [
      // Profile
      {
        title: 'Profil',
        name: 'profile',
        path: '/settings/profile',
        component: () => import('../views/settings/profile/ProfileView.vue' /* webpackChunkName: "profile" */),

        children: [
          {
            title: 'Profil bearbeiten',
            name: 'profile-edit',
            path: '/settings/profile/edit',
            component: () => import('../views/settings/profile/ProfileEditView.vue' /* webpackChunkName: "profile-edit" */)
          },
          {
            title: 'E-Mail Adresse ändern',
            name: 'profile-email',
            path: '/settings/profile/email',
            component: () => import('../views/settings/profile/ProfileEmailView.vue' /* webpackChunkName: "profile-email" */)
          }
        ]
      },

      // Developer
      {
        title: 'Entwickler Einstellungen',
        name: 'dev-settings',
        pathName: '/dev',
        validate: () => useDev().enabled,
        component: () => import('../views/developer/DeveloperSettingsView.vue' /* webpackChunkName: "dev-settings" */),
        offlineVisible: true
      },

      // Admin
      // Tickets
      {
        title: 'Tickets',
        name: 'tickets',
        path: '/admin/tickets',
        component: () => import('../views/admin/tickets/TicketsView.vue' /* webpackChunkName: "tickets" */),
        requiresPermission: Permission.ManageTickets,

        children: [
          {
            title: 'Ticket erstellen',
            name: 'ticket-create',
            path: '/admin/tickets/create',
            component: () => import('../views/admin/tickets/TicketCreateView.vue' /* webpackChunkName: "ticket-create" */)
          }
        ]
      },

      // Users
      {
        title: 'Benutzer verwalten',
        name: 'users',
        path: '/admin/users',
        component: () => import('../views/admin/users/UsersView.vue' /* webpackChunkName: "users" */),
        requiresAuth: true,
        requiresPermission: Permission.ManageUsers,

        children: [
          {
            title: 'Benutzer verwalten',
            name: 'user-manage',
            path: '/admin/users/:username',
            component: () => import('../views/admin/users/UserManageView.vue' /* webpackChunkName: "user-manage" */),
            requiresAuth: true
          }
        ]
      }
    ]
  },

  // Help
  {
    title: 'Hilfe',
    name: 'help',
    component: () => import('../views/help/HelpView.vue' /* webpackChunkName: "help" */),
    offlineVisible: true,
    depth: 99999,

    children: [
      // Offline Modus
      {
        title: 'Offline Modus',
        name: 'help-offline',
        pathName: '/offline',
        component: () => import('../views/help/HelpOfflineView.vue' /* webpackChunkName: "help-offline" */)
      },

      // Who are the admins
      {
        title: 'Wer sind die Admins?',
        name: 'help-admins',
        pathName: '/admins',
        component: () => import('../views/help/HelpAdminsView.vue' /* webpackChunkName: "help-admins" */)
      }
    ]
  },

  // 404
  {
    name: '404',
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFoundView.vue' /* webpackChunkName: "not-found" */),
    depth: Infinity,
    backPath: null,
    offlineVisible: true,
    meta: {
      noRootTransition: true
    }
  }
])

export default router
export { back, getLastPageOfRoot, temporaryRoute }
