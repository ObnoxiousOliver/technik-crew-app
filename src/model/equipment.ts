import { useUser } from '@/stores/user'
import { addDoc, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, getFirestore, query, QuerySnapshot, setDoc, where } from 'firebase/firestore'
import { HistoryState } from './history'
import { Location } from './location'

export interface NoteDB {
  date: number
  content: string
  author: string
}

export type EquipmentType = 'computer' | 'cable' | 'instrument' | 'speaker' | 'light' | 'mixer' | 'microphone' | 'other'

export const EquipmentTypeInfo: {
  [key in EquipmentType]: {
    icon: string,
    name: string
  }
} = {
  computer: {
    icon: 'bi-laptop',
    name: 'Computer'
  },
  cable: {
    icon: 'bi-plug',
    name: 'Kabel'
  },
  instrument: {
    icon: 'bi-music-note',
    name: 'Instrument'
  },
  speaker: {
    icon: 'bi-speaker',
    name: 'Lautsprecher'
  },
  light: {
    icon: 'bi-lightbulb',
    name: 'Licht'
  },
  mixer: {
    icon: 'bi-sliders2-vertical',
    name: 'Mischpult'
  },
  microphone: {
    icon: 'bi-mic',
    name: 'Mikrofon'
  },
  other: {
    icon: 'bi-question-circle',
    name: 'Sonstiges'
  }
}

export interface EquipmentDB {
  name: string
  type: EquipmentType | null
  description: string
  location: string | null
  group: string | null
  is_hidden: boolean
}

export class Equipment {
  readonly id: string | null = null
  private equipment: EquipmentDB

  get name () { return this.equipment.name }
  private set name (value) { this.equipment.name = value }

  get type () { return this.equipment.type }
  private set type (value) { this.equipment.type = value }

  get description () { return this.equipment.description }
  private set description (value) { this.equipment.description = value }

  get location () { return this.equipment.location }
  private set location (value) { this.equipment.location = value }

  get group () { return this.equipment.group }
  private set group (value) { this.equipment.group = value }

  get isHidden () { return this.equipment.is_hidden }
  private set isHidden (value) { this.equipment.is_hidden = value }

  constructor (id: string | null, options: Partial<EquipmentDB> = {}) {
    this.id = id
    this.equipment = {
      name: options.name ?? '',
      type: options.type ?? null,
      description: options.description ?? '',
      location: options.location ?? null,
      group: options.group ?? null,
      is_hidden: options.is_hidden ?? false
    }
  }

  toDB (): EquipmentDB {
    return {
      name: this.equipment.name,
      type: this.equipment.type,
      description: this.equipment.description,
      location: this.equipment.location,
      group: this.equipment.group,
      is_hidden: this.equipment.is_hidden
    }
  }

  async save (silent = false) {
    if (this.id === null) {
      if (!silent) {
        throw new Error('Cannot save an equipment without an id')
      }
      return
    }
    const db = getFirestore()

    setDoc(doc(db, 'equipment', this.id), this.toDB())
  }

  async recordHistory <T> (options: Partial<{
    author: string
    description: string
    date: number
    type: string
    content: T
  }>) {
    if (!this.id) {
      throw new Error('Cannot record history on an equipment without an id')
    }

    const db = getFirestore()

    addDoc(
      collection(db, 'equipment', this.id, 'history'),
      new HistoryState({
        author: options.author ?? useUser().user?.username,
        description: options.description,
        date: options.date,
        type: options.type ?? 'equipment',
        content: options.content ?? this.toDB()
      }).toDB())
  }

  private static cachedNotes: {
    [id: string]: {
      [id: string]: NoteDB
    }
  }

  async getNotes (id?: string, useCache = true) {
    if (!this.id) {
      throw new Error('Cannot get notes on an equipment without an id')
    }

    if (useCache && Equipment.cachedNotes && Equipment.cachedNotes[this.id]) {
      if (id) {
        return Equipment.cachedNotes[this.id][id]
      } else {
        return Equipment.cachedNotes[this.id]
      }
    }

    const db = getFirestore()
    if (id) {
      const docSnap = await getDoc(doc(db, 'equipment', this.id, 'notes', id))

      return docSnap.data() as NoteDB
    } else {
      const querySnapshot = await getDocs(query(collection(db, 'equipment', this.id, 'notes')))

      const notes: {
        [key: string]: NoteDB
      } = {}

      querySnapshot.docs.forEach(x => {
        notes[x.id] = x.data() as NoteDB
      })

      return notes
    }
  }

  async addNote (content: string) {
    if (!this.id) {
      throw new Error('Cannot add notes on an equipment without an id')
    }

    const db = getFirestore()
    const userStore = useUser()

    const note: NoteDB = {
      date: Date.now(),
      content,
      author: userStore.user?.username ?? 'Anonym'
    }

    await addDoc(collection(db, 'equipment', this.id, 'notes'), note)

    await this.recordHistory({
      description: 'Anmerkung hinzugefügt',
      type: 'note',
      content: note
    })
  }

  async removeNote (id: string) {
    if (!this.id) {
      throw new Error('Cannot remove notes on an equipment without an id')
    }

    const db = getFirestore()
    const userStore = useUser()

    const note = (await getDoc(doc(db, 'equipment', this.id, 'notes', id))).data() as NoteDB

    if (!note) {
      throw new Error('Note not found')
    }

    await deleteDoc(doc(db, 'equipment', this.id, 'notes', id))

    await this.recordHistory({
      description: 'Anmerkung entfernt',
      author: userStore.user?.username ?? 'Anonym',
      date: Date.now(),
      type: 'note',
      content: note
    })
  }

