const { ipcMain, dialog, app, remote } = require('electron');
var fs = require('fs').promises;
const cronParser = require('cron-parser');
const {isValidCronExpression, checkFileExistence, createFile} = require('./helper/ultils')
const {checkLicense} = require('./helper/license')

const {countVideosInDirectory, countAudiosInDirectory} = require('./helper/video');
const { log } = require('console');
const {cronfb} = require('./cron');
const {videoEdit} = require('./helper/video_editing');


function ipcMainFb(mainWindow){

  ipcMain.on('save_fb_file', (event, args) => {
    dialog.showSaveDialog(mainWindow, {
      defaultPath: 'MLM_output_fb.json',
    }).then(async (result) => {
      if (!result.canceled) {
        await fs.writeFile(result.filePath, args, 'utf-8');
        event.reply('save_fb_file', result.filePath);
      }
    }).catch((err) => {
      console.error(err);
    });
  });

  ipcMain.on('fbStartSaveFile', async (event, args) => {
    let data = JSON.parse(args)
    if (isValidCronExpression(data.crontab)) {
      event.reply('fbStartSaveFile', {status : false, type: 'crontab'});
      return;
    }
    let file = app.getPath('userData') + '/MLM_GROUP/fb_background.json';
    let check_file_exits = await checkFileExistence(file);

    if(check_file_exits && checkLicense()){
      const uniqueId = Date.now().toString();
      file = app.getPath('userData') + '/MLM_GROUP/fb_background'+uniqueId+'.json';
      try{
        await createFile(file, args);
        event.reply('fbStartSaveFile', {status : true});
        return;
      }catch(e){
        event.reply('fbStartSaveFile', {status : false, type: e});
        return;
      }
      
    }

    if(check_file_exits && !checkLicense()){
      event.reply('fbStartSaveFile', {status : false, type: 'license'});
      return;
    }
    try{
      await createFile(file, args);
      event.reply('fbStartSaveFile', {status : true});
      // await cronTiktok();
      return;
    }catch(e){
      event.reply('fbStartSaveFile', {status : false, type: e});
      return;
    }
    
  });

  ipcMain.on('crontab_fb', async (event, args) => {
    // cronjob tiktok
    await cronfb();
  
  });

}
    
module.exports = {ipcMainFb}