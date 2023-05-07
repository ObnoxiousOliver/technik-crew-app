<template>
  <Page>
    <template #title>
      <i class="bi-file-plus">
      </i>
      Neues Equipment
    </template>

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
        v-model="description"
      />

      <FormGroup inline>
        <i :class="categories[type]?.icon ?? categories.other.icon"></i>

        <DropdownSelection class="fill-width" v-model="type">
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
        </DropdownSelection>
      </FormGroup>

      <FormInfo :show="typeErr">
        {{ typeErr }}
      </FormInfo>

      <FloatingLabelInput
        label="Anzahl"
        v-model="amount"
        type="number"
      />

      <SettingsList>
        <SettingsListDivider>
          Standort
        </SettingsListDivider>
        <SettingsListLink
          :to="{
            name: 'equipment-add-select-location'
          }"
        >
          <i class="bi-geo-alt"></i>
          {{ location?.name ?? 'Kein Standort ausgewählt' }}
        </SettingsListLink>
        <SettingsListDivider />
      </SettingsList>

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
import SettingsList from '@/components/SettingsList.vue'
import SettingsListLink from '@/components/SettingsListLink.vue'
import SettingsListDivider from '@/components/SettingsListDivider.vue'
import { Equipment, EquipmentTypeInfo } from '@/model/equipment'
import { back } from '@/router'
import { useTemp } from '@/stores/temp'
import { ref, watch } from 'vue'
import FloatingLabelInput from '../../components/FloatingLabelInput.vue'
import { SelectLocationPreset } from '../tempViews/presets'
import { Location } from '@/model/location'
import { useLocations } from '@/stores/locations'
import DropdownSelection from '@/components/DropdownSelection.vue'
import FormContainer from '@/components/FormContainer.vue'
import FormInfo from '@/components/FormInfo.vue'
import FormGroup from '@/components/FormGroup.vue'
import TextBox from '@/components/TextBox.vue'

const temp = useTemp()
const locationData = temp.tempRoute(SelectLocationPreset('equipment-add-select-location'))()

const locStore = useLocations()

console.log(locationData)
const categories = ref(EquipmentTypeInfo)

const name = ref(temp.getData('equipment-add', false)?.name ?? '')
const description = ref(temp.getData('equipment-add', false)?.description ?? '')
const type = ref(temp.getData('equipment-add', false)?.type ?? '')
const amount = ref(temp.getData('equipment-add', false)?.amount ?? 1)
const location = ref<Location>(locationData === null ? null : locationData ?? locStore.getLocationById(temp.getData('equipment-add', false)?.location))

watch([name, description, type, amount, location], () => {
  temp.setData('equipment-add', {
    name: name.value,
    description: description.value,
    type: type.value,
    amount: amount.value,
    location: location.value?.id
  })
}, { deep: true, immediate: true })

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
    type: type.value,
    location: location.value?.id
  }).catch(err => {
    submitting.value = false
    err.value = err
  })

  temp.deleteData('equipment-add')

  back()
}
</script>
