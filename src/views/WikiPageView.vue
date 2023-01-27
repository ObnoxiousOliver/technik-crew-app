<template>
  <Page :buttons="[
    {
      icon: 'bi-pencil-square',
      onClick: () => router.push({
        name: 'wiki-page-edit',
        params: { id: page?.id }
      })
    }
  ]">
    <template #title>
      <span v-if="page?.icon">
        {{ page?.icon }}
      </span>
      <i v-else class="bi-file-earmark-text" />
      {{ page?.title }}
    </template>

    <Spinner v-if="!page" />

    <div v-else>
      <div v-if="content" class="content" v-html="content" />
      <div v-else class="content--placeholder">
        <p>
          Kein Inhalt
        </p>
      </div>
    </div>
  </Page>
</template>

<script lang="ts" setup>
import { schema } from '@/model/tiptap'
import { WikiPage } from '@/model/wiki'
import { generateHTML } from '@tiptap/vue-3'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const page = ref<WikiPage>()

const content = computed(() => {
  if (!page.value?.content) return null
  return generateHTML(page.value?.content, schema)
})

WikiPage.get(route.params.id)
  .then(p => {
    page.value = p
  })
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.content {
  word-break: break-word;

  &--placeholder {
    color: r.$text-secondary;
  }
}
</style>
