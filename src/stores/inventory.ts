import { Collection } from '@/model/inventory/collection'
import { FieldTemplate, FieldTypes } from '@/model/inventory/collectionField'
import { CollectionItem, CollectionItemDB } from '@/model/inventory/collectionItem'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInventory = defineStore('inventory', () => {
  const collections = ref<Collection[]>([])
  const items = ref<CollectionItem[]>([])

  function createCollection (name: string, description?: string, fields?: FieldTemplate<FieldTypes>[]) {
    return Collection.create(name, description, fields)
  }

  function createItem (options: Partial<CollectionItemDB >) {
    return CollectionItem.create(options)
  }

  function getCollectionById (id: string): Collection | undefined {
    return collections.value.find(x => x.id === id) as Collection | undefined
  }

  function getItemsByCollectionId (id: string): CollectionItem[] {
    return items.value.filter(x => x.collectionId === id) as CollectionItem[]
  }

  function getItemById (id: string): CollectionItem | undefined {
    return items.value.find(x => x.id === id) as CollectionItem | undefined
  }

  let unsubscribe: (() => void) | null
  function subscribe () {
    unsubscribe?.()

    const unsubscribeFunctions = [
      Collection.subscribe(async (collection) => {
        const index = collections.value.findIndex(x => x.id === collection.doc.id)
        if (index === -1) {
          collections.value.push(new Collection(collection.doc.id, await collection.doc.data()))
        } else {
          collections.value[index] = new Collection(collection.doc.id, await collection.doc.data())
        }
      }),
      CollectionItem.subscribe(async (item) => {
        const index = items.value.findIndex(x => x.id === item.doc.id)
        if (index === -1) {
          items.value.push(new CollectionItem(item.doc.id, await item.doc.data()))
        } else {
          items.value[index] = new CollectionItem(item.doc.id, await item.doc.data())
        }
      })
    ]

    unsubscribe = () => {
      unsubscribeFunctions.forEach(x => x())
    }
  }

  // Subscribe if user is logged in
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      subscribe()
    } else {
      unsubscribe?.()
      unsubscribe = null
    }
  })

  return {
    collections,
    createCollection,
    createItem,
    getCollectionById,
    getItemsByCollectionId,
    getItemById
  }
})