  async getHistory () {
    if (!this.id) {
      throw new Error('Cannot get history on an equipment without an id')
    }

    const db = getFirestore()
    const querySnapshot = await getDocs(query(collection(db, 'equipment', this.id, 'history')))
    return querySnapshot.docs.map(x => new HistoryState<unknown>(x.data()))
  }

  async setName (name: string) {
    if (!this.id) {
      throw new Error('Cannot get history on an equipment without an id')
    }
    if (this.name === name) return

    this.name = name
    await this.save()
    await this.recordHistory({
      description: `Name geändert -> ${name}`
    })
  }

  async setType (type: EquipmentType | null) {
    if (!this.id) {
      throw new Error('Cannot get history on an equipment without an id')
    }
    if (this.type === type) return

    this.type = type
    await this.save()
    await this.recordHistory({
      description: `Typ geändert -> ${type}`
    })
  }

  async setDescription (description: string) {
    if (!this.id) {
      throw new Error('Cannot get history on an equipment without an id')
    }
    if (this.description === description) return

    this.description = description
    await this.save()
    await this.recordHistory({
      description: `Beschreibung geändert ->\n${description}`
    })
  }

  async setLocation (location: string | null, moveGroup = true) {
    if (!this.id) {
      throw new Error('Cannot get history on an equipment without an id')
    }
    if (this.location === location) return

    this.location = location
    await this.save()

    // If this equipment is in a group, move all equipment in the group to the same location
    if (moveGroup && this.group) {
      for (const eq of (await Equipment.getFromGroup(this.group))) {
        await eq.setLocation(location, false)
      }
    }

    await this.recordHistory({
      description: location
        ? `Standort geändert -> ${((await Location.get(location)) as Location)?.name}`
        : 'Standort entfernt'
    })
  }

  async setGroup (group: string | null) {
    if (!this.id) {
      throw new Error('Cannot get history on an equipment without an id')
    }
    if (this.group === group) return

    this.group = group
    await this.save()
    await this.recordHistory({
      description: group
        ? `Gruppe geändert -> ${group}`
        : 'Gruppe entfernt'
    })
  }

  async renameGroup (newGroup: string) {
    if (!this.id) {
      throw new Error('Cannot get history on an equipment without an id')
    }
    if (!this.group) {
      throw new Error('Cannot rename group on an equipment without a group')
    }
    if (newGroup === '') {
      throw new Error('Cannot rename group to an empty string')
    }
    if (newGroup === this.group) return

    for (const eq of await Equipment.getFromGroup(this.group)) {
      await eq.setGroup(newGroup)
    }
  }

  async setHidden (hidden: boolean) {
    if (!this.id) {
      throw new Error('Cannot get history on an equipment without an id')
    }
    if (this.isHidden === hidden) return

    this.isHidden = hidden
    await this.save()
    await this.recordHistory({
      description: hidden
        ? 'Ausgeblendet'
        : 'Wieder sichtbar'
    })
  }

  async remove () {
    await this.setHidden(true)
  }

  static async create (options: Partial<EquipmentDB> = {}) {
    const db = getFirestore()
    let equipment = new Equipment(null, options)

    const docRef = await addDoc(collection(db, 'equipment'), equipment.toDB())
    equipment = new Equipment(docRef.id, options)
    await equipment.recordHistory({
      description: 'Equipment erstellt'
    })
    return equipment
  }

  private static cachedEquipment: {
    // eslint-disable-next-line no-use-before-define
    [id: string]: Equipment
  } = {}

  static async get (id?: string, onlyHidden: boolean| null = false, useCache = false) {
    const db = getFirestore()

    if (id) {
      if (useCache && this.cachedEquipment[id]) {
        return this.cachedEquipment[id]
      }

      const docSnap = await getDoc(doc(db, 'equipment', id))

      if (!docSnap.exists()) {
        throw new Error('Equipment not found')
      }

      this.cachedEquipment[id] = new Equipment(id, docSnap.data() as EquipmentDB)
      return this.cachedEquipment[id]
    } else {
      let querySnapshot: QuerySnapshot<DocumentData>
      if (onlyHidden === null) {
        querySnapshot = await getDocs(query(collection(db, 'equipment')))
      } else {
        querySnapshot = await getDocs(query(collection(db, 'equipment'), where('is_hidden', '==', onlyHidden)))
      }

      this.cachedEquipment = {}
      querySnapshot.docs.forEach(x => {
        this.cachedEquipment[x.id] = new Equipment(x.id, x.data() as EquipmentDB)
      })
      return Object.values(this.cachedEquipment)
    }
  }

  static async getFromGroup (group: string) {
    const db = getFirestore()
    const querySnapshot = await getDocs(query(collection(db, 'equipment'), where('group', '==', group)))

    return querySnapshot.docs.map(x => new Equipment(x.id, x.data() as EquipmentDB))
  }

  static async getFromLocation (location: string) {
    const db = getFirestore()
    const querySnapshot = await getDocs(query(collection(db, 'equipment'), where('location', '==', location)))

    return querySnapshot.docs.map(x => new Equipment(x.id, x.data() as EquipmentDB))
  }

  static async getFromType (type: string) {
    const db = getFirestore()
    const querySnapshot = await getDocs(query(collection(db, 'equipment'), where('type', '==', type)))

    return querySnapshot.docs.map(x => new Equipment(x.id, x.data() as EquipmentDB))
  }

  static getGroups (equipment: Equipment[]) {
    const groups: string[] = []
    for (const eq of equipment) {
      if (eq.group && !groups.includes(eq.group)) {
        groups.push(eq.group)
      }
    }
    return groups
  }
}
