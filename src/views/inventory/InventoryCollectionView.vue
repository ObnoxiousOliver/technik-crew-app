<template>
  <Page>
    <template #btns>
      <Btn
        :to="{
          name: 'inventory-edit',
          params: {
            id: collection?.id
          }
        }"
        aria-label="Bearbeiten"
      >
        <i class="bi-pencil-square" />
      </Btn>
      <Btn
        :to="{
          name: 'inventory-item-create',
          query: {
            collection: collection?.id,
            back: $route.fullPath
          }
        }"
        aria-label="Neuer Gegenstand"
      >
        <i class="bi-plus-lg" />
      </Btn>
    </template>

    <template v-if="collection">
      <InfoCard>
        <template #title>
          <GlowDiv inline class="collection-icon">
            <i class="bi-collection" v-if="!collection.icon" />
            {{ collection.icon }}
          </GlowDiv>{{ collection.name }}
        </template>
        <template #desc>
          {{ items.length }} Gegestände
        </template>

        <span v-if="collection.description" class="prewrap">
          {{ collection.description }}
        </span>
        <i class="text-secondary" v-else>Keine Beschreibung</i>
      </InfoCard>

      <CollectionItemList :collection="collection" :items="items" />

      <!-- <ActionSheet v-model:show="showActionSheet">
        <template #title>
          <i class="bi-collection" v-if="!collection.icon" />
          {{ collection.icon }}
          {{ collection.name }}
        </template>

        <span class="text-secondary">
          {{ items.length }} Gegenstände
        </span>

        <template v-if="collection?.description">
          <br><br>{{ collection.description }}
        </template>

        <template #buttons>
          <ActionSheetButton>
            <i class="bi-pencil" />Bearbeiten
          </ActionSheetButton>
        </template>
      </ActionSheet> -->
    </template>
  </Page>
</template>

<script setup lang="ts">
import CollectionItemList from '@/components/CollectionItemList.vue'
import GlowDiv from '@/components/GlowDiv.vue'
import InfoCard from '@/components/InfoCard.vue'
import { useInventory } from '@/stores/inventory'
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const inventory = useInventory()

const collection = computed(() => inventory.getCollectionById(route.params.id as string))
const items = computed(() => inventory.getItemsByCollectionId(route.params.id as string))

watchEffect(() => {
  if (!collection.value) return
  document.title = `${collection.value.icon ? collection.value.icon + ' ' : ''}${collection.value.name}`
})

// const showActionSheet = ref(false)
</script>

<style scoped lang="scss">
@use '../../scss' as r;

.collection-icon {
  width: 2rem;
}

.collection-page {
  &__items {
    overflow: auto;
    width: stretch;

    &__table {
      border-collapse: collapse;
      min-width: stretch;

      &__row {
        display: table-row;
        color: inherit;
        text-decoration: none;

        &::before {
          content: none;
        }
      }

      th, td {
        padding: .5rem;
        border-bottom: 1px solid r.$bg-stroke;
        text-align: left;

        &:first-child {
          width: 1rem;
        }
      }
    }
  }
}
</style>
