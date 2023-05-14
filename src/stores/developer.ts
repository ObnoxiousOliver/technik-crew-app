import { useToast } from '@/utilities/toast'
import { disableNetwork, enableNetwork, getFirestore } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { computed, ref, watch, watchEffect } from 'vue'

export const useDev = defineStore('developer', () => {
  const flags = ref<{
    forceOfflineMode?: boolean
  }>({})
  const enabled = ref(false)

  // Show toast when developer mode is enabled/disabled
  function showDevToast (value: boolean) {
    const toast = useToast()
    if (value) {
      toast.show('🧑‍💻 Entwicklermodus aktiviert')
    } else {
      toast.show('🧑‍💻 Entwicklermodus deaktiviert')
    }
  }
  watch(enabled, (value, oldValue) => {
    if (value === oldValue) return
    showDevToast(value)
  })

  // Save to localStorage
  watch([enabled, flags], () => {
    localStorage.setItem('dev', JSON.stringify({
      enabled: enabled.value,
      flags: flags.value
    }))
  }, { deep: true })

  // Load from localStorage
  const ls = JSON.parse(localStorage.getItem('dev') || '{}')

  if (process.env.NODE_ENV === 'development') {
    enabled.value = true
  } else if (typeof ls.enabled === 'boolean') {
    enabled.value = ls.enabled as boolean
  }

  if (ls.flags) {
    Object.keys(ls.flags).forEach((key: string) => {
      (flags.value as Record<string, boolean>)[key] = !!ls.flags[key]
    })
  }

  // Enable developer mode by pressing Ctrl + Alt + D
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.key === 'D') {
      e.preventDefault()
      enabled.value = !enabled.value
    }
  })

  watchEffect(() => {
    if (enabled.value) {
      flags.value.forceOfflineMode
        ? disableNetwork(getFirestore())
        : enableNetwork(getFirestore())
    } else {
      enableNetwork(getFirestore())
    }
  })

  return {
    flags: computed(() => enabled.value ? flags.value : {}),
    enabled
  }
})
