import { useUser } from '@/stores/user'
import { collection, getDocs, getFirestore } from 'firebase/firestore'

export interface HistoryStateDB<T> {
  author: string
  description: string | null
  date: number
  type: string
  content: T
}

export class HistoryState<T> implements HistoryStateDB<T> {
  author: string
  description: string | null
  date: number
  type: string
  content: T

  constructor (options: Partial<HistoryStateDB<T>> = {}) {
    this.author = options.author ?? useUser().user?.username ?? 'Anonym'
    this.description = options.description ?? null
    this.date = options.date ?? Date.now()
    this.content = options.content ?? ({} as T)
    this.type = options.type ?? 'unknown'
  }

  toDB (): HistoryStateDB<T> {
    return {
      author: this.author,
      description: this.description,
      date: this.date,
      type: this.type,
      content: this.content
    }
  }

  static async get<T> (...collectionPath: string[]): Promise<HistoryState<T>[]> {
    const db = getFirestore()
    const querySnapshot = await getDocs(collection(db, collectionPath.join('/'), 'history'))
    const history: HistoryState<T>[] = []
    querySnapshot.forEach((doc) => {
      history.push(new HistoryState(doc.data()))
    })
    history.sort((a, b) => b.date - a.date)
    return history
  }
}
