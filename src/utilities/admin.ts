import { Ticket } from '@/model/ticket'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
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
