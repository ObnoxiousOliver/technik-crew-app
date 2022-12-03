<template>
  <page>
    dashboard<br>
    {{ auth.currentUser.displayName }}<br>
    {{ auth.currentUser.email }}<br>
    <router-link to="/reset-password">
      Change Password
    </router-link>
    <button @click="logout">Logout</button>
  </page>
</template>

<script lang="ts" setup>
import { getAuth, signOut } from '@firebase/auth'

const auth = getAuth()

function logout () {
  signOut(auth)
}
</script>
