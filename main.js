const { app, BrowserWindow, Menu, Tray } = require('electron');
const path = require('path');
const { setupIPCMainHandlers } = require('./ipcMainHandler');
const {cronTiktok} = require('./cron');
const {getCronProgress} = require('./helper/cron');
const { autoUpdater } = require('electron-updater');
const { log } = require('console');

const { updateElectronApp } = require('update-electron-app')

let mainWindow;
let tray;
let iconpath = path.join(__dirname, '/static/images/icon.png');
let isQuiting;

autoUpdater.setFeedURL({
  provider: 'github',
  repo: 'MLM-GROUP-COMPANY-LIMITED',
  owner: 'LilyRisa',
  private: true,
  token: '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'
})

app.on('ready', () => {

    //windows chính
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    icon: iconpath,
    webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),

    }
  });
  mainWindow.loadFile('index.html');

  // autoUpdater.checkForUpdatesAndNotify();
  updateElectronApp({
    updateInterval: '1 hour',
    logger: require('electron-log')
  })
  // mainWindow.webContents.openDevTools(); // debug
//   // windows ẩn
//   hideWindow = new BrowserWindow({
//     show: false,
//     webPreferences: {
//       nodeIntegration: true
//     }
//   });
//   hideWindow.loadFile('null.html');

// auto update
// autoUpdater.checkForUpdatesAndNotify();

// autoUpdater.setFeedURL({
//   provider: 'github',
//   repo: 'MLM-GROUP-COMPANY-LIMITED',
//   owner: 'LilyRisa',
//   private: true,
//   token: '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'
// })

// console.log(autoUpdater.checkForUpdatesAndNotify());

// mainWindow.once('ready-to-show', () => {
//   autoUpdater.checkForUpdatesAndNotify();
// });

// autoUpdater.on('update-available', () => {
//   mainWindow.webContents.send('update_available');
// });
// autoUpdater.on('update-downloaded', () => {
//   mainWindow.webContents.send('update_downloaded');
// });


getCronProgress();

//ipc main
setupIPCMainHandlers(mainWindow);

  
  const mainMenu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(mainMenu);

// Tạo tray icon
tray = new Tray(iconpath);

// Hiển thị cửa sổ khi người dùng click vào icon
tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

  // Tạo context menu khi chuột phải vào icon
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Hiển thị', click: () => toggleWindow() },
    { label: 'Thoát', click: function(){
        isQuiting = true;
        app.quit();
    }},
    { label: 'Developer Tools', click: function(){
      mainWindow.webContents.toggleDevTools();
  }}

  ]);
  tray.setContextMenu(contextMenu);

  mainWindow.on('close', (event) => {
    if(!isQuiting){
        event.preventDefault();
        mainWindow.hide();
        event.returnValue = false;
    }
  });

});

app.commandLine.appendSwitch('remote-debugging-port', '8315');
app.commandLine.appendSwitch('host-rules', 'MAP * 127.0.0.1');

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

function toggleWindow() {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  }
