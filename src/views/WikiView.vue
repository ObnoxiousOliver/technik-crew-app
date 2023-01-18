<template>
  <UserPage>
    <template #title>
      <i class="bi-compass" />Wiki
    </template>

    <TiptapEditor v-model="content" />
  </UserPage>
</template>

<script lang="ts" setup>
import UserPage from '../layout/UserPage.vue'
import TiptapEditor from '../components/TiptapEditor.vue'
import { ref } from 'vue'
import { getFirestore } from '@firebase/firestore'

const content = ref('Hello world!')

const db = getFirestore()
</script>
