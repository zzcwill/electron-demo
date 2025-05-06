const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electWeb', {
  node: process.versions.node,
  chrome: process.versions.chrome,
})