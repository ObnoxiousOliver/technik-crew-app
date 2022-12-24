import { LogDB } from '@/model/log'
import { useUser } from '@/stores/user'
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore'

export async function logOnServer (msg: string) {
  const db = getFirestore()

  const log: LogDB = {
    author: useUser().user?.username ?? 'unauthorized',
    msg,
    timestamp: serverTimestamp()
  }

  await addDoc(collection(db, 'logs'), log)
}
