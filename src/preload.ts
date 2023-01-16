import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  platform () {
    return ipcRenderer.sendSync('platform')
  },
  getZoomFactor () {
    return ipcRenderer.sendSync('get-zoom-factor')
  }
})
