import { useToast } from '@/utilities/toast'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useDev = defineStore('developer', () => {
  const flags = ref<{
    forceOfflineMode?: boolean
  }>({})
  const enabled = ref(false)

  function showDevToast (value: boolean) {
    const toast = useToast()
    if (value) {
      toast.show('🧑‍💻 Entwicklermodus aktiviert')
    } else {
      toast.show('🧑‍💻 Entwicklermodus deaktiviert')
    }
  }
  watch(enabled, (value) => {
    showDevToast(value)
  })

  watch([enabled, flags], () => {
    localStorage.setItem('dev', JSON.stringify({
      enabled: enabled.value,
      flags: flags.value
    }))
  }, { deep: true })

  const ls = JSON.parse(localStorage.getItem('dev') || '{}')
  enabled.value = process.env.NODE_ENV === 'development' || ls.enabled
  if (ls.flags) {
    Object.keys(flags.value).forEach((key: string) => {
      (flags.value as Record<string, boolean>)[key] = !!ls.flags[key]
    })
  }

  if (process.env.NODE_ENV === 'development') {
    // Enable developer mode by pressing Ctrl + Shift + D
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        enabled.value = !enabled.value
      }
    })
  }

  return {
    flags: computed(() => enabled.value ? flags.value : {}),
    enabled
  }
})
