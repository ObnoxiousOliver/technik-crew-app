<template>
  <Page
    opaqueTitlebar
    :beforeBack="beforeBack"
    :buttons="[
      {
        icon: 'bi-check-lg',
        onClick: () => save()
      }
    ]"
  >
    <template #title>
      <span v-if="page?.icon">
        {{ page?.icon }}
      </span>
      <i v-else class="bi-file-earmark-text" />
      {{ page?.title }}
    </template>

    <Spinner v-if="loading" />

    <div class="wiki-page-edit__editor" v-else>
      <TiptapEditor v-model="content" />
    </div>

    <ActionSheet v-model:show="showConfirmBackSheet">
      <template #title>
        Ungespeicherte Änderungen
      </template>

      Du hast ungespeicherte Änderungen. Möchtest du diese verwerfen?

      <template #buttons>
        <ActionSheetButton @click="back()" class="danger">
          <i class="bi-trash" />Verwerfen
        </ActionSheetButton>
        <ActionSheetButton @click="save()">
          <i class="bi-check-lg" />Speichern
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
function beforeBack () {
  showConfirmBackSheet.value = true
}
</script>

<style lang="scss" scoped>
.wiki-page-edit {
  &__editor {
    :deep(.editor-panel) {
      position: sticky;
      top: 0;
    }

    :deep(.editor) {
      .ProseMirror {
        min-height: calc(100vh - 20rem);
        padding-bottom: 10rem;
      }
    }
  }
}
</style>
