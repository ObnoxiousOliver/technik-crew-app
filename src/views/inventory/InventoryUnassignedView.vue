<template>
  <Page>
    <template #title>
      <i class="bi-slash-circle danger" />Ohne Kollektion
    </template>

    <template #btns>
      <Btn
        :to="{
          name: 'inventory-archive',
          params: {
            id: 'unassigned'
          },
          query: {
            back: route.fullPath
          }
        }"
        aria-label="Archiv"
      >
        <i class="bi-archive" />
      </Btn>
    </template>

    <Btn
      class="item-btn"
      v-for="item in unassigned"
      :key="item.id"
      :to="{
        name: 'inventory-item-details',
        params: {
          id: 'unassigned',
          itemId: item.id
        },
      }"
    >
      <div class="item-btn__name">
        {{ item.name }}
      </div>
      <div class="item-btn__desc">
        <template v-if="item.description">
          {{ item.description }}
        </template>
        <template v-else>
          <i>Keine Beschreibung</i>
        </template>
      </div>
    </Btn>
  </Page>
</template>

<script setup lang="ts">
import { useInventory } from '@/stores/inventory'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const inventory = useInventory()
const unassigned = computed(() => inventory.getItemsByCollectionId('unassigned').filter(x => !x.isHidden))
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
