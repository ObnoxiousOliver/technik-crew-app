<template>
  <Page class="login-page" :navigation="false">
    <template #btns>
      <Btn :to="{ name: 'help' }" aria-label="Hifle und Support">
        <i class="bi-question-lg" />
      </Btn>
    </template>

    <img
      @click.prevent="logoClick"
      ref="logo"
      class="logo"
      src="../../assets/technik-crew-logo.svg"
      alt="Technik Crew Logo"
    >

    <OfflineMessage v-if="offline" notSupported />

    <FormContainer
      v-else
      @submit.prevent="submit"
      class="form"
      :disabled="submitting"
    >
      <FormGroup>
        <FloatingLabelInput
          label="vorname.nachname oder Lehrerkürzel"
          v-model="name"
          autocomplete="username"
          autocapitalize="off"
          autocorrect="off"
        />
        <FloatingLabelInput
          label="Passwort"
          v-model="password"
          type="password"
          autocomplete="current-password"
        />
      </FormGroup>
      <FormInfo :show="authError">
        {{ authError }}
      </FormInfo>

      <RouterLink class="reset-password" to="/reset-password">Passwort vergessen?</RouterLink>
      <LoginButton class="login-btn" type="submit">Login</LoginButton>
      <RouterLink class="sign-up" to="/sign-up/code">Mit 6-stelligen Code registrieren</RouterLink>
    </FormContainer>
  </Page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signIn } from '@/utilities/auth'

import FloatingLabelInput from '../../components/FloatingLabelInput.vue'
import LoginButton from '../../components/LoginButton.vue'
import { FirebaseError } from 'firebase/app'
import { useOffline } from '@/utilities/offline'
import OfflineMessage from '@/components/OfflineMessage.vue'
import FormContainer from '@/components/FormContainer.vue'
import FormGroup from '@/components/FormGroup.vue'
import FormInfo from '@/components/FormInfo.vue'

const router = useRouter()

const offline = useOffline()

const name = ref('')
const password = ref('')

const authError = ref('')
const submitting = ref(false)
async function submit () {
  if (!name.value || !password.value) {
    authError.value = 'Bitte gib einen Namen und ein Passwort ein'
    return
  }
  submitting.value = true

  try {
    await signIn(name.value.trim().toLocaleLowerCase(), password.value)
    router.push('/')
  } catch (error) {
    const err = error as FirebaseError
    if (err.code === 'auth/user-not-found') {
      authError.value = 'Dieser Benutzer existiert nicht'
    } else if (err.code === 'auth/wrong-password') {
      authError.value = 'Falsches Passwort'
    } else {
      authError.value = 'Ein Fehler ist aufgetreten: ' + err
    }
    console.error('Auth', err)
  }
  submitting.value = false
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
      if (!logo.value) return

      logo.value.style.transition = '0s'
      logo.value.style.transform = 'scale(0)'

      setTimeout(() => {
        if (!logo.value) return

        logo.value.style.transition = 'transform .5s'
        logo.value.style.transform = ''

        setTimeout(() => {
          if (!logo.value) return

          logo.value.style.transition = ''
          scale = 1
          triggered = false
        }, 500)
      }, 100)
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.reset-password {
  margin: 0 .2rem;
  align-self: flex-start;
}

.sign-up {
  text-align: center;
  margin: 1em 0 0;
  color: r.$text-secondary;

  &:hover {
    color: r.$text-primary;
  }
}

.logo {
  display: block;
  max-width: 15rem;
  width: 50%;
  height: auto;
  margin: max(4rem, calc(25vh - 4rem)) auto;
  user-select: none;
  touch-action: none;
  transition: transform .2s;
  transform-origin: center 71%;
}
</style>
