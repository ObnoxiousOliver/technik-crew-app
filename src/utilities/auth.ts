import { TicketDB } from '@/model/ticket'
import { User } from '@/model/user'
import CryptoJS from 'crypto-js'
import { FirebaseError } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut as _signOut, updateEmail } from 'firebase/auth'
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { logOnServer } from './log'
import { useUser } from '@/stores/user'

export async function signIn (name: string, password: string) {
  const db = getFirestore()

  console.log('Logging in as', name)

  const userDoc = await getDoc(doc(db, 'user-mail', name))
  if (!userDoc.exists()) {
    throw new FirebaseError('auth/user-not-found', 'User not found')
  }
  const encryptedEmail = userDoc.get('email')

  const email = decryptEmail(encryptedEmail, name)

  await signInWithEmailAndPassword(getAuth(), email, password)

  await setStore()
}

export async function changeEmail (newEmail: string) {
  const auth = getAuth()
  if (!auth.currentUser) return

  const username = useUser().username
  if (!username) return

  const db = getFirestore()

  try {
    await updateEmail(auth.currentUser, newEmail)
    if (auth.currentUser.email !== newEmail) {
      throw new FirebaseError('auth/email-already-in-use', 'Email already in use')
    } else {
      await setDoc(doc(db, 'user-mail', username), {
        email: encryptEmail(auth.currentUser.email, username)
      })
    }
    console.log('Email changed to', auth.currentUser.email)
  } catch (err) {
    console.error(err)
    throw err
  }
}

export function setStore () {
  useUser().setStore()
}

export async function signOut () {
  const auth = getAuth()
  await _signOut(auth)
  useUser().reset()
}

export function encryptEmail (email: string, name: string) {
  const key = btoa(name)
  return CryptoJS.AES.encrypt(email, key).toString()
}
export function decryptEmail (encryptedEmail: string, name: string) {
  const key = btoa(name)
  return CryptoJS.AES.decrypt(encryptedEmail, key).toString(CryptoJS.enc.Utf8)
}

export function encryptTicket (code: string) {
  return btoa(code).replace(/\//g, '-')
}

export async function getTicket (code: string) {
  const db = getFirestore()
  const ticketRef = encryptTicket(code)
  try {
    const ticket = await getDoc(doc(collection(db, 'tickets'), ticketRef))
    return ticket.data()
  } catch (err) {
    console.error(err)
    logOnServer('Error in "getTicket": ' + err)
    return undefined
  }
}

export async function createUserFromTicket (ticket: TicketDB, code: string, email: string, password: string) {
  const db = getFirestore()
  const username = ticket.username

  try {
    await createUserWithEmailAndPassword(getAuth(), email, password)

    const uid = getAuth().currentUser?.uid

    if (!uid) throw new Error('No UID')

    // Set User specific info
    await setDoc(doc(db, 'usernames', uid), { username })
    await setDoc(doc(db, 'user-mail', username), {
      email: encryptEmail(email, username)
    })
    await setDoc(doc(db, 'users', username), User.fromTicket(ticket).toDB())

    await invalidateTicket(code, username)
    await setStore()
  } catch (err) {
    console.error('Create User', err)
    throw err
  }
}

export async function invalidateTicket (code: string, username?: string) {
  const db = getFirestore()
  const ticketRef = encryptTicket(code)
  let _username = username

  if (!username) {
    _username = (await getDoc(doc(db, 'tickets', ticketRef))).get('username')
  }
  await setDoc(doc(db, 'tickets', ticketRef), {
    username: _username,
    invalid: true
  })
}
