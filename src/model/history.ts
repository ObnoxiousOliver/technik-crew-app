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
    this.author = options.author ?? 'Anonym'
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
}
