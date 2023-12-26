<template>
  <NotFoundView v-if="!collection" />
  <Page v-else opaqueTitlebar>
    <template #title>
      <i class="bi-clock-history" />Kollektionverlauf
    </template>

    <HistoryList v-if="history" :history="history" />
    <OfflineMessage v-else-if="offline" not-loaded />
    <Spinner v-else-if="loading" />
  </Page>
</template>

<script lang="ts" setup>
import { logOnServer } from '@/utilities/log'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import HistoryList from '../../components/HistoryList.vue'
import NotFoundView from '../NotFoundView.vue'
import { useHistory } from '@/stores/history'
import { useOffline } from '@/utilities/offline'
import OfflineMessage from '../../components/OfflineMessage.vue'
import { useInventory } from '@/stores/inventory'

const route = useRoute()
const offline = useOffline()

const inventory = useInventory()
const collection = computed(() => inventory.getCollectionById(route.params.id as string))

const history = computed({
  get: () => collection.value?.id && useHistory().history.collection?.[collection.value.id],
  set: (value) => value && collection.value?.id && useHistory().set('collection', collection.value.id, value)
})

const loading = ref(true)
onMounted(async () => {
  if (offline.value) return

  history.value = await collection.value?.getHistory()
    .catch((err) => {
      logOnServer('Error in inventory collection history:', err)
      return []
    }) ?? null

  loading.value = false
})
</script>
