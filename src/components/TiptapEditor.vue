<template>
  <div class="tiptap-editor__buttons">
    <SelectionBtnFields
      :active="activeElements"
      @itemClick="itemClick"
      :buttonAttrs="{
        tabindex: -1
      }"
      :fields="[
        [
          {
            value: 'undo',
            ariaLabel: 'Rückgängig',
            icon: 'bi-arrow-counterclockwise',
            justButton: true
          },
          {
            value: 'redo',
            ariaLabel: 'Wiederholen',
            icon: 'bi-arrow-clockwise',
            justButton: true
          }
        ],
        [
          {
            value: 'hard-break',
            ariaLabel: 'Zeilenumbruch',
            icon: 'bi-arrow-return-left',
            justButton: true
          }
        ],
        [
          {
            value: 'bold',
            ariaLabel: 'Fett',
            icon: 'bi-type-bold',
          },
          {
            value: 'italic',
            ariaLabel: 'Kursiv',
            icon: 'bi-type-italic',
          },
          {
            value: 'underline',
            ariaLabel: 'Unterstrichen',
            icon: 'bi-type-underline',
          },
          {
            value: 'strike',
            ariaLabel: 'Durchgestrichen',
            icon: 'bi-type-strikethrough',
          },
          {
            value: 'code',
            ariaLabel: 'Code',
            icon: 'bi-code',
          }
        ],
        [
          {
            value: 'subscript',
            ariaLabel: 'Tiefgestellt',
            icon: 'bi-subscript'
          },
          {
            value: 'superscript',
            ariaLabel: 'Hochgestellt',
            icon: 'bi-superscript'
          }
        ],
        [
          {
            value: 'link',
            ariaLabel: 'Link',
            icon: 'bi-link-45deg'
          }
        ],
        [
          {
            value: 'bullet-list',
            ariaLabel: 'Aufzählung',
            icon: 'bi-list-ul'
          },
          {
            value: 'ordered-list',
            ariaLabel: 'Nummerierte Liste',
            icon: 'bi-list-ol'
          },
          {
            value: 'indent',
            ariaLabel: 'Einzug',
            icon: 'bi-text-indent-left',
            justButton: true
          },
          {
            value: 'outdent',
            ariaLabel: 'Einzug verkleinern',
            icon: 'bi-text-indent-right',
            justButton: true
          }
        ],
        [
          {
            value: 'heading-1',
            ariaLabel: 'Überschrift 1',
            icon: 'bi-type-h1'
          },
          {
            value: 'heading-2',
            ariaLabel: 'Überschrift 2',
            icon: 'bi-type-h2'
          },
          {
            value: 'heading-3',
            ariaLabel: 'Überschrift 3',
            icon: 'bi-type-h3'
          }
        ],
        [
          {
            value: 'clear',
            ariaLabel: 'Formatierung entfernen',
            icon: 'bi-x-lg',
            justButton: true
          }
        ]
      ]"
    />
  </div>

  <div
    v-bind="$attrs"
    ref="editorEl"
    class="tiptap-editor"
  />
</template>

<script lang="ts" setup>
import { schema, getAllActive } from '@/model/tiptap'
import { Editor, HTMLContent, JSONContent } from '@tiptap/vue-3'
import { useVModel } from '@vueuse/core'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import SelectionBtnFields from './SelectionBtnFields.vue'

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
    content: json.value ?? html.value ?? '',
    extensions: schema,
    onUpdate: ({ editor }) => {
      json.value = editor.getJSON()
      html.value = editor.getHTML()
    }
  })

  editor.on('update', updateActiveElements)
  editor.on('selectionUpdate', updateActiveElements)
  updateActiveElements()
})

const activeAttributes = ref<Record<string, Record<string, unknown>>>({})
const activeElements = ref<Record<string, boolean>>({})
function updateActiveElements () {
  getAllActive(editor).forEach(({ name, active, attrs }) => {
    activeElements.value[name] = active
    attrs
      ? (activeAttributes.value[name] = attrs)
      : delete activeAttributes.value[name]
  })
}

