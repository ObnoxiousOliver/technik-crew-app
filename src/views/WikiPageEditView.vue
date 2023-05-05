<template>
  <Page>
    <template #title>
      <!-- <i class="bi-pencil-square" /> -->
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
import { useWiki } from '@/stores/wiki'
import { JSONContent } from '@tiptap/vue-3'
import { storeToRefs } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const wiki = useWiki()

const { loading } = storeToRefs(wiki)

const page = computed(() => wiki.getPageFromId(route.params.id as string))
const pageIndex = ref(0)
const tabs = ref<{
  title: string,
  content: JSONContent[]
}[]>()
const content = computed<JSONContent>(() => {
  if (!tabs.value) return {}
  return tabs.value[pageIndex.value].content
})

// Update content when page changes or pageIndex changes
watchEffect(() => {
  tabs.value = (page.value?.content as {
    title: string,
    content: JSONContent[]
  }[]) ?? []
})
</script>

<style lang="scss" scoped>
.wiki-page-edit {
  &__editor {

  }
}
</style>
