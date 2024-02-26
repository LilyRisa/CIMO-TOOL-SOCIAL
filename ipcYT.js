const { ipcMain, dialog, app, remote } = require('electron');
var fs = require('fs').promises;
const cronParser = require('cron-parser');
const {isValidCronExpression, checkFileExistence, createFile, getCronCampainYT} = require('./helper/ultils')
const {checkLicense} = require('./helper/license')

const {countVideosInDirectory, countAudiosInDirectory} = require('./helper/video');
const { log } = require('console');
const {cronyt} = require('./cronYT');
const {videoEdit} = require('./helper/video_editing');
const path = require('path');
const {scheduledJobs} = require('node-schedule');


function ipcMainYT(mainWindow){

  ipcMain.on('save_yt_file', (event, args) => {
    dialog.showSaveDialog(mainWindow, {
      defaultPath: 'MLM_output_yt.json',
    }).then(async (result) => {
      if (!result.canceled) {
        await fs.writeFile(result.filePath, args, 'utf-8');
        event.reply('save_yt_file', result.filePath);
      }
    }).catch((err) => {
      console.error(err);
    });
  });

  ipcMain.on('ytStartSaveFile', async (event, args) => {
    let data = JSON.parse(args)
    if (isValidCronExpression(data.crontab)) {
      event.reply('ytStartSaveFile', {status : false, type: 'crontab'});
      return;
    }
    let file = app.getPath('userData') + '/MLM_GROUP/yt_background.json';
    let check_file_exits = await checkFileExistence(file);

    if(check_file_exits && checkLicense()){
      const uniqueId = Date.now().toString();
      file = app.getPath('userData') + '/MLM_GROUP/yt_background'+uniqueId+'.json';
      try{
        await createFile(file, args);
        event.reply('ytStartSaveFile', {status : true});
        return;
      }catch(e){
        event.reply('ytStartSaveFile', {status : false, type: e});
        return;
      }
      
    }

    if(check_file_exits && !checkLicense()){
      event.reply('ytStartSaveFile', {status : false, type: 'license'});
      return;
    }
    try{
      await createFile(file, args);
      event.reply('ytStartSaveFile', {status : true});
      // await cronTiktok();
      return;
    }catch(e){
      event.reply('ytStartSaveFile', {status : false, type: e});
      return;
    }
    
  });

  ipcMain.on('crontab_yt', async (event, args) => {
    // cronjob tiktok
    await cronyt();
  
  });


  ipcMain.on('yt_check_campain', async (event, args) => {
    let arr_camp = await getCronCampainYT();

    if(arr_camp.length == 0){
      event.reply('yt_check_campain', []);
      return ;
    }
    let arr_result = [];
    
    for(let item of arr_camp){
      let obj_result = {};
      let data = await fs.readFile(item, 'utf-8');
      data = JSON.parse(data);
      obj_result.uid = data.uid;
      obj_result.success = data.video.length;
      obj_result.error = data.video_fail.length;
      obj_result.path = item;

      if(typeof data.phinish !== 'undefined'){
        obj_result.status = true;
      }else{
        obj_result.status = false;
      }
      arr_result.push(obj_result);
    }

    event.reply('yt_check_campain', arr_result);
    return ;
    
  });

  ipcMain.on('remove_campain_yt', async (event, args) => {
    let filename = path.basename(args.path);
    try{
      let check = await checkFileExistence(app.getPath('userData') + '/MLM_GROUP/.campain/'+filename);
      if(check) await fs.unlink(app.getPath('userData') + '/MLM_GROUP/.campain/'+filename);
      check = await checkFileExistence(app.getPath('userData') + '/MLM_GROUP/'+filename);
      if(check) await fs.unlink(app.getPath('userData') + '/MLM_GROUP/'+filename);
      event.reply('remove_campain_yt', {status: true});

      if(typeof scheduledJobs[args.uid] != 'undefined'){
        var my_job = scheduledJobs[unique_name];
        my_job.cancel();
     }
      return;
    }catch(e){
      event.reply('remove_campain_yt', {status: false, error: e});
    }
    
    
  });

  ipcMain.on('yt_get_cookie_campain_path', async (event, args)=>{
    let filename = path.basename(args);
    let data = await fs.readFile(app.getPath('userData') + '/MLM_GROUP/'+filename, 'utf-8');
    data = JSON.parse(data);
    event.reply('yt_get_cookie_campain_path', {status: true, data: data.cookie});
  });

  ipcMain.on('yt_set_cookie_campain_path', async (event, args)=>{
    let {path, cookie} = args;
    let filename = path.basename(path);
    let data = await fs.readFile(app.getPath('userData') + '/MLM_GROUP/'+filename, 'utf-8');
    data = JSON.parse(data);
    data.cookie = cookie
    await fs.writeFile(app.getPath('userData') + '/MLM_GROUP/'+filename, JSON.stringify(data), 'utf-8');
    // event.reply('yt_get_cookie_campain_path', {status: true, data: data.cookie});
  });



}
    
module.exports = {ipcMainYT}