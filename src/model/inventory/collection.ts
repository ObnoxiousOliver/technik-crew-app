import { DocumentChange, addDoc, collection, doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore'
import { FieldTemplate, FieldTemplateDB, FieldTypes } from './collectionField'

export const collectionId = 'inventory-collections'
export const itemsId = 'inventory-items'

export interface CollectionDB {
  name: string
  icon: string | null
  description: string | null
  fields: FieldTemplateDB<FieldTypes>[]
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

  constructor (id: string | null, options: Partial<CollectionDB>) {
    this.id = id
    this.collection = {
      name: options.name ?? '',
      icon: options.icon ?? null,
      description: options.description ?? null,
      fields: options.fields ?? []
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
