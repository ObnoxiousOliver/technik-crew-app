import { WikiCollectionDB, WikiPage } from '@/model/wiki'
import { dev, logWiki } from '@/utilities/developer'
import { logOnServer } from '@/utilities/log'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, deleteDoc, doc, getFirestore, onSnapshot } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useWiki = defineStore('wiki', () => {
  const pages = ref<WikiPage[]>([])
  const collections = ref<WikiCollectionDB[]>([])

  const loading = ref(true)

  let unsubscribe: (() => void) | null = null
  function subscribe () {
    unsubscribe?.()

    loading.value = true

    const db = getFirestore()
    const wikiCollection = collection(db, 'wiki')

    const unsubscribe1 = onSnapshot(wikiCollection, (snapshot) => {
      loading.value = false

      // Remove pages that are not in the snapshot
      pages.value = pages.value.filter((page) => {
        if (page.id === '!collections') {
          return false
        }

        return snapshot.docs.findIndex((doc) => doc.id === page.id) !== -1
      })

      // Add or update pages
      snapshot.docChanges().forEach((change) => {
        if (change.doc.id === '!collections') {
          return
        }

        const index = pages.value.findIndex((page) => page.id === change.doc.id)

        // Add new pages
        if (index === -1) {
          pages.value.push(new WikiPage(change.doc.id, change.doc.data()))
          return
        }

        // Update existing pages
        // And remove deleted pages (should not happen)
        switch (change.type) {
          case 'added':
          case 'modified':
            pages.value[index] = new WikiPage(change.doc.id, change.doc.data())
            break
          case 'removed':
            pages.value.splice(index, 1)
            break
        }
      })

      // Sort pages
      pages.value.sort((a, b) => {
        if (a.title > b.title) {
          return 1
        } else if (a.title < b.title) {
          return -1
        } else {
          return 0
        }
      })
    }, (error) => {
      loading.value = false

      console.error(...dev(logWiki), 'Error while subscribing to wiki pages:', error)
      logOnServer('Error:', 'Error while subscribing to wiki pages:', error.toString())
    })

    const unsubscribe2 = WikiPage.subscribeCollections((collectionsDoc) => {
      collectionsDoc.data()?.collections?.forEach((collection: WikiCollectionDB) => {
        const index = collections.value.findIndex((c) => c.id === collection.id)

        if (index === -1) {
          collections.value.push(collection)
        } else {
          collections.value[index] = collection
        }
      })
    })

    unsubscribe = () => {
      unsubscribe1()
      unsubscribe2()
    }
  }
  // Subscribe if user is logged in
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      subscribe()
    } else {
      unsubscribe?.()
    }
  })

  function getPageFromId (id: string) {
    return pages.value.find((page) => page.id === id) ?? null
  }

  function deletePage (pageId: string) {
    if (!pageId) {
      throw new Error('Cannot delete a wiki page without an id')
    }

    const db = getFirestore()
    deleteDoc(doc(db, 'wiki', pageId))
  }

  return {
    pages: computed(() => pages.value.filter((page) => !page.hidden)),
    collections,
    loading,
    getPageFromId,
    deletePage
  }
})
