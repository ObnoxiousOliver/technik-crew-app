import { readonly, ref } from 'vue'

const updateFound = ref(false)
const updated = ref(false)

if (process.env.NODE_ENV === 'production') {
  window.addEventListener('swUpdateFound', () => {
    updateFound.value = true
  })
  window.addEventListener('swUpdated', () => {
    updated.value = true
  })
}

export function useUpdate () {
  return {
    updateFound: readonly(updateFound),
    updated: readonly(updated)
  }
}
