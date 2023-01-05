import { getDefaultPermissions } from '@/model/permissions'
import { User } from '@/model/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUser = defineStore('user', () => {
  const user = ref(null as null | User)
  const permissions = ref(getDefaultPermissions())

  function reset () {
    user.value = null
    permissions.value = getDefaultPermissions()
  }

  return {
    user,
    permissions,
    reset
  }
})
