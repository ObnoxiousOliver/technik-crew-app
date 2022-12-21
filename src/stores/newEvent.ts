import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNewEventStore = defineStore('newEvent', () => {
  const title = ref('')
  const startDate = ref(null as null | number)
  const endDate = ref(null as null | number)
  const wholeDay = ref(true)
  const desc = ref('')

  function reset () {
    title.value = ''
    startDate.value = null
    endDate.value = null
    wholeDay.value = true
    desc.value = ''
  }

  return {
    title,
    startDate,
    endDate,
    wholeDay,
    desc,
    reset
  }
})
