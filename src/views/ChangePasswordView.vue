<template>
  <div>
    Change Password
    <br>
    <form @submit.prevent="submit">
      E-mail: <input type="email" v-model="email">
      <button type="submit">
        Send
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { getAuth, sendPasswordResetEmail } from '@firebase/auth'
import { ref } from 'vue'

const email = ref('')
const auth = getAuth()

async function submit () {
  sendPasswordResetEmail(auth, email.value)
}
</script>
