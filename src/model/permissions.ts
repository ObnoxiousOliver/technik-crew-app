export enum Permission {
  IsAdmin = 'is_admin',
  ManageTickets = 'manage_tickets',
  ManageUsers = 'manage_users'
}

export type PermissionsDB = {
  [key in Permission]?: boolean
}

export interface PermissionInfo {
  name: string
  description: string
  icon: string
}

export const permissionInfo = {
  [Permission.IsAdmin]: {
    name: 'Admin',
    description: 'Hat alle Rechte',
    icon: 'mdi-account-cog'
  },
  [Permission.ManageTickets]: {
    name: 'Ticket Manager',
    description: 'Kann Tickets verwalten',
    icon: 'mdi-ticket-account'
  },
  [Permission.ManageUsers]: {
    name: 'User Manager',
    description: 'Kann Benutzer verwalten und Rechte vergeben',
    icon: 'mdi-account-group'
  }
}
