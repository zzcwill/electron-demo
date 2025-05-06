const { app, BrowserWindow, ipcMain, globalShortcut, Menu } = require('electron');
const path = require('node:path');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true
    }
  })

  // 创建自定义右键菜单
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: '退出', 
      click:  () => {
        app.quit();
      } 
    }, // 点击退出窗口
    { 
      label: '最小化', 
      click:  () => {
        win.minimize();
      } 
    },
    { 
      label: '刷新', 
      click:  () => {
        win.reload();
      }
    }, // 点击刷新窗口
    { 
      label: '检查', 
      click:  () => {

        const isDevToolsOpened = win.webContents.isDevToolsOpened()
      
        if (isDevToolsOpened) {
          win.webContents.closeDevTools()
          return
        } 
      
        win.webContents.openDevTools()
      }
    }, // 点击刷新窗口    
  ]);

  // 绑定右键菜单到窗口
  win.webContents.on('context-menu', (e, params) => {
    e.preventDefault;
    contextMenu.popup({
      window: win,
      x: params.x,
      y: params.y
    });
  });

  // 应用退出时取消注册
  win.on('closed', () => {
  });

  let toUrl = 'http://askone-manage-pc.consult-test.sit.91lyd.com/askone-manage-pc/#/contentManage/main';
  toUrl = 'src/views/home/index.html';
  // win.loadURL(toUrl);
  win.loadFile(toUrl)
}

app.whenReady().then(() => {
  console.info(`dev-${process.env.NODE_ENV}`)
  console.info(`node-${process.versions.node}`)
  // console.info(`chrome-${process.versions.chrome}`)
  // console.info(`electron-${process.versions.electron}`)
  createWindow();
})

