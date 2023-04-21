<template>
  <Page>
    <template #title>
      Dein Passwort aussuchen
    </template>
    <form @submit.prevent="submit" class="sign-up-password__form">
      <div>
        <p>
          Nun {{ ticketStore.currentTicket?.firstname }}, jetzt kommt der Lieblingsteil von jedem. Aber ich verlange nicht viel. Nur mehr als 6 Zeichen.<br>
          Und wieder nein, wir können nicht dein Passwört sehen, also kannst du das gleiche Passwort nehmen, dass du auf all deinen anderen Seiten hast.
        </p>
      </div>
      <input
        type="text"
        style="display: none;"
        autocomplete="username"
        :value="ticketStore.currentTicket?.username"
      >
      <input
        type="text"
        style="display: none;"
        autocomplete="email"
        :value="ticketStore.email"
      >
      <FloatingLabelInput
        type="password"
        autocomplete="new-password"
        v-model="password"
        required
        minlength="6"
        label="Passwort (mind. 6 Zeichen)"
      />
      <Btn type="submit">
        Weiter
      </Btn>
    </form>
  </Page>
</template>

<script lang="ts" setup>
import { useTicket } from '@/stores/ticket'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FloatingLabelInput from '@/components/FloatingLabelInput.vue'
import { createUserFromTicket } from '@/utilities/auth'

const router = useRouter()

const ticketStore = useTicket()

onMounted(() => {
  if (!ticketStore.currentTicket) {
    router.replace('/sign-up/code')
  }
})

const password = computed({
  get: () => ticketStore.password,
  set: (val) => { ticketStore.password = val }
})
async function submit () {
  try {
    await createUserFromTicket(...ticketStore.combineData())
    router.push('/')
  } catch (err) {}
}
</script>

<style lang="scss" scoped>
.sign-up-password {
  &__form {
    display: flex;
    flex-flow: column nowrap;
    gap: 1rem;
  }
}
</style>
