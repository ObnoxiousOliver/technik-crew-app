import { FieldValue } from 'firebase/firestore'

export interface LogDB {
  msg: string,
  author: string,
  timestamp: FieldValue
}
