<template>
  <page>
    dashboard<br>
    {{ auth.currentUser.displayName }}<br>
    {{ auth.currentUser.email }}<br>
    <router-link to="/change-password">
      Change Password
    </router-link>
  </page>
</template>

<script lang="ts" setup>
import { getAuth } from '@firebase/auth'

const auth = getAuth()
</script>
