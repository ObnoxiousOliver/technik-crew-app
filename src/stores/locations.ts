import { Location, LocationDB } from '@/model/location'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useLocations = defineStore('locations', () => {
  const locations = ref<Location[]>([])

  async function fetchAll () {
    const locs = await Location.get() as Location[]

    locations.value = locs
  }

  async function create (name: string) {
    const loc = await Location.create({ name })

    locations.value.push(loc)
  }

  // Save locations to local storage
  watch(locations, (locations) => {
    localStorage.setItem('locations', JSON.stringify(locations.map(x => [x.id, x.toDB()])))
  })

  // Load locations from local storage
  locations.value = JSON.parse(localStorage.getItem('locations') || '[]')
    .map((loc: [string, LocationDB]) => new Location(loc[0], loc[1]))

  fetchAll()

  return {
    locations,
    fetchAll,
    create
  }
})
