<template>
  <Page>
    <template #title>
      <i class="bi-key"/>Passwort ändern
    </template>

    <form class="reset-form" @submit.prevent="submit">
      <div>
        <p>Bestätige die E-Mail Adresse deines Accounts, damir wir dir die E-Mail zum ändern deines Passworts senden können.</p>
        <p>Wenn du deine E-Mail nicht mehr kennst oder ändern willst wende dich an die Admins.</p>
        <p>
          <RouterLink to="/admins">
            Wer sind die Admins?
          </RouterLink>
        </p>
      </div>
      <FloatingLabelInput
        autocomplete="email"
        label="E-Mail"
      />
      <Btn type="submit">Senden</Btn>
    </form>
  </Page>
</template>

<script lang="ts" setup>
import { getAuth, sendPasswordResetEmail } from '@firebase/auth'
import { ref } from 'vue'
import FloatingLabelInput from '../../components/FloatingLabelInput.vue'

const email = ref('')
const auth = getAuth()

async function submit () {
  sendPasswordResetEmail(auth, email.value)
}
</script>

<style lang="scss" scoped>
.reset-form {
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
  margin-bottom: 2rem;
}
</style>
