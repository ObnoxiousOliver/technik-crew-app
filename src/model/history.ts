export interface HistoryStateDB<T> {
  author: string
  date: number
  content: T
}

export class HistoryState<T> implements HistoryStateDB<T> {
  author: string
  date: number
  content: T

  constructor (author: string, date: number, content: T) {
    this.author = author
    this.date = date
    this.content = content
  }
}

export type HistoryDB<T> = HistoryStateDB<T>
export type History<T> = HistoryState<T>
