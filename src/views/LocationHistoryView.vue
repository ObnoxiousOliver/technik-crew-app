<template>
  <Page>
    <template #title>
      <i class="bi-clock-history" /> Standortverlauf
    </template>

    <HistoryList v-if="!!history" :history="history" />

    <Spinner v-else />
  </Page>
</template>

<script lang="ts" setup>
import HistoryList from '@/components/HistoryList.vue'
import { HistoryState } from '@/model/history'
import { useLocations } from '@/stores/locations'
import { logOnServer } from '@/utilities/log'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const locationStore = useLocations()
const location = computed(() => locationStore.getLocationById(route.params.id))

const history = ref<HistoryState<unknown>[]>(null)

onMounted(async () => {
  history.value = await location.value?.getHistory()
    .catch((err) => {
      logOnServer('Error in location history:', err)
    })
})
</script>
