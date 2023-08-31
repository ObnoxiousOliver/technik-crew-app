<template>
  <Page>
    <template v-if="item">
      <CenteredCard>
        <template #icon>
          <i class="bi-box" />
        </template>
        <template #title>
          {{ item.name }}
        </template>

        {{ location?.name }}

      </CenteredCard>
    </template>
  </Page>
</template>

<script setup lang="ts">
import CenteredCard from '@/components/CenteredCard.vue'
import { useInventory } from '@/stores/inventory'
import { useLocations } from '@/stores/locations'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const inventory = useInventory()
const locStore = useLocations()

const item = inventory.getItemById(route.params.itemId as string)
const location = computed(() => {
  if (item?.locationId) {
    return locStore.getLocationById(item.locationId)
  }
  return null
})
</script>
