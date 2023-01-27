<template>
  <EditorPanel @itemClick="itemClick" />
  <editor-content class="editor" :editor="editor" />
</template>

<script lang="ts" setup>
import EditorPanel from '@/components/EditorPanel.vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { onMounted } from 'vue'
import { schema } from '../model/tiptap'

const props = defineProps({
  modelValue: {
    type: [Object, String]
  }
})
const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue ?? '',
  extensions: schema
})

function itemClick (name: string) {
  if (name.match(/h\d/)) {
    console.log()
    editor.value.chain().focus().setHeading({ level: parseInt(name.replace('h', '')) }).run()
    return
  }
  if (name === 'codeBlock') {
    editor.value.chain().focus().toggleCodeBlock().run()
    return
  }
  if (name === 'ol') {
    editor.value.chain().focus().toggleOrderedList().run()
    return
  }
  if (name === 'ul') {
    editor.value.chain().focus().toggleBulletList().run()
    return
  }
  if (name === 'indentLeft') {
    editor.value.chain().focus().sinkListItem('listItem').run()
    return
  }
  if (name === 'indentRight') {
    editor.value.chain().focus().liftListItem('listItem').run()
    return
  }

  editor.value.chain().focus().toggleMark(name).run()
}

onMounted(() => {
  emit('update:modelValue', editor.value.getJSON())
  editor.value.on('update', ({ editor }) => {
    emit('update:modelValue', editor.getJSON())
  })
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.editor {
  background: r.$bg-secondary;
  border-radius: 0 0 r.$radius r.$radius;

  :deep(.ProseMirror) {
    padding: 1rem;

    &:focus {
      outline: none;
    }
  }

  :deep() {
    p {
      margin-bottom: 0;
    }

    h1, h2, h3 {
      margin-top: 0;
      margin-bottom: 0.5rem;
    }

    code:not(pre code), pre {
      background-color: r.$bg-stroke;
      padding: 0.2rem 0.4rem;
      border-radius: 0.2rem;
    }

    ol, ul {
      margin-top: 0;
      padding-inline-start: 1rem;
    }
  }
}
</style>
