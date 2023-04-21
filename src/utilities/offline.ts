import { readonly, ref } from 'vue'
import { dev, logNetwork, useDevMode } from './developer'

const isOffline = ref(!navigator.onLine)

window.addEventListener('offline', () => {
  isOffline.value = true
})

window.addEventListener('online', () => {
  isOffline.value = false
})

window.addEventListener('keydown', (e) => {
  if (!useDevMode().enabled) return

  if (e.key === 'F9' && e.ctrlKey) {
    isOffline.value = !isOffline.value
    console.log(...dev(logNetwork), 'Offline mode', isOffline.value ? 'enabled' : 'disabled')
  }
})

export function useOffline () {
  return readonly(isOffline)
}
