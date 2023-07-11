<template>
  <NotFoundView v-if="!page" />
  <Page v-else opaqueTitlebar>
    <template #title>
      <i class="bi-clock-history" />Equipmentverlauf
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
import { useWiki } from '@/stores/wiki'

const route = useRoute()
const offline = useOffline()

const wiki = useWiki()
const page = computed(() => wiki.getPageFromId(route.params.id as string))

const history = computed({
  get: () => page.value?.id && useHistory().history.wiki?.[page.value?.id],
  set: (value) => value && page.value?.id && useHistory().set('wiki', page.value.id, value)
})

const loading = ref(true)
onMounted(async () => {
  if (offline.value) return

  history.value = await page.value?.getHistory()
    .catch((err) => {
      logOnServer('Error in wiki history:', err)
      return []
    }) ?? null
  loading.value = false
})
</script>
