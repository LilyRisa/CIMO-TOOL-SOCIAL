// const fs = require('fs').promises; 
const { app} = require('electron');
const schedule = require('node-schedule');
const {uploadVideoYT} = require('./helper/youtube')
const {getCronProgress} = require('./helper/cron')
const {getCronYT, getRandomElement, getRandomText, checkFileExistence, createFile} = require('./helper/ultils')
const {arrVideosInDirectory} = require('./helper/video');
const { log } = require('console');
const fs = require('fs').promises;
const {scheduledJobs} = require('node-schedule');
const path = require('path');


function startCron(file, data, campain){
    
    // console.log('campain',campain);
    // console.log('data',data);

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
            if((campain.video.length + campain.video_fail.length) == arr_video.length) { // nếu video trong thư mục = video đã thực thi thì kết thúc
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

        let check;

        let {status} = await uploadVideoYT(path_video, JSON.parse(data.cookie),desc, title, obj_proxy, data.page_link);
        check = status;
        
        console.log(check);
        if(check){
            campain.video.push(path_video);
            if(campain.video_fail.includes(path_video)){
                let index = campain.video_fail.indexOf(path_video);
                campain.video_fail.splice(index, 1);
            }
            let save_progress = JSON.stringify(campain);
            await fs.writeFile(file, save_progress, 'utf-8');
            return;
        }
        console.log(campain);

        if(!campain.video_fail.includes(path_video)){
            campain.video_fail.push(path_video);
            let save_progress = JSON.stringify(campain);
            await fs.writeFile(file, save_progress, 'utf-8');
        }
        return;
    });
    // console.log('cron:'+ getCronProgress());
}

async function cronyt() {

    let arr_file = await getCronYT();

    let data = '';
    

    if(arr_file){
        for(let file of arr_file){

            data = await fs.readFile(file, 'utf-8');
            data = JSON.parse(data);
            console.log(data.crontab);

            let name_file = path.basename(file);

            let campain_file = await checkFileExistence(app.getPath('userData') + '/MLM_GROUP/.campain/'+name_file);
            let campain = {};

            if(!campain_file){ // check nếu không có file thì tạo và khởi tạo dữ liệu ban đầu
                campain.status = true;
                campain.video = [];
                campain.video_fail = [];
                campain.uid = 'cron_'+Date.now().toString();
                await createFile(app.getPath('userData') + '/MLM_GROUP/.campain/'+name_file, JSON.stringify(campain)) ;

                startCron(name_file, data, campain.uid);
                // await fs.writeFile(app.getPath('userData') + '/MLM_GROUP/.campain/'+name_file, campain, 'utf-8');

            }

            campain = await fs.readFile(app.getPath('userData') + '/MLM_GROUP/.campain/'+name_file, 'utf-8');
            campain = JSON.parse(campain);
            if(campain.status){
                startCron(app.getPath('userData') + '/MLM_GROUP/.campain/'+name_file, data, campain, 'fb');
            }

        }
        return;
    }

    return;
    
}
  
  
  module.exports = { cronyt};