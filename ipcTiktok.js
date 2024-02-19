const { ipcMain, dialog, app, remote } = require('electron');
var fs = require('fs').promises;
const cronParser = require('cron-parser');
const {isValidCronExpression, checkFileExistence, createFile} = require('./helper/ultils')
const {checkLicense} = require('./helper/license')

const {countVideosInDirectory, countAudiosInDirectory} = require('./helper/video');
const { log } = require('console');
const {cronTiktok} = require('./cron');
const {videoEdit} = require('./helper/video_editing');


function ipcMainTikTok(mainWindow){

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
        let file = app.getPath('userData') + '/MLM_GROUP/tikok_background.json';
        let check_file_exits = await checkFileExistence(file);
    
        if(check_file_exits && checkLicense()){
          const uniqueId = Date.now().toString();
          file = app.getPath('userData') + '/MLM_GROUP/tikok_background'+uniqueId+'.json';
          try{
            await createFile(file, args);
            event.reply('tiktokStartSaveFile', {status : true});
            // await cronTiktok();
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
          // await cronTiktok();
          return;
        }catch(e){
          event.reply('tiktokStartSaveFile', {status : false, type: e});
          return;
        }
        
      });
    
    
    ipcMain.on('crontab_tiktok', async (event, args) => {
      // cronjob tiktok
      await cronTiktok();
    
    });
}
    
module.exports = {ipcMainTikTok}