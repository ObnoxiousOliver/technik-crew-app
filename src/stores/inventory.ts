import { Collection } from '@/model/inventory/collection'
import { FieldTemplate, FieldTypes } from '@/model/inventory/collectionField'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInventory = defineStore('inventory', () => {
  const collections = ref<Collection[]>([])

  function create (name: string, description?: string, fields?: FieldTemplate<FieldTypes>[]) {
    return Collection.create(name, description, fields)
  }

  let unsubscribe: (() => void) | null
  function subscribe () {
    unsubscribe?.()

    unsubscribe = Collection.subscribe(async (collection) => {
      const index = collections.value.findIndex(x => x.id === collection.doc.id)
      if (index === -1) {
        collections.value.push(new Collection(collection.doc.id, await collection.doc.data()))
      } else {
        collections.value[index] = new Collection(collection.doc.id, await collection.doc.data())
      }
    })
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
    create
  }
})
