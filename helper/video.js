const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path.replace('app.asar', 'app.asar.unpacked');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

 function countVideosInDirectory(directoryPath) {
    let videoCount = 0;
  
    // Đọc danh sách các tệp trong thư mục
    const files = fs.readdirSync(directoryPath);
  
    // Lặp qua từng tệp để kiểm tra xem có phải là video không
    files.forEach(file => {
      const filePath = path.join(directoryPath, file);
  
      // Kiểm tra xem có phải là thư mục hay không
      const isDirectory = fs.statSync(filePath).isDirectory();
      if (isDirectory) {
        // Nếu là thư mục, đệ quy để kiểm tra thư mục con
        videoCount += countVideosInDirectory(filePath);
      } else {
        // Kiểm tra xem có phải là video không (ở đây chúng ta giả định các video có định dạng phổ biến như mp4, mkv, ...)
        const mimeType = mime.lookup(filePath);
        if (mimeType && mimeType.startsWith('video/')) {
          videoCount++;
        }
      }
    });
  
    return videoCount;
  }

  function countAudiosInDirectory(directoryPath) {
    let audioCount = 0;
  
    // Đọc danh sách các tệp trong thư mục
    const files = fs.readdirSync(directoryPath);
  
    // Lặp qua từng tệp để kiểm tra xem có phải là video không
    files.forEach(file => {
      const filePath = path.join(directoryPath, file);
  
      // Kiểm tra xem có phải là thư mục hay không
      const isDirectory = fs.statSync(filePath).isDirectory();
  
      if (isDirectory) {
        // Nếu là thư mục, đệ quy để kiểm tra thư mục con
        audioCount += countVideosInDirectory(filePath);
      } else {
        // Kiểm tra xem có phải là video không (ở đây chúng ta giả định các video có định dạng phổ biến như mp4, mkv, ...)
        const mimeType = mime.lookup(filePath);
        if (mimeType && mimeType.startsWith('audio/')) {
          audioCount++;
        }
      }
    });
  
    return audioCount;
  }

  function arrVideosInDirectory(directoryPath) {
    let videos = [];
  
    // Đọc danh sách các tệp trong thư mục
    const files = fs.readdirSync(directoryPath);
  
    // Lặp qua từng tệp để kiểm tra xem có phải là video không
    files.forEach(file => {
      const filePath = path.join(directoryPath, file);
  
      // Kiểm tra xem có phải là thư mục hay không
      const isDirectory = fs.statSync(filePath).isDirectory();
  
      if (isDirectory) {
        // Nếu là thư mục, đệ quy để kiểm tra thư mục con
        videos.push(countVideosInDirectory(filePath));
      } else {
        // Kiểm tra xem có phải là video không (ở đây chúng ta giả định các video có định dạng phổ biến như mp4, mkv, ...)
        const mimeType = mime.lookup(filePath);
        if (mimeType && mimeType.startsWith('video/')) {
          videos.push(filePath);
        }
      }
    });
  
    return videos;
  }

  function arrAudiosInDirectory(directoryPath) {
    let audios = [];
  
    // Đọc danh sách các tệp trong thư mục
    const files = fs.readdirSync(directoryPath);
  
    // Lặp qua từng tệp để kiểm tra xem có phải là video không
    files.forEach(file => {
      const filePath = path.join(directoryPath, file);
  
      // Kiểm tra xem có phải là thư mục hay không
      const isDirectory = fs.statSync(filePath).isDirectory();
  
      if (isDirectory) {
        // Nếu là thư mục, đệ quy để kiểm tra thư mục con
        audios.push(countVideosInDirectory(filePath));
      } else {
        // Kiểm tra xem có phải là video không (ở đây chúng ta giả định các video có định dạng phổ biến như mp4, mkv, ...)
        const mimeType = mime.lookup(filePath);
        if (mimeType && mimeType.startsWith('audio/')) {
          audios.push(filePath);
        }
      }
    });
  
    return audios;
  }

  async function getVideoDuration(videoPath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
          reject('Lỗi khi kiểm tra thời lượng video: ' + err);
        } else {
          const durationInSeconds = metadata.format.duration;
          resolve(durationInSeconds);
        }
      });
    });
  }

  module.exports = { countVideosInDirectory, arrVideosInDirectory, arrAudiosInDirectory, countAudiosInDirectory, getVideoDuration};