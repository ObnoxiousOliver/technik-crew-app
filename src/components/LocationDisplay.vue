<template>
  <template v-if="location">
    {{ location.name }}
  </template>
</template>

<script lang="ts" setup>
import { Location } from '@/model/location'
import { useLocations } from '@/stores/locations'
import { computed } from 'vue'

const props = defineProps<{
  id?: string,
  location?: Location
}>()

const locStore = useLocations()

const location = computed<Location>(() => {
  return locStore.locations.find((location) => location.id === props.id) ?? props.location
})
</script>
