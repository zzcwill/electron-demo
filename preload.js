const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electWeb', {
  node: process.versions.node,
  chrome: process.versions.chrome,
  // 系统截图功能
  systemScreenshot: () => ipcRenderer.invoke('system-screenshot')
})