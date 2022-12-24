import { User } from '@/model/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUser = defineStore('user', () => {
  const user = ref(null as null | User)

  return {
    user
  }
})