function itemClick (name: string) {
  switch (name) {
    case 'undo':
      editor.chain().focus().undo().run()
      break
    case 'redo':
      editor.chain().focus().redo().run()
      break
    case 'hard-break':
      editor.chain().focus().setHardBreak().run()
      break
    case 'bold':
      editor.chain().focus().toggleBold().run()
      break
    case 'italic':
      editor.chain().focus().toggleItalic().run()
      break
    case 'underline':
      editor.chain().focus().toggleUnderline().run()
      break
    case 'strike':
      editor.chain().focus().toggleStrike().run()
      break
    case 'subscript':
      if (activeElements.value.superscript) {
        editor.chain().focus().unsetSuperscript().run()
      }
      editor.chain().focus().toggleSubscript().run()
      break
    case 'superscript':
      if (activeElements.value.subscript) {
        editor.chain().focus().unsetSubscript().run()
      }
      editor.chain().focus().toggleSuperscript().run()
      break
    case 'link':
      // eslint-disable-next-line no-case-declarations
      let link = window.prompt(
        'Link-Adresse:',
        activeAttributes.value.link?.href as string ?? ''
      )
      if (link !== null) {
        if (link === '') {
          editor.chain().focus().unsetLink().run()
          break
        }

        if ([
          'http://',
          'https://',
          'mailto:',
          'tel:'
        ].every(prefix => !(link as string).startsWith(prefix))) {
          link = 'https://' + link
        }

        editor.chain().focus().setLink({
          href: link
        }).run()
      }
      break
    case 'code':
      editor.chain().focus().toggleCode().run()
      break
    case 'code-block':
      editor.chain().focus().toggleCodeBlock().run()
      break
    case 'heading-1':
      editor.chain().focus().toggleHeading({ level: 1 }).run()
      break
    case 'heading-2':
      editor.chain().focus().toggleHeading({ level: 2 }).run()
      break
    case 'heading-3':
      editor.chain().focus().toggleHeading({ level: 3 }).run()
      break
    case 'bullet-list':
      editor.chain().focus().toggleBulletList().run()
      break
    case 'ordered-list':
      editor.chain().focus().toggleOrderedList().run()
      break
    case 'indent':
      editor.chain().focus().sinkListItem('listItem').run()
      break
    case 'outdent':
      editor.chain().focus().liftListItem('listItem').run()
      break
    case 'clear':
      editor.chain().focus().clearNodes().unsetAllMarks().run()
      break
  }
}

onBeforeUnmount(() => {
  editor.destroy()
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.tiptap-editor {
  isolation: isolate;

  :deep() {
    .ProseMirror {
      padding: 0 .5rem;
      min-height: calc(100vh - 16.5rem);
      // padding: 1rem 1.5rem;
      // margin: 0 -1.5rem;

      &:focus-visible {
        outline: none;
      }

      // Paragraph
      p {
        margin: 0.5rem 0;
      }

      // List
      ol, ul {
        margin: .5rem 0;
        padding-left: 1.5rem;
      }

      // Heading
      // h1, h2, h3 {
      //   font-weight: 600;
      //   margin-top: 0;
      //   margin-bottom: 0.5rem;
      // }

      // @for $i from 1 through 3 {
      //   h#{$i} {
      //     font-size: 2rem + 0.5rem - $i * .3rem;
      //   }
      // }

      // Codeblock
      // pre {
      //   code {
      //     display: block;
      //     padding: .5rem;
      //     margin: .5rem 0;
      //   }
      // }
    }
  }

  &__buttons {
    z-index: 1;
    position: sticky;
    top: 0;
    border-radius: r.$radius;
    background: r.$bg-primary;
    box-shadow: r.$bg-primary 0 -6.5rem 0 5rem;
  }
}
</style>
