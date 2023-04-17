<template>
  <Page opaqueTitlebar>
    <template #title>
      <i class="bi-pencil-square" />Equipment bearbeiten
    </template>

    <FormContainer @submit.prevent="">
      <FloatingLabelInput
        label="Name"
        v-model="name"
      />

      <Btn type="submit">
        Speichern
      </Btn>
    </FormContainer>
  </Page>
</template>

<script lang="ts" setup>
import FloatingLabelInput from '@/components/FloatingLabelInput.vue'
import { ref } from 'vue'

const name = ref('')
</script>
