import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  platform () {
    return ipcRenderer.sendSync('platform')
  }
})
