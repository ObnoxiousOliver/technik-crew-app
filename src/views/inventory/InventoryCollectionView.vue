<template>
  <Page>
    <template #title>
      <i class="bi-collection" /> {{ collection?.name ?? 'Sammlung'}}
    </template>

    {{ collection }}
  </Page>
</template>

<script setup lang="ts">
import { useInventory } from '@/stores/inventory'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const inventory = useInventory()

const collection = computed(() => inventory.getCollectionById(route.params.id as string))
</script>
