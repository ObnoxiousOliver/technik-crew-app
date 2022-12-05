<template>
  <Page :navigation="false">
    <form
      @submit.prevent="submit"
      class="login-form"
    >
      <img class="login-form__logo" src="../assets/technik-crew-logo.svg" alt="Technik Crew Logo">
      <FloatingLabelInput
        label="Name"
        v-model="name"
        autocomplete="username"
      />
      <FloatingLabelInput
        label="Passwort"
        v-model="password"
        type="password"
        autocomplete="current-password"
      />
      <router-link class="login-form__reset-password" to="/reset-password">Passwort vergessen?</router-link>
      <LoginButton class="login-form__login-btn" type="submit">Login</LoginButton>
    </form>
  </Page>
</template>

<script lang="ts" setup>
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from '@firebase/auth'
import { doc, getDoc, getFirestore } from '@firebase/firestore'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CryptoJS from 'crypto-js'

import FloatingLabelInput from '../components/FloatingLabelInput.vue'
import LoginButton from '../components/LoginButton.vue'

const router = useRouter()

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      router.push('/dashboard')
    }
  })()
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

<style lang="scss" scoped>
.login-form {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  gap: .5rem;
  min-height: calc(100% - 3rem);
  max-width: 25rem;
  margin: 0 auto 3rem;
  padding: 0 1rem;

  & > * {
    flex: 0 0 auto;
  }

  &__reset-password {
    margin: 1.5rem 0;
    align-self: start;
  }

  &__logo {
    max-width: 12rem;
    width: 100%;
    margin: 2rem auto 4rem;
    user-select: none;
    pointer-events: none;
    touch-action: none;
  }
}
</style>
