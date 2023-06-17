<template>
  <NotFoundView v-if="!event" />
  <Page v-else opaqueTitlebar>
    <template #title>
      <i class="bi-calendar2-event" />Terminverlauf
    </template>

    <HistoryList v-if="history" :history="history" />
    <OfflineMessage v-else-if="offline" not-loaded />
    <Spinner v-else-if="loading" />
  </Page>
</template>

<script lang="ts" setup>
import HistoryList from '@/components/HistoryList.vue'
import OfflineMessage from '@/components/OfflineMessage.vue'
import Event from '@/model/event'
import { useEvents } from '@/stores/events'
import { useOffline } from '@/utilities/offline'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import NotFoundView from '../NotFoundView.vue'
import { useHistory } from '@/stores/history'
import { logOnServer } from '@/utilities/log'

const route = useRoute()
const offline = useOffline()

const eventsStore = useEvents()
const event = ref<Event>()

const history = computed({
  get: () => event.value?.id && useHistory().history.events?.[event.value?.id],
  set: (value) => value && event.value?.id && useHistory().set('events', event.value.id, value)
})

const loading = ref(true)
onMounted(async () => {
  event.value = await eventsStore.getById(route.params.id as string)
  if (offline.value) return

  history.value = await event.value?.getHistory()
    .catch((err) => {
      logOnServer('Error in event history:', err)
      return []
    }) ?? null
  loading.value = false
})
</script>
