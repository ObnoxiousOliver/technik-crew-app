<template>
  <Page>
    <template #title>
      <i class="bi-geo-alt" /> Standorte
    </template>

    <!-- {{locations}} -->

    <LocationsList :locations="locations" />
  </Page>
</template>

<script lang="ts" setup>
import LocationsList from '@/components/LocationsList.vue'
import { useLocations } from '@/stores/locations'
import { storeToRefs } from 'pinia'

const locationStore = useLocations()

const { locations } = storeToRefs(locationStore)
</script>
