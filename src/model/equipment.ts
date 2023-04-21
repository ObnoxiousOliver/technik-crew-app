import { useUser } from '@/stores/user'
import { addDoc, collection, deleteDoc, doc, DocumentChangeType, DocumentData, getDoc, getDocs, getFirestore, onSnapshot, query, QuerySnapshot, setDoc, where } from 'firebase/firestore'
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
    icon: 'bi-box',
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
  code: string | null
  amount: number | null
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

  get code () { return this.equipment.code }
  private set code (value) { this.equipment.code = value }

  get amount () { return this.equipment.amount }
  private set amount (value) { this.equipment.amount = value }

  constructor (id: string | null, options: Partial<EquipmentDB> = {}) {
    this.id = id
    this.equipment = {
      name: options.name ?? '',
      type: options.type ?? null,
      description: options.description ?? '',
      location: options.location ?? null,
      group: options.group ?? null,
      is_hidden: options.is_hidden ?? false,
      code: options.code ?? null,
      amount: options.amount ?? null
    }
  }

  toDB (): EquipmentDB {
    return {
      name: this.equipment.name,
      type: this.equipment.type,
      description: this.equipment.description,
      location: this.equipment.location,
      group: this.equipment.group,
      is_hidden: this.equipment.is_hidden,
      code: this.equipment.code,
      amount: this.equipment.amount
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
        author: options.author ?? useUser().username,
        description: options.description,
        date: options.date,
        type: options.type ?? 'equipment',
        content: options.content ?? this.toDB()
      }).toDB())
  }

  async getNotes (id?: string) {
    if (!this.id) {
      throw new Error('Cannot get notes on an equipment without an id')
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

  async setNotes (notes: Record<string, NoteDB>, recordHistory = true) {
    if (!this.id) {
      throw new Error('Cannot set notes on an equipment without an id')
    }

    const db = getFirestore()
    for (const id in notes) {
      const note = notes[id]
      await setDoc(doc(db, 'equipment', this.id, 'notes', id), note)
    }

    if (recordHistory) {
      await this.recordHistory({
        description: 'Notizen aktualisiert',
        type: 'note',
        content: notes
      })
    }
  }

  subscribeNotes (onChange: (type: DocumentChangeType, note: {
    id: string
    note: NoteDB
  }) => void) {
    if (!this.id) {
      throw new Error('Cannot subscribe to notes on an equipment without an id')
    }

    const db = getFirestore()

    const unsubscribe = onSnapshot(collection(db, 'equipment', this.id, 'notes'), (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const note = change.doc.data() as NoteDB
        onChange(change.type, { note, id: change.doc.id })
      })
    })

    return unsubscribe
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

    return HistoryState.get('equipment', this.id)
  }

  async setHistory (history: HistoryState<unknown>[]) {
    if (!this.id) {
      throw new Error('Cannot get history on an equipment without an id')
    }

    const db = getFirestore()

    for (const state of history) {
      await addDoc(collection(db, 'equipment', this.id, 'history'), state.toDB())
    }
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

  async setCode (code: string) {
    if (!this.id) {
      throw new Error('Cannot get history on an equipment without an id')
    }
    if (this.code === code) return

    this.code = code
    await this.save()
    await this.recordHistory({
      description: `Scan Code geändert -> ${code}`
    })
  }

  async setAmount (amount: number, recordHistory = true) {
    if (!this.id) {
      throw new Error('Cannot get history on an equipment without an id')
    }
    if (amount < 1) throw new Error('Amount must be greater than or equal to 1')
    if (amount % 1 !== 0) throw new Error('Amount must be an integer')

    if (this.amount === amount) return
    this.amount = amount === 1 ? null : amount
    await this.save()

    if (recordHistory) {
      await this.recordHistory({
        description: `Anzahl geändert -> ${amount}`
      })
    }
  }

  async set (options: Partial<EquipmentDB>) {
    if (!this.id) {
      throw new Error('Cannot get history on an equipment without an id')
    }

    const changes = []

    if (options.name && options.name !== this.name) {
      this.name = options.name
      changes.push(`Name geändert -> ${options.name}`)
    }
    if (options.type && options.type !== this.type) {
      this.type = options.type
      changes.push(`Typ geändert -> ${options.type}`)
    }
    if (options.description && options.description !== this.description) {
      this.description = options.description
      changes.push(`Beschreibung geändert ->\n${options.description}`)
    }
    if (options.location && options.location !== this.location) {
      this.location = options.location
      changes.push(`Standort geändert -> ${((await Location.get(options.location)) as Location)?.name}`)
    }
    if (options.group && options.group !== this.group) {
      this.group = options.group
      changes.push(`Gruppe geändert -> ${options.group}`)
    }
    if (options.is_hidden && options.is_hidden !== this.isHidden) {
      this.isHidden = options.is_hidden
      changes.push(options.is_hidden ? 'Ausgeblendet' : 'Wieder sichtbar')
    }
    if (options.code && options.code !== this.code) {
      this.code = options.code
      changes.push(`Scan Code geändert -> ${options.code}`)
    }
    if (options.amount && options.amount !== this.amount) {
      this.amount = options.amount === 1 ? null : options.amount
      changes.push(`Anzahl geändert -> ${options.amount}`)
    }

    if (changes.length === 0) return

    await this.save()
    await this.recordHistory({
      description: changes.join('\n')
    })
  }

  async remove () {
    await this.setHidden(true)
  }

  static async create (options: Partial<EquipmentDB> = {}, recordHistory = true) {
    const db = getFirestore()
    let equipment = new Equipment(null, options)

    const docRef = await addDoc(collection(db, 'equipment'), equipment.toDB())
    equipment = new Equipment(docRef.id, options)

    if (recordHistory) {
      await equipment.recordHistory({
        description: 'Equipment erstellt'
      })
    }

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

  /**
   * @deprecated use useEquipment() instead
   */
  static async getFromGroup (group: string) {
    const db = getFirestore()
    const querySnapshot = await getDocs(query(collection(db, 'equipment'), where('group', '==', group)))

    return querySnapshot.docs.map(x => new Equipment(x.id, x.data() as EquipmentDB))
  }

  /**
   * @deprecated use useEquipment() instead
   */
  static async getFromLocation (location: string) {
    const db = getFirestore()
    const querySnapshot = await getDocs(query(collection(db, 'equipment'), where('location', '==', location)))

    return querySnapshot.docs.map(x => new Equipment(x.id, x.data() as EquipmentDB))
  }

  /**
   * @deprecated use useEquipment() instead
   */
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

  static subscribe (onChange: (type: DocumentChangeType, eq: Equipment) => void) {
    const db = getFirestore()

    return onSnapshot(collection(db, 'equipment'), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const eq = new Equipment(change.doc.id, change.doc.data() as EquipmentDB)
        onChange(change.type, eq)
      })
    })
  }
}
