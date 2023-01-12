<template>
  <Page>
    <template #title>
      <i class="bi-file-plus">
      </i>
      Neues Equipment
    </template>

    <FormContainer @submit.prevent="submit" >
      <FloatingLabelInput
        label="Name"
        v-model="name"
      />

      <Textbox
        label="Beschreibung"
        v-model="description"
      />

      <FormGroup inline>
        <i :class="categories[type]?.icon ?? categories.other.icon"></i>

        <Dropdown class="fill-width" v-model="type">
          <option value="">
            Kategorie wählen
          </option>
          <option
            v-for="(item, id) in categories"
            :key="id"
            :value="id"
          >
            {{ item.name }}
          </option>
        </Dropdown>
      </FormGroup>

      <Btn type="submit">
        Hinzufügen
      </Btn>
    </FormContainer>
  </Page>
</template>

<script lang="ts" setup>
import { Equipment, EquipmentTypeInfo } from '@/model/equipment'
import { back } from '@/router'
import { ref } from 'vue'
import FloatingLabelInput from '../components/FloatingLabelInput.vue'

const categories = ref(EquipmentTypeInfo)

const name = ref('')
const description = ref('')
const type = ref('')

async function submit () {
  await Equipment.create({
    name: name.value,
    description: description.value,
    type: type.value
  })
  back()
}
</script>
