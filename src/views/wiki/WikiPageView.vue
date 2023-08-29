<template>
  <Page>
    <template #title>
      <span v-if="page?.icon">{{ page?.icon }}&nbsp;</span>
      <i v-else class="bi-file-earmark-text" />
      <span class="text-transform-normal">
        {{ page?.title }}
      </span>
    </template>

    <template v-if="page" #btns>
      <Btn
        :to="{
          name: 'wiki-page-edit',
          params: { id: page.id }
        }"
      >
        <i class="bi-pencil-square" />
      </Btn>
      <Btn
        :to="{
          name: 'wiki-page-details',
          params: { id: page.id }
        }"
      >
        <i class="bi-three-dots-vertical" />
      </Btn>
    </template>

    <Spinner v-if="!page" />

    <template v-else>
      <DropdownSelection
        v-if="page.content && (page.content.some(x => x.title) || page.content.length > 1)"
        v-model="pageIndex"
        class="tabs"
      >
        <option
          v-for="(tab, index) in page.content"
          :key="index"
          :value="index"
        >
          {{ tab.title ?? `Seite ${index + 1}` }}
        </option>
      </DropdownSelection>

      <div v-if="content" class="content" v-html="content" />
      <div v-else class="content--placeholder">
        <p>
          Kein Inhalt
        </p>
      </div>
    </template>
  </Page>
</template>

<script lang="ts" setup>
import DropdownSelection from '@/components/DropdownSelection.vue'
import { schema } from '@/model/tiptap'
import { useWiki } from '@/stores/wiki'
import { generateHTML, generateText } from '@tiptap/vue-3'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const wiki = useWiki()

const page = computed(() => wiki.getPageFromId(route.params.id as string))
const pageIndex = ref(0)

const content = computed(() => {
  console.log(page.value?.content?.[pageIndex.value])
  if (!page.value?.content?.[pageIndex.value]) return null
  try {
    const text = generateText(page.value.content[pageIndex.value].content, schema)
    if (!text) return null
    return generateHTML(page.value.content[pageIndex.value].content, schema)
  } catch (err) {
    console.warn(err)
    return null
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.tabs {
  margin: 1rem 0;
}

.content {
  white-space: pre-wrap;
  word-break: break-word;
  user-select: text;

  &--placeholder {
    color: r.$text-secondary;
  }

  :deep() {
    ul, ol {
      padding-left: 1.5rem;
    }

    // pre {
    //     code {
    //       display: block;
    //       padding: .5rem;
    //       margin: .5rem 0;
    //     }
    //   }

    p {
      margin: .5rem 0;
      min-height: 1.5rem;
    }
  }
}
</style>
