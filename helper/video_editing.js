const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const util = require('util');
const path = require('path');
var process = require('process');
const fs = require('fs').promises;
const fss = require('fs');
const unlinkPromise = util.promisify(fss.unlink);
const {getCronTikTok, getRandomElement, getRandomText, checkFileExistence, createFile} = require('./ultils');
const { app} = require('electron');

// const ffmpegPath = path.resolve(process.resourcesPath, "app.asar.unpacked/ffmpeg");

const {arrVideosInDirectory, arrAudiosInDirectory, countVideosInDirectory} = require('./video');
const { log } = require("console");

ffmpeg.setFfmpegPath(ffmpegPath);

async function check_file_edited(path){
    let save_file = await checkFileExistence(app.getPath('userData') + '/MLM_GROUP/video_edit.json');

    if(!save_file){ // check nếu không có file thì tạo và khởi tạo dữ liệu ban đầu
        let lsfile = []
        await createFile(app.getPath('userData') + '/MLM_GROUP/video_edit.json', JSON.stringify(lsfile)) ;
        return false;
    }
    save_file = await fs.readFile(app.getPath('userData') + '/MLM_GROUP/video_edit.json', 'utf-8');
    save_file = JSON.parse(save_file);
    if (save_file.includes(path)) return true;
    return false;
}

async function get_item_random_unique(path, func){

    let arr = func(path);
    let randomIndex;
    let item = null;

    while(true){
        randomIndex = Math.floor(Math.random() * arr.length);
        let status = await check_file_edited(arr[randomIndex])
        if(!status){
            item = arr[randomIndex];
            break;
        }
    }
    return item;
}

function get_name_file(path){
    path = path.split('/', path);
    path = path[path.length -1];
    return path;
}


async function processVideo(inputVideo, outputVideo, options = {}) {
    return new Promise((resolve, reject) => {
        try {
            let command = ffmpeg(inputVideo);

            // Kiểm tra và áp dụng tính năng lật ngược video
            if (options.flip) {
                command = command.videoFilters('hflip');
            }

            // Kiểm tra và áp dụng tính năng tắt tiếng
            if (options.mute) {
                command = command.noAudio();
            }

            

            if (options.changeCodec) {
                command = command.videoCodec('libx264');
            } else {
                command = command.videoCodec('copy');
            }

            if(options.audio != null){
                command = command.input(options.audio)
            }

            // Thực hiện ghép nhạc vào video
            command = command.audioCodec('aac')
                .on('end', () => {
                    console.log('Processing completed successfully');

                    // Xóa các tệp tạm
                    if (options.flip) {
                        fss.unlinkSync('temp_flipped.mp4');
                    }
                    if (options.mute) {
                        fss.unlinkSync('temp_muted.mp4');
                    }

                    console.log('Temporary files deleted');
                    resolve(true);
                })
                .on('error', (err) => reject(err))
                .save(outputVideo);
        } catch (error) {
            reject(error);
        }
    });
}


async function editVideoProcess(inputVideo, inputAudio, pathExecute, flip, mute) {
    try {
        const filename = path.basename(inputVideo);
        const outputVideo = path.join(pathExecute, filename);

        const flipFilter = 'hflip';

        // Turn off the original video sound and export a temporary video
        const tmpVideo = path.join(pathExecute, `${path.basename(inputVideo)}_tmp_video.mp4`);

        let arr_cmd = [];

        if(flip){
            arr_cmd.push(`-vf ${flipFilter}`);
        }
        if(mute){
            arr_cmd.push('-an');
        }
        
        console.log(inputAudio);
        console.log(inputVideo);

        let ffm_tem = ffmpeg();
        await new Promise((resolve, reject) => {
            ffmpeg()
                .input(inputVideo)
                .outputOptions(arr_cmd)
                .videoCodec('libx264')
                .on('end', resolve)
                .on('error', reject)
                .save(tmpVideo);
        });

        if(inputAudio != null){
            // Insert audio into the temporary video
            await new Promise((resolve, reject) => {
                ffmpeg()
                    .input(tmpVideo)
                    .audioCodec('aac')
                    .input(inputAudio)
                    .audioCodec('aac')
                    .outputOptions(['-c:v copy', '-map 0:v:0', '-map 1:a:0', '-shortest',])
                    .audioChannels(1)
                    .audioFrequency(44100)
                    .on('end', resolve)
                    .on('error', reject)
                    .save(outputVideo);
            });
        }else{
            await new Promise((resolve, reject) => {
                ffmpeg()
                    .input(tmpVideo)
                    .videoCodec('copy')
                    .audioChannels(1)
                    .audioFrequency(44100)
                    .on('end', resolve)
                    .on('error', reject)
                    .save(outputVideo);
            });
        }

        // Display the results
        console.log('Conversion finished successfully.');
        // Delete the temporary video
        await unlinkPromise(tmpVideo);
        return true;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return false;
    }
}



async function videoEdit(args, func){


    let count_video = countVideosInDirectory(args.path_video);

    for(let i=0 ; i < count_video; i++){

        let path_video = await get_item_random_unique(args.path_video, arrVideosInDirectory );
        if(path_video == null) continue;
        let path_audio = null;
        if(args.audio != null){
            path_audio = await arrAudiosInDirectory(args.audio);
            randomIndex = Math.floor(Math.random() * path_audio.length);
            path_audio = path_audio[randomIndex];
        }
    
        let save_file = await fs.readFile(app.getPath('userData') + '/MLM_GROUP/video_edit.json', 'utf-8');
        save_file = JSON.parse(save_file);
    
        console.log(app.getPath('userData') + '/MLM_GROUP/video_edit.json');
    
        let status = await editVideoProcess(path_video, path_audio, args.save_video, args.flip, args.mute);
        if(status) save_file.push(path_video);
        save_file = JSON.stringify(save_file);
        await fs.writeFile(app.getPath('userData') + '/MLM_GROUP/video_edit.json', save_file, 'utf-8');

        let phantram = (i+1)/count_video;
        phantram = Math.round(phantram * 100) / 100;
        console.log(phantram);

        func(path.basename(path_video), phantram, (i+1));
    }
    // let path_video = await get_item_random_unique(args.path_video, arrVideosInDirectory );
    await fs.writeFile(app.getPath('userData') + '/MLM_GROUP/video_edit.json', '[]', 'utf-8');
    return true;

    
}

module.exports = {videoEdit}