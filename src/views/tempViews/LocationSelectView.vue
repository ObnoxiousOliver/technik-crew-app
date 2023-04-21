<template>
  <Page opaqueTitlebar>
    <template #title>
      <i class="bi-geo-alt" />Standort wählen
    </template>

    <LocationsList :locations="locations" search @click="select" hasNoLocationOption />

    <Spinner v-if="locStore.loading" />
  </Page>
</template>

<script lang="ts" setup>
import LocationsList from '@/components/LocationsList.vue'
import { Location } from '@/model/location'
import { useLocations } from '@/stores/locations'
import { useTemp } from '@/stores/temp'
import { storeToRefs } from 'pinia'

const locStore = useLocations()
const locations = storeToRefs(locStore).locations

const temp = useTemp()

function select (location: Location) {
  temp.setDataFromTempRoute(location, true)
}
</script>
