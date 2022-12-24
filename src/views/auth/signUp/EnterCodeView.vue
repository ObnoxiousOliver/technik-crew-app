<template>
  <Page>
    <template #title>
      Code eingeben
    </template>

    <form class="sign-up-code__form" @submit.prevent="submit">
      <div>
        <p>Hast du einen 6-stelligen Code von den Admins bekommen? Den kannst du hier eingeben und dein Profil erstellen.</p>
        <p>Achtung! Du solltest den Code niemand anderen geben, da der Code nur für dich bestimmt ist.</p>
        <p>Nachdem du dein Profil erstellt hast, kannst du den Code nicht mehr einlösen.</p>
      </div>
      <div class="sign-up-code__error">{{ errorMsg }}</div>
      <InputField
        class="sign-up-code__code-input"
        placeholder="XXXXXX"
        type="number"
        @input="codeInput"
        v-model:value="inputValue"
        :disabled="submitting"
        autocomplete="one-time-code"
      />
      <Btn
        :disabled="submitting"
        type="submit"
      >
        Einlösen
      </Btn>
    </form>
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

const router = useRouter()
const route = useRoute()

const ticketStore = useTicket()

const errorMsg = ref('')
const inputValue = ref(null)
const code = ref('')

function codeInput (e: InputEvent) {
  if (e.target.value.length < 7) {
    code.value = e.target.value.split('').filter(x => '0123456789'.includes(x)).join('').slice(0, 6)
  }
  e.target.value = code.value
}
watch(code, (val) => {
  inputValue.value = val
  router.replace('/sign-up/code/' + val)
})

onMounted(() => {
  ticketStore.reset()
  code.value = route.params.code.split('').filter(x => '0123456789'.includes(x)).join('').slice(0, 6)
})

const submitting = ref(false)
async function submit () {
  if (code.value.length !== 6) {
    errorMsg.value = 'Bitte einen 6-stelligen Code eingeben'
    return
  }

  submitting.value = true
  const ticket: TicketDB | undefined = await getTicket(code.value)

  if (ticket?.invalid) {
    errorMsg.value = 'Der Code wurde schon eingelöst'
  } else if (ticket) {
    try {
      // Check if user was already created with ticket
      const userExisits = (await getDoc(doc(getFirestore(), `user-mail/${ticket.username}`))).exists()
      if (userExisits) {
        logOnServer('Warning: Ticket is not invalidated: ' + encryptTicket(code.value))
        errorMsg.value = 'Der Code wurde schon eingelöst'
        submitting.value = false
        return
      }
    } catch (err) {
      console.error(err)
      logOnServer('Error in "submit" on EnterCodeView.vue: ' + err)
      errorMsg.value = 'Ups! Es ist ein fehler aufgetreten'
      submitting.value = false
      return
    }

    ticketStore.currentTicket = ticket
    ticketStore.code = code.value

    router.push('/sign-up/email')
  } else {
    errorMsg.value = 'Ungültiger Code'
  }
  submitting.value = false
}
</script>

<style lang="scss" scoped>
@use '../../../scss' as r;

.sign-up-code {
  &__code-input {
    text-align: center;
    letter-spacing: min(2rem, 5vw);
    text-indent: min(2rem, 5vw);
    font-size: 1.5rem;
    padding: 1rem 0;
  }
  &__form {
    display: flex;
    flex-flow: column nowrap;
    gap: 1rem;
  }

  &__error {
    color: r.$danger;
  }
}
</style>
