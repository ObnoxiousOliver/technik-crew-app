<template>
  <Page>
    <template #title>
      <span v-if="page?.icon">
        {{ page?.icon }}
      </span>
      <i v-else class="bi-file-earmark-text" />
      <span class="text-transform-normal">
        {{ page?.title }}
      </span>
    </template>

    <template #btns>
      <Btn
        @click="router.push({
          name: 'wiki-page-edit',
          params: { id: page?.id }
        })"
      >
        <i class="bi-pencil-square" />
      </Btn>
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
import { useWiki } from '@/stores/wiki'
import { generateHTML } from '@tiptap/vue-3'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const wiki = useWiki()

const page = computed(() => wiki.getPageFromId(route.params.id as string))
const pageIndex = ref(0)

const content = computed(() => {
  if (!page.value?.content) return null
  return generateHTML(page.value?.content[pageIndex.value].content, schema)
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.content {
  word-break: break-word;
  user-select: text;

  &--placeholder {
    color: r.$text-secondary;
  }

  :deep() {
    ul {
      padding-left: 1.5rem;
    }

    p {
      padding-bottom: 1px;
    }
  }
}
</style>
