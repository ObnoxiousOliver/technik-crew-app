import { getDefaultPermissions } from '@/model/permissions'
import { User } from '@/model/user'
import { useOffline } from '@/utilities/offline'
import { getAuth } from 'firebase/auth'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useUser = defineStore('user', () => {
  const user = ref<User | null>(null)
  const username = computed(() => user.value?.username)
  const permissions = ref(getDefaultPermissions())
  const email = ref<string | null>(null)
  const uid = ref<string | null>(null)

  watch([user, uid], async () => {
    if (user.value) {
      uid.value = getAuth().currentUser?.uid ?? null

      setSubscription()
      localStorage.setItem('last_user', JSON.stringify({
        user: user.value?.toDB(),
        permissions: permissions.value,
        email: email.value,
        uid: uid.value
      }))
    } else {
      reset()
    }
  })

  const lastUser = localStorage.getItem('last_user')
  if (lastUser) {
    const {
      user: u,
      permissions: p,
      email: e,
      uid: i
    } = JSON.parse(lastUser)

    user.value = new User(u)
    Object.assign(permissions.value, p)
    email.value = e
    uid.value = i
  }

  let unsubscribe: (() => void) | null = null
  function setSubscription () {
    if (useOffline().value) return

    console.log('[User] Subscribing to user')
    if (unsubscribe) unsubscribe()
    if (!user.value) {
      permissions.value = getDefaultPermissions()
      email.value = null
      uid.value = null
      return
    }

    const u1 = user.value.subscribeEmail(e => {
      email.value = e
    })

    let u2: (() => void) | undefined
    if (uid.value) {
      u2 = User.subscribePermissions(uid.value, p => {
        Object.assign(permissions.value, p)
      })
    }

    unsubscribe = () => {
      u1()
      u2?.()
    }
  }

  async function setStore () {
    const u = await User.getCurrentUser()
    if (u) {
      user.value = u
      setSubscription()
    } else {
      user.value = null
    }
  }

  watch(useOffline(), (offline) => {
    if (offline) {
      unsubscribe?.()
      unsubscribe = null
    } else {
      setSubscription()
    }
  })

  function reset () {
    if (unsubscribe) unsubscribe()
    localStorage.removeItem('last_user')
    user.value = null
    permissions.value = getDefaultPermissions()
    email.value = null
    uid.value = null
  }

  return {
    user,
    username,
    permissions,
    email,
    uid,
    setStore,
    reset
  }
})
