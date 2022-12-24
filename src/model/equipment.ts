import { HistoryDB } from './history'

export interface NoteDB {
  date: number
  content: string
  author: string
}

export interface EquipmentDB {
  name: string
  description: string
  location: string
  notes: NoteDB[],
  history: HistoryDB<EquipmentDB>[]
}

export class Equipment implements EquipmentDB {
  name: string
  description: string
  location: string
  notes: NoteDB[]
  history: HistoryDB<EquipmentDB>[]

  constructor (options: Partial<EquipmentDB> = {}) {
    this.name = options.name ?? ''
    this.description = options.description ?? ''
    this.location = options.location ?? ''
    this.notes = options.notes ?? []
    this.history = options.history ?? []
  }

  toDB (): EquipmentDB {
    return {
      name: this.name,
      description: this.description,
      location: this.location,
      notes: this.notes,
      history: this.history
    }
  }
}
