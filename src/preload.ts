import { contextBridge, ipcRenderer } from 'electron'
console.log('preload.ts: contextBridge', contextBridge)

contextBridge.exposeInMainWorld('electron', {
  platform () {
    return ipcRenderer.sendSync('platform')
  }
})
