import Event from '@/model/event'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const selectedEvent = ref(null as null | Event)

  return {
    selectedEvent
  }
})
