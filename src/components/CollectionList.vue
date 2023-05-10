<template>
  <ul class="collection-list">
    <CollectionListBtn
      v-for="collection in collections.filter((c) => c.id)"
      :key="(collection.id as string)"
      :collection="collection"
      :selectionMode="selectedMode"
      v-model:selected="selectedCollections[collection.id as string]"
    />
  </ul>
</template>

<script setup lang="ts">
import { Collection } from '@/model/inventory/collection'
import CollectionListBtn from './CollectionListBtn.vue'
import { watchEffect } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  collections: Collection[],
  selectionMode?: boolean,
  selected: Record<string, boolean>
}>()

const emit = defineEmits(['update:selectionMode', 'update:selected'])

const selectedCollections = useVModel(props, 'selected', emit)
const selectedMode = useVModel(props, 'selectionMode', emit)

watchEffect(() => {
  if (!selectedMode.value) {
    selectedCollections.value = {}
    window.removeEventListener('popstate', onPopState)
  }

  // push state
  history.pushState(null, '')
  window.addEventListener('popstate', onPopState, {
    once: true
  })

  function onPopState () {
    selectedMode.value = false
  }
})

watchEffect(() => {
  if (Object.values(selectedCollections.value).some((v) => v)) {
    selectedMode.value = true
  }
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.collection-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
