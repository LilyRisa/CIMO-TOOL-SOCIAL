// const fs = require('fs').promises; 
const { app} = require('electron');
const schedule = require('node-schedule');
const {uploadVideo} = require('./helper/tiktok')
const {getCronProgress} = require('./helper/cron')
const {getCronTikTok, getRandomElement, getRandomText, checkFileExistence, createFile} = require('./helper/ultils')
const {arrVideosInDirectory} = require('./helper/video');
const { log } = require('console');
const fs = require('fs').promises;
const {scheduledJobs} = require('node-schedule');


function startCron(file, data, campain){
    
    console.log(campain);

    if(!campain.status){
        return;
    }

    if(typeof campain.phinish !== 'undefined'){
        if(campain.phinish == true) return;   
    }

    if(typeof scheduledJobs[campain.uid] != 'undefined'){
       return;
    }
    console.log('start cron...');
    
    let task = schedule.scheduleJob(campain.uid,data.crontab, async () => {

        let desc = getRandomText(data.desc);
        let arr_video = arrVideosInDirectory(data.folder_video);
        let path_video = '';
        

        while(true){  // kiểm tra xem video trong folder lấy ra có trùng với video đã thực thi ở campain
            if(campain.video.length == arr_video.length) { // nếu video trong thư mục = video đã thực thi thì kết thúc
                campain.phinish = true;
                let save_progress = JSON.stringify(campain);
                await fs.writeFile(file, save_progress, 'utf-8');
                scheduledJobs[campain.uid].cancel();
                return;
            }
            path_video = getRandomElement(arr_video);
            if(!campain.video.includes(path_video)){
                break;
            }
        }
        let obj_proxy = {};
        if(data.proxy){
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
        let check = await uploadVideo(path_video, JSON.parse(data.cookie),desc, obj_proxy);

        if(check){
            campain.video.push(path_video);
            let save_progress = JSON.stringify(campain);
            await fs.writeFile(file, save_progress, 'utf-8');
            return;
        }
        return;
    });
    // console.log('cron:'+ getCronProgress());
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

            if(!campain_file){ // check nếu không có file thì tạo và khởi tạo dữ liệu ban đầu
                campain.status = true;
                campain.video = [];
                campain.uid = 'cron_'+Date.now().toString();
                await createFile(app.getPath('userData') + '/MLM_GROUP_COMPANY_LIMITED/.campain/'+name_file, JSON.stringify(campain)) ;

                startCron(name_file, data, campain.uid);
                // await fs.writeFile(app.getPath('userData') + '/MLM_GROUP_COMPANY_LIMITED/.campain/'+name_file, campain, 'utf-8');

            }

            campain = await fs.readFile(app.getPath('userData') + '/MLM_GROUP_COMPANY_LIMITED/.campain/'+name_file, 'utf-8');
            campain = JSON.parse(campain);
            if(campain.status){
                startCron(app.getPath('userData') + '/MLM_GROUP_COMPANY_LIMITED/.campain/'+name_file, data, campain);
            }

        }
        return;
    }

    return;
    
}
  
  
  module.exports = { cronTiktok };