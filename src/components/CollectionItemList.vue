<template>
  <div class="collection-item-list">
    <!-- <div class="collection-item-list__controls">
      <Btn square aria-label="Standart Ansicht">
        <i class="bi-view-stacked" />
      </Btn>

      <Btn square aria-label="Liste">
        <i class="bi-list-ul" />
      </Btn>
    </div> -->

    <div class="collection-item-list__scroller">
      <table>
        <thead class="collection-item-list__header">
          <th>Name</th>
          <th v-for="field in collection.fields" :key="field.id">
            {{ field.name }}
          </th>
          <!-- <th class="collection-item-list__header__icon" /> -->
        </thead>

        <tbody>
          <!-- <tr class="collection-item-list__spacer"></tr> -->
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
              <ItemFieldsListItemDisplay
                inline
                :fieldTemplate="field"
                :fieldValue="item.fields.find(x => x.id === field.id)?.value"
              />
            </td>
            <!-- <td>
              <i class="bi-chevron-right" />
            </td> -->
          </RouterLink>
        </tbody>
      </table>

      <div v-if="!items.length" class="collection-item-list__no-items text-secondary">
        <i>Keine Gegenstände vorhanden</i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Collection } from '@/model/inventory/collection'
import { CollectionItem } from '@/model/inventory/collectionItem'
import { computed } from 'vue'
import ItemFieldsListItemDisplay from './ItemFieldsListItemDisplay.vue'

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
  margin: 0 -1.5rem;
  position: relative;

  &::before, &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 1;
  }

  &::before {
    left: 0;
    width: 1.5rem;
    background: linear-gradient(to right, r.$bg-primary, transparent);
  }

  &::after {
    right: 0;
    width: 1.5rem;
    background: linear-gradient(to left, r.$bg-primary, transparent);
  }

  &__scroller {
    overflow-x: auto;
    padding: 0 1.5rem 1rem;
  }

  &__controls {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    background: r.$bg-primary;
  }

  table {
    width: stretch;
    border-collapse: collapse;
  }

  &__item {
    display: table-row;
    color: inherit !important;
    text-decoration: none;
    // border-radius: r.$radius;

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
    padding: .75rem 1rem;
    text-align: left;
    white-space: nowrap;
    border: 1px solid r.$bg-stroke;
  }

  th {
    padding: 1rem;
    // border-bottom: 1px solid r.$bg-stroke;
  }

  tbody {
    padding-top: .5rem;
  }
}
</style>
