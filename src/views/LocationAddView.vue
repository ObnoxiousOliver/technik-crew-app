<template>
  <Page>
    <template #title>
      Neuer Standort
    </template>

    <FormContainer @submit.prevent="submit">
      <FloatingLabelInput label="Name" v-model="name" />
    </FormContainer>
  </Page>
</template>

<script lang="ts" setup>
import FloatingLabelInput from '@/components/FloatingLabelInput.vue'
import { useLocations } from '@/stores/locations'
import { logOnServer } from '@/utilities/log'
import { ref } from 'vue'

const locations = useLocations()
const name = ref('')

const err = ref(null)

const submitting = ref(false)
function submit () {
  submitting.value = true
  await locations.create(name)
    .catch((err) => {
      submitting.value = false

      logOnServer('Error while creating location', err)
      this.err = err
    })
  submitting.value = false
}
</script>
