const listeners: ((msg: string) => void)[] = []
export function useToast () {
  function show (msg: string) {
    listeners.forEach(cb => cb(msg))
  }

  function onShow (cb: (msg: string) => void) {
    listeners.push(cb)
    return () => offShow(cb)
  }

  function offShow (cb: (msg: string) => void) {
    const index = listeners.indexOf(cb)
    if (index >= 0) {
      listeners.splice(index, 1)
    }
  }

  return {
    show,
    onShow,
    offShow
  }
}
