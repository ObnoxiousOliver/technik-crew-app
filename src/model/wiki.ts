import { useUser } from '@/stores/user'
import { JSONContent } from '@tiptap/vue-3'
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query } from 'firebase/firestore'
import { HistoryState } from './history'

export interface WikiPageDB {
  icon: string
  title: string
  content: JSONContent | null
}

export class WikiPage {
  readonly id: string | null
  private page: WikiPageDB

  public get icon (): string {
    return this.page.icon
  }

  public get title (): string {
    return this.page.title
  }

  public get content (): JSONContent | null {
    return this.page.content
  }

  private constructor (id: string | null, options: Partial<WikiPageDB>) {
    this.id = id
    this.page = {
      icon: options.icon ?? 'bi-file-earmark-text',
      title: options.title ?? 'Neue Seite',
      content: options.content ?? null
    }
  }

  toDB (): WikiPageDB {
    return this.page
  }

  async recordHistory <T> (options: Partial<{
    author: string
    description: string
    date: number
    type: string
    content: T
  }>) {
    if (!this.id) {
      throw new Error('Cannot record history on a wiki page without an id')
    }

    const db = getFirestore()

    addDoc(
      collection(db, 'wiki', this.id, 'history'),
      new HistoryState({
        author: options.author ?? useUser().user?.username,
        description: options.description,
        date: options.date,
        type: options.type ?? 'wiki',
        content: options.content ?? this.toDB()
      }).toDB())
  }

  async getHistory () {
    if (!this.id) {
      throw new Error('Cannot get history on a wiki page without an id')
    }

    const db = getFirestore()
    const querySnapshot = await getDocs(query(collection(db, 'wiki', this.id, 'history')))
    return querySnapshot.docs.map(x => new HistoryState<unknown>(x.data()))
  }

  static async create (options: Partial<WikiPageDB>): Promise<WikiPage> {
    const db = getFirestore()
    let page = new WikiPage(null, options)

    const doc = await addDoc(collection(db, 'wiki'), page.toDB())
    page = new WikiPage(doc.id, options)
    await page.recordHistory({
      description: 'Seite erstellt'
    })

    return page
  }

  static cachedPages: {
    // eslint-disable-next-line no-use-before-define
    [id: string]: WikiPage
  } = {}

  static async get (id?: string, useCache = true) {
    if (useCache) {
      if (id && this.cachedPages[id]) {
        return this.cachedPages[id]
      }
    }

    const db = getFirestore()

    if (!id) {
      const querySnapshot = await getDocs(query(collection(db, 'wiki')))
      querySnapshot.docs.map(x => new WikiPage(x.id, x.data()))

      const pages = querySnapshot.docs.map(x => new WikiPage(x.id, x.data()))
      pages.forEach(x => {
        if (x.id) {
          this.cachedPages[x.id] = x
        }
      })

      return pages
    } else {
      const docRef = await getDoc(doc(db, 'wiki', id))
      if (!docRef.exists()) {
        throw new Error('Wiki page does not exist')
      }
      const page = new WikiPage(id, docRef.data())
      this.cachedPages[id] = page

      return this.cachedPages[id]
    }
  }
}
