<template>
  <div ref="editorEl" class="tiptap-editor" />
</template>

<script lang="ts" setup>
import { schema } from '@/model/tiptap'
import { Editor, HTMLContent, JSONContent } from '@tiptap/vue-3'
import { useVModel } from '@vueuse/core'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const emit = defineEmits(['update:json', 'update:html'])
const props = defineProps<{
  json?: JSONContent
  html?: HTMLContent
}>()

const json = useVModel(props, 'json', emit)
const html = useVModel(props, 'html', emit)

const editorEl = ref<HTMLElement>()

let editor: Editor
onMounted(() => {
  editor = new Editor({
    element: editorEl.value,
    content: json.value ?? html.value ?? {},
    extensions: schema
  })
})

onBeforeUnmount(() => {
  editor.destroy()
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.tiptap-editor {
  :deep() {
    .ProseMirror {
      min-height: calc(100vh - 40rem);
      // padding: 1rem 1.5rem;
      // margin: 0 -1.5rem;

      &:focus-visible {
        outline: none;
      }

      // * {
      //   margin: 0;
      //   padding: 0;
      // }

      p {
        margin-bottom: 0.5rem;
      }

      ol, ul {
        // margin: 1rem 0;
        padding-left: 1rem;
      }

      h1, h2, h3 {
        font-weight: 600;
        margin-bottom: .5rem;
      }

      @for $i from 1 through 3 {
        h#{$i} {
          font-size: 2rem + 0.5rem - $i * .3rem;
        }
      }
    }
  }
}
</style>
