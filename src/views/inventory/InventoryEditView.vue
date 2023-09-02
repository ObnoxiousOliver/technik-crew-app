<template>
  <Page>
    <template #title>
      <i class="bi-pencil-square" /> Kollektion bearbeiten
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

      <Btn type="submit">Bestätigen</Btn>
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
import { back } from '@/router'
import { useInventory } from '@/stores/inventory'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const inventory = useInventory()
const route = useRoute()

const collection = computed(() => inventory.getCollectionById(route.params.id as string))
const name = ref((collection.value?.icon ?? '') + (collection.value?.name ?? ''))
const description = ref(collection.value?.description ?? '')
const fields = ref<FieldTemplate<FieldTypes>[]>(collection.value?.fields.map(f => new FieldTemplate(f.toDB())) ?? [])

const nameErr = ref<string | null>(null)

const submitting = ref(false)
async function submit () {
  if (submitting.value) return
  if (!collection.value) return

  if (!name.value) {
    nameErr.value = 'Bitte gib einen Namen ein'
    return
  }

  submitting.value = true
  await collection.value.set({
    name: name.value,
    description: description.value,
    fields: fields.value
  })
  submitting.value = false

  back()
}
</script>
