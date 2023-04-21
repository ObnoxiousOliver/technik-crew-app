import { readonly, ref } from 'vue'

const isOffline = ref(false)

window.addEventListener('offline', () => {
  isOffline.value = true
})

window.addEventListener('online', () => {
  isOffline.value = false
})

export function useOffline () {
  return readonly(isOffline)
}
