<template>
  <NotFoundView v-if="!equipment" />

  <EquipmentScanView v-else-if="editField === 'code'" @scan="scan" preventDefault :errMsg="scanErr" />

  <Page v-else>
    <template #title>
      <template v-if="editField === 'amount'">
        <i class="bi-ui-radios-grid" />Anzahl ändern
      </template>
      <template v-else>
        <i class="bi-pencil-square" />Equipment bearbeiten
      </template>
    </template>

    <FormContainer @submit.prevent="submit">
      <template v-if="!editField || editField === 'name'">
        <FloatingLabelInput
          label="Name"
          v-model="name"
        />
        <FormInfo :show="nameErr">
          {{ nameErr }}
        </FormInfo>
      </template>

      <TextBox
        v-if="!editField || editField === 'description'"
        label="Beschreibung"
        v-model="description"
      />

      <FormGroup
        inline
        v-if="!editField || editField === 'type'"
      >
        <i :class="typeInfo[type].icon" />
        <DropdownSelection
          label="Typ"
          v-model="type"
        >
          <option v-for="(type, key) in typeInfo" :key="key" :value="key">
            {{ type.name }}
          </option>
        </DropdownSelection>
      </FormGroup>

      <FloatingLabelInput
        v-if="!editField || editField === 'amount'"
        label="Anzahl"
        v-model="amount"
        type="number"
      />

      <SettingsList v-if="!editField">
        <SettingsListDivider>
          Standort
        </SettingsListDivider>
        <SettingsListLink :to="{
          name: 'equipment-edit-location',
          params: { id: equipment?.id }
        }">
          <i class="bi-geo-alt"></i>
          {{ location?.name ?? 'Kein Standort ausgewählt' }}
        </SettingsListLink>
        <SettingsListDivider />
      </SettingsList>

      <Btn type="submit">
        Speichern
      </Btn>
    </FormContainer>
  </Page>
</template>

<script lang="ts" setup>
import TextBox from '@/components/TextBox.vue'
import DropdownSelection from '@/components/DropdownSelection.vue'
import EquipmentScanView from '@/views/equipment/EquipmentScanView.vue'
import FloatingLabelInput from '@/components/FloatingLabelInput.vue'
import SettingsList from '@/components/SettingsList.vue'
import SettingsListLink from '@/components/SettingsListLink.vue'
import SettingsListDivider from '@/components/SettingsListDivider.vue'
import { useRoute } from 'vue-router'
import { back } from '@/router'
import { useEquipment } from '@/stores/equipment'
import { computed, ref } from 'vue'
import { EquipmentTypeInfo } from '@/model/equipment'
import { useLocations } from '@/stores/locations'
import { Location } from '@/model/location'
import NotFoundView from '@/views/NotFoundView.vue'

const locStore = useLocations()

const route = useRoute()
const editField = computed(() => (route.params.field as undefined | 'code' | 'amount' | 'name' | 'description' | 'type' | 'location'))

const eqStore = useEquipment()
const equipment = computed(() => eqStore.findByID(route.params.id))

document.title = equipment.value?.name + ' - Bearbeiten'

const typeInfo = EquipmentTypeInfo

const name = ref(equipment.value?.name ?? '')
const description = ref(equipment.value?.description ?? '')
const amount = ref(equipment.value?.amount ?? 1)
const type = ref(equipment.value?.type ?? 'other')
const location = ref<Location>(locStore.getLocationById(equipment.value?.location))

const scanErr = ref('')
function scan (code: string) {
  if (!equipment.value) return

  if (eqStore.findByCode(code)) {
    console.log('code already exists')
    scanErr.value = 'Dieser QR-Code ist bereits vergeben.'
    return
  }

  equipment.value.setCode(code)
  back()
}

const nameErr = ref('')

const submitting = ref(false)
async function submit () {
  if (!equipment.value) return

  let invalid = false

  if (!name.value) {
    nameErr.value = 'Bitte gib einen Namen ein.'
    invalid = true
  } else {
    nameErr.value = ''
  }

  if (invalid) return

  submitting.value = true

  await equipment.value.set({
    name: name.value,
    description: description.value,
    type: type.value,
    location: location.value.id,
    amount: amount.value
  })

  back()
}
</script>
