const { ipcMain, dialog, app } = require('electron');
var fs = require('fs').promises;
const cronParser = require('cron-parser');
const {isValidCronExpression, checkFileExistence, createFile} = require('./helper/ultils')
const {checkLicense} = require('./helper/license')

const {countVideosInDirectory} = require('./helper/video');
const { log } = require('console');
const {cronTiktok} = require('./cron');

function setupIPCMainHandlers(mainWindow) {

  ipcMain.on('openFolderDialog', (event, args) => {
    dialog.showOpenDialog(mainWindow, {
      title: 'Chọn Thư Mục',
      properties: ['openDirectory']
    }).then(result => {
      if (!result.canceled) {
        const selectedFolder = result.filePaths[0];
        const countvideo = countVideosInDirectory(selectedFolder);
        event.reply('ReopenFolderDialog', {selectedFolder, countvideo});
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

  ipcMain.on('save_tik_file', (event, args) => {
    dialog.showSaveDialog(mainWindow, {
      defaultPath: 'MLM_output_tiktok.json',
    }).then(async (result) => {
      console.log(result);
      if (!result.canceled) {
        await fs.writeFile(result.filePath, args, 'utf-8');
        event.reply('save_tik_file', result.filePath);
      }
    }).catch((err) => {
      console.error(err);
    });
  });

  ipcMain.on('tiktokStartSaveFile', async (event, args) => {
    let data = JSON.parse(args)
    console.log(data);
    if (isValidCronExpression(data.crontab)) {
      event.reply('tiktokStartSaveFile', {status : false, type: 'crontab'});
      return;
    }
    let file = app.getPath('userData') + '/MLM_GROUP_COMPANY_LIMITED/tikok_background.json';
    let check_file_exits = await checkFileExistence(file);

    if(check_file_exits && checkLicense()){
      const uniqueId = Date.now().toString();
      file = app.getPath('userData') + '/MLM_GROUP_COMPANY_LIMITED/tikok_background'+uniqueId+'.json';
      try{
        await createFile(file, args);
        event.reply('tiktokStartSaveFile', {status : true});
        await cronTiktok();
        return;
      }catch(e){
        event.reply('tiktokStartSaveFile', {status : false, type: e});
        return;
      }
      
    }

    if(check_file_exits && !checkLicense()){
      event.reply('tiktokStartSaveFile', {status : false, type: 'license'});
      return;
    }
    try{
      await createFile(file, args);
      event.reply('tiktokStartSaveFile', {status : true});
      await cronTiktok();
      return;
    }catch(e){
      event.reply('tiktokStartSaveFile', {status : false, type: e});
      return;
    }
    
  });


}

module.exports = { setupIPCMainHandlers };