<template>
  <Page>
    <template #title>
      <i class="bi-archive" />Archiv
      <template v-if="collection">von
        <GlowDiv inline>
          <i v-if="!collection?.icon" class="bi-collection" />
          {{ collection?.icon }}
        </GlowDiv>
        {{ collection?.name }}
      </template>
    </template>

    <template v-if="collection">
      <CollectionItemList includeBack :collection="collection" :items="items" />
    </template>
    <template v-else>
      <Btn
        class="item-btn"
        v-for="item in items"
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
    </template>
  </Page>
</template>

<script setup lang="ts">
import CollectionItemList from '@/components/CollectionItemList.vue'
import { useInventory } from '@/stores/inventory'
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import GlowDiv from '@/components/GlowDiv.vue'

const route = useRoute()
const inventory = useInventory()

const collection = computed(() => inventory.getCollectionById(route.params.id as string))
const items = computed(() => inventory.getItemsByCollectionId(route.params.id as string).filter(x => x.isHidden))

watchEffect(() => {
  if (!collection.value) return
  document.title = `${collection.value.icon ? collection.value.icon + ' ' : ''}${collection.value.name}`
})

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
