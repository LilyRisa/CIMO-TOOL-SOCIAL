const { ipcMain, dialog, app, remote } = require('electron');
var fs = require('fs').promises;
const cronParser = require('cron-parser');
const {isValidCronExpression, checkFileExistence, createFile} = require('./helper/ultils')
const {checkLicense} = require('./helper/license')

const {countVideosInDirectory, countAudiosInDirectory} = require('./helper/video');
const { log } = require('console');
const {cronTiktok} = require('./cron');
const {videoEdit} = require('./helper/video_editing');

function ipcMainFile(mainWindow){
    ipcMain.on('openFolderDialog', (event, args) => {
        dialog.showOpenDialog(mainWindow, {
          title: 'Chọn Thư Mục',
          properties: ['openDirectory']
        }).then(result => {
          if (!result.canceled) {
            const selectedFolder = result.filePaths[0];
            let countvideo = countVideosInDirectory(selectedFolder);
            if(typeof args !== 'undefined'){
              countvideo = countAudiosInDirectory(selectedFolder);
            }
            event.reply('ReopenFolderDialog', {selectedFolder, countvideo});
          }
        }).catch(err => {
          console.error(err);
        });
      });
    
      ipcMain.on('openFolder', (event, args) => {
        dialog.showOpenDialog(mainWindow, {
          title: 'Chọn Thư Mục',
          properties: ['openDirectory']
        }).then(result => {
          if (!result.canceled) {
            const selectedFolder = result.filePaths[0];
            let countvideo;
            if(args.type == 'audio'){
              countvideo = countAudiosInDirectory(selectedFolder);
            }else{
              countvideo = countVideosInDirectory(selectedFolder);
            }
            event.reply('ReopenFolder'+args.name, {selectedFolder, countvideo});
          }
        }).catch(err => {
          console.error(err);
        });
      });
    
      ipcMain.on('checkCountVideoInPath', (event, args) => {
          const selectedFolder = args;
          const countvideo = countVideosInDirectory(selectedFolder);
          event.reply('checkCountVideoInPath', {selectedFolder, countvideo});
      });
    
      ipcMain.on('openFile', (event, args) => {
        dialog.showOpenDialog(mainWindow, {
          properties: ['openFile'],
          filters: [
            // { name: 'Text Files', extensions: ['txt'] },
            { name: 'All Files', extensions: ['*'] },
          ],
        }).then(async (result) => {
          if (!result.canceled) {
            const filePath = result.filePaths[0];
            console.log(filePath);
            const data = await fs.readFile(filePath, 'utf-8');
            event.reply('openFile'+args, {filePath, data});
          }
        }).catch((err) => {
          console.error(err);
        });
      });
}

module.exports = {ipcMainFile}

