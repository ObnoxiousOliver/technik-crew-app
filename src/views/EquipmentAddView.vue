<template>
  <Page>
    <template #title>
      <i class="bi-file-plus">
      </i>
      Neues Equipment
    </template>

    <FormContainer>
      <FloatingLabelInput
        label="Name"
      />

      <FloatingLabelInput
        label="Beschreibung"
      />
    </FormContainer>
  </Page>
</template>

<script lang="ts" setup>
import FloatingLabelInput from '../components/FloatingLabelInput.vue'
</script>
