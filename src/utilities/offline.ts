import { computed, ref } from 'vue'
import { useDev } from '../stores/developer'

const isOffline = ref(!navigator.onLine)

window.addEventListener('offline', () => {
  isOffline.value = true
})

window.addEventListener('online', () => {
  isOffline.value = false
})

// Toggle offline mode with Ctrl+F9
window.addEventListener('keydown', (e) => {
  if (!useDev().enabled) return

  if (e.key === 'F9' && e.ctrlKey) {
    useDev().flags.forceOfflineMode = !useDev().flags.forceOfflineMode
  }
})

declare global {
  interface Window {
    enableOfflineMode: (v?: boolean) => void
  }
}

window.enableOfflineMode = (v = !isOffline.value) => {
  isOffline.value = v
}

export function useOffline () {
  return computed(() => {
    return useDev().flags.forceOfflineMode
      ? true
      : isOffline.value
  })
}
