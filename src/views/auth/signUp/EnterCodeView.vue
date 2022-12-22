<template>
  <Page>
    <template #title>
      Code eingeben
    </template>

    <form @submit.prevent="submit">
      <input v-model="code" type="text">
      <button type="submit">Submit</button>
      <br>

      <input v-model="email" type="email"><br>
      <input v-model="password" type="password">
    </form>
  </Page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { createUser, getTicket } from '@/utils/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const code = ref('')
const email = ref('')
const password = ref('')

async function submit () {
  const ticket = await getTicket(code.value)

  console.log(ticket)
  await createUser(ticket, email.value, password.value)
  router.push('/')
}
</script>
