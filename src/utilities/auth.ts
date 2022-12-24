import { TicketDB } from '@/model/ticket'
import { User } from '@/model/user'
import CryptoJS from 'crypto-js'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { logOnServer } from './log'

export async function signIn (name: string, password: string) {
  const db = getFirestore()

  console.log('Logging in as', name)

  const userDoc = await getDoc(doc(db, `user-mail/${name}`))
  const encryptedEmail = userDoc.get('email')

  const email = decryptEmail(encryptedEmail, name)

  await signInWithEmailAndPassword(getAuth(), email, password)

  console.log(encryptEmail(email, name))
}

function encryptEmail (email: string, name: string) {
  const key = CryptoJS.enc.Base64.parse(name)
  const iv = CryptoJS.enc.Base64.parse('                   ')
  return CryptoJS.AES.encrypt(email, key, { iv }).toString()
}
function decryptEmail (encryptedEmail: string, name: string) {
  const key = CryptoJS.enc.Base64.parse(name)
  const iv = CryptoJS.enc.Base64.parse('                   ')
  return CryptoJS.AES.decrypt(encryptedEmail, key, { iv }).toString(CryptoJS.enc.Utf8)
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

    // Set User specific info
    await setDoc(doc(db, `usernames/${uid}`), { username })
    await setDoc(doc(db, `user-mail/${username}`), {
      email: encryptEmail(email, username)
    })
    await addDoc(collection(db, 'users'), User.fromTicket(ticket).toDB())

    // Invalidate Ticket
    await setDoc(doc(db, `tickets/${encryptTicket(code)}`), {
      invalid: true
    })
  } catch (err) {
    console.error('Create User', err)
    throw err
  }
}
