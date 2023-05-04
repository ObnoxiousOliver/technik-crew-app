import { WikiPage } from '@/model/wiki'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWiki = defineStore('wiki', () => {
  const pages = ref<WikiPage[]>([])

  return {
    pages
  }
})
