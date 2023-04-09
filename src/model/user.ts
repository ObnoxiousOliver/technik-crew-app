import { decryptEmail } from '@/utilities/auth'
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import { TicketDB } from './ticket'
import { PermissionsDB, Permission } from './permissions'
import { getAuth } from 'firebase/auth'

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

  cachedEmail: string | undefined
  async getEmail () {
    if (!this.cachedEmail) {
      const db = getFirestore()
      const email = await getDoc(doc(db, 'user-mail', this.username))
      this.cachedEmail = decryptEmail(email.get('email'), this.username)
    }
    return this.cachedEmail
  }

  subscribeEmail (callback: (email: string) => void) {
    const db = getFirestore()
    const unsubscribe = onSnapshot(doc(db, 'user-mail', this.username), doc => {
      this.cachedEmail = decryptEmail(doc.get('email'), this.username)
      callback(this.cachedEmail)
    })
    return unsubscribe
  }

  cachedPermissions: PermissionsDB | undefined
  async getPermissions () {
    if (!this.cachedPermissions) {
      const db = getFirestore()
      const uid = await this.getUid()

      const permissionsDoc = await getDoc(doc(db, 'permissions', uid))
      const permissions = permissionsDoc.data() ?? {}
      console.log(
        Object.values(Permission).forEach(permission => {
          permissions[permission] = permissions[permission] ?? false
        })
      )
      this.cachedPermissions = permissions
    }
    return Object.assign({}, this.cachedPermissions)
  }

  static subscribePermissions (uid: string, callback: (permissions: PermissionsDB) => void) {
    const db = getFirestore()

    const unsubscribe = onSnapshot(doc(db, 'permissions', uid), doc => {
      const permissions = doc.data() ?? {}
      callback(permissions)
    })

    return unsubscribe
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

    if (changes[Permission.IsAdmin] !== undefined) {
      await this.setAdmin(changes[Permission.IsAdmin])
    }

    await setDoc(doc(db, 'permissions', uid), changes, { merge: true })
  }

  private async setAdmin (isAdmin: boolean) {
    this.is_admin = isAdmin

    await this.setUserDB()
  }

  async setUserDB () {
    const db = getFirestore()
    console.log(this.toDB())
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

  static async getUsername (uid: string | undefined = getAuth().currentUser?.uid) {
    if (!uid) return undefined

    const db = getFirestore()

    return (await getDoc(doc(db, 'usernames', uid))).get('username')
  }

  static async getCurrentUser () {
    const db = getFirestore()

    const userDoc = await getDoc(doc(db, 'users', await this.getUsername()))
    const user = userDoc.data() as UserDB
    return new User(user)
  }

  static async fromUsername (username: string): Promise<User | undefined> {
    const db = getFirestore()

    const userDoc = await getDoc(doc(db, 'users', username))

    if (!userDoc.exists()) return undefined

    const user = userDoc.data() as UserDB
    return new User(user)
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

  static async get () {
    const db = getFirestore()

    const users: { [key: string]: User} = {}
    const querySnapshot = await getDocs(collection(db, 'users'))
    querySnapshot.docs.forEach(user => {
      const userData = user.data() as UserDB
      users[userData.username] = new User(userData)
    })

    return users
  }
}
