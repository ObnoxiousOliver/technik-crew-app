import Event from '@/model/event'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEvents = defineStore('events', () => {
  const selectedEvent = ref(null as null | Event)
  const events = ref([] as Event[])
  const upcoming = ref([] as Event[])

  async function fetchMonth (date: Date) {
    const fetchedEvents = await Event.getMonth(date)

    const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
    events.value = events.value.filter(event => !event.months.includes(month))

    events.value.push(...fetchedEvents)

    events.value.sort((a, b) => {
      return a.startDate - b.startDate
    })
  }

  async function fetchUpcoming (n: number) {
    const fetchedEvents = await Event.getUpcoming(n)

    const minStart = Math.min(...fetchedEvents.map(x => x.startDate))
    const maxStart = Math.max(...fetchedEvents.map(x => x.startDate))

    events.value = events.value.filter(event => !(event.startDate >= minStart && event.startDate <= maxStart))
    events.value.push(...fetchedEvents)
    upcoming.value = fetchedEvents

    events.value.sort((a, b) => {
      return a.startDate - b.startDate
    })

    upcoming.value.sort((a, b) => {
      return a.startDate - b.startDate
    })
  }

  return {
    events,
    upcoming,
    fetchMonth,
    fetchUpcoming,
    selectedEvent
  }
})
