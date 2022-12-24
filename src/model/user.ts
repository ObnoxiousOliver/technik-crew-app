import { TicketDB } from './ticket'

export enum Gender {
  NonBinary = 'non-binary',
  Male = 'male',
  Female = 'female'
}

export interface UserDB {
  username: string
  firstname: string
  lastname: string
  prefer_lastname: boolean
  gender: Gender
}

export class User implements UserDB {
  username: string
  firstname: string
  lastname: string
  prefer_lastname: boolean
  gender: Gender

  constructor (options: Required<UserDB>) {
    this.username = options.username
    this.firstname = options.firstname
    this.lastname = options.lastname
    this.prefer_lastname = options.prefer_lastname
    this.gender = options.gender
  }

  toDB (): UserDB {
    return {
      username: this.username,
      firstname: this.firstname,
      lastname: this.lastname,
      prefer_lastname: this.prefer_lastname,
      gender: this.gender
    }
  }

  static getDisplayName (user: {
    firstname: string,
    lastname: string,
    prefer_lastname: boolean,
    gender: Gender
  }) {
    return user.prefer_lastname
      ? {
          [Gender.Male]: `Herr ${user.lastname}`, // Herr Doe
          [Gender.Female]: `Frau ${user.lastname}`, // Frau Doe
          [Gender.NonBinary]: `${user.firstname?.[0]}. ${user.lastname}` // J. Doe
        }[user.gender]
      : `${user.firstname} ${user.lastname?.[0]}.` // John D.
  }

  static fromTicket (ticket: TicketDB): User {
    return new User({
      username: ticket.username,
      firstname: ticket.firstname,
      lastname: ticket.lastname,
      prefer_lastname: ticket.prefer_lastname,
      gender: ticket.gender
    })
  }
}
