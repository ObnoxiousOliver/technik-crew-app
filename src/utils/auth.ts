import { TicketDB } from '@/model/ticket'
import CryptoJS from 'crypto-js'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'

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

export async function getTicket (code: string) {
  const db = getFirestore()

  const key = CryptoJS.enc.Base64.parse(code)
  const iv = CryptoJS.enc.Base64.parse('                   ')
  const ticket = CryptoJS.AES.encrypt(code, key, { iv }).toString()

  return await (await getDoc(doc(collection(db, 'tickets'), ticket))).data()
}

export async function createUser (ticket: TicketDB, email: string, password: string) {
  const db = getFirestore()

  try {
    await createUserWithEmailAndPassword(getAuth(), email, password)

    const uid = getAuth().currentUser?.uid
    console.log(uid)

    await setDoc(doc(db, `usernames/${uid}`), {
      username: ticket.username
    })
    await setDoc(doc(db, `user-mail/${ticket.username}`), {
      email: encryptEmail(email, ticket.username)
    })
  } catch (err) {
    console.error('Create User', err)
  }
}
