const { app, BrowserWindow, ipcMain, globalShortcut, Menu } = require('electron');
const path = require('node:path');
const { exec } = require('child_process');
const os = require('os');

// 设置应用的基本信息
app.setName('ElectronDemo');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: false // 暂时关闭，解决本地文件加载问题
    },
    show: false, // 先不显示，等加载完成后再显示
    titleBarStyle: 'default', // macOS 标题栏样式
    vibrancy: 'under-window' // macOS 毛玻璃效果
  });

  // 窗口准备好后再显示
  win.once('ready-to-show', () => {
    win.show();
    
    // 开发模式下打开开发者工具
    if (process.env.NODE_ENV === 'dev') {
      win.webContents.openDevTools();
    }
  });

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

  // 修复打包后的文件路径问题
  const isDev = process.env.NODE_ENV === 'dev';
  let htmlPath;
  
  if (isDev) {
    // 开发环境
    htmlPath = path.join(__dirname, 'src/views/home/index.html');
  } else {
    // 生产环境，优先使用相对路径（适用于asar打包）
    htmlPath = path.join(__dirname, 'src/views/home/index.html');
  }
  
  console.log('加载文件路径:', htmlPath);
  console.log('当前工作目录:', __dirname);
  console.log('是否为开发环境:', isDev);
  
  win.loadFile(htmlPath).catch((error) => {
    console.error('加载文件失败:', error);
    // 如果加载失败，尝试直接使用相对路径
    const fallbackPath = 'src/views/home/index.html';
    console.log('尝试备用路径:', fallbackPath);
    win.loadFile(fallbackPath).catch((err) => {
      console.error('备用路径也失败:', err);
    });
  });
}

app.whenReady().then(() => {
  console.info(`dev-${process.env.NODE_ENV}`)
  console.info(`node-${process.versions.node}`)
  // console.info(`chrome-${process.versions.chrome}`)
  // console.info(`electron-${process.versions.electron}`)
  createWindow();

  // 处理系统截图请求
  ipcMain.handle('system-screenshot', async () => {
    return new Promise((resolve) => {
      try {
        // 获取桌面路径
        const desktopPath = path.join(os.homedir(), 'Desktop');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `screenshot-${timestamp}.png`;
        const filepath = path.join(desktopPath, filename);
        
        // 使用 macOS 的 screencapture 命令进行交互式截图
        const command = `screencapture -i "${filepath}"`;
        
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error('截图命令执行失败:', error);
            resolve({
              success: false,
              error: error.message
            });
          } else {
            resolve({
              success: true,
              filepath: filepath,
              filename: filename
            });
          }
        });
      } catch (error) {
        console.error('截图失败:', error);
        resolve({
          success: false,
          error: error.message
        });
      }
    });
  });
})

