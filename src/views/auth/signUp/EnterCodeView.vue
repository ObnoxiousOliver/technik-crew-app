<template>
  <Page>
    <template #title>
      Code eingeben
    </template>

    <p>Hast du einen 6-stelligen Code von den Admins bekommen? Den kannst du hier eingeben und dein Profil erstellen.</p>
    <p>Achtung! Du solltest den Code niemand anderen geben, da der Code nur für dich bestimmt ist.</p>
    <p>Nachdem du dein Profil erstellt hast, kannst du den Code nicht mehr einlösen.</p>
    <FormContainer
      class="form"
      @submit.prevent="submit"
      :disabled="submitting"
    >
      <CodeInput
        v-model="code"
        autocomplete="one-time-code"
      />
      <FormInfo v-if="codeError">
        {{ codeError }}
      </FormInfo>
      <Btn
        class="form__submit"
        type="submit"
      >
        Einlösen
      </Btn>
    </FormContainer>
  </Page>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { encryptTicket, getTicket } from '@/utilities/auth'
import { useTicket } from '@/stores/ticket'
import { useRoute, useRouter } from 'vue-router'
import { TicketDB } from '@/model/ticket'
import { doc, getDoc, getFirestore } from '@firebase/firestore'
import { logOnServer } from '@/utilities/log'
import CodeInput from '@/components/CodeInput.vue'

const router = useRouter()
const route = useRoute()

const ticketStore = useTicket()

const codeError = ref('')
const code = ref(route.params.code)

watch(code, (val) => {
  router.replace('/sign-up/code/' + val)
})

onMounted(() => {
  ticketStore.reset()
})

const submitting = ref(false)
async function submit () {
  if (code.value.length !== 6) {
    codeError.value = 'Bitte einen 6-stelligen Code eingeben'
    return
  }

  submitting.value = true
  const ticket: TicketDB | undefined = await getTicket(code.value)

  if (ticket?.invalid) {
    codeError.value = 'Der Code wurde schon eingelöst'
  } else if (ticket) {
    try {
      // Check if user was already created with ticket
      const userExisits = (await getDoc(doc(getFirestore(), `user-mail/${ticket.username}`))).exists()
      if (userExisits) {
        logOnServer('Warning: Ticket is not invalidated: ' + encryptTicket(code.value))
        codeError.value = 'Der Code wurde schon eingelöst'
        submitting.value = false
        return
      }
    } catch (err) {
      console.error(err)
      logOnServer('Error in "submit" on EnterCodeView.vue: ' + err)
      codeError.value = 'Ein Fehler ist aufgetreten: ' + err
      submitting.value = false
      return
    }

    ticketStore.currentTicket = ticket
    ticketStore.code = code.value

    router.push('/sign-up/email')
  } else {
    codeError.value = 'Ungültiger Code'
  }
  submitting.value = false
}
</script>
