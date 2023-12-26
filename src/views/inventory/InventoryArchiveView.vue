<template>
  <Page>
    <template #title>
      <i class="bi-archive" />Archiv
    </template>

    <CollectionList :collections="collections" />

    <template v-if="collections.length === 0">
      <p class="text-center text-secondary">
        <i>Keine archivierten Kollektionen</i>
      </p>
    </template>
  </Page>
</template>

<script setup lang="ts">
import CollectionList from '@/components/CollectionList.vue'
import { Collection } from '@/model/inventory/collection'
import { useInventory } from '@/stores/inventory'
import { computed } from 'vue'

const inventory = useInventory()

const collections = computed<Collection[]>(() => inventory.collections.filter(x => x.isHidden) as Collection[])

// const showActionSheet = ref(false)
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.item-btn {
  display: flex;
  padding: 1rem;
  margin: 1rem 0;
  font-weight: normal;
  text-align: left;

  &__name {
    font-weight: 600;
    font-size: 1.2rem;
  }

  &__desc {
    font-size: .9rem;
    color: r.$text-secondary;
  }
}
</style>
