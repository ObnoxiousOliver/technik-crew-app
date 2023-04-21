import { readonly, ref } from 'vue'

const isOffline = ref(true)

// window.addEventListener('offline', () => {
//   isOffline.value = true
// })

// window.addEventListener('online', () => {
//   isOffline.value = false
// })

window.addEventListener('keydown', (e) => {
  if (e.key === 'F12') {
    isOffline.value = !isOffline.value
  }
})

export function useOffline () {
  return readonly(isOffline)
}
