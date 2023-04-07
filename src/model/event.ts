import { addDoc, collection, doc, DocumentChange, DocumentData, getDoc, getDocs, getFirestore, limit, onSnapshot, query, setDoc, where } from 'firebase/firestore'

export type EventColors = 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'purple' | 'pink'

export interface EventDB {
  name: string,
  description: string,
  wholeDay: boolean,
  startDate: number,
  endDate: number,
  color: EventColors,
  months: string[], // "YYYY-MM"
  neededUsers: string[],
  neededEquipment: string[]
}

export default class Event {
  id: string | null = null
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

  get endDate (): number {
    return this.event.endDate
  }

  set endDate (endDate: number) {
    this.event.endDate = endDate
  }

  get color (): EventColors {
    return this.event.color
  }

  set color (color: EventColors) {
    this.event.color = color
  }

  get months (): string[] {
    return this.event.months
  }

  get neededUsers (): string[] {
    return this.event.neededUsers
  }

  set neededUsers (neededUsers: string[]) {
    this.event.neededUsers = neededUsers
  }

  get neededEquipment (): string[] {
    return this.event.neededEquipment
  }

  set neededEquipment (neededEquipment: string[]) {
    this.event.neededEquipment = neededEquipment
  }

  constructor (id: string | null, options: Partial<EventDB> = {}) {
    this.id = id

    const startDate = options.startDate
      ? new Date(options.startDate)
      : new Date()

    let endDate: Date | null = options.endDate
      ? new Date(options.endDate)
      : new Date()

    if (options.wholeDay) {
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(0, 0, 0, 0)
    }

    if (startDate.getTime() >= endDate.getTime()) {
      if (options.wholeDay) {
        endDate = null
      } else {
        endDate = new Date(startDate)
        endDate.setHours(endDate.getHours() + 1)
      }
    }

    this.event = {
      name: options.name ?? 'Unbenannter Termin',
      description: options.description ?? '',
      wholeDay: options.wholeDay ?? true,
      startDate: startDate.getTime(),
      endDate: endDate?.getTime() ?? startDate.getTime(),
      color: options.color ?? 'gray',
      months: options.months ??
        Event.getOverlappingMonths(
          startDate.getTime(),
          endDate?.getTime() ?? startDate.getTime()),
      neededUsers: options.neededUsers ?? [],
      neededEquipment: options.neededEquipment ?? []
    }
  }

  async save () {
    if (!this.id) {
      throw new Error('Cannot save event without id')
    }

    const db = getFirestore()

    this.event.months = Event.getOverlappingMonths(this.event.startDate, this.event.endDate)

    await setDoc(doc(db, 'events', this.id), this.toDB())
  }

  toDB (): EventDB {
    return this.event
  }

  static getOverlappingMonths (startDate: number, endDate: number): string[] {
    const months: string[] = []

    const start = new Date(startDate)
    const end = new Date(endDate)

    // set start date to the first day of the week
    start.setDate(start.getDate() - start.getDay())
    start.setHours(0, 0, 0, 0)

    // set end date to the last day of the week
    end.setDate(end.getDate() + (6 - end.getDay()))
    end.setHours(23, 59, 59, 999)

    console.log(end)

    // console.log(`Start: ${start.toDateString()}`)
    // console.log(`End: ${end.toDateString()}`)

    // Gets the number of months between the start and end date
    function totalMonths (start: Date, end: Date) {
      return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() + 1 - start.getMonth())
    }

    // Pushes all months between the start and end date
    for (let i = 0; i < totalMonths(start, end); i++) {
      const month = new Date(start.getFullYear(), start.getMonth() + i, 1)
      months.push(`${month.getFullYear()}-${(month.getMonth() + 1).toString().padStart(2, '0')}`)
    }

    return months
  }

  static async getMonth (date: Date) {
    const db = getFirestore()

    const querySnapshot = await getDocs(query(
      collection(db, 'events'),
      where('months', 'array-contains', `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`)
    ))

    const events: Event[] = []
    querySnapshot.forEach((doc) => {
      events.push(new Event(doc.id, doc.data() as EventDB))
    })

    return events
  }

  static subscribeMonth (date: Date, onChange: (change: DocumentChange<DocumentData>) => void) {
    const db = getFirestore()

    const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`

    const q = query(
      collection(db, 'events'),
      where('months', 'array-contains', dateString)
    )

    const unsubscribe = onSnapshot(q, {
    }, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        onChange(change)
      })
    })

    return unsubscribe
  }

  static async getUpcoming (n: number) {
    const db = getFirestore()

    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const querySnapshot = await getDocs(query(
      collection(db, 'events'),
      where('startDate', '>=', now.getTime()),
      limit(n)
    ))

    const events: Event[] = []
    querySnapshot.forEach((doc) => {
      events.push(new Event(doc.id, doc.data() as EventDB))
    })

    events.sort((a, b) => a.startDate - b.startDate)

    return events
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

  static async create (options: Partial<EventDB> = {}) {
    const db = getFirestore()
    const event = new Event(null, options)
    const doc = await addDoc(collection(db, 'events'), event.toDB())
    return new Event(doc.id, event.toDB())
  }
}
