import StarterKit from '@tiptap/starter-kit'
import { ListItem } from '@tiptap/extension-list-item'
import { Underline } from '@tiptap/extension-underline'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'

export const schema = [
  StarterKit.configure({
    hardBreak: false,
    heading: {
      levels: [1, 2, 3]
    },
    horizontalRule: false,
    blockquote: false
  }),
  ListItem,
  Underline,
  Subscript,
  Superscript
]
