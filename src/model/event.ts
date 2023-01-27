import { collection, doc, getDoc, getDocs, getFirestore, query } from 'firebase/firestore'

export type EventColors = 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'purple' | 'pink'

export interface EventDB {
  name: string,
  description: string,
  wholeDay: boolean,
  startDate: number,
  endDate: number | null,
  color: EventColors
}

export default class Event {
  id: string
  private event: EventDB

  get name (): string {
    return this.event.name
  }

  set name (name: string) {
    this.event.name = name
  }

  get description (): string {
    return this.event.description
  }

  set description (description: string) {
    this.event.description = description
  }

  get wholeDay (): boolean {
    return this.event.wholeDay
  }

  set wholeDay (wholeDay: boolean) {
    this.event.wholeDay = wholeDay
  }

  get startDate (): number {
    return this.event.startDate
  }

  set startDate (startDate: number) {
    this.event.startDate = startDate
  }

  get endDate (): number | null {
    return this.event.endDate
  }

  set endDate (endDate: number | null) {
    this.event.endDate = endDate
  }

  get color (): EventColors {
    return this.event.color
  }

  set color (color: EventColors) {
    this.event.color = color
  }

  constructor (id: string, options: Partial<EventDB> = {}) {
    this.id = id

    this.event = {
      name: options.name ?? 'Unbenannter Termin',
      description: options.description ?? '',
      wholeDay: options.wholeDay ?? true,
      startDate: options.startDate ?? new Date().getTime(),
      endDate: options.endDate ?? null,
      color: options.color ?? 'gray'
    }
  }

  toDB (): EventDB {
    return this.event
  }

  static async get (id?: string) {
    const db = getFirestore()
    if (id) {
      const event = await getDoc(doc(db, 'events', id))
      if (event.exists()) {
        return new Event(id, event.data() as EventDB)
      } else {
        return null
      }
    } else {
      const querySnapshot = (await getDocs(query(collection(db, 'events'))))
      const events: Event[] = []
      querySnapshot.forEach((doc) => {
        events.push(new Event(doc.id, doc.data() as EventDB))
      })
      return events
    }
  }
}
