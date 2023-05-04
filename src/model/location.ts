import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, setDoc } from 'firebase/firestore'
import { HistoryState } from './history'

export interface LocationDB {
  name: string
  description: string
}

export class Location {
  readonly id: string | null
  private location: LocationDB

  get name () { return this.location.name }
  private set name (value) { this.location.name = value }

  get description () { return this.location.description }
  private set description (value) { this.location.description = value }

  constructor (id: string | null, options: Partial<LocationDB> = {}) {
    this.id = id
    this.location = {
      name: options.name ?? '',
      description: options.description ?? ''
    }
  }

  toDB (): LocationDB {
    return {
      name: this.location.name,
      description: this.location.description
    }
  }

  async save () {
    if (!this.id) {
      throw new Error('Cannot save a location without an id')
    }
    const db = getFirestore()

    await setDoc(doc(db, 'locations', this.id), this.toDB())
  }

  async recordHistory <T> (options: Partial<{
    author: string
    description: string
    date: number
    type: string
    content: T
  }>) {
    if (!this.id) {
      throw new Error('Cannot record history on a location without an id')
    }

    const db = getFirestore()

    addDoc(
      collection(db, 'locations', this.id, 'history'),
      new HistoryState({
        author: options.author,
        description: options.description,
        date: options.date,
        type: options.type ?? 'location',
        content: options.content ?? this.toDB()
      }).toDB())
  }

  async getHistory () {
    if (!this.id) {
      throw new Error('Cannot get history on a location without an id')
    }

    return await HistoryState.get('locations', this.id)
  }

  async setDescription (description: string) {
    if (description === this.description) return

    this.description = description.trim()
    await this.save()
    await this.recordHistory({
      description: `Beschreibung geändert -> ${description}`
    })
  }

  async setName (name: string) {
    if (name === this.name) return

    if (name.trim() === '') {
      throw new Error('Name cannot be empty')
    }

    this.name = name.trim()
    await this.save()
    await this.recordHistory({
      description: `Name geändert -> ${name}`
    })
  }

  async set (name: string, description: string) {
    if (name === this.name &&
      description === this.description) return

    if (name === this.name) {
      return this.setDescription(description)
    }
    if (description === this.description) {
      return this.setName(name)
    }

    if (name.trim() === '') {
      throw new Error('Name cannot be empty')
    }

    this.name = name.trim()
    this.description = description.trim()
    await this.save()
    await this.recordHistory({
      description: `Name und Beschreibung geändert -> ${name}\n\n${description}`
    })
  }

  static async get (id?: string) {
    const db = getFirestore()
    if (id) {
      const docSnap = await getDoc(doc(db, 'locations', id))
      if (docSnap.exists()) {
        return new Location(id, docSnap.data() as LocationDB)
      }
    } else {
      const querySnapshot = await getDocs(collection(db, 'locations'))
      const locations: Location[] = []
      querySnapshot.forEach((doc) => {
        locations.push(new Location(doc.id, doc.data() as LocationDB))
      })
      return locations
    }
  }

  static async create (options: Partial<LocationDB> = {}) {
    const db = getFirestore()
    let location = new Location(null, options)

    const docRef = await addDoc(collection(db, 'locations'), location.toDB())
    location = new Location(docRef.id, options)
    await location.recordHistory({
      description: 'Standort erstellt'
    })
    return location
  }

  static subscribe (onChange: (type: 'added' | 'modified' | 'removed', location: Location) => void) {
    const db = getFirestore()

    return onSnapshot(collection(db, 'locations'), {
      next: (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const location = new Location(change.doc.id, change.doc.data() as LocationDB)
          onChange(change.type, location)
        })
      }
    })
  }
}
