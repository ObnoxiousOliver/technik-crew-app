import { Gender } from './user'

export interface TicketDB {
  username: string
  firstname: string
  lastname: string
  prefer_lastname: boolean
  gender: Gender
  invalid: boolean
}

export class Ticket implements TicketDB {
  username: string
  firstname: string
  lastname: string
  prefer_lastname: boolean
  gender: Gender
  invalid: boolean

  constructor (ticket: Partial<TicketDB>) {
    this.username = ticket.username ?? ''
    this.firstname = ticket.firstname ?? ''
    this.lastname = ticket.lastname ?? ''
    this.prefer_lastname = ticket.prefer_lastname ?? false
    this.gender = ticket.gender ?? Gender.NonBinary
    this.invalid = ticket.invalid ?? false
  }

  toDB (): TicketDB {
    return {
      username: this.username,
      firstname: this.firstname,
      lastname: this.lastname,
      prefer_lastname: this.prefer_lastname,
      gender: this.gender,
      invalid: this.invalid
    }
  }
}
