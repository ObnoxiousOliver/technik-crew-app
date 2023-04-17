import { Location, LocationDB } from '@/model/location'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { search as s } from '@/utilities/search'
import { Unsubscribe, getAuth, onAuthStateChanged } from 'firebase/auth'

export const useLocations = defineStore('locations', () => {
  const locations = ref<Location[]>([])

  async function fetchAll () {
    const locs = await Location.get() as Location[]

    locations.value = locs
  }

  async function create (name: string, description: string) {
    const loc = await Location.create({ name, description })

    locations.value.push(loc)
  }

  function getLocationById (id: string) {
    return locations.value.find(x => x.id === id)
  }

  function search (query: string) {
    return s(query, locations.value, (x) => `${x.name} ${x.description} ${x.id}`)
  }

  // Save locations to local storage
  watch(locations, (locations) => {
    localStorage.setItem('locations', JSON.stringify(locations.map(x => [x.id, x.toDB()])))
  }, {
    deep: true
  })

  // Load locations from local storage
  locations.value = JSON.parse(localStorage.getItem('locations') || '[]')
    .map((loc: [string, LocationDB]) => new Location(loc[0], loc[1]))

  const loading = ref(locations.value.length === 0)

  // Subscribe to changes
  let unsubscribe: (() => void) | null = null
  function subscribe () {
    if (unsubscribe) {
      unsubscribe()
    }

    unsubscribe = Location.subscribe((type, location) => {
      const index = locations.value.findIndex(x => x.id === location.id)
      if (index === -1) {
        locations.value.push(location)
        loading.value = false
        return
      }

      switch (type) {
        case 'added':
        case 'modified':
          locations.value[index] = location
          break
        case 'removed':
          locations.value.splice(index, 1)
          break
      }
    })
  }

  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      if (unsubscribe) return
      subscribe()
    } else {
      unsubscribe?.()
      unsubscribe = null
    }
  })

  return {
    locations,
    fetchAll,
    create,
    getLocationById,
    search,
    loading
  }
})
