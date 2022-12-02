<template>
  <form @submit.prevent="submit">
    Name: <input type="text" v-model="name"><br>
    Password: <input type="password" v-model="password"><br>
    <button type="submit">Login</button>
  </form>
</template>

<script lang="ts" setup>
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from '@firebase/auth'
import { doc, getDoc, getFirestore } from '@firebase/firestore'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CryptoJS from 'crypto-js'

const router = useRouter()

onMounted(() => {
  const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      router.push('/dashboard')
      unsubscribe()
    }
  })
})

const db = getFirestore()

const name = ref('')
const password = ref('')

async function submit () {
  console.log('Logging in as', name.value)

  const userDoc = await getDoc(doc(db, `user-mail/${name.value}`))
  const encryptedEmail = userDoc.get('email')

  const key = CryptoJS.enc.Base64.parse(name.value)
  const iv = CryptoJS.enc.Base64.parse('                   ')
  const email = CryptoJS.AES.decrypt(encryptedEmail, key, { iv }).toString(CryptoJS.enc.Utf8)

  signInWithEmailAndPassword(getAuth(), email, password.value)
    .then(() => {
      router.push('/')
    }).catch((err) => {
      console.error('Auth', err)
    })
}
</script>
