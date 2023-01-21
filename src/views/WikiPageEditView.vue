<template>
  <Page
    :beforeBack="beforeBack"
    :buttons="[
    {
      icon: 'bi-check-lg',
      onClick: () => save()
    }
  ]">
    <template #title>
      <i :class="page?.icon || 'bi-file-earmark-text'" />
      {{ page?.title }}
    </template>

    <Spinner v-if="loading" />

    <div v-else>
      <TiptapEditor v-model="content" />
    </div>

    <ActionSheet v-model:show="showConfirmBackSheet">
      <template #title>
        Ungespeicherte Änderungen
      </template>

      Du hast ungespeicherte Änderungen. Möchtest du diese verwerfen?

      <template #buttons>
        <ActionSheetButton @click="back()" class="danger">
          <i class="bi-trash"/>Verwerfen
        </ActionSheetButton>
        <ActionSheetButton>
          <i class="bi-check-lg" @click="save()" />Speichern
        </ActionSheetButton>
        <ActionSheetButton>
          <i class="bi-x-lg" />Abbrechen
        </ActionSheetButton>
      </template>
    </ActionSheet>
  </Page>
</template>

<script lang="ts" setup>
import TiptapEditor from '@/components/TiptapEditor.vue'
import { WikiPage } from '@/model/wiki'
import { JSONContent } from '@tiptap/core'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { back } from '../router'

const route = useRoute()
const router = useRouter()
const page = ref<WikiPage>()

const content = ref<JSONContent>(null)

const loading = ref(true)
onMounted(async () => {
  page.value = await WikiPage.get(route.params.id)
  content.value = page.value.content
  loading.value = false
})

async function save () {
  await page.value.setContent(content.value)
  await router.push({ name: 'wiki-page', params: { id: page.value.id } })
}

// TODO: Add beforeBack on navigation event
const showConfirmBackSheet = ref(false)
function beforeBack (back: () => void) {
  showConfirmBackSheet.value = true
}
</script>
