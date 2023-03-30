<template>
  <Page>
    <template #title>
      <i class="bi-geo-alt" />Standorte
    </template>
    <template #btns>
      <Btn @click="reload" aria-label="Aktualisieren">
        <i class="bi-arrow-clockwise" />
      </Btn>
      <Btn :to="{
        name: 'location-add'
      }" aria-label="Neuer Standort">
        <i class="bi-plus-lg" />
      </Btn>
    </template>

    <InputField
      v-model="searchInput"
      class="locations-view__search"
      placeholder="Suchen..."
    >
      <template #before>
        <i class="bi-search" />
      </template>
      <template #after>
        <Btn @click="searchInput = ''" aria-label="Suche leeren">
          <i class="bi-x-lg" />
        </Btn>
      </template>
    </InputField>

    <div class="locations-view__divider"/>

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
        <ActionSheetButton :to="{
          name: 'location-edit',
          params: {
            id: location?.id
          }
        }">
          <i class="bi-pencil-square" /> Bearbeiten
        </ActionSheetButton>
        <ActionSheetButton :to="{
          name: 'location-history',
          params: {
            id: location?.id
          }
        }">
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
import { computed, ref, watch } from 'vue'
import { useToast } from '@/utilities/toast'

const locationStore = useLocations()

const rawLocations = storeToRefs(locationStore).locations

const locations = computed(() => {
  if (searchInput.value === '') return rawLocations.value
  return locationStore.search(searchInput.value)
})

const show = ref(false)
const location = ref<Location>(null)
const searchInput = ref('')

function reload () {
  locationStore.fetchAll()
}

function open (loc) {
  location.value = loc
  show.value = true
}

function copyID () {
  navigator.clipboard.writeText(location.value.id)
  useToast().show('ID in Zwischenablage kopiert')
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.locations-view__search {
  width: stretch;
}

.locations-view__divider {
  margin: 1rem 0;
  border-bottom: 1px solid r.$bg-stroke;
}
</style>
