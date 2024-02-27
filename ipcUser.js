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
const axios = require('axios');


function ipcMainUser(mainWindow){

    ipcMain.on('login_success', async (event,args) => {
        let user_file = await checkFileExistence(app.getPath('userData') + '/MLM_GROUP/.user/user.json');
        let user = {};
        user.name = args.name;
        user.token = args.token;
        user.email = args.email;
        console.log(user);
        console.log(args);

        if(!user_file){
            await createFile(app.getPath('userData') + '/MLM_GROUP/.user/user.json', JSON.stringify(user)) ;
        }
        await fs.writeFile(app.getPath('userData') + '/MLM_GROUP/.user/user.json', JSON.stringify(user), 'utf-8');
        mainWindow.loadFile('index.html');
    });

    ipcMain.on('login_fetch', async (event, args) => {
        try{
            const response = await axios.post('https://fastbilliards.com/api/login', args);
            console.log(response.data);
            event.reply('login_fetch', response.data);
        }catch(e){
            event.reply('login_fetch', {status: false});
        }
        
        
    });

}
    
module.exports = {ipcMainUser}