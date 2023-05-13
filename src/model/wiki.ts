import { JSONContent } from '@tiptap/vue-3'
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, setDoc } from 'firebase/firestore'
import { HistoryState } from './history'

export interface WikiPageTabDB {
  title: string | null
  content: JSONContent
}

export interface WikiPageDB {
  icon: string | null
  title: string
  content: WikiPageTabDB[] | JSONContent | null
}

export class WikiPage {
  readonly id: string | null
  private page: WikiPageDB

  public get icon (): string | null {
    return this.page.icon
  }

  public get title (): string {
    return this.page.title
  }

  public get content (): WikiPageTabDB[] | null {
    if (Array.isArray(this.page.content)) {
      return this.page.content
    } else if (this.page.content) {
      // Return the content as a single tab
      return [{
        title: null,
        content: this.page.content
      }]
    } else {
      return null
    }
  }

  constructor (id: string | null, options: Partial<WikiPageDB>) {
    this.id = id
    this.page = {
      icon: options.icon ?? null,
      title: options.title ?? 'Neue Seite',
      content: options.content ?? null
    }
  }

  toDB (): WikiPageDB {
    return {
      icon: this.icon,
      title: this.title,
      content: this.content
    }
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
        author: options.author,
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

    return HistoryState.get('wiki', this.id)
  }

  async setContent (content: WikiPageTabDB[]) {
    this.page.content = content
    await this.save()
  }

  async save () {
    if (!this.id) {
      throw new Error('Cannot save a wiki page without an id')
    }

    const db = getFirestore()
    await setDoc(doc(db, 'wiki', this.id), this.toDB())

    await this.recordHistory({
      description: 'Seite gespeichert'
    })
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

  /**
   * Cached wiki pages
   */
  static cachedPages: {
    // eslint-disable-next-line no-use-before-define
    [id: string]: WikiPage
  } = {}

  /**
   * Get a wiki page from the database
   * @param id Optional id of the page to get (if not provided, all pages will be returned)
   * @param useCache Whether to use the cached version of the page
   * @returns The wiki page
   * @deprecated Use the store instead
   */
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
