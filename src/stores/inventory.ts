import { Collection, itemsId } from '@/model/inventory/collection'
import { FieldTemplate, FieldTypes } from '@/model/inventory/collectionField'
import { CollectionItem, CollectionItemDB } from '@/model/inventory/collectionItem'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { deleteDoc, doc, getFirestore } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useInventory = defineStore('inventory', () => {
  const collections = ref<Collection[]>([])
  const items = ref<CollectionItem[]>([])
  const loading = ref(true)

  function createCollection (opt: {
    name: string,
    description?: string,
    fields?: FieldTemplate<FieldTypes>[]
  }) {
    return Collection.create(opt.name, opt.description, opt.fields)
  }

  function createItem (options: Partial<CollectionItemDB >) {
    return CollectionItem.create(options)
  }

  function getCollectionById (id: string | 'unassigned'): Collection | undefined {
    return collections.value.find(x => x.id === id) as Collection | undefined
  }

  function getItemsByCollectionId (id: string | 'unassigned'): CollectionItem[] {
    return items.value.filter(x => {
      if (id === 'unassigned') {
        return !x.collectionId || collections.value.every(c => c.id !== x.collectionId)
      }
      return x.collectionId === id
    }) as CollectionItem[]
  }

  function getItemById (id: string): CollectionItem | undefined {
    return items.value.find(x => x.id === id) as CollectionItem | undefined
  }

  async function deleteItem (id?: string | null) {
    if (!id) {
      throw new Error('Cannot delete an inventory item without an id')
    }

    const db = getFirestore()
    await deleteDoc(doc(db, itemsId, id))
  }

  let unsubscribe: (() => void) | null
  function subscribe () {
    unsubscribe?.()

    Collection.get().then((col) => {
      collections.value = col as Collection[]
    }).finally(() => {
      loading.value = false
    })

    const unsubscribeFunctions = [
      Collection.subscribe(async (collection) => {
        const index = collections.value.findIndex(x => x.id === collection.doc.id)

        if (index === -1) {
          collections.value.push(new Collection(collection.doc.id, await collection.doc.data()))
          return
        }

        switch (collection.type) {
          case 'added':
          case 'modified':
            collections.value[index] = new Collection(collection.doc.id, await collection.doc.data())
            break
          case 'removed':
            collections.value.splice(index, 1)
            break
        }
      }),
      CollectionItem.subscribe(async (item) => {
        const index = items.value.findIndex(x => x.id === item.doc.id)
        if (index === -1) {
          items.value.push(new CollectionItem(item.doc.id, await item.doc.data()))
          return
        }

        switch (item.type) {
          case 'added':
          case 'modified':
            items.value[index] = new CollectionItem(item.doc.id, await item.doc.data())
            break
          case 'removed':
            items.value.splice(index, 1)
            break
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

  // Load equipment from local storage
  watch([collections, items], () => {
    localStorage.setItem('inventory-collections', JSON.stringify(
      collections.value.map((c) => [c.id, c.toDB()])
    ))
    localStorage.setItem('inventory-items', JSON.stringify(
      items.value.map((i) => [i.id, i.toDB()])
    ))
  }, { deep: true })
  collections.value = JSON.parse(localStorage.getItem('inventory-collections') || '[]')
    .map((c: [string, Collection]) => new Collection(c[0], c[1]))
  items.value = JSON.parse(localStorage.getItem('inventory-items') || '[]')
    .map((i: [string, CollectionItem]) => new CollectionItem(i[0], i[1]))

  return {
    collections,
    createCollection,
    createItem,
    getCollectionById,
    getItemsByCollectionId,
    getItemById,
    loading,
    deleteItem
  }
})
