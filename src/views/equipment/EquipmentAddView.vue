<template>
  <Page>
    <template #title>
      <i class="bi-file-plus">
      </i>
      Neues Equipment
    </template>

    <FormContainer @submit.prevent="submit" :disabled="submitting" >
      <FloatingLabelInput
        label="Name"
        v-model="name"
      />

      <FormInfo :show="nameErr">
        {{ nameErr }}
      </FormInfo>

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

      <FormInfo :show="typeErr">
        {{ typeErr }}
      </FormInfo>

      <FloatingLabelInput
        label="Anzahl"
        v-model="amount"
        type="number"
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
import { Equipment, EquipmentTypeInfo } from '@/model/equipment'
import { back } from '@/router'
import { ref } from 'vue'
import FloatingLabelInput from '../../components/FloatingLabelInput.vue'

const categories = ref(EquipmentTypeInfo)

const name = ref('')
const description = ref('')
const type = ref('')
const amount = ref(1)

const nameErr = ref()
const typeErr = ref()
const err = ref()

const submitting = ref(false)
async function submit () {
  if (name.value.length === 0) {
    nameErr.value = 'Bitte geben Sie einen Namen ein'
  } else {
    nameErr.value = null
  }

  if (type.value.length === 0) {
    typeErr.value = 'Bitte wählen Sie eine Kategorie aus'
  } else {
    typeErr.value = null
  }

  if (nameErr.value || typeErr.value) {
    return
  }

  submitting.value = true

  await Equipment.create({
    name: name.value,
    description: description.value,
    type: type.value
  }).catch(err => {
    submitting.value = false
    err.value = err
  })
  back()
}
</script>
