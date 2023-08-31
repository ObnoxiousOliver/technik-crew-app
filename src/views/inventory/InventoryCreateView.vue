<template>
  <Page>
    <template #title>
      <i class="bi-collection" /> Kollektion erstellen
    </template>

    <FormContainer>
      <InputField
        v-model="name"
        label="Name"
      />

      <TextBox
        v-model="description"
        label="Beschreibung"
      />

      <CollectionFieldsList v-model="fields" />
    </FormContainer>

    <!-- <pre>{{ fields }}</pre> -->
  </Page>
</template>

<script setup lang="ts">
import CollectionFieldsList from '@/components/CollectionFieldsList.vue'
import InputField from '@/components/FloatingLabelInput.vue'
import FormContainer from '@/components/FormContainer.vue'
import TextBox from '@/components/TextBox.vue'
import { FieldTemplate, FieldTypes } from '@/model/inventory/collectionField'
import { ref } from 'vue'

const name = ref('')
const description = ref('')
const fields = ref<FieldTemplate<FieldTypes>[]>([])

function addField () {
  fields.value.push(new FieldTemplate<FieldTypes>())
}
</script>
