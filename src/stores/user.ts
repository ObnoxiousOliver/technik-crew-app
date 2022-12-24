import { PermissionsDB } from '@/model/permissions'
import { User } from '@/model/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUser = defineStore('user', () => {
  const user = ref(null as null | User)
  const permissions = ref({} as PermissionsDB)

  function reset () {
    user.value = null
    permissions.value = {}
  }

  return {
    user,
    permissions,
    reset
  }
})
