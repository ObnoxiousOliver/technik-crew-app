export type Permission =
  'is_admin' |
  'manage_tickets' |
  'manage_users'

export type PermissionsDB = {
  [key in Permission]?: boolean
}
