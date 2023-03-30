import { Location, LocationDB } from '@/model/location'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { search as s } from '@/utilities/search'

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
  })

  // Load locations from local storage
  locations.value = JSON.parse(localStorage.getItem('locations') || '[]')
    .map((loc: [string, LocationDB]) => new Location(loc[0], loc[1]))

  // Subscribe to changes
  Location.subscribe((type, location) => {
    const index = locations.value.findIndex(x => x.id === location.id)
    if (index === -1) {
      locations.value.push(location)
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

  return {
    locations,
    fetchAll,
    create,
    getLocationById,
    search
  }
})
