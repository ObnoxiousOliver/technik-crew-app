<template>
  <Page smallTitle>
    <template #title>
      <!-- <i class="bi-pencil-square" /> -->
      Bearbeite
    </template>

    <template #btns>
      <Btn @click="save">
        <i class="bi-check2" />
      </Btn>
    </template>

    <Spinner v-if="loading" />

    <template v-else>
      <input
        class="wiki-page-edit__title"
        v-model="pageTitle"
      />

      <TabEdit
        class="wiki-page-edit__tabs"
        v-if="tabs"
        v-model="tabs"
        v-model:index="pageIndex"
      />

      <KeepAlive
        v-for="(tab, i) in tabs"
        :key="i"
      >
        <TiptapEditor
          v-if="pageIndex === i"
          :json="tab.content"
          @update:json="val => {
            tabs![i].content = val
          }"
          class="wiki-page-edit__editor"
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
import TabEdit from '@/components/TabEdit.vue'
import TiptapEditor from '@/components/TiptapEditor.vue'
import { WikiPageTabDB } from '@/model/wiki'
import { back } from '@/router'
import { useWiki } from '@/stores/wiki'
import { storeToRefs } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const wiki = useWiki()

const { loading } = storeToRefs(wiki)

const page = computed(() => wiki.getPageFromId(route.params.id as string))
const pageIndex = ref(0)
const tabs = ref<WikiPageTabDB[]>()
const pageTitle = ref('')
watchEffect(() => {
  pageTitle.value = (page.value?.icon ?? '') + (page.value?.title ?? '')
})

// Update tabs when page changes
watchEffect(() => {
  const clone = (value: object) => JSON.parse(JSON.stringify(value))
  tabs.value = clone(page.value?.content ?? [{}]) as WikiPageTabDB[]
})

function save () {
  if (!tabs.value) return
  page.value?.setTitle(pageTitle.value)
  page.value?.setContent(tabs.value.map(tab => ({
    title: tab.title ?? null,
    content: tab.content
  })))

  back()
}
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.wiki-page-edit {
  &__title {
    background: none;
    border: none;
    width: 100%;
    z-index: 2;
    margin-bottom: 1rem;
    font: inherit;
    font-size: 1.5rem;
    font-weight: 600;
    color: inherit;
    position: relative;
    padding: .5rem .5rem;
    margin: 0 -.5rem;
    border-radius: r.$radius;
    transition: .2s;

    &:focus-visible {
      padding: .5rem .75rem;
      outline: none;
      box-shadow: r.$focus;
    }
  }
  &__tabs {
    position: relative;
    z-index: 2;
  }
}
</style>
