const { ipcMain, dialog, app, remote } = require('electron');
var fs = require('fs').promises;
const cronParser = require('cron-parser');
const {isValidCronExpression, checkFileExistence, createFile} = require('./helper/ultils')
const {checkLicense} = require('./helper/license')

const {countVideosInDirectory, countAudiosInDirectory} = require('./helper/video');
const { log } = require('console');
const {cronTiktok} = require('./cron');
const {videoEdit} = require('./helper/video_editing');

const {ipcMainTikTok} = require('./ipcTiktok');
const {ipcMainEditvideo} = require('./ipcEditvideo');
const {ipcMainFile} = require('./ipcFile');
const {ipcMainFb} = require('./ipcFB');
const {ipcMainYT} = require('./ipcYT');
const {ipcMainUser} = require('./ipcUser');
const { autoUpdater } = require('electron-updater');


function setupIPCMainHandlers(mainWindow) {

  //tiktok ipc
  ipcMainTikTok(mainWindow);

  // edit video ipc
  ipcMainEditvideo(mainWindow);

  // file ipc
  ipcMainFile(mainWindow);
  
  // fb ipc
  ipcMainFb(mainWindow);

  // YT ipc
  ipcMainYT(mainWindow);

  ipcMainUser(mainWindow);


  ipcMain.on('open_devtool', (event, args) => {
    mainWindow.webContents.openDevTools();
  });

  ipcMain.on('check_for_update', (event, args) => {
    autoUpdater.on('update-available', () => {
      event.reply('check_for_update', {status: true});
    });
  });
  ipcMain.on('download_update', (event, args) => {
    autoUpdater.on('update-downloaded', () => {
      event.reply('download_update', {status: true});
    });
  });

  ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
  });

  ipcMain.on('app_version', (event) => {
    event.reply('app_version', { version: app.getVersion() });
  });

  // ipcMain.on('home_click', (event) => {
  //   mainWindow.loadFile('index.html');
  // });
  
  

}

module.exports = { setupIPCMainHandlers };