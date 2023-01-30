import { reactive } from 'vue'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export interface BreakpointObject {
  value: Breakpoint,
  mode: 'mobile' | 'desktop',
}

let breakpoint: BreakpointObject
export function useBreakpoint (): BreakpointObject {
  if (breakpoint) {
    return breakpoint
  }

  breakpoint = reactive<BreakpointObject>({
    value: 'xl',
    mode: 'desktop'
  })

  function updateBreakpoint () {
    if (window.innerWidth < 576) {
      if (breakpoint.value === 'xs') return

      breakpoint.value = 'xs'
      breakpoint.mode = 'mobile'
    } else if (window.innerWidth < 768) {
      if (breakpoint.value === 'sm') return

      breakpoint.value = 'sm'
      breakpoint.mode = 'mobile'
    } else if (window.innerWidth < 992) {
      if (breakpoint.value === 'md') return

      breakpoint.value = 'md'
      breakpoint.mode = 'desktop'
    } else if (window.innerWidth < 1200) {
      if (breakpoint.value === 'lg') return

      breakpoint.value = 'lg'
      breakpoint.mode = 'desktop'
    } else {
      if (breakpoint.value === 'xl') return

      breakpoint.value = 'xl'
      breakpoint.mode = 'desktop'
    }

    document.documentElement.classList.remove('xs', 'sm', 'md', 'lg', 'xl', 'mobile', 'desktop')
    document.documentElement.classList.add(breakpoint.value)
    document.documentElement.classList.add(breakpoint.mode)
  }

  window.addEventListener('resize', updateBreakpoint)
  updateBreakpoint()

  return breakpoint
}
