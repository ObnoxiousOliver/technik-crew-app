import { DocumentChange, addDoc, collection, doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore'
import { FieldTemplate, FieldTemplateDB, FieldTypes } from './collectionField'
import { HistoryState } from '../history'
import { useUser } from '@/stores/user'

export const collectionId = 'inventory-collections'
export const itemsId = 'inventory-items'

export interface CollectionDB {
  name: string
  icon: string | null
  description: string | null
  fields: FieldTemplateDB<FieldTypes>[]
  is_hidden?: boolean
}

export class Collection {
  readonly id: string | null
  private collection: CollectionDB
  private _fields: FieldTemplate<FieldTypes>[]

  get name () { return this.collection.name }
  private set name (value) { this.collection.name = value }

  get icon () { return this.collection.icon }
  private set icon (value) { this.collection.icon = value }

  get description () { return this.collection.description }
  private set description (value) { this.collection.description = value }

  get fields () { return this._fields }
  private set fields (value) {
    this._fields = value
    this.collection.fields = value.map(field => field.toDB())
  }

  get isHidden () { return this.collection.is_hidden }
  private set isHidden (value) { this.collection.is_hidden = value }

  constructor (id: string | null, options: Partial<CollectionDB>) {
    this.id = id
    this.collection = {
      name: options.name ?? '',
      icon: options.icon ?? null,
      description: options.description ?? null,
      fields: options.fields ?? [],
      is_hidden: options.is_hidden ?? false
    }

    this._fields = this.collection.fields.map(x => FieldTemplate.fromDB(x))
  }

  toDB (): CollectionDB {
    return {
      name: this.name,
      icon: this.icon,
      description: this.description,
      fields: this._fields.map(field => field.toDB())
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

  async recordHistory <T> (options: Partial<{
    author: string
    description: string
    date: number
    type: string
    content: T
  }>) {
    if (!this.id) {
      throw new Error('Cannot record history on a collection without an id')
    }

    const db = getFirestore()

    addDoc(
      collection(db, collectionId, this.id, 'history'),
      new HistoryState({
        author: options.author ?? useUser().username,
        description: options.description,
        date: options.date,
        type: options.type ?? 'collection',
        content: options.content ?? this.toDB()
      }).toDB())
  }

  async save () {
    if (!this.id) {
      throw new Error('Cannot save a collection without an id')
    }

    const db = getFirestore()

    await setDoc(doc(db, collectionId, this.id), this.toDB())
  }

  static async create (name: string, description?: string | null, fields?: FieldTemplate<FieldTypes>[]) {
    const db = getFirestore()

    const c = new Collection(null, {
      name,
      description,
      fields
    })

    const docRef = await addDoc(collection(db, collectionId), c.toDB())
    return new Collection(docRef.id, c.toDB())
  }

  static subscribe (onChange: (change: DocumentChange<CollectionDB>) => void) {
    const db = getFirestore()

    return onSnapshot(collection(db, collectionId), (snapshot) => {
      snapshot.docChanges().forEach((x) => {
        onChange(x as DocumentChange<CollectionDB>)
      })
    })
  }
}
