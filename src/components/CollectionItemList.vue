<template>
  <div class="collection-item-list">
    <table>
      <thead class="collection-item-list__header">
        <th>Name</th>
        <th v-for="field in collection.fields" :key="field.id">
          {{ field.name }}
        </th>
        <th class="collection-item-list__header__icon" />
      </thead>

      <tbody>
        <tr class="collection-item-list__spacer"></tr>
        <RouterLink
          role="row"
          v-for="(item, i) in items"
          :key="item.id ?? i"
          :to="{
            name: 'inventory-item-details',
            params: {
              id: collection.id,
              itemId: item.id
            }
          }"
          class="collection-item-list__item"
          v-wave
        >
          <td>
            {{ item.name }}
          </td>
          <td v-for="field in collection.fields" :key="field.id">
            {{ item.fields.find(x => x.id === field.id)?.value }}
          </td>
          <td>
            <i class="bi-chevron-right" />
          </td>
        </RouterLink>
      </tbody>
    </table>

    <div v-if="!items.length" class="collection-item-list__no-items text-secondary">
      <i>Keine Gegenstände vorhanden</i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Collection } from '@/model/inventory/collection'
import { CollectionItem } from '@/model/inventory/collectionItem'
import { computed } from 'vue'

const props = defineProps<{
  collection: Collection,
  items: CollectionItem[]
}>()

const items = computed(() => {
  const sortedItems = [...props.items]

  sortedItems.sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1

    return 0
  })

  return sortedItems
})
</script>

<style scoped lang="scss">
@use '../scss' as r;

.collection-item-list {
  table {
    width: stretch;
    border-collapse: collapse;
  }

  &__item {
    display: table-row;
    color: inherit !important;
    text-decoration: none;
    border-radius: r.$radius;

    transition: box-shadow .2s;

    &:focus-visible {
      box-shadow: r.$focus;
    }

    &::before {
      content: none;
    }
  }

  &__header {
    &__icon {
      width: 2rem;
    }
  }

  &__spacer {
    height: .5rem;
  }

  &__no-items {
    padding: 1rem;
  }

  td, th {
    border: none;
    padding: 1rem;
    text-align: left;
  }

  th {
    border-bottom: 1px solid r.$bg-stroke;
  }

  tbody {
    padding-top: .5rem;
  }
}
</style>
