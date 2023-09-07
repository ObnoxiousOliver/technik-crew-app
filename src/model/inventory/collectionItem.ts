import { DocumentChange, addDoc, collection, doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore'
import { FieldTypes, FieldValue } from './collectionField'
import { itemsId } from './collection'
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

  constructor (id: string | null, options: Partial<CollectionItemDB>) {
    this.id = id
    this.collectionItem = {
      collectionId: options.collectionId ?? null,
      name: options.name ?? '',
      description: options.description ?? '',
      code: options.code ?? null,
      locationId: options.locationId ?? null,
      fields: options.fields ?? []
    }
  }

  toDB (): CollectionItemDB {
    return {
      collectionId: this.collectionItem.collectionId,
      name: this.name,
      description: this.description,
      code: this.code,
      locationId: this.locationId,
      fields: this.fields
    }
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
    console.log(item.toDB())
    const docRef = await addDoc(collection(db, itemsId), item.toDB())
    item = new CollectionItem(docRef.id, options)
    return item
  }
}
