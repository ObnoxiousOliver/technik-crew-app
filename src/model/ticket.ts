import { Gender } from './user'

export interface TicketDB {
  username: string
  firstname: string
  lastname: string
  prefer_lastname: string
  gender: Gender
  invalid?: boolean
}
