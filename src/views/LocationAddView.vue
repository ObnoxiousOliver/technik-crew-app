<template>
  <Page>
    <template #title>
      <i class="bi-geo-alt" />Neuer Standort
    </template>

    <FormContainer @submit.prevent="submit" :disabled="submitting">
      <FloatingLabelInput label="Name" v-model="name" />
      <FormInfo :show="nameErr">
        {{ nameErr }}
      </FormInfo>
      <TextBox
        label="Beschreibung"
        v-model="desc"
        placeholder="Keine Beschreibung"
      />
      <Btn type="submit">
        Hinzufügen
      </Btn>
      <FormInfo :show="err">
        {{ err }}
      </FormInfo>
    </FormContainer>
  </Page>
</template>

<script lang="ts" setup>
import FloatingLabelInput from '@/components/FloatingLabelInput.vue'
import FormContainer from '@/components/FormContainer.vue'
import FormInfo from '@/components/FormInfo.vue'
import TextBox from '@/components/TextBox.vue'
import { back } from '@/router'
import { useLocations } from '@/stores/locations'
import { logOnServer } from '@/utilities/log'
import { ref } from 'vue'

const locations = useLocations()
const name = ref('')
const desc = ref('')

const err = ref(null)
const nameErr = ref()

const submitting = ref(false)
async function submit () {
  if (!name.value.trim()) {
    nameErr.value = 'Bitte gib einen Namen ein'
    return
  }

  submitting.value = true
  await locations.create(name.value, desc.value)
    .catch((err) => {
      submitting.value = false

      logOnServer('Error while creating location', err)
      this.err = err
    })
  submitting.value = false
  nameErr.value = null

  back()
}
</script>
