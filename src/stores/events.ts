import Event, { EventDB } from '@/model/event'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useEvents = defineStore('events', () => {
  const events = ref([] as Event[])
  const upcoming = ref([] as Event[])

  // Load and save events to local storage
  watch([events, upcoming], () => {
    const eventJson = JSON.stringify(events.value.map(x => [x.id, x.toDB()]))
    const upcomingJson = JSON.stringify(upcoming.value.map(x => [x.id, x.toDB()]))

    localStorage.setItem('events', eventJson)
    localStorage.setItem('upcoming', upcomingJson)
  }, {
    deep: true
  })

  events.value = JSON.parse(localStorage.getItem('events') || '[]')
    .map((event: [string, EventDB]) => new Event(event[0], event[1]))

  upcoming.value = JSON.parse(localStorage.getItem('upcoming') || '[]')
    .map((event: [string, EventDB]) => new Event(event[0], event[1]))

  // Subscribe to events
  let unsubscribe: (() => void) | null = null
  const subscribingMonth = ref(new Date())
  updateMonthSubscribtion(subscribingMonth.value)

  watch(subscribingMonth, updateMonthSubscribtion)

  function setSubscribingMonth (date = new Date()) {
    if (date.getMonth() !== subscribingMonth.value.getMonth() ||
      date.getFullYear() !== subscribingMonth.value.getFullYear()) {
      subscribingMonth.value = date
    }
  }

  function updateMonthSubscribtion (date: Date) {
    console.log('Updating month subscription', `(${date.getMonth() + 1}/${date.getFullYear()})`)
    if (unsubscribe) {
      unsubscribe()
    }

    unsubscribe = Event.subscribeMonth(date, (change) => {
      const { type, doc } = change
      let index: number

      switch (type) {
        case 'added':
          if (!events.value.find(x => x.id === doc.id)) {
            events.value.push(new Event(doc.id, doc.data() as EventDB))
            console.log('Added event', doc.id)
          }
          break
        case 'modified':
          index = events.value.findIndex(x => x.id === doc.id)
          if (index !== -1) {
            events.value[index] = new Event(doc.id, doc.data() as EventDB)
            console.log('Modified event', doc.id)
          } else {
            events.value.push(new Event(doc.id, doc.data() as EventDB))
            console.log('Added event', doc.id)
          }
          break
        case 'removed':
          index = events.value.findIndex(x => x.id === doc.id)
          if (index !== -1) {
            events.value.splice(index, 1)
            console.log('Removed event', doc.id)
          }
          break
      }
    })
  }

  // Subscribe to upcoming events
  Event.subscribeUpcoming(5, (type, event) => {
    const index = upcoming.value.findIndex(x => x.id === event.id)
    if (index === -1) {
      upcoming.value.push(event)
    }

    switch (type) {
      case 'added':
      case 'modified':
        upcoming.value[index] = event
        break
      case 'removed':
        upcoming.value.splice(index, 1)
        break
    }
  })

  return {
    events,
    upcoming,
    setSubscribingMonth
  }
})
