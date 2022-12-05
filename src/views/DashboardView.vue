<template>
  <UserPage>
    <template #title>
      Dashboard
    </template>
  </UserPage>
</template>

<script lang="ts" setup>
import { getAuth, signOut } from '@firebase/auth'
import UserPage from '../layout/UserPage.vue'

const auth = getAuth()

function logout () {
  signOut(auth)
}
</script>
