import { PermissionsDB } from '@/model/permissions'
import { TicketDB } from '@/model/ticket'
import { User, UserDB } from '@/model/user'
import { useNewEventStore } from '@/stores/newEvent'
import { useUser } from '@/stores/user'
import CryptoJS from 'crypto-js'
import { FirebaseError } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut as _signOut, updateEmail } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore'
import { logOnServer } from './log'

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
}

export async function getUsername () {
  const auth = getAuth()
  if (auth.currentUser) {
    return (await getDoc(doc(getFirestore(), 'usernames', auth.currentUser.uid))).get('username')
  }
  return null
}

export async function setStore () {
  const db = getFirestore()
  const auth = getAuth()
  const userStore = useUser()

  if (!auth.currentUser) return

  const username = await getUsername()

  userStore.user = new User((await getDocs(
    query(
      collection(db, 'users'),
      where('username', '==', username)
    )
  )).docs[0].data() as UserDB)

  userStore.permissions = (await getDoc(
    doc(db, 'permissions', auth.currentUser.uid)
  )).data() as PermissionsDB
}

export async function signOut () {
  const auth = getAuth()
  await _signOut(auth)
  useUser().reset()
  useNewEventStore().reset()
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
    await addDoc(collection(db, 'users'), User.fromTicket(ticket).toDB())

    await invalidateTicket(code, username)
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
