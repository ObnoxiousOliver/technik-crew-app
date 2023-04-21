import { reactive, readonly, ref, watch } from 'vue'
import { useToast } from './toast'

// Custom developer console log
export function dev ([category, color]: string[]): string[] {
  return [`%c[${category}]`, `color: ${color}`]
}

// Developer log categories
export const logInfo = ['Info', 'blue']
export const logSuccess = ['Success', 'green']

export const logDev = ['Developer', 'orange']
export const logNetwork = ['Network', 'purple']
export const logRouter = ['Router', 'pink']

// Activate developer mode

// Developer mode state
const isDev = ref(false)
const devMode = reactive({
  enabled: isDev,
  toggle: (toast = true) => {
    isDev.value = !isDev.value
    toast && showDevToast(isDev.value)
  },
  set: (value: boolean, toast = true) => {
    isDev.value = value
    toast && showDevToast(isDev.value)
  }
})

function showDevToast (value: boolean) {
  const toast = useToast()
  if (value) {
    toast.show('🧑‍💻Developer mode enabled')
  } else {
    toast.show('🧑‍💻Developer mode disabled')
  }
}

watch(isDev, (value) => {
  if (value) {
    document.body.classList.add('dev')
  } else {
    document.body.classList.remove('dev')
  }
  console.log(...dev(logDev), 'Developer mode ' + (value ? 'enabled' : 'disabled'))
})

// Enable developer mode in development mode
if (process.env.NODE_ENV === 'development') {
  devMode.set(true, false)
}

// Enable developer mode by pressing Ctrl + Shift + D
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'D') {
    e.preventDefault()
    devMode.toggle()
  }
})

/**
 * Get developer mode state
 * @description Enter developer mode by pressing Ctrl + Shift + D
 */
export function useDevMode () {
  return readonly(devMode)
}
