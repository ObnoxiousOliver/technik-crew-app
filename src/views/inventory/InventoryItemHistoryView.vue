<template>
  <NotFoundView v-if="!item" />
  <Page v-else opaqueTitlebar>
    <template #title>
      <i class="bi-clock-history" />Gegenstandsverlauf
    </template>

    <HistoryList v-if="history" :history="history" />
    <OfflineMessage v-else-if="offline" not-loaded />
    <Spinner v-else-if="loading" />
  </Page>
</template>

<script lang="ts" setup>
import { useInventory } from '@/stores/inventory'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { logOnServer } from '@/utilities/log'

import { useHistory } from '@/stores/history'
import { useOffline } from '@/utilities/offline'
import OfflineMessage from '@/components/OfflineMessage.vue'
import HistoryList from '@/components/HistoryList.vue'
import NotFoundView from '../NotFoundView.vue'

const inventory = useInventory()
const route = useRoute()
const offline = useOffline()

const item = computed(() => inventory.getItemById(route.params.itemId as string))
const collection = computed(() => {
  if (item.value?.collectionId) {
    return inventory.getCollectionById(item.value.collectionId)
  }
  return null
})

const history = computed({
  get: () => item.value?.id && useHistory().history['collection-item']?.[item.value?.id],
  set: (value) => value && item.value?.id && useHistory().set('collection-item', item.value.id, value)
})

const loading = ref(true)
onMounted(async () => {
  if (offline.value) return

  history.value = await item.value?.getHistory()
    .catch((err) => {
      logOnServer('Error in collection item history:', err)
      return []
    }) ?? null
  loading.value = false
})
</script>
