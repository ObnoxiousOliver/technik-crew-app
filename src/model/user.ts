import { decryptEmail } from '@/utilities/auth'
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore'
import { TicketDB } from './ticket'
import { PermissionsDB, Permission } from './permissions'

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
  is_admin?: boolean
}

export class User implements UserDB {
  username: string
  firstname: string
  lastname: string
  prefer_lastname: boolean
  gender: Gender
  is_admin?: boolean | undefined

  constructor (options?: Partial<UserDB>) {
    this.username = options?.username ?? ''
    this.firstname = options?.firstname ?? ''
    this.lastname = options?.lastname ?? ''
    this.prefer_lastname = options?.prefer_lastname ?? false
    this.gender = options?.gender ?? Gender.NonBinary
    this.is_admin = options?.is_admin ?? false
  }

  toDB (): UserDB {
    return {
      username: this.username,
      firstname: this.firstname,
      lastname: this.lastname,
      prefer_lastname: this.prefer_lastname,
      gender: this.gender,
      is_admin: this.is_admin
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

  private cachedPermissions: PermissionsDB | undefined
  async getPermissions () {
    if (!this.cachedPermissions) {
      const db = getFirestore()
      const uid = await this.getUid()

      const permissions = await getDoc(doc(db, 'permissions', uid))
      this.cachedPermissions = permissions.data() ?? {}
    }
    return this.cachedPermissions
  }

  async setPermissions (changes: PermissionsDB) {
    const db = getFirestore()
    const uid = await this.getUid()

    if (this.cachedPermissions) {
      this.cachedPermissions = {
        ...this.cachedPermissions,
        ...changes
      }
    }

    await setDoc(doc(db, 'permissions', uid), changes, { merge: true })
  }

  async setAdmin (isAdmin: boolean) {
    await this.setPermissions({
      [Permission.IsAdmin]: isAdmin
    })

    this.is_admin = isAdmin

    this.setUserDB()
  }

  async setUserDB () {
    const db = getFirestore()

    await setDoc(doc(db, 'users', this.username), this.toDB(), { merge: true })
  }

  private cachedUid: string | undefined
  async getUid () {
    if (!this.cachedUid) {
      const db = getFirestore()
      this.cachedUid = (await getDocs(
        query(
          collection(db, 'usernames'),
          where('username', '==', this.username)
        )
      )).docs[0].id
    }
    return this.cachedUid
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
