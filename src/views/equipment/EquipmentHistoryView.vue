<template>
  <NotFoundView v-if="!equipment" />
  <Page v-else opaqueTitlebar>
    <template #title>
      <i class="bi-clock-history" />Equipmentverlauf
    </template>

    <HistoryList :history="history" />
  </Page>
</template>

<script lang="ts" setup>
import { useEquipment } from '@/stores/equipment'
import { logOnServer } from '@/utilities/log'
import { computed, onMounted, ref } from 'vue'
import { HistoryState, useRoute } from 'vue-router'
import HistoryList from '../../components/HistoryList.vue'
import NotFoundView from '../NotFoundView.vue'

const route = useRoute()

const eqStore = useEquipment()
const equipment = computed(() => eqStore.findByID(route.params.id))

const history = ref<HistoryState<unknown>[]>(null)

onMounted(async () => {
  history.value = await equipment.value?.getHistory()
    .catch((err) => {
      logOnServer('Error in equipment history:', err)
    })
})
</script>
