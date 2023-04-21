import { User, UserDB } from '@/model/user'
import { watch, ref } from 'vue'
import { defineStore } from 'pinia'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useOffline } from '@/utilities/offline'

export const useUsers = defineStore('users', () => {
  const users = ref<Record<string, User>>({})

  function getUserByUsername (username: string) {
    return users.value[username] ?? null
  }

  // Save users to local storage
  watch(users, () => {
    localStorage.setItem('users', JSON.stringify(
      Object.keys(users.value).map((username) => [username, users.value[username].toDB()])
    ))
  })

  // Load locations from local storage
  JSON.parse(localStorage.getItem('users') || '[]')
    .forEach((user: [string, UserDB]) => {
      users.value[user[0]] = new User(user[1])
    })

  let unsubscribe: (() => void) | null = null
  async function subscribe () {
    unsubscribe?.()

    users.value = await User.get()

    unsubscribe = User.subscribe((type, user) => {
      switch (type) {
        case 'added':
        case 'modified':
          users.value[user.username] = user
          break
        case 'removed':
          delete users.value[user.username]
          break
      }
    })
  }

  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      subscribe()
    } else {
      unsubscribe?.()
      unsubscribe = null
    }
  })

  watch(useOffline(), (offline) => {
    if (offline) {
      unsubscribe?.()
      unsubscribe = null
    } else if (getAuth().currentUser) {
      subscribe()
    }
  })

  return {
    getUserByUsername
  }
})
