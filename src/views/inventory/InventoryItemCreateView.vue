<template>
  <Page>
    <template #title>
      Neuen Gegenstand erstellen
    </template>

    <FormContainer @submit.prevent="submit" :disabled="submitting">
      <FormGroup>
        <p>Gegenstand wird erstellt in</p>
        <DropdownSelection v-model="collectionId">
          <option
            v-for="(collection, i) in inventory.collections"
            :key="collection.id ?? i"
            :value="collection.id"
          >
            {{ collection.icon }}
            {{ collection.name }}
          </option>
        </DropdownSelection>
      </FormGroup>

      <FloatingLabelInput label="Name" v-model="name" />
      <FormInfo :show="nameErr">
        {{ nameErr }}
      </FormInfo>

      <TextBox placeholder="Keine Beschreibung" label="Beschreibung" v-model="description" />

      <SettingsList>
        <SettingsListDivider>
          Standort
        </SettingsListDivider>
        <SettingsListLink
          :to="{
            name: 'inventory-item-create-location'
          }"
        >
          <i class="bi-geo-alt" />
          <template v-if="location">{{ location.name }}</template>
          <template v-else>Standort hinzufügen</template>
        </SettingsListLink>
        <SettingsListDivider />
      </SettingsList>

      <Btn type="submit">
        Erstellen
      </Btn>
    </FormContainer>
  </Page>
</template>

<script setup lang="ts">
import DropdownSelection from '@/components/DropdownSelection.vue'
import FloatingLabelInput from '@/components/FloatingLabelInput.vue'
import FormContainer from '@/components/FormContainer.vue'
import FormGroup from '@/components/FormGroup.vue'
import SettingsList from '@/components/SettingsList.vue'
import SettingsListDivider from '@/components/SettingsListDivider.vue'
import SettingsListLink from '@/components/SettingsListLink.vue'
import TextBox from '@/components/TextBox.vue'
import { useInventory } from '@/stores/inventory'
import { useTemp } from '@/stores/temp'
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { SelectLocationPreset } from '../tempViews/presets'
import { Location } from '@/model/location'
import { useLocations } from '@/stores/locations'
import FormInfo from '@/components/FormInfo.vue'
import router from '@/router'

const route = useRoute()
const inventory = useInventory()
const temp = useTemp()

temp.tempRoute(SelectLocationPreset('inventory-item-create-location'))

const state = temp.getData('inventory-item-create') as {
  collectionId: string | null
  name: string
  description: string
  locationId: string | null
} | null

const collectionId = ref<string>(route.query.collection as string ?? inventory.collections?.[0]?.id ?? '')

const name = ref(state?.name ?? '')
const description = ref(state?.description ?? '')
const tempLoc = temp.getData('inventory-item-create-location') as Location | null
const location = ref<Location | null>(
  tempLoc === null
    ? null
    : tempLoc ?? (state?.locationId
      ? useLocations().getLocationById(state.locationId) ?? null
      : null)
)

watchEffect(() => {
  temp.setData('inventory-item-create', {
    collectionId: collectionId.value,
    name: name.value,
    description: description.value,
    locationId: location.value?.id
  })
})

const nameErr = ref<string | null>(null)
const submitting = ref(false)
async function submit () {
  if (!name.value) {
    nameErr.value = 'Bitte gib einen Namen ein'
    return
  }

  submitting.value = true

  const item = await inventory.createItem({
    collectionId: collectionId.value,
    name: name.value,
    description: description.value,
    locationId: location.value?.id
  })

  temp.deleteData('inventory-item-create')

  router.replace({
    name: 'inventory-item-details',
    params: {
      id: item.collectionId,
      itemId: item.id
    }
  })
}
</script>
