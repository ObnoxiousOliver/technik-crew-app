// import { Capacitor } from '@capacitor/core'

// /* eslint-disable @typescript-eslint/no-explicit-any */
// declare global {
//   interface Window {
//     electron: any
//   }
// }

// export function getPlatform () {
//   const electronPlatform = window.electron
//     ? ({
//         darwin: 'mac',
//         win32: 'windows',
//         linux: 'linux'
//       } as any)[window.electron.platform()]
//     : undefined

//   const capacitorPlatform = Capacitor.getPlatform()

//   return electronPlatform ?? (capacitorPlatform === 'web'
//     ? (window.matchMedia('(display-mode: standalone)').matches
//         ? 'standalone'
//         : 'browser')
//     : capacitorPlatform)
// }
