<template>
  <button @click="click">Bold</button>
  <editor-content :editor="editor" />
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String
  }
})
const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue ?? '',
  extensions: [
    StarterKit
  ]
})

onMounted(() => {
  emit('update:modelValue', editor.value.getHTML())
  editor.value.on('update', ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  })
})

function click () {
  editor.value.chain().focus().toggleBold().run()
}
</script>
