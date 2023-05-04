<template>
  <Page opaqueTitlebar>
    <template #title>
      <span v-if="page?.icon">
        {{ page?.icon }}
      </span>
      <i v-else class="bi-file-earmark-text" />
      {{ page?.title }}
    </template>

    <Spinner v-if="loading" />

    <TiptapEditor v-else v-model:json="content" />

    <!-- <ActionSheet v-model:show="showConfirmBackSheet">
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
    </ActionSheet> -->
  </Page>
</template>

<script lang="ts" setup>
import TiptapEditor from '@/components/TiptapEditor.vue'
import { WikiPage } from '@/model/wiki'
import { JSONContent } from '@tiptap/vue-3'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const loading = ref(true)

const page = ref<WikiPage>()
const content = ref<JSONContent>({})

WikiPage.get(route.params.id as string)
  .then(p => {
    page.value = p as WikiPage
    content.value = (p as WikiPage).content ?? {}
    loading.value = false
  })

</script>

<style lang="scss" scoped>
.wiki-page-edit {
  &__editor {
    // :deep(.editor-panel) {
    //   position: sticky;
    //   top: 0;
    // }

    // :deep(.editor) {
    //   .ProseMirror {
    //     min-height: calc(100vh - 20rem);
    //     padding-bottom: 10rem;
    //   }
    // }
  }
}
</style>
