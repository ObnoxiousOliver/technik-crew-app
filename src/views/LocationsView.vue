<template>
  <Page opaqueTitlebar>
    <template #title>
      <i class="bi-geo-alt" />Standorte
    </template>
    <template #btns>
      <Btn
        :to="{
          name: 'location-add'
        }"
        aria-label="Neuer Standort"
      >
        <i class="bi-plus-lg" />
      </Btn>
    </template>

    <Spinner v-if="loading" />

    <LocationsList :locations="locations" @click="open" />

    <ActionSheet v-model:show="show">
      <template #title>
        {{ location?.name ?? 'Standort' }}
      </template>

      <div v-if="location?.description" class="prewrap">
        {{ location?.description }}
      </div>
      <div v-else class="text-secondary">
        Keine Beschreibung
      </div>

      <template #buttons>
        <ActionSheetButton
          :to="{
            name: 'location-edit',
            params: {
              id: location?.id
            }
          }"
        >
          <i class="bi-pencil-square" /> Bearbeiten
        </ActionSheetButton>
        <ActionSheetButton
          :to="{
            name: 'location-history',
            params: {
              id: location?.id
            }
          }"
        >
          <i class="bi-clock-history" /> Verlauf anzeigen
        </ActionSheetButton>
        <ActionSheetDivider />
        <ActionSheetButton @click="copyID">
          <i class="bi-clipboard" /> ID in Zwischenablage kopieren
        </ActionSheetButton>
        <ActionSheetDivider />
        <ActionSheetButton>
          <i class="bi-x-lg" /> Abbrechen
        </ActionSheetButton>
      </template>
    </ActionSheet>
  </Page>
</template>

<script lang="ts" setup>import LocationsList from '@/components/LocationsList.vue'
import { useLocations } from '@/stores/locations'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useToast } from '@/utilities/toast'
import ActionSheet from '@/components/ActionSheet.vue'
import ActionSheetButton from '@/components/ActionSheetButton.vue'
import ActionSheetDivider from '@/components/ActionSheetDivider.vue'

const locationStore = useLocations()

const locations = storeToRefs(locationStore).locations
const { loading } = storeToRefs(locationStore)

const show = ref(false)
const location = ref<Location>(null)

function open (loc) {
  location.value = loc
  show.value = true
}

function copyID () {
  navigator.clipboard.writeText(location.value.id)
  useToast().show('ID in Zwischenablage kopiert')
}
</script>
