<template>
  <Page>
    <template #title>
      <i class="bi-key"/>Passwort ändern
    </template>

    <p>Bestätige die E-Mail Adresse deines Accounts, damir wir dir die E-Mail zum ändern deines Passworts senden können.</p>
    <p>Wenn du deine E-Mail nicht mehr kennst oder ändern willst wende dich an die Admins.</p>
    <p>
      <RouterLink to="/admin/who">
        Wer sind die Admins?
      </RouterLink>
    </p>
    <FormContainer
      @submit.prevent="submit"
      :disabled="submitting"
    >
      <FloatingLabelInput
        autocomplete="email"
        label="E-Mail"
        v-model="email"
      />
      <FormInfo v-if="authError">
        {{ authError }}
      </FormInfo>
      <Btn type="submit" class="form__submit">Senden</Btn>
      <FormInfo type="success" v-if="success">
        <i class="bi-check" /> E-Mail wurde gesendet
      </FormInfo>
    </FormContainer>
  </Page>
</template>

<script lang="ts" setup>
import { getAuth, sendPasswordResetEmail } from '@firebase/auth'
import { ref } from 'vue'
import FloatingLabelInput from '../../components/FloatingLabelInput.vue'

const email = ref('')
const auth = getAuth()

const authError = ref('')
const submitting = ref(false)
const success = ref(false)
async function submit () {
  success.value = false
  if (!email.value) {
    authError.value = 'Bitte gib eine E-Mail Adresse ein'
    return
  } else {
    authError.value = ''
  }

  submitting.value = true
  try {
    await sendPasswordResetEmail(auth, email.value)
    success.value = true
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      authError.value = 'Es gibt keinen Account mit dieser E-Mail Adresse'
    } else if (err.code === 'auth/invalid-email') {
      authError.value = 'Diese E-Mail Adresse ist ungültig'
    } else {
      authError.value = 'Ein Fehler ist aufgetreten: ' + err
    }
    console.error('Auth', err)
  }
  submitting.value = false
}
</script>

<style lang="scss" scoped>

</style>
