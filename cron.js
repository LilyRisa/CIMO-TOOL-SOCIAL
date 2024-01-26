// const fs = require('fs').promises; 
const { app} = require('electron');
const schedule = require('node-schedule');
const {uploadVideo} = require('./helper/tiktok')
const {getCronTikTok, getRandomElement, getRandomText, checkFileExistence, createFile} = require('./helper/ultils')
const {arrVideosInDirectory} = require('./helper/video');
const { log } = require('console');
const fs = require('fs').promises;


function startCron(file, data, uid){
    console.log('start cron...');

    let task = schedule.scheduleJob(uid,data.crontab, async () => {
        let file_status = await checkFileExistence(app.getPath('userData') + '/MLM_GROUP_COMPANY_LIMITED/.progess/'+file);
        let progress = {};
        if(!file_status){
            progress.video = [];
            await createFile(app.getPath('userData') + '/MLM_GROUP_COMPANY_LIMITED/.progess/'+file,JSON.stringify(progress)) ;
        }
        let progess_file_data = await fs.readFile(app.getPath('userData') + '/MLM_GROUP_COMPANY_LIMITED/.progess/'+file, 'utf-8');
        progress = JSON.parse(progess_file_data);

        let desc = getRandomText(data.desc);
        let arr_video = arrVideosInDirectory(data.folder_video);
        let path_video = '';
        

        while(true){
            path_video = getRandomElement(arr_video);
            if(!arr_video.includes(path_video)){
                break;
            }
        }

        if(data.proxy){
            let obj_proxy = {};
            let proxy = getRandomElement(data.proxy);
            proxy = proxy.split('|');
            obj_proxy.url = proxy[0];
            if(proxy[1] !== undefined) {
                obj_proxy.user = proxy[1];
            }
            if(proxy[2] !== undefined) {
                obj_proxy.password = proxy[1];
            }

        }
        
        console.log(path_video, desc, obj_proxy);
        let check = await uploadVideo(path_video, data.cookie,desc, obj_proxy);

        if(check){
            progress.video.push(path_video);
            let save_progress = JSON.stringify(progress);
            await fs.writeFile(app.getPath('userData') + '/MLM_GROUP_COMPANY_LIMITED/.progess/'+file, save_progress, 'utf-8');
            return;
        }
        return;
    });
    console.log(task);
}

async function cronTiktok() {

    let arr_file = await getCronTikTok();

    let data = '';
    

    if(arr_file){
        for(let file of arr_file){
            data = await fs.readFile(file, 'utf-8');
            data = JSON.parse(data);
            console.log(data.crontab);

            let name_file = file.split(/[\\\/]/);
            name_file = name_file[name_file.length - 1];
            console.log(name_file);

            let campain_file = await checkFileExistence(app.getPath('userData') + '/MLM_GROUP_COMPANY_LIMITED/.campain/'+name_file);
            let campain = {};

            if(!campain_file){
                campain.status = true;
                campain.uid = 'cron_'+Date.now().toString();
                await createFile(app.getPath('userData') + '/MLM_GROUP_COMPANY_LIMITED/.campain/'+name_file, JSON.stringify(campain)) ;

                startCron(name_file, data, campain.uid);
                await fs.writeFile(app.getPath('userData') + '/MLM_GROUP_COMPANY_LIMITED/.campain/'+name_file, campain, 'utf-8');

            }

            campain = await fs.readFile(app.getPath('userData') + '/MLM_GROUP_COMPANY_LIMITED/.campain/'+name_file, 'utf-8');
            campain = JSON.parse(campain);
            if(campain.status){
                startCron(name_file, data, campain.uid);
            }

        }
        return;
    }

    return;
    
}
  
  
  module.exports = { cronTiktok };