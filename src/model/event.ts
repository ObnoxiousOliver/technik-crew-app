import { addDoc, collection, deleteDoc, doc, DocumentChange, DocumentData, getDoc, getDocs, getFirestore, limit, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import { HistoryState } from './history'
import { useUser } from '@/stores/user'

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
  neededEquipment: string[],
  hidden: boolean
}

export default class Event {
  id: string | null = null
  private event: EventDB

  get name (): string {
    return this.event.name
  }

  private set name (name: string) {
    this.event.name = name
  }

  get description (): string {
    return this.event.description
  }

  private set description (description: string) {
    this.event.description = description
  }

  get wholeDay (): boolean {
    return this.event.wholeDay
  }

  private set wholeDay (wholeDay: boolean) {
    this.event.wholeDay = wholeDay
  }

  get startDate (): number {
    return this.event.startDate
  }

  private set startDate (startDate: number) {
    this.event.startDate = startDate
  }

  get endDate (): number {
    return this.event.endDate
  }

  private set endDate (endDate: number) {
    this.event.endDate = endDate
  }

  get color (): EventColors {
    return this.event.color
  }

  private set color (color: EventColors) {
    this.event.color = color
  }

  get months (): string[] {
    return this.event.months
  }

  get neededUsers (): string[] {
    return this.event.neededUsers
  }

  private set neededUsers (neededUsers: string[]) {
    this.event.neededUsers = neededUsers
  }

  get neededEquipment (): string[] {
    return this.event.neededEquipment
  }

  private set neededEquipment (neededEquipment: string[]) {
    this.event.neededEquipment = neededEquipment
  }

  get hidden (): boolean {
    return this.event.hidden
  }

  private set hidden (hidden: boolean) {
    this.event.hidden = hidden
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
      neededEquipment: options.neededEquipment ?? [],
      hidden: options.hidden || false
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

  set (options: Partial<{
    name: string,
    description: string,
    wholeDay: boolean,
    startDate: number,
    endDate: number,
    color: string,
    neededUsers: string[],
    neededEquipment: string[]
  }>) {
    const changes: string[] = []

    if (options.name !== undefined) {
      this.name = options.name
      changes.push(`Name geändert -> ${options.name}`)
    }
    if (options.description !== undefined) {
      this.description = options.description
      changes.push(`Beschreibung geändert -> ${options.description}`)
    }
    if (options.wholeDay !== undefined) {
      this.wholeDay = options.wholeDay
      changes.push('Ganztägig geändert -> ' + (options.wholeDay ? 'Ja' : 'Nein'))
    }
    if (options.startDate !== undefined) {
      this.startDate = options.startDate
      changes.push(`Startdatum geändert -> ${new Date(options.startDate).toLocaleString()}`)
    }
    if (options.endDate !== undefined) {
      this.endDate = options.endDate
      changes.push(`Enddatum geändert -> ${new Date(options.endDate).toLocaleString()}`)
    }
    if (options.color !== undefined) {
      this.color = options.color as EventColors
      changes.push(`Farbe geändert -> ${options.color}`)
    }
    if (options.neededUsers !== undefined) {
      this.neededUsers = options.neededUsers
      changes.push(`Benötigte Helfer geändert -> ${options.neededUsers.join(', ')}`)
    }
    if (options.neededEquipment !== undefined) {
      this.neededEquipment = options.neededEquipment
      changes.push(`Benötigte Ausrüstung geändert -> ${options.neededEquipment.join(', ')}`)
    }

    this.event.months = Event.getOverlappingMonths(this.event.startDate, this.event.endDate
      ? this.event.endDate
      : this.event.startDate)

    this.save()
    this.recordHistory({
      description: changes.join('\n')
    })
  }

  async recordHistory <T> (options: Partial<{
    author: string
    description: string
    date: number
    type: string
    content: T
  }>) {
    if (!this.id) {
      throw new Error('Cannot record history on an event without an id')
    }

    const db = getFirestore()

    addDoc(
      collection(db, 'events', this.id, 'history'),
      new HistoryState({
        author: options.author ?? useUser().username,
        description: options.description,
        date: options.date,
        type: options.type ?? 'event',
        content: options.content ?? this.toDB()
      }).toDB())
  }

  async getHistory () {
    if (!this.id) {
      throw new Error('Cannot get history on an equipment without an id')
    }

    return HistoryState.get('events', this.id)
  }

  async setHidden (hidden: boolean) {
    this.hidden = hidden
    this.save()
    this.recordHistory({
      description: hidden ? 'Versteckt' : 'Sichtbar'
    })
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

  static dateToMonthString (date: Date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
  }

  static async getMonth (date: Date) {
    const db = getFirestore()

    const querySnapshot = await getDocs(query(
      collection(db, 'events'),
      where('months', 'array-contains', Event.dateToMonthString(date)),
      where('hidden', '==', false)
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
      where('months', 'array-contains', dateString),
      where('hidden', '==', false)
    )

    const unsubscribe = onSnapshot(q, {
    }, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        onChange(change)
      })
    })

    return unsubscribe
  }

  static async getArchived () {
    const db = getFirestore()

    const querySnapshot = await getDocs(query(
      collection(db, 'events'),
      where('hidden', '==', true)
    ))

    const events: Event[] = []
    querySnapshot.forEach((doc) => {
      events.push(new Event(doc.id, doc.data() as EventDB))
    })

    return events
  }

  static subscribeArchived (onChange: (change: DocumentChange<DocumentData>) => void) {
    const db = getFirestore()

    const q = query(
      collection(db, 'events'),
      where('hidden', '==', true)
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
      where('hidden', '==', false),
      limit(n)
    ))

    const events: Event[] = []
    querySnapshot.forEach((doc) => {
      events.push(new Event(doc.id, doc.data() as EventDB))
    })

    events.sort((a, b) => a.startDate - b.startDate)

    return events
  }

  static async get (id: undefined): Promise<Event[]>
  static async get (id: string): Promise<Event>
  static async get (id: string | undefined) {
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
    let event = new Event(null, options)
    const doc = await addDoc(collection(db, 'events'), event.toDB())
    event = new Event(doc.id, event.toDB())

    await event.recordHistory({
      description: 'Termin erstellt'
    })

    return event
  }

  static async delete (id: string) {
    const db = getFirestore()
    await deleteDoc(doc(db, 'events', id))
  }

  static isSameDay (event: Event) {
    const s = new Date(event.startDate)
    const e = new Date(event.endDate)

    return s.getFullYear() === e.getFullYear() &&
      s.getMonth() === e.getMonth() &&
      s.getDate() === e.getDate()
  }

  static isSameMonth (event: Event) {
    const s = new Date(event.startDate)
    const e = new Date(event.endDate)

    return s.getFullYear() === e.getFullYear() &&
      s.getMonth() === e.getMonth()
  }

  static isSameYear (event: Event) {
    const s = new Date(event.startDate)
    const e = new Date(event.endDate)

    return s.getFullYear() === e.getFullYear()
  }
}
