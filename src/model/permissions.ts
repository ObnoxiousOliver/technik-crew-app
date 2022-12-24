export type Permission =
  'is_admin' |
  'create_tickets'

export type PermissionsDB = {
  [key in Permission]?: boolean
}
