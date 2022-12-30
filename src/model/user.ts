import { decryptEmail } from '@/utilities/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
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

  constructor (options: Partial<UserDB>) {
    this.username = options.username ?? ''
    this.firstname = options.firstname ?? ''
    this.lastname = options.lastname ?? ''
    this.prefer_lastname = options.prefer_lastname ?? false
    this.gender = options.gender ?? Gender.NonBinary
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

  private cachedEmail: string | undefined
  async getEmail () {
    if (!this.cachedEmail) {
      const db = getFirestore()
      const email = await getDoc(doc(db, 'user-mail', this.username))
      this.cachedEmail = decryptEmail(email.get('email'), this.username)
    }
    return this.cachedEmail
  }

  static getDisplayName (user: {
    firstname: string,
    lastname: string,
    prefer_lastname: boolean,
    gender: Gender
  }) {
    if (!user.firstname && !user.lastname) return 'Anonym'
    return (user.prefer_lastname && user.lastname) || !user.firstname
      ? {
          [Gender.Male]: `Herr ${user.lastname}`, // Herr Doe
          [Gender.Female]: `Frau ${user.lastname}`, // Frau Doe
          [Gender.NonBinary]: (user.firstname?.[0] ? `${user.firstname[0]}. ` : '') + user.lastname // J. Doe
        }[user.gender]
      : user.firstname + (user.lastname?.[0] ? ` ${user.lastname[0]}.` : '') // John D.
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
