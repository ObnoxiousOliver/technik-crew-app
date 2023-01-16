import { ref, Ref } from 'vue'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export function useBreakpoint (): Ref<Breakpoint> {
  const breakpoint = ref<Breakpoint>('lg')

  function updateBreakpoint () {
    if (window.innerWidth < 576) {
      breakpoint.value = 'xs'
    } else if (window.innerWidth < 768) {
      breakpoint.value = 'sm'
    } else if (window.innerWidth < 992) {
      breakpoint.value = 'md'
    } else if (window.innerWidth < 1200) {
      breakpoint.value = 'lg'
    } else {
      breakpoint.value = 'xl'
    }
  }

  window.addEventListener('resize', updateBreakpoint)
  updateBreakpoint()

  return breakpoint
}
