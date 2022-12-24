import { TicketDB } from '@/model/ticket'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTicket = defineStore('ticket', () => {
  const currentTicket = ref(null as null | TicketDB)
  const code = ref(null as null | string)
  const email = ref('')
  const password = ref('')

  function reset () {
    currentTicket.value = null
    code.value = null
    email.value = ''
    password.value = ''
  }

  function combineData () {
    return [
      currentTicket.value,
      code.value,
      email.value,
      password.value
    ]
  }

  return {
    currentTicket,
    code,
    email,
    password,
    reset,
    combineData
  }
})
