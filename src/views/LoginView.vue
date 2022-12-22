<template>
  <Page class="login-page" :navigation="false">
    <form
      @submit.prevent="submit"
      class="login-form"
    >
      <img @click.prevent="logoClick" ref="logo" class="login-form__logo" src="../assets/technik-crew-logo.svg" alt="Technik Crew Logo">
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
      router.replace('/dashboard')
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

const logo = ref(null as null | HTMLImageElement)
let scale = 1
let triggered = false
function logoClick () {
  if (!logo.value) return
  if (triggered) return
  scale += (1 + (scale - 1) * 30) * 0.005
  logo.value.style.transform = `scaleX(${scale})`

  if (scale > 90) {
    triggered = true
    logo.value.style.transition = 'transform 1s'
    logo.value.style.transform = `scale(${scale}, 100)`

    setTimeout(() => {
      logo.value.style.transition = '0s'
      logo.value.style.transform = 'scale(0)'

      setTimeout(() => {
        logo.value.style.transition = 'transform .5s'
        logo.value.style.transform = null

        setTimeout(() => {
          logo.value.style.transition = null
          scale = 1
          triggered = false
        }, 500)
      }, 100)
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
.login-page :deep(.page__scroller) {
  overflow-x: hidden;
}

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
    max-width: 15rem;
    width: calc(80%);
    height: auto;
    margin: 2rem auto 4rem;
    user-select: none;
    touch-action: none;
    transition: transform .2s;
    transform-origin: center 71%;
  }
}
</style>
