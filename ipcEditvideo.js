const { ipcMain, dialog, app, remote } = require('electron');
var fs = require('fs').promises;
const cronParser = require('cron-parser');
const {isValidCronExpression, checkFileExistence, createFile} = require('./helper/ultils')
const {checkLicense} = require('./helper/license')

const {countVideosInDirectory, countAudiosInDirectory} = require('./helper/video');
const { log } = require('console');
const {cronTiktok} = require('./cron');
const {videoEdit, downVideo} = require('./helper/video_editing');


function ipcMainEditvideo(mainWindow){

   // edit video

ipcMain.on('editvideo', async (event, args) => {

    let status = await videoEdit(args, function(path, phantram, count, errono){
      event.reply('editvideo_reply', {path, phantram, count, errono});
    });
    console.log(status);
    if(status){
      event.reply('editvideo_reply_done', {status : true});
    }
  
  });

ipcMain.on('downvideo', async (event, args) => {
    let status = await downVideo(args.file, args.save_video, function(path, phantram, count, errono){
      event.reply('downvideo_reply', {path, phantram, count, errono});
    });
    if(status){
      event.reply('downvideo_reply_done', {status : true});
    }
});

}
    
module.exports = {ipcMainEditvideo}