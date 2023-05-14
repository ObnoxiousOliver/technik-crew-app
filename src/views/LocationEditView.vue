<template>
  <Page>
    <template #title>
      Standort bearbeiten
    </template>

    <template v-if="location">

      <p class="text-secondary">
        ID: <span class="user-select">{{ location?.id }}</span>
      </p>

      <FormContainer @submit.prevent="submit" :disabled="submitting">
        <FloatingLabelInput
          label="Name"
          v-model="name"
        />
        <FormInfo :show="nameErr">
          {{ nameErr }}
        </FormInfo>
        <TextBox
          label="Beschreibung"
          placeholder="Keine Beschreibung"
          v-model="description"
        />
        <Btn type="submit">
          Speichern
        </Btn>
        <FormInfo :show="err">
          {{ err }}
        </FormInfo>
      </FormContainer>

    </template>

    <Spinner v-else />
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
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const locationStore = useLocations()

const location = computed(() => locationStore.getLocationById(route.params.id))

const name = ref(location.value?.name ?? '')
const description = ref(location.value?.description ?? '')

const nameErr = ref('')
const err = ref('')

const submitting = ref(false)
async function submit () {
  if (!name.value.trim()) {
    nameErr.value = 'Bitte gib einen Namen ein.'
    return
  } else {
    nameErr.value = ''
  }

  submitting.value = true

  await location.value?.set(name.value.trim(), description.value.trim())
    .catch((e) => {
      logOnServer('Error in location edit:', e)
      err.value = `Ups, da ist etwas schief gelaufen: ${e}`
    })

  submitting.value = false
  back()
}
</script>
