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

    <template #btns>
      <Btn @click="save">
        <i class="bi-check2" />
      </Btn>
    </template>

    <Spinner v-if="loading" />

    <template v-else>
      <Btn
        v-for="(tab, i) in tabs"
        :key="i"
        @click="pageIndex = i"
      >
        {{ tab.title ?? 'Tab ' + (i + 1) }}
      </Btn>
      <Btn
        @click="addTab"
      >
        <i class="bi-plus-lg" />
      </Btn>

      <KeepAlive
        v-for="(tab, i) in tabs"
        :key="i"
      >
        <TiptapEditor
          v-if="pageIndex === i"
          :json="tab.content"
          @update:json="val => {
            c.log(val)
            tabs![i].content = val
          }"
        />
      </KeepAlive>
    </template>

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
import { WikiPageTabDB } from '@/model/wiki'
import { useWiki } from '@/stores/wiki'
import { storeToRefs } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const c = window.console

const route = useRoute()

const wiki = useWiki()

const { loading } = storeToRefs(wiki)

const page = computed(() => wiki.getPageFromId(route.params.id as string))
const pageIndex = ref(0)
const tabs = ref<WikiPageTabDB[]>()

// Update tabs when page changes
watchEffect(() => {
  const clone = (value: object) => JSON.parse(JSON.stringify(value))
  tabs.value = clone(page.value?.content ?? []) as WikiPageTabDB[]
})

function addTab () {
  tabs.value?.push({
    title: null,
    content: {}
  })
  pageIndex.value = (tabs.value?.length ?? 1) - 1
}

function save () {
  if (!tabs.value) return
  page.value?.setContent(tabs.value)
}
</script>

<style lang="scss" scoped>
.wiki-page-edit {
  &__editor {

  }
}
</style>
