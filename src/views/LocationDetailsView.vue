<template>
  <Page>
    <template v-if="location">
      <Card>
        <template #icon>
          <i class="bi-geo-alt" />
        </template>
        <template #title>
          {{ location?.name ?? 'Standort' }}
        </template>
        <template #btns>
          <Btn>
            <i class="bi-pencil-square" />
          </Btn>
        </template>

        {{ location?.description ?? 'Keine Beschreibung' }}
      </Card>
    </template>

    <Spinner v-else />
  </Page>
</template>

<script lang="ts" setup>
import { useLocations } from '@/stores/locations'
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Card from '@/components/CenteredCard.vue'

const route = useRoute()
const locationStore = useLocations()
const { locations } = storeToRefs(locationStore)

const location = computed(() => {
  return locations.value.find((location) => location.id === route.params.id)
})

// Set document title
if (location.value) {
  document.title = location.value.name
}
watch(location, (location) => {
  if (location) {
    document.title = location.name
  }
})
</script>
