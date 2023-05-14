import StarterKit from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { Link } from '@tiptap/extension-link'
import { Editor } from '@tiptap/vue-3'

export const schema = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3]
    },
    horizontalRule: false,
    blockquote: false
  }),
  Underline,
  Subscript,
  Superscript,
  Link.configure({
    openOnClick: false,
    protocols: ['http', 'https', 'mailto', 'tel']
  })
]

export function getAllActive (editor: Editor) {
  const marks: {
    name: string
    active: boolean
    attrs?: Record<string, unknown>
  }[] = []

  // Bold
  marks.push({
    name: 'bold',
    active: editor.isActive('bold')
  })

  // Italic
  marks.push({
    name: 'italic',
    active: editor.isActive('italic')
  })

  // Strike
  marks.push({
    name: 'strike',
    active: editor.isActive('strike')
  })

  // Underline
  marks.push({
    name: 'underline',
    active: editor.isActive('underline')
  })

  // Subscript
  marks.push({
    name: 'subscript',
    active: editor.isActive('subscript')
  })

  // Superscript
  marks.push({
    name: 'superscript',
    active: editor.isActive('superscript')
  })

  // Code
  marks.push({
    name: 'code',
    active: editor.isActive('code')
  })

  // Link
  marks.push({
    name: 'link',
    active: editor.isActive('link'),
    attrs: editor.isActive('link') ? editor.getAttributes('link') : undefined
  })

  // Heading
  marks.push({
    name: 'paragraph',
    active: editor.isActive('paragraph')
  })
  marks.push({
    name: 'heading-1',
    active: editor.isActive('heading', { level: 1 })
  })
  marks.push({
    name: 'heading-2',
    active: editor.isActive('heading', { level: 2 })
  })
  marks.push({
    name: 'heading-3',
    active: editor.isActive('heading', { level: 3 })
  })

  // Bullet List
  marks.push({
    name: 'bullet-list',
    active: editor.isActive('bulletList')
  })

  // Order List
  marks.push({
    name: 'ordered-list',
    active: editor.isActive('orderedList')
  })

  // Code
  marks.push({
    name: 'code',
    active: editor.isActive('code')
  })
  marks.push({
    name: 'code-block',
    active: editor.isActive('codeBlock')
  })

  return marks
}

export function setAllActive (editor: Editor, marks: {
  name: string
  active: boolean
  attrs?: Record<string, unknown>
}[]) {
  let chain = editor.chain().focus()

  function setMark (name: string, active: boolean, attrs?: Record<string, unknown>) {
    let pascalCaseName = name.charAt(0).toUpperCase() + name.slice(1)
    pascalCaseName = pascalCaseName.split('-').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join('')

    if (active) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      chain = (chain as any)['set' + pascalCaseName]?.(name, attrs)
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      chain = (chain as any)['unset' + pascalCaseName]?.(name)
    }
  }

  function setNode (name: string, active: boolean, attrs?: Record<string, unknown>) {
    if (active) {
      chain = chain.setNode(name, attrs)
    } else {
      chain = chain.setNode('paragraph')
    }
  }

  marks.forEach(mark => {
    if (mark.name.startsWith('heading-')) {
      const level = parseInt(mark.name.split('-')[1])
      if (mark.active) {
        chain = chain.setHeading({ level: level as 1 | 2 | 3 })
      }

      return
    }

    switch (mark.name) {
      case 'bold':
      case 'italic':
      case 'strike':
      case 'underline':
      case 'subscript':
      case 'superscript':
      case 'code':
        setMark(mark.name, mark.active)
        break
      case 'link':
        setMark(mark.name, mark.active, mark.attrs)
        break
      case 'bullet-list':
      case 'ordered-list':
      case 'code-block':
        setNode(mark.name, mark.active)
        break
      case 'heading-1':
        setNode('heading', mark.active, { level: 1 })
        break
      case 'heading-2':
        setNode('heading', mark.active, { level: 2 })
        break
      case 'heading-3':
        setNode('heading', mark.active, { level: 3 })
        break
    }
  })

  chain.focus().run()
}
