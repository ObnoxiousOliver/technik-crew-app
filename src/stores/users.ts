import { User, UserDB } from '@/model/user'
import { watch, ref } from 'vue'
import { defineStore } from 'pinia'

export const useUsers = defineStore('users', () => {
  const users = ref<{ [key: string]: User }>({})

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

  return {
    getUserByUsername
  }
})
