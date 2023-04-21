import { readonly, ref } from 'vue'

const isOffline = ref(!navigator.onLine)

window.addEventListener('offline', () => {
  isOffline.value = true
})

window.addEventListener('online', () => {
  isOffline.value = false
})

// window.addEventListener('keydown', (e) => {
//   if (e.key === 'o' && e.ctrlKey) {
//     isOffline.value = !isOffline.value
//   }
// })

export function useOffline () {
  return readonly(isOffline)
}
