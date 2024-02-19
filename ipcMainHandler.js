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


function setupIPCMainHandlers(mainWindow) {

  //tiktok ipc
  ipcMainTikTok(mainWindow);

  // edit video ipc
  ipcMainEditvideo(mainWindow);

  // file ipc
  ipcMainFile(mainWindow);
  
  // fb ipc
  ipcMainFb(mainWindow);


  ipcMain.on('open_devtool', (event, args) => {
    mainWindow.webContents.openDevTools();
  });

}

module.exports = { setupIPCMainHandlers };