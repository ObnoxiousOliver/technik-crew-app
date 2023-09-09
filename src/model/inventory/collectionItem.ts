import { DocumentChange, addDoc, collection, doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore'
import { FieldTypes, FieldValue } from './collectionField'
import { Collection, itemsId } from './collection'
import { HistoryState } from '../history'
import { useUser } from '@/stores/user'
import { useLocations } from '@/stores/locations'

export interface CollectionItemDB {
  collectionId: string | null
  name: string
  description: string
  code: string | null
  locationId: string | null
  fields: FieldValue<FieldTypes>[]
  is_hidden: boolean
}

export class CollectionItem {
  readonly id: string | null
  private collectionItem: CollectionItemDB

  get collectionId () {
    return this.collectionItem.collectionId
  }

  private set collectionId (val) {
    this.collectionItem.collectionId = val
  }

  get name () {
    return this.collectionItem.name
  }

  private set name (val) {
    this.collectionItem.name = val
  }

  get description () {
    return this.collectionItem.description
  }

  private set description (val) {
    this.collectionItem.description = val
  }

  get code () {
    return this.collectionItem.code
  }

  private set code (val) {
    this.collectionItem.code = val
  }

  get locationId () {
    return this.collectionItem.locationId
  }

  private set locationId (val) {
    this.collectionItem.locationId = val
  }

  get fields () {
    return this.collectionItem.fields
  }

  private set fields (val) {
    this.collectionItem.fields = val
  }

  get isHidden () {
    return this.collectionItem.is_hidden
  }

  private set isHidden (val) {
    this.collectionItem.is_hidden = val
  }

  constructor (id: string | null, options: Partial<CollectionItemDB>) {
    this.id = id
    this.collectionItem = {
      collectionId: options.collectionId ?? null,
      name: options.name ?? '',
      description: options.description ?? '',
      code: options.code ?? null,
      locationId: options.locationId ?? null,
      fields: options.fields ?? [],
      is_hidden: options.is_hidden ?? false
    }
  }

  toDB (): CollectionItemDB {
    return {
      collectionId: this.collectionItem.collectionId,
      name: this.name,
      description: this.description,
      code: this.code,
      locationId: this.locationId,
      fields: this.fields,
      is_hidden: this.isHidden
    }
  }

  async set (options: Partial<CollectionItemDB>) {
    if (!this.id) {
      throw new Error('Cannot change a collection item without an id')
    }

    const changes = []

    if (options.name && options.name !== this.name) {
      this.name = options.name
      changes.push(`Name geändert -> ${options.name}`)
    }
    if (options.description && options.description !== this.description) {
      this.description = options.description
      changes.push(`Beschreibung geändert ->\n${options.description}`)
    }
    if (options.code && options.code !== this.code) {
      this.code = options.code
      changes.push(options.code ? 'Code geändert -> ' + options.code : 'Code entfernt')
    }
    if (options.locationId && options.locationId !== this.locationId) {
      this.locationId = options.locationId
      changes.push(options.locationId ? 'Standort geändert -> ' + useLocations().getLocationById(options.locationId)?.name ?? options.locationId : 'Standort entfernt')
    }
    if (options.fields && JSON.stringify(options.fields) !== JSON.stringify(this.fields)) {
      this.fields = options.fields
      changes.push('Felder geändert')
    }
    if (options.is_hidden && options.is_hidden !== this.isHidden) {
      this.isHidden = options.is_hidden
      changes.push(options.is_hidden ? 'Ausgeblendet' : 'Wieder sichtbar')
    }

    if (changes.length === 0) return

    await this.save()
    await this.recordHistory({
      description: changes.join('\n')
    })
  }

  async save () {
    if (!this.id) {
      throw new Error('Cannot save collection item without an id')
    }

    const db = getFirestore()

    await setDoc(doc(db, itemsId, this.id), this.toDB())
  }

  async recordHistory <T> (options: Partial<{
    author: string
    description: string
    date: number
    type: string
    content: T
  }>) {
    if (!this.id) {
      throw new Error('Cannot record history on an item without an id')
    }

    const db = getFirestore()

    addDoc(
      collection(db, itemsId, this.id, 'history'),
      new HistoryState({
        author: options.author ?? useUser().username,
        description: options.description,
        date: options.date,
        type: options.type ?? 'item',
        content: options.content ?? this.toDB()
      }).toDB())
  }

  async getHistory () {
    if (!this.id) {
      throw new Error('Cannot get history on an collection item without an id')
    }

    return HistoryState.get(itemsId, this.id)
  }

  async setCode (code: string | null) {
    this.code = code
    await this.save()

    await this.recordHistory({
      description: code ? 'Code geändert -> ' + code : 'Code entfernt'
    })
  }

  async setLocation (locationId: string | null) {
    this.locationId = locationId
    await this.save()

    await this.recordHistory({
      description: locationId ? 'Standort geändert -> ' + useLocations().getLocationById(locationId)?.name ?? locationId : 'Standort entfernt'
    })
  }

  static subscribe (onChange: (change: DocumentChange<CollectionItemDB>) => void) {
    const db = getFirestore()

    return onSnapshot(collection(db, itemsId), (snapshot) => {
      snapshot.docChanges().forEach((x) => {
        onChange(x as DocumentChange<CollectionItemDB>)
      })
    })
  }

  static async create (options: Partial<CollectionItemDB>) {
    const db = getFirestore()

    let item = new CollectionItem(null, options)

    const docRef = await addDoc(collection(db, itemsId), item.toDB())

    item = new CollectionItem(docRef.id, options)

    await item.recordHistory({
      description: 'Gegenstand erstellt'
    })

    return item
  }

  static getUnassignedFields (item: CollectionItem, collection: Collection) {
    return item.fields.filter((field) => {
      return !collection.fields.find((templateField) => templateField.id === field.id)
    })
  }
}
