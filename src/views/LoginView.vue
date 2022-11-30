<template>
  <form @submit.prevent="submit">
    Name: <input type="text" v-model="name"><br>
    Password: <input type="password" v-model="password"><br>
    <button type="submit">Login</button>
  </form>
</template>

<script lang="ts" setup>
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from '@firebase/auth'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      router.push('/dashboard')
      unsubscribe()
    }
  })
})

const name = ref('')
const password = ref('')

function submit () {
  const email = name.value + '@leibniz-technik-crew.web.app'
  console.log('Logging in as', email)

  signInWithEmailAndPassword(getAuth(), email, password.value)
    .then(() => {
      router.push('/')
    }).catch((err) => {
      console.error('Auth', err)
    })
}
</script>
