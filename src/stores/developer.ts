import { useToast } from '@/utilities/toast'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useDev = defineStore('developer', () => {
  const flags = ref<Record<string, [boolean, boolean]>>({})
  const enabled = ref(false)

  function setFlag (key: string, value: boolean, activeInNormalMode = false) {
    flags.value[key] = [value, activeInNormalMode]
  }

  function getFlag (key: string): boolean {
    if (enabled.value) {
      return flags.value[key]?.[0] ?? false
    } else {
      return flags.value[key]?.[1]
        ? flags.value[key]?.[0] ?? false
        : false
    }
  }

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
  })

  const ls = JSON.parse(localStorage.getItem('dev') || '{}')
  enabled.value = process.env.NODE_ENV === 'development' || ls.enabled || enabled.value
  ls.flags && (flags.value = ls.flags)

  // Enable developer mode by pressing Ctrl + Shift + D
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault()
      enabled.value = !enabled.value
    }
  })

  return {
    enabled,
    setFlag,
    getFlag
  }
})
