<template>
  <NotFoundView v-if="!equipment" />
  <Page v-else opaqueTitlebar>
    <template #title>
      <i class="bi-clock-history" />Equipmentverlauf
    </template>

    <HistoryList v-if="history" :history="history" />

    <OfflineMessage v-else not-loaded />
  </Page>
</template>

<script lang="ts" setup>
import { useEquipment } from '@/stores/equipment'
import { logOnServer } from '@/utilities/log'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import HistoryList from '../../components/HistoryList.vue'
import NotFoundView from '../NotFoundView.vue'
import { useHistory } from '@/stores/history'
import { useOffline } from '@/utilities/offline'
import OfflineMessage from '../../components/OfflineMessage.vue'

const route = useRoute()
const offline = useOffline()

const eqStore = useEquipment()
const equipment = computed(() => eqStore.findByID(route.params.id as string))

const history = computed({
  get: () => equipment.value?.id && useHistory().history.equipment?.[equipment.value?.id],
  set: (value) => value && equipment.value?.id && useHistory().set('equipment', equipment.value.id, value)
})

onMounted(async () => {
  if (offline.value) return

  history.value = await equipment.value?.getHistory()
    .catch((err) => {
      logOnServer('Error in equipment history:', err)
      return []
    }) ?? null
})
</script>
