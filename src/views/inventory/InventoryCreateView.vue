<template>
  <Page>
    <template #title>
      <i class="bi-collection" />Kollektion erstellen
    </template>

    <FormContainer @submit.prevent="submit">
      <InputField
        v-model="name"
        label="Name"
      />
      <FormInfo :show="nameErr" type="error">
        {{ nameErr }}
      </FormInfo>

      <TextBox
        v-model="description"
        label="Beschreibung"
        placeholder="Keine Beschreibung"
      />

      <FormDivider>
        Felder
      </FormDivider>

      <CollectionFieldsList v-model="fields" />

      <FormDivider />

      <Btn type="submit">
        <i class="bi-plus-lg btn__icon" />Kollektion erstellen
      </Btn>
    </FormContainer>
  </Page>
</template>

<script setup lang="ts">
import CollectionFieldsList from '@/components/CollectionFieldsList.vue'
import InputField from '@/components/FloatingLabelInput.vue'
import FormContainer from '@/components/FormContainer.vue'
import FormDivider from '@/components/FormDivider.vue'
import FormInfo from '@/components/FormInfo.vue'
import TextBox from '@/components/TextBox.vue'
import { FieldTemplate, FieldTypes } from '@/model/inventory/collectionField'
import router from '@/router'
import { useInventory } from '@/stores/inventory'
import { ref } from 'vue'

const inventory = useInventory()

const name = ref('')
const description = ref('')
const fields = ref<FieldTemplate<FieldTypes>[]>([])

const nameErr = ref<string | null>(null)

const submitting = ref(false)
async function submit () {
  if (submitting.value) return

  if (!name.value) {
    nameErr.value = 'Bitte gib einen Namen ein'
    return
  }

  submitting.value = true
  const collection = await inventory.createCollection({
    name: name.value,
    description: description.value,
    fields: fields.value
  })
  submitting.value = false

  router.replace({
    name: 'inventory-collection',
    params: {
      id: collection.id
    }
  })
}
</script>
