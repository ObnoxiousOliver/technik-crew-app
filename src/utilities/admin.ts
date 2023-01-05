import { Ticket } from '@/model/ticket'
import { User } from '@/model/user'
import { deleteDoc, doc, getFirestore, setDoc } from 'firebase/firestore'
import { encryptTicket } from './auth'
import { logOnServer } from './log'

export async function createTicket (code: string, ticket: Ticket) {
  const db = getFirestore()
  const ticketRef = encryptTicket(code)

  try {
    await setDoc(doc(db, 'tickets', ticketRef), ticket.toDB())
  } catch (err) {
    console.error(err)
    logOnServer('Error in "createTicket": ' + err)
  }
}

export async function deleteUser (user: User) {
  const db = getFirestore()
  const uid = await user.getUid()
  const username = user.username

  await deleteDoc(doc(db, 'users', username))
  await deleteDoc(doc(db, 'user-mail', username))
  await deleteDoc(doc(db, 'permissions', uid))
  await deleteDoc(doc(db, 'usernames', uid))
}
