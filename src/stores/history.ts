import { HistoryState } from '@/model/history'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useHistory = defineStore('history', () => {
  const history = ref<
    Record<string,
      Record<string,
        HistoryState<unknown>[]>
      >
    >({})

  function add (section: string, itemId: string, item: HistoryState<unknown> | HistoryState<unknown>[]) {
    if (!history.value[section]) {
      history.value[section] = {}
    }

    if (!history.value[section][itemId]) {
      history.value[section][itemId] = []
    }

    if (Array.isArray(item)) {
      history.value[section][itemId].push(...item)
    } else {
      history.value[section][itemId].push(item)
    }
  }

  function set (section: string, itemId: string, items: HistoryState<unknown>[]) {
    if (!history.value[section]) {
      history.value[section] = {}
    }

    history.value[section][itemId] = items
  }

  watch(history, (value) => {
    localStorage.setItem('history', JSON.stringify(value))
  }, { deep: true })

  history.value = JSON.parse(localStorage.getItem('history') || '{}')

  return {
    history,
    add,
    set
  }
})
