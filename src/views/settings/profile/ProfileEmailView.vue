<template>
  <Page>
    <template #title>
      <i class="bi-at" />E-Mail Adresse ändern
    </template>

    <p>
      Wenn du deine E-Mail Adresse änderst, wird deiner alten E-Mail Adresse eine E-Mail, um die Änderung zu widerrufen, geschickt.
    </p>

    <FormContainer @submit.prevent="submit">
      <FloatingLabelInput
        label="Neue E-Mail"
        autocomplete="email"
        v-model="email"
      />
      <FormInfo :show="emailError">
        {{ emailError }}
      </FormInfo>
      <Btn type="submit">
        Bestätigen
      </Btn>
    </FormContainer>
  </Page>
</template>

<script lang="ts" setup>
import FloatingLabelInput from '@/components/FloatingLabelInput.vue'
import FormContainer from '@/components/FormContainer.vue'
import FormInfo from '@/components/FormInfo.vue'
import { back } from '@/router'
import { changeEmail } from '@/utilities/auth'
import { getAuth } from '@firebase/auth'
import { ref } from 'vue'

const email = ref('')

const submitting = ref(false)
const emailError = ref('')
async function submit () {
  if (!email.value) {
    emailError.value = 'Bitte gib eine E-Mail Adresse ein'
    return
  } else if (!email.value.includes('@')) {
    emailError.value = 'Bitte gib eine gültige E-Mail Adresse ein'
    return
  } else if (email.value === getAuth().currentUser?.email) {
    emailError.value = 'Diese E-Mail Adresse ist bereits deine E-Mail Adresse'
    return
  } else {
    emailError.value = ''
  }

  submitting.value = true
  try {
    await changeEmail()
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      emailError.value = 'Diese E-Mail Adresse wird bereits verwendet'
    } else {
      emailError.value = 'Ein Fehler ist aufgetreten: ' + err
    }
    submitting.value = false
    return
  }
  submitting.value = false
  back()
}
</script>
