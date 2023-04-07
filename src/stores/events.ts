import Event, { EventDB } from '@/model/event'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useEvents = defineStore('events', () => {
  const events = ref([] as Event[])
  const upcoming = ref([] as Event[])

  async function create (options: Partial<EventDB>) {
    events.value.push(await Event.create(options))
  }

  // Load and save events to local storage
  watch([events, upcoming], () => {
    // Clear duplicates
    const ids = events.value.map(x => x.id)
    if (ids.length !== new Set(ids).size) {
      console.warn('Duplicate events found')
      events.value = events.value.filter((x, i) => ids.indexOf(x.id) === i)
    }

    const eventJson = JSON.stringify(events.value.map(x => [x.id, x.toDB()]))
    const upcomingJson = JSON.stringify(upcoming.value.map(x => [x.id, x.toDB()]))

    localStorage.setItem('events', eventJson)
    localStorage.setItem('upcoming', upcomingJson)
  }, {
    deep: true
  })

  async function fetchUpcoming () {
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    // Get events that are already in the list
    const ue = events.value.filter(x => x.startDate >= now.getTime())

    if (ue.length >= 5) {
      ue.sort((a, b) => a.startDate - b.startDate)
      ue.splice(5)
      upcoming.value = ue
    } else {
      upcoming.value = await Event.getUpcoming(5)

      upcoming.value.forEach(x => {
        if (!events.value.find(y => y.id === x.id)) {
          events.value.push(x)
        }
      })
    }
  }

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

  async function updateMonthSubscribtion (date: Date) {
    console.log('Updating month subscription', `(${date.getMonth() + 1}/${date.getFullYear()})`)
    if (unsubscribe) {
      unsubscribe()
    }

    await fetchMonth(subscribingMonth.value)
    unsubscribe = Event.subscribeMonth(date, (change) => {
      const { type, doc } = change
      let index: number

      switch (type) {
        case 'added':
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

  async function fetchMonth (date: Date) {
    const monthEvents = await Event.getMonth(date)
    events.value = events.value.filter(x => x.months.includes(`${date.getFullYear()}-${date.getMonth() + 1}`))
    monthEvents.forEach(x => {
      if (!events.value.find(y => y.id === x.id)) {
        events.value.push(x)
      }
    })
  }

  return {
    events,
    upcoming,
    create,
    setSubscribingMonth,
    fetchUpcoming
  }
})
